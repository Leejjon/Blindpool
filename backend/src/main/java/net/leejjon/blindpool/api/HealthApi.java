package net.leejjon.blindpool.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MediaType;

@Path("api/v1/health")
public class HealthApi {
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response checkHealth() {
        return Response.ok().entity("The server at least runs.").build();
    }
}
