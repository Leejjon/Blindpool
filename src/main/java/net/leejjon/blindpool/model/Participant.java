
package net.leejjon.blindpool.model;

import lombok.Value;

@Value
public class Participant {
    private final String name;
    private final UserType userType;

    public Participant(String name, UserType userType) {
        this.name = name;
        this.userType = userType;
    }
}
