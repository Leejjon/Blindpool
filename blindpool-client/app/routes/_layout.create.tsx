import React, {type ChangeEvent, useEffect, useState} from "react";
import {Form, redirect, useActionData, useNavigation} from "react-router";
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
import {type Participant} from "blindpool-common/requests/model/Participant";
import {Api, getHost} from "~/utils/Network";
import {type Match} from "~/model/Match";
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
    CREATE_BP_REQUEST_SCHEMA_VERSION,
    CreateBlindpoolRequestSchema, type CreateBlindpoolRequestSchemaType,
} from "blindpool-common/requests/validation/CreateBpRequest";
import {validateParticipants} from "blindpool-common/requests/validation/validation";

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
const EMPTY_PARTICIPANT = () => {
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

    // https://github.com/colinhacks/zod/issues/3333
    const participants = formData.getAll("participants[]").map(String);
    const freeFormatMatch = formData.get("freeFormatMatch");
    const selectedMatchID = formData.get("selectedMatchID");
    let formDataObject = {
        participants,
        selectedMatchID: selectedMatchID,
        freeFormatMatch: freeFormatMatch && freeFormatMatch.toString().length > 0 ? freeFormatMatch.toString() : undefined
    } as CreateBlindpoolRequestSchemaType;

    const result = CreateBlindpoolRequestSchema.safeParse(formDataObject);
    if (result.success) {
        const response: Response = await fetch(`${getHost(Api.pool)}/api/v4/pool`,
            {
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                method: "POST", body: JSON.stringify(formDataObject),
            }
        );
        if (response.status === 200) {
            const poolJson: Blindpool = await response.json();
            return redirect(`/pool/${poolJson.key}`);
        } else if (response.status === 400) {
            console.warn("Apparently the errors were different compared to the local validation. Your client was most likely out of sync.")
            const errors: {participantValidations: Array<Participant>} = await response.json();
            return errors;
        }

        // TODO: See if we can keep it as smooth as:
        // const poolJson: Blindpool = await response.json();
        // // This will already set the pool and make sure we don't fetch the pool we already have.
        // await queryClient.ensureQueryData(poolQuery(poolJson));
        // setLoading(false);
        // navigate(`/pool/${poolJson.key}`);
    } else {
        return {
            participantValidations: validateParticipants(result, participants, false),
        };
    }
}

// DO THIS https://tanstack.com/query/latest/docs/framework/react/guides/ssr#get-started-fast-with-initialdata

export default function CreatePool() {
    const actionData = useActionData<typeof clientAction>();
    const [participants, setParticipants] = useState<Participant[]>([
        EMPTY_PARTICIPANT(),
        EMPTY_PARTICIPANT(),
        EMPTY_PARTICIPANT(),
        EMPTY_PARTICIPANT(),
        EMPTY_PARTICIPANT()
    ]);

    const [errorsFromAction, setErrorsFromAction] = useState<boolean>(false);

    const validations = actionData?.participantValidations;
    const playersObjects = validations && validations.length > 0 && errorsFromAction ? validations : participants;

    useEffect(() => {
        if (actionData) {
            setErrorsFromAction(true);
        }
    }, [actionData]);

    const {competitionsToWatch, setMessage, selectedMatchId, setSelectedMatchId} = useExistingBlindpoolOutletContext();

    const {t} = useTranslation();
    const matches: Array<Match> = useUpcomingMatches(competitionsToWatch, setMessage) ?? [];

    const navigation = useNavigation();
    const [justAddedPlayer, setJustAddedPlayer] = useState(false);
    const [invalidMatchMessage, setInvalidMatchMessage] = React.useState<string | undefined>(undefined);

    useEffect(() => {
        if (justAddedPlayer) {
            document.getElementById(`nameField${participants.length - 1}`)!.focus();
            setJustAddedPlayer(false);
        }
    }, [participants, justAddedPlayer]);

    const onTextFieldChange = (index: number, event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, isBlur: boolean) => {
        setErrorsFromAction(false);
        const nameField = event.target;

        const participantsUpdate = [...participants];
        if (nameField.value) {
            if (isBlur) {
                participantsUpdate[index].name = nameField.value.trim();
            } else {
                participantsUpdate[index].name = nameField.value;
            }
        } else {
            participantsUpdate[index].name = "";
            participantsUpdate[index].valid = undefined;
        }

        const participantsAsStringArray = participantsUpdate.map((participant) => participant.name)
        let formDataObject = {
            participants: participantsAsStringArray,
            selectedMatchID: "boe",// TODO,
            freeFormatMatch: "undefined"// TODO freeFormatMatch && freeFormatMatch.toString().length > 0 ? freeFormatMatch.toString() : undefined
        } as CreateBlindpoolRequestSchemaType;

        const result = CreateBlindpoolRequestSchema.safeParse(formDataObject);
        setParticipants([...validateParticipants(result, participantsAsStringArray, true)]);
    };

    const addPlayer = () => {
        setParticipants([...participants, EMPTY_PARTICIPANT()]);
        setJustAddedPlayer(true);
    };

    const removePlayer = (index: number) => {
        const first = index <= 0;
        if (!first) {
            const playersUpdate = [...participants];
            playersUpdate.splice(index, 1);

            setParticipants(playersUpdate.map((player, index) => {
                const playerInputField = document.getElementById("nameField" + index) as unknown as HTMLInputElement;
                playerInputField.value = player.name;
                return player;
            }));
        }
    };

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
                            <Form method="POST" action="/create">
                                <BpMatchSelector matches={matches} invalidMatchMessage={invalidMatchMessage}
                                                 setInvalidMatchMessage={(message) => setInvalidMatchMessage(message)}
                                                 selectedMatchId={selectedMatchId}
                                                 setSelectedMatchId={setSelectedMatchId}
                                />
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
                                        {playersObjects.map((player, index) => {
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
                                                    {playersObjects.length + 1}
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
                                }}>
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
