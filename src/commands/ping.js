const Discord = require("discord.js");

exports.run = async (client, msg, args) => {

    if(msg.channel.type == "text"){
        msg.delete().catch(() => {});
    };

    var newMsg = await msg.channel.send("Pinginnnnnng...");

    var embed = new Discord.RichEmbed()
        .setColor(client.config.embeds.color)
        .addField("Ping API", Math.floor(client.ping) + "ms")
        .addField("Ping Bot", (newMsg.createdTimestamp - msg.createdTimestamp) + "ms")
    
    newMsg.delete();
    msg.channel.send(embed);
};

exports.info = {
    name : "ping",
    channel : null,
    perm : null,
    botPerm : ["EMBED_LINKS", "MANAGE_MESSAGES"],
    category : "general"
};