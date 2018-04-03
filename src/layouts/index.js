import React from 'react'
import Helmet from 'react-helmet'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SiteBanner from '../components/SiteBanner'
import BackToTop from '../components/BackToTop'
import './index.css'

class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <root>
        <Helmet
          title='The Bastion Bot - One of the best Discord Bot'
          meta={[
            { name: 'description', content: 'Give awesome perks to your server!' },
            { name: 'keywords', content: 'bastion, bastion bot, discord, discord bot, bot, music, currency, the best discord bot, best discord bot, best bot, stream, game, fun, administration, moderation, queries, searches, gambling, game stats, stats, info' },
            { name: 'generator', content: 'Bastion' },
            { property: 'og:title', content: 'The Bastion Bot' },
            { property: 'og:description', content: 'Give awesome perks to your Discord server!' },
            { property: 'og:url', content: 'https://bastionbot.org' },
            { property: 'og:image', content: 'https://resources.bastionbot.org/og-image.jpg' },
            { property: 'og:image:width', content: '1000' },
            { property: 'og:image:height', content: '524' }
          ]}

        />
        <Header />
        <main>{this.props.children()}</main>
        <Footer />
        <SiteBanner />
        <BackToTop />
      </root>
    );
  }
}

export default DefaultLayout
