import React, {useEffect, useState} from "react";
import {Button, Card, CardActions, Grid, makeStyles, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";

import {majorVersion as MAJOR_VERSION} from "../../version.json";
import {minorVersion as MINOR_VERSION} from "../../version.json";

const useStyles = makeStyles({
    root: {
        marginTop: '1.5em',
    },
    card: {
        minWidth: "20em",
        maxWidth: "20em"
    },
    updateMessage: {
        flexGrow: 1,
        textAlign: "left",
        paddingLeft: '0.5em'
    },
    button: {
        paddingTop: '0.55em',
        fontSize: 15
    }
});

const BpUpdateDialog: React.FC = () => {
    const classes = useStyles();
    const {t} = useTranslation();

    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // Now get the current version from the server
            fetch('/version.json').then((response) => {
                return response.json();
            }).then((updateInfo) => {
                if (updateInfo.majorVersion > MAJOR_VERSION || (updateInfo.majorVersion === MAJOR_VERSION && updateInfo.minorVersion > MINOR_VERSION)) {
                    setUpdateAvailable(true);
                }
            });
        }
    }, [updateAvailable]);

    // Refresh on a user action
    const handleRefreshApp = () => {
        // In some extreme cases we might want to clear the cache too
        if (caches) {
            caches.keys().then((names) => {
                for (let name of names) caches.delete(name);
            });
        }
        window.location.reload();
    };

    if (updateAvailable) {
        return (
            <Grid container justify="center" key="definition" item className={classes.root}>
                <Card className={classes.card}>
                    <CardActions>
                        <Typography variant="body1" className={classes.updateMessage}>
                            {t('NEW_VERSION_AVAILABLE')}
                        </Typography>
                        <Button size="medium" className={classes.button} onClick={() => handleRefreshApp()}>
                            {t('UPDATE_NOW')}
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        );
    } else {
        return (<div style={{display: 'none'}}></div>);
    }
};

export default BpUpdateDialog;