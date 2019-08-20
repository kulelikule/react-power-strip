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

  async componentDidMount() {
    const { _powerStrip } = window;
    const { firstPowerOn, wireBundles } = _powerStrip;
    const { jsUrl, cssUrl, id: componentId, params } = this.props;
    // 如果当componentId已经存在时则不重复加载脚本和样式
    if (!wireBundles[componentId]) {
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
    }
    this.uniqueId = firstPowerOn(componentId, params, this.el);
  }

  componentDidUpdate() {
    if (this.uniqueId) {
      const { _powerStrip } = window;
      const { powerOn } = _powerStrip;
      const { id: componentId, params } = this.props;
      powerOn(componentId, this.uniqueId, params);
    }
  }

  render() {
    return <div ref={(r) => { this.el = r; }}></div>;
  }
}

export default Slot;
