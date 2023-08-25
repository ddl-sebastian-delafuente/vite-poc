### Breadcrumbs example:

Breadcrumbs

```js

const routes = [
  {
    path: '/index',
    breadcrumbName: 'Home',
  },
  {
    path: '/first',
    breadcrumbName: 'Page 1',
    children: [
      {
        path: '/general',
        breadcrumbName: 'General',
      },
      {
        path: '/layout',
        breadcrumbName: 'Layout',
      },
      {
        path: '/navigation',
        breadcrumbName: 'Navigation',
      },
    ],
  },
  {
    path: '/second',
    breadcrumbName: 'Page 2',
  }
];

<Breadcrumbs routes={routes} />
```
