import React, {ChangeEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid, IconButton,
    Table, TableBody,
    TableCell,
    TableHead, TableRow, TextField,
    Typography
} from "@mui/material";
import Blindpool from "../model/Blindpool";
import Player from "../model/Player";
import {Api, getHost} from "../utils/Network";
import {doesMatchExistIn, Match} from "../model/Match";
import {AddCircleOutline} from "@mui/icons-material";
import {validate} from "class-validator";
import BpSocialMediaLinks from "../components/bpsocialmedialinks/BpSocialMediaLinks";
import {useQueryClient} from "@tanstack/react-query";
import {CreateBlindpoolRequest} from "blindpool-common/requests/CreateBpRequest";
import {poolQuery} from "../queries/PoolQuery";
import { useExistingBlindpoolOutletContext } from "../context/BpContext";
import { useUpcomingMatches } from "../queries/MatchesHook";
import BpMatchSelector from "../components/bpmatchselector/BpMatchSelector";
import NameField from "../components/bpnamefield/NameField";
import type {MetaFunction} from "@remix-run/node";
import {getLocale, getPageTitle, resources} from "~/locales/translations";

export const meta: MetaFunction = () => {
    return [
        { title: `${getPageTitle(resources[getLocale()].translation.CREATE_POOL_TITLE)}` },
        { name: "description", content: resources[getLocale()].translation.CREATE_POOL_DESCRIPTION },
        { tagName: "link", rel: "canonical", href: window.location.hostname.endsWith('blindepool.nl') ? "https://blindepool.nl/create" : "https://www.blindpool.com/create" }
    ];
};

const EMPTY_STRING = "";

// Create a unique instance of the same empty object.
const EMPTY_PLAYER = () => {
    return Object.assign({}, {name: EMPTY_STRING, valid: undefined});
};

// TODO: Clientloader

export default function CreatePool() {
    const {competitionsToWatch, setMessage, selectedMatchId, setSelectedMatchId} = useExistingBlindpoolOutletContext();
    const {t} = useTranslation();
    const matches: Array<Match> = useUpcomingMatches(competitionsToWatch, setMessage) ?? [];
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const [justAddedPlayer, setJustAddedPlayer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [players, setPlayers] = useState<Player[]>([
        EMPTY_PLAYER(),
        EMPTY_PLAYER(),
        EMPTY_PLAYER(),
        EMPTY_PLAYER(),
        EMPTY_PLAYER()
    ]);
    const [invalidMatchMessage, setInvalidMatchMessage] = React.useState<string | undefined>(undefined);

    useEffect(() => {
        if (justAddedPlayer) {
            document.getElementById(`nameField${players.length - 1}`)!.focus();
            setJustAddedPlayer(false);
        }
    }, [players, justAddedPlayer]);

    const onTextFieldChange = (index: number, event: ChangeEvent<HTMLTextAreaElement|HTMLInputElement>, isBlur: boolean) => {
        const nameField = event.target;

        const playersUpdate = [...players];
        if (nameField.value) {
            if (isBlur) {
                playersUpdate[index].name = nameField.value.trim();
            } else {
                playersUpdate[index].name = nameField.value;
            }
        } else {
            playersUpdate[index].name = "";
            playersUpdate[index].valid = undefined;
        }
        validateState(playersUpdate, false);
    };

    const validateState = (playersToValidate: Array<Player>, complainAboutEmptyFields: boolean): boolean => {
        const matchIsValid: boolean = true;

        let allPlayersHaveAValidName: boolean = true;
        playersToValidate.forEach((player) => {
            const lettersAndNumbersOnly = /^([a-zA-Z0-9 _]{1,20})$/;
            if (player.name) {
                if (!lettersAndNumbersOnly.test(player.name)) {
                    allPlayersHaveAValidName = false;
                    player.valid = "ILLEGAL_CHARACTER_MESSAGE";
                } else {
                    if (checkForDuplicates(player.name)) {
                        player.valid = "DUPLICATE_MESSAGE";
                        allPlayersHaveAValidName = false;
                    } else {
                        player.valid = undefined;
                    }
                }
            } else {
                if (complainAboutEmptyFields) {
                    player.valid = "EMPTY_MESSAGE";
                } else {
                    player.valid = undefined;
                }
                allPlayersHaveAValidName = false;
            }
        });

        setPlayers([...playersToValidate]);

        return allPlayersHaveAValidName && matchIsValid;
    };

    const checkForDuplicates = (name: string) => {
        const duplicate = players.filter(player => player.name === name);
        return duplicate.length > 1;
    };

    const addPlayer = () => {
        setPlayers([...players, EMPTY_PLAYER()]);
        setJustAddedPlayer(true);
    };

    const removePlayer = (index: number) => {
        const first = index <= 0;
        if (!first) {
            const playersUpdate = [...players];
            playersUpdate.splice(index, 1);

            // Update names
            setPlayers(playersUpdate.map((player, index) => {
                const playerInputField = document.getElementById("nameField" + index) as unknown as HTMLInputElement;
                playerInputField.value = player.name;
                return player;
            }));
        }
    };

    const sendCreatePoolRequest = async () => {
        if (validateState([...players], true)) {
            setLoading(true);
            const requestBody = {
                participants: players.map(player => player.name)
            } as CreateBlindpoolRequest;
            const validationErrors = await validate(requestBody);
            if (validationErrors.length > 0) {
                setLoading(false);
                setMessage("ILLEGAL_CHARACTER_MESSAGE");
            }
            try {
                if (selectedMatchId) {
                    const matchId = doesMatchExistIn(selectedMatchId, matches);
                    if (matchId) {
                        requestBody.selectedMatchID = matchId;
                    } else {
                        requestBody.freeFormatMatch = selectedMatchId.trim();
                    }
                }
                const response: Response = await fetch(`${getHost(Api.pool)}/api/v3/pool`,
                    {
                        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                        method: "POST", body: JSON.stringify(requestBody)
                    }
                );
                if (response.status === 200) {
                    const poolJson: Blindpool = await response.json();
                    // This will already set the pool and make sure we don't fetch the pool we already have.
                    await queryClient.ensureQueryData(poolQuery(poolJson));
                    setLoading(false);
                    navigate(`/pool/${poolJson.key}`);
                } else {
                    setLoading(false);
                    setMessage('BACKEND_OFFLINE');
                }
            } catch (error) {
                setLoading(false);
                setMessage('BACKEND_UNREACHABLE');
            }
        }
    }

    if (loading) {
        return (
            <CircularProgress sx={{margin: "8em"}} />
        );
    } else {
        return (
            <Grid container justifyContent={"center"}  spacing={2} sx={{flexShrink: 0, textAlign: "center", marginTop: "0.5em"}}>
                <Grid key="definition" item>
                    <Card className="card">
                        <CardContent>
                            <Typography variant="h2">
                                {t("CREATE_POOL")}
                            </Typography>
                            <BpMatchSelector matches={matches} invalidMatchMessage={invalidMatchMessage}
                                             setInvalidMatchMessage={(amessage) => setInvalidMatchMessage(amessage)}
                                             selectedMatchId={selectedMatchId} setSelectedMatchId={setSelectedMatchId} />
                            {/*border={1}*/}
                            <Table sx={{overflowX: "auto", marginBottom: "1em"}}>
                                <colgroup>
                                    {/* Seems like a super stupid solution, but it works.*/}
                                    <col style={{width: '5%'}}/>
                                    <col style={{width: '85%'}}/>
                                    <col style={{width: '10%'}}/>
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{verticalAlign: "text-top", padding: "0em", paddingTop: "1.7em", margin: "0"}}
                                                   align="left">&nbsp;</TableCell>
                                        <TableCell sx={{margin: "0", paddingTop: "1.5em", paddingLeft: "1em", paddingBottom: "1em"}} align="left">
                                            <Typography sx={{fontWeight: 700, fontSize: 15, flexGrow: 1}}>
                                                {t("NAME_COLUMN_HEADER")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{verticalAlign: "text-top", padding: "0.3em", paddingTop: "0em"}}>&nbsp;</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {players.map((player, index) => {
                                        return (
                                            <NameField key={index} player={player} index={index} onTextFieldChange={onTextFieldChange} removePlayer={removePlayer} />
                                        );
                                    })}
                                    <TableRow>
                                        <TableCell sx={{verticalAlign: "text-top", padding: "0", paddingTop: "1.7em", margin: 0}}>
                                            <Typography sx={{color: "gray"}}>
                                                {players.length + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{paddingLeft: "1em", paddingRight: 0}}>
                                            <TextField
                                                id="standard-basic"
                                                variant="standard"
                                                sx={{paddingTop: "0", marginTop: "0", marginBottom: "0", width: "100%"}}
                                                margin="normal"
                                                disabled={true}
                                                value={t("ADD_PLAYER")}
                                                data-testid='playerNameField'
                                                inputProps={{'aria-label': 'Player name'}}>
                                            </TextField>
                                        </TableCell>
                                        <TableCell sx={{verticalAlign: "text-top", padding: "0.3em", paddingTop: "0"}}>
                                            <IconButton aria-label={t("ADD_PLAYER") + ""}
                                                        sx={{color: "black"}}
                                                        onClick={addPlayer}>
                                                <AddCircleOutline/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Button tabIndex={-1} onClick={sendCreatePoolRequest} size="large" data-testid="createPoolButton"
                                sx={{color: "white", backgroundColor: "#00cc47", border: "0", fontWeight: "bolder", fontSize: 15}}>
                                {t("CREATE_POOL").toUpperCase()}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <BpSocialMediaLinks/>
            </Grid>
        );
    }
}
