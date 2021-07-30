const { Message, GuildMember } = require('discord.js');

module.exports = {
    name: 'rename',
    description: 'This command will rename the user nicknames.',
    args: true,
    async execute(client, message = new Message(), args) {
        if (message.author.bot) return;
        if (!message.member.permissions.has('ADMINISTRATOR')) return;
        const guildDATA = await client.guilds.fetch(client.guildID);
        const mem = await guildDATA.members.fetch();
        const chan = message.mentions.channels.first();
        const userRole = message.mentions.roles.first();
        if (args[1] === 'reset'.toLowerCase()) {
            if (chan || userRole || args[0] === 'all'.toLowerCase()) {
                await mem.forEach(async (member = new GuildMember()) => {
                    try {
                        if (!member.user.bot && guildDATA.ownerId !== member.user.id) {
                            if (!chan && !userRole && args[0] === 'all'.toLowerCase()) {
                                await member.setNickname(null);
                            }
                            else if (userRole && member.roles.cache.has(userRole.id)) {
                                await member.setNickname(null);
                            }
                            else if (chan && member.permissionsIn(chan).has('VIEW_CHANNEL')) {
                                await member.setNickname(null);
                            }
                        }
                    }
                    catch (err) {
                        return console.error(`💥 ${member.nickname} or ${member.user.username} has error resetting nickname.`);
                    }
                });
                return message.channel.send('Resetting nicknames was done');
            }
        }
        else if (args[1] === 'add'.toLowerCase()) {
            const unchangeUser = [];
            if (userRole) {
                mem.forEach(async (member = new GuildMember()) => {
                    try {
                        if (member.roles.cache.has(userRole.id)) {
                            if (member.nickname === null) {
                                await member.setNickname(`${member.user.username} ${args[2]}`);
                            }
                            else {
                                if (member.nickname.includes(args[2])) {
                                    unchangeUser.push(member.user.username);
                                }
                                else {
                                    await member.setNickname(`${member.nickname} ${args[2]}`);
                                }
                            }
                        }
                    }
                    catch (err) {
                        return console.error(`💥 ${member.nickname} or ${member.user.username} has error setting nickname.`);
                    }
                });
                if (unchangeUser.length > 0) {
                    return message.channel.send(`${unchangeUser.toString().replace(',', ', ')} already has nicknames including ${args[2]}`);
                }
                return message.channel.send('Setting nicknames was done');
            }
        }
        return message.channel.send('Check the command please.\n**USAGE:** !rename <@Role>|<#Channel>|all reset|add DATA\n**EG: !rename @role add 🔥\n or\n !rename @role \\|\\| #channel \\|\\| all reset**');
    },
};