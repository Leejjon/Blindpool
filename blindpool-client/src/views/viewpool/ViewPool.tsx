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
import {Api, getHost, getHostnameWithPortIfLocal} from "../../utils/Network";
import {Helmet} from "react-helmet";
import {Match} from "../../model/Match";
import Blindpool from "../../model/Blindpool";

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
    clubIconStyle: {
        width: '3em', height: '3em', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '0.5em'
    },
    containerForClubIcons: {
        display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', width: '100%', marginTop: '1.5em'
    },
    clubIconAndTextDiv: {
        width: '7.8em', textAlign: 'center', whiteSpace: 'nowrap'
    },
    slashIcon: {
        marginTop: '2em', marginBottom: '2em'
    },
    marginHalfEm: {
        margin: '0.5em', fontSize: 'small', fontWeight: 'bold'
    },
    justCenter: {
        textAlign: 'center'
    },
    startTimestampMargin: {
        marginTop: '0', fontSize: 'small', fontWeight: 'bold'
    },
    freeFormatMatch: {
        marginTop: '1em'
    }
});

const copyFieldId = "copyTextField";

interface KeyInParams {
    key: string
}

const ViewPool: React.FC = () => {
    let { key } = useParams<KeyInParams>();
    const classes = useStyles();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [loadingScore, setLoadingScore] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    if (loading) {
        if (appState.poolData === undefined || appState.poolData!.key !== key) {
            // TODO:  Need to add a catch mechanism.
            fetch(`${getHost(Api.pool)}/api/v2/pool/${key}`)
                .then(poolJsonFromServer => poolJsonFromServer.json())
                .then((poolJson: Blindpool) => {
                    appState.setPool(poolJson);
                    setLoading(false);
                    setShareUrl(`${window.location.protocol}//${window.location.host}/pool/${appState.poolData!.key}`);

                    if (poolJson.MATCH) {
                        setLoadingScore(true);
                        // Do logic.;
                    }
                });
        } else {
            setLoading(false);
            setShareUrl(`${window.location.protocol}//${window.location.host}/pool/${appState.poolData!.key}`);
        }
    }

    if (loadingScore) {
        // Go do stuff.
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

    const matchInfo = () => {
        if (appState.poolData!.MATCH) {
            const match = appState.poolData!.MATCH as Match;
            const homeTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${match.homeTeamID}.svg`;
            const awayTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${match.awayTeamID}.svg`;

            // TODO: Move this logic to a util folder.
            const startTimestamp: Date = new Date(match.startTimestamp);
            const minutes: string = '' + startTimestamp.getMinutes();
            const minutesToDisplay: string = minutes.padStart(2, minutes);
            const dateString: string = startTimestamp.toLocaleDateString();

            return (
                <div className={classes.justCenter}>
                    <div className={classes.containerForClubIcons}>
                        <div className={classes.clubIconAndTextDiv}>
                            <img className={classes.clubIconStyle} src={homeTeamIconUrl}
                                 alt={match.homeTeamName}/>
                            <Typography
                                className={classes.marginHalfEm}>{match.homeTeamName}</Typography>
                        </div>
                        <div className={classes.slashIcon}><Typography variant="body1">/</Typography></div>
                        <div className={classes.clubIconAndTextDiv}>
                            <img className={classes.clubIconStyle} src={awayTeamIconUrl}
                                 alt={match.awayTeamName}/>
                            <Typography
                                className={classes.marginHalfEm}>{match.awayTeamName}</Typography>
                        </div>
                    </div>
                    <Typography
                        className={classes.startTimestampMargin}>{dateString} {startTimestamp.getHours()}:{minutesToDisplay}
                    </Typography>
                </div>
            );
        } else if (appState.poolData!.FREE_FORMAT_MATCH) {
            const freeFormatMatch = appState.poolData!.FREE_FORMAT_MATCH as string;
            return <Typography className={classes.freeFormatMatch} variant="body1">{t('FREE_FORMAT_MATCH_PREFIX')}{freeFormatMatch}</Typography>
        } else {
            return undefined;
        }
    };

    if (loading) {
        return <CircularProgress className={classes.progress}/>
    } else {
        return (
            <Grid container justify="center" spacing={2} className={classes.root}
                  style={{marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"}}>
                <Helmet>
                    <title>{t('TITLE')} - {t('BLINDPOOL_VIEW_TITLE', {organizer: getOwner()})}</title>
                    <meta name="description" content={t('BLINDPOOL_VIEW_DESCRIPTION', {organizer: getOwner()})}/>
                    <meta property="og:title" content={t('TITLE') + " - " + t('BLINDPOOL_VIEW_TITLE', {organizer: getOwner()})}/>
                    <meta property="og:description" content={t('BLINDPOOL_VIEW_DESCRIPTION', {organizer: getOwner()})}/>
                </Helmet>
                <Grid key="definition" item>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h2">
                                {t("POOL_MADE_BY", {organizer: getOwner()})}
                            </Typography>
                            {matchInfo()}
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
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