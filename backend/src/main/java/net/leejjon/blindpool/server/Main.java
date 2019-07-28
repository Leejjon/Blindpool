package net.leejjon.blindpool.server;

import com.google.cloud.datastore.DatastoreOptions;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import net.leejjon.blindpool.api.HealthApi;
import net.leejjon.blindpool.api.PoolApi;
import net.leejjon.blindpool.storage.PoolDataServiceImpl;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import java.io.IOException;
import java.net.URI;

public class Main {
    private static final String PRODUCTION_HOST = "0.0.0.0";
    private static final String PRODUCTION_PORT = System.getenv().get("PORT");
    private static final String LOCAL_HOST = "localhost";
    private static final String LOCAL_PORT = "8080";


    // Base URI the Grizzly HTTP server will listen on
    private static final String BASE_URI = "http://%1$s:%2$s/";

    /**
     * Starts Grizzly HTTP server exposing JAX-RS resources defined in this application.
     */
    private static void startServer(boolean developing) {
        // create a resource config that registers the MyResource JAX-RS resource
        final ResourceConfig rc = new ResourceConfig();

        // Registering like this will give warnings like:
        // WARNING: A provider com.example.MyResource registered in SERVER runtime does not implement any provider interfaces applicable in the SERVER runtime. Due to constraint configuration problems the provider
        // com.example.MyResource will be ignored.
        // But it just works and according to stackoverflow this is a bug:
        // https://github.com/jersey/jersey/issues/3700
        rc.register(new PoolApi(new PoolDataServiceImpl(DatastoreOptions.getDefaultInstance().getService())));
        rc.register(new HealthApi());

        if (developing) {
            final String HEADERS = "Origin, Content-Type, Accept";
            final String ALLOW_ORIGIN = "Access-Control-Allow-Origin";
            final String ALLOW_HEADERS = "Access-Control-Allow-Headers";
            final String ALLOW_METHODS = "Access-Control-Allow-Methods";

            // Don't tell me to use a lambda instead of anonymous class here. In a register method where you can put
            // like any object you'd never guess it's about a ContainerResponseFilter.
            rc.register(new ContainerResponseFilter() {
                @Override
                public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
                    responseContext.getHeaders().add(ALLOW_ORIGIN, "*");
                    responseContext.getHeaders().add(ALLOW_HEADERS, HEADERS);
                    responseContext.getHeaders().add(ALLOW_METHODS, "GET, POST, PUT, DELETE, OPTIONS, HEAD");
                }
            });
        }

        // Disable wadl because I never asked for this.
        rc.property("jersey.config.server.wadl.disableWadl", false);

//        rc.property("jersey.config.server.tracing.type", "ALL");
//        rc.property("jersey.config.server.tracing.threshold", "VERBOSE");

        final String base = developing ? LOCAL_HOST : PRODUCTION_HOST;
        final String port = developing ? LOCAL_PORT : PRODUCTION_PORT;

        System.out.println(String.format("Jersey app started at %s", String.format(BASE_URI, base, port)));

        // create and start a new instance of grizzly http server
        // exposing the Jersey application at BASE_URI
        GrizzlyHttpServerFactory.createHttpServer(URI.create(String.format(BASE_URI, base, port)), rc);
    }

    /**
     * Main method.
     * @param args Should contain "DEV" if you want to run locally.
     */
    public static void main(String[] args) {
//        Logger rootLogger = LogManager.getLogManager().getLogger("");
//        rootLogger.setLevel(Level.ALL);
//        for (Handler h : rootLogger.getHandlers()) {
//            h.setLevel(Level.ALL);
//        }

        boolean developing = false;
        if (args.length > 0 && args[0].contains("DEV")) {
            developing = true;
        }
        startServer(developing);
    }
}
