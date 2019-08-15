import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// 插槽
class Slot extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    params: PropTypes.object,
    jsUrl: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf([null]),
    ]),
    cssUrl: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf([null]),
    ]),
  };

  static defaultProps = {
    params: {},
    jsUrl: null,
    cssUrl: null,
  };

  constructor() {
    super();
    this.loaded = false;
  }

  async componentDidMount() {
    const { _powerStrip } = window;
    const { firstPowerOn } = _powerStrip;
    const { jsUrl, cssUrl } = this.props;
    if (cssUrl) {
      var link = document.createElement('link');
      link.type='text/css';
      link.rel = 'stylesheet';
      link.href = cssUrl;
      document.head.appendChild(link);
    }
    if (jsUrl) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = jsUrl;
      document.body.appendChild(script);
      await new Promise((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject();
      });
    }
    this.loaded = true;
    const { id, params } = this.props;
    firstPowerOn(id, params, this.el);
  }

  componentDidUpdate() {
    if (this.loaded) {
      const { _powerStrip } = window;
      const { powerOn } = _powerStrip;
      const { id, params } = this.props;
      powerOn(id, params);
    }
  }

  render() {
    return <div ref={(r) => { this.el = r; }}></div>;
  }
}

export default Slot;
