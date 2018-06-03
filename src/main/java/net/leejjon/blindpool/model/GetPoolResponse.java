package net.leejjon.blindpool.model;

import lombok.Value;

@Value
public class GetPoolResponse {
    private final String key;


    public GetPoolResponse(String key) {
        this.key = key;
    }
}
