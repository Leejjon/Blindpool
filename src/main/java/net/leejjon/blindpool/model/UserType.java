package net.leejjon.blindpool.model;

import com.google.gson.annotations.SerializedName;

/**
 * I like enums as a way to store constants because they are more readable, but I don't want to store the full
 * enumeration name in the Google Datastore. So I use the @SerializeName annotation to only store a number.
 */
public enum UserType {
    @SerializedName("0") ANONYMOUS,
    @SerializedName("1") FACEBOOK,
    @SerializedName("2") GOOGLE;
}
