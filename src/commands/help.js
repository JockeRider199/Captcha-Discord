const Discord = require('discord.js');

exports.run = async (client, msg, args) => {

    msg.delete().catch(() => {});

    var prefix = client.config.prefix;
    var embed = new Discord.RichEmbed()
        .setColor(client.config.embeds.color)
        .setFooter(client.config.embeds.footer)

        .setTitle(`Captcha Help`)

        .addField(`${prefix}checklist`, `Displays a checklist of the required actions to set up the bot`)
        .addField(`${prefix}config`, `Display the guild'captcha configuration`)
        .addField(`${prefix}gotoverif <@mention>`, `Forces a Captcha on a specified user`)
        .addField(`${prefix}ping`, `Check if the bot's online`)
        .addField(`${prefix}update-perms`, `Change channels permissions for the captcha`)
        .addField(`${prefix}verif`, `generate a new Captcha Code`)
    
    msg.channel.send(embed);
}

exports.info = {
    name : "help",
    channel : "text",
    perm : null,
    botPerm : ["MANAGE_MESSAGES", "EMBEDS_LINKS"],
    category : "info"
}