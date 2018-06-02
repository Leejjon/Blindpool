package net.leejjon.blindpool.servlets;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import net.leejjon.blindpool.model.*;
import net.leejjon.blindpool.storage.PoolDataStore;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@WebServlet("/pool/")
public class PoolServlet extends HttpServlet {
    private final static Logger log = Logger.getLogger(PoolServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setStatus(200);

        String poolKeyParameter = request.getParameter("pool");

        Optional<Pool> optionalPool = PoolDataStore.getInstance().getPool(poolKeyParameter);
        if (optionalPool.isPresent()) {
            Pool pool = optionalPool.get();
            GetPoolResponse poolResponse = new GetPoolResponse(pool.getKey());

            PrintWriter writer = response.getWriter();
            writer.println(new Gson().toJson(poolResponse));
            writer.close();
        } else {
            PrintWriter writer = response.getWriter();
            writer.println("Your request sucked.");
            writer.close();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        response.setContentType("application/json");
        response.setStatus(200);

        StringBuffer jb = new StringBuffer();
        String line;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) {
            response.setStatus(400);
            PrintWriter writer = response.getWriter();
            writer.println("Your request sucked.");
            writer.close();
        }

        CreatePoolResponse poolResponse = PoolDataStore.getInstance().createPool(convertRequestParameterToParticipantList(jb.toString()));

        // Return only the data that the client doesn't already know. This goes against restful principles but will save bandwidth.
        PrintWriter writer = response.getWriter();
        writer.println(new Gson().toJson(poolResponse));
        writer.close();
    }

    private List<Participant> convertRequestParameterToParticipantList(String poolJson) {
        Type listType = new TypeToken<List<String>>() {}.getType();
        List<String> participantNames = new Gson().fromJson(poolJson, listType);

        boolean firstEntry = true;
        List<Participant> participants = new ArrayList<>(participantNames.size());
        for (String participantName : participantNames) {
            if (firstEntry) {
                firstEntry = false;
            }
            participants.add(new Participant(participantName, UserType.ANONYMOUS));
        }
        return participants;
    }
}
