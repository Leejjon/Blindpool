
package net.leejjon.blindpool.storage;

public enum Kind {
    /**
     * This is the kind used by Google App Engine to store session objects.
     */
    AH_SESSION("_ah_SESSION"),
    POOL_COUNTER_SHARD("poolCounter"),
    /**
     * The pool object.
     */
    POOL("pool");
    
    private final String kind;

    Kind(String kind) {
        this.kind = kind;
    }
    
    @Override
    public String toString() {
        return kind;
    }
}
