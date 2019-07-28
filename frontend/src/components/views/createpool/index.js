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
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    columnname: {
        fontWeight: 700,
        fontSize: 15,
        flexGrow: 1
    },
    namecolumn: {
        flexGrow: 1
    }
});

class ViewCreatePool extends Component {
    render() {
        const {classes} = this.props;
        return (
            <Grid container justify="center" spacing={2} className={classes.root}
                  style={{marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"}}>
                <Grid key="definition" item>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h2">
                                {intl.get("CREATE_POOL")}
                            </Typography>
                            {/*<Divider style={{marginTop: "0.5em"}} component="hr" />*/}
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow align="left">
                                        <TableCell>&nbsp;</TableCell>
                                        <TableCell align="left" className={classes.namecolumn}>
                                            <Typography className={classes.columnname}>
                                                Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell>&nbsp;</TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                            <Button size="large" className={classes.button}>
                                {intl.get("CREATE_POOL")}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ViewCreatePool);