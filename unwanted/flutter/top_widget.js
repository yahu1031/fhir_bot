const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'topwidget',
    description: 'This command will mute the user.',
    args: true,
    execute(client, message, args) {
        if (message.author.bot) return;
        const data = client.flutterData;
        if (!data) {
            return message.channel.send('No data found');
        }
        else {
            try {
                const topWidget = client.flutterData.find(
                    d => d.name.toLowerCase() === args[0].toLowerCase() && d.type === 'class',
                );
                const result = new MessageEmbed()
                    .setColor('#46D1FD')
                    .setThumbnail('https://cdn.discordapp.com/attachments/756903745241088011/775823132375515156/flutter.webp')
                    .setTitle(`Top result of ${topWidget.name}`)
                    .addFields({
                        name: topWidget.type + topWidget.enclosedBy.name,
                        value: client.docsLink + topWidget.href,
                    });
                return message.channel.send(
                    {
                        content: `**${topWidget.name.toUpperCase()}** ${topWidget.enclosedBy.name} Result`,
                        embeds: [result],
                    });
            }
            catch (err) {
                return (typeof topWidget !== undefined) ?
                    message.channel.send(client.notFoundMsg) : console.log('❌️ Top widget error: ' + err.message);
            }
        }
    },
};