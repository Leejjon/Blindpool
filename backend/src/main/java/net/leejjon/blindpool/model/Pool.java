package net.leejjon.blindpool.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;

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
@EqualsAndHashCode
public class Pool {
    @Getter
    private final String key;

    @Getter
    private final List<ParticipantScore> PARTICIPANTS_AND_SCORES;

    private final String match;

    private final String bet;

    private final Currency currency;

    private final long CREATED_TIMESTAMP;

    public Pool(String key, List<ParticipantScore> PARTICIPANTS_AND_SCORES, long CREATED_TIMESTAMP) {
        this(key, PARTICIPANTS_AND_SCORES, CREATED_TIMESTAMP, null, null, null);
    }

    /**
     * @param PARTICIPANTS_AND_SCORES The participants and the scores that were randomly assigned to them.
     * @param match Id of match that was selected. Can be null.
     */
    public Pool(String key, List<ParticipantScore> PARTICIPANTS_AND_SCORES, long CREATED_TIMESTAMP, String match, String bet, Currency currency) {
        // TODO: Precondition for length of number of participants?
        this.key = key;
        this.PARTICIPANTS_AND_SCORES = PARTICIPANTS_AND_SCORES;
        this.CREATED_TIMESTAMP = CREATED_TIMESTAMP;
        this.match = match;
        this.bet = bet;
        this.currency = currency;
    }
}
