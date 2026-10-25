const V='mes-apps-eps-v1.1.0',F=['./','index.html','eps-core.js','apps.json','manifest.webmanifest','style.css','contact.html','confidentialite.html','icons/icon-192.png','icons/icon-512.png','icons/logo.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{const n=fetch(e.request).then(x=>{if(x.ok&&new URL(e.request.url).origin===location.origin)caches.open(V).then(c=>c.put(e.request,x.clone()));return x}).catch(()=>r);return r||n}))});
