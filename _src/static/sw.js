/* Service worker de quiapropose.fr : fonctionne hors ligne et prépare les notifications. */
var CACHE = "qp-v1";
var CORE = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/og.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== self.location.origin) return; /* Supabase, polices, etc. : jamais en cache */
  /* Le réseau d'abord (le site change tous les jours), le cache si on est hors ligne. */
  e.respondWith(fetch(r).then(function (res) {
    if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r.mode === "navigate" ? "/" : r, copy); }); }
    return res;
  }).catch(function () { return caches.match(r.mode === "navigate" ? "/" : r).then(function (m) { return m || caches.match("/"); }); }));
});
/* Notifications (activées plus tard) */
self.addEventListener("push", function (e) {
  var d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "Qui a proposé ça ?", { body: d.body || "Le défi du jour t’attend.", icon: "/icons/icon-192.png", badge: "/icons/icon-192.png", data: { url: d.url || "/" } }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if ("focus" in cs[i]) { cs[i].navigate(url); return cs[i].focus(); } }
    return self.clients.openWindow(url);
  }));
});
