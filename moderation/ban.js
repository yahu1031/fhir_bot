const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'ban',
    description: 'This command will ban the user.',
    args: true,
    async execute(client, message, args) {
        if (message.author.bot) return;
        if (!message.member.permissions.has('BAN_MEMBERS')) return;
        const mentionMember = message.mentions.members.first();
        let banReason = args.slice(1).join(' ');
        if (!banReason) banReason = 'No reason was provided';
        const banMsgDM = new MessageEmbed()
            .setTitle(`You were banned from ${message.guild.name}`)
            .setDescription(`Reason: ${banReason}`)
            .setColor('RANDOM').setTimestamp().setFooter(client.user.tag, client.user.displayAvatarURL());
        if (!args[0]) return message.channel.send('Please specify the user.');
        if (!mentionMember) return message.channel.send('User not found in the guild.');
        if (!mentionMember.bannable) return message.channel.send('Cannot able to ban the user out.');
        try {
            await mentionMember.send({ embeds: [banMsgDM] }).then(async () => {
                await mentionMember.ban({ reason: banReason });
                return message.channel.send(`Successfully banned **${mentionMember.user.username}** from the server.`);
            },
            );
        }
        catch (err) {
            return message.channel.send(`Error: ${err.message}`);
        }
    },
};