const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'widget',
    description: 'This command will mute the user.',
    args: true,
    execute(client, message, args) {
        if (message.author.bot) return;
        const result = [];
        const data = client.flutterData;
        if (!data) {
            return message.channel.send('No data found');
        }
        else {
            const allWidgets = data.filter(d => d.name.toLowerCase().includes(args[0].toLowerCase()) && d.type === 'constructor');
            const [hrefs, names] = ['href', 'name'].map(p => allWidgets.map(td => td[p]));
            for (let i = 0; i < allWidgets.length; i++) {
                const embededLinks = {
                    name: names[i],
                    value: client.docsLink + hrefs[i],
                };
                result.push(embededLinks);
            }
            const response = new MessageEmbed()
                .setColor('#46D1FD')
                .setThumbnail('https://cdn.discordapp.com/attachments/756903745241088011/775823132375515156/flutter.webp')
                .setTitle(`All results for ${allWidgets[0].name} Widget/Object`)
                .addFields(result);
            return message.channel.send({
                content: allWidgets.length === 0 ? 'Content' : 'client.notFoundMsg',
                embeds: [response],
            });
        }
    },
};