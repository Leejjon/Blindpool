package net.leejjon.blindpool.model;

import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode
public class Score {
    private final char homeClubScore;
    private final char awayClubScore;

    public Score(char homeClubScore, char awayClubScore) {
        this.homeClubScore = homeClubScore;
        this.awayClubScore = awayClubScore;
    }
}
