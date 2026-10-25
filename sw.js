var V="fuji-v1";
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(["./","./index.html","./icon-192.png","./icon-512.png"])}));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}));
  self.clients.claim();
});
self.addEventListener("fetch",function(e){
  var r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(function(res){
    var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)});return res;
  }).catch(function(){
    return caches.match(r).then(function(m){return m||caches.match("./index.html")});
  }));
});
