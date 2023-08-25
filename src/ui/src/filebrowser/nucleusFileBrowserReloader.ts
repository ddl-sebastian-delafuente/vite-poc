export default function reloader() {
  if (window.location.search) {
    window.location.search = '';
  } else {
    window.location.reload();
  }
}
