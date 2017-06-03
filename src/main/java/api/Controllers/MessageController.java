package api.Controllers;

import api.Models.*;
import kittenbbq.discordbot.BotBase;
import kittenbbq.discordbot.BotConfig;
import kittenbbq.discordbot.Db;
import org.springframework.web.bind.annotation.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@CrossOrigin(origins = "*")
public class MessageController {
    public MessageController() {
        this.bot = new BotBase();
        bot.getClient().login();
    }
    private BotBase bot;
    private Db db = new Db(new BotConfig());

    @RequestMapping("/test")
    public String test() {
        return ":D";
    }


    /**
     * GET /api/messages/info
     * General information of sent messages.
     **/
    @RequestMapping("/api/messages/info")
    public MessageInfo getMessageInfo(
        @RequestParam(value = "fromDate", defaultValue = "2010-01-01") String fromDate,
        @RequestParam(value = "toDate", defaultValue = "2030-01-01") String toDate
    ) {
        MessageInfo msgInfo = null;
        ResultSet results;
        PreparedStatement statement;

        try {
            statement = db.getConn().prepareStatement(
                    String.format("CALL messageInfo('%s','%s')", fromDate, toDate)
            );
            results = statement.executeQuery();
            msgInfo = new MessageInfo();
            if (results.first()) {
                SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
                msgInfo.setMessageCount(results.getInt("totalMessages"));
                msgInfo.setFirstMessage(f.format(results.getTimestamp("firstMessage")));
                msgInfo.setLastMessage(f.format(results.getTimestamp("lastMessage")));
            }
        } catch(Exception e) {
            System.out.println("Database query failed: : " + e.getMessage());
        }

        return msgInfo;
    }

    /**
     * GET /api/messages/countByDate
     * Gets message count by date.
     */
    @RequestMapping("/api/messages/countByDate")
    public List<MessageCount> getCountByDate(
            @RequestParam(value = "fromDate", defaultValue = "2010-01-01") String fromDate,
            @RequestParam(value = "toDate", defaultValue = "2030-01-01") String toDate
    ) {
        List<MessageCount> counts = new ArrayList<>();
        ResultSet results;
        PreparedStatement statement;

        try {
            statement = db.getConn().prepareStatement(
                String.format("CALL messageCountByDate('%s','%s')", fromDate, toDate)
            );
            results = statement.executeQuery();
            while (results.next()) {
                MessageCount tmpCount = new MessageCount();
                tmpCount.setDate(results.getString("date"));
                tmpCount.setMessageCount(results.getInt("messageCount"));
                counts.add(tmpCount);
            }
        } catch(Exception e) {
            System.out.println("Database query failed: : " + e.getMessage());
        }
        return counts;
    }

    /**
     * GET /api/messages/countByAuthor
     * Gets message count by date.
     */
    @RequestMapping("/api/messages/countByAuthor")
    public List<MessageCountByAuthor> getCountByAuthor(
            @RequestParam(value = "fromDate", defaultValue = "2010-01-01") String fromDate,
            @RequestParam(value = "toDate", defaultValue = "2030-01-01") String toDate
    ) {
        List<MessageCountByAuthor> counts = new ArrayList<>();
        ResultSet results;
        PreparedStatement statement;

        try {
            statement = db.getConn().prepareStatement(
                    String.format("CALL messageCountByAuthor('%s','%s')", fromDate, toDate)
            );
            results = statement.executeQuery();
            while (results.next()) {
                MessageCountByAuthor tmpCount = new MessageCountByAuthor();
                tmpCount.setAuthorID(results.getLong("authorID"));
                tmpCount.setAuthorName(results.getString("authorName"));
                tmpCount.setMessageCount(results.getInt("messageCount"));
                counts.add(tmpCount);
            }
        } catch(Exception e) {
            System.out.println("Database query failed: : " + e.getMessage());
        }
        return counts;
    }

    /**
     * GET /api/messages/countByDay
     * Gets message count by day.
     */
    @RequestMapping("/api/messages/countByDay")
    public List<MessageCountByDay> getCountByDay(
            @RequestParam(value = "fromDate", defaultValue = "2010-01-01") String fromDate,
            @RequestParam(value = "toDate", defaultValue = "2030-01-01") String toDate
    ) {
        List<MessageCountByDay> counts = new ArrayList<>();
        ResultSet results;
        PreparedStatement statement;

        try {
            statement = db.getConn().prepareStatement(
                    String.format("CALL messageCountByDay('%s','%s')", fromDate, toDate)
            );
            results = statement.executeQuery();
            while (results.next()) {
                MessageCountByDay tmpCount = new MessageCountByDay();
                tmpCount.setDay(results.getString("day"));
                tmpCount.setMessageCount(results.getInt("messageCount"));
                counts.add(tmpCount);
            }
        } catch(Exception e) {
            System.out.println("Database query failed: : " + e.getMessage());
        }
        return counts;
    }


