### Accordion examples

Collapsed Accordion

```jsx
<Accordion isCollapsed={true} title="Show more" isShowMore={true}>
  This is a hidden content which will be displayed once you click on the show more panel
</Accordion>
```

Expanded Accordion

```jsx
<Accordion isCollapsed={false} title="Show less" isShowMore={true}>
  This is a shown content which will be hidden once you click on the show less panel
</Accordion>
```

Default Accordion without isShowMore attribute

```jsx
<Accordion isCollapsed={false} title="Accordion Item1">
  This is a shown content which will be hidden once you click on the show less panel
</Accordion>
```
