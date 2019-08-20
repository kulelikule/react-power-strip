import { PureComponent, createElement } from 'react';
import { render } from 'react-dom';
import shortid from 'shortid';
import Slot from './Slot';

// 初始化接线板
const initDistributionBox = () => {
  const { _powerStrip } = window;
  // 如果没有接线板就初始化一个
  if (!_powerStrip) {
    window._powerStrip = {
      firstPowerOn: (componentId, params, el) => {
        const { _powerStrip } = window;
        const { wireBundles } = _powerStrip;
        const wireBundle = wireBundles[componentId];
        let currentComponent;
        // 获取组件
        if (wireBundle) {
          const { component } = wireBundle;
          currentComponent = component;
        }
        // 渲染组件到dom上
        const uniqueId = shortid.generate();
        if (currentComponent) {
          const { wires } = wireBundle;
          render(createElement(currentComponent, {
            ...params,
            ref: (r) => {
              wires[uniqueId] = r.updateState;
            },
          }), el);
          return uniqueId;
        }
      },
      powerOn: (componentId, uniqueId, params) => {
        const { _powerStrip } = window;
        const { wireBundles } = _powerStrip;
        if (
          wireBundles[componentId] &&
          wireBundles[componentId].wires &&
          typeof wireBundles[componentId].wires[uniqueId] === 'function'
        ) {
          wireBundles[componentId].wires[uniqueId](params);
        }
      },
      wireBundles: {},
    };
  }
};
initDistributionBox();

/**
   * 增加需要渲染的组件
   * @param { string } componentId 需要渲染的组件的唯一标识
   * @param { element } component 需要渲染的组件
   */
const connect = (componentId, containerDom, componentProps, children) => (component) => {
  const { powerStripConfig } = window;
  const { active, exclude } = powerStripConfig || {};
  // 以下情况组件不接入接线板
  // 没有接线板配置
  // 配置接线板后，没有激活
  // 接线板激活后，该组件被排除
  if (!powerStripConfig || !active || (exclude instanceof Array && exclude.some(item => item === componentId))) {
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
  const { wireBundles } = _powerStrip;
  if (!wireBundles[componentId]) {
    wireBundles[componentId] = {
      component: TargetPlug,
      wires: [],
    };
  }
};

export {
  Slot,
  connect,
};
