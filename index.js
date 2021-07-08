require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client(
    {
        intents: [Discord.Intents.ALL],
        partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
    },
);
const interactions = require('./operations/interactions');
// const twitter = require('./operations/tweets');

// const { fetchData } = require('./operations/get_flutter_data');

//  ! Environment variables.
client.token = process.env.BOT_TOKEN;
client.prefix = process.env.PREFIX;
client.welcome_channel = process.env.WELCOME_CHANNEL;
client.rules_channel = process.env.RULES_CHANNEL;
client.tweets_channel = process.env.TWEETS_CHANNEL;
client.maintainerID = process.env.MAINTAINER;
client.guildID = process.env.GUILD_ID;
client.flutterApi = process.env.FLUTTER_API;
client.docsLink = process.env.DOCS_BASE_URL;
client.hackthon_category = process.env.HACKATHON_CATEGORY;
client.tickets_category = process.env.TICKETS_CATEGORY;
client.hackthon_rules_channel = process.env.HACKATHON_RULES_CHANNEL;
client.hacker_role_id = process.env.HACKER_ROLE_ID;
client.at_support_channel = process.env.AT_SUPPORT_CHANNEL;
client.version = '1.0.5+2';

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

//  ! Reading command files dynamically.
client.commands = new Discord.Collection();

//  ! Retrieving all command files.
const operationFiles = fs.readdirSync('./operations').filter(operationFile => operationFile.endsWith('.js'));
const moderationFiles = fs.readdirSync('./moderation').filter(moderationFile => moderationFile.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(commandFile => commandFile.endsWith('.js'));
// const flutterFiles = fs.readdirSync('./flutter').filter(flutterFile => flutterFile.endsWith('.js'));

//  ! Dynamically setting commands to the Collection.
for (const operationFile of operationFiles) {
    const operation = require(`./operations/${operationFile}`);
    client.commands.set(operation.name, operation);
}

for (const commandFile of commandFiles) {
    const userCommand = require(`./commands/${commandFile}`);
    client.commands.set(userCommand.name, userCommand);
}

for (const moderationFile of moderationFiles) {
    const moderation = require(`./moderation/${moderationFile}`);
    client.commands.set(moderation.name, moderation);
}

// for (const flutterFile of flutterFiles) {
//     const flutter = require(`./flutter/${flutterFile}`);
//     client.commands.set(flutter.name, flutter);
// }

client.on('ready', () => {
    try {
        // await fetchData(client);
        client.user.setPresence({
            activities: [{
                name: 'Breathing FHIR 24x7',
                url: 'https://atsign.com',
            }],
            status: 'online',
        });
        console.log(`${client.user.tag} Bot is ready`);
        // welcome(client);
        interactions(client);
        // twitter(client);
    }
    catch (err) {
        console.error(err.message);
    }
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
    // if (message.channel.parentID != client.hackthon_category) return;
    // ! This makes your bot ignore other bots and itself
    // ! and not get into a spam loop (we call that "botception").
    if (message.author.bot || message.content.includes('@everyone') || message.content.includes('@here')) return;
    if (!prefixRegex.test(message.content)) return;
    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(a => a.aliases && a.aliases.includes(commandName));
    if (message.content.includes(client.prefix + 'version')) {
        return message.reply(`My current version is ${client.version} 😎`);
    }
    else {
        if (!client.commands.has(commandName) || !message.content.startsWith(client.prefix)) return;
        try {
            command.execute(client, message, args);
        }
        catch (error) {
            console.error(error.message);
            return message.channel.send(`There was an error trying to execute that command!, <@${client.maintainerID}> will check it.`);
        }
        return;
    }
});

//  ! logging in the client.
client.login(client.token);