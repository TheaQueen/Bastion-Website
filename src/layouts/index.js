import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SiteBanner from '../components/SiteBanner';
import BackToTop from '../components/BackToTop';
import './index.css';

class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <root>
        <Header />
        <main>
          { this.props.children() }
        </main>
        <Footer />
        <SiteBanner />
        <BackToTop />
      </root>
    );
  }
}

export default DefaultLayout;
