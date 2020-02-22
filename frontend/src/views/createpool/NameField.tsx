import React, {ChangeEvent} from "react";
import {Icon, IconButton, makeStyles, TableCell, TableRow, TextField, Typography} from "@material-ui/core";
import Player from "../../model/Player";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles({
    numberColumn: {
        verticalAlign: 'text-top',
        padding: '0em',
        paddingTop: '1.7em',
        margin: '0em'
    },
    columnname: {
        fontWeight: 700,
        fontSize: 15,
        flexGrow: 1,
    },
    nameFields: {
        paddingLeft: '1em',
        paddingRight: '0em'
    },
    nameInputField: {
        paddingTop: '0em',
        marginTop: '0em',
        marginBottom: '0em',
        width: '100%'
    },
    buttonColumn: {
        verticalAlign: 'text-top',
        padding: '0.3em',
        paddingTop: '0em',
        //paddingRight: '0em'
    },
    icon: {
        color: 'black',
    },
});

export interface PlayerNameProps {
    player: Player,
    index: number,
    removePlayer: (index: number) => void,
    onTextFieldChange: (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const NameField: React.FC<PlayerNameProps> = ({player, index, removePlayer, onTextFieldChange}) => {
    const classes = useStyles();
    const {t} = useTranslation();
    let first = index <= 0;
    let invalidMessage = player.valid;
    return (
        <TableRow>
            <TableCell className={classes.numberColumn}>
                <Typography className={classes.columnname}>
                    {index + 1}
                </Typography>
            </TableCell>
            <TableCell className={classes.nameFields}>
                <TextField
                    error={invalidMessage !== undefined}
                    helperText={invalidMessage !== undefined ? t(invalidMessage) : undefined}
                    id={'nameField' + index}
                    className={classes.nameInputField}
                    margin="normal"
                    inputProps={{'aria-label': 'Player name ' + (index + 1)}}
                    onChange={(event) => onTextFieldChange(index, event)}>
                </TextField>
            </TableCell>
            <TableCell align="right" className={classes.buttonColumn}>
                <IconButton tabIndex={-1} aria-label={t("REMOVE_PLAYER_X", {index: index + 1})}
                            className={classes.icon} disabled={first}
                            onClick={() => removePlayer(index)}>
                    <Icon fontSize="default">
                        {!first ? "remove_circle_outline" : "person"}
                    </Icon>
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

export default NameField;