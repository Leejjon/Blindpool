package net.leejjon.blindpool.model;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * <p>In the Netherlands, people talk about a 'Poule' as some sort of competition where the participants
 * predict scores from sport matches.</p>
 *
 * <p>According to this website, the official Ducth name is "pool", but "pool" is also the name of a Polish person:
 * https://onzetaal.nl/taaladvies/pool-poule/</p>
 *
 * <p>In english the word "Pool" is being used too. The phrase "prize pool"
 * is commonly used in lotteries. But it wasn't until I realized that Deadpool
 * is also a reference to the meaning of "Poule". In the first Deadpool movie they
 * have a competition where they predict who is going to die first, and they
 * call it the dead pool. Later Wade Willson decides that it will become his
 * superhero name.</p>
 *
 * @author Leejjon
 */
@Builder
@EqualsAndHashCode
public class Pool {
    @Getter @Setter
    private String key;

    @Getter
    private final List<ParticipantScore> participantsAndScores;

    private final String match;

    private final String bet;

    private final Currency currency;

    private final long createdTimestamp;

    public Pool(String key, List<ParticipantScore> participantsAndScores, long createdTimestamp) {
        this(key, participantsAndScores, createdTimestamp, null, null, null);
    }

    /**
     * @param participantsAndScores The participants and the scores that were randomly assigned to them.
     * @param match Id of match that was selected. Can be null.
     */
    public Pool(String key, List<ParticipantScore> participantsAndScores, long createdTimestamp, String match, String bet, Currency currency) {
        // TODO: Precondition for length of number of participants?
        this.key = key;
        this.participantsAndScores = participantsAndScores;
        this.createdTimestamp = createdTimestamp;
        this.match = match;
        this.bet = bet;
        this.currency = currency;
    }

    public String getOwner() {
        return participantsAndScores.get(0).getParticipant().getName();
    }
}
