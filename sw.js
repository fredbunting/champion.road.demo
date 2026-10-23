/* Champion Road service worker: offline play + cached sprites. VERSION is stamped at build time. */
const VERSION='0.3.4';const CORE='cr-core-'+VERSION,ART='cr-art-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CORE).then(c=>c.addAll(['./','./index.html','./music.js?v='+VERSION,'./icon.png']).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('cr-core-')&&k!==CORE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  /* sprites, cries and walk sheets from GitHub: cache forever */
  if(u.hostname==='raw.githubusercontent.com'){e.respondWith(caches.open(ART).then(async c=>{const hit=await c.match(e.request);if(hit)return hit;const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}));return}
  if(u.origin!==location.origin)return;
  /* the game itself: network first (so updates land), cache as the offline fallback */
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cl=r.clone();caches.open(CORE).then(c=>c.put(e.request,cl))}return r}).catch(()=>caches.match(e.request).then(h=>h||caches.match('./index.html'))))});
