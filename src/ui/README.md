## Domino UI Component Library
This folder contains all the Domino UI components shared across all the Domino products.

## The folders that are currently published
```
styled
utils
icons
components
navbar
```

## How to publish
Every commit push to CI will create a new version in the NPM Registry.
```
@domino/ui@1.0.0-<BRANCH_NAME>.<COMMIT_SHA>-<CIRCLE_BUILD_NUM>
```
Note: <BRANCH_NAME> will have all '`/`' chars replaced with '`-`' chars.    
All the develop pushes will be tagged with latest. So just doing `yarn` will install the latest version

## How to use in Domino
Don't need to change anything in the way you are using these components, just continue to use them in the same way as today

## How to use in other Products
- Copy paste the .npmrc file here into your own product
- Run the yarn link commands as follows:
```
# run here in packages/ui
yarn link
# cd to frontend dir (can be other package)
cd ../..
yarn link @domino/ui
```
- If you want to install an older version or specific version with a particular tag, we are tagging every branch with branch name, but develop is tagged as latest
```
yarn add @domino/ui@version --tag <tagname>
```
- Install `styled-components@3.3.3` if you are not using it in new product. Do this manually because https://styled-components.com/docs/faqs#why-am-i-getting-a-warning-about-several-instances-of-module-on-the-page

- You need to pass Domino30ThemeProvider context to your App as Domino ui library uses this context for as its theme provider. Something like below in your index file.
```
import { Domino30ThemeProvider } from '@domino/ui/dist/styled';

ReactDOM.render(
  <Domino30ThemeProvider>
    <App />
  </Domino30ThemeProvider>,
  document.getElementById('app')
);
```

# NPM dependencies mirror on JFrog
NPM dependencies are cached through our JFrog Artifactory NPM mirror (browsable [here](https://domino.jfrog.io/ui/native/domino-components-registry/)).  
This reduces CI build failures related to NPM registry dropping our package download requests.  
NPM and Bazel commands use the auth provided in [.npmrc](.npmrc) to update our JFrog mirror's cache.  
The `resolved` values in [yarn.lock](yarn.lock) show the URL for each mirrored package.  
[See here](https://dominodatalab.atlassian.net/wiki/spaces/ENG/pages/1548976273/JFrog+Artifactory) for more details on JFrog Artifactory.

## Contact
Owners         | Module
---------------|-------------
@mohithg       | Publishing
@niole         | Components
