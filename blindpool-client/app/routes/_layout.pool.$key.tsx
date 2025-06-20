import React, {useEffect} from "react";
import {
    Card, CardActions,
    CardContent, CircularProgress,
    Grid, IconButton,
    Table, TableBody,
    TableCell,
    TableHead,
    TableRow, TextField, Tooltip, Typography, useTheme
} from "@mui/material";
import {useParams, type ActionFunctionArgs, type Params, type ParamParseKey, useNavigate} from "react-router";
import { useTranslation } from "react-i18next";
import { canThisScoreStillWin } from "~/logic/ScoresUtil";
import MatchInfoWithScore from "../components/bpmatchwithscore/MatchInfoWithScore";
import { ContentCopy, Help } from "@mui/icons-material";
import BpSocialMediaLinks from "../components/bpsocialmedialinks/BpSocialMediaLinks";
import { useQuery } from "@tanstack/react-query";
import { poolQuery } from "~/queries/PoolQuery";
import { matchInfoQuery } from "~/queries/MatchResultQuery";
import type {Blindpool} from "~/model/Blindpool";
import {useExistingBlindpoolOutletContext} from "~/context/BpContext";
import {getLocale, getPageTitle, resources} from "~/locales/translations";
import type {Route} from "../../.react-router/types/app/routes/+types/_layout.pool.$key";

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

const ViewPoolPath = {
    key: '/pool/:key',
} as const;

export interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof ViewPoolPath.key>>;
}

// export const loader = async (params: Args, queryClient: QueryClient) => {
//     console.log(params);
//     return null;
// }

export function meta({ }: Route.MetaArgs) {
    return [
        { title: `${getPageTitle(resources[getLocale()].translation.BLINDPOOL_VIEW_TITLE)}` },
        { name: "description", content: resources[getLocale()].translation.BLINDPOOL_VIEW_DESCRIPTION },
    ];
};

const LayoutPool: React.FC = () => {
    const params = useParams();
    const key = params["key"] as string;

    const { t } = useTranslation();
    const navigate = useNavigate();

    const {setMessage} = useExistingBlindpoolOutletContext()

    const {data, error, isError, isLoading} = useQuery({ ...poolQuery(key) });
    const pool: Blindpool | undefined = data;
    const match = pool?.MATCH;

    useEffect(() => {
        if (isError) {
            setMessage(error.message.split(error.name)[0]);
            navigate("/");
        }
    }, [isError, error]);

    const matchScoreResult = useQuery({ ...matchInfoQuery(match?.id), enabled: !!pool?.MATCH });
    const fullMatchInfo = matchScoreResult.data;

    const shareUrl = `${window.location.protocol}//${window.location.host}/pool/${key}`;
    const theme = useTheme();
    const tooltip = {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(16),
        border: '1px solid #dadde9',
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
            return <img alt='Winner' style={{ marginBottom: '-2px' }} src="/icons/trophy.svg" />;
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
                             <Typography sx={{ color: "white" }}>{t('WILDCARD_EXPLANATION')}</Typography>
                         </React.Fragment>
                     }
            >
                <Help fontSize="small" />
            </Tooltip>
        );
    };

    const renderTableData = () => {
        return pool!.PARTICIPANTS_AND_SCORES.map((participantAndScore, index) => {
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
                if (fullMatchInfo && (canThisScoreStillWin(participantAndScore.score, pool!.PARTICIPANTS_AND_SCORES, fullMatchInfo.score, fullMatchInfo.finished))) {
                    return (
                        <TableRow key={participantName}>
                            <TableCell>
                                <Typography variant="body1"
                                            style={{ display: 'flex' }}>{participantName}&nbsp;{trophyIcon(fullMatchInfo.finished)}</Typography>
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
        if (pool) {
            let participantsAndScores = pool.PARTICIPANTS_AND_SCORES;
            return participantsAndScores[0].participant.name;
        } else {
            return "No name yet."
        }
    };

    let matchInfo = undefined;
    if (!isLoading && pool !== undefined && match !== undefined) {
        matchInfo = <MatchInfoWithScore matchInfo={match} fullMatchInfo={fullMatchInfo} />;
    } else if (!isLoading && pool !== undefined && pool.FREE_FORMAT_MATCH) {
        matchInfo =
            <Typography variant="body1"><b>Match:</b> {pool.FREE_FORMAT_MATCH as string}</Typography>;
    } /*else {
        matchInfo = <Typography variant="h2">{t("POOL_MADE_BY", {organizer: getOwner()})}</Typography>;
    }*/

    const blindpoolViewDescription = t('BLINDPOOL_VIEW_DESCRIPTION', { organizer: getOwner() });

    if (!isLoading && pool !== undefined) {
        return (
            <Grid container justifyContent={"center"} spacing={2} sx={root}>
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
                                <ContentCopy aria-label={t('COPY')} />
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
                <BpSocialMediaLinks />
            </Grid>
        );
    } else {
        return (
            <CircularProgress sx={progress} />
        );
    }
};

export default LayoutPool;
