import React from 'react';
import ExternalLink from '../../components/ExternalLink.js';
import versions from './versions.json';
import './index.css';

class AddPage extends React.Component {
  render() {
    return (
      <div id='add'>
        <div className='header'>
          <h1>Add Bastion to Discord</h1>
          <p>
            Add Bastion to Discord, and give awesome perks to your Discord
            server.
          </p>
          <p>
            You have two different options here, you can either add the public
            Bastion bot to your Discord server.
            <br />
            Or you can choose to host Bastion yourself, privately, on your own
            machine/server and be your own boss.
          </p>
        </div>

        <div className='container'>
          {
            versions.map((version, i) => {
              return (
                <div className='version' key={ i }>
                  <ExternalLink to={ version.url }>
                    <div className='details'>
                      <h4>{ version.title }</h4>
                      <p>{ version.description }</p>
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

export default AddPage;
