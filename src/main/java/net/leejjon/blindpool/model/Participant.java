
package net.leejjon.blindpool.model;

import lombok.Value;

@Value
public class Participant {
    private final String name;
    private final UserType userType;
    private final boolean isPoolCreator;

    public Participant(String name, UserType userType, boolean isPoolCreator) {
        this.name = name;
        this.userType = userType;
        this.isPoolCreator = isPoolCreator;
    }
}
