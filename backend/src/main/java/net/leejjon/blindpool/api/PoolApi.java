package net.leejjon.blindpool.api;

import net.leejjon.blindpool.model.Pool;
import net.leejjon.blindpool.storage.PoolDataStore;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.logging.Level;
import java.util.logging.Logger;

@Path("v1/pool")
public class PoolApi {
    private final static Logger log = Logger.getLogger(PoolApi.class.getName());

    @GET
    @Path("{poolId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPool(@PathParam("poolId") String poolId) {
        try {
            if (poolId != null && !poolId.isEmpty()) {
                Pool pool = PoolDataStore.getInstance().getPool(poolId).orElseThrow(NotFoundException::new);
                return Response.ok(pool).build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).build();
        } catch (Exception e) {
            log.log(Level.SEVERE, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }
}
