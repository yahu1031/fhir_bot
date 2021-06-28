module.exports = {
    name: 'warn',
    description: 'This command will warn the user.',
    args: true,
    execute(client, message) {
        if (message.author.bot) return;
    },
};