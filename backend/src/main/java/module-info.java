module blindpool.backend {
    requires google.cloud.datastore;
    requires grizzly.http.server;
    requires jersey.container.grizzly2.http;
    requires jersey.server;
    requires jersey.common;
    requires lombok;
    requires java.ws.rs;
    requires java.logging;
    requires gson;
    requires google.cloud.core;
    requires hashids;

    exports net.leejjon.blindpool.server;
}