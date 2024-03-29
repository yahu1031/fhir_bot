const Discord = require('discord.js');
const wait = require('util').promisify(setTimeout);
module.exports = (client) => {
    client.on('interactionCreate', async (interaction = new Discord.ButtonInteraction()) => {
        /**
         * As the message is in DM we get GuildID null.
         * So we manually assigning the guildID.
         */
        interaction.guildID = process.env.GUILD_ID;
        const user = interaction.guild.members.cache.get(interaction.user.id);
        const guildMember = interaction.guild.members.cache.get(interaction.user.id);
        if (interaction.customId === 'acceptTC') {
            const role = interaction.guild.roles.cache.get(process.env.ROLE_ID);
            user.roles.add(role);
            interaction.message.components[0].components[0].setDisabled(true);
            await interaction.deferUpdate();
            await interaction.editReply({ content: 'Thanks for accepting rules!', components: [interaction.message.components[0].components] });
        }
        else if (interaction.customId.includes('_accept')) {
            const guildRole = interaction.guild.roles.cache.find(role => role.name === interaction.customId.split('_')[0]);
            if (!guildMember.roles.cache.some(role => role.name === guildRole.name)) {
                guildMember.roles.add(guildRole);
            }
            if (guildRole.name != 'Guest') {
                let nickname;
                nickname = guildRole.name.charAt(0).toUpperCase() + guildRole.name.slice(1);
                if (guildRole.name.includes('@')) {
                    nickname = guildRole.name.charAt(1).toUpperCase() + guildRole.name.slice(2);
                    await guildMember.setNickname(`[@${nickname}] ${guildMember.user.username}`);
                }
                else if (guildRole.name === 'Moderator') {
                    await guildMember.setNickname(`[Mod] ${guildMember.user.username}`);
                }
                else if (guildRole.name.includes(' ')) {
                    nickname = guildRole.name.split(' ').map(t => t[0]).join('');
                    await guildMember.setNickname(`[${nickname.toUpperCase()}] ${guildMember.user.username}`);
                }
            }
            interaction.message.components[0].components[0].setDisabled(true);
            interaction.message.components[0].components.length = 1;
            await interaction.deferUpdate();
            await wait(4000);
            await interaction.editReply(
                {
                    content: 'Thanks for accepting the request',
                    components: [
                        interaction.message.components[0].components,
                    ],
                });
        }
        else if (interaction.customId.includes('role_yes')) {
            try {
                const guildRole = interaction.guild.roles.cache.find(role => role.name === interaction.customId.split('_')[0]);
                if (!guildRole) {
                    try {
                        await interaction.guild.roles.create(
                            {
                                name: interaction.customId.split('_')[0],
                                color: 'RANDOM',
                            });
                        await interaction.deferUpdate();
                        await interaction.message.delete();
                        await interaction.message.channel.send(`Successfully muted ${guildMember.user.username}`);
                    }
                    catch (err) {
                        return interaction.message.channel.send(`💔 Error: ${err.message}`);
                    }
                }
            }
            catch (err) {
                return interaction.message.channel.send(`💔 Error: ${err.message}`);
            }
        }
        else if (interaction.customId.includes('role_no')) {
            try {
                return await interaction.message.channel.send('Role creation canclled');
            }
            catch (err) {
                return interaction.message.channel.send(`💔 Error: ${err.message}`);
            }
        }
        else if (interaction.customId.includes('_reject')) {
            await interaction.deferUpdate();
            interaction.message.delete();
        }
        else if (interaction.customId === '@Hacker_HackTCAccept') {
            if (!user.roles.cache.get(client.hacker_role_id)) {
                try {
                    await user.roles.add(client.hacker_role_id);
                    const guildHackRole = interaction.guild.roles.cache.find(role => role.name === interaction.customId.split('_')[0]);
                    await guildMember.setNickname(`[@${guildHackRole.name.charAt(1).toUpperCase() + guildHackRole.name.slice(2).toLowerCase()}] ${guildMember.user.username}`);
                    await interaction.reply(
                        {
                            content: 'Thank you, Welcome to FHIR @HACK.',
                            ephemeral: true,
                        },
                    );
                    return;
                }
                catch (err) {
                    console.log(err.message);
                }
            }
            return interaction.reply(
                {
                    content: 'You have already accepted the rules.',
                    ephemeral: true,
                },
            );
        }
        else if (interaction.customId === '@Hacker_HackTCReject') {
            return interaction.reply(
                {
                    content: 'Sorry, You need to agree to the rules to continue.',
                    ephemeral: true,
                },
            );
        }
    });
};
