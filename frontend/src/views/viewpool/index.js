import * as React from "react";

import appState from '../../state/AppState';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import {CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import intl from "react-intl-universal";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";

const styles = theme => ({
    root: {
        flexShrink: 0,
        textAlign: 'center',
        marginTop: '1em',

    },
    card: {
        minWidth: "20em",
        maxWidth: "20em"
    },
    table: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    columnheader: {
        fontWeight: 700,
        // fontSize: 15,
        // flexGrow: 1
    },
    namecolumn: {
        flexGrow: 1
    },
    shareUrlInput: {
        marginLeft: '0.5em',
        width: '100%',

    },
    copyButton: {
        marginTop: '0.5em',
        marginLeft: '0em',
        marginRight: '0.3em'
    },
    input: {
        // color: 'red',
        // userSelect: 'text'
    },
    // notchedOutline: {
    //     // color: "yellow",
    //     borderColor: "yellow"
    // },
    // focused: {
    //     color: "yellow",
    //     // borderColor: "yellow",
    //     "& $notchedOutline": {
    //         // color: "yellow",
    //         borderColor: "yellow"
    //     }
    // },
    // '&$focused $notchedOutline': {
    //     borderColor: 'yellow',
    //     color: 'yellow'
    // },
});

class ViewPool extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            initialized: false
        };
    }

    componentDidMount() {
        const {key} = this.props.match.params;
        if (appState.poolData === null || appState.poolData.key !== key) {
            fetch(`${ViewPool.getHost()}/api/v1/pool/${key}`)
                .then(function (poolJsonFromServer) {
                    return poolJsonFromServer.json();
                })
                .then((poolJson) => {
                    appState.setPool(poolJson);
                    this.setState({initialized: true});
                    // this.forceUpdate();
                });
        } else {
            this.setState({initialized: true});
        }
    }

    static getHost() {
        let host = window.location.protocol + "//" + window.location.hostname;

        if (window.location.hostname === 'localhost') {
            host += ":8080"
        }
        return host;
    }

    static getOwner() {
        let participantsAndScores = appState.poolData.participantsAndScores;
        return participantsAndScores[0].participant.name;
    }

    static renderTableData() {
        return appState.poolData.participantsAndScores.map((participantAndScore, index) => {
            const participantName = participantAndScore.participant.name;
            const score = participantAndScore.score.homeClubScore + "-" + participantAndScore.score.awayClubScore;
            return (
                <TableRow key={participantName}>
                    <TableCell>
                        <Typography>{participantName}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{score}</Typography>
                    </TableCell>
                </TableRow>
            )
        });
    }

    selectShareUrl() {
        console.log("Hoi");
    }

    render() {
        const {classes} = this.props;

        return (
            this.state.initialized &&
            <Grid container justify="center" spacing={2} className={classes.root}
                  style={{marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"}}>
                <Grid key="definition" item>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h2">
                                {intl.get("POOL_MADE_BY", {organizer: ViewPool.getOwner()})}
                            </Typography>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow align="left">
                                        {/*<TableCell>&nbsp;</TableCell>*/}
                                        <TableCell className={classes.namecolumn}>
                                            <Typography className={classes.columnheader}>
                                                Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography className={classes.columnheader}>
                                                Score
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ViewPool.renderTableData()}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardActions>
                            <TextField
                                // disabled
                                id="outlined-name"
                                label="Share this pool:"
                                className={classes.shareUrlInput}
                                value={`${window.location.protocol}//${window.location.host}/?pool=${appState.poolData.key}`}
                                margin="normal"
                                variant="outlined"
                                InputProps={{
                                    classes: {
                                        notchedOutline: classes.notchedOutline,
                                        root: classes.input,
                                        focused: classes.focused
                                    }
                                }}
                            />
                            <IconButton className={classes.copyButton} color="inherit"
                                        aria-label="Copy" aria-haspopup="true">
                                <Icon>content_copy</Icon>
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        );

    }
}

export default withStyles(styles)(ViewPool);