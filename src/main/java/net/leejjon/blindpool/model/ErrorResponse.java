package net.leejjon.blindpool.model;

import net.leejjon.blindpool.constants.ResourceBundleKeys;

public class ErrorResponse {
    private final String errorMessage;

    public ErrorResponse(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public ErrorResponse(ResourceBundleKeys key) {
        this.errorMessage = key.getKey();
    }
}
