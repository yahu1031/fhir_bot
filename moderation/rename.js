const { Message, GuildMember } = require('discord.js');

module.exports = {
    name: 'rename',
    description: 'This command will rename the user nicknames.',
    args: true,
    async execute(client, message = new Message()) {
        if (message.author.bot) return;
        if (!message.member.permissions.has('ADMINISTRATOR')) return;
        const guildDATA = await client.guilds.fetch(client.guildID);
        const mem = await guildDATA.members.fetch();
        const chan = await message.mentions.channels.first();
        mem.forEach(async (member = new GuildMember()) => {
            // if (member.permissionsIn()) return;
            try {
                if (!member.user.bot && guildDATA.ownerId !== member.user.id) {
                    if (chan && member.permissionsIn(chan).has('VIEW_CHANNEL')) {
                        await member.setNickname(null);
                    }
                    else if (!chan) {
                        await member.setNickname(null);
                    }
                }
            }
            catch (err) {
                console.error(`${member.nickname} or ${member.user.username} has error`);
            }
        });
        return;
    },
};