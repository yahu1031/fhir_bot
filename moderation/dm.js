const { Message } = require('discord.js');
module.exports = {
    name: 'dm',
    description: 'This command will text to the user in their DM.',
    args: true,
    async execute(client, message = new Message(), args) {
        try {
            if (message.author.bot) return;
            if (!message.member.permissions.has('ADMINISTRATOR')) return;
            const role = message.mentions.roles.first();
            const guildUser = message.mentions.users.first();
            const messageContent = args.slice(1).join(' ');
            if (!args[0]) return message.reply('Please provide a role.');
            if (!messageContent) return message.reply('Please provide a message.');
            if (!role) {
                const guildMem = message.guild.members.cache.get(guildUser.id);
                return await guildMem.send(messageContent);
            }
            else {
                const getData = message.guild.roles.cache.get(role.id);
                getData.members.forEach(
                    async member => await member.send(messageContent),
                );
                return;
            }
        }
        catch (err) {
            console.error('DMig Error: ' + err.message);
        }
    },
};