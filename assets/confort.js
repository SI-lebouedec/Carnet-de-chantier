/* Mode lecture confort : un seul interrupteur « Aa » (police Arial, fond sobre, sans animations, taille normale).
   Le choix est gardé dans le navigateur de l'élève. */
(function(){
 var KEY='ac7-confort2';
 function get(){try{return localStorage.getItem(KEY)==='1'}catch(e){return false}}
 function set(v){try{localStorage.setItem(KEY,v?'1':'0')}catch(e){}}
 var on=get(),btn,toast,tm;
 var css=document.createElement('link');css.rel='stylesheet';css.href='assets/confort.css';document.head.appendChild(css);
 function apply(){
  var b=document.body;
  b.classList.toggle('cf-ar',on);b.classList.toggle('cf-sobre',on);b.classList.toggle('cf-calme',on);
  if(btn){btn.setAttribute('aria-pressed',on?'true':'false');btn.classList.toggle('on',on);
   btn.title=on?'Mode lecture confort activé : cliquer pour le désactiver':'Activer le mode lecture confort (police Arial, fond sobre, sans animations)'}
 }
 function say(t){
  if(!toast)return;toast.textContent=t;toast.hidden=false;clearTimeout(tm);tm=setTimeout(function(){toast.hidden=true},4200);
 }
 function mount(){
  if(document.getElementById('cfBtn'))return;
  btn=document.createElement('button');btn.type='button';btn.id='cfBtn';btn.className='cfbtn';btn.textContent='Aa';
  btn.setAttribute('aria-label','Mode lecture confort : police Arial, fond sobre, sans animations');
  toast=document.createElement('div');toast.className='cftoast';toast.setAttribute('role','status');toast.hidden=true;
  btn.addEventListener('click',function(){on=!on;set(on);apply();say(on?'Mode lecture confort activé : police Arial, fond sobre, sans animations.':'Mode lecture confort désactivé.')});
  document.body.appendChild(toast);document.body.appendChild(btn);apply();
 }
 function go(){apply();mount()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