    /**
     * GET /api/messages/countByDayHour
     * Gets message count by day-hour.
     */
    @RequestMapping("/api/messages/countByDayHour")
    public List<MessageCountByDayHour> getCountByDayHour(
            @RequestParam(value = "fromDate", defaultValue = "2010-01-01") String fromDate,
            @RequestParam(value = "toDate", defaultValue = "2030-01-01") String toDate
    ) {
        List<MessageCountByDayHour> counts = new ArrayList<>();
        ResultSet results;
        PreparedStatement statement;

        try {
            statement = db.getConn().prepareStatement(
                    String.format("CALL messageCountByDayHour('%s','%s')", fromDate, toDate)
            );
            results = statement.executeQuery();
            while (results.next()) {
                MessageCountByDayHour tmpCount = new MessageCountByDayHour();
                tmpCount.setDay(results.getString("day"));
                tmpCount.setHour(results.getInt("hour"));
                tmpCount.setMessageCount(results.getInt("messageCount"));
                counts.add(tmpCount);
            }
        } catch(Exception e) {
            System.out.println("Database query failed: : " + e.getMessage());
        }
        return counts;
    }


    /**
     * GET /api/messages/countByDayHour
     * Gets message count by hour of day (0-23).
     */
    @RequestMapping("/api/messages/countByHour")
    public List<MessageCountByHour> getCountByHour(
            @RequestParam(value = "fromDate", defaultValue = "2010-01-01") String fromDate,
            @RequestParam(value = "toDate", defaultValue = "2030-01-01") String toDate
    ) {
        List<MessageCountByHour> counts = new ArrayList<>();
        ResultSet results;
        PreparedStatement statement;

        try {
            statement = db.getConn().prepareStatement(
                    String.format("CALL messageCountByHour('%s','%s')", fromDate, toDate)
            );
            results = statement.executeQuery();
            while (results.next()) {
                MessageCountByHour tmpCount = new MessageCountByHour();
                tmpCount.setHour(results.getInt("hour"));
                tmpCount.setMessageCount(results.getInt("messageCount"));
                counts.add(tmpCount);
            }
        } catch(Exception e) {
            System.out.println("Database query failed: : " + e.getMessage());
        }
        return counts;
    }


    /**
     * GET /api/messages/withUrl
     * Gets messages
     */
    @RequestMapping("/api/messages/withUrl")
    public List<UrlHitCount> getMessagesWithUrl(
            @RequestParam(value = "fromDate", defaultValue = "2010-01-01") String fromDate,
            @RequestParam(value = "toDate", defaultValue = "2030-01-01") String toDate
    ) {
        List<String> messages = new ArrayList<>();
        ResultSet results;
        PreparedStatement statement;
        Map<String, Integer> urls = new HashMap<>();
        List<UrlHitCount> sortedUrls = new ArrayList<>();

        try {
            statement = db.getConn().prepareStatement(
                    String.format("CALL messagesWithUrl('%s','%s')", fromDate, toDate)
            );
            results = statement.executeQuery();
            while (results.next()) {
                messages.add(results.getString("content"));
            }


            Pattern p = Pattern.compile("(?<=^| )https?:\\/\\/\\S*?(?=\\/)");
            for (String item : messages) {
                // Get url matches in message content
                Matcher m = p.matcher(item);
                while(m.find()) {
                    // Get relevant part
                    String url = m.group().replaceAll("https?:\\/\\/","");
                    url = url.replaceAll("www\\.","");
                    url = url.substring(0, url.length());

                    // Check if already exists
                    if (urls.containsKey(url)) {
                        urls.put(url, urls.get(url) + 1);
                    } else {
                        urls.put(url, 1);
                    }
                }
            }

            // Sort results
            for (Map.Entry<String, Integer> val : urls.entrySet()) {
                UrlHitCount tmpUrl = new UrlHitCount();
                tmpUrl.setUrl(val.getKey());
                tmpUrl.setHits(val.getValue());
                sortedUrls.add(tmpUrl);
            }

            Collections.sort(sortedUrls, (first, second) -> first.getHits() > second.getHits() ? -1 : (first.getHits() < second.getHits()) ? 1 : 0);
        } catch(Exception e) {
            System.out.println("Database query failed: : " + e.getMessage());
        }
        return sortedUrls;
    }


    /**
     * POST /api/sendMessage
     * Sends a message with discordClient to specified channel.
     * Request body must contain message and channelID.
     */
    @RequestMapping("/api/sendMessage")
    @ResponseBody
    public PostResult sendMessage(@RequestBody SendMessageBody body) {
        PostResult result = new PostResult();

        String message = body.getMessage();
        long channelID = body.getChannelID();

        System.out.println(message + " + " + channelID);
        try {
            bot.sendMessage(message, channelID);
            result.setSuccess(true);
        } catch(Exception e) {
            result.setError(e.getMessage());
            System.out.println(e.getMessage());
            result.setSuccess(false);
        }
        return result;
    }


}
