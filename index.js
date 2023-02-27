require("dotenv").config();
const Discord = require('discord.js');
const { GatewayIntentBits } = require("discord.js")
const Canvas = require('canvas')
const fs = require('fs/promises')
const ms = require("ms")

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

//customise our font
const fonts = [{
    path: "./fonts/AVALEA_.otf",
    family: "AVALEA"
},
{
    path: "./fonts/Monoton.ttf",
    family: "Monoton"
},
{
    path: "./fonts/Berlin Sans FB Demi.ttf",
    family: "Berlin Sans FB Demi"
}
]

const currentFont = "Berlin Sans FB Demi"
fonts.map((font) => {
    Canvas.registerFont(font.path, {
        family: font.family
    })
    console.log(`[FONTS LOADED] ${font.family}`)
})

async function changeBanner() {
    console.log("[CALLED FUNCTION] changeBanner called");
    const images = await fs.readdir('images'); //get "images" folder
    const image = `images/${images[Math.floor(Math.random() * images.length)]}`;
    const guild = await client.guilds.fetch('YOUR_GUILD_ID');
    let voiceCount = 0;
    const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2);
    voiceChannels.forEach(channel => {
        voiceCount += channel.members.size;
    });
    const banner = await editBanner(image, voiceCount);
    await guild.setBanner(banner);
}

client.on('voiceStateUpdate', (oldState, newState) => {
    console.log(oldState, newState);
    const guild = client.guilds.cache.get('YOUR_GUILD_ID');
    const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2);
    const voiceCount = voiceChannels.reduce((count, channel) => count + channel.members.size, 0);
    changeBanner(voiceCount);
});

async function editBanner(image, number) {
    const canvas = Canvas.createCanvas(1920, 1080);
    const context = canvas.getContext('2d');
    const background = await Canvas.loadImage(image);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.font = '150px ' + currentFont; //font size

    context.fillStyle = '#000000';
    //your text color
    context.textAlign = 'center';
    context.fillText(`Active Voice: ${number}`, canvas.width / 2, canvas.height / 2);
    return canvas.toBuffer();
}

client.on('ready', () => {
    setInterval(changeBanner, ms("1m")); //call our function every 1m

    const selected_our_activiti = [
        `Developer by Enterprise`,
        `another status`,
        `another status lol`,
    ]

    setInterval(() => {
        client.user.setPresence({
            activities: [{ name: `${selected_our_activiti[Math.floor(Math.random() * selected_our_activiti.length)]}`, type: 2 }],
            status: 'online',
            //activity types : 0 = playing, 1 = streaming, 2 = listening, 3 = watching, 5 = competing
        });
    }, 15000);

});

(async () => {
    await client.login(process.env.TOKEN)
    console.log(`[READY] ${client.user.tag} (${client.user.username} (${client.user.id})) | Guilds: ${client.guilds.cache.size}`)
})();
