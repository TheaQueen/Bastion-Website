import React from 'react';
import ExternalLink from './ExternalLink.js';

class NavExLink extends React.Component {
  render() {
    return (
      <li>
        <ExternalLink to={this.props.to} className={this.props.className}>{this.props.name}</ExternalLink>
      </li>
    );
  }
}

export default NavExLink;
