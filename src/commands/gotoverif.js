const Discord = require("discord.js"),
utils = require("../functions/utils");

exports.run = async (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send("This command require ADMINISTRATOR permission !");

    var member = msg.mentions.members.first();
    var checkAll = await utils.captchaCorrectly(client.db, msg.guild, client);
    
    if(checkAll !== true){
        return msg.channel.send(`Everything is not setup. Please run ${client.config.prefix}checklist`);
    }
    else if(!member){
        return msg.channel.send("You have to mention a member !");
    }
    else if(member.permissions.has("ADMINISTRATOR")){
        return msg.channel.send("You can't do this for an Admin !");
    }
    else if(member.user.bot){
        return msg.channel.send(`It's a bot !`);
    }
    else{
        member.addRole(client.db.get(msg.guild.id).value().role).catch((err) => console.log(err)).then(() => {
            var embed = new Discord.RichEmbed()
                .setColor(client.config.embeds.color)
                .setFooter(client.config.embeds.footer)
                .setTitle("Verification System")
                .setDescription(`${member} (${member.user.tag}) has been moved to the verification system`)
            msg.channel.send(embed);7

            var mEmbed = new Discord.RichEmbed()
                .setColor(client.config.embeds.color)
                .setFooter(client.config.embeds.footer)
                .setTitle("Verification System")
                .setDescription(`Someone asked you to redo the verification, please type ${client.config.prefix}verif`)
            member.user.send(mEmbed);

            var _ = client.db.get(msg.guild.id).value().logs;
            var logs = client.channels.get(_);
            var logsEmbed = new Discord.RichEmbed()
                .setColor(client.config.embeds.color)
                .setFooter(client.config.embeds.footer)
                .setTitle("Verification System")
                .setDescription(`${member} (${member.user.tag}) has been moved to the verification system`)
                .addField("Action by :", msg.author.tag)
            if(logs){
                logs.send(logsEmbed)
            }
        });


    }
}

exports.info = {
    name : "gotoverif",
    channel : "text",
    perm : ["ADMINISTRATOR"],
    botPerm : ["EMBED_LINKS", "MANAGE_ROLES"],
    category : "verif"
}