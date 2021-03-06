import React, {useState} from "react";
import {
    Card, CardActions,
    CardContent, CircularProgress,
    Grid, Icon, IconButton,
    makeStyles,
    Table, TableBody,
    TableCell,
    TableHead,
    TableRow, TextField, Theme, Tooltip,
    Typography, withStyles
} from "@material-ui/core";
import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import appState from "../../state/AppState";
import {Api, getHost} from "../../utils/Network";
import {Helmet} from "react-helmet";
import {Match} from "../../model/Match";
import Blindpool from "../../model/Blindpool";
import MatchInfoWithScore from "../../components/bpmatchwithscore/MatchInfoWithScore";
import {canThisScoreStillWin} from "../../logic/ScoresUtil";

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
    freeFormatMatch: {
        // marginTop: '1em'
    },
    impossibleScore: {
        textDecoration: 'line-through',
        // color: 'rgba(0, 0, 0, 0.57)'
    },
    trophyPadding: {
        marginTop: '2em'
    }
});

const copyFieldId = "copyTextField";

interface KeyInParams {
    key: string
}

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

const ViewPool: React.FC = () => {
    let { key } = useParams<KeyInParams>();
    const classes = useStyles();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [fullMatchInfo, setFullMatchInfo] = useState<Match | undefined>(undefined);
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

                    if (poolJson.MATCH /*&& poolJson.MATCH.startTimestamp < new Date()*/) {
                        fetch(`${getHost(Api.matches)}/api/v2/matches/${poolJson.MATCH.id}`)
                            .then(matchJsonFromServer => matchJsonFromServer.json())
                            .then((matchJson: Match) => {
                                setFullMatchInfo(matchJson);
                            });
                    }
                });
        } else {
            setLoading(false);
            setShareUrl(`${window.location.protocol}//${window.location.host}/pool/${appState.poolData!.key}`);
            if (appState.selectedMatch && typeof appState.selectedMatch !== 'string') {
                const actualMatch = appState.selectedMatch as Match;
                fetch(`${getHost(Api.matches)}/api/v2/matches/${actualMatch.id}`)
                    .then(matchJsonFromServer => matchJsonFromServer.json())
                    .then((matchJson: Match) => {
                        setFullMatchInfo(matchJson);
                    });
            }
        }
    }

    const copy = () => {
        let dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.setAttribute('value', shareUrl as unknown as string);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    };

    const trophyIcon = (finished: boolean) => {
        if (finished) {
            return <img alt='Winner' style={{marginBottom: '-2px'}} src="/icons/trophy.svg"/>;
        } else {
            return undefined;
        }
    };

    const questionMark = () => {
        return (
            <HtmlTooltip enterTouchDelay={5} arrow
                title={
                    <React.Fragment>
                        <Typography variant="h2" color="inherit">Wildcard</Typography>
                        <Typography>{t('WILDCARD_EXPLANATION')}</Typography>
                    </React.Fragment>
                }
            >
                <Icon fontSize="small">
                    help
                </Icon>
            </HtmlTooltip>
        );
    };

    const renderTableData = () => {
        return appState.poolData!.PARTICIPANTS_AND_SCORES.map((participantAndScore, index) => {
            const participantName = participantAndScore.participant.name;
            const home: string = participantAndScore.score.home >= 0 ? participantAndScore.score.home.toString() : 'X';
            const away: string = participantAndScore.score.away >= 0 ? participantAndScore.score.away.toString() : 'X';

            const isWildCard = (home: string, away: string) => {
                if (home === 'X' && away === 'X') {
                    return questionMark();
                } else {
                    return null;
                }
            }

            const participantAndScoreFC = () => {
                if (fullMatchInfo && (canThisScoreStillWin(participantAndScore.score, appState.poolData!.PARTICIPANTS_AND_SCORES, fullMatchInfo.score, fullMatchInfo.finished))) {
                    return (
                        <TableRow key={participantName}>
                            <TableCell>
                                <Typography variant="body1" style={{display: 'flex'}}>{participantName}&nbsp;{trophyIcon(fullMatchInfo.finished)}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">{home} - {away} {isWildCard(home, away)}</Typography>
                            </TableCell>
                        </TableRow>
                    );
                } else if (!fullMatchInfo) {
                    return (
                        <TableRow key={participantName}>
                            <TableCell>
                                <Typography variant="body1">{participantName}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">{home} - {away} {isWildCard(home, away)}</Typography>
                            </TableCell>
                        </TableRow>
                    );
                } else {
                    return (
                        <TableRow key={participantName}>
                            <TableCell>
                                <Typography variant="body1">{participantName}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1" className={classes.impossibleScore}>{home} - {away} {isWildCard(home, away)}</Typography>
                            </TableCell>
                        </TableRow>
                    );
                }
            };
            return participantAndScoreFC();
        });
    };

    const handleTextFieldFocus = (event: React.MouseEvent<HTMLElement>) => {
        const copyTextBox = event.target as HTMLInputElement;
        copyTextBox.select();
    };

    const getOwner = () => {
        let participantsAndScores = appState.poolData!.PARTICIPANTS_AND_SCORES;
        return participantsAndScores[0].participant.name;
    };

    let matchInfo = undefined;
    if (!loading && appState.poolData!.MATCH) {
        matchInfo = <MatchInfoWithScore fullMatchInfo={fullMatchInfo} />;
    } else if (!loading && appState.poolData!.FREE_FORMAT_MATCH) {
        matchInfo = <Typography className={classes.freeFormatMatch} variant="body1"><b>Match:</b> {appState.poolData!.FREE_FORMAT_MATCH as string}</Typography>;
    } /*else {
        matchInfo = <Typography variant="h2">{t("POOL_MADE_BY", {organizer: getOwner()})}</Typography>;
    }*/

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
                            {matchInfo}
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
                                label={t('SHARE_THIS_POOL')}
                                className={classes.shareUrlInput}
                                value={shareUrl}
                                margin="normal"
                                variant="outlined"
                                onClick={(event: React.MouseEvent<HTMLElement>) => handleTextFieldFocus(event)}
                            />
                            <IconButton className={classes.copyButton} color="inherit"
                                        aria-label="Copy" aria-haspopup="true" onClick={copy}>
                                <Icon aria-label={t('COPY')}>content_copy</Icon>
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        );
    }
};

export default ViewPool;
