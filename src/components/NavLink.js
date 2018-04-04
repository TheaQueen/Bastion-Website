import React from 'react';
import Link from 'gatsby-link';

class NavLink extends React.Component {
  render() {
    return (
      <li
        onMouseOver={ this.props.onMouseOver }
        onMouseOut={ this.props.onMouseOut }
      >
        <Link to={this.props.to} className={this.props.className}>
          { this.props.name }
        </Link>
        { this.props.children }
      </li>
    );
  }
}

export default NavLink;
