import React from 'react';
import ExternalLink from '../../components/ExternalLink.js';
import sponsors from './sponsors.json';
import './index.css';

class SponsorsPage extends React.Component {
  render() {
    return (
      <div id='sponsors'>
        <div className='header'>
          <h1>Sponsors</h1>
          <p>
            These are the amazing companies and people who sponsor <strong>The
            Bastion Bot Project</strong> and keep us running.
          </p>
        </div>

        <div className='container'>
          {
            sponsors.map((sponsor, i) => {
              return (
                <div className='sponsor' key={ i }>
                  <ExternalLink to={ sponsor.url }>
                    <div className='image'>
                      <img
                        src={ sponsor.image }
                        width='150'
                        height='150'
                        alt='Sponsor Logo'
                      />
                    </div>
                    <div className='details'>
                      <h4>{ sponsor.title }</h4>
                      <p>{ sponsor.description }</p>
                    </div>
                  </ExternalLink>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default SponsorsPage;
