### MultiSelect examples

Multi select example:

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

<MultiSelect options={options}
  defaultValue="two"
  onSelectionChange={(value) => alert('You selected ' + value)}
/>

```
