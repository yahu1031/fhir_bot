'use strict';

require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const welcome = require('./operations/welcome');

// On bot ready
client.on('ready', () => {
    console.log(`${client.user.tag} is ready!`);
    welcome(client);
});



// Create an event listener for messages
client.on('message', message => {
    if (message.author.bot) return;
    // If the message is "ping"
    if (message.content === 'ping') {
        // Send "pong" to the same channel
        message.channel.send('pong');
    }
});

// Logging in the bot
client.login(process.env.BOT_TOKEN);