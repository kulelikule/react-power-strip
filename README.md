## 简介
这是一个可以将React组件（组件A）应用于另一个React项目（项目B），并且组件A更新之后不需要重新构建项目B就能够直接生效的解决方案

## 安装
```
npm install react-power-strip -S
```

## 使用方法
React组件（组件A）
```
import React from 'react';
import { connect } from './PowerStrip';

class A extends React.Component {
  render() {
    return (
      <div>
        { this.props.msg } // 这里的props就是params
      </div>
    );
  }
}

export default connect('test')(A);
```

React项目（项目B）
```
import React from 'react';
import { Slot } from './PowerStrip';

class B extends React.Component {
  render() {
    const params = {
      msg: '我是项目B传过来的数据',
    };
    return (
      <div>
        <Slot id="test" params={params} src="http://127.0.0.1:8080/other.js"/>
      </div>
    );
  }
}
```