const Discord = require("discord.js"),
utils = require("../functions/utils");

exports.run = async (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply(" this command require ADMINISTRATOR permission.")

    var db = client.db;

    var checkAll = await utils.captchaCorrectly(db, msg.guild, client);

    if(
        checkAll !== true
    ) return msg.channel.send(`Everything is not setup. Please run ${client.config.prefix}checklist`)

    try{
        await msg.guild.channels.forEach(channel => {
            if(channel.id !== db.get(msg.guild.id).value().channel){
                channel.overwritePermissions(msg.guild.roles.get(db.get(msg.guild.id).value().role), {
                    VIEW_CHANNEL : false
                });
            }else{
                channel.overwritePermissions(msg.guild.roles.get(db.get(msg.guild.id).value().role), {
                    VIEW_CHANNEL : true
                })
                channel.overwritePermissions(msg.guild.defaultRole, {
                    VIEW_CHANNEL : false
                })
            }
        })
    
        var embed = new Discord.RichEmbed()
        .setColor(client.config.embeds.color)
        .setFooter(client.config.embeds.footer)
        .setDescription(`Your guild is now totaly ready !`)
        msg.channel.send(embed);

        var logs = client.channels.get(client.db.get(msg.guild.id).value().logs);
        var logsEmbed = new Discord.RichEmbed()
            .setColor(client.config.embeds.color)
            .setFooter(client.config.embeds.footer)
            .setDescription(`${msg.author.tag} has been updated the channels`)
        if(logs){
            logs.send(logsEmbed);
        }
    }catch(e){
        msg.channel.send(`I can't overwrite permissions of your channels, there is an error`)
    }
}

exports.info = {
    name : "update-perms",
    channel : "text",
    perm : ["ADMINISTRATOR"],
    botPerm : ["EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    category : "admin"
}