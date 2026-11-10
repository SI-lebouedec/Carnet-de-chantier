/* Verrou et déchiffrement du site (version en ligne).
   Deux modes :
   1. page « coque » (contient #acpayload) : le contenu de la page est chiffré (AES-GCM). Sans connexion valide,
      rien de lisible n'est servi, même dans le code source. Après connexion, le script Google remet la clé,
      la page est déchiffrée dans le navigateur puis affichée.
   2. page déchiffrée : vérifie la session (une fois par heure) et rafraîchit la clé.
   Chargé par build_online.py. La session est celle de assets/session.js (clé ac-carnet-session). */
(function(){
 var EP="https://script.google.com/macros/s/AKfycbzY6gTw2aiUs01rsS2HYU5SbZfnQCf_W4I2I-n_oxjijwnrjaTSMGQ3_wzhysfZWl8/exec",KEY='ac-carnet-session',VK='ac-carnet-verif',KK='ac-carnet-key';
 if(!EP)return;
 window.__acGate=true;
 function sess(){try{var s=JSON.parse(localStorage.getItem(KEY)||'null');return s&&s.code&&s.prenom&&s.nom&&s.motDePasse?s:null}catch(e){return null}}
 function verify(s){
  return fetch(EP,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'verify',code:s.code,prenom:s.prenom,nom:s.nom,password:s.motDePasse})}).then(function(r){return r.json()});
 }
 function badAccount(r){return r&&(r.error==='wrong password'||r.error==='student not found'||r.error==='code not found'||r.error==='no password configured for this student')}
 function dropSession(){try{localStorage.removeItem(KEY);localStorage.removeItem(VK);localStorage.removeItem(KK)}catch(e){}}

 var pl=document.getElementById('acpayload');
 if(pl){ /* ---------- mode coque : déchiffrement ---------- */
  var body=document.body;
  function say(t){var p=document.getElementById('acmsg');if(!p){p=document.createElement('p');p.id='acmsg';p.style.cssText='font:16px Arial,Carlito,sans-serif;color:#2B2D31;text-align:center;margin:30vh 16px 0';body.appendChild(p)}p.textContent=t}
  function b64(s){var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}
  function decrypt(keyB64){
   var raw=b64(pl.textContent.trim());
   return crypto.subtle.importKey('raw',b64(keyB64),'AES-GCM',false,['decrypt']).then(function(k){
    return crypto.subtle.decrypt({name:'AES-GCM',iv:raw.slice(0,12)},k,raw.slice(12));
   }).then(function(pt){return new TextDecoder().decode(pt)});
  }
  /* Reconstruit la page à partir du HTML déchiffré, sans document.write (qui perd la fin de la page quand
     des scripts sont déjà en cache) : DOM importé, puis scripts réactivés un par un dans l'ordre. */
  function show(html){
   var hash=location.hash,d=new DOMParser().parseFromString(html,'text/html');
   function attrs(from,to){[].slice.call(to.attributes).forEach(function(a){to.removeAttribute(a.name)});[].slice.call(from.attributes).forEach(function(a){to.setAttribute(a.name,a.value)})}
   attrs(d.documentElement,document.documentElement);attrs(d.body,document.body);
   document.head.innerHTML='';document.body.innerHTML='';
   [].slice.call(d.head.childNodes).forEach(function(n){document.head.appendChild(document.importNode(n,true))});
   [].slice.call(d.body.childNodes).forEach(function(n){document.body.appendChild(document.importNode(n,true))});
   var list=[].slice.call(document.querySelectorAll('script'));
   function next(i){
    if(i>=list.length){
     document.dispatchEvent(new Event('DOMContentLoaded',{bubbles:true}));window.dispatchEvent(new Event('load'));
     if(hash)setTimeout(function(){try{var e=document.getElementById(decodeURIComponent(hash.slice(1)));if(e)e.scrollIntoView()}catch(x){}},150);
     return;
    }
    var o=list[i],n=document.createElement('script');
    [].slice.call(o.attributes).forEach(function(a){if(a.name!=='defer'&&a.name!=='async')n.setAttribute(a.name,a.value)});
    n.async=false;
    if(o.getAttribute('src')){n.onload=n.onerror=function(){next(i+1)};o.parentNode.replaceChild(n,o)}
    else{n.text=o.text;o.parentNode.replaceChild(n,o);next(i+1)}
   }
   next(0);
  }
  function fetchKey(s){
   return verify(s).then(function(r){
    if(r&&r.ok&&r.key){try{localStorage.setItem(KK,r.key);localStorage.setItem(VK,String(Date.now()))}catch(e){}return r.key}
    if(r&&r.error==='locked'){say('Trop d\'essais incorrects. Attends 15 minutes avant de réessayer.');throw 'stop'}
    if(r&&r.ok){say('Le site n\'est pas encore configuré (clé manquante). Préviens ton professeur.');throw 'stop'}
    if(badAccount(r)){dropSession();throw 'login'}
    throw 'net';
   });
  }
  function start(){
   var s=sess();
   if(!s){
    var n=0,t=setInterval(function(){n++;if(window.AC){clearInterval(t);window.AC.requireLogin(function(){start()})}else if(n>80){clearInterval(t);say('Impossible de charger la connexion. Recharge la page.')}},100);
    return;
   }
   if(!(window.crypto&&crypto.subtle)){say('Ce site doit être ouvert avec une adresse https://');return}
   say('Chargement…');
   var key=null;try{key=localStorage.getItem(KK)}catch(e){}
   var tryKey=key?decrypt(key).catch(function(){return null}):Promise.resolve(null);
   tryKey.then(function(html){
    if(html)return html;
    /* pas de clé, ou clé périmée : on la redemande au script avec la session */
    return fetchKey(s).then(decrypt);
   }).then(show).catch(function(e){
    if(e==='login'){location.reload();return}
    if(e==='stop')return;
    say('Impossible de charger la page. Vérifie ta connexion puis recharge.');
   });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  return;
 }

 /* ---------- page déjà déchiffrée ---------- */
 var s=sess();
 if(s){
  /* session déjà ouverte : on la re-vérifie en arrière-plan au plus une fois par heure (code modifié ou retiré dans le Sheet) */
  try{var last=+localStorage.getItem(VK)||0;if(Date.now()-last<3600000)return;
   verify(s).then(function(r){
    if(r&&r.ok){localStorage.setItem(VK,String(Date.now()));if(r.key)localStorage.setItem(KK,r.key)}
    else if(badAccount(r)){dropSession();location.reload()}
   }).catch(function(){})}catch(e){}
  return;
 }
 var h=document.documentElement;h.className+=' aclock';
 var st=document.createElement('style');
 st.textContent='html.aclock{overflow:hidden}html.aclock body>*:not(.acov){visibility:hidden!important}html.aclock body{background:#FBF6EC}';
 document.head.appendChild(st);
 function unlock(){h.className=h.className.replace(/\s*aclock/g,'');try{localStorage.setItem(VK,String(Date.now()))}catch(e){}}
 function go(){
  if(!window.SITE){window.SITE={acEndpoint:EP}}
  var n=0,t=setInterval(function(){n++;if(window.AC){clearInterval(t);window.AC.requireLogin(function(){unlock();location.reload()})}else if(n>60){clearInterval(t);location.reload()}},100);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
