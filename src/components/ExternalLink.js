import React from 'react';

class ExternalLink extends React.Component {
  render() {
    return (
      <a href={ this.props.to } target='_blank'>
        { this.props.children }
      </a>
    );
  }
}

export default ExternalLink;
