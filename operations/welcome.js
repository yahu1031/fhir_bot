module.exports = (client) => {
    client.on('guildMemberAdd', guildMember => {
        if (guildMember.user.bot) return;
        guildMember.send('Hello there');
        guildMember.guild.channels.cache.get('858246059712184332').send(`Welcome <@!${guildMember.user.id}>`)
    });
};