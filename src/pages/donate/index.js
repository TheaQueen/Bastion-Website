import React from 'react';
import ExternalLink from '../../components/ExternalLink.js';
import methods from './methods.json';
import './index.css';

class DonatePage extends React.Component {
  render() {
    return (
      <div id='donate'>
        <div className='header'>
          <h1>Donate to Bastion</h1>
          <p>
            Support the developement of Bastion and keep it running forever by
            donating us.
          </p>
          <p>
            Your donations will ensure the development of <a
            href='https://github.com/TheBastionBot' target='_blank'>The Bastion
            Bot Project</a>and we will make sure this project stays active
            forever.
          </p>
        </div>

        <div className='container'>
          {
            methods.map((method, i) => {
              return (
                <div
                  className='method'
                  key={ i }
                  title={ `${method.title} - ${method.url}` }
                >
                  <ExternalLink to={ method.url }>
                    <div className='image'>
                      <img
                        src={ method.image }
                        width='150'
                        alt='Donation Method Logo'
                      />
                    </div>
                    <div className='details'>
                      <p>{ method.description }</p>
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

export default DonatePage;
