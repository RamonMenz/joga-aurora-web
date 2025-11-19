// Set initial theme ASAP to avoid flash
(function () {
  try {
    var storageKey = "vite-ui-theme";
    var theme = localStorage.getItem(storageKey);
    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    var system = mql.matches ? 'dark' : 'light';
    var resolved = theme === 'light' || theme === 'dark' ? theme : system;
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
  } catch (_) {}
})();
