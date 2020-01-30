import React, {ChangeEvent, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid, Icon, IconButton,
    makeStyles,
    Table, TableBody,
    TableCell,
    TableHead, TableRow, TextField,
    Typography
} from "@material-ui/core";
import Helmet from "react-helmet";
import appState from "../../state/AppState";
import Blindpool from "../../model/Blindpool";

const useStyles = makeStyles({
    root: {
        flexShrink: 0,
        textAlign: 'center',
        marginTop: '1em',
    },
    button: {
        color: 'white',
        backgroundColor: '#00cc47',
        '&:hover': {
            backgroundColor: '#00cc47',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#73e39a',
        },
        border: 0,
        // borderRadius: 3,
        fontWeight: 'bolder',
        fontSize: 15
    },
    card: {
        minWidth: "20em",
        maxWidth: "20em"
    },
    table: {
        width: '100%',
        overflowX: 'auto',
        marginBottom: '1em'
    },
    numberColumn: {
        verticalAlign: 'text-top',
        padding: '0em',
        paddingTop: '1.7em',
        margin: '0em'
    },
    buttonColumn: {
        verticalAlign: 'text-top',
        padding: '0.3em',
        paddingTop: '0em',
        //paddingRight: '0em'
    },
    columnname: {
        fontWeight: 700,
        fontSize: 15,
        flexGrow: 1,
    },
    progress: {
        margin: '8em',
    },
    icon: {
        color: 'black',
    },
    nameHeader: {
        // margin: '0px',
        paddingTop: '2em',
        paddingLeft: '1em',
        paddingBottom: '1em'
    },
    nameInputField: {
        paddingTop: '0em',
        marginTop: '0em',
        marginBottom: '0em',
        width: '100%'
    },
    nameFields: {
        paddingLeft: '1em',
        paddingRight: '0em'
    },
    addButton: {
        margin: '0.5em',
        // backgroundColor: 'black'
    },
    addIcon: {
        margin: '0.5em',
        color: 'black'
    },
    disabledNumber: {
        color: 'gray'
    }
});

const getHost = () => {
    let host = window.location.protocol + "//" + window.location.hostname;

    if (window.location.hostname === 'localhost') {
        host += ":8080"
    }
    return host;
};

interface Player {
    name: string,
    valid?: string | undefined
}

const EMPTY_STRING = "";

// Create a unique instance of the same empty object.
const EMPTY_PLAYER = () => {
    return Object.assign({}, {name: EMPTY_STRING, valid: undefined});
};

