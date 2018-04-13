import React from 'react';
import showdown from 'showdown';
import ExternalLink from '../../components/ExternalLink.js';
import features from './features.json';
import './index.css';

const converter = new showdown.Converter();

class FeaturesPage extends React.Component {
  render() {
    return (
      <div id='features'>
        <div className='header'>
          <h1>Feature Highlights</h1>
          <p>
            Bastion is an all-in-one multipurpose Discord bot that can do a
            whole bunch of things and its features are expanding daily. Bastion
            does everything most people will ever need it to do. Check out some
            feature highlights below to get a peek into the vast feature list
            of Bastion.
            And if you think Bastion lacks some feature, please <a
            href='https://github.com/TheBastionBot/Bastion/issues/new'
            target='_blank'>send a suggestion</a> and we will add it to Bastion
            as soon as possible.
          </p>
        </div>

        <div className='container'>
          {
            features.map((feature, i) => {
              if (i % 2 == 0) {
                return (
                  <div className='feature left' key={ i }>
                    <div className='image'>
                      <img src={ feature.image } alt='Feature Screenshot' />
                    </div>
                    <div className='details'>
                      <h4>{ feature.title }</h4>
                      <p>{ feature.description }</p>
                    </div>
                  </div>
                );
              }
              else {
                return (
                  <div className='feature right' key={i}>
                    <div className='details'>
                      <h4>{ feature.title }</h4>
                      <p
                        dangerouslySetInnerHTML={{ __html: converter.makeHtml(feature.description) }}
                      />
                    </div>
                    <div className='image'>
                      <img src={ feature.image } alt='Feature Screenshot' />
                    </div>
                  </div>
                );
              }
            })
          }
        </div>
      </div>
    );
  }
}

export default FeaturesPage;
