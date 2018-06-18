package net.leejjon.blindpool.servlets;

import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Properties;
import java.util.logging.Logger;

@WebServlet("/messages/")
public class MessageBundleServlet extends HttpServlet {
    private final static Logger log = Logger.getLogger(PoolServlet.class.getName());
    private static final Locale NL = new Locale("nl", "NL");

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setStatus(200);
        response.setHeader("Cache-Control", "private, no-store, no-cache, must-revalidate");
        response.setDateHeader("Expires", 0);

        String languageParameter = request.getParameter("lang");

        Properties messageBundle;
        if ((languageParameter != null && languageParameter.toLowerCase().equals("nl")) || request.getLocale().equals(NL)) {
            messageBundle = getProperties("messages_nl.properties");
        } else {
            messageBundle = getProperties("messages.properties");
        }

        PrintWriter writer = response.getWriter();
        writer.println(new Gson().toJson(messageBundle));
        writer.close();
    }

    public static Properties getProperties(String fileName) throws IOException {
        Properties prop = new Properties();
        prop.load(MessageBundleServlet.class.getResourceAsStream("/net/leejjon/blindpool/i18n/" + fileName));
        return prop;
    }
}
