package net.leejjon.blindpool.config;

import net.leejjon.blindpool.api.PoolApi;
import net.leejjon.blindpool.storage.PoolDataService;
import net.leejjon.blindpool.storage.PoolDataStore;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;

import javax.ws.rs.ApplicationPath;

/** This annotation is the equivalent of:
 *     <servlet>
 *         <servlet-name>backend</servlet-name>
 *         <servlet-class>org.glassfish.jersey.servlet.ServletContainer</servlet-class>
 *         <init-param>
 *             <param-name>jersey.config.server.provider.packages</param-name>
 *             <param-value>net.leejjon.blindpool.api</param-value>
 *         </init-param>
 *         <load-on-startup>1</load-on-startup>
 *     </servlet>
 *     <servlet-mapping>
 *         <servlet-name>backend</servlet-name>
 *         <url-pattern>/api/*</url-pattern>
 *     </servlet-mapping>
 */
@ApplicationPath("/api/*")
public class JaxRsConfig extends ResourceConfig {
    public JaxRsConfig() {

        // Make sure the fields with @Inject annotations are initialized with
//        register(new AbstractBinder() {
//            @Override
//            protected void configure() {
//                bind(PoolDataStore.class).to(PoolDataService.class);
//            }
//        });

        // Initialize the PoolApi and inject
        register(new PoolApi(new PoolDataStore()));
    }
}
