module.exports = (client) => {
    client.on('interaction', async interaction => {
        /**
         * As the message is in DM we get GuildID null.
         * So we manually assigning the guildID.
         */
        interaction.guildID = process.env.GUILD_ID;

        if (interaction.customID === 'acceptTC') {
            const role = interaction.guild.roles.cache.get(process.env.ROLE_ID);
            const user = interaction.guild.members.cache.get(interaction.user.id);
            user.roles.add(role);
            interaction.message.components[0].components[0].setDisabled(true);
            await interaction.deferUpdate();
            await interaction.editReply({ content: 'Thanks for accepting rules!', components: [interaction.message.components[0].components] });
        }
        else if (interaction.customID.includes('_accept')) {
            const guildRole = interaction.guild.roles.cache.find(role => role.name === interaction.customID.split('_')[0]);
            const guildMember = interaction.guild.members.cache.get(interaction.user.id);
            guildMember.roles.add(guildRole);
            if (guildRole.name != 'member') {
                guildMember.setNickname(`[${guildRole.name.toUpperCase()}] ${guildMember.user.username}`);
            }
            interaction.message.components[0].components[0].setDisabled(true);
            interaction.message.components[0].components.length = 1;
            await interaction.deferUpdate();
            await interaction.editReply(
                {
                    content: 'Thanks for accepting the request',
                    components: [
                        interaction.message.components[0].components,
                    ],
                });
        }
        else if (interaction.customID.includes('_reject')) {
            await interaction.deferUpdate();
            interaction.message.delete();
        }
    });
};