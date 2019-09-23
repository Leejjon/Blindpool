import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import {CardContent} from "@material-ui/core";
import intl from "react-intl-universal";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";

import appState from '../../state/AppState';
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
    root: {
        flexShrink: 0,
        textAlign: 'center',
        marginTop: '1em',
    },
    button: {
        color: 'white',
        backgroundColor: '#00cc47',
        '&:hover': {
            backgroundColor: '#00cc47',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#73e39a',
        },
        border: 0,
        // borderRadius: 3,
        fontWeight: 'bolder',
        fontSize: 15
    },
    card: {
        minWidth: "20em",
        maxWidth: "20em"
    },
    table: {
        width: '100%',
        // marginTop: theme.spacing(3),
        overflowX: 'auto',
        marginBottom: '1em'
    },
    numberColumn: {
        padding: '0em',
        margin: '0em'
    },
    buttonColumn: {
        padding: '0.3em',
        paddingTop: '0.7em',
        //paddingRight: '0em'
    },
    columnname: {
        fontWeight: 700,
        fontSize: 15,
        flexGrow: 1,
    },
    progress: {
        margin: theme.spacing(2),
    },
    icon: {
        color: 'black',
    },
    nameHeader: {
        // margin: '0px',
        paddingTop: '2em',
        paddingLeft: '1em',
        paddingBottom: '1em'
    },
    nameInputField: {
        paddingTop: '0em',
        marginTop: '0em',
        marginBottom: '0em',
        width: '100%'
    },
    nameFields: {
        paddingLeft: '1em',
        paddingRight: '0em'
    },
    addButton: {
        margin: '0.5em',
        // backgroundColor: 'black'
    },
    addIcon: {
        margin: '0.5em',
        color: 'black'
    },
    disabledNumber: {
        color: 'gray'
    }
});

class ViewCreatePool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    renderInputFields() {
        return ["Leon", "Dirk", "Robbie", "Jaimy", "Joop"].map((playerName, index) => {
            let first = index <= 0;
            return (
                <TableRow className={this.props.classes.row}>
                    <TableCell className={this.props.classes.numberColumn}>
                        <Typography className={this.props.classes.columnname}>
                        {++index}
                        </Typography>
                    </TableCell>
                    <TableCell className={this.props.classes.nameFields}>
                        <TextField
                            id="standard-bare"
                            className={this.props.classes.nameInputField}
                            defaultValue={playerName}
                            margin="normal"
                            inputProps={{ 'aria-label': 'Player name' + ++index }}>
                        </TextField>
                    </TableCell>
                    <TableCell align="right" className={this.props.classes.buttonColumn}>
                        <IconButton aria-label={intl.get("REMOVE_PLAYER_X", {name: playerName})} className={this.props.classes.icon} disabled={first}>
                            <Icon fontSize="default">
                                {!first ? "remove_circle_outline" : "person"}
                            </Icon>
                        </IconButton>
                    </TableCell>
                </TableRow>
            );
        });
    }

    render() {
        const {classes} = this.props;
        if (this.state.loading) {
            return <CircularProgress className={classes.progress}/>
        } else {
            return (
                <Grid container justify="center" spacing={2} className={classes.root}
                      style={{marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"}}>
                    <Grid key="definition" item>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography variant="h2">
                                    {intl.get("CREATE_POOL")}
                                </Typography>
                                {/*<Divider style={{marginTop: '0.5em'}} />*/}
                                {/*border={1}*/}
                                <Table className={classes.table}>
                                    <colgroup>
                                        {/* Seems like a super stupid solution, but it works.*/}
                                        <col style={{width:'5%'}}/>
                                        <col style={{width:'85%'}}/>
                                        <col style={{width:'10%'}}/>
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.numberColumn} align="left">&nbsp;</TableCell>
                                            <TableCell className={classes.nameHeader} align="left">
                                                <Typography className={classes.columnname}>
                                                    Name
                                                </Typography>
                                            </TableCell>
                                            <TableCell  className={this.props.classes.buttonColumn}>&nbsp;</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.renderInputFields()}
                                        <TableRow className={this.props.classes.row}>
                                            <TableCell className={this.props.classes.numberColumn}>
                                                <Typography className={this.props.classes.disabledNumber}>
                                                    6
                                                </Typography>
                                            </TableCell>
                                            <TableCell className={this.props.classes.nameFields}>
                                                <TextField
                                                    id="standard-bare"
                                                    className={this.props.classes.nameInputField}
                                                    margin="normal"
                                                    disabled={true}
                                                    value={intl.get("ADD_PLAYER")}
                                                    inputProps={{ 'aria-label': 'Player name'}}>
                                                </TextField>
                                            </TableCell>
                                            <TableCell className={this.props.classes.buttonColumn}>
                                                <IconButton aria-label={intl.get("ADD_PLAYER")} className={this.props.classes.icon}>
                                                    <Icon fontSize="default">add_circle_outline</Icon>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Button onClick={this.sendCreatePoolRequest} size="large" className={classes.button}>
                                    {intl.get("CREATE_POOL").toUpperCase()}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            );
        }
    }

    static getHost() {
        let host = window.location.protocol + "//" + window.location.hostname;

        if (window.location.hostname === 'localhost') {
            host += ":8080"
        }
        return host;
    }

    sendCreatePoolRequest = () => {
        let navigateToCreatePool = (myJson) => {
            console.log(JSON.stringify(myJson));

            appState.setPool(myJson);
            this.setState({loading: false});
            this.props.history.push(`/pool/${myJson.key}`);
        };

        this.setState({loading: true});
        fetch(`${ViewCreatePool.getHost()}/api/v1/pool`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(["Leon", "Dirk", "Robert", "Niels", "Jaimy", "Joop"])
            })
            .then(function(response) {
                // return response.text();
                return response.json();
            })
            .then(navigateToCreatePool);
    };
}

export default withStyles(styles)(ViewCreatePool);