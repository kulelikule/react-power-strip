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
    const { _distributionBox } = window;
    const { firstPowerOn } = _distributionBox;
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
      const { _distributionBox } = window;
      const { powerOn } = _distributionBox;
      const { id, params } = this.props;
      powerOn(id, params);
    }
  }

  render() {
    return <div ref={(r) => { this.el = r; }}></div>;
  }
}

export default Slot;
