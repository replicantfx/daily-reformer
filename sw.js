// Offline support for Daily Reformer.
// The page is fetched network-first (cached copy when offline); fonts and icons come from
// the cache first and refresh in the background.
// Bump VERSION when the list of files below changes.
const VERSION = "v1";
const CACHE = `daily-reformer-${VERSION}`; // distinct from Daily Move, which shares this origin
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "fonts/fonts.css",
  "fonts/bricolage-600.woff2",
  "fonts/bricolage-800.woff2",
  "fonts/figtree-400.woff2",
  "fonts/figtree-500.woff2",
  "fonts/figtree-700.woff2",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("daily-reformer-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  const navigate = req.mode === "navigate";
  const key = navigate ? "./" : req;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(key, { ignoreSearch: true });
      // Fetch by URL: a navigate-mode Request can't be re-fetched with extra options.
      const network = fetch(req.url, { cache: "no-cache" }).then((res) => {
        if (res.ok) cache.put(key, res.clone());
        return res;
      });

      // The page itself: network first, so a new version shows up on the next open.
      // Fall back to the cached copy when offline or when the network is too slow.
      if (navigate) {
        const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 3500));
        const res = await Promise.race([network.catch(() => null), timeout]);
        if (res && res.ok) return res;
        if (cached) {
          event.waitUntil(network.catch(() => {}));
          return cached;
        }
        return network.catch(() => Response.error());
      }

      // Fonts and icons: cache first, refreshed in the background.
      if (cached) {
        event.waitUntil(network.catch(() => {}));
        return cached;
      }
      return network.catch(() => Response.error());
    })
  );
});
