module blindpool.backend {
    requires google.cloud.core;
    requires google.cloud.datastore;
    requires grizzly.http.server;
    requires java.json.bind;
    requires jersey.container.grizzly2.http;
    requires jersey.server;
    requires jersey.common;
    requires lombok;
    requires java.ws.rs;
    requires java.logging;
    requires gson;
    requires hashids;

    exports net.leejjon.blindpool.api to jersey.server;
    exports net.leejjon.blindpool.model to org.eclipse.yasson;

    exports net.leejjon.blindpool.server;
}