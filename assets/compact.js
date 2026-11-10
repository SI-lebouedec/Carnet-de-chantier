/* Mise en page compacte : chaque figure garde la taille pour laquelle elle a été dessinée (au lieu d'être agrandie à toute la largeur),
   et se place à côté du texte quand il y a la place. Aucun contenu n'est modifié : on déplace seulement des blocs. */
(function(){
 function vbw(svg){var v=(svg.getAttribute('viewBox')||svg.getAttribute('viewbox')||'').trim().split(/\s+/).map(Number);return v.length===4&&v[2]>0?v[2]:0}
 function skipFig(f){return f.closest('.calc,.steps,.qz,details,.legb,.ph2,.ph3,.phgrid,.modes,.os')||/photo|figp|nat|os-fig|mode|phc/.test(f.className)}
 function isText(e){return e&&/^(P|UL|OL)$/.test(e.tagName)&&!e.classList.contains('note')&&!e.classList.contains('exo-q')}

 function run(){
  /* 0. glossaire : chaque schéma garde sa taille et se place à côté du texte */
  [].forEach.call(document.querySelectorAll('.entry>figure'),function(f){
   var svg=f.querySelector('svg');if(!svg)return;
   var w=vbw(svg)||+((svg.getAttribute('viewbox')||'').split(/\s+/)[2])||0;if(!w)return;
   f.style.setProperty('--fw',Math.min(Math.round(w*1.2)+16,500)+'px');f.classList.add('gfig');
   if(w>=600){f.classList.add('gwide');var see=f.parentElement.querySelector(':scope>p.see');if(see)see.insertAdjacentElement('beforebegin',f);return}
   var h3=f.parentElement.querySelector(':scope>h3');if(h3&&h3.nextElementSibling!==f)h3.insertAdjacentElement('afterend',f);
  });
  /* 1. calculateurs : largeur de la colonne figure = largeur naturelle du dessin */
  [].forEach.call(document.querySelectorAll('.calc .dcg-fig svg'),function(s){
   var w=vbw(s);if(w){var d=s.closest('.dcg');if(d)d.style.setProperty('--dw',Math.min(Math.round(w*1.05),640)+'px')}
  });
  /* 2. figures du cours : taille naturelle, puis à côté du texte */
  [].forEach.call(document.querySelectorAll('main figure.fig'),function(fig){
   if(skipFig(fig))return;
   var svg=fig.querySelector(':scope>svg');if(!svg)return;
   var w=vbw(svg);if(!w)return;
   var fw=Math.round(w*1.12)+22;                 /* + marges intérieures de la figure */
   fig.style.setProperty('--fw',Math.min(fw,760)+'px');
   var par=fig.parentElement;
   if(!par||!par.classList.contains('sec')||fw>560)return;   /* à côté du texte seulement si la figure est assez étroite */
   var group=[],n=fig.nextElementSibling;
   while(n&&isText(n)&&group.length<2){group.push(n);n=n.nextElementSibling}
   var pre=null;
   if(!group.length){var p=fig.previousElementSibling;if(isText(p)){pre=p}}
   if(!group.length&&!pre)return;
   var wrap=document.createElement('div');wrap.className='fl';
   if(pre){par.insertBefore(wrap,pre);wrap.appendChild(fig);wrap.appendChild(pre)}
   else{par.insertBefore(wrap,fig);wrap.appendChild(fig);group.forEach(function(g){wrap.appendChild(g)})}
   fig.classList.add('figf');
  });
 }
 var css=document.createElement('link');css.rel='stylesheet';css.href='assets/compact.css';document.head.appendChild(css);
 if(document.readyState==='complete')setTimeout(run,60);else addEventListener('load',function(){setTimeout(run,60)});
})();
