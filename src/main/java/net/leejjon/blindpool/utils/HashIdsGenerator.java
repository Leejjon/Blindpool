package net.leejjon.blindpool.utils;

import org.hashids.Hashids;

public class HashIdsGenerator {

    public static void main(String[] args) {
        Hashids hashIds = new Hashids();
        for (int i = 0; i < 100; i++) {
            String encode = hashIds.encode(i);
            System.out.println(encode);
        }
    }
}
