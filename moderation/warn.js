const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'warn',
    description: 'This command will warn the user.',
    args: true,
    async execute(client, message, args) {
        if (message.author.bot) return;
        if (!message.member.permissions.has('MUTE_MEMBERS')) return message.channel.send('Sorry, we don\'t think you are one of the admins to warn.');
        const guildMember = message.mentions.members.first();
        if (!guildMember) return message.channel.send('Whom do you want to warn?');
        let warnReason = args.slice(1).join(' ');
        if (!warnReason) warnReason = 'No reason was provided';

        const warnEmbed = new MessageEmbed()
            .setTitle(`You were warned from ${message.guild.name}`)
            .setDescription(`Reason: ${warnReason}`)
            .setColor('RANDOM').setTimestamp()
            .setFooter(client.user.tag, client.user.displayAvatarURL());
        if (!args[0]) return message.channel.send('Please specify the user.');
        if (!guildMember) return message.channel.send('User not found in the guild.');
        try {
            await guildMember.send({ embeds: [warnEmbed] }).then(() => {
                return message.channel.send(`Successfully warned **${guildMember.user.username}**.`);
            },
            );
        }
        catch (err) {
            return message.channel.send(`Error: ${err.message}`);
        }
    },
};