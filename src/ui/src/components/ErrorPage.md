### ErrorPage examples

Error 500:

```jsx

<ErrorPage status={500} contactEmail="support@dominodatalab.com" />

```

Error 404:

```jsx

<ErrorPage status={404} contactEmail="support@dominodatalab.com" />

```

Error 401:

```jsx

<ErrorPage status={401} contactEmail="support@dominodatalab.com" />

```

Error 403:

```jsx

<ErrorPage status={403} contactEmail="support@dominodatalab.com" />

```

Custom status message

```jsx

<ErrorPage
  status={500}
  statusMessage="The server encountered an unexpected condition that prevented it from fulfilling the request."
  contactEmail="support@dominodatalab.com"
/>

```
