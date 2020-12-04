import React, {ChangeEvent, useEffect, useState} from "react";
import {Divider, makeStyles, TextField, Typography} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import appState from "../../state/AppState";
import {Api, getHost, getHostnameWithPortIfLocal} from "../../utils/Network";
import {useTranslation} from "react-i18next";
import {BpSnackbarMessage} from "../../App";
import {Match} from "../../model/Match";

const useStyles = makeStyles({
    bpMatchSelector: {
        margin: 'auto',
        marginTop: '0.8em',
    },
    clubIconStyle: {
        width: '3em', height: '3em', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '0.5em'
    },
    tableRowContainerForClubIcons: {
        display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', width: '100%', margin: '0px'
    },
    clubIconAndTextDiv: {
        width: '7.8em', textAlign: 'center', whiteSpace: 'nowrap', fontSize: '30'
    },
    slashIcon: {
        marginTop: '2em', marginBottom: '2em'
    },
    marginHalfEm: {
        margin: '0.5em', fontSize: 'small',
    },
    justCenter: {
        textAlign: 'center'
    }
});

const BpMatchSelector: React.FC<BpSnackbarMessage> = ({setMessage}) => {
    const classes = useStyles();
    const { t } = useTranslation();
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

    const displayMatchInDropdown = (upcomingMatch: Match): string => {
        return `${upcomingMatch.homeTeamName} vs ${upcomingMatch.awayTeamName}`;
    };

    useEffect(() =>{
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
        console.log(`onChange ${new Date().getTime()}`);
        const supportedMatch = selectedMatch as Match;
        const freeFormatMatch = selectedMatch as string;
        if (supportedMatch && supportedMatch.id) {
            appState.setSelectedMatch(supportedMatch)
        } else if (freeFormatMatch) {
            appState.setSelectedMatch(freeFormatMatch);
        } else {
            appState.setSelectedMatch(undefined);
        }
    };

    return (
        <Autocomplete
            disabled={matches.length < 1}
            className={classes.bpMatchSelector}
            onChange={updateSelectedMatch}
            inputValue={inputValue}
            onInputChange={(event: ChangeEvent<{}>, newSupportedMatch: string) => {
                console.log(`onInputChange ${new Date().getTime()} newSupportedMatch=${newSupportedMatch}`);
                setInputValue(newSupportedMatch);
                if (event && event.type === 'change') {
                    updateSelectedMatch(null, newSupportedMatch);
                }
            }}
            id="bpMatchSelector" freeSolo
            getOptionLabel={displayMatchInDropdown}
            options={matches as Match[]}
            renderOption={(upcomingMatch: Match) => {
                const homeTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${upcomingMatch.homeTeamID}.svg`;
                const awayTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${upcomingMatch.awayTeamID}.svg`;

                // TODO: Move this logic to a util folder.
                const startTimestamp: Date = new Date(upcomingMatch.startTimestamp);
                const minutes: string = '' + startTimestamp.getMinutes();
                const minutesToDisplay: string = minutes.padStart(2, minutes);
                const dateString: string = startTimestamp.toLocaleDateString();

                return (
                    <div className={classes.justCenter}>
                        <div className={classes.tableRowContainerForClubIcons}>
                            <div className={classes.clubIconAndTextDiv}>
                                <img className={classes.clubIconStyle} src={homeTeamIconUrl}
                                     alt={upcomingMatch.homeTeamName}/>
                                <Typography
                                    className={classes.marginHalfEm}>{upcomingMatch.homeTeamName}</Typography>
                            </div>
                            <div className={classes.slashIcon}><Typography variant="body1">/</Typography></div>
                            <div className={classes.clubIconAndTextDiv}>
                                <img className={classes.clubIconStyle} src={awayTeamIconUrl}
                                     alt={upcomingMatch.awayTeamName}/>
                                <Typography
                                    className={classes.marginHalfEm}>{upcomingMatch.awayTeamName}</Typography>
                            </div>
                        </div>
                        <Typography
                            className={classes.marginHalfEm}>{dateString} {startTimestamp.getHours()}:{minutesToDisplay}</Typography>
                        <Divider/>
                    </div>
                );
            }}
            ListboxProps={{ style: { /* This position absolute is key. */ position: 'absolute', backgroundColor: '#fafafa', maxHeight: '24em' } }}
            style={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label={t('SELECT_MATCH')}
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                    style: {fontSize: 'large'}
                }}
            />}
        />
    );
}

export default BpMatchSelector;