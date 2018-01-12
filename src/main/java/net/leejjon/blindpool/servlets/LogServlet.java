package net.leejjon.blindpool.servlets;

import com.google.appengine.api.log.AppLogLine;
import com.google.appengine.api.log.LogQuery;
import com.google.appengine.api.log.LogServiceFactory;
import com.google.appengine.api.log.RequestLogs;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.TimeZone;

@WebServlet(
	name = "logs",
	description = "Logs: Display 5 lines of the request log",
	urlPatterns = "/logs"
)

public class LogServlet extends HttpServlet {
	 @Override
	 public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

		  resp.setContentType("text/plain");
		  PrintWriter writer = resp.getWriter();

		  // We use this to break out of our iteration loop, limiting record
		  // display to 5 request logs at a time.
		  int limit = 100;

		  // This retrieves the offset from the Next link upon user click.
		  String offset = req.getParameter("offset");

		  // We want the App logs for each request log
		  LogQuery query = new LogQuery();
		  query.includeAppLogs(true);

		  // Set the offset value retrieved from the Next link click.
		  if (offset != null) {
				query.offset(offset);
		  }

		  int count = 0;


		  // Display a few properties of each request log.
		  Iterable<RequestLogs> fetch = LogServiceFactory.getLogService().fetch(query);
		  for (RequestLogs record : LogServiceFactory.getLogService().fetch(query)) {
				if (record.getAppLogLines().size() > 0) {
					 writer.print("Request from ");
					 LocalDateTime reqTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(record.getStartTimeUsec()), TimeZone.getDefault().toZoneId());
					 writer.print("IP: " + record.getIp());
					 writer.print(" Method: " + record.getMethod());
					 writer.print(" Resource: " + record.getResource());
					 writer.println(String.format(" Date: %s", reqTime.toString()));

					 // Display all the app logs for each request log.
					 for (AppLogLine appLog : record.getAppLogLines()) {
						  LocalDateTime appTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(appLog.getTimeUsec()), TimeZone.getDefault().toZoneId());
						  writer.print(String.format("    %s ", appTime.toString()));
						  writer.print(String.format("%s ", appLog.getLogLevel()));
						  writer.print(String.format("%s ", appLog.getLogMessage()));
					 }

					 writer.println();
				}

				if (++count >= limit) {
					 break;
				}
		  }
		  writer.close();
	 }

}
