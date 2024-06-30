import { Alert, Snackbar, Typography } from "@mui/material";

export interface BpSnackbarMessageProps {
    message?: string,
    setMessage: (message?: string) => void
}

const BpSnackbar: React.FC<BpSnackbarMessageProps> = ({message, setMessage}) => {
    const handleClose = (event: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessage(undefined);
    };

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={message !== undefined}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}>
            <Alert elevation={1} variant="filled" severity="warning" className="warningAlert">
                <Typography variant="body1" component="p"
                    sx={{ color: "white" }}>{message !== undefined ? t(message) : null}</Typography>
            </Alert>
        </Snackbar>
    );
}

export default BpSnackbar;