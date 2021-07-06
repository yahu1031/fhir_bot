const Discord = require('discord.js');
module.exports = {
    name: 'ticket',
    description: 'This command will create a channel with name of user for checking out the ticket issues.',
    args: false,
    aliases: [],
    permissions: [],
    async execute(client, message = new Discord.Message()) {
        const channel = await message.guild.channels.create(`ticket: ${message.author.tag}`);
        try {
            await channel.setParent(client.tickets_category);
            await channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
                VIEW_CHANNEL: false,
            }).catch(console.error);
            await channel.updateOverwrite(message.author, {
                SEND_MESSAGES: true,
                ADD_REACTIONS: false,
                VIEW_CHANNEL: true,
            }).catch(console.error);
            const reactionMessage = await channel.send('Thank you for contating support!');
            await reactionMessage.react('🔒');
            await reactionMessage.react('⛔');
            const collector = reactionMessage.createReactionCollector(
                (reaction, user) => message.guild.members.cache.find(
                    (member) => member.id === user.id)
                    .permissions.has('ADMINISTRATOR'),
                { dispose: true },
            );
            collector.on('collect', async (reaction, user) => {
                const reactedUserPermissions = message.guild.members.cache.get(user.id).permissions.has('MANAGE_CHANNELS');
                if (reactedUserPermissions) {
                    switch (reaction.emoji.name) {
                        case '🔒':
                            await channel.updateOverwrite(
                                message.author,
                                {
                                    SEND_MESSAGES: false,
                                },
                            );
                            break;
                        case '⛔':
                            await channel.send('Deleting this channel in 5 seconds!');
                            setTimeout(async () => {
                                await channel.delete();
                            }, 5000);
                            break;
                    }
                }
            });
            await message.channel.send(`Your ticket channel has been generated, check in ${channel} channel.`).then((msg) => {
                setTimeout(async () => {
                    await msg.delete();
                }, 5000);
                setTimeout(async () => {
                    await message.delete();
                }, 1000);
            }).catch(async err => {
                await channel.send(`❌ Error: ${err.message}`);
                console.error(`❌ Error: ${err.message}`);
                throw err;
            });
        }
        catch (err) {
            await channel.send(`❌ Error: ${err.message}`);
            console.error(`❌ Error: ${err.message}`);
            throw err;
        }
    },
};