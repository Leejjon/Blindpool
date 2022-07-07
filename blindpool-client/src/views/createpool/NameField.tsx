import React, {ChangeEvent} from "react";
import {IconButton, TableCell, TableRow, TextField, Typography} from "@mui/material";
import Player from "../../model/Player";
import {useTranslation} from "react-i18next";
import {Person, RemoveCircleOutline} from "@mui/icons-material";

export interface PlayerNameProps {
    player: Player,
    index: number,
    removePlayer: (index: number) => void,
    onTextFieldChange: (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isBlur: boolean) => void
}

const NameField: React.FC<PlayerNameProps> = ({player, index, removePlayer, onTextFieldChange}) => {
    const {t} = useTranslation();
    let first = index <= 0;
    let invalidMessage = player.valid;
    return (
        <TableRow>
            <TableCell sx={{verticalAlign: "text-top", padding: "0", paddingTop: "1.7em", margin: "0"}}>
                <Typography sx={{fontWeight: 700, fontSize: 15, flexGrow: 1}}>
                    {index + 1}
                </Typography>
            </TableCell>
            <TableCell sx={{paddingLeft: "1em", paddingRight: "0"}}>
                <TextField
                    error={invalidMessage !== undefined}
                    helperText={invalidMessage !== undefined ? t(invalidMessage) : undefined}
                    id={'nameField' + index}
                    variant="standard"
                    sx={{paddingTop: "0", marginTop: "0", marginBottom: "0", width: "100%"}}
                    margin="normal"
                    value={player.name}
                    inputProps={{'aria-label': 'Player name ' + (index + 1)}}
                    onChange={(event) => onTextFieldChange(index, event, false)}
                    onBlur={(event) => onTextFieldChange(index, event, true)}>
                </TextField>
            </TableCell>
            <TableCell align="right" sx={{verticalAlign: "text-top", padding: "0.3em", paddingTop: "0"}}>
                <IconButton tabIndex={-1} aria-label={t("REMOVE_PLAYER_X", {index: index + 1})}
                            disabled={first} onClick={() => removePlayer(index)}
                            sx={{color: "black"}}>
                    {!first ? <RemoveCircleOutline/> : <Person/>}
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

export default NameField;
