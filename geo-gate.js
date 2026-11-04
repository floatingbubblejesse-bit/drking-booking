/* Location prompts 20261104 (shared by the LINE pages on this site: 院區資訊地圖, 撥打電話, 疫苗一覽).
   The LINE browser and iPhone Chrome do not remember a site's location permission, so each automatic location request asked again
   on every visit. An automatic request now gets the position saved last time (up to 30 days old, shared by every page of this site)
   instead of a prompt; a real request still runs when location is already allowed, when nothing has been saved yet, or right after
   the visitor taps a locate button. Same code as the 「Location prompts 20261104」 block in site-theme-entry.js. */
(function(){
var g=navigator.geolocation;if(!g||!g.getCurrentPosition||g.dkGate)return;
if(location.pathname.toLowerCase().indexOf('/sys_manage')===0)return;
var real=g.getCurrentPosition.bind(g),realWatch=g.watchPosition?g.watchPosition.bind(g):null,realClear=g.clearWatch?g.clearWatch.bind(g):function(){};
var tapped=0,seq=0,fakes={},SEL='.qS,.locate,[data-dk-locate],[aria-label*="定位"]';
document.addEventListener('click',function(e){if(!e.isTrusted)return;var path=e.composedPath?e.composedPath():[e.target];
  for(var i=0;i<path.length;i++){var n=path[i];if(n&&n.matches&&n.matches(SEL)){tapped=Date.now();return;}}},true);
function saved(){if(Date.now()-tapped<2000)return null;var best=null;['line_clinic_location_v1','geo_last'].forEach(function(k){try{var v=JSON.parse(localStorage.getItem(k)),at=v?(v.at||v.t||0):0;
  if(v&&isFinite(v.lat)&&isFinite(v.lng)&&Math.abs(v.lat)<=90&&Math.abs(v.lng)<=180&&(!best||at>best.at))best={lat:+v.lat,lng:+v.lng,at:at};}catch(e){}});
  return best&&Date.now()-best.at<2592e6?best:null;}
function keep(ok){return function(pos){try{var v={lat:pos.coords.latitude,lng:pos.coords.longitude,at:Date.now()};
  localStorage.setItem('line_clinic_location_v1',JSON.stringify(v));localStorage.setItem('geo_last',JSON.stringify({lat:v.lat,lng:v.lng,t:v.at}));}catch(e){}if(ok)ok(pos);};}
function serve(ok,s){if(ok)ok({coords:{latitude:s.lat,longitude:s.lng,accuracy:1000,altitude:null,altitudeAccuracy:null,heading:null,speed:null},timestamp:s.at});}
function allowed(cb){try{navigator.permissions.query({name:'geolocation'}).then(function(r){cb(r.state==='granted');},function(){cb(false);});}catch(e){setTimeout(function(){cb(false);},0);}}
g.getCurrentPosition=function(ok,fail,opt){var s=saved();if(!s){real(keep(ok),fail,opt);return;}
  allowed(function(yes){if(yes)real(keep(ok),fail,opt);else serve(ok,s);});};
if(realWatch){g.watchPosition=function(ok,fail,opt){var s=saved();if(!s)return realWatch(keep(ok),fail,opt);
    var id=-(++seq);fakes[id]=0;allowed(function(yes){if(!(id in fakes))return;if(yes)fakes[id]=realWatch(keep(ok),fail,opt);else serve(ok,s);});return id;};
  g.clearWatch=function(id){if(id<0){var r=fakes[id];delete fakes[id];if(r)realClear(r);}else realClear(id);};}
g.dkGate=1;
})();
