import React from 'react';
import { connect } from './PowerStrip';

class Demo extends React.Component {

  render() {
    console.log(this.props.aaa );
    return (
      <div>
        { this.props.aaa }
      </div>
    );
  }
}

export default connect('test', document.getElementById('bbb'), { aaa: '333' })(Demo);
