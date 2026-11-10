/* Dissuasion contre la copie (version en ligne uniquement).
   - copier / couper / clic droit / glisser bloqués hors des champs de saisie (la sélection reste possible :
     lecture à voix haute et outils pour dyslexiques continuent de fonctionner) ;
   - raccourcis d'enregistrement, d'impression et d'outils de développement neutralisés ;
   - impression remplacée par un message ;
   - filigrane discret avec le nom de la personne connectée (visible sur une capture d'écran).
   Ce n'est qu'un frein : rien n'empêche techniquement une capture d'écran ou une recopie à la main.
   La vraie protection est le chiffrement des pages (voir gate.js). Réglages : window.SITE.protect = {copy,print,watermark}. */
(function(){
 var C=(window.SITE&&window.SITE.protect)||{};
 var copyOn=C.copy!==false,printOn=C.print!==false,wmOn=C.watermark!==false;
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
 st.textContent='img{-webkit-user-drag:none}'+(printOn?'@media print{html,body{background:#fff!important}body>*{display:none!important}body::before{content:"Impression désactivée. Consulte le cours sur le site.";display:block;font:16px Arial,Carlito,sans-serif;padding:2cm;color:#000}}':'')+
  '#acwm{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;pointer-events:none;user-select:none}';
 (document.head||document.documentElement).appendChild(st);
 function who(){try{var s=JSON.parse(localStorage.getItem('ac-carnet-session')||'null');return s&&s.prenom?(s.prenom+' '+s.nom).trim():''}catch(e){return ''}}
 function mark(){
  if(!wmOn||document.getElementById('acwm'))return;
  var w=who();if(!w||!document.body)return;
  var t=w.replace(/[<>&"]/g,'');
  var svg='<svg xmlns="http://www.w3.org/2000/svg" width="340" height="220"><text x="20" y="150" transform="rotate(-24 170 110)" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="rgba(125,125,125,0.10)">'+t+'</text></svg>';
  var d=document.createElement('div');d.id='acwm';d.setAttribute('aria-hidden','true');
  d.style.backgroundImage='url("data:image/svg+xml;utf8,'+encodeURIComponent(svg)+'")';
  document.body.appendChild(d);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mark);else mark();
})();
