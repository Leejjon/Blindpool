package net.leejjon.blindpool.constants;

import lombok.Getter;

public enum ResourceBundleKeys {
    POOL_NOT_FOUND("pool.not.found");

    @Getter
    private final String key;

    ResourceBundleKeys(String key) {
        this.key = key;
    }
}
