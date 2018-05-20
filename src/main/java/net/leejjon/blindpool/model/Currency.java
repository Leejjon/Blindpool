package net.leejjon.blindpool.model;

import lombok.Getter;

public enum Currency {
    EURO("€"),
    DOLLAR("$"),
    POUND("£");

    @Getter
    private final String currency;

    Currency(String currency) {
        this.currency = currency;
    }
}
