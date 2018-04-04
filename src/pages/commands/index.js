import React from 'react';
import Link from 'gatsby-link';
import showdown from 'showdown';
import axios from 'axios';
import ExternalLink from '../../components/ExternalLink.js';
import './index.css';

const converter = new showdown.Converter();

class CommandsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    axios.get('https://raw.githubusercontent.com/TheBastionBot/Bastion/stable/locales/en/modules.json')
      .then(res => {
        let commands = [];
        for (let module of Object.keys(res.data)) {
          for (let command of Object.keys(res.data[module])) {
            commands.push({
              name: command,
              module: module.replace(/_/, ' '),
              description: res.data[module][command]
            });
          }
        }

        this.setState({
          commands: commands
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  filterCommands() {
    let input = document.getElementById('commandFilter');
    let filter = input.value.toLowerCase();
    let table = document.getElementById('commandsTable');
    let tr = table.getElementsByClassName('command');

    for (let i = 0; i < tr.length; i++) {
      let commands = tr[i].getElementsByTagName('td')[0];
      let descriptions = tr[i].getElementsByTagName('td')[1];
      if (commands || descriptions) {
        if (commands.innerHTML.toLowerCase().indexOf(filter) > -1 || descriptions.innerHTML.toLowerCase().indexOf(filter) > -1) {
          tr[i].style.display = '';
        }
        else {
          tr[i].style.display = 'none';
        }
      }
    }
  }

  render() {
    return (
      <div id='commands'>
        <div className='header'>
          <h1>Bastion Commands</h1>
          <p>
            Check out the commands list of Bastion that you can use with it.
          </p>
          <div>
            <input
              id='commandFilter'
              type='text'
              placeholder='🔍 Search commands'
              onKeyUp={ () => this.filterCommands() }
            />
          </div>
        </div>

        <div className='container'>
          {
            this.state.commands
            ? <table id='commandsTable' cellSpacing='0' cellPadding='0'>
                <thead>
                  <tr>
                    <td style={{ width: '30%' }}>
                      Command
                    </td>
                    <td style={{ width: '70%' }}>
                      Description
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.commands.map((command, i) => {
                      return (
                        <tr className='command' key={ i }>
                          <td>
                            <div className='commandName'>
                              <code>{ command.name }</code>
                            </div>
                            <div
                              className='commandModule'
                              title={ `This command belongs to the ${command.module} module` }
                            >
                              <code>{ command.module }</code>
                            </div>
                          </td>
                          <td>
                            <div
                              className='commandDescription'
                              dangerouslySetInnerHTML={{ __html: converter.makeHtml(command.description) }}
                            />
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            : <div>Loading Commands...</div>
          }
        </div>
      </div>
    );
  }
}

export default CommandsPage;
