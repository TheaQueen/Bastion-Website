import React from 'react'
import Helmet from 'react-helmet'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SiteBanner from '../components/SiteBanner'
import './index.css'

class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <root>
        <Helmet
          title="The Bastion Bot"
          meta={[
            { name: 'description', content: 'Give awesome perks to your server!' },
            { name: 'keywords', content: 'bastion, bastion bot, discord, discord bot, bot' },
            { name: 'generator', content: 'Bastion' }
          ]}
        />
        <Header />
        <main>{this.props.children()}</main>
        <Footer />
        <SiteBanner />
      </root>
    );
  }
}

export default DefaultLayout
