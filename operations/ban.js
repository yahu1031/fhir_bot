module.exports = {
    name: 'ban',
    description: 'This command will ban the user.',
    args: true,
    execute(client, message) {
        if (message.author.bot) return;
    },
};