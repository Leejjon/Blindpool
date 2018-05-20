package net.leejjon.blindpool.model;

import lombok.Value;

@Value
public class Score {
    private final int homeClubScore;
    private final int awayClubScore;

    public Score(int homeClubScore, int awayClubScore) {
        this.homeClubScore = homeClubScore;
        this.awayClubScore = awayClubScore;
    }
}
