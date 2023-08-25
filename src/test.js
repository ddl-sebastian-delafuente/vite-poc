console.log('test')


var s = document.createElement( 'script' );
s.setAttribute('type', "module");

s.innerHTML = `
import RefreshRuntime from "http://127.0.0.1:5173/ui/@react-refresh";
RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
`
document.body.appendChild( s );

var s = document.createElement( 'script' );
s.setAttribute( 'src', "http://127.0.0.1:5173/ui/@vite/client" );
s.setAttribute('type', "module");
document.body.appendChild( s );


var s = document.createElement( 'script' );
s.setAttribute( 'src', "http://127.0.0.1:5173/ui/src/main.tsx" );
s.setAttribute('type', "module");
document.body.appendChild( s );