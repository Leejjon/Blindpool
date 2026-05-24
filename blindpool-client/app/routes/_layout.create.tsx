import React, {type ChangeEvent, forwardRef, useEffect, useState} from "react";
import {Form, redirect, useActionData, useNavigation, useSearchParams} from "react-router";
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
import {type Blindpool} from "~/model/Blindpool";
import {type Player} from "~/model/Player";
import {Api, getHost} from "~/utils/Network";
import {doesMatchExistIn, type Match} from "~/model/Match";
import {AddCircleOutlined} from "@mui/icons-material";
import BpSocialMediaLinks from "../components/bpsocialmedialinks/BpSocialMediaLinks";
import {useExistingBlindpoolOutletContext} from "~/context/BpContext";
import {useUpcomingMatches} from "~/queries/MatchesHook";
import type {Route} from "./+types/_layout.create";
import BpMatchSelector from "../components/bpmatchselector/BpMatchSelector";
import NameField from "../components/bpnamefield/NameField";
import {getLocale, getPageTitle, resources} from "~/locales/translations";
import {queryClientSingleton} from "~/singletons/QueryClientSingleton";
import {matchesQuery} from "~/queries/MatchesQuery";
import {getCompetitionsFromLocalStorage} from "~/storage/PreferredCompetitions";
import {
    CreateBlindpoolRequestSchema,
    PARTICIPANT_REGEX
} from "blindpool-common/requests/CreateBpRequest";

export function meta({}: Route.MetaArgs) {
    return [
        {title: `${getPageTitle(resources[getLocale()].translation.CREATE_POOL_TITLE)}`},
        {name: "description", content: resources[getLocale()].translation.CREATE_POOL_DESCRIPTION},
        {
            tagName: "link",
            rel: "canonical",
            href: window.location.hostname.endsWith('blindepool.nl') ? "https://blindepool.nl/create" : "https://www.blindpool.com/create"
        }
    ];
}

const EMPTY_STRING = "";

// Create a unique instance of the same empty object.
const EMPTY_PLAYER = () => {
    return Object.assign({}, {name: EMPTY_STRING, valid: undefined});
};

export const clientLoader = async () => {
    await queryClientSingleton.prefetchQuery(
        matchesQuery(getCompetitionsFromLocalStorage())
    );
    return null;
};

export async function clientAction({request}: { request: Request }) {
    const formData = await request.formData();
    console.log('Received form data:', formData);

    const result = CreateBlindpoolRequestSchema.safeParse({
        participants: formData
            .getAll("participants")
            .map(String)
            .map((name) => name.trim())
            .filter(Boolean),

        selectedMatchID: formData.get("selectedMatchID") || undefined,
        freeFormatMatch: formData.get("freeFormatMatch") || undefined,
    });

    if (result.success) {
        const response: Response = await fetch(`${getHost(Api.pool)}/api/v4/pool`,
            {
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                method: "POST", body: JSON.stringify(request.body)
            }
        );
        const poolJson: Blindpool = await response.json();
        return redirect(`/pool/${poolJson.key}`);
    } else {
        console.log("What happens?")
        return {
            errors: result.error.flatten(),
        };
    }

    // if (response.status === 200) {
    //     const poolJson: Blindpool = await response.json();
    //     // This will already set the pool and make sure we don't fetch the pool we already have.
    //     await queryClient.ensureQueryData(poolQuery(poolJson));
    //     setLoading(false);
    //     navigate(`/pool/${poolJson.key}`);
    // } else {
    //     setLoading(false);
    //     setMessage('BACKEND_OFFLINE');
    // }
}

// DO THIS https://tanstack.com/query/latest/docs/framework/react/guides/ssr#get-started-fast-with-initialdata

