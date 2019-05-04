/////////////////////////////////////REQUIREMENTS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const Discord = require('discord.js');
const ms = require("ms");
const fs = require('fs');
const settings = require("./settings.json");
const client = new Discord.Client();

/////////////////////////////////////IMPORTS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const token = settings.token;
const prefix = settings.prefix;
const OwnerID = settings.OwnerID;
const db = JSON.parse(fs.readFileSync("./captcha.json", "utf8"));
const system = JSON.parse(fs.readFileSync("./system.json", "utf8"));

/////////////////////////////////////LOGIN\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
client.login(token)

client.on('ready', () => {
    console.log("Connected")
    client.user.setActivity("DISCORD CAPTCHA", {
        type : "STREAMING",
        url : "https://twitch.tv/squfdhlgldljmsjlhlgshsdhgsguksd"
    })
})

/////////////////////////////////////SCRIPT\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

client.on('guildMemberAdd', async member => {

    if(!system[member.guild.id]) return;

    let channel = member.guild.channels.get(system[member.guild.id].captcha)
    let role = member.guild.roles.get(system[member.guild.id].role)
    let logs = member.guild.channels.get(system[member.guild.id].logs)

    if(
        !channel ||
        !role ||
        !logs
    ) return

    member.addRole(role.id)

    channel.send({
        embed : {
            author : {
                name : client.user.username,
                icon_url : client.user.avatarURL
            },
            title : "Bienvenue à toi " + member.user.username,
            description : "Veillez effectuer la commande `" + prefix + "verif" + "` afin de recevoir votre code CAPTCHA puis envoyez-le ici pour être validé."
        }
    })

    logs.send(member + " a rejoint le serveur ! Processus de vérification en cours")
})

client.on("message", async msg => {

    let args = msg.content.substring(prefix.length).split(" ")
    let codes = [
        "c072g754ch10", "ys424l8a5706", "3w92x1i31z09", "5z955lar2910", "5nf0675b5w07", "202axc0n6293", "t5f5nl272708", "c72fv8g81992", "kxl29z592299", "8827b750y8ys",
        "byj8r1847536", "l2xn75n91081", "qc081h5781g9", "ncst41238517", "r47agd338257", "9mg22wt91600", "sw1fv8344208", "skq9j2466322", "8m1ljq712977", "j905znq58533",
        "t76xcc031634", "73b8qcc92522", "d85kdv017804", "pud4908v2977", "4h2t5kx37388", "s8sw9y911829", "u7twq3220621", "1s317ljl2769", "0bdil6725095"
    ]

    if(msg.author.id == client.user.id ||
        msg.author.bot
    ) return;

    if(msg.content.startsWith(prefix + "verif")){

        if(!args[1]){ // Si on demande la génération du code

            //let index = Math.floor(Math.random() * codes.length)

            db[msg.author.id] = { code :  getAlphaNumeric()} // écriture de la DB
            fs.writeFile("./captcha.json", JSON.stringify(db), (err) => {
                if(err) console.log(err)
            })

            let embed = new Discord.RichEmbed()
                .setDescription("Envoyez le code ci-dessous pour être vérifié.\n\n```fix\n" + prefix + "verif " + db[msg.author.id].code + "\n```")
            let send = await msg.channel.send(embed)
            db[msg.author.id] = { code : db[msg.author.id].code, msg : send.id }
            fs.writeFileSync("./captcha.json", JSON.stringify(db))
        }else{

            if(!db[msg.author.id]) return msg.channel.send("Aucun code sauvegardé, " + prefix + "verif pour recevoir un nouveau code")
            if(args[1] == db[msg.author.id].code){
                msg.author.send({
                    embed : {
                        color : 65298,
                        description : "Bienvenue sur le serveur " + msg.guild.name
                    }
                })

                msg.guild.member(msg.author).removeRole(system[msg.guild.id].role)
                msg.channel.messages.filter(m => m.author.id == msg.author.id).forEach(m => m.delete())
                msg.channel.messages.find(m => m.id == db[msg.author.id].msg).delete()
                msg.guild.channels.get(system[msg.guild.id].logs).send(msg.author + " a fini le processus de vérification !")
                delete db[msg.author.id]
                fs.writeFile("./captcha.json", JSON.stringify(db), (err) => {
                    if(err) console.log(err)
                })
            }else{

                return msg.channel.send("Pas le bon code, " + prefix + "verif pour recevoir un nouveau code")
            }
        }
    }

    if(msg.content.startsWith(prefix + "setup")){

        msg.channel.send("Quel est le salon des logs ?")
        let LogsCollector = new Discord.MessageCollector(msg.channel, m => m.author.id == msg.author.id, { time : 10000})

        LogsCollector.on('collect', message => {

            LogsCollector.stop()
            if(!message.mentions.channels) return msg.channel.send("Vous devez mentionner un salon !")
            system[msg.guild.id] = { logs : message.mentions.channels.first().id }
            fs.writeFileSync("./system.json", JSON.stringify(system))
            msg.channel.send("Salon captcha ?")
            let CaptchaCollector = new Discord.MessageCollector(msg.channel, m => m.author.id == msg.author.id, { time : 10000})

            CaptchaCollector.on("collect", message => {
                CaptchaCollector.stop()
                if(!message.mentions.channels) return msg.channel.send("Vous devez mentionner un salon !")
                system[msg.guild.id] = { logs : system[msg.guild.id].logs, captcha : message.mentions.channels.first().id }
                fs.writeFileSync("./system.json", JSON.stringify(system))
                msg.channel.send("Rôle anti-raid ?")
                let RoleCollector = new Discord.MessageCollector(msg.channel, m => m.author.id == msg.author.id, { time : 10000})

                RoleCollector.on('collect', async message => {
                    RoleCollector.stop()
                    if(!message.mentions.roles) return msg.channel.send("Vous devez mentionner un role !")
                    system[msg.guild.id] = { logs : system[msg.guild.id].logs, captcha : system[msg.guild.id].captcha, role : message.mentions.roles.first().id}
                    fs.writeFileSync("./system.json", JSON.stringify(system))

                    await msg.guild.channels.forEach(channel => {
                        if(!channel.deletable) return;
                        if(channel.id == system[msg.guild.id].captcha) return;
                        channel.overwritePermissions(msg.guild.roles.get(system[msg.guild.id].role), {
                            READ_MESSAGES : false
                        })
                    })

                    msg.channel.send("Setup Terminé")
                })
            })
        })
    }

    if(msg.content.startsWith(prefix + "stop")){
        if(!system[msg.guild.id]) return
        delete system[msg.guild.id]
        fs.writeFileSync("./system.json", JSON.stringify(system))
        msg.channel.send(":white_check_mark: Captcha **OFF**")
    }
});

function getAlphaNumeric(){
    var arr =['a','b', 'c', 'd','e','f','g','h','i', 'j', 'k', 'l', 'm', 'n','o','p','q', 'r','s','t','u','v','w','x','y','z'],
   letterUsed=0,numberUsed=0,i=0, randomStr='';
   for(;i<12;i++){
    if((Math.floor(Math.random()*2) === 0 && numberUsed <8) || letterUsed>=4){
        randomStr += Math.floor(Math.random()*10);
        numberUsed++;
    }else{
      randomStr += arr[Math.floor(Math.random()*26)];
      letterUsed++;
    }
    }
  return randomStr
}

client.on("error", err => {
  if(err.message == "read ECONNRESET") return;
  console.log(err);
});
