/* Couleur d'appui : choix entre quatre rendus, mémorisé dans le navigateur. Le sélecteur de la barre du haut sert à comparer ; à retirer une fois la variante choisie. */
(function(){
 var KEY='ac7-ct',OPTS=[['','Sans'],['touche','A · Touche'],['duo','B · Duo'],['bichro','C · Bichromie']];
 var l=document.createElement('link');l.rel='stylesheet';l.href='assets/contra.css';document.head.appendChild(l);
 function get(){if(!window.SITE||!SITE.paletteDemo)return 'bichro';try{var v=localStorage.getItem(KEY);return v===null?'bichro':v}catch(e){return 'bichro'}}
 function set(v){try{localStorage.setItem(KEY,v)}catch(e){}document.documentElement.setAttribute('data-ct',v);sync()}
 var m=/[?&]palette=(touche|duo|bichro|sans)/.exec(location.search);
 if(m){try{localStorage.setItem(KEY,m[1]==='sans'?'':m[1])}catch(e){}}
 document.documentElement.setAttribute('data-ct',get());
 function sync(){var s=document.getElementById('ctSel');if(s)s.value=get()}
 function mount(){
  if(!window.SITE||!SITE.paletteDemo||document.getElementById('ctBar'))return;
  var host=document.querySelector('.top .in');if(!host)return;
  var w=document.createElement('label');w.id='ctBar';w.className='ctbar';
  w.innerHTML='<span>Couleur d\'appui</span><select id="ctSel" aria-label="Couleur d\'appui (choisir une variante)">'+OPTS.map(function(o){return '<option value="'+o[0]+'">'+o[1]+'</option>'}).join('')+'</select>';
  var sp=host.querySelector('.sp');host.insertBefore(w,sp?sp.nextSibling:host.firstChild);
  w.querySelector('select').addEventListener('change',function(e){set(e.target.value)});sync();
  /* sur téléphone la barre du haut est pleine : le sélecteur flotte en bas à gauche, hors de la barre (qui est floutée donc piège les éléments fixes) */
  var mq=window.matchMedia('(max-width:640px)');
  function place(){if(mq.matches)document.body.appendChild(w);else if(w.parentNode!==host){var s2=host.querySelector('.sp');host.insertBefore(w,s2?s2.nextSibling:host.firstChild)}}
  place();(mq.addEventListener?mq.addEventListener('change',place):mq.addListener(place));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
