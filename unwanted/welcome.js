const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = (client) => {
    client.on('guildMemberAdd', async guildMember => {

        const joinHackathon = new MessageButton().setURL('https://google.com')
            .setLabel('Join us here')
            .setStyle('LINK');

        const acceptTC = new MessageButton().setCustomId('acceptTC')
            .setLabel('Accept T&C')
            .setStyle('SUCCESS');
        const buttons = new MessageActionRow()
            .addComponents([acceptTC, joinHackathon]);

        // If the joined user is bot, it returns
        if (guildMember.user.bot) return;
        // Sending user private message.
        await guildMember.send({
            content: `Ola! <@!${guildMember.user.id}>, We are really glad that you joined us. Please go through <#${client.rules_channel}>`,
            components: [
                buttons,
            ],
        });
        // Also welco
        await guildMember.guild.channels.cache.get(client.welcome_channel).send(`Welcome <@!${guildMember.user.id}>`);
    });
};