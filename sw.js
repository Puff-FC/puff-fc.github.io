// Puff FC: modo sin conexión. La versión cambia en cada publicación.
const V="puff-20261123-104150";
const BASE=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/icon-180.png","icons/icon-32.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  // Páginas: primero la red (datos frescos), si no hay conexión, la copia guardada
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put("index.html",c));return res}).catch(()=>caches.match("index.html")));return}
  // Resto (iconos, fuentes): copia guardada y se refresca por detrás
  e.respondWith(caches.match(r).then(hit=>{const red=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>hit);return hit||red}));
});
