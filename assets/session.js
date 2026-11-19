/* Connexion élève (v8, 15/11/2026) : code de la classe, nom de famille saisi, code personnel ; le navigateur garde un jeton, jamais le code. Le code personnel est d'abord celui que
   donne le professeur (colonne « Mot de passe » de l'onglet Élèves) ; l'élève peut ensuite le modifier
   (action changePassword du script Google). Pas de connexion sans code. Classe « Invités » : codes fixes,
   non modifiables. La session est mémorisée dans le navigateur (clé ac-carnet-session). */
(function(){
 var EP=(window.SITE&&window.SITE.acEndpoint)||'';
 var KEY='ac-carnet-session';
 var listeners=[];
 function load(){try{var s=JSON.parse(localStorage.getItem(KEY)||'null');return s&&s.code&&s.prenom&&s.nom?s:null}catch(e){return null}}
 function save(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
 function clear(){try{localStorage.removeItem(KEY)}catch(e){}}
 var KK='ac-carnet-key'; /* clé de déchiffrement des pages, remise par le script après une connexion valide */
 function call(action,params){
  /* Les codes ne passent pas dans l'adresse : connexion et changement de code se font en POST. */
  if(true){
   var o={action:action};Object.keys(params).forEach(function(k){o[k]=params[k]});
   return fetch(EP,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(o)}).then(function(r){return r.json()});
  }
  var q=Object.keys(params).map(function(k){return k+'='+encodeURIComponent(params[k])}).join('&');
  return fetch(EP+'?action='+action+'&'+q).then(function(r){return r.json()});
 }
 function saveKey(k){try{if(k)localStorage.setItem(KK,k)}catch(e){}}
 function norm(x){return String(x||'').toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'')}
 /* Tolère majuscules, accents et espaces dans le code de classe : on retrouve l'écriture exacte de la liste SITE.classes */
 /* « T STI2D 1 a », « tsti2d1A », « Terminale STI2D 1A », « 1a » : même classe (clé « 1a ») */
 function classKey(x){return norm(x).replace(/^terminale/,'t').replace(/^t(?=sti2d|\d)/,'').replace(/sti2d/,'')}
 function canonClass(c){var n=norm(c);if(n==='invites'||n==='invite')return 'STI2D';var L=(window.SITE&&window.SITE.classes)||[],i;for(i=0;i<L.length;i++){if(norm(L[i])===n)return L[i]}var k=classKey(c);if(k){for(i=0;i<L.length;i++){if(classKey(L[i])===k)return L[i]}}return c}
 function isGuest(code,prenom){var c=norm(code);return c==='invites'||c==='sti2d'||norm(prenom)==='invite'}
 var css=document.createElement('link');css.rel='stylesheet';css.href='assets/suivi.css';document.head.appendChild(css);

 var ov=null,lastFocus=null,onDone=null,st={},locked=false;
 function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function close(){if(locked&&!load())return;if(ov){ov.remove();ov=null;document.removeEventListener('keydown',keys)}if(lastFocus&&lastFocus.focus)lastFocus.focus()}
 function keys(e){if(e.key==='Escape')close()}
 function open(){
  if(ov)close();
  lastFocus=document.activeElement;
  ov=el('div','acov');
  ov.innerHTML='<div class="acbox" role="dialog" aria-modal="true" aria-labelledby="acT"><button class="acx" type="button" aria-label="Fermer">×</button><h2 id="acT">Connexion</h2><div class="acbody"></div></div>';
  document.body.appendChild(ov);
  if(locked&&!load()){var xb=ov.querySelector('.acx');if(xb)xb.style.display='none'}
  ov.addEventListener('mousedown',function(e){if(e.target===ov)close()});
  ov.querySelector('.acx').addEventListener('click',close);
  document.addEventListener('keydown',keys);
  return ov.querySelector('.acbody');
 }
 function msg(b,text,kind){var m=b.querySelector('.acmsg');if(!m){m=el('p','acmsg');b.appendChild(m)}m.className='acmsg '+(kind||'');m.textContent=text||''}
 function field(id,label,type,extra){return '<label class="acl" for="'+id+'">'+label+'</label><input class="acin" id="'+id+'" type="'+(type||'text')+'" '+(extra||'')+'>'}

 function stepCode(b,note){
  /* Version 8 : un seul formulaire (classe, nom, code). Le script ne renvoie jamais la liste des élèves. */
  b.innerHTML=(note?'<p class="acnote">'+note+'</p>':'')+'<p>Connecte-toi avec le code que ton professeur t\'a donné.'+(locked?' Le site est réservé aux élèves de la classe.':' Tu peux continuer à lire le cours sans te connecter.')+'</p>'
   +field('acCode','Code de ta classe','text','autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="par exemple : T STI2D 2 b"')
   +field('acNom','Ton nom de famille','text','autocomplete="family-name" spellcheck="false"')
   +field('acPw','Ton code personnel','password','autocomplete="current-password"')
   +'<p class="acsm">Sur un ordinateur du lycée, pense à te déconnecter en partant (bouton « Se déconnecter » en haut de la page).</p>'
   +'<details class="acsm"><summary>Ce que le site enregistre</summary><p>Ta classe et ton nom, les pages que tu ouvres (date, temps actif, défilement, parties lues, type d\'appareil), tes résultats aux QCM et séries de questions, et tes signalements. Seul ton professeur les voit, pendant l\'année scolaire. Ton code n\'est jamais gardé dans le navigateur. Détails dans « Tes données sur ce site », après connexion.</p></details>'
   +'<div class="acrow"><button class="btn pri" type="button" id="acGo">Se connecter</button></div>';
  var ic=b.querySelector('#acCode'),inn=b.querySelector('#acNom'),ip=b.querySelector('#acPw');
  try{var last=localStorage.getItem('ac-derniere-classe');if(last){ic.value=last}}catch(e){}
  (ic.value?inn:ic).focus();
  function go(){
   var c=canonClass(ic.value.trim()),n=inn.value.trim(),pw=ip.value;
   if(!c){msg(b,'Écris le code de ta classe.','err');ic.focus();return}
   if(!n){msg(b,'Écris ton nom de famille.','err');inn.focus();return}
   if(!pw){msg(b,'Écris ton code personnel.','err');ip.focus();return}
   b.querySelector('#acGo').disabled=true;msg(b,'Vérification…');
   call('login',{code:c,nom:n,password:pw}).then(function(r){
    b.querySelector('#acGo').disabled=false;
    if(r.ok){try{localStorage.setItem('ac-derniere-classe',c)}catch(e){}saveKey(r.key);st={code:r.code,prenom:r.prenom,nom:r.nom};finish(r.jeton,pw,r.changed===false);return}
    msg(b,r.error==='locked'?'Trop d\'essais incorrects. Attends 15 minutes avant de réessayer.':r.error==='wrong credentials'?'Classe, nom ou code incorrect. Vérifie-les ou demande ton code à ton professeur.':'Connexion impossible. Préviens ton professeur.','err');
   }).catch(function(){b.querySelector('#acGo').disabled=false;msg(b,'Impossible de joindre le serveur. Vérifie ta connexion.','err')});
  }
  b.querySelector('#acGo').addEventListener('click',go);
  [ic,inn,ip].forEach(function(x){x.addEventListener('keydown',function(e){if(e.key==='Enter')go()})});
 }
 function askedKey(s){return 'ac-code-propose-'+s.code+'|'+s.prenom+'|'+s.nom}
 var memPw=''; /* code tapé à la connexion : gardé en mémoire le temps de proposer d'en choisir un autre, jamais enregistré */
 function finish(jeton,pw,offer){
  var s={code:st.code,prenom:st.prenom,nom:st.nom,jeton:jeton};memPw=pw||'';
  save(s);var cb=onDone;onDone=null;close();render();listeners.forEach(function(f){f(s)});if(cb)cb(s);
  var asked=false;try{asked=!!localStorage.getItem(askedKey(s))}catch(e){}
  if(offer&&!asked&&!isGuest(s.code,s.prenom)){try{localStorage.setItem(askedKey(s),'1')}catch(e){}setTimeout(function(){changeCode(true)},150)}
 }
 function stepChange(b,first){
  var u=load();if(!u||isGuest(u.code,u.prenom)){close();return}
  b.innerHTML='<p>Bonjour <b>'+esc(u.prenom)+'</b>. '+(first?'C\'est ta première connexion. Tu peux garder le code que ton professeur t\'a donné, ou choisir dès maintenant un code que tu retiendras mieux (4 caractères au moins).':'Tu peux remplacer ton code personnel par un code que tu retiendras mieux (4 caractères au moins).')+' Il est protégé : même ton professeur ne pourra pas le lire. Retiens-le bien (en cas d\'oubli, ton professeur t\'en donnera un nouveau).</p>'+((first&&(memPw||u.motDePasse))?'':field('acOld','Code actuel','password','autocomplete="current-password"'))+field('acP1','Nouveau code','password','autocomplete="new-password"')+field('acP2','Répète le nouveau code','password','autocomplete="new-password"')+'<div class="acrow"><button class="btn" type="button" id="acBack">'+(first?'Garder mon code':'Annuler')+'</button><button class="btn pri" type="button" id="acGo">Enregistrer</button></div>';
  b.querySelector(b.querySelector('#acOld')?'#acOld':'#acP1').focus();
  b.querySelector('#acBack').addEventListener('click',close);
  function go(){
   var o=b.querySelector('#acOld')?b.querySelector('#acOld').value:(memPw||u.motDePasse||''),a=b.querySelector('#acP1').value,c=b.querySelector('#acP2').value;
   if(!o){msg(b,'Écris ton code actuel.','err');return}
   if(a.length<4){msg(b,'Le nouveau code doit faire 4 caractères au moins.','err');return}
   if(a!==c){msg(b,'Les deux nouveaux codes ne sont pas identiques.','err');return}
   if(a===o){msg(b,'Le nouveau code est identique à l\'ancien.','err');return}
   b.querySelector('#acGo').disabled=true;msg(b,'Enregistrement…');
   call('changePassword',{code:u.code,prenom:u.prenom,nom:u.nom,jeton:u.jeton||'',oldPassword:o,newPassword:a}).then(function(r){
    b.querySelector('#acGo').disabled=false;
    if(r.ok){if(r.jeton){u.jeton=r.jeton}delete u.motDePasse;memPw='';save(u);b.innerHTML='<p><b>C\'est fait.</b> Ton nouveau code est enregistré. Utilise-le à ta prochaine connexion.</p><div class="acrow"><button class="btn pri" type="button" id="acOk">Fermer</button></div>';b.querySelector('#acOk').addEventListener('click',close);b.querySelector('#acOk').focus();return}
    msg(b,r.error==='wrong password'?'Ton code actuel est incorrect.':r.error==='locked'?'Trop d\'essais incorrects. Attends 15 minutes avant de réessayer.':r.error==='guest'?'Les comptes invités ne peuvent pas changer de code.':'Changement impossible. Préviens ton professeur.','err');
   }).catch(function(){b.querySelector('#acGo').disabled=false;msg(b,'Impossible de joindre le serveur.','err')});
  }
  b.querySelector('#acGo').addEventListener('click',go);
  b.querySelector('#acP2').addEventListener('keydown',function(e){if(e.key==='Enter')go()});
 }
 function changeCode(first){
  var u=load();if(!u||isGuest(u.code,u.prenom))return;
  var b=open();b.parentNode.querySelector('#acT').textContent=first===true?'Choisis ton code':'Changer mon code';
  if(!EP){close();return}
  stepChange(b,first===true);
 }

 function login(done,note){
  onDone=done||null;
  var b=open();
  if(!EP){b.innerHTML='<p class="acnote">La connexion n\'est pas encore activée sur ce site : l\'adresse du script Google n\'est pas renseignée.</p><div class="acrow"><button class="btn" type="button" id="acOk">Fermer</button></div>';b.querySelector('#acOk').addEventListener('click',close);return}
  stepCode(b,note);
 }
 function requireLogin(done){if(load()){if(done)done(load());return}locked=true;login(function(u){locked=false;if(done)done(u)})}
 function logout(){clear();try{localStorage.removeItem('ac-carnet-verif');localStorage.removeItem(KK)}catch(e){}if(window.__acGate){location.reload();return}render();listeners.forEach(function(f){f(null)})}

 function render(){
  var host=document.querySelector('.top .in');if(!host)return;
  var old=document.getElementById('acBar');if(old)old.remove();
  var s=load();
  var bar=el('span','acbar');bar.id='acBar';
  if(s){var g=isGuest(s.code,s.prenom),who=g?esc(s.prenom)+' '+esc(s.nom):esc(s.prenom)+' '+esc(s.nom.charAt(0))+'.';
   bar.innerHTML='<span class="acwho" title="Connecté·e">'+who+'</span>'+(g?'':'<button class="btn" type="button" id="acChg" aria-label="Changer mon code"><span class="lgd">Mon code</span><span class="lgm">Code</span></button>')+'<button class="btn" type="button" id="acOut" aria-label="Se déconnecter"><span class="lgd">Se déconnecter</span><span class="lgm">Quitter</span></button>';
   bar.querySelector('#acOut').addEventListener('click',logout);var cb2=bar.querySelector('#acChg');if(cb2)cb2.addEventListener('click',function(){changeCode()})}
  else{bar.innerHTML='<button class="btn" type="button" id="acIn">Se connecter</button>';bar.querySelector('#acIn').addEventListener('click',function(){login()})}
  var acc=host.querySelector('a.btn[href="index.html"]');
  if(acc)host.insertBefore(bar,acc);else host.appendChild(bar);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();

 window.AC={endpoint:EP,saveKey:saveKey,session:load,login:login,requireLogin:requireLogin,logout:logout,changeCode:changeCode,isGuest:isGuest,onChange:function(f){listeners.push(f)},
  modal:{open:open,close:close,msg:msg,el:el,esc:esc}};
})();
