## 简介
这是一个可以将React组件（组件A）应用于另一个React项目（项目B），并且组件A更新之后不需要重新构建项目B就能够直接生效的解决方案

## 安装
```
npm install react-power-strip -S
```

## 使用方法
### React组件（组件A）
```
import React from 'react';
import { connect } from './PowerStrip';

@connect('test')
class A extends React.Component {
  render() {
    return (
      <div>
        { this.props.msg } // 这里的props就是params
      </div>
    );
  }
}

export default A;
```
如果组件A本身也是页面级别的，它自身也会渲染到某个DOM上，可以如下使用：
```
@connect('test', document.getElementById('App'), { msg: '我是组件A自带的属性' })
class A extends React.Component {
  render() {
    return (
      <div>
        { this.props.msg } // 这里的props就是params
      </div>
    );
  }
}

export default A;
```
------
### React项目（项目B）
在页面中需要在js加载前加入配置项
```
<script type="text/javascript">
  window.powerStripConfig = {
    active: true,
    exclude: [],
  };
</script>
```

jsx中的使用如下，其中src也可以不写，直接以script标签的形式引入：
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
        <Slot id="test" params={params} srcUrl="http://127.0.0.1:8080/other.js"/>
      </div>
    );
  }
}
```