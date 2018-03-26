import React from 'react';
import NavLink from '../NavLink.js';
import NavExLink from '../NavExLink.js';
import './index.css';

class MainNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInnerNavVisible: false,
      width: 0,
      height: 0
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  toggleInnerNav() {
    this.setState({
      isInnerNavVisible: !this.state.isInnerNavVisible
    });
  }

  render() {
    return (
      <nav style={{ display: this.props.isNavVisible ? '' : 'none' }} onClick={this.props.onClick}>
        <div className='MainNav MainNav-left'>
          <ul className='OuterNav'>
            <NavLink name='Home' to='/' className='min-960px' />
            <NavLink name='Features' to='/features' />
            <NavLink name='Commands' to='/commands' />
            <NavExLink name='Guide' to='https://docs.bastionbot.org' />
            <NavExLink name='Help &amp; Support' to='https://discord.gg/fzx8fkt' />
            <li name='More' onMouseOver={() => this.toggleInnerNav()} onMouseOut={() => this.toggleInnerNav()}>
              <span className='dropdown' style={{ display: this.state.width > 960 ? '' : 'none' }}>More</span>
              <ul className='InnerNav' style={{ display: this.state.width <= 960 || this.state.isInnerNavVisible ? '' : 'none' }}>
                <NavLink name='FAQ' to='/faq' />
                <NavLink name='Tools' to='/tools' />
                <NavLink name='Sponsors' to='/sponsors' />
                <NavExLink name='Developers' to='https://devs.bastionbot.org' />
                <NavExLink name='Translators' to='https://i18n.bastionbot.org' />
                <NavExLink name='Status' to='https://status.bastionbot.org' />
              </ul>
            </li>
          </ul>
        </div>

        <div className='MainNav MainNav-right'>
          <ul>
            <NavExLink name='Join Discord' to='https://discord.gg/fzx8fkt' />
            <NavLink name='Add to Discord' to='/add' />
            <NavLink name='Donate' to='/donate' className='button primary' />
          </ul>
        </div>
      </nav>
    );
  }
}

export default MainNav;
