package api;

import kittenbbq.discordbot.*;
import sx.blah.discord.api.events.EventDispatcher;
import sx.blah.discord.api.events.EventSubscriber;
import sx.blah.discord.handle.impl.events.ReadyEvent;
import sx.blah.discord.handle.obj.IChannel;
import sx.blah.discord.handle.obj.IGuild;
import sx.blah.discord.handle.obj.IMessage;
import sx.blah.discord.handle.obj.IUser;
import sx.blah.discord.util.MessageHistory;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class MessageFetcher {
    private BotBase bot;

    public MessageFetcher(BotBase bot) {
        this.bot = bot;
    }

    public static void main(String[] args) {
        BotBase botclient = new BotBase();
        EventDispatcher dispatcher = botclient.getClient().getDispatcher();
        dispatcher.registerListener(new MessageFetcher(botclient));
    }

    @EventSubscriber
    public void onReadyEvent(ReadyEvent event) {
        // Init db
        Db db = new Db(new BotConfig());

        // Get guilds
        List<IGuild> guilds = bot.getClient().getGuilds();
        System.out.println("Fetching " + guilds.size());

        IGuild g = null;
        for (int i = 0; i < guilds.size(); i++) {
            System.out.println(guilds.get(i).getName());
            if (guilds.get(i).getName().equals("obesefinns")) {
                System.out.println("Found guild");
                g = guilds.get(i);
            }
        }
        System.out.println("Found guild: " + g.getName());
        List<IChannel> channels = g.getChannels();

        int errors = 0;

        List<MessageDTO> messages = new ArrayList<>();
        for (IChannel c : channels) {
            MessageHistory channelMessages = c.getMessageHistoryFrom(LocalDateTime.now());

            System.out.println("Total messages fetched: " + messages.size());
            DateTimeFormatter f = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            for (IMessage msg : channelMessages) {
                try {
                    System.out.println(msg.getTimestamp().format(f) + " " + msg.getGuild().getName() + " / " + msg.getChannel().getName() + " " + msg.getAuthor().getName() + ": " + msg.getContent());
                    MessageDTO tmpMsg = new MessageDTO();
                    IUser author = msg.getAuthor();
                    tmpMsg.setMessageID(String.valueOf(msg.getLongID()));
                    tmpMsg.setAuthorID(String.valueOf(author.getLongID()));
                    tmpMsg.setAuthorName(author.getName());
                    tmpMsg.setSent(Timestamp.valueOf(msg.getTimestamp()));
                    tmpMsg.setGuildID(String.valueOf(msg.getGuild().getLongID()));
                    tmpMsg.setGuildName(msg.getGuild().getName());
                    tmpMsg.setChannelID(String.valueOf(msg.getChannel().getLongID()));
                    tmpMsg.setChannelName(msg.getChannel().getName());
                    tmpMsg.setContent(msg.getFormattedContent());
                    saveMessage(db, tmpMsg);
                    messages.add(tmpMsg);
                } catch(Exception e){
                    errors++;
                }
            }
        }
        System.out.println("Finished, total errors: " + errors);
    }

    public static void saveMessage(Db db, MessageDTO msg) {
        PreparedStatement statement = null;
        try {
            statement = db.getConn().prepareStatement(
                    "INSERT INTO messages(ID, authorID, authorName, sent, guildID, guildName, channelID, channelName, content) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            statement.setString(1, msg.getMessageID());
            statement.setString(2, msg.getAuthorID());
            statement.setString(3, msg.getAuthorName());
            statement.setTimestamp(4, msg.getSent());
            statement.setString(5, msg.getGuildID());
            statement.setString(6, msg.getGuildName());
            statement.setString(7, msg.getChannelID());
            statement.setString(8, msg.getChannelName());
            statement.setString(9, msg.getContent());
            statement.executeUpdate();
        } catch(Exception ex) {
            System.out.println(ex);
            System.out.println("Message insert failed: " + ex.getMessage());
        }
        finally {
            try {
                if (statement != null)
                    statement.close();
            } catch(Exception ex) { }
        }
    }
}
