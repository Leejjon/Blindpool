import React, {useEffect, useState} from "react";
import {Divider, makeStyles, TextField, Typography} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import appState, {Match} from "../../state/AppState";
import {Api, getHost, getHostnameWithPortIfLocal} from "../../utils/Network";
import {useTranslation} from "react-i18next";

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

const BpMatchSelector: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    // TODO: Pass error to snackbar in createpool page.
    const [message, setMessage] = useState<string | undefined>(undefined);
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
    }, []);

    const [value, setValue] = React.useState<Match | string | undefined>(undefined);
    const [inputValue, setInputValue] = React.useState('');

    return (
        <Autocomplete
            className={classes.bpMatchSelector}
            onChange={(event, newValue) => {
                setValue(newValue ? newValue : undefined);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
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
            ListboxProps={{ style: { minHeight: '28em' } }}
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