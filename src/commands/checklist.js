const Discord = require("discord.js");

exports.run = async (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply(" this command require ADMINISTRATOR permission.")

    var embed = new Discord.RichEmbed();

    // Check the config
    if(!client.db.has(msg.guild.id).value()){
        embed.setTitle(`Improper Server Configuration`)
        .setDescription("This server has not been fully configurated by an Admin")
        .addField("Please complete the following :", `- Set the verification Channel. (Use : ${client.config.prefix}config)\n- Set the new member's role. (Use : ${client.config.prefix}config)`)
        .setFooter(client.config.embeds.footer)
        .setColor(client.config.embeds.color)
        return msg.channel.send(embed);
    }
    else if(!client.db.get(msg.guild.id).value().channel){
        embed.setTitle(`Improper Server Configuration`)
        .setDescription("This server has not been fully configurated by an Admin")
        .addField("Please complete the following :", `- Set the verification Channel. (Use : ${client.config.prefix}config)`)
        .setFooter(client.config.embeds.footer)
        .setColor(client.config.embeds.color)
        return msg.channel.send(embed);
    }
    else if(!msg.guild.channels.get(client.db.get(msg.guild.id).value().channel)){
        embed.setTitle(`Improper Server Configuration`)
        .setDescription("This server has not been fully configurated by an Admin")
        .addField("Please complete the following :", `- Set the verification Channel. (Use : ${client.config.prefix}config)`)
        .setFooter(client.config.embeds.footer)
        .setColor(client.config.embeds.color)
        return msg.channel.send(embed);
    }
    else if(!client.db.get(msg.guild.id).value().role){
        embed.setTitle(`Improper Server Configuration`)
        .setDescription("This server has not been fully configurated by an Admin")
        .addField("Please complete the following :", `- Set the new member's role. (Use : ${client.config.prefix}config)`)
        .setFooter(client.config.embeds.footer)
        .setColor(client.config.embeds.color)
        return msg.channel.send(embed);
    }
    else if(!msg.guild.roles.get(client.db.get(msg.guild.id).value().role)){
        embed.setTitle(`Improper Server Configuration`)
        .setDescription("This server has not been fully configurated by an Admin")
        .addField("Please complete the following :", `- Set the new member's role. (Use : ${client.config.prefix}config)`)
        .setFooter(client.config.embeds.footer)
        .setColor(client.config.embeds.color)
        return msg.channel.send(embed);
    }
    else if(msg.guild.member(client.user).highestRole.comparePositionTo(msg.guild.roles.get(client.db.get(msg.guild.id).value().role)) <= 0){
        embed.setTitle(`Improper Server Configuration`)
        .setDescription("This server has not been fully configurated by an Admin")
        .addField("Please complete the following :", `- Move my role higher than new members.`)
        .setFooter(client.config.embeds.footer)
        .setColor(client.config.embeds.color)
        return msg.channel.send(embed);
    }
    else {
        embed.setTitle("Verification System")
        .setDescription(`Captcha system running, Checklist complete.`)
        .setFooter(client.config.embeds.footer)
        .setColor(client.config.embeds.color)
        return msg.channel.send(embed);
    }
}

exports.info = {
    name : "checklist",
    channel : "text",
    perm : ["ADMINISTRATOR"],
    botPerm : ["EMBED_LINKS", "MANAGE_MESSAGES"],
    category : "admin"
}