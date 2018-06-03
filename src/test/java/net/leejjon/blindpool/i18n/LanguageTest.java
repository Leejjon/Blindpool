package net.leejjon.blindpool.i18n;

import net.leejjon.blindpool.servlets.MessageBundleServlet;
import org.junit.Test;

import java.io.IOException;
import java.util.Map;
import java.util.Properties;

public class LanguageTest {
    @Test
    public void testLoadProperties() throws IOException {
        Properties properties = MessageBundleServlet.getProperties("messages.properties");

        for (Map.Entry<Object,Object> entry : properties.entrySet()) {
            System.out.println(entry.getKey());
            System.out.println(entry.getValue());
        }
    }
}
