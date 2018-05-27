package net.leejjon.blindpool.servlets;

import net.leejjon.blindpool.storage.PoolDataStore;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/")
public class IndexServlet extends HttpServlet {
    private final static Logger log = Logger.getLogger(IndexServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String poolParameter = req.getParameter("pool");
        if (poolParameter != null && !poolParameter.isEmpty()) {
            PoolDataStore pds = PoolDataStore.getInstance();

            pds.getPool(poolParameter).ifPresent(pool -> req.setAttribute("poolData", pool));
        }

        // Still just load the contents of index.jsp
        RequestDispatcher dispatcher = req.getRequestDispatcher("index.jsp");
        dispatcher.include(req, resp);
    }
}
