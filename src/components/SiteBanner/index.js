import React from 'react';
import banner from './banner.json';
import './index.css'

class SiteBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      className: 'isHidden'
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        className: 'isVisible'
      });
    }, 30000);
  }

  hideBanner() {
    this.setState({
      className: 'isHidden'
    });
  }

  render() {
    return (
      <div id='SiteBanner' className={this.state.className} onClick={() => this.hideBanner()}>
        <span className='title'>
          {banner.title}
        </span>
        <span className='description'>
          {banner.description}
        </span>
      </div>
    );
  }
}

export default SiteBanner;
