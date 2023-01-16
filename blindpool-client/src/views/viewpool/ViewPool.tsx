import React, {useState} from "react";
import {
    Card, CardActions,
    CardContent, CircularProgress,
    Grid, IconButton,
    Table, TableBody,
    TableCell,
    TableHead,
    TableRow, TextField, Tooltip, Typography, useTheme
} from "@mui/material";
import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import appState from "../../state/AppState";
import {Api, getHost} from "../../utils/Network";
import {Helmet} from "react-helmet-async";
import {Match} from "../../model/Match";
import Blindpool from "../../model/Blindpool";
import {canThisScoreStillWin} from "../../logic/ScoresUtil";
import MatchInfoWithScore from "../../components/bpmatchwithscore/MatchInfoWithScore";
import {ContentCopy, Help} from "@mui/icons-material";
import {Params} from "react-router-dom";
import BpSocialMediaLinks from "../../components/bpsocialmedialinks/BpSocialMediaLinks";

const root = {
    flexGrow: 1,
    textAlign: 'center',
    marginTop: '0.5em',
    marginBottom: '2em'
    // marginLeft: '0',
    // marginRight: '0',
    // paddingLeft: '0'
}
const table = {
    width: '100%',
    overflowX: 'auto',
}
const columnheader = {
    fontWeight: 700,
}
const namecolumn = {
    flexGrow: 1
}
const shareUrlInput = {
    marginTop: '0.45em',
    marginLeft: '1em',
    width: '100%',
}
const copyButton = {
    marginTop: '0em',
    marginLeft: '0em',
    marginRight: '0.3em'
}

const progress = {
    margin: '8em',
}
const impossibleScore = {
    textDecoration: 'line-through',
    // color: 'rgba(0, 0, 0, 0.57)'
}


const copyFieldId = "copyTextField";

interface KeyInParams extends Params { // https://github.com/remix-run/react-router/issues/8200#issuecomment-1034662744
    key: string
}

const ViewPool: React.FC = () => {
    let {key} = useParams() as KeyInParams;
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [fullMatchInfo, setFullMatchInfo] = useState<Match | undefined>(undefined);
    const [shareUrl, setShareUrl] = useState("");
    const theme = useTheme();
    const tooltip = {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(16),
        border: '1px solid #dadde9',
    }

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
            <Tooltip sx={tooltip} enterTouchDelay={5} arrow
                     title={
                         <React.Fragment>
                             <Typography variant="h2" color="inherit">Wildcard</Typography>
                             <Typography sx={{color: "white"}}>{t('WILDCARD_EXPLANATION')}</Typography>
                         </React.Fragment>
                     }
            >
                <Help fontSize="small"/>
            </Tooltip>
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
                                <Typography variant="body1"
                                            style={{display: 'flex'}}>{participantName}&nbsp;{trophyIcon(fullMatchInfo.finished)}</Typography>
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
                                <Typography variant="body1"
                                            sx={impossibleScore}>{home} - {away} {isWildCard(home, away)}</Typography>
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
        matchInfo = <MatchInfoWithScore fullMatchInfo={fullMatchInfo}/>;
    } else if (!loading && appState.poolData!.FREE_FORMAT_MATCH) {
        matchInfo =
            <Typography variant="body1"><b>Match:</b> {appState.poolData!.FREE_FORMAT_MATCH as string}</Typography>;
    } /*else {
        matchInfo = <Typography variant="h2">{t("POOL_MADE_BY", {organizer: getOwner()})}</Typography>;
    }*/

    const blindpoolViewDescription = t('BLINDPOOL_VIEW_DESCRIPTION', {organizer: getOwner()});

    if (loading) {
        return <CircularProgress sx={progress}/>
    } else {
        return (
            <Grid container justifyContent={"center"} spacing={2} sx={root}>
                <Helmet>
                    <title>{t('TITLE')} - {t('BLINDPOOL_VIEW_TITLE', {organizer: getOwner()})}</title>
                    <meta name="description" content={blindpoolViewDescription}/>
                    <meta property="og:title"
                          content={t('TITLE') + " - " + t('BLINDPOOL_VIEW_TITLE', {organizer: getOwner()})}/>
                    <meta property="og:description" content={blindpoolViewDescription}/>
                </Helmet>
                <Grid key="definition" item>
                    <Card className="card">
                        <CardContent>
                            {matchInfo}
                            <Table sx={table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={namecolumn}>
                                            <Typography sx={columnheader}>
                                                {t("NAME_COLUMN_HEADER")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={columnheader}>
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
                                sx={shareUrlInput}
                                value={shareUrl}
                                margin="normal"
                                variant="outlined"
                                onClick={(event: React.MouseEvent<HTMLElement>) => handleTextFieldFocus(event)}
                            />
                            <IconButton sx={copyButton} color="inherit"
                                        aria-label="Copy" aria-haspopup="true" onClick={copy}>
                                <ContentCopy aria-label={t('COPY')}/>
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
                <BpSocialMediaLinks/>
            </Grid>
        );
    }
};

export default ViewPool;