export default function CreatePool() {
    const actionData = useActionData<typeof clientAction>();
    const [searchParams, setSearchParams] = useSearchParams();
    const {competitionsToWatch, setMessage} = useExistingBlindpoolOutletContext();

    const {t} = useTranslation();
    const matches: Array<Match> = useUpcomingMatches(competitionsToWatch, setMessage) ?? [];

    const navigation = useNavigation();
    const [justAddedPlayer, setJustAddedPlayer] = useState(false);
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

    const onTextFieldChange = (index: number, event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, isBlur: boolean) => {
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
            if (player.name) {
                if (!PARTICIPANT_REGEX.test(player.name)) {
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

    const selectedMatchIdQueryParam = searchParams.get("selectedMatchId");

    // const sendCreatePoolRequest = async (): Promise<void> => {
    //     if (validateState([...players], true)) {
    //         setLoading(true);
    //         const requestBody = {
    //             participants: players.map(player => player.name)
    //         } as CreateBlindpoolRequestSchemaType;
    //         const validationErrors = await validate(requestBody);
    //         if (validationErrors.length > 0) {
    //             setLoading(false);
    //             setMessage("ILLEGAL_CHARACTER_MESSAGE");
    //         }
    //
    //         try {
    //             if (selectedMatchIdQueryParam) {
    //                 const matchId = doesMatchExistIn(selectedMatchIdQueryParam, matches);
    //                 if (matchId) {
    //                     requestBody.selectedMatchID = matchId;
    //                 } else {
    //                     requestBody.freeFormatMatch = selectedMatchIdQueryParam.trim();
    //                 }
    //             }
    //             const response: Response = await fetch(`${getHost(Api.pool)}/api/v3/pool`,
    //                 {
    //                     headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    //                     method: "POST", body: JSON.stringify(requestBody)
    //                 }
    //             );
    //             if (response.status === 200) {
    //                 const poolJson: Blindpool = await response.json();
    //                 // This will already set the pool and make sure we don't fetch the pool we already have.
    //                 await queryClient.ensureQueryData(poolQuery(poolJson));
    //                 setLoading(false);
    //                 navigate(`/pool/${poolJson.key}`);
    //             } else {
    //                 setLoading(false);
    //                 setMessage('BACKEND_OFFLINE');
    //             }
    //         } catch (error) {
    //             setLoading(false);
    //             setMessage('BACKEND_UNREACHABLE');
    //         }
    //     }
    // }

    if (navigation.state === "submitting" || navigation.state === "loading") {
        return (
            <CircularProgress sx={{margin: "8em"}}/>
        );
    } else {
        return (
            <Grid container spacing={2}
                  sx={{justifyContent: 'center', flexShrink: 0, textAlign: "center", marginTop: "0.5em"}}>
                <Grid key="definition">
                    <Card className="card">
                        <CardContent>
                            <Typography variant="h2">
                                {t("CREATE_POOL")}
                            </Typography>
                            <Form method="POST" action="/create" onSubmit={async (event) => {
                                console.log(event);
                                // event.preventDefault();
                                // await sendCreatePoolRequest();
                            }}>
                                <BpMatchSelector matches={matches} invalidMatchMessage={invalidMatchMessage}
                                                 setInvalidMatchMessage={(amessage) => setInvalidMatchMessage(amessage)}
                                                 selectedMatchId={selectedMatchIdQueryParam ?? undefined}
                                                 setSelectedMatchId={(matchId: (string | undefined)) => {
                                                     if (matchId) {
                                                         setSearchParams({selectedMatchId: matchId})
                                                     }
                                                 }}/>
                                <Table sx={{overflowX: "auto", marginBottom: "1em"}}>
                                    <colgroup>
                                        <col style={{width: '5%'}}/>
                                        <col style={{width: '85%'}}/>
                                        <col style={{width: '10%'}}/>
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{
                                                verticalAlign: "text-top",
                                                padding: "0em",
                                                paddingTop: "1.7em",
                                                margin: "0"
                                            }}
                                                       align="left">&nbsp;</TableCell>
                                            <TableCell sx={{
                                                margin: "0",
                                                paddingTop: "1.5em",
                                                paddingLeft: "1em",
                                                paddingBottom: "1em"
                                            }} align="left">
                                                <Typography sx={{fontWeight: 700, fontSize: 15, flexGrow: 1}}>
                                                    {t("NAME_COLUMN_HEADER")}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                verticalAlign: "text-top",
                                                padding: "0.3em",
                                                paddingTop: "0em"
                                            }}>&nbsp;</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {players.map((player, index) => {
                                            return (
                                                <NameField key={"player" + index} player={player} index={index}
                                                           onTextFieldChange={onTextFieldChange}
                                                           removePlayer={removePlayer}/>
                                            );
                                        })}
                                        <TableRow>
                                            <TableCell sx={{
                                                verticalAlign: "text-top",
                                                padding: "0",
                                                paddingTop: "1.7em",
                                                margin: 0
                                            }}>
                                                <Typography sx={{color: "gray"}}>
                                                    {players.length + 1}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{paddingLeft: "1em", paddingRight: 0}}>
                                                <TextField
                                                    id="standard-basic"
                                                    variant="standard"
                                                    sx={{
                                                        paddingTop: "0",
                                                        marginTop: "0",
                                                        marginBottom: "0",
                                                        width: "100%"
                                                    }}
                                                    margin="normal"
                                                    disabled={true}
                                                    value={t("ADD_PLAYER")}
                                                    data-testid='playerNameField'
                                                    slotProps={{input: {'aria-label': 'Player name'}}}
                                                >
                                                </TextField>
                                            </TableCell>
                                            <TableCell
                                                sx={{verticalAlign: "text-top", padding: "0.3em", paddingTop: "0"}}>
                                                <IconButton aria-label={t("ADD_PLAYER") + ""}
                                                            sx={{color: "black"}}
                                                            onClick={addPlayer}>
                                                    <AddCircleOutlined/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Button tabIndex={-1} size="large" data-testid="createPoolButton"
                                        type="submit" sx={{
                                    color: "white",
                                    backgroundColor: "#00cc47",
                                    border: "0",
                                    fontWeight: "bolder",
                                    fontSize: 15
                                }}
                                    /*onClick={sendCreatePoolRequest}*/>
                                    {t("CREATE_POOL").toUpperCase()}
                                </Button>
                            </Form>
                        </CardContent>
                    </Card>
                </Grid>
                <BpSocialMediaLinks/>
            </Grid>
        );
    }
}
