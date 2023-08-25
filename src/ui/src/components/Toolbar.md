### Toolbar examples

DefaultToolbar with default props example:

```jsx
const DefaultToolbar = require('./Toolbar').DefaultToolbar;
const ModalWithButton = require('./ModalWithButton').default;
const Button = require('./Button/Button').default;
const IconButton = require('./IconButton').default;

<DefaultToolbar>
	<ModalWithButton>
		<h1>You can also use modal with button in here</h1>
	</ModalWithButton>
	<Button href="/u/integration-test/quick-start/browse">
		Project Files
	</Button>
	<IconButton icon="edit" />
	<Button onClick={() => alert('getting data')}>
		Get Data
	</Button>
</DefaultToolbar>
```

DefaultToolbar with custom layout props example:

```jsx
const DefaultToolbar = require('./Toolbar').DefaultToolbar;
const ModalWithButton = require('./ModalWithButton').default;
const Button = require('./Button/Button').default;

<DefaultToolbar className="file-view" margin={12}>
	<ModalWithButton>
		<h1>You can also use modal with button in here</h1>
	</ModalWithButton>
	<Button href="/u/integration-test/quick-start/browse">
		Project Files
	</Button>
	<Button onClick={() => alert('getting data')}>
		Get Data
	</Button>
</DefaultToolbar>
```

SeparatedToolbar example:

```jsx
const SeparatedToolbar = require('./Toolbar').SeparatedToolbar;
const ModalWithButton = require('./ModalWithButton').default;
const Button = require('./Button/Button').default;
const IconButton = require('./IconButton').default;

<SeparatedToolbar>
	<ModalWithButton>
		<h1>You can also use modal with button in here</h1>
	</ModalWithButton>
	<Button href="/u/integration-test/quick-start/browse">
		Project Files
	</Button>
	<IconButton icon="edit" />
	<Button onClick={() => alert('getting data')}>
		Get Data
	</Button>
</SeparatedToolbar>
```

SeparatedToolbar with layout props example:

```jsx
const SeparatedToolbar = require('./Toolbar').SeparatedToolbar;
const ModalWithButton = require('./ModalWithButton').default;
const Button = require('./Button/Button').default;
const IconButton = require('./IconButton').default;

<SeparatedToolbar padding="25px" itemSpacing={2}>
	<ModalWithButton>
		<h1>You can also use modal with button in here</h1>
	</ModalWithButton>
	<Button href="/u/integration-test/quick-start/browse">
		Project Files
	</Button>
	<IconButton icon="edit" />
	<Button onClick={() => alert('getting data')}>
		Get Data
	</Button>
</SeparatedToolbar>
```
