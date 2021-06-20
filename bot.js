// Extract the required classes from the discord.js module
const Discord = require('discord.js');
// Create an instance of a Discord client
const client = new Discord.Client();
// import few things
const config = require("./config.json");

const prefix = "/";

client.on('ready', () => {
    console.log(`${client.user.tag}, 시스템 온라인!`);
    client.user.setActivity('봇 만들기', { type: 'STREAMING' })
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.channel.type == "dm") return;
    if (!msg.content.startsWith(prefix)) return;

    let command = msg.content.split("!");
    command = command[1].split(" ");

    console.log(command);

    if (command === '뭐야'){
        msg.reply('뭐요 나 지금 작동해요');
    }
});

client.login(config.token)