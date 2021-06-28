require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({ intents: [Discord.Intents.ALL], partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'] });
const welcome = require('./operations/welcome');
const interactions = require('./operations/interactions');

//  ! Environment variables.
client.token = process.env.BOT_TOKEN;
client.prefix = process.env.PREFIX;
client.welcome_channel = process.env.WELCOME_CHANNEL;
client.rules_channel = process.env.RULES_CHANNEL;
client.maintainerID = process.env.MAINTAINER;

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

//  ! Reading command files dynamically.
client.commands = new Discord.Collection();

//  ! Retrieving all command files.
const commandFiles = fs.readdirSync('./operations').filter(file => file.endsWith('.js'));

//  ! Dynamically setting commands to the Collection.
for (const file of commandFiles) {
    const command = require(`./operations/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`${client.user.tag} Bot is ready`);
    welcome(client);
    interactions(client);
});

//  ! Handling websocket & network error
client.on('shardError', error => {
    return console.error('❌️ A websocket connection encountered an error: \n', error);
});

//  ! Handling API Errors
process.on('unhandledRejection', error => {
    return console.error('❌️ Unhandled promise rejection: \n', error);
});

//  ! Listening to messages
client.on('message', message => {
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(client.prefix)})\\s*`);
    // ! This makes your bot ignore other bots and itself
    // ! and not get into a spam loop (we call that "botception").
    if (message.author.bot || message.content.includes('@everyone') || message.content.includes('@here')) return;
    if (!prefixRegex.test(message.content)) return;
    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (message.mentions.has(client.user.id)) {
        client.commands.get('mention').execute(message);
    }
    else if (message.channel.type === 'dm') {
        if (message.author.bot) return;
        return message.reply(`Sorry ${message.author}! I can't reply you here. Ask in the server, I can help you there.`);
    }
    else if (message.content.includes(client.prefix + 'version')) {
        return message.reply(`My current version is ${client.version} 😎`);
    }
    else {
        if (!client.commands.has(commandName) || !message.content.startsWith(client.prefix)) return;
        if (command.args && args.length) {
            try {
                command.execute(client, message, args);
            }
            catch (error) {
                console.error(error.message);
                return message.channel.send(`There was an error trying to execute that command!, <@${client.maintainerID}> will check it.`);
            }
            return;
        }
        else {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }
    }
});

//  ! logging in the client.
client.login(client.token);