import React from 'react'
import Link from 'gatsby-link'

class NotFoundPage extends React.Component {
  render() {
    return (
      <div className='NotFoundPage-container'>
        <img src='https://resources.bastionbot.org/logos/Bastion_Logomark_C.png' width='170' height='170' />
        <h1>You look lost my friend.</h1>
        <p>Let&#39;s head back <Link to='/'>home</Link>.</p>
      </div>
    );
  }
}

export default NotFoundPage