const CreatePool: React.FC = () => {
    const classes = useStyles();
    const {t} = useTranslation();
    let history = useHistory();
    const [justAddedPlayer, setJustAddedPlayer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [players, setPlayers] = useState<Player[]>([
        EMPTY_PLAYER(),
        EMPTY_PLAYER(),
        EMPTY_PLAYER(),
        EMPTY_PLAYER(),
        EMPTY_PLAYER()
    ]);

    useEffect(() => {
        if (justAddedPlayer) {
            document.getElementById(`nameField${players.length - 1}`)!.focus();
            setJustAddedPlayer(false);
        }
    }, [players, justAddedPlayer]);

    const renderInputFields = () => {
        return players.map((player, index) => {
            let first = index <= 0;
            let invalidMessage = players[index].valid;
            return (
                <TableRow key={index}>
                    <TableCell className={classes.numberColumn}>
                        <Typography className={classes.columnname}>
                            {index + 1}
                        </Typography>
                    </TableCell>
                    <TableCell className={classes.nameFields}>
                        <TextField
                            error={invalidMessage !== undefined}
                            helperText={invalidMessage !== undefined ? t(invalidMessage) : undefined}
                            id={"nameField" + index}
                            className={classes.nameInputField}
                            margin="normal"
                            inputProps={{'aria-label': 'Player name ' + (index + 1), 'data-testid': 'nameInput' + index}}
                            onChange={(event) => onTextFieldChange(index, event)}>
                        </TextField>
                    </TableCell>
                    <TableCell align="right" className={classes.buttonColumn}>
                        <IconButton tabIndex={-1} aria-label={t("REMOVE_PLAYER_X", {name: player.name})}
                                    className={classes.icon} disabled={first}
                                    onClick={() => removePlayer(index)}>
                            <Icon fontSize="default">
                                {!first ? "remove_circle_outline" : "person"}
                            </Icon>
                        </IconButton>
                    </TableCell>
                </TableRow>
            );
        });
    };

    const onTextFieldChange = (index: number, event: ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => {
        const nameField = event.target;

        const playersUpdate = [...players];
        if (nameField.value) {
            playersUpdate[index].name = nameField.value.trim();
        } else {
            playersUpdate[index].name = "";
            playersUpdate[index].valid = undefined;
        }
        validateState(playersUpdate);
    };

    const validateState = (playersToValidate: Array<Player>, complainAboutEmptyFields?: boolean): boolean => {
        let allPlayersHaveAValidName = true;
        playersToValidate.forEach((player) => {
            const lettersAndNumbersOnly = /^([a-zA-Z0-9 _]+)$/;
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

        return allPlayersHaveAValidName;
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
        let first = index <= 0;
        if (!first) {
            const playersUpdate = [...players];
            playersUpdate.splice(index, 1);
            validateState(playersUpdate);

            // Update names
            setPlayers(players.map((player, index) => {
                const playerInputField = document.getElementById("nameField" + index) as unknown as HTMLInputElement;
                playerInputField.value = player.name;
                return player;
            }));
        }
    };

    const sendCreatePoolRequest = () => {
        const validatedPlayers = validateState([...players],true);
        if (validatedPlayers) {
            let navigateToCreatePool = (poolJson: Blindpool) => {
                appState.setPool(poolJson);
                setLoading(false);
                history.push(`/pool/${poolJson.key}`);
            };

            setLoading(true);

            fetch(`${getHost()}/api/v1/pool`,
                {
                    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                    method: "POST", body: JSON.stringify(players.map(player => player.name))
                })
                .then(function (response) {
                    // return response.text();
                    return response.json();
                })
                .then(navigateToCreatePool);
            // Add try catch.
        }
    };

    if (loading) {
        return <CircularProgress className={classes.progress}/>
    } else {
        return (
            <Grid container justify="center" spacing={2} className={classes.root}
                  style={{marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"}}>
                <Helmet>
                    <title>{t('TITLE')} - {t('CREATE_POOL_TITLE')}</title>
                    <meta name="description" content={t('CREATE_POOL_DESCRIPTION')}/>
                    <meta property="og:title" content={t('TITLE') + " - " + t('CREATE_POOL_TITLE')}/>
                    <meta property="og:description" content={t('CREATE_POOL_DESCRIPTION')}/>
                </Helmet>
                <Grid key="definition" item>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h2">
                                {t("CREATE_POOL")}
                            </Typography>
                            {/*border={1}*/}
                            <Table className={classes.table}>
                                <colgroup>
                                    {/* Seems like a super stupid solution, but it works.*/}
                                    <col style={{width: '5%'}}/>
                                    <col style={{width: '85%'}}/>
                                    <col style={{width: '10%'}}/>
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.numberColumn}
                                                   align="left">&nbsp;</TableCell>
                                        <TableCell className={classes.nameHeader} align="left">
                                            <Typography className={classes.columnname}>
                                                {t("NAME_COLUMN_HEADER")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            className={classes.buttonColumn}>&nbsp;</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {renderInputFields()}
                                    <TableRow>
                                        <TableCell className={classes.numberColumn}>
                                            <Typography className={classes.disabledNumber}>
                                                {players.length + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell className={classes.nameFields}>
                                            <TextField
                                                id="standard-bare"
                                                className={classes.nameInputField}
                                                margin="normal"
                                                disabled={true}
                                                value={t("ADD_PLAYER")}
                                                inputProps={{'aria-label': 'Player name'}}>
                                            </TextField>
                                        </TableCell>
                                        <TableCell className={classes.buttonColumn}>
                                            <IconButton aria-label={t("ADD_PLAYER")}
                                                        className={classes.icon}
                                                        onClick={addPlayer}>
                                                <Icon fontSize="default">add_circle_outline</Icon>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Button tabIndex={-1} onClick={sendCreatePoolRequest} size="large" className={classes.button}>
                                {t("CREATE_POOL").toUpperCase()}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
};

export default CreatePool;