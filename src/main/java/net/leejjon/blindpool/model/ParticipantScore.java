package net.leejjon.blindpool.model;

import lombok.Value;

@Value
public class ParticipantScore {
    private final Participant participant;
    private final Score score;

    public ParticipantScore(Participant participant, Score score) {
        this.participant = participant;
        this.score = score;
    }
}
