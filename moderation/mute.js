const ms = require('ms');
const { MessageButton, MessageEmbed, MessageActionRow } = require('discord.js');
module.exports = {
    name: 'mute',
    description: 'This command will mute the user.',
    args: true,
    async execute(client, message, args) {
        if (message.author.bot) return;
        if (!message.member.permissions.has('MUTE_MEMBERS')) return;
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
                const guildMemberRole = message.guild.roles.cache.find(role => role.name === 'Guest');
                const guildMuteRole = message.guild.roles.cache.find(role => role.name === 'mute');
                if (!args[1]) {
                    if (guildMuteRole) {
                        if (guildMember.roles.cache.has('860138656601210891')) return message.channel.send(`${guildMember.user.username} was already muted`);
                        await guildMember.roles.remove(guildMemberRole.id);
                        await guildMember.roles.add(guildMuteRole.id);
                        return message.channel.send(`Successfully muted **${guildMember.user.username}**.`);
                    }
                    else {
                        const doCreateMuteRole = new MessageButton().setCustomID('mute_role_yes')
                            .setLabel('Create')
                            .setStyle('SUCCESS');
                        const noCreateMuteRole = new MessageButton().setCustomID('mute_role_no')
                            .setLabel('No, Thank you')
                            .setStyle('DANGER');
                        const roleBtns = new MessageActionRow()
                            .addComponents([doCreateMuteRole, noCreateMuteRole]);
                        message.channel.send('There is no such role called mute.');
                        return message.channel.send({
                            content: 'Do you want me to create one?',
                            components: [roleBtns],
                        });
                    }
                }
                if (guildMuteRole) {
                    await guildMember.roles.add(guildMuteRole.id);
                    await guildMember.roles.remove(guildMemberRole.id);
                    message.channel.send(`Successfully muted **${guildMember.user.username}** for ${ms(ms(args[1]))}.`);
                }
                else {
                    return message.channel.send('There is no such role called mute.');
                }
                setTimeout(async function () {
                    await guildMember.roles.remove(guildMuteRole.id);
                    await guildMember.roles.add(guildMemberRole.id);
                    return message.channel.send(`Successfully unmuted **${guildMember.user.username}** after ${ms(ms(args[1]))}.`);
                });
            },
            );
            return;
        }
        catch (err) {
            return message.channel.send(`💔 Error: ${err.message}`);
        }
    },
};