const { Message } = require('discord.js');

module.exports = {
    name: 'rename',
    description: 'This command will rename the user nicknames.',
    args: false,
    async execute(client, message = new Message()) {
        if (message.author.bot) return;
        if (!message.member.permissions.has('ADMINISTRATOR')) return;
        const guildDATA = await client.guilds.fetch(client.guildID);
        const mem = await guildDATA.members.fetch();
        let getNickName;
        mem.forEach(async member => {
            if ((member.nickname != undefined || member.nickname != null) && member.nickname.includes('[@')) {
                if (member.nickname.split(' ')[0].includes('MODERATOR')) {
                    getNickName = `[@Mod] ${member.user.username}`;
                    await member.setNickname(getNickName);
                    return message.channel.send('Nicknames were changed');
                }
                getNickName = `[@${member.nickname.split(' ')[0].charAt(2).toUpperCase() + member.nickname.split(' ')[0].slice(3).toLowerCase()} ${member.user.username}`;
                await member.setNickname(getNickName);
                return message.channel.send('Nicknames were changed');
            }
        });
    },
};