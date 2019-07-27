const Discord = require("discord.js");
const moment = require("moment");

exports.run = async (client, msg, args) => {

    if(!args[1]){

        var id = makeid(8)
        var embed = new Discord.RichEmbed()
            .setColor(client.config.embeds.color)
            .setFooter(client.config.embeds.footer)
            .addField(`Captcha`, `Please complete the captcha below to access to the server.`)
            .addField(`Type below :`, `\`\`\`\n${client.config.prefix}verif ${id}\n\`\`\``)
        msg.channel.send(embed);
        client.verifDB.set(msg.author.id, {pass : id, time : moment()}).write();
    }else{

        var code = args[1];
        var pass = client.verifDB.get(msg.author.id).value().pass;
        var db = client.verifDB;

        if(!pass) return msg.channel.send(`No code registered, please type : \`${client.config.prefix}verif\` to get another code`);
        if(code === pass){
            db.unset(msg.author.id).write();
            var embed2 = new Discord.RichEmbed()
                .setColor(client.config.embeds.color)
                .setFooter(client.config.embeds.footer)
                .setDescription(`Welcome to ${msg.guild.name}`)
            msg.member.send(embed2)
            member.removeRole(client.db.get(msg.guild.id).value().role).catch(err => console.log(err));

            var logs = client.channels.get(client.db.get(msg.guild.id).value().logs);
            var logsEmbed = new Discord.RichEmbed()
                .setColor(client.config.embeds.color)
                .setFooter(client.config.embeds.footer)
                .setDescription(`${msg.author.tag} has been passed the verification`)
            if(logs){
                logs.send(logsEmbed);
            }

        }else{
            return msg.channel.send(`The code is not the right one !`);
        }
    }
}

exports.info = {
    name : "verif",
    channel : "dm",
    perm : [],
    botPerm : [],
    category : "verif"
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}