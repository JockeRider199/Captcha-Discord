const Discord = require("discord.js");

exports.run = async (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply(" this command require ADMINISTRATOR permission.");

    var parameters = ["verificationChannel", "memberRole", "logsChannel"];
    var toChange = args[1];
    var db = client.db;
    var embed = new Discord.RichEmbed();

    // Display actual config
    if(!toChange){
        embed.setTitle(`Current Config - Your Server`)
        .addField(`Verification Channel`, `\`${client.config.prefix}config verificationChannel <#channel | none>\`\n\⇨ Current : ${(client.db.get(msg.guild.id).value().channel ? "<#" + client.db.get(msg.guild.id).value().channel + ">": "none")}`) 
        .addField(`New Member's Role`, `\`${client.config.prefix}config memberRole <@role | none>\`\n\⇨ Current : ${(client.db.get(msg.guild.id).value().role ? "<@&" + client.db.get(msg.guild.id).value().role + ">" : "none")}`)
        .addField(`Logs Channel`, `\`${client.config.prefix}config logsChannel <#channel | none>\`\n\⇨ Current : ${(client.db.get(msg.guild.id).value().logs ? "<#" + client.db.get(msg.guild.id).value().logs + ">": "none")}`) 
        // \`
        return msg.channel.send(embed);
    };
    if(!parameters.includes(toChange)) return msg.channel.send(`This parameter doesn't exist. \`${client.config.prefix}config\` to see parameters`);

    switch(toChange){

        case "verificationChannel":
            
            var vChannel = msg.mentions.channels.first();
            if(!vChannel){
                if(args[2] === "none"){
                    db.get(msg.guild.id).set("channel", null).write();
                    embed.setColor(client.config.embeds.color)
                    .setDescription(`Successfully removed the verification channel`);
                    return msg.channel.send(embed);
                }else{
                    return msg.channel.send(`Incorrect configuration, please type ${client.config.prefix}config`);
                };
            };

            db.get(msg.guild.id).set("channel", vChannel.id).write();
            embed.setColor(client.config.embeds.color)
            .setDescription(`Successfully set the verification channel to <#${vChannel.id}>`);
            msg.channel.send(embed);
            client.reloadDb()
            break;

        case "memberRole":
            
            var vRole = msg.mentions.roles.first();
            if(!vRole){
                if(args[2] === "none"){
                    db.get(msg.guild.id).set("role", null).write();
                    embed.setColor(client.config.embeds.color)
                    .setDescription(`Successfully removed the verification role`);
                    return msg.channel.send(embed);
                }else{
                    return msg.channel.send(`Incorrect configuration, please type ${client.config.prefix}config`)
                };
            };

            db.get(msg.guild.id).set("role", vRole.id).write();
            embed.setColor(client.config.embeds.color)
            .setDescription(`Successfully set the verification role to <@&${vRole.id}>`);
            msg.channel.send(embed);
            var compare = msg.guild.member(client.user).highestRole.comparePositionTo(msg.member.highestRole)
            if(compare < 0 || compare === 0){
                var rEmbed = new Discord.RichEmbed()
                .setColor(client.config.embeds.color)
                .setDescription("My role isn't higher than the verification role ! Please move my role !");
                msg.channel.send(rEmbed);
            };
            client.reloadDb()
            break;

        case "logsChannel":
            
            var logsChannel = msg.mentions.channels.first();
            if(!logsChannel){
                if(args[2] === "none"){
                    db.get(msg.guild.id).set("logs", null).write();
                    embed.setColor(client.config.embeds.color)
                    .setDescription(`Successfully removed the verification logs`);
                    return msg.channel.send(embed);
                }else{
                    return msg.channel.send(`Incorrect configuration, please type ${client.config.prefix}config`)
                };
            }       
            db.get(msg.guild.id).set("logs", logsChannel.id).write();
            embed.setColor(client.config.embeds.color)
            .setDescription(`Successfully set the verification logs to <#${logsChannel.id}>`);
            msg.channel.send(embed);
            client.reloadDb()
            break;
    }
};

exports.info = {
    name : "config",
    channel : "text",
    perm : ["ADMINISTRATOR"],
    botPerm : ["EMBED_LINKS", "MANAGE_MESSAGES"],
    category : "admin"
}