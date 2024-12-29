import { useOutletContext } from "react-router";
import type { BpSnackbarProps } from "./BpContext";

export function useSnackbar(setMessage: (message?: string) => void, message?: string): BpSnackbarProps {
    return {
        message,
        setMessage
    }
}

export function useSnackbar2(): BpSnackbarProps {
    return useOutletContext<BpSnackbarProps>();
}