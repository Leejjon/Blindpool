package net.leejjon.blindpool.model;

import lombok.Value;

import java.util.*;

@Value
public class CreatePoolResponse {
    private final String key;
    private final List<Score> scores;

    public CreatePoolResponse(String key, List<Score> scores) {
        this.key = key;
        this.scores = scores;
    }
}
