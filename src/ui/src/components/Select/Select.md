### Select examples

Simple select example:

```jsx

const options = [
  {
    value: 'one',
    label: 'One'
  },
  {
    value: 'two',
    label: 'Two'
  },
  {
    value: 'three',
    label: 'Three'
  }
];

<Select options={options}
  defaultValue="two"
  onSelect={(value) => alert('You selected ' + value)}
/>

```
