import React from 'react';
import Link from 'gatsby-link';
import MainNav from '../MainNav/';
import './index.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavVisible: false,
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
      isNavVisible: false,
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  toggleNav() {
    this.setState({
      isNavVisible: !this.state.isNavVisible
    });
  }

  render() {
    return (
      <header>
        <div className='innerHeader'>
          <Link to='/' onClick={ () => this.toggleNav() }>
            <div className='headerLogo' />
          </Link>
          <MainNav
            isNavVisible={ this.state.width > 960 || this.state.isNavVisible }
            onClick={ () => this.toggleNav() }
          />
        </div>
      </header>
    );
  }
}

export default Header;
