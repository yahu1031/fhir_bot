const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'kick',
    description: 'This command will kick the user.',
    args: true,
    async execute(client, message, args) {
        if (message.author.bot) return;
        if (!message.member.permissions.has('KICK_MEMBERS')) return;
        const guildMember = message.mentions.members.first();
        let kickReason = args.slice(1).join(' ');
        if (!kickReason) kickReason = 'No reason was provided';
        const kickEmbed = new MessageEmbed()
            .setTitle(`You were kicked from ${message.guild.name}`)
            .setDescription(`Reason: ${kickReason}`)
            .setColor('RANDOM').setTimestamp().setFooter(client.user.tag, client.user.displayAvatarURL());
        if (!args[0]) return message.channel.send('Please specify the user.');
        if (!guildMember) return message.channel.send('User not found in the guild.');
        if (!guildMember.kickable) return message.channel.send('Cannot able to kick the user out.');
        try {
            await guildMember.send({ embeds: [kickEmbed] }).then(async () => {
                await guildMember.kick(kickReason);
                return message.channel.send(`Successfully kicked **${guildMember.user.username}** from the server.`);
            },
            );
        }
        catch (err) {
            return message.channel.send(`Error: ${err.message}`);
        }
    },
};