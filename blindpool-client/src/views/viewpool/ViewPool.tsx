import React, {useState} from "react";
import {
    Card, CardActions,
    CardContent, CircularProgress,
    Grid, Icon, IconButton,
    makeStyles,
    Table, TableBody,
    TableCell,
    TableHead,
    TableRow, TextField,
    Typography
} from "@material-ui/core";
import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import appState from "../../state/AppState";

const useStyles = makeStyles({
    root: {
        flexShrink: 0,
        textAlign: 'center',
        marginTop: '1em',

    },
    header: {
        marginTop: '1em',
    },
    card: {
        minWidth: "20em",
        maxWidth: "20em"
    },
    table: {
        width: '100%',
        // marginTop: theme.spacing(2),
        overflowX: 'auto',
    },
    columnheader: {
        fontWeight: 700,
        // fontSize: 15,
        // flexGrow: 1
    },
    namecolumn: {
        flexGrow: 1
    },
    shareUrlInput: {
        marginTop: '0.45em',
        marginLeft: '1em',
        width: '100%',
    },
    copyButton: {
        marginTop: '0em',
        marginLeft: '0em',
        marginRight: '0.3em'
    },
    progress: {
        margin: '8em',
    },
});

const copyFieldId = "copyTextField";

const ViewPool: React.FC = () => {
    let { key } = useParams();
    const classes = useStyles();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);

    const getHost = () => {
        let host = window.location.protocol + "//" + window.location.hostname;

        if (window.location.hostname === 'localhost') {
            host += ":8080"
        }
        return host;
    };

    const [shareUrl, setShareUrl] = useState("");
    if (loading) {
        if (appState.poolData === undefined || appState.poolData!.key !== key) {
            fetch(`${getHost()}/api/v2/pool/${key}`)
                .then(function (poolJsonFromServer) {
                    return poolJsonFromServer.json();
                })
                .then((poolJson) => {
                    appState.setPool(poolJson);
                    setLoading(false);
                    setShareUrl(`${window.location.protocol}//${window.location.host}/pool/${appState.poolData!.key}`);
                });
        } else {
            setLoading(false);
            setShareUrl(`${window.location.protocol}//${window.location.host}/pool/${appState.poolData!.key}`);
        }
    }

    const getOwner = () => {
        let participantsAndScores = appState.poolData!.PARTICIPANTS_AND_SCORES;
        return participantsAndScores[0].participant.name;
    };

    const copy = () => {
        let dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.setAttribute('value', shareUrl as unknown as string);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    };

    const renderTableData = () => {
        return appState.poolData!.PARTICIPANTS_AND_SCORES.map((participantAndScore, index) => {
            const participantName = participantAndScore.participant.name;
            const score = participantAndScore.score.homeClubScore + " - " + participantAndScore.score.awayClubScore;
            return (
                <TableRow key={participantName}>
                    <TableCell>
                        <Typography>{participantName}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{score}</Typography>
                    </TableCell>
                </TableRow>
            )
        });
    };

    const handleTextFieldFocus = (event: React.MouseEvent<HTMLElement>) => {
        const copyTextBox = event.target as HTMLInputElement;
        copyTextBox.select();
    };

    if (loading) {
        return <CircularProgress className={classes.progress}/>
    } else {
        return (
            <Grid container justify="center" spacing={2} className={classes.root}
                  style={{marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"}}>
                <Grid key="definition" item>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h2">
                                {t("POOL_MADE_BY", {organizer: getOwner()})}
                            </Typography>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        {/*<TableCell>&nbsp;</TableCell>*/}
                                        <TableCell className={classes.namecolumn}>
                                            <Typography className={classes.columnheader}>
                                                {t("NAME_COLUMN_HEADER")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography className={classes.columnheader}>
                                                {t("NAME_COLUMN_SCORE")}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {renderTableData()}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardActions>
                            <TextField
                                // disabled
                                id={copyFieldId}
                                label="Share this pool&nbsp;"
                                className={classes.shareUrlInput}
                                value={shareUrl}
                                margin="normal"
                                variant="outlined"
                                onClick={(event: React.MouseEvent<HTMLElement>) => handleTextFieldFocus(event)}
                            />
                            <IconButton className={classes.copyButton} color="inherit"
                                        aria-label="Copy" aria-haspopup="true" onClick={copy}>
                                <Icon>content_copy</Icon>
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        );
    }
};

export default ViewPool;