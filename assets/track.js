/* Suivi d'utilisation : page consultée, temps actif, défilement, rubriques lues.
   Envoi au script Google (feuille « Suivi consultation AC »), une ligne par visite mise à jour régulièrement.
   Chargé par build_online.py sur toutes les pages de la version en ligne. Rien n'est envoyé pour un invité. */
(function(){
 var EP="https://script.google.com/macros/s/AKfycbzY6gTw2aiUs01rsS2HYU5SbZfnQCf_W4I2I-n_oxjijwnrjaTSMGQ3_wzhysfZWl8/exec",KEY='ac-carnet-session';
 if(!EP)return;
 var P={'index':'Accueil','glossaire':'Glossaire','verbes':'Verbes de consigne','remediation':'Remédiation','remediation-regle-de-trois':'Remédiation — Règle de trois','remediation-graphique':'Remédiation — Graphiques','remediation-correlation':'Remédiation — Corrélation','remediation-reciproques':'Remédiation — Opérations réciproques','alphabet-grec':'Alphabet grec','fiche-metiers':'Fiche métiers','sujets-de-bac':'Sujets de bac','carnet-de-revision':'Carnet de révision',
  'sequence-0':'Séquence 0 — Rappels','sequence-1':'Séquence 1 — Bioclimatisme','sequence-2':'Séquence 2 — Efficacité énergétique','sequence-3':'Séquence 3 — Dimensionner une structure','sequence-4':'Séquence 4 — Concevoir un logement agréable','sequence-5':'Séquence 5 — Organisation de chantier','sequence-6':'Séquence 6 — Topographie','sequence-7':'Séquence 7 — Un ouvrage à l\'épreuve du temps','sequence-8':'Séquence 8 — RDM : flexion','sequence-9':'Séquence 9 — Optimisation de l\'enveloppe',
  'bac-2021-metropole':'Bac 2021 — Métropole','bac-2022-boiseo':'Bac 2022 — Boiséo','bac-2022-nc':'Bac 2022 — Nouvelle-Calédonie','bac-2023-la-reunion':'Bac 2023 — La Réunion','bac-2023-velodrome':'Bac 2023 — Vélodrome','bac-2024-metropole-remplacement':'Bac 2024 — Métropole (remplacement)','bac-2024-polynesie':'Bac 2024 — Polynésie','bac-2024-teleo':'Bac 2024 — Téléo','bac-2025-metropole':'Bac 2025 — Métropole','bac-2026-antilles-guyane':'Bac 2026 — Antilles-Guyane'};
 var file=(location.pathname.split('/').pop()||'index.html').replace(/\.html$/,'')||'index';
 var page=P[file]||(document.title||file).replace(/\s*[·—-]\s*(Carnet de chantier AC|Réponse en ligne).*$/,'').slice(0,80);
 function norm(x){return String(x||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[\s\-_.]+/g,'').toLowerCase()}
 var s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
 if(!s||!s.code||!s.prenom||!s.nom||!s.motDePasse)return;
 if(norm(s.code)==='invites'||norm(s.code)==='sti2d'||norm(s.prenom)==='invite')return;
 var vid=Date.now().toString(36)+Math.random().toString(36).slice(2,7);
 var dev=(window.matchMedia&&matchMedia('(pointer:coarse)').matches)||innerWidth<700?'mobile':'ordinateur';
 var active=0,lastSent=-1,lastInput=Date.now(),maxScroll=0,secs={};
 ['mousemove','keydown','scroll','touchstart','click','wheel'].forEach(function(ev){addEventListener(ev,function(){lastInput=Date.now()},{passive:true,capture:true})});
 function current(){var hs=document.querySelectorAll('h2'),cur=null;for(var i=0;i<hs.length;i++){var r=hs[i].getBoundingClientRect();if(r.top<innerHeight*0.55)cur=hs[i];else break}
  return cur?(cur.textContent||'').replace(/\s+/g,' ').trim().slice(0,60):null}
 function sections(){return Object.keys(secs).filter(function(k){return secs[k]>=6}).sort(function(a,b){return secs[b]-secs[a]}).slice(0,12).join(';')}
 var stopped=false; /* le script a refusé la session (code modifié, blocage) : on arrête d'envoyer, sinon on déclencherait le blocage anti-devinette */
 function send(){
  if(stopped)return;
  lastSent=active;
  var body=JSON.stringify({fiche:'Suivi consultation AC',code:s.code,prenom:s.prenom,nom:s.nom,motDePasse:s.motDePasse,page:page,tempsPasseSecondes:active,defilementMax:maxScroll,sections:sections(),visitId:vid,appareil:dev});
  try{fetch(EP,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},keepalive:true,body:body}).then(function(r){return r.json()}).then(function(j){if(j&&j.ok===false&&(j.error==='invalid credentials'||j.error==='locked'))stopped=true}).catch(function(){})}catch(e){try{navigator.sendBeacon(EP,body)}catch(e2){}}
 }
 setInterval(function(){
  var h=document.documentElement,sc=Math.round(((window.pageYOffset||h.scrollTop)+innerHeight)/Math.max(h.scrollHeight,1)*100);if(sc>maxScroll)maxScroll=Math.min(sc,100);
  if(document.visibilityState==='visible'&&Date.now()-lastInput<60000){
   active++;var c=current();if(c)secs[c]=(secs[c]||0)+1;
   if(lastSent<0&&active>=3)send();else if(lastSent>=0&&active-lastSent>=30)send();
  }
 },1000);
 function flush(){if(lastSent>=0&&active>lastSent)send()}
 document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')flush()});
 addEventListener('pagehide',flush);
})();
