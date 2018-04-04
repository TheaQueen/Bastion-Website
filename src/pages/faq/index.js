import React from 'react';
import showdown from 'showdown';
import ExternalLink from '../../components/ExternalLink.js';
import faq from './faq.json';
import './index.css';

const converter = new showdown.Converter();

class FAQPage extends React.Component {
  questions() {
    let questions = [];
    for (let questionGroup in faq) {
      for (let question of faq[questionGroup]) {
        question.answer = converter.makeHtml(question.answer);
        questions.push(question);
      }
    }
    return questions;
  }

  render() {
    return (
      <div id='faq'>
        <div className='header'>
          <h1>Frequently Asked Questions</h1>
          <p>
            Have a question that is not listed here? No worries mate, just head
            over to the <a>#help</a> channel in <a
            href='https://discord.gg/fzx8fkt' target='_blank'>Bastion Discord
            Server</a>, and ask it.
          </p>
        </div>

        <div className='container'>
            {
              this.questions().map((question, i) => {
                return (
                  <div className='question' key={ i }>
                    <h4>{ question.question }</h4>
                    <p dangerouslySetInnerHTML={{ __html: question.answer }} />
                    <img src={ question.image } alt='' />
                  </div>
                );
              })
            }
        </div>
      </div>
    );
  }
}

export default FAQPage;
