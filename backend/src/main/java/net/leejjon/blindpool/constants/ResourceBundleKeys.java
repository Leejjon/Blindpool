package net.leejjon.blindpool.constants;

import lombok.Getter;

import java.io.IOException;
import java.util.Properties;

public enum ResourceBundleKeys {
    POOL_NOT_FOUND("pool.not.found");

    @Getter
    private final String key;

    ResourceBundleKeys(String key) {
        this.key = key;
    }

    public static Properties getProperties(String fileName) throws IOException {
        Properties prop = new Properties();
        prop.load(ResourceBundleKeys.class.getResourceAsStream("/net/leejjon/blindpool/i18n/" + fileName));
        return prop;
    }
}
