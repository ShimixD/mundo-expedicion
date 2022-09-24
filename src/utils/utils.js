const { SnowTransfer } = require('snowtransfer');
const botClient = new SnowTransfer(`Bot ${process.env.DISCORD_TOKEN}`, { disableEveryone: true });

module.exports = {
    createMessage: async function (channelID, content) {
        return await botClient.channel.createMessage(channelID, content);
    }
}