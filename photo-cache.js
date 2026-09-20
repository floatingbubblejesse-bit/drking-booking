'use strict';
const PHOTO_CACHE='drking-public-photos-v1';
const PHOTO_FILES=["image-084ce356e12a9d9f.webp", "image-0c82cc6f0a59cc22.webp", "image-1d8cbcb4b9c6fea7.webp", "image-247f47d28b6189eb.webp", "image-24ae883abca41cd4.jpg", "image-28e628727e6f1c27.webp", "image-33f27dff2c593189.webp", "image-363cfc8653079980.webp", "image-37023d4e3abdc49e.webp", "image-444bdc606ff750a8.webp", "image-46f4cb1f974c4f3e.webp", "image-490fa1f95b28ef7b.webp", "image-6160395b2906db9c.webp", "image-6a7a7e9b09ff3950.webp", "image-8241c09bc705540f.webp", "image-88082bf2e893b098.webp", "image-8836e9c997a39871.webp", "image-93ab574f5d3f24ab.webp", "image-9f62be7caa594c90.webp", "image-a09ad72e490201a0.webp", "image-a58e5ec716d1ed13.webp", "image-aa2d6fdc49c96876.webp", "image-b0e3231703dcfb06.webp", "image-b23b00a9b601be3d.webp", "image-beda0ba1f3589146.webp", "image-c51c7ad7811be29f.webp", "image-c8e164a1314903b7.webp", "image-c9cd3ed07d835d06.webp", "image-ec69bcbd8c9a3621.webp", "image-eff257747e1b44f4.webp", "image-f68e8a7fdbc7e420.webp"];
const root=new URL('./',self.location.href),allowed=new Set(PHOTO_FILES.map(p=>new URL(p,root).href));
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const cache=await caches.open(PHOTO_CACHE);for(const req of await cache.keys())if(!allowed.has(req.url))await cache.delete(req);
 await self.clients.claim();
})()));
const pending=new Map();
async function photo(url){
 const cache=await caches.open(PHOTO_CACHE),saved=await cache.match(url);if(saved)return saved;
 if(!pending.has(url))pending.set(url,(async()=>{const r=await fetch(url,{credentials:'omit',cache:'force-cache'});if(r.ok&&/^image\//i.test(r.headers.get('Content-Type')||''))await cache.put(url,r.clone());return r;})().finally(()=>pending.delete(url)));
 return (await pending.get(url)).clone();
}
self.addEventListener('fetch',event=>{
 if(event.request.method==='GET'&&event.request.destination==='image'&&allowed.has(event.request.url))event.respondWith(photo(event.request.url));
});
let warming=null;
self.addEventListener('message',event=>{
 if(!event.source||!event.source.url||new URL(event.source.url).origin!==root.origin||!event.data||event.data.type!=='WARM_PUBLIC_PHOTOS')return;
 if(!warming)warming=(async()=>{let next=0;async function run(){while(next<PHOTO_FILES.length){const url=new URL(PHOTO_FILES[next++],root).href;try{await photo(url);}catch(_){}}}await Promise.all([run(),run()]);})().finally(()=>warming=null);
 event.waitUntil(warming);
});
