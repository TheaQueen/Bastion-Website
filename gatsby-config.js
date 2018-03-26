module.exports = {
  siteMetadata: {
    title: 'The Bastion Bot',
    description: 'Add Bastion to Discord and give awesome perks to your Discord server!',
    generator: 'Bastion'
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
