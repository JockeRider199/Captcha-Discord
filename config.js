module.exports = {

    // The bot token, found at https://discordapp.com/developers/applications
    token : "",

    // The prefix your bot will respond to
    prefix : "",

    // The embeds configuration
    embeds : {
        footer : "Discord Captcha", // The footer 
        color : "#000000" // The color, in format #000000
    },

    // The "playing at" of the bot
    presence : [
        {
            name : "Discord Captcha",
            type : "STREAMING"
        }
    ]
}