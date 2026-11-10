/* Accessibilité : lien d'évitement, noms des curseurs et champs, niveaux de titres, couleur du texte sur les pastilles. Aucun contenu n'est modifié : on ajoute seulement des attributs. */
(function(){
 var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};

 /* 1. Lien « Aller au contenu » */
 function skip(){
  var m=$('main');if(!m||$('.skiplink'))return;
  if(!m.id)m.id='main';m.setAttribute('tabindex','-1');
  var a=document.createElement('a');a.className='skiplink';a.href='#'+m.id;a.textContent='Aller au contenu';
  a.addEventListener('click',function(e){e.preventDefault();m.focus({preventScroll:true});m.scrollIntoView({block:'start'})});
  document.body.insertBefore(a,document.body.firstChild);
 }

 /* 2. Noms accessibles : curseurs, champs, listes sans étiquette liée */
 var uid=0;
 function names(){
  $$('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea').forEach(function(i){
   if(i.getAttribute('aria-label')||i.getAttribute('aria-labelledby')||(i.labels&&i.labels.length)||i.title)return;
   if(i.id==='ta'&&i.readOnly){i.setAttribute('aria-hidden','true');i.tabIndex=-1;return}
   var host=i.closest('label,.ctl,.row,div,span,p'),t=null;
   var cand=i.parentElement?$$('.lt,.lbl,label',i.parentElement):[];
   if(!cand.length&&i.parentElement&&i.parentElement.parentElement)cand=$$('.lt,.lbl,label',i.parentElement.parentElement);
   t=cand[0]||null;
   if(t){if(!t.id)t.id='lb'+(++uid);i.setAttribute('aria-labelledby',t.id)}
   else if(i.placeholder)i.setAttribute('aria-label',i.placeholder);
   else{var p=i.previousElementSibling;if(p&&p.textContent.trim()){if(!p.id)p.id='lb'+(++uid);i.setAttribute('aria-labelledby',p.id)}}
  });
  $$('button,a').forEach(function(e){
   if(e.getAttribute('aria-label')||e.title||e.textContent.trim())return;
   var im=$('img[alt]',e);if(im&&im.alt.trim())return;
   var svg=$('svg title',e);if(svg)return;
   var h=e.getAttribute('href')||'';
   if(/wikimedia/.test(h))e.setAttribute('aria-label','Source de la photo (Wikimedia Commons)');
  });
 }

 /* 3. Niveaux de titres : jamais plus d'un cran de saut (aria-level, la mise en page ne bouge pas) */
 function levels(){
  var prev=0;
  $$('h1,h2,h3,h4,h5,h6').forEach(function(h){
   if(h.closest('.gtip,[hidden]'))return;
   var l=+h.tagName[1];
   if(prev&&l-prev>1){l=prev+1;h.setAttribute('aria-level',String(l))}
   prev=l;
  });
 }

 /* 4. Texte lisible sur les pastilles de couleur (--dot) : foncé ou blanc selon le contraste */
 function lum(h){var c=[1,3,5].map(function(i){var v=parseInt(h.substr(i,2),16)/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
 function onFor(hex){var L=lum(hex),dark=(L+.05)/(lum('#1b1208')+.05),white=(1.05)/(L+.05);return dark>=white?'#1b1208':'#fff'}
 function dots(root){
  $$('[style*="--dot"]',root).forEach(function(e){
   if(e.getAttribute('data-on'))return;
   var m=/--dot:\s*(#[0-9a-fA-F]{6})/.exec(e.getAttribute('style')||'');
   if(m){e.style.setProperty('--on',onFor(m[1]));e.setAttribute('data-on','1')}
  });
 }

 /* 5. Légende des phases sur l'accueil */
 function legend(){
  var c=document.getElementById('seqcards');if(!c||document.querySelector('.phleg'))return;
  c.insertAdjacentHTML('beforebegin','<p class="phleg"><b>ESQ</b> esquisse · <b>APS</b> avant-projet sommaire · <b>APD</b> avant-projet définitif · <b>PRO</b> projet · <b>ACT</b> passation des contrats de travaux · <b>EXE</b> études d\'exécution · <b>DET</b> direction de l\'exécution des travaux · <b>AOR</b> assistance aux opérations de réception. La phase colorée est celle où la séquence s\'applique.</p>');
 }

 var css=document.createElement('link');css.rel='stylesheet';css.href='assets/a11y.css';document.head.appendChild(css);
 function run(){skip();names();levels();dots();legend();
  new MutationObserver(function(){dots();names()}).observe(document.body,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
 addEventListener('load',function(){setTimeout(function(){levels();dots();names()},350)});
})();
