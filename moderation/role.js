const { MessageActionRow, MessageButton, MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: 'role',
    description: 'This command will manager roles.',
    args: true,
    async execute(client, message = new Message(), args) {
        if (message.author.bot) return;
        if (!message.member.permissions.has('MANAGE_ROLES')) return;
        // const roles = [];
        if (message.content.startsWith(client.prefix)) {
            const guildMember = message.mentions.users.first();
            const roleName = message.mentions.roles.first().name;
            const cmd_name = message.content.trim().substring(client.prefix.length)
                .split(/\s+/);
            if (cmd_name[0] === 'role') {
                if (message.member.permissions.has('MANAGE_ROLES')) {
                    // Checking for the arguments.
                    if (args.length != 0) {
                        if (args[0] === 'add') {
                            if (guildMember === undefined) {
                                return message.channel.send('Sorry user not found.');
                            }
                            const checkRole = message.guild.roles.cache.find(x => x.name === roleName);
                            if (checkRole === undefined) {
                                return message.channel.send('Sorry! no such role exist in server.');
                            }
                            await guildMember.send({
                                content: `Hello ${guildMember.username}! You are requested to join as ${roleName}`,
                                components: [new MessageActionRow()
                                    .addComponents([
                                        new MessageButton().setCustomID(`${roleName}_accept`)
                                            .setLabel('Accept')
                                            .setStyle('SUCCESS'),
                                        new MessageButton().setCustomID(`${roleName}_reject`)
                                            .setLabel('Reject')
                                            .setStyle('DANGER'),
                                    ]),
                                ],
                            });
                            return message.channel.send(`Send request to ${guildMember.username} to join as ${roleName}.`);
                        }
                        else if (args[0] === 'remove') {
                            // const guildMember = message.guild.members.cache.get(guildMemberID);
                            if (guildMember === undefined) {
                                return message.channel.send('Sorry user not found.');
                            }
                            const checkRole = message.guild.roles.cache.find(x => x.name === roleName);
                            if (checkRole === undefined) {
                                return message.channel.send('Sorry! no such role exist in server.');
                            }
                            const guildRole = message.guild.roles.cache.find(role => role.name === roleName);
                            if (guildMember.nickname && guildMember.nickname.includes(guildRole.name.toUpperCase())) {
                                await guildMember.setNickname(null);
                            }
                            await guildMember.roles.remove(guildRole);
                            return message.channel.send(`Removed **${guildRole.name.toUpperCase()}** role for ${guildMember.username}.`);
                        }
                        else if (args[0] === 'create') {
                            if (args[1] === 'help') {
                                const embed = new MessageEmbed()
                                    .setColor('#0099ff')
                                    .setTitle('Create role usage')
                                    .setDescription('**EG:** !role create role_name color');
                                return message.channel.send({
                                    embeds: [embed],
                                });
                            }
                            try {
                                if (args[1] != null && roleName != null) {
                                    const checkRole = message.guild.roles.cache.find(x => x.name === args[1]);
                                    if (checkRole === undefined) {
                                        message.guild.roles.create(
                                            {
                                                name: args[1],
                                                color: roleName.toUpperCase(),
                                            });
                                        return message.channel.send(`**${args[1]}** Role has been created.`);
                                    }
                                    else {
                                        return message.channel.send('Role already exist, use it or create a new role.');
                                    }
                                }
                                else {
                                    return message.channel.send('You are missing something, please use `!role create help` for help in creating role.');
                                }
                            }
                            catch (err) {
                                return console.error(err.message);
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
                                .setDescription('**EG:** !role action @USER role')
                                .addFields(
                                    {
                                        name: 'add',
                                        value: 'Requests the user to get on to the role. EG: !role add @USER role_name',
                                    },
                                    {
                                        name: 'create',
                                        value: 'Creates a new role. EG: !role create role_name color',
                                    },
                                    {
                                        name: 'remove',
                                        value: 'Remvoes the role for the user. EG: !role remove @USER role_name',
                                    },
                                    {
                                        name: 'delete',
                                        value: 'Deletes the role from the guild. EG: !role delete role_name',
                                    },
                                    {
                                        name: 'Roles List',
                                        value: rolemap,
                                    },
                                );
                            return message.channel.send({
                                content: 'Please make sure of the command usage.',
                                ephemeral: true,
                                embeds: [embed],
                            });
                        }
                        else if (args[0] === 'delete') {
                            const deleteRole = message.guild.roles.cache.find(x => x.name === args[1]);
                            if (deleteRole) {
                                await deleteRole.delete();
                                return message.channel.send(`**${args[1]}** Role has been deleted.`);
                            }
                            else {
                                return message.channel.send(`Sorry, No such **${args[1]}** role found in guild.`);
                            }
                        }
                        else {
                            return message.channel.send('No such command found.');
                        }
                    }
                    else {
                        return message.channel.send('Missing arguments, check with `!role help`.');
                    }
                }
                else {
                    return message.channel.send({ content: 'Sorry you don\'t have rights to assign a role', ephemeral: true });
                }
            }
            else {
                return message.channel.send('No such command found');
            }
        }
    },
};