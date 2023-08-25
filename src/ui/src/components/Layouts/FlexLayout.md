### FlexLayout examples

Row layout example:

```jsx
const cardStyle = {
  padding: 20,
  background: '#e4e4e4',
  width: 200,
  marginBottom: 8
};

<FlexLayout itemSpacing={8} alignItems="flex-start">
  <div style={cardStyle}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </div>
  <div style={cardStyle}>
    Duis commodo pellentesque eleifend. Curabitur nec lobortis erat, nec semper sapien.
    Fusce commodo, velit a viverra feugiat, orci felis gravida purus, a fringilla dui ex sed eros.
  </div>
  <div style={cardStyle}>
    Nunc cursus arcu ut ullamcorper tristique. Mauris cursus lorem sapien, et dignissim purus tristique sit amet.
    Mauris aliquam est orci, nec elementum turpis laoreet sit amet.
    Proin sodales tortor mauris, in imperdiet risus dapibus et.
  </div>
  <div style={cardStyle}>
    Nunc ligula tellus, faucibus vestibulum massa ut, lacinia interdum odio.
  </div>
  <div style={cardStyle}>
    Maecenas vulputate porttitor ex, eu auctor augue.
  </div>
  <div style={cardStyle}>
    Proin non purus libero. Nulla eleifend justo felis, quis mollis nunc vestibulum non.
  </div>
  <div style={cardStyle}>
    Aenean vehicula risus suscipit molestie pharetra.
  </div>
</FlexLayout>
```

Column layout example:

```jsx

const cardStyle = {
  padding: 20,
  background: '#e4e4e4',
  margin: 5,
  width: 200,
  borderRadius: 5,
  textAlign: 'center'
};

<FlexLayout direction="column" justifyContent=" space-between" wrap="no-wrap">
  <div style={cardStyle}>
    Unu
  </div>
  <div style={cardStyle}>
    Du
  </div>
  <div style={cardStyle}>
    Tri
  </div>
</FlexLayout>
```
