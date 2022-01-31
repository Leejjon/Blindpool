import React from "react";
import {BpSnackbarMessage} from "../../App";
import {makeStyles, Table, TableBody} from "@material-ui/core";

const useStyles = makeStyles({
        margin1em: {
            margin: '0.5em',
        },
        errorMessage: {
            color: 'white'
        },
        table: {
            width: '100%',
            overflowX: 'auto',
        },
    }
);

const BpCompetitionPreferences: React.FC<BpSnackbarMessage> = ({message, setMessage}) => {
    const classes = useStyles();
    return (
        <Table className={classes.table}>
            <TableBody>
                <tr>
                    <td></td>
                </tr>
            </TableBody>
        </Table>
    );
};
