package net.leejjon.blindpool.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MediaType;
import java.util.logging.Logger;

@Path("api/v1/health")
public class HealthApi {
    private Logger log = Logger.getLogger(HealthApi.class.getName());

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response checkHealth() {
        log.info("Test if we even get here.");
        return Response.ok().entity("The server at least runs.").build();
    }
}
