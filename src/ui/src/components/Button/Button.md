### Button examples

Primary button example:

```jsx
<Button btnType="primary">
  Button Text
</Button>
```

Primary button disabled example:

```jsx
<Button btnType="primary" disabled>
  Button Text
</Button>
```

Secondary button example:

```jsx
<Button btnType="secondary">
  Button Text
</Button>
```

Secondary button disabled example:

```jsx
<Button btnType="secondary" disabled>
  Button Text
</Button>
```

Split button example:

```jsx
const data = [
  {
    key: 0,
    content: 'Darth Vader'
  },
  {
    key: 1,
    content: 'Obi-Wan Kenobi'
  },
  {
    key: 2,
    content: 'Han Solo'
  },
  {
    key: 3,
    content: 'Yoda'
  }
];
<Button btnType="split" actions={data} onMenuClick={() => console.log('clicked')} >
  Button
</Button>
```

Split button disabled example:

```jsx
<Button btnType="split" menuContent={<p><p>You clicked on me!!!</p><p>I am on next line</p><p>Close me!</p></p>} disabled>
  Button
</Button>
```

Button with icon button example:

```jsx
<Button btnType="btn-with-icon" icon="plus" >
  Button
</Button>
```

Button with icon button disabled example:

```jsx
<Button btnType="btn-with-icon" icon="plus" disabled>
  Button
</Button>
```

Icon button example:

```jsx
<Button btnType="icon" icon="plus" />
```

Icon button disabled example:

```jsx
<Button btnType="icon" icon="plus" disabled />
```

Small button example:

```jsx
<Button btnType="small">
  Button Text
</Button>
```

Small button disabled example:

```jsx
<Button btnType="small" disabled>
  Button Text
</Button>
```

Primary Danger Button :

```jsx
<Button  title="Archive this Project." btnType="primary" isDanger={true}> 
  Delete
</Button>          
```

Danger Button with Icon example:

```jsx
<Button icon="delete" title="Archive this Project." btnType="icon" isDanger={true}> 
  Delete
</Button>          
```

Small icon button:

```jsx
<Button btnType="icon-small" icon="edit" />
```

Primary button with sizing override:

```jsx
<Button btnType="primary" small={true}>Submit</Button>
```
