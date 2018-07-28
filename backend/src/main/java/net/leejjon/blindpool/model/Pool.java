package net.leejjon.blindpool.model;

import lombok.Getter;
import lombok.Setter;
import org.hashids.Hashids;

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
public class Pool {
    @Getter @Setter
    private String key;

    private final String match;

    private final String bet;

    private final Currency currency;

    private final long createdTimestamp;

    @Getter
    private final List<ParticipantScore> participantsAndScores;

    public Pool(long key, List<ParticipantScore> participantsAndScores, String match, String bet, Currency currency, long createdTimestamp) {
        this(participantsAndScores, match, bet, currency, createdTimestamp);
        this.key = new Hashids().encode(key);
    }

    /**
     * @param participantsAndScores The participants and the scores that were randomly assigned to them.
     * @param match Id of match that was selected. Can be null.
     */
    public Pool(List<ParticipantScore> participantsAndScores, String match, String bet, Currency currency, long createdTimestamp) {
        // TODO: Precondition to count that there is at least five participants.
        this.participantsAndScores = participantsAndScores;
        this.match = match;
        this.bet = bet;
        this.currency = currency;
        this.createdTimestamp = createdTimestamp;
    }

    public String getOwner() {
        return participantsAndScores.get(0).getParticipant().getName();
    }
}
