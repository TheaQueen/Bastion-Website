import React from 'react';

let stylesStr;
if (process.env.NODE_ENV === 'production') {
  try {
    stylesStr = require('!raw-loader!../public/styles.css');
  } catch (e) {
    console.error(e);
  }
}

class HTML extends React.Component {
  render() {
    let css;
    if (process.env.NODE_ENV === 'production') {
      css = (
        <style
          id='gatsby-inlined-css'
          dangerouslySetInnerHTML={{ __html: stylesStr }}
        />
      );
    }
    return (
      <html { ...this.props.htmlAttributes } prefix='og: http://ogp.me/ns#'>
        <head>
          <meta charSet='utf-8' />
          <meta httpEquiv='x-ua-compatible' content='ie=edge' />
          <meta
            name='viewport'
            content={
              'width=device-width, user-scalable=no, shrink-to-fit=no,'
              + ' initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0'
            }
          />

          <title>The Bastion Bot - One of the best Discord Bot</title>
          <meta
            name='description'
            content='Give awesome perks to your Discord server!'
          />
          <meta
            name='keywords'
            content={
              'bastion, bastion bot, discord, discord bot, bot, music,'
                + ' currency, the best discord bot, best discord bot, best bot,'
                + ' stream, game, fun, administration, moderation, queries,'
                + ' searches, gambling, game stats, stats, info'
            }
          />

          <meta name='twitter:card' content='summary_large_image' />
          <meta name="twitter:site" content="@TheBastionBot" />
          <meta name="twitter:creator" content="@k3rn31p4nic" />

          <meta property='og:site_name' content='The Bastion Bot' />
          <meta
            name='twitter:title'
            property='og:title'
            content='The Bastion Bot - One of the best Discord Bot'
          />
          <meta
            name='twitter:description'
            property='og:description'
            content='Give awesome perks to your Discord server!'
          />
          <meta property='og:url' content='https://bastionbot.org' />
          <meta property='og:image:width' content='1000' />
          <meta property='og:image:height' content='524' />
          <meta property='og:type' content='website' />
          <meta
            name='twitter:image'
            property='og:image'
            content='https://resources.bastionbot.org/og-image.jpg'
          />

          <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
          <link rel='shortcut icon' href='https://bastionbot.org/favicon.ico' />
          <link rel='icon' type='image/x-icon' href='https://bastionbot.org/favicon.ico' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
          <link rel='manifest' href='/site.webmanifest' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#40bbfb' />
          <meta name='apple-mobile-web-app-title' content='The Bastion Bot' />
          <meta name='application-name' content='The Bastion Bot' />
          <meta name='msapplication-TileColor' content='#070a0c' />
          <meta name='theme-color' content='#070a0c' />

          { this.props.headComponents }
          { css }
        </head>

        <body { ...this.props.bodyAttributes }>
          { this.props.preBodyComponents }
          <div
            key={ 'body' }
            id='___gatsby'
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          { this.props.postBodyComponents }
        </body>
      </html>
    )
  }
};

export default HTML;
