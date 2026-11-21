// オフライン用のキャッシュ。ファイルを変更したら VERSION を 1 つ上げる（上げないと、利用者の端末に新しいバージョンが届かない）。
const VERSION = 'br-assistant-v35';
const FILES = ['./', './index.html', './data/catalog.js', './data/knowledge.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// ネットワークを優先し、つながらないときだけキャッシュを使う。オンラインなら常に最新のバージョンを表示する。
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
