const Twit = require('twit');
const { MessageEmbed } = require('discord.js');

const T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 100,
    strictSSL: true,
});

module.exports = (client) => {
    try {
        const params = { follow: '1210128529414688768' };
        const stream = T.stream('statuses/filter', params);
        stream.on('tweet', function (event) {
            console.log(event.entities.url);
            findMatches(event);
            const twitterEmbed = new MessageEmbed().setColor('#1da1f2')
                .setAuthor(event.user.name, event.user.profile_image_url_https, `https://twitter.com/${event.user.screen_name}`)
                .setDescription(event.text)
                .setImage(event.entities.media ? event.entities.media[0].media_url_https : null)
                .setFooter('Twitter', 'https://download.logo.wine/logo/Twitter/Twitter-Logo.wine.png')
                .setTimestamp();
            const twitChannel = client.channels.cache.find(cha => cha.id === client.tweets_channel);
            return twitChannel.send(
                {
                    embeds: [twitterEmbed],
                },
            );
        });
        stream.on('error', function (error) {
            throw error.message;
        });
    }
    catch (e) {
        console.error(e.message);
    }
};

function findMatches(event) {
    // const link = tweetContent.includes(mediaURL);
    // const mediaLink = tweetContent.includes(mediaURL);
    // if (!link) return;
    // if (link) {
    for (let i = 0; i < event.entities.media.length; i++) {
        console.log(event.entities.media[i].media_url_https);
        // }
    }
    // const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    // var urlRegex = /(https?:\/\/[^\s]+)/g;
}