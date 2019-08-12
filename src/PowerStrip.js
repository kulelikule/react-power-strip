import { PureComponent, createElement } from 'react';
import { render } from 'react-dom';
import Slot from './Slot';

// 初始化接线板
const initDistributionBox = () => {
  const { _powerStrip } = window;
  // 如果没有接线板就初始化一个
  if (!_powerStrip) {
    window._powerStrip = {
      firstPowerOn: (id, params, el) => {
        const { _powerStrip } = window;
        const { wires } = _powerStrip;
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
        const { _powerStrip } = window;
        const { wires } = _powerStrip;
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
const connect = (id, containerDom, componentProps, children) => (component) => {
  const { powerStripConfig } = window;
  const { active, exclude } = powerStripConfig || {};
  // 以下情况组件不接入接线板
  // 没有接线板配置
  // 配置接线板后，没有激活
  // 接线板激活后，该组件被排除
  if (!powerStripConfig || !active || (exclude instanceof Array && exclude.some(item => item === id))) {
    if (containerDom) {
      render(createElement(component, componentProps, children), containerDom);
    }
    return component;
  }
  
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
  const { _powerStrip } = window;
  const { wires } = _powerStrip;
  wires[id] = TargetPlug;
};

export {
  Slot,
  connect,
};
