import React, {type ChangeEvent, useEffect} from "react";
import {Box, Divider, TextField, Typography} from "@mui/material";
import {Autocomplete} from "@mui/material";
import {getHostnameWithPortIfLocal} from "~/utils/Network";
import {useTranslation} from "react-i18next";
import {type Match} from "~/model/Match";
import {getAwayTeamNameToDisplay, getHomeTeamNameToDisplay} from "~/locales/i18n";
import "./BpMatchSelector.css";
import {type BpMatchesProps, type BpSelectedMatchProps} from "~/context/BpContext";

const bpMatchSelector = {
    margin: 'auto',
    marginTop: '0.8em',
}
const marginHalfEm = {
    margin: '0.5em', fontSize: 'small',
}

export interface MatchValidationProp {
    invalidMatchMessage: string | undefined;
    setInvalidMatchMessage: (message: string | undefined) => void;
}

function getMatchById(selectedMatchId: string | undefined, matches: Array<Match>): Match | undefined {
    for (const match of matches) {
        if (match.id === selectedMatchId) {
            return match;
        }
    }
    return undefined;
}

const BpMatchSelector: React.FC<MatchValidationProp & BpMatchesProps & BpSelectedMatchProps> = ({
                                                                                                    invalidMatchMessage,
                                                                                                    setInvalidMatchMessage,
                                                                                                    matches,
                                                                                                    selectedMatchId,
                                                                                                    setSelectedMatchId
                                                                                                }) => {
    const {t} = useTranslation();
    const [inputValue, setInputValue] = React.useState<string>('');

    const displayMatchInDropdown = (upcomingMatch: Match | string): string => {
        const homeTeamName = getHomeTeamNameToDisplay(upcomingMatch as Match);
        const awayTeamName = getAwayTeamNameToDisplay(upcomingMatch as Match);
        return `${homeTeamName} vs ${awayTeamName}`;
    };

    useEffect(() => {
        let matchToSelectInDropdown: string = '';
        const match = getMatchById(selectedMatchId, matches);

        if (match) {
            matchToSelectInDropdown = displayMatchInDropdown(match);
        } else if (selectedMatchId) {
            matchToSelectInDropdown = selectedMatchId;
        }

        setInputValue(matchToSelectInDropdown);
    }, [setInputValue, selectedMatchId, matches]);

    const updateSelectedMatch = (event: ChangeEvent<object> | null, selectedMatch: null | string | Match) => {

        const supportedMatch = selectedMatch as Match;
        const freeFormatMatch = selectedMatch as string;
        if (supportedMatch && supportedMatch.id) {
            if (supportedMatch.startTimestamp < new Date()) {
                setInvalidMatchMessage('MATCH_ALREADY_STARTED');
            } else {
                setSelectedMatchId(supportedMatch.id);
            }
        } else if (freeFormatMatch) {
            setSelectedMatchId(freeFormatMatch);
        } else {
            setSelectedMatchId(undefined);
        }
    };

    return (
        <>
            {getMatchById(selectedMatchId, matches) &&
                <input type="hidden" name="selectedMatchID" value={selectedMatchId}/>}
            {(!getMatchById(selectedMatchId, matches) && selectedMatchId) &&
                <input type="hidden" name="freeFormatMatch" value={selectedMatchId}/>}
            <Autocomplete
                disabled={matches.length < 1}
                sx={bpMatchSelector}
                onChange={updateSelectedMatch}
                inputValue={inputValue}
                onInputChange={(event: ChangeEvent<{}>, newSupportedMatch: string) => {
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
                    const {key, ...propsWithoutKey} = props;
                    return (
                        <Box component="li" key={upcomingMatch.id}
                             style={{textAlign: "center", width: "18em"}} {...propsWithoutKey}>
                            <div>
                                <div className="tableRowContainerForClubIcons">
                                    <div className="clubIconAndTextDiv">
                                        <img src={homeTeamIconUrl} alt={homeTeamName} className="clubIconStyle"/>
                                        <Typography sx={marginHalfEm}>{homeTeamName}</Typography>
                                    </div>
                                    <div className="slashIcon"><Typography
                                        variant="body1">/</Typography></div>
                                    <div className="clubIconAndTextDiv">
                                        <img src={awayTeamIconUrl} alt={awayTeamName} className="clubIconStyle"/>
                                        <Typography sx={marginHalfEm}>{awayTeamName}</Typography>
                                    </div>
                                </div>
                                <Typography sx={{
                                    margin: "0.5em",
                                    fontSize: "small"
                                }}>{dateString} {startTimestamp.getHours()}:{minutesToDisplay}</Typography>
                            </div>
                            <Divider/>
                        </Box>
                    );
                }}
                slotProps={{
                    listbox: {
                        style: { /* This position absolute is key. */
                            position: 'absolute',
                            backgroundColor: '#fafafa',
                            maxHeight: '24em'
                        }
                    }
                }}
                style={{width: '100%'}}
                renderInput={(params) =>
                    <TextField {...params}
                        // Left out a name here so it won't be part of the form.
                               error={invalidMatchMessage !== undefined}
                               helperText={invalidMatchMessage !== undefined ? t(invalidMatchMessage) : undefined}
                               label={t('SELECT_MATCH')}
                               variant="standard"
                    />
                }
            />
        </>
    );
}

export default BpMatchSelector;
