package net.leejjon.blindpool.i18n;

import net.leejjon.blindpool.constants.ResourceBundleKeys;
import net.leejjon.blindpool.servlets.MessageBundleServlet;
import org.junit.Test;

import java.io.IOException;
import java.util.Properties;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

public class LanguageTest {
    @Test
    public void testIfResourceBundleKeysHaveValuesInFrontend() throws IOException {
        Properties properties = MessageBundleServlet.getProperties("messages.properties");
        Properties dutchProperties = MessageBundleServlet.getProperties("messages_nl.properties");

        for (ResourceBundleKeys key : ResourceBundleKeys.values()) {
            String property = properties.getProperty(key.getKey());
            assertNotNull(String.format("Could not find a value for key %s in English resource bundle.", key.getKey()), property);
            assertFalse(String.format("Could not find a valid value for key %s in English resource bundle.", property), property.isEmpty());

            String dutchProperty = dutchProperties.getProperty(key.getKey());
            assertNotNull(String.format("Could not find a value for key %s in English resource bundle.", key.getKey()), dutchProperty);
            assertFalse(String.format("Could not find a valid value for key %s in English resource bundle.", key.getKey()), dutchProperty.isEmpty());
        }
    }
}
