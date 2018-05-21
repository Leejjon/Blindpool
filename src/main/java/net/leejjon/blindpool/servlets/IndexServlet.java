package net.leejjon.blindpool.servlets;

import com.google.appengine.api.datastore.EntityNotFoundException;
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
        String pool = req.getParameter("pool");
        if (pool != null && !pool.isEmpty()) {
            PoolDataStore pds = PoolDataStore.getInstance();
            try {
                req.setAttribute("poolData", pds.getPool(pool));
            } catch (EntityNotFoundException e) {
                log.log(Level.WARNING, "Could not find entity " + pool);
            }
        }

        // Still just load the contents of index.jsp
        RequestDispatcher dispatcher = req.getRequestDispatcher("index.jsp");
        dispatcher.include(req, resp);
    }
}
