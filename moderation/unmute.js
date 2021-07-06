const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'unmute',
    description: 'This command will unmute the user.',
    args: true,
    async execute(client, message, args) {
        if (message.author.bot) return;
        if (!message.member.permissions.has('MUTE_MEMBERS')) return;
        const guildMember = message.mentions.members.first();
        if (!guildMember) return message.channel.send('Whom do you want to unmute?');
        let unmuteReason = args.slice(1).join(' ');
        if (!unmuteReason) unmuteReason = 'No reason was provided';
        const unmuteEmbed = new MessageEmbed()
            .setTitle(`You were unmuted in ${message.guild.name}`)
            .setColor('RANDOM').setTimestamp()
            .setFooter(client.user.tag, client.user.displayAvatarURL());
        if (!args[0]) return message.channel.send('Please specify the user.');
        if (!guildMember) return message.channel.send('User not found in the guild.');
        try {
            await guildMember.send({ embeds: [unmuteEmbed] }).then(async () => {
                const guildMemberRole = message.guild.roles.cache.find(role => role.name === 'Guest');
                const guildMuteRole = message.guild.roles.cache.find(role => role.name === 'mute');
                await guildMember.roles.remove(guildMuteRole.id);
                await guildMember.roles.add(guildMemberRole.id);
                return message.channel.send(`Successfully unmuted **${guildMember.user.username}**.`);
            },
            );
        }
        catch (err) {
            return message.channel.send(`Error: ${err.message}`);
        }
    },
};
