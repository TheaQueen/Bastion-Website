import React from 'react';
import './index.css';

class BackToTop extends React.Component {
  backToTop() {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }

  render() {
    return (
      <button id='backToTop' onClick={ () => this.backToTop() }>
        <img
          src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAn1BMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8TrG38AAAANHRSTlMABAYKDRQcJSgpMzQ6QklOVWNkcHJ9hoqPn6KjpKaprrGytLW4vcHDxMjLzdjd4Ony9vn8DtaE0gAAAG1JREFUeAGtyFUSwjAYAOElSHB3lwDBhf/+Z2OmaSaZPnff9iOt/Vgp4sxH5uFGE+x6IGP/fVlw3jKVofuubArYPcykB9D6nYokoA7Sgcb7XsYBpdu3yfGl8UDleaVaIwC6DsQAecLFZGC3xPUHGF4Jis0TNxYAAAAASUVORK5CYII='
          alt=''
        />
      </button>
    );
  }
}

export default BackToTop;
