/* Bouton « Signaler un problème » : formulaire guidé + capture facultative, envoyé au script Google
   (onglet « Signalement » de la feuille de suivi). Réservé aux élèves connecté·es. */
(function(){
 var EP=(window.SITE&&window.SITE.acEndpoint)||'';
 var IMG=!!(window.SITE&&window.SITE.signalCapture);
 var TYPES=[
  ['calcul','Un calcul ou une valeur est faux'],
  ['schema','Un schéma est incorrect ou illisible'],
  ['texte','Un texte est faux, incomplet ou pas clair'],
  ['bouton','Un bouton, un curseur ou un exercice ne marche pas'],
  ['affichage','Un problème d\'affichage (texte coupé, qui se superpose…)'],
  ['autre','Autre chose']];
 var img=null; /* {data, w, h, kb} */

 function sectionName(){
  var secs=[].slice.call(document.querySelectorAll('.sec'));
  var y=window.innerHeight*.4,best=null,bd=1e9;
  secs.forEach(function(s){var r=s.getBoundingClientRect();var d=(r.top<=y&&r.bottom>=y)?0:Math.min(Math.abs(r.top-y),Math.abs(r.bottom-y));if(d<bd){bd=d;best=s}});
  if(!best)return '';
  var h=best.querySelector('h2,h3');
  return (h?h.textContent:best.getAttribute('data-rail')||'').replace(/\s+/g,' ').trim();
 }
 function pageTitle(){var h=document.getElementById('h1');return (h&&h.textContent.trim())||document.title}
 function answers(){
  var out=[];[].slice.call(document.querySelectorAll('input.ans')).forEach(function(i,k){if(i.value.trim())out.push('['+(i.id||('champ '+(k+1)))+'] '+i.value.trim())});
  return out.join(' ; ').slice(0,600);
 }
 function compress(file){
  return new Promise(function(res,rej){
   var u=URL.createObjectURL(file),im=new Image();
   im.onload=function(){
    var tries=[[1400,.72],[1100,.6],[900,.5]],r=null;
    for(var i=0;i<tries.length;i++){
     var m=tries[i][0],sc=Math.min(1,m/Math.max(im.naturalWidth,im.naturalHeight));
     var c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*sc);c.height=Math.round(im.naturalHeight*sc);
     var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
     var d=c.toDataURL('image/jpeg',tries[i][1]);
     r={data:d,w:c.width,h:c.height,kb:Math.round(d.length*.75/1024)};
     if(r.kb<=450)break;
    }
    URL.revokeObjectURL(u);res(r);
   };
   im.onerror=function(){URL.revokeObjectURL(u);rej(new Error('image'))};
   im.src=u;
  });
 }

 function form(){
  var s=AC.session();if(!s){AC.login(form,'Connecte-toi pour signaler un problème : ton professeur saura ainsi qui lui écrit.');return}
  var M=AC.modal,b=M.open();
  b.parentNode.querySelector('h2').textContent='Signaler un problème';
  img=null;
  var sec=sectionName(),pg=pageTitle();
  var types='<option value="" disabled selected>— Choisis —</option>'+TYPES.map(function(t){return '<option value="'+t[0]+'">'+t[1]+'</option>'}).join('');
  b.innerHTML=
   (EP?'':'<p class="acnote">Mode test : l\'adresse du script Google n\'est pas renseignée, rien ne sera envoyé.</p>')+
   '<p class="acsm">Page : <b>'+M.esc(pg)+'</b></p>'+
   '<label class="acl" for="sgType">Quel type de problème ?</label><select class="acin" id="sgType">'+types+'</select>'+
   '<label class="acl" for="sgWhere">Où ? (partie, question ou exercice)</label><input class="acin" id="sgWhere" type="text" value="'+M.esc(sec)+'" maxlength="200">'+
   '<label class="acl" for="sgExp">Qu\'est-ce que tu attendais ?</label><textarea class="acin" id="sgExp" rows="2" maxlength="600" placeholder="par exemple : trouver 12,5 W·m⁻²"></textarea>'+
   '<label class="acl" for="sgSaw">Qu\'est-ce que tu as vu ?</label><textarea class="acin" id="sgSaw" rows="3" maxlength="800" placeholder="Décris ce qui s\'affiche ou ce qui ne se passe pas."></textarea>'+
   '<label class="acl" for="sgVal">Ta réponse ou la valeur que tu as saisie (facultatif)</label><input class="acin" id="sgVal" type="text" maxlength="200">'+
   (IMG?'<div class="acl">Une capture d\'écran (facultatif)</div><div class="acdrop" id="sgDrop" tabindex="0"><span id="sgDropT">Colle ta capture ici (Ctrl+V) ou <label class="aclink" for="sgFile">choisis une image</label>.</span><input type="file" id="sgFile" accept="image/*" hidden><div id="sgPrev"></div></div>':'')+
   '<p class="acsm">Sont envoyés avec ton message : ton nom, ta classe, la page, la taille de ton écran et ton navigateur, ainsi que les valeurs saisies dans les exercices de cette page.</p>'+
   '<div class="acrow"><button class="btn" type="button" id="sgNo">Annuler</button><button class="btn pri" type="button" id="sgSend">Envoyer</button></div>';
  b.querySelector('#sgType').focus();
  b.querySelector('#sgNo').addEventListener('click',M.close);
  if(IMG){
   var drop=b.querySelector('#sgDrop'),prev=b.querySelector('#sgPrev');
   function take(f){
    if(!f||!/^image\//.test(f.type)){M.msg(b,'Ce fichier n\'est pas une image.','err');return}
    compress(f).then(function(r){
     img=r;prev.innerHTML='<img alt="Aperçu de la capture" src="'+r.data+'"><button type="button" class="btn" id="sgRm">Retirer l\'image</button><span class="acsm">'+r.w+' × '+r.h+' px, '+r.kb+' Ko</span>';
     prev.querySelector('#sgRm').addEventListener('click',function(){img=null;prev.innerHTML=''});M.msg(b,'');
    }).catch(function(){M.msg(b,'Impossible de lire cette image.','err')});
   }
   b.querySelector('#sgFile').addEventListener('change',function(e){take(e.target.files[0])});
   b.parentNode.addEventListener('paste',function(e){var it=[].slice.call((e.clipboardData&&e.clipboardData.items)||[]).filter(function(i){return /^image\//.test(i.type)})[0];if(it){e.preventDefault();take(it.getAsFile())}});
   ['dragover','drop'].forEach(function(n){drop.addEventListener(n,function(e){e.preventDefault();if(n==='drop')take(e.dataTransfer.files[0])})});
  }
  b.querySelector('#sgSend').addEventListener('click',function(){
   var type=b.querySelector('#sgType').value,saw=b.querySelector('#sgSaw').value.trim();
   if(!type){M.msg(b,'Choisis le type de problème.','err');return}
   if(saw.length<5){M.msg(b,'Décris ce que tu as vu (quelques mots suffisent).','err');return}
   var tl=TYPES.filter(function(t){return t[0]===type})[0][1];
   var p={fiche:'Signalement',dateHeure:new Date().toLocaleString('fr-FR'),code:s.code,prenom:s.prenom,nom:s.nom,motDePasse:s.motDePasse||'',
    statut:'Nouveau',traitement:'',type:tl,page:pg,adresse:location.pathname.split('/').pop()+location.hash,section:sec,lieu:b.querySelector('#sgWhere').value.trim(),
    attendu:b.querySelector('#sgExp').value.trim(),vu:saw,reponseSaisie:b.querySelector('#sgVal').value.trim(),reponsesPage:answers(),
    ecran:innerWidth+'x'+innerHeight+' (écran '+screen.width+'x'+screen.height+')',navigateur:(navigator.userAgent||'').slice(0,140)};
   if(img)p.captureBase64=img.data;
   send(b,p,s);
  });
 }

 function send(b,p,s){
  var M=AC.modal,btn=b.querySelector('#sgSend');
  if(!EP){done(b,'Mode test : ton message serait parti à ce stade.');return}
  btn.disabled=true;M.msg(b,'Envoi en cours…');
  var ctl=new AbortController(),t=setTimeout(function(){ctl.abort()},30000);
  fetch(EP,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(p),signal:ctl.signal}).then(function(r){return r.json()}).then(function(r){
   clearTimeout(t);
   if(r&&r.ok){done(b,'Merci, ton signalement est envoyé. Ton professeur le lira.');return}
   btn.disabled=false;
   if(r&&r.error==='invalid credentials'){AC.logout();M.msg(b,'Ta session n\'est plus valide : ferme cette fenêtre, reconnecte-toi, puis recommence.','err');return}
   M.msg(b,'L\'envoi a échoué ('+((r&&r.error)||'erreur inconnue')+'). Réessaie dans un moment.','err');
  }).catch(function(){
   clearTimeout(t);btn.disabled=false;
   M.msg(b,'Je n\'ai pas pu confirmer la réception. Ton message est peut-être arrivé : vérifie ta connexion, puis réessaie si tu veux.','err');
  });
 }
 function done(b,text){
  b.parentNode.querySelector('h2').textContent='C\'est envoyé';
  b.innerHTML='<p class="acok">'+text+'</p><div class="acrow"><button class="btn pri" type="button" id="sgClose">Fermer</button></div>';
  b.querySelector('#sgClose').addEventListener('click',AC.modal.close);b.querySelector('#sgClose').focus();
 }

 function mount(){
  if(document.getElementById('sgBtn'))return;
  var bt=document.createElement('button');bt.type='button';bt.id='sgBtn';bt.className='sgbtn';
  bt.innerHTML='<span aria-hidden="true">⚑</span> Signaler un problème';
  bt.setAttribute('aria-label','Signaler un problème sur cette page');
  bt.addEventListener('click',form);
  document.body.appendChild(bt);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
