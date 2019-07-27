/*  REQUIREMENTS  */

// Config
var config = require("../config");

// Modules
const fs = require("fs"),
low = require("lowdb"),
ms = require("ms"),
moment = require("moment"),
utils = require("./functions/utils"),

// Db
FileSync = require("lowdb/adapters/FileSync"),
adapter = new FileSync(`${__dirname}/database/guilds-config.json`),
adapter2 = new FileSync(`${__dirname}/database/verification.json`),
db = low(adapter),
verifDB = low(adapter2);

// Discord
const Discord = require("discord.js"),
client = new Discord.Client();
client.config = config;
client.db = db;
client.verifDB = verifDB


/*  COMMANDS  */

function loadCmds(){
    client.commands = [];
    
    fs.readdir(`${__dirname}/commands/`, async (err, files) => {
        if(err) console.log(err);
        files.forEach((f) => {
            delete require.cache[require.resolve(`./commands/${f}`)];
            const cmd = require(`./commands/${f}`),
            cmdName = f.split(".")[0];
            console.log(`Loaded command : ${cmdName}`);
            client.commands.push(cmd);
        });
    });
};

client.reloadDb = function(){

    fs.readdir(`${__dirname}/database/`, (err, files) => {
        if(err) console.log(err);
        files.forEach((f) => {
            delete require.cache[require.resolve(`./database/${f}`)];
        });
    });
};


/*  CLIENT LOGIN  */
client.login(config.token);

client.on("ready", () => {

    // Loads commands
    loadCmds() 

    setTimeout(() => {
        console.clear();
        console.log(`Logged in as ${client.user.tag}`);
        console.log("Discord : " + Discord.version)

        // Presence management
        client.setInterval(() => {
            var i = Math.floor(Math.random() * config.presence.length);
            var chosen = config.presence[i];

            client.user.setActivity(chosen.name, {type : chosen.type, url : "https://twitch.tv/DISCORD CAPTCHA MADE BY JOCKERIDER99"});
        }, 4000);
    }, 1000);
});

// Reload database folder every 5 seconds
client.setInterval(client.reloadDb, 5000);

/*  Events  */
client.on("message", async (msg) => {
    
    if(
        msg.channel.type === "text" && !msg.content.startsWith(config.prefix)
    ) return;

    var args = msg.content.substring(config.prefix.length).split(" ");
    var cmdName = args[0].toLowerCase();

    if(msg.content === config.prefix + "test"){
        client.emit("guildMemberAdd", msg.member)
    }

    client.commands.forEach(command =>  {
        if(command.info.name === cmdName){
            if(command.info.channel === "dm" && msg.channel.type !== "dm"){
                return;
            }
            else if(command.info.channel === "text" && msg.channel.type !== "text"){
                return;
            }
            else{
                command.run(client, msg, args);
            };
        };
    });
});


client.on("guildMemberAdd", async (member) => {

    if(member.user.bot) return;

    // Check if captcha correctly set up
    var active = await utils.captchaCorrectly(db, member.guild, client);
    if(active !== true) return;

    var id = makeid(8) // Make the password
    var embed = new Discord.RichEmbed()
        .setTitle(`Welcome to the server ${member.guild.name} !`)
        .addField(`Captcha`, `Please complete the captcha below to access to the server.`)
        .addField(`Type below :`, `\`\`\`\n${config.prefix}verif ${id}\n\`\`\``)
        .setColor(config.embeds.color)
        .setFooter(config.embeds.footer)

    member.send(embed);

    verifDB.set(member.user.id, {pass : id, time : moment()}).write();
})

// Function to make the password
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
 