import React from 'react';
import ReactDOM from 'react-dom';
import { Slot } from './PowerStrip';

class Demo extends React.Component {
  constructor() {
    super();
    this.state = {
      params: {
        aaa: 1,
        b: 2,
      }
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        params: {
          aaa: 3,
          b: 2,
        }
      });
    }, 1000);
  }

  render() {
    const { params } = this.state;
    return (
      <div>
        <Slot
          id="test"
          params={params}
          jsUrl="http://127.0.0.1:8080/other.js"
          cssUrl="http://127.0.0.1:8080/other.css"
        />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('root'));