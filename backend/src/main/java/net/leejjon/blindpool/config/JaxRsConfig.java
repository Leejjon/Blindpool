package net.leejjon.blindpool.config;

import net.leejjon.blindpool.api.PoolApi;
import net.leejjon.blindpool.storage.PoolDataServiceImpl;
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
        // Initialize the PoolApi and inject a service on runtime (that can be mocked in tests).
        register(new PoolApi(new PoolDataServiceImpl()));
    }
}
