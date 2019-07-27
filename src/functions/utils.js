const Discord = require("discord.js");

function existsGuild(db, guild){
    return new Promise(async (resolve, reject) => {
        if(db.has(guild.id).value()){
            return resolve(true);
        }else{
            return resolve(false);
        };
    });
};
function existsChannel(db, guild){
    return new Promise(async (resolve, reject) => {
        if(db.get(guild.id).value().channel){
            return resolve(true);
        }else{
            return resolve(false);
        };
    });
};
function foundChannel(db, guild){
    return new Promise(async (resolve, reject) => {
        if(guild.channels.get(db.get(guild.id).value().channel)){
            return resolve(true);
        }else{
            return resolve(false);
        };
    });
};
function existsRole(db, guild){
    return new Promise(async (resolve, reject) => {
        if(db.get(guild.id).value().role){
            return resolve(true);
        }else{
            return resolve(false);
        };
    });
};
function foundRole(db, guild){
    return new Promise(async (resolve, reject) => {
        if(guild.roles.get(db.get(guild.id).value().role)){
            return resolve(true);
        }else{
            return resolve(false);
        };
    });
};
function checkPosition(db, guild, client){
    return new Promise(async (resolve, reject) => {
        if(guild.member(client.user).highestRole.comparePositionTo(guild.roles.get(db.get(guild.id).value().role)) > 0){
            return resolve(true);
        }else{
            return resolve(false);
        };
    })
}

module.exports = {

    /**
     * Check if the system has been correctly configured
     * @param {object} db The database to check (json)
     * @param {object} guild The discord guild to check
     * @param {object} client The discord client
     * @returns true or false
     */
    async captchaCorrectly(db, guild, client){
        return new Promise(async (resolve, reject) => {

            var exist = await existsGuild(db, guild);
            var channel = await existsChannel(db, guild);
            var cFound = await foundChannel(db, guild);
            var role = await existsRole(db, guild);
            var rFound = await foundRole(db, guild);
            var position = await checkPosition(db, guild, client);

            if(exist !== true){
                resolve(false);
            }
            else if(channel !== true){
                resolve(false);
            }
            else if(cFound !== true){
                resolve(false);
            }
            else if(role !== true){
                resolve(false);
            }
            else if(rFound !== true){
                resolve(false);
            }
            else if(position !== true){
                resolve(false);
            }
            else{
                resolve(true)
            }
        })
    }
}


/*
    
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
    else if(msg.guild.member(client.user).highestRole.comparePositionTo(msg.member.highestRole) <= 0){
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
*/