import { PureComponent, createElement } from 'react';
import { render } from 'react-dom';
import Slot from './Slot';

// 初始化接线板
const initDistributionBox = () => {
  const { _distributionBox } = window;
  // 如果没有接线板就初始化一个
  if (!_distributionBox) {
    window._distributionBox = {
      firstPowerOn: (id, params, el) => {
        const { _distributionBox } = window;
        const { wires } = _distributionBox;
        const currentComponent = wires[id];
        if (currentComponent) {
          render(createElement(currentComponent, {
            ...params,
            ref: (r) => {
              wires[id] = r.updateState;
            },
          }), el);
        }
      },
      powerOn: (id, params) => {
        const { _distributionBox } = window;
        const { wires } = _distributionBox;
        if (wires[id] && typeof wires[id] === 'function') {
          wires[id](params);
        }
      },
      wires: {},
    };
  }
};
initDistributionBox();

/**
   * 增加需要渲染的组件
   * @param { string } id 需要渲染的组件的唯一标识
   * @param { element } component 需要渲染的组件
   */
const connect = (id) => (component) => {
  class TargetPlug extends PureComponent {
    constructor(props) {
      super();
      this.state = {
        ...props,
      };
      this.updateState = this.updateState.bind(this);
    }

    updateState(params = {}) {
      this.setState({
        ...params,
      });
    }

    render() {
      return createElement(component, { ...this.state });
    }
  };
  const { _distributionBox } = window;
  const { wires } = _distributionBox;
  wires[id] = TargetPlug;
};

export {
  Slot,
  connect,
};
