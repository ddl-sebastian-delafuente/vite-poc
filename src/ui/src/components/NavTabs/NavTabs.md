### NavTabs example:

Primary Tab Navigation
```js
const NavTabs = require('./NavTabs').default;
const NavTabPane = NavTabs.NavTabPane;

<NavTabs defaultActiveKey="1">
  <NavTabPane key="1" title="item 1"> Content of item 1</NavTabPane>
  <NavTabPane key="2" title="item 2"> Content of item 2</NavTabPane>
  <NavTabPane key="3" title="item 3"> Content of item 3</NavTabPane>
</NavTabs>
  
```

Primary Tab with side arrows for extra tabs
```js
const NavTabs = require('./NavTabs').default;
const NavTabPane = NavTabs.NavTabPane;

<NavTabs defaultActiveKey="1">
  <NavTabPane key="1" title="item 1"> Content of item 1</NavTabPane>
  <NavTabPane key="2" title="item 2"> Content of item 2</NavTabPane>
  <NavTabPane key="3" title="item 3"> Content of item 3</NavTabPane>
  <NavTabPane key="4" title="item 4"> Content of item 4</NavTabPane>
  <NavTabPane key="5" title="item 5"> Content of item 5</NavTabPane>
  <NavTabPane key="6" title="item 6"> Content of item 6</NavTabPane>
  <NavTabPane key="7" title="item 7"> Content of item 7</NavTabPane>
  <NavTabPane key="8" title="item 8"> Content of item 8</NavTabPane>
  <NavTabPane key="9" title="item 9"> Content of item 9</NavTabPane>
  <NavTabPane key="10" title="item 10"> Content of item 10</NavTabPane>
  <NavTabPane key="11" title="item 11"> Content of item 11</NavTabPane>
  <NavTabPane key="12" title="item 12"> Content of item 12</NavTabPane>
  <NavTabPane key="13" title="item 13"> Content of item 13</NavTabPane>
  <NavTabPane key="14" title="item 14"> Content of item 14</NavTabPane>
  <NavTabPane key="15" title="item 15"> Content of item 15</NavTabPane>
</NavTabs>

```

Primary Tab Navigation - With icon
```js
const NavTabs = require('./NavTabs').default;
const NavTabPane = NavTabs.NavTabPane;

<NavTabs defaultActiveKey="1">
  <NavTabPane key="1" title="item 1" icon='info-circle'> Content of item 1</NavTabPane>
  <NavTabPane key="2" title="item 2" icon='info-circle'> Content of item 2</NavTabPane>
  <NavTabPane key="3" title="item 3" icon='info-circle'> Content of item 3</NavTabPane>
</NavTabs>
  
```

Primary Tab Navigation - With Badges
```js
const NavTabs = require('./NavTabs').default;
const NavTabPane = NavTabs.NavTabPane;

<NavTabs defaultActiveKey="1">
  <NavTabPane key="1" title="item 1" badge={12}> Content of item 1</NavTabPane>
  <NavTabPane key="2" title="item 2" badge={99}> Content of item 2</NavTabPane>
  <NavTabPane key="3" title="item 3" badge={126}> Content of item 3</NavTabPane>
</NavTabs>
  
```

Primary Tab With Secondary Navigation
```js
const NavTabs = require('./NavTabs').default;
const NavTabPane = NavTabs.NavTabPane;
const Menu = require('antd').Menu
const Dropdown = require('antd').Dropdown;
const Icon = require('antd').Icon;
const menu = (
  <Menu style={{fontFamily: 'Roboto, sans-serif'}}>
    <Menu.Item>
        item 1.1
    </Menu.Item>
    <Menu.Item>
        item 1.2
    </Menu.Item>
    <Menu.Item>
        item 1.3
    </Menu.Item>
  </Menu>
);
const Button = require('../Button/Button').default;
<NavTabs 
  defaultActiveKey="1"  
  tabType = "extraAction"
  extraActionButton={
      <Dropdown overlay={menu}>
        <span style={{fontFamily: 'Roboto, sans-serif', fontSize: 14}}>
         item 1.1 <Icon type="caret-down" style={{width: 24,height: 24, fontSize: 24, position: 'relative', top: 3, marginLeft: 6 }}/>
        </span>
      </Dropdown>
    }
>
  <NavTabPane key="1" title="item 1"> Content of item 1</NavTabPane>
  <NavTabPane key="2" title="item 2"> Content of item 2</NavTabPane>
  <NavTabPane key="3" title="item 3"> Content of item 3</NavTabPane>
</NavTabs>
```

Secondary Tab 
```js
const NavTabs = require('./NavTabs').default;
const NavTabPane = NavTabs.NavTabPane;

<NavTabs defaultActiveKey="1" tabType="secondary">
  <NavTabPane key="1" title="item 1" > Content of item 1</NavTabPane>
  <NavTabPane key="2" title="item 2" > Content of item 2</NavTabPane>
  <NavTabPane key="3" title="item 3" > Content of item 3</NavTabPane>
</NavTabs>
  
```
