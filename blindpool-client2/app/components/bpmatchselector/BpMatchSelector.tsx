import React, {ChangeEvent, useEffect} from "react";
import {Box, Divider, TextField, Typography} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import {getHostnameWithPortIfLocal} from "../../utils/Network";
import {useTranslation} from "react-i18next";
import {Match} from "../../model/Match";
import {getAwayTeamNameToDisplay, getHomeTeamNameToDisplay} from "../../locales/i18n";
import "./BpMatchSelector.css";
import { BpMatchesProps, BpSelectedMatchProps } from "../../context/BpContext";

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

const BpMatchSelector: React.FC<MatchValidationProp & BpMatchesProps & BpSelectedMatchProps> = ({invalidMatchMessage, setInvalidMatchMessage, matches, selectedMatchId, setSelectedMatchId}) => {
    const {t} = useTranslation();
    const [inputValue, setInputValue] = React.useState<string>('');

    const displayMatchInDropdown = (upcomingMatch: Match | string): string => {
        const homeTeamName = getHomeTeamNameToDisplay(upcomingMatch as Match);
        const awayTeamName = getAwayTeamNameToDisplay(upcomingMatch as Match);
        return `${homeTeamName} vs ${awayTeamName}`;
    };

    useEffect(() => {
        let matchToSelectInDropdown: string = '';
        if (selectedMatchId) {
            let matchExists = false;
            for (const match of matches) {
                if (match.id === selectedMatchId) {
                    matchToSelectInDropdown = displayMatchInDropdown(match);
                    matchExists = true;
                    break;
                }
            }
            if (!matchExists) {
                matchToSelectInDropdown = selectedMatchId;
            }
        }

        setInputValue(matchToSelectInDropdown);
    }, [setInputValue, selectedMatchId, matches]);

    const updateSelectedMatch = (event: ChangeEvent<{}> | null, selectedMatch: null | string | Match) => {

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

    // TODO: If there are no matches, hide the entire autocomplete thing.

    return (
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
                return (
                    <Box component="li" key={upcomingMatch.id} style={{textAlign: "center", width: "18em"}} {...props}>
                        <div>
                            <div className="tableRowContainerForClubIcons">
                                <div className="clubIconAndTextDiv">
                                    <img src={homeTeamIconUrl} alt={homeTeamName} className="clubIconStyle"/>
                                    <Typography sx={marginHalfEm}>{homeTeamName}</Typography>
                                </div>
                                <div className="slashIcon"><Typography
                                    variant="body1">/</Typography></div>
                                <div className="clubIconAndTextDiv">
                                    <img src={awayTeamIconUrl} alt={awayTeamName}className="clubIconStyle"/>
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
                               autoComplete: 'off', // disable autocomplete and autofill
                               style: {fontSize: 'large'}
                           }}
                />
            }
        />
    );
}

export default BpMatchSelector;
