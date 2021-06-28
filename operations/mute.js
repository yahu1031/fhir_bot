module.exports = {
    name: 'mute',
    description: 'This command will mute the user.',
    args: true,
    execute(client, message) {
        if (message.author.bot) return;
    },
};