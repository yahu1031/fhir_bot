const Discord = require('discord.js');
module.exports = {
    name: 'rule',
    description: 'This command will create a channel with name of user for checking out the ticket issues.',
    args: false,
    aliases: [],
    permissions: [],
    async execute(client, message = new Discord.Message()) {
        if (message.author.bot) return;
        if (!message.member.permissions.has('ADMINISTRATOR')) return;
        if (message.channel.id === client.hackthon_rules_channel) {
            const acceptHackTC = new Discord.MessageButton().setCustomID('@Hacker_HackTCAccept')
                .setLabel('Accept T&C')
                .setStyle('SUCCESS');
            const rejectHackTC = new Discord.MessageButton().setCustomID('@Hacker_HackTCReject')
                .setLabel('Decline')
                .setStyle('DANGER');
            const hackButtons = new Discord.MessageActionRow()
                .addComponents([acceptHackTC, rejectHackTC]);
            setTimeout(async () => {
                await message.delete();
            }, 2000);
            await message.channel.send({
                content: 'Please accept the above rules.',
                components: [hackButtons],
            });
            return;
        }
        else {
            await message.channel.send('Sorry you can\'t use it here');
            return;
        }
    },
};