package net.leejjon.blindpool.api;

import net.leejjon.blindpool.storage.PoolDataServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

@ExtendWith(MockitoExtension.class)
public class ExampleTest {
    @Mock
    private List list;

    @Test
    public void testSomething() {
        list.add(100);

    }
}
