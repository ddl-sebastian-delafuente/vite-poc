### Icons

Assorted icons. Hover over an icon to view its corresponding file name:

```jsx
const FlexLayout = require('../Layouts/FlexLayout').default;
const Icons = require('./Icons');
const Tooltip = require('antd').Tooltip;

const iconKeys = Object.keys(Icons);

<FlexLayout justifyContent="flex-start">
  {iconKeys.map(key => {
    const Icon = Icons[key];
    return (
      <Tooltip title={key}>
        <span><Icon width={32} height={32} fill="currentColor" /></span>
      </Tooltip>
    );
  })}
</FlexLayout>
```
