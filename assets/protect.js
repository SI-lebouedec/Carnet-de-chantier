/* Dissuasion contre la copie (version en ligne uniquement).
   - copier / couper / clic droit / glisser bloqués hors des champs de saisie (la sélection reste possible :
     lecture à voix haute et outils pour dyslexiques continuent de fonctionner) ;
   - raccourcis d'enregistrement, d'impression et d'outils de développement neutralisés ;
   - impression remplacée par un message ;
   Ce n'est qu'un frein : rien n'empêche techniquement une capture d'écran ou une recopie à la main.
   La vraie protection est le chiffrement des pages (voir gate.js). Réglages : window.SITE.protect = {copy,print}. */
(function(){
 var C=(window.SITE&&window.SITE.protect)||{};
 var copyOn=C.copy!==false,printOn=C.print!==false;
 function inField(t){
  while(t&&t.nodeType===1){var n=t.nodeName;if(n==='INPUT'||n==='TEXTAREA'||n==='SELECT'||t.isContentEditable)return true;t=t.parentNode}
  return false;
 }
 if(copyOn){
  ['copy','cut','dragstart'].forEach(function(ev){document.addEventListener(ev,function(e){if(!inField(e.target)&&!inField(document.activeElement))e.preventDefault()},true)});
  document.addEventListener('contextmenu',function(e){if(!inField(e.target))e.preventDefault()},true);
  document.addEventListener('keydown',function(e){
   var k=(e.key||'').toLowerCase(),c=e.ctrlKey||e.metaKey;
   if(inField(e.target))return;
   if((c&&(k==='s'||k==='u'||(printOn&&k==='p')))||k==='f12'||(c&&e.shiftKey&&(k==='i'||k==='j'||k==='c')))e.preventDefault();
  },true);
 }
 var st=document.createElement('style');
 st.textContent='img{-webkit-user-drag:none}'+(printOn?'@media print{html,body{background:#fff!important}body>*{display:none!important}body::before{content:"Impression désactivée. Consulte le cours sur le site.";display:block;font:16px Arial,Carlito,sans-serif;padding:2cm;color:#000}}':'');
 (document.head||document.documentElement).appendChild(st);
})();
