module.exports = {
  siteMetadata: {
    title: 'The Bastion Bot - One of the best Discord Bot',
    meta: [
      { name: 'description', content: 'Give awesome perks to your server!' },
      { name: 'keywords',
        content: 'bastion, bastion bot, discord, discord bot, bot, music,'
          + ' currency, the best discord bot, best discord bot, best bot,'
          + ' stream, game, fun, administration, moderation, queries,'
          + ' searches, gambling, game stats, stats, info' },
      { property: 'og:title', content: 'The Bastion Bot' },
      { property: 'og:description',
        content: 'Give awesome perks to your Discord server!' },
      { property: 'og:url', content: 'https://bastionbot.org' },
      { property: 'og:image',
        content: 'https://resources.bastionbot.org/og-image.jpg' },
      { property: 'og:image:width', content: '1000' },
      { property: 'og:image:height', content: '524' }
    ]
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#61d7fb'
      },
    }
  ]
};
