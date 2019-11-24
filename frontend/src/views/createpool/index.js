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
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import {Helmet} from "react-helmet";

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
        verticalAlign: 'text-top',
        padding: '0em',
        paddingTop: '1.7em',
        margin: '0em'
    },
    buttonColumn: {
        verticalAlign: 'text-top',
        padding: '0.3em',
        paddingTop: '0em',
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

const EMPTY_STRING = "";

// Create a unique instance of the same empty object.
const EMPTY_PLAYER = () => {
    return Object.assign({}, {name: EMPTY_STRING, valid: undefined});
};

class ViewCreatePool extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            players: [
                EMPTY_PLAYER(),
                EMPTY_PLAYER(),
                EMPTY_PLAYER(),
                EMPTY_PLAYER(),
                EMPTY_PLAYER()
            ]
        };
    }

    renderInputFields() {
        return this.state.players.map((player, index) => {
            let first = index <= 0;
            let invalidMessage = this.state.players[index].valid;
            return (
                <TableRow key={index} className={this.props.classes.row}>
                    <TableCell className={this.props.classes.numberColumn}>
                        <Typography className={this.props.classes.columnname}>
                            {index + 1}
                        </Typography>
                    </TableCell>
                    <TableCell className={this.props.classes.nameFields}>
                        <TextField
                            error={invalidMessage !== undefined}
                            helperText={invalidMessage !== undefined ? intl.get(invalidMessage) : undefined}
                            id={"nameField" + index}
                            className={this.props.classes.nameInputField}
                            margin="normal"
                            inputProps={{'aria-label': 'Player name ' + (index + 1)}}
                            onChange={(event) => this.onTextFieldChange(index, event)}>
                        </TextField>
                    </TableCell>
                    <TableCell align="right" className={this.props.classes.buttonColumn}>
                        <IconButton tabIndex="-1" aria-label={intl.get("REMOVE_PLAYER_X", {name: player.name})}
                                    className={this.props.classes.icon} disabled={first}
                                    onClick={() => this.removePlayer(index)}>
                            <Icon fontSize="default">
                                {!first ? "remove_circle_outline" : "person"}
                            </Icon>
                        </IconButton>
                    </TableCell>
                </TableRow>
            );
        });
    }

    onTextFieldChange = (index, event) => {
        const nameField = event.target;
        let updatedNameStatus = this.state.players;
        if (nameField.value) {
            updatedNameStatus[index].name = nameField.value.trim();
            this.validateState(updatedNameStatus);
        } else {
            updatedNameStatus[index].name = "";
            updatedNameStatus[index].valid = undefined;
            this.validateState(updatedNameStatus);
        }
        this.setState({players: updatedNameStatus});
    };

    /*
       This is not a pure function as it modifies state. Should probably improve it.
    */
    validateState(updatedNameStatus, complainAboutEmptyFields) {
        let allPlayersHaveAValidName = true;
        updatedNameStatus.forEach((player) => {
            const lettersAndNumbersOnly = /^([a-zA-Z0-9 _]+)$/;
            if (player.name) {
                if (!lettersAndNumbersOnly.test(player.name)) {
                    allPlayersHaveAValidName = false;
                    player.valid = "ILLEGAL_CHARACTER_MESSAGE";
                } else {
                    if (this.checkForDuplicates(player.name, updatedNameStatus)) {
                        player.valid = "DUPLICATE_MESSAGE";
                        allPlayersHaveAValidName = false;
                    } else {
                        player.valid = undefined;
                    }
                }
            } else {
                if (complainAboutEmptyFields) {
                    player.valid = "EMPTY_MESSAGE";
                } else {
                    player.valid = undefined;
                }
                allPlayersHaveAValidName = false;
            }
        });

        return allPlayersHaveAValidName;
    }

    checkForDuplicates(name, updatedNameStatus) {
        const duplicate = updatedNameStatus.filter(player => player.name === name);
        return duplicate.length > 1;
    }

    addPlayer = () => {
        let oneNewPlayerAdded = this.state.players;
        let numberOfPlayers = oneNewPlayerAdded.push(EMPTY_PLAYER());
        this.setState(oneNewPlayerAdded, () => {
            document.getElementById("nameField" + (numberOfPlayers - 1)).focus();
        });
    };

    removePlayer = (index) => {
        let first = index <= 0;
        if (!first) {
            let lessPlayers = this.state.players;
            lessPlayers.splice(index, 1);
            this.validateState(lessPlayers);
            this.setState({players: lessPlayers});
            this.updatePlayers();
        }
    };

    updatePlayers() {
        this.state.players.forEach((player, index) => {
            document.getElementById("nameField" + index).value = player.name;
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
                    <Helmet>
                        <title>{intl.get('TITLE')} - {intl.get('CREATE_POOL_TITLE')}</title>
                        <meta name="description" content={intl.get('CREATE_POOL_DESCRIPTION')}/>
                    </Helmet>
                    <Grid key="definition" item>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography variant="h2">
                                    {intl.get("CREATE_POOL")}
                                </Typography>
                                {/*border={1}*/}
                                <Table className={classes.table}>
                                    <colgroup>
                                        {/* Seems like a super stupid solution, but it works.*/}
                                        <col style={{width: '5%'}}/>
                                        <col style={{width: '85%'}}/>
                                        <col style={{width: '10%'}}/>
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.numberColumn}
                                                       align="left">&nbsp;</TableCell>
                                            <TableCell className={classes.nameHeader} align="left">
                                                <Typography className={classes.columnname}>
                                                    {intl.get("NAME_COLUMN_HEADER")}
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                className={this.props.classes.buttonColumn}>&nbsp;</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.renderInputFields()}
                                        <TableRow className={this.props.classes.row}>
                                            <TableCell className={this.props.classes.numberColumn}>
                                                <Typography className={this.props.classes.disabledNumber}>
                                                    {this.state.players.length + 1}
                                                </Typography>
                                            </TableCell>
                                            <TableCell className={this.props.classes.nameFields}>
                                                <TextField
                                                    id="standard-bare"
                                                    className={this.props.classes.nameInputField}
                                                    margin="normal"
                                                    disabled={true}
                                                    value={intl.get("ADD_PLAYER")}
                                                    inputProps={{'aria-label': 'Player name'}}>
                                                </TextField>
                                            </TableCell>
                                            <TableCell className={this.props.classes.buttonColumn}>
                                                <IconButton aria-label={intl.get("ADD_PLAYER")}
                                                            className={this.props.classes.icon}
                                                            onClick={() => this.addPlayer()}>
                                                    <Icon fontSize="default">add_circle_outline</Icon>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Button tabIndex="-1" onClick={this.sendCreatePoolRequest} size="large"
                                        className={classes.button}>
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
        let players = this.state.players;
        const validatedPlayers = this.validateState(players, true);
        this.setState({players: players});
        if (validatedPlayers) {
            let navigateToCreatePool = (poolJson) => {
                appState.setPool(poolJson);
                this.setState({loading: false});
                this.props.history.push(`/pool/${poolJson.key}`);
            };

            this.setState({loading: true});

            fetch(`${ViewCreatePool.getHost()}/api/v1/pool`,
                {
                    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                    method: "POST", body: JSON.stringify(this.state.players.map(player => player.name))
                })
                .then(function (response) {
                    // return response.text();
                    return response.json();
                })
                .then(navigateToCreatePool);
        } // Else it wasn't valid.
    };
}

export default withStyles(styles)(ViewCreatePool);