
package net.leejjon.blindpool.tags;

import java.io.IOException;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.SimpleTagSupport;
import net.leejjon.blindpool.storage.PoolDataStore;

public class PoolDataTagSupport extends SimpleTagSupport {
    @Override
    public void doTag() throws JspException, IOException {
        final JspWriter out = getJspContext().getOut();
        out.print(new PoolDataStore().countPools());
    }
}
