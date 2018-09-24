package net.leejjon.blindpool.api;

import net.leejjon.blindpool.constants.ResourceBundleKeys;
import net.leejjon.blindpool.model.ErrorResponse;
import net.leejjon.blindpool.model.Participant;
import net.leejjon.blindpool.model.Pool;
import net.leejjon.blindpool.storage.PoolDataService;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Path("v1/pool")
public class PoolApi {
    private final static Logger log = Logger.getLogger(PoolApi.class.getName());

//    @Inject
    private final PoolDataService poolDataService;

    public PoolApi(PoolDataService poolDataService) {
        this.poolDataService = poolDataService;
    }

    @GET
    @Path("{poolId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPool(@PathParam("poolId") String poolId) {
        try {
            if (poolId != null && !poolId.isEmpty()) {
                Pool pool = poolDataService.getPool(poolId).orElseThrow(NotFoundException::new);
                return Response.ok(pool).build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(new ErrorResponse(ResourceBundleKeys.POOL_NOT_FOUND)).build();
        } catch (Exception e) {
            String uuid = UUID.randomUUID().toString();
            log.log(Level.SEVERE, uuid + " " + e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), uuid).build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPool(List<String> participantNames) {
        try {
            // TODO: Some input validation.
            List<Participant> participants = participantNames.stream().map(Participant::new).collect(Collectors.toList());
            Pool pool = poolDataService.createPool(participants);
            return Response.ok(pool).build();
        } catch (Exception e) {
            String uuid = UUID.randomUUID().toString();
            log.log(Level.SEVERE, uuid + " " + e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), uuid).build();
        }
    }
}
