const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'role',
    description: 'This command will manager roles.',
    args: true,
    execute(client, message, args) {
        if (message.author.bot) return;
        // const roles = [];
        if (message.content.startsWith(client.prefix)) {
            const cmd_name = message.content.trim().substring(client.prefix.length)
                .split(/\s+/);
            if (cmd_name[0] === 'role') {
                if (message.member.permissions.has('MANAGE_ROLES')) {
                    // Checking for the arguments.
                    if (args.length != 0) {
                        const guildMemberID = args[1];
                        if (args[0] === 'add' && guildMemberID.length === 18) {
                            const guildMember = message.guild.members.cache.get(guildMemberID);
                            if (guildMember === undefined || isNaN(guildMemberID)) {
                                return message.channel.send('Sorry user not found.');
                            }
                            const checkRole = message.guild.roles.cache.find(x => x.name === args[2]);
                            if (checkRole === undefined) {
                                return message.channel.send('Sorry! no such role exist in server.');
                            }
                            guildMember.send({
                                content: `Hello ${guildMember.user.username}! You are requested to join as ${args[2]}`,
                                components: [new MessageActionRow()
                                    .addComponents([
                                        new MessageButton().setCustomID(`${args[2]}_accept`)
                                            .setLabel('Accept')
                                            .setStyle('SUCCESS'),
                                        new MessageButton().setCustomID(`${args[2]}_reject`)
                                            .setLabel('Reject')
                                            .setStyle('DANGER'),
                                    ]),
                                ],
                            });
                        }
                        else if (args[0] === 'remove' && guildMemberID.length === 18) {
                            const guildMember = message.guild.members.cache.get(guildMemberID);
                            if (guildMember === undefined || isNaN(guildMemberID)) {
                                return message.channel.send('Sorry user not found.');
                            }
                            const checkRole = message.guild.roles.cache.find(x => x.name === args[2]);
                            if (checkRole === undefined) {
                                return message.channel.send('Sorry! no such role exist in server.');
                            }
                            const guildRole = message.guild.roles.cache.find(role => role.name === args[2]);
                            if (guildMember.nickname.includes(guildRole.name.toUpperCase())) {
                                guildMember.setNickname(null);
                            }
                            guildMember.roles.remove(guildRole);
                            message.channel.send(`Removed **${guildRole.name.toUpperCase()}** role for ${guildMember.user.username}.`);
                        }
                        else if (args[0] === 'create') {
                            if (args[1] === 'help') {
                                const embed = new MessageEmbed()
                                    .setColor('#0099ff')
                                    .setTitle('Create role usage')
                                    .setDescription('**EG:** !role create role_name color');
                                return message.channel.send({
                                    ephemeral: true,
                                    embeds: [embed],
                                });
                            }
                            try {
                                if (args[1] != null && args[2] != null) {
                                    const checkRole = message.guild.roles.cache.find(x => x.name === args[1]);
                                    if (checkRole === undefined) {
                                        message.guild.roles.create(
                                            {
                                                name: args[1],
                                                color: args[2].toUpperCase(),
                                            });
                                    }
                                    else {
                                        message.channel.send('Role already exist, use it or create a new role.');
                                    }
                                }
                                else {
                                    return message.channel.send('You are missing something, please use `!role create help` for help in creating role.');
                                }
                            }
                            catch (err) {
                                console.error(err.message);
                            }
                        }
                        else if (args[0] === 'help') {
                            const rolemap = message.guild.roles.cache
                                .sort((a, b) => b.position - a.position)
                                .map(r => r)
                                .join(', ');
                            const embed = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('Role command usage')
                                .setDescription('**EG:** !role action 876xxxUSERxIDxxx role')
                                .addFields(
                                    {
                                        name: 'Action',
                                        value: 'We have 3 actions - add, remove, create',
                                    },
                                    {
                                        name: 'role',
                                        value: rolemap,
                                    },
                                );
                            return message.channel.send({
                                content: 'Please make sure of the command usage.',
                                ephemeral: true,
                                embeds: [embed],
                            });
                        }
                        else {
                            message.channel.send('No such command found.');
                        }
                    }
                    else {
                        message.channel.send('Missing arguments, check with `!role help`.');
                    }
                }
                else {
                    return message.channel.send({ content: 'Sorry you don\'t have rights to assign a role', ephemeral: true });
                }
            }
            else {
                message.channel.send('No such command found');
            }
        }
    },
};