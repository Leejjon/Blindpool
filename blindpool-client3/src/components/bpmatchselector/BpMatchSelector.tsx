import React, {ChangeEvent, useEffect, useState} from "react";
import {Box, Divider, TextField, Typography} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import appState from "../../state/AppState";
import {Api, getHost, getHostnameWithPortIfLocal} from "../../utils/Network";
import {useTranslation} from "react-i18next";
import {BpSnackbarMessage} from "../../App";
import {Match} from "../../model/Match";
import {getAwayTeamNameToDisplay, getHomeTeamNameToDisplay} from "../../locales/i18n";

export interface MatchValidationProp {
    invalidMatchMessage: string | undefined;
    setInvalidMatchMessage: (message: string | undefined) => void;
}

export interface BpMatchSelectorProps extends BpSnackbarMessage, MatchValidationProp {}

const BpMatchSelector: React.FC<BpMatchSelectorProps> = ({setMessage, invalidMatchMessage, setInvalidMatchMessage}) => {
    const {t} = useTranslation();
    const [matches, setMatches] = useState<Array<Match>>([]);
    const [inputValue, setInputValue] = React.useState('');

    useEffect(() => {
        if (appState.upcomingMatches) {
            setMatches(appState.upcomingMatches);
        } else {
            fetch(`${getHost(Api.matches)}/api/v2/matches/upcoming`)
                .then(async upcomingMatchesResponse => {
                    if (upcomingMatchesResponse.status === 200) {
                        let upcomingMatches = await upcomingMatchesResponse.json();
                        appState.setUpcomingMatches(upcomingMatches);
                        setMatches(upcomingMatches);
                    } else {
                        setMessage('BACKEND_OFFLINE');
                    }
                })
                .catch(result => {
                    console.log(`Something went wrong with fetching upcoming matches ${result}`);
                    setMessage('BACKEND_UNREACHABLE');
                });
        }
    }, [setMessage]);

    const displayMatchInDropdown = (upcomingMatch: Match | string): string => {
        const homeTeamName = getHomeTeamNameToDisplay(upcomingMatch as Match);
        const awayTeamName = getAwayTeamNameToDisplay(upcomingMatch as Match);
        return `${homeTeamName} vs ${awayTeamName}`;
    };

    useEffect(() => {
        const supportedMatch = appState.selectedMatch as Match;
        const freeFormatMatch = appState.selectedMatch as string;

        let matchToSelectInDropdown: string = '';
        if (supportedMatch && supportedMatch.id) {
            matchToSelectInDropdown = displayMatchInDropdown(supportedMatch);
        } else if (freeFormatMatch) {
            matchToSelectInDropdown = freeFormatMatch;
        }

        setInputValue(matchToSelectInDropdown);
    }, [setInputValue]);

    const updateSelectedMatch = (event: ChangeEvent<{}> | null, selectedMatch: null | string | Match) => {

        const supportedMatch = selectedMatch as Match;
        const freeFormatMatch = selectedMatch as string;
        if (supportedMatch && supportedMatch.id) {
            if (supportedMatch.startTimestamp < new Date()) {
                setInvalidMatchMessage('MATCH_ALREADY_STARTED');
            } else {
                appState.setSelectedMatch(supportedMatch);
            }
        } else if (freeFormatMatch) {
            appState.setSelectedMatch(freeFormatMatch);
        } else {
            appState.setSelectedMatch(undefined);
        }
    };

    return (
        <Autocomplete
            disabled={matches.length < 1}
            sx={{margin: "auto", marginTop: "0.8em"}}
            onChange={updateSelectedMatch}
            inputValue={inputValue}
            onInputChange={(event: ChangeEvent<{}>, newSupportedMatch: string) => {
                console.log("boe")
                setInvalidMatchMessage(undefined);
                if (newSupportedMatch === 'undefined vs undefined') {
                    // Somehow if you press enter while typing a freeformat match, it will throw an input change event
                    // with 'undefined vs undefined' in the newSupportedMatch string.
                    return;
                }

                setInputValue(newSupportedMatch);
                if (event && event.type === 'change') {
                    updateSelectedMatch(null, newSupportedMatch);
                }
            }}
            id="bpMatchSelector" freeSolo
            getOptionLabel={displayMatchInDropdown}
            options={matches as Match[]}
            renderOption={(props: any, upcomingMatch: Match) => {
                const homeTeamName = getHomeTeamNameToDisplay(upcomingMatch);
                const awayTeamName = getAwayTeamNameToDisplay(upcomingMatch);
                const homeTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${upcomingMatch.homeTeamID}.svg`;
                const awayTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${upcomingMatch.awayTeamID}.svg`;

                // TODO: Move this logic to a util folder.
                const startTimestamp: Date = new Date(upcomingMatch.startTimestamp);
                const minutes: string = '' + startTimestamp.getMinutes();
                const minutesToDisplay: string = minutes.padStart(2, minutes);
                const dateString: string = startTimestamp.toLocaleDateString();
                return (
                    <Box component="li" key={upcomingMatch.id} style={{textAlign: "center", width: "18em"}} {...props}>
                        <div>
                            <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-between", width: "100%", margin: "0", marginTop: "0.5em"}} >
                                <div style={{width: "7.8em", textAlign: "center", whiteSpace: "nowrap"}}>
                                    <img src={homeTeamIconUrl} alt={homeTeamName}
                                         style={{width: "3em", height: "3em", display: "block", marginLeft: "auto", marginRight: "auto", marginBottom: "0.5em"}} />
                                    <Typography sx={{margin: "0.5em", fontSize: "small"}}>{homeTeamName}</Typography>
                                </div>
                                <div style={{marginTop: "2em", marginBottom: "2em"}}><Typography variant="body1">/</Typography></div>
                                <div style={{width: "7.8em", textAlign: "center", whiteSpace: "nowrap"}}>
                                    <img src={awayTeamIconUrl} alt={awayTeamName}
                                         style={{width: "3em", height: "3em", display: "block", marginLeft: "auto", marginRight: "auto", marginBottom: "0.5em"}}/>
                                    <Typography sx={{margin: "0.5em", fontSize: "small"}}>{awayTeamName}</Typography>
                                </div>
                            </div>
                        <Typography sx={{margin: "0.5em", fontSize: "small"}}>{dateString} {startTimestamp.getHours()}:{minutesToDisplay}</Typography>
                        </div>
                        <Divider/>
                    </Box>
                );
            }}
            ListboxProps={{
                style: { /* This position absolute is key. */
                    position: 'absolute',
                    backgroundColor: '#fafafa',
                    maxHeight: '24em'
                }
            }}
            style={{width: '100%'}}
            renderInput={(params) =>
                <TextField {...params}
                           error={invalidMatchMessage !== undefined}
                           helperText={invalidMatchMessage !== undefined ? t(invalidMatchMessage) : undefined}
                           label={t('SELECT_MATCH')}
                           variant="standard"
                           inputProps={{
                               ...params.inputProps,
                               autoComplete: 'new-password', // disable autocomplete and autofill
                               style: {fontSize: 'large'}
                           }}
                />
            }
        />
    );
}

export default BpMatchSelector;
