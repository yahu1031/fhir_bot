const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'mute',
    description: 'This command will mute the user.',
    args: true,
    async execute(client, message, args) {
        if (message.author.bot) return;
        if (!message.member.permissions.has('MUTE_MEMBERS')) return message.channel.send('Sorry, we don\'t think you are one of the admins to mute.');
        const guildMember = message.mentions.members.first();
        if (!guildMember) return message.channel.send('Whom do you want to mute?');
        let muteReason = args.slice(1).join(' ');
        if (!muteReason) muteReason = 'No reason was provided';

        const muteEmbed = new MessageEmbed()
            .setTitle(`You were muted in ${message.guild.name}`)
            .setDescription(`Reason: ${muteReason}`)
            .setColor('RANDOM').setTimestamp()
            .setFooter(client.user.tag, client.user.displayAvatarURL());
        if (!args[0]) return message.channel.send('Please specify the user.');
        if (!guildMember) return message.channel.send('User not found in the guild.');
        try {
            await guildMember.send({ embeds: [muteEmbed] }).then(async () => {
                // Mute the user
                // ------------------- CODE HERE ------------------- //
                return message.channel.send(`Successfully muted **${guildMember.user.username}**.`);
            },
            );
        }
        catch (err) {
            return message.channel.send(`Error: ${err.message}`);
        }
    },
};