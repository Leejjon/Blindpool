package net.leejjon.blindpool.server;

import com.google.cloud.datastore.DatastoreOptions;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import net.leejjon.blindpool.api.HealthApi;
import net.leejjon.blindpool.api.PoolApi;
import net.leejjon.blindpool.storage.PoolDataServiceImpl;

import java.net.URI;

public class Main {
    private static final String DEFAULT_PORT = System.getenv().get("PORT");
    private static final String DEFAULT_HOST = "0.0.0.0";

    // Base URI the Grizzly HTTP server will listen on
    private static final String BASE_URI = "http://%1$s:%2$s/";

    /**
     * Starts Grizzly HTTP server exposing JAX-RS resources defined in this application.
     */
    private static void startServer(String base, String port) {
        // create a resource config that registers the MyResource JAX-RS resource
        final ResourceConfig rc = new ResourceConfig();

        // Registering like this will give warnings like:
        // WARNING: A provider com.example.MyResource registered in SERVER runtime does not implement any provider interfaces applicable in the SERVER runtime. Due to constraint configuration problems the provider
        // com.example.MyResource will be ignored.
        // But it just works and according to stackoverflow this is a bug:
        // https://github.com/jersey/jersey/issues/3700
        rc.register(new PoolApi(new PoolDataServiceImpl(DatastoreOptions.getDefaultInstance().getService())));
        rc.register(new HealthApi());

        // Disable wadl because I never asked for this.
        rc.property("jersey.config.server.wadl.disableWadl", true);

        // create and start a new instance of grizzly http server
        // exposing the Jersey application at BASE_URI
        GrizzlyHttpServerFactory.createHttpServer(URI.create(String.format(BASE_URI, base, DEFAULT_PORT)), rc);
    }

    /**
     * Main method.
     * @param args Should contain "localhost" or "0.0.0.0".
     */
    public static void main(String[] args) {
        String base = args.length > 0 ? args[0] : DEFAULT_HOST;
        String port = args.length > 1 ? args[1] : DEFAULT_PORT;
        startServer(base, port);
        System.out.println(String.format("Jersey app started at %s", String.format(BASE_URI, base, port)));
    }
}
