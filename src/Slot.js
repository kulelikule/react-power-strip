import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// 插槽
class Slot extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    params: PropTypes.object,
    src: PropTypes.string || null,
  };

  static defaultProps = {
    params: {},
    src: null,
  };

  constructor() {
    super();
    this.loaded = false;
  }

  async componentDidMount() {
    const { _powerStrip } = window;
    const { firstPowerOn } = _powerStrip;
    const { src } = this.props;
    if (src) {
      var script = document.createElement('script');
      script.setAttribute("type","text/javascript");
      script.src = src;
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
