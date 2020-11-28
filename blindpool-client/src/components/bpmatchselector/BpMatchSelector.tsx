import React, {ChangeEvent, useEffect, useState} from "react";
import {Divider, makeStyles, TextField, Typography} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import appState, {Match} from "../../state/AppState";
import {Api, getHost, getHostnameWithPortIfLocal} from "../../utils/Network";
import {useTranslation} from "react-i18next";
import {BpSnackbarMessage} from "../../App";

const useStyles = makeStyles({
    bpMatchSelector: {
        margin: 'auto',
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

    const [inputValue, setInputValue] = React.useState('');
    const updateSelectedMatch = (event: ChangeEvent<{}> | null, selectedMatch: null | string | Match) => {
        console.log(`onChange ${new Date().getTime()}`);
        const supportedMatch = selectedMatch as Match;
        const freeFormatMatch = selectedMatch as string;
        if (supportedMatch && supportedMatch.id) {
            console.log(`Match: ${supportedMatch.id}`);
        } else if (freeFormatMatch) {
            console.log(`Match: ${freeFormatMatch}`);
        } else {
            console.log(`Not a match ${selectedMatch}`);
        }
    };

    return (
        <Autocomplete
            disabled={matches.length < 1}
            className={classes.bpMatchSelector}
            onChange={updateSelectedMatch}
            inputValue={inputValue}
            onInputChange={(event: ChangeEvent<{}>, newSupportedMatch: string) => {
                console.log(`Event type: ${event.type}`)
                console.log(`onInputChange ${new Date().getTime()} newSupportedMatch=${newSupportedMatch}`);
                setInputValue(newSupportedMatch);
                if (event.type === 'change') {
                    updateSelectedMatch(null, newSupportedMatch);
                }
            }}
            id="bpMatchSelector" freeSolo
            getOptionLabel={(upcomingMatch) => {
                return `${upcomingMatch.homeTeamName} vs ${upcomingMatch.awayTeamName}`;
            }}
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
            ListboxProps={{ style: { maxHeight: '24em' } }}
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