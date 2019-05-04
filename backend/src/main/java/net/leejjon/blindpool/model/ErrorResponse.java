package net.leejjon.blindpool.model;

import net.leejjon.blindpool.constants.ResourceBundleKeys;
import lombok.Getter;

public class ErrorResponse {
    @Getter // The field needs a getter to be serialized to json.
    private final String errorMessage;

    public ErrorResponse(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public ErrorResponse(ResourceBundleKeys key) {
        this.errorMessage = key.getKey();
    }
}
