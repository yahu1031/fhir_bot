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
        const chan = await message.mentions.channels.first();
        const userRole = await message.mentions.roles.first();
        mem.forEach(async (member = new GuildMember()) => {
            try {
                if (!member.user.bot && guildDATA.ownerId !== member.user.id) {
                    if (!chan && !userRole) {
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
                console.error(`${member.nickname} or ${member.user.username} has error`);
            }
        });
        return message.channel.send('Nickname set to null');
    },
};