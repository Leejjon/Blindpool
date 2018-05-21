package net.leejjon.blindpool.servlets;

import net.leejjon.blindpool.model.*;
import net.leejjon.blindpool.storage.PoolDataStore;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/pool/*")
public class PoolServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Participant participant = new Participant("Leejjon", UserType.ANONYMOUS, true);

        Score score = new Score(0,0);
        List<ParticipantScore> participantScores = new ArrayList<>();
        participantScores.add(new ParticipantScore(participant, score));

        Pool pool = new Pool(participantScores, null, null, null);
        Pool updatedPool = PoolDataStore.getInstance().createPool(pool);

        PrintWriter writer = response.getWriter();
        writer.println(updatedPool.getKey());
        writer.close();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo(); // /{value}/test
        PrintWriter writer = response.getWriter();
        writer.println("Path is: " + pathInfo.substring(1));
        writer.close();
        // TODO: Redirect to /?pool=ID
    }
}
