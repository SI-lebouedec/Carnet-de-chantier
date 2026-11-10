/* Calculatrice scientifique avec trace des calculs : bouton flottant + volet à droite, sur toutes les pages.
   Le moteur (analyse et calcul d'une expression) n'utilise pas eval ; il est testable seul (voir la fin du fichier).
   Conventions : virgule ou point décimal ; « 2π » et « 3(4+1) » comptent comme un seul facteur (1 ÷ 2π = 1 ÷ (2π)) ;
   angles en degrés par défaut (bouton DEG / GRAD / RAD) ; Ans = dernier résultat. */
(function(root){
 'use strict';
 /* ---------- moteur ---------- */
 var SUPD={'⁰':0,'¹':1,'²':2,'³':3,'⁴':4,'⁵':5,'⁶':6,'⁷':7,'⁸':8,'⁹':9};
 var FUN={'sin':1,'cos':1,'tan':1,'sin⁻¹':1,'cos⁻¹':1,'tan⁻¹':1,'asin':1,'acos':1,'atan':1,'√':1,'∛':1,'sqrt':1,'cbrt':1,'log':1,'ln':1,'exp':1,'abs':1};
 var FNAMES=Object.keys(FUN).sort(function(a,b){return b.length-a.length});
 function CalcError(m){this.message=m}
 function tokenize(s){
  var t=[],i=0,n=s.length,c;
  while(i<n){
   c=s[i];
   if(/\s|[  ]/.test(c)){i++;continue}
   if(/[0-9]/.test(c)||((c===','||c==='.')&&/[0-9]/.test(s[i+1]||''))){
    var j=i,seenDot=false;
    while(j<n&&(/[0-9]/.test(s[j])||((s[j]===','||s[j]==='.')&&!seenDot&&/[0-9]/.test(s[j+1]||''))||(/[   ]/.test(s[j])&&/[0-9]{3}(?![0-9])/.test(s.substr(j+1,3))&&!seenDot&&/[0-9]/.test(s[j-1]||'')&&j+4<=n&&!/[0-9]/.test(s[j+4]||'')))){
     if(s[j]===','||s[j]==='.')seenDot=true;j++}
    t.push({k:'num',v:parseFloat(s.slice(i,j).replace(/[   ]/g,'').replace(',','.'))});i=j;continue}
   var f=null;
   for(var q=0;q<FNAMES.length;q++){if(s.substr(i,FNAMES[q].length).toLowerCase()===FNAMES[q]){f=FNAMES[q];break}}
   if(f){t.push({k:'fun',v:f});i+=f.length;continue}
   if(s.substr(i,3).toLowerCase()==='ans'){t.push({k:'ans'});i+=3;continue}
   if(c==='π'||s.substr(i,2).toLowerCase()==='pi'){t.push({k:'num',v:Math.PI});i+=(c==='π'?1:2);continue}
   if(c==='e'||c==='E'){t.push({k:'num',v:Math.E});i++;continue}
   if(SUPD.hasOwnProperty(c)){
    var e=0,m=0;while(i<n&&SUPD.hasOwnProperty(s[i])){e=e*10+SUPD[s[i]];i++;m++}t.push({k:'sup',v:e});continue}
   if('+-−–'.indexOf(c)>=0){t.push({k:'op',v:'+-'.indexOf(c)===0?'+':'-'});i++;continue}
   if(c==='×'||c==='*'||c==='·'||c==='x'||c==='X'){t.push({k:'op',v:'*'});i++;continue}
   if(c==='÷'||c==='/'){t.push({k:'op',v:'/'});i++;continue}
   if(c==='^'){t.push({k:'op',v:'^'});i++;continue}
   if(c==='%'){t.push({k:'pct'});i++;continue}
   if(c==='!'){t.push({k:'fact'});i++;continue}
   if(c==='('||c==='['){t.push({k:'lp'});i++;continue}
   if(c===')'||c===']'){t.push({k:'rp'});i++;continue}
   throw new CalcError('Symbole inconnu : « '+c+' »');
  }
  return t;
 }
 function evaluate(src,opt){
  opt=opt||{};var mode=opt.mode||'deg',ans=opt.ans||0;
  var tk=tokenize(src),p=0;
  if(!tk.length)throw new CalcError('');
  var toRad=mode==='deg'?Math.PI/180:mode==='grad'?Math.PI/200:1;
  function fromRad(x){return x/toRad}
  function peek(){return tk[p]}
  function startsPrimary(x){return x&&(x.k==='num'||x.k==='ans'||x.k==='fun'||x.k==='lp')}
  function fixZero(x){return Math.abs(x)<1e-13?0:x}
  function trig(name,a){
   var x=a*toRad;
   if(mode==='deg'||mode==='grad'){
    var full=mode==='deg'?360:400,q=full/4,r=((a%full)+full)%full;
    if(name==='sin'){if(r===0||r===full/2)return 0;if(r===q)return 1;if(r===3*q)return -1}
    if(name==='cos'){if(r===q||r===3*q)return 0;if(r===0)return 1;if(r===full/2)return -1}
    if(name==='tan'){if(r===0||r===full/2)return 0;if(r===q||r===3*q)throw new CalcError('tan non définie')}
   }
   return fixZero(Math[name](x));
  }
  function fn(name,a){
   switch(name){
    case 'sin':case 'cos':case 'tan':return trig(name,a);
    case 'sin⁻¹':case 'asin':if(Math.abs(a)>1)throw new CalcError('Hors domaine');return fromRad(Math.asin(a));
    case 'cos⁻¹':case 'acos':if(Math.abs(a)>1)throw new CalcError('Hors domaine');return fromRad(Math.acos(a));
    case 'tan⁻¹':case 'atan':return fromRad(Math.atan(a));
    case '√':case 'sqrt':if(a<0)throw new CalcError('Racine d’un nombre négatif');return Math.sqrt(a);
    case '∛':case 'cbrt':return Math.cbrt(a);
    case 'log':if(a<=0)throw new CalcError('Hors domaine');return Math.log10(a);
    case 'ln':if(a<=0)throw new CalcError('Hors domaine');return Math.log(a);
    case 'exp':return Math.exp(a);
    case 'abs':return Math.abs(a);
   }
  }
  function expr(){
   var v=term();
   while(peek()&&peek().k==='op'&&(peek().v==='+'||peek().v==='-')){var o=tk[p++].v,r=term();v=o==='+'?v+r:v-r}
   return v;
  }
  function term(){
   var v=implicit();
   while(peek()&&peek().k==='op'&&(peek().v==='*'||peek().v==='/')){
    var o=tk[p++].v,r=implicit();
    if(o==='/'){if(r===0)throw new CalcError('Division par zéro');v=v/r}else v=v*r;
   }
   return v;
  }
  function implicit(){
   var v=unary();
   while(startsPrimary(peek())){v=v*power()}   /* 2π, 3(4+1), 2sin(30) : un seul facteur */
   return v;
  }
  function unary(){
   var x=peek();
   if(x&&x.k==='op'&&(x.v==='-'||x.v==='+')){p++;var u=unary();return x.v==='-'?-u:u}
   return power();
  }
  function power(){
   var b=postfix();
   if(peek()&&peek().k==='op'&&peek().v==='^'){p++;var ex=signedPower();return powr(b,ex)}
   return b;
  }
  function signedPower(){
   var x=peek();
   if(x&&x.k==='op'&&(x.v==='-'||x.v==='+')){p++;var u=signedPower();return x.v==='-'?-u:u}
   var b=postfix();
   if(peek()&&peek().k==='op'&&peek().v==='^'){p++;return powr(b,signedPower())}
   return b;
  }
  function powr(b,e){
   if(b===0&&e<0)throw new CalcError('Division par zéro');
   var r=Math.pow(b,e);if(isNaN(r))throw new CalcError('Hors domaine');return r;
  }
  function postfix(){
   var v=primary();
   for(;;){
    var x=peek();
    if(x&&x.k==='sup'){p++;v=powr(v,x.v)}
    else if(x&&x.k==='pct'){p++;v=v/100}
    else if(x&&x.k==='fact'){p++;if(v<0||v!==Math.floor(v)||v>170)throw new CalcError('Factorielle impossible');var f=1;for(var i=2;i<=v;i++)f*=i;v=f}
    else break;
   }
   return v;
  }
  function primary(){
   var x=tk[p++];
   if(!x)throw new CalcError('Expression incomplète');
   if(x.k==='num')return x.v;
   if(x.k==='ans')return ans;
   if(x.k==='lp'){var v=expr();if(peek()&&peek().k==='rp')p++;return v}   /* parenthèse fermante facultative en fin */
   if(x.k==='fun'){
    var a;
    if(peek()&&peek().k==='lp'){p++;a=expr();if(peek()&&peek().k==='rp')p++}
    else{if(!peek())throw new CalcError('Expression incomplète');a=signedPrimary()}
    return fn(x.v,a);
   }
   throw new CalcError('Erreur de syntaxe');
  }
  function signedPrimary(){var x=peek();if(x&&x.k==='op'&&(x.v==='-'||x.v==='+')){p++;var u=signedPrimary();return x.v==='-'?-u:u}return postfix()}
  var res=expr();
  if(p<tk.length)throw new CalcError('Erreur de syntaxe');
  if(!isFinite(res))throw new CalcError('Résultat trop grand');
  return fixZero(res);
 }
 /* mise en forme : 10 chiffres significatifs, notation 4×10⁻⁸ pour les très grands et très petits nombres */
 var SUPS='⁰¹²³⁴⁵⁶⁷⁸⁹';
 function sup(n){return String(n).split('').map(function(c){return c==='-'?'⁻':SUPS[+c]}).join('')}
 function fmt(x,plain){
  if(x===0)return '0';
  var a=Math.abs(x);
  if(a>=1e10||a<1e-6){
   var e=Math.floor(Math.log10(a)),m=+(x/Math.pow(10,e)).toPrecision(8);
   if(Math.abs(m)>=10){m/=10;e++}
   var ms=String(m).replace('.',',');
   return plain?ms+'×10^('+e+')':ms+'×10'+sup(e);
  }
  var s=String(+x.toPrecision(10));
  if(s.indexOf('e')>=0)s=x.toFixed(10).replace(/0+$/,'').replace(/\.$/,'');
  s=s.replace('.',',');
  if(!plain){var ip=s.split(','),neg=ip[0][0]==='-';var d=ip[0].replace('-','').replace(/\B(?=(\d{3})+(?!\d))/g,' ');s=(neg?'-':'')+d+(ip[1]?','+ip[1]:'')}
  return s;
 }

 /* ---------- affichage « naturel » : a ÷ b devient une fraction à barre horizontale, ^ devient un exposant ---------- */
 function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
 function lexView(s){
  var t=[],i=0,n=s.length,c,m;
  while(i<n){
   c=s[i];
   if(/\s|[  ]/.test(c)){i++;continue}
   m=/^[0-9]+(?:[,.][0-9]+)?/.exec(s.slice(i));
   if(!m&&(c===','||c==='.')){m=/^[,.][0-9]+/.exec(s.slice(i))}
   if(m){t.push({k:'num',h:esc(m[0])});i+=m[0].length;continue}
   var f=null;for(var q=0;q<FNAMES.length;q++){if(s.substr(i,FNAMES[q].length).toLowerCase()===FNAMES[q]){f=FNAMES[q];break}}
   if(f){t.push({k:'fun',h:esc(f)});i+=f.length;continue}
   if(s.substr(i,3).toLowerCase()==='ans'){t.push({k:'ans',h:'Ans'});i+=3;continue}
   if(c==='π'){t.push({k:'num',h:'π'});i++;continue}
   if(s.substr(i,2).toLowerCase()==='pi'){t.push({k:'num',h:'π'});i+=2;continue}
   if(c==='e'||c==='E'){t.push({k:'num',h:'e'});i++;continue}
   if(SUPD.hasOwnProperty(c)){var e=0,h='';while(i<n&&SUPD.hasOwnProperty(s[i])){h+=s[i];i++}t.push({k:'sup',h:h});continue}
   if('+-−–'.indexOf(c)>=0){t.push({k:'op',v:c==='+'?'+':'-',h:c==='+'?'+':'−'});i++;continue}
   if('×*·xX'.indexOf(c)>=0){t.push({k:'op',v:'*',h:'×'});i++;continue}
   if(c==='÷'||c==='/'){t.push({k:'op',v:'/'});i++;continue}
   if(c==='^'){t.push({k:'op',v:'^'});i++;continue}
   if(c==='%'){t.push({k:'pct',h:'%'});i++;continue}
   if(c==='!'){t.push({k:'fact',h:'!'});i++;continue}
   if(c==='('||c==='['){t.push({k:'lp'});i++;continue}
   if(c===')'||c===']'){t.push({k:'rp'});i++;continue}
   return null;
  }
  return t;
 }
 /* retourne {h: html, frac: bool} ou null si l'expression est incomplète ou incorrecte */
 function view(src){
  var tk=lexView(src);if(!tk||!tk.length)return null;
  var p=0,has=false;
  function peek(){return tk[p]}
  function fr(a,b){has=true;return '<span class="cf"><span>'+a.h+'</span><span>'+b.h+'</span></span>'}
  function bare(x){return x.par?{h:x.inner}:x}   /* (a+b) ÷ c : la barre remplace les parenthèses */
  function expr(){
   var v=term();
   while(peek()&&peek().k==='op'&&(peek().v==='+'||peek().v==='-')){var o=tk[p++];var r=term();v={h:v.h+' '+o.h+' '+r.h}}
   return v;
  }
  function term(){
   var v=impl();
   while(peek()&&peek().k==='op'&&(peek().v==='*'||peek().v==='/')){
    var o=tk[p++],r=impl();
    v=o.v==='/'?{h:fr(bare(v),bare(r))}:{h:v.h+' × '+r.h};
   }
   return v;
  }
  function starts(x){return x&&(x.k==='num'||x.k==='ans'||x.k==='fun'||x.k==='lp')}
  function impl(){
   var v=unary();
   while(starts(peek())){var r=power();v={h:v.h+r.h,par:false}}
   return v;
  }
  function unary(){
   var x=peek();
   if(x&&x.k==='op'&&(x.v==='-'||x.v==='+')){p++;var u=unary();return {h:x.h+u.h}}
   return power();
  }
  function power(){
   var b=postfix();
   if(peek()&&peek().k==='op'&&peek().v==='^'){p++;var e=signedPower();return {h:b.h+'<sup>'+e.h+'</sup>'}}
   return b;
  }
  function signedPower(){
   var x=peek();
   if(x&&x.k==='op'&&(x.v==='-'||x.v==='+')){p++;var u=signedPower();return {h:x.h+u.h}}
   var b=postfix();
   if(peek()&&peek().k==='op'&&peek().v==='^'){p++;var e=signedPower();return {h:b.h+'<sup>'+e.h+'</sup>'}}
   return b;
  }
  function postfix(){
   var v=primary();
   for(;;){
    var x=peek();
    if(x&&x.k==='sup'){p++;v={h:v.h+'<sup>'+x.h.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,function(d){return SUPD[d]})+'</sup>'}}
    else if(x&&(x.k==='pct'||x.k==='fact')){p++;v={h:v.h+x.h}}
    else break;
   }
   return v;
  }
  function primary(){
   var x=tk[p++];
   if(!x)throw 0;
   if(x.k==='num'||x.k==='ans')return {h:x.h};
   if(x.k==='lp'){var v=expr();if(peek()&&peek().k==='rp')p++;return {h:'('+v.h+')',inner:v.h,par:true}}
   if(x.k==='fun'){
    if(peek()&&peek().k==='lp'){p++;var a=expr();if(peek()&&peek().k==='rp')p++;return {h:x.h+'('+a.h+')'}}
    if(!peek())throw 0;
    var sg=peek(),neg='';if(sg&&sg.k==='op'&&(sg.v==='-'||sg.v==='+')){p++;neg=sg.h}
    var b=postfix();return {h:x.h+' '+neg+b.h}
   }
   throw 0;
  }
  try{var r=expr();if(p<tk.length)return null;return {h:r.h,frac:has,pow:/<sup>/.test(r.h)}}catch(e){return null}
 }
 var API={evaluate:evaluate,format:fmt,tokenize:tokenize,view:view,Error:CalcError};
 if(typeof module!=='undefined'&&module.exports){module.exports=API}
 root.ACCalc=API;
 if(typeof document==='undefined')return;

 /* ---------- interface ---------- */
 var KEY='ac7-calc',mode='deg',ans=0,hist=[],open=false,fresh=false,btn,panel,inp,out,vw,trace,errTimer;
 function load(){try{var d=JSON.parse(sessionStorage.getItem(KEY)||'{}');if(d.mode)mode=d.mode;if(d.hist)hist=d.hist.slice(-40);if(typeof d.ans==='number')ans=d.ans;open=!!d.open;return d}catch(e){return {}}}
 function save(){try{sessionStorage.setItem(KEY,JSON.stringify({mode:mode,hist:hist.slice(-40),ans:ans,open:open,expr:inp?inp.value:''}))}catch(e){}}
 var saved=load();
 var ROWS=[
  [['sin','sin('],['cos','cos('],['tan','tan('],['π','π'],['AC','ac']],
  [['sin⁻¹','sin⁻¹('],['cos⁻¹','cos⁻¹('],['tan⁻¹','tan⁻¹('],['(','('],[')',')']],
  [['x²','²'],['xʸ','^'],['√','√('],['∛','∛('],['⌫','bs']],
  [['log','log('],['ln','ln('],['Ans','Ans'],['%','%'],['×10ˣ','×10^(']],
  [['7','7'],['8','8'],['9','9'],['÷','÷'],['×','×']],
  [['4','4'],['5','5'],['6','6'],['−','−'],['+','+']],
  [['1','1'],['2','2'],['3','3'],[',',','],['±','neg']],
  [['0','0','w2'],['=','eq','w3 eq']]
 ];
 var LABEL={'sin':'sinus','cos':'cosinus','tan':'tangente','π':'pi','AC':'tout effacer','sin⁻¹':'arc sinus','cos⁻¹':'arc cosinus','tan⁻¹':'arc tangente','(':'parenthèse ouvrante',')':'parenthèse fermante','x²':'au carré','xʸ':'puissance','√':'racine carrée','∛':'racine cubique','⌫':'effacer le dernier caractère','log':'logarithme décimal','ln':'logarithme népérien','Ans':'dernier résultat','%':'pour cent','×10ˣ':'fois dix puissance','÷':'divisé par','×':'fois','−':'moins','+':'plus',',':'virgule','±':'changer le signe','=':'égal'};
 var FUNTOK=/(sin⁻¹\(|cos⁻¹\(|tan⁻¹\(|sin\(|cos\(|tan\(|log\(|ln\(|√\(|∛\(|×10\^\(|Ans)$/;
 function build(){
  var css=document.createElement('link');css.rel='stylesheet';css.href='assets/calc.css';document.head.appendChild(css);
  btn=document.createElement('button');btn.type='button';btn.id='calcBtn';btn.className='calcbtn';btn.setAttribute('aria-label','Ouvrir la calculatrice');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','calcPanel');btn.title='Calculatrice';
  btn.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><rect x="4.5" y="2.5" width="15" height="19" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="7.5" y="5.5" width="9" height="4" fill="currentColor"/><g fill="currentColor"><circle cx="8.5" cy="13" r="1.2"/><circle cx="12" cy="13" r="1.2"/><circle cx="15.5" cy="13" r="1.2"/><circle cx="8.5" cy="17" r="1.2"/><circle cx="12" cy="17" r="1.2"/><circle cx="15.5" cy="17" r="1.2"/></g></svg>';
  document.body.appendChild(btn);
  panel=document.createElement('aside');panel.id='calcPanel';panel.className='calcpanel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Calculatrice');panel.hidden=true;
  panel.innerHTML='<div class="chead"><b>Calculatrice</b><button type="button" class="cmode" id="cMode" aria-label="Unité des angles">DEG</button><button type="button" class="cx" id="cX" aria-label="Fermer la calculatrice">×</button></div>'
   +'<div class="ctr"><div class="ctrh"><span>Trace des calculs</span><button type="button" id="cClr">Effacer la trace</button></div><ol id="cTrace" aria-label="Trace des calculs"></ol></div>'
   +'<div class="cdisp"><input id="cIn" class="cin" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Calcul à effectuer" placeholder="ex. 2,4 ÷ tan(68)"><div id="cView" class="cview" aria-hidden="true" hidden></div><output id="cOut" class="cout" aria-live="polite"></output></div>'
   +'<div class="ckeys" id="cKeys"></div>'
   +'<p class="chelp">2π ou 3(4+1) comptent comme un seul facteur. Angles : <span id="cModeTxt">degrés</span>.</p>';
  document.body.appendChild(panel);
  inp=panel.querySelector('#cIn');out=panel.querySelector('#cOut');vw=panel.querySelector('#cView');trace=panel.querySelector('#cTrace');
  var keys=panel.querySelector('#cKeys');
  ROWS.forEach(function(r){r.forEach(function(k){
   var b=document.createElement('button');b.type='button';b.className='ck'+(/[0-9,]/.test(k[0])&&k[0].length===1?' num':'')+(k[2]?' '+k[2]:'');b.textContent=k[0];b.dataset.v=k[1];
   if(LABEL[k[0]])b.setAttribute('aria-label',LABEL[k[0]]);
   if(/[a-zπ√∛]/i.test(k[0])||/²|ʸ|ˣ|⁻/.test(k[0]))b.className+=' fn';
   if(k[1]==='eq')b.className+=' eqk';
   keys.appendChild(b)})});
  keys.addEventListener('click',function(e){var b=e.target.closest('.ck');if(b)press(b.dataset.v)});
  if(matchMedia('(pointer:coarse)').matches)inp.setAttribute('inputmode','none');   /* sur tablette et téléphone : on utilise le pavé */
  inp.addEventListener('input',function(){fresh=false;preview();save()});
  inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();equal()}else if(e.key==='Escape'){toggle(false)}});
  panel.addEventListener('keydown',function(e){if(e.key==='Escape'){toggle(false)}});
  btn.addEventListener('click',function(){toggle(!open)});
  panel.querySelector('#cX').addEventListener('click',function(){toggle(false)});
  panel.querySelector('#cMode').addEventListener('click',function(){mode=mode==='deg'?'grad':mode==='grad'?'rad':'deg';syncMode();preview();save()});
  panel.querySelector('#cClr').addEventListener('click',function(){hist=[];renderTrace();save()});
  trace.addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(!b)return;var h=hist[+b.dataset.i];insert(b.dataset.w==='r'?h.r:h.e);inp.focus()});
  syncMode();renderTrace();
  if(saved.expr)inp.value=saved.expr;
  if(open){panel.hidden=false;btn.setAttribute('aria-expanded','true');document.body.classList.add('calc-open')}
  preview();
 }
 function syncMode(){
  var m=panel.querySelector('#cMode');m.textContent=mode.toUpperCase();
  m.setAttribute('aria-label','Unité des angles : '+(mode==='deg'?'degrés':mode==='grad'?'grades':'radians')+' (cliquer pour changer)');
  panel.querySelector('#cModeTxt').textContent=mode==='deg'?'degrés':mode==='grad'?'grades (400 gr = un tour)':'radians';
 }
 function toggle(v){
  open=v;panel.hidden=!v;btn.setAttribute('aria-expanded',v?'true':'false');btn.setAttribute('aria-label',v?'Fermer la calculatrice':'Ouvrir la calculatrice');
  document.body.classList.toggle('calc-open',v);save();
  if(v){if(!matchMedia('(pointer:coarse)').matches)inp.focus()}else btn.focus();
 }
 function insert(t){
  var s=inp.selectionStart==null?inp.value.length:inp.selectionStart,e=inp.selectionEnd==null?s:inp.selectionEnd;
  inp.value=inp.value.slice(0,s)+t+inp.value.slice(e);inp.setSelectionRange(s+t.length,s+t.length);preview();save();
 }
 function press(v){
  if(v==='eq')return equal();
  if(v==='ac'){inp.value='';out.textContent='';out.className='cout';showView('');fresh=false;save();inp.focus();return}
  if(v==='bs'){
   var s=inp.selectionStart==null?inp.value.length:inp.selectionStart,before=inp.value.slice(0,s),m=before.match(FUNTOK),n=m?m[0].length:(s>0?1:0);
   inp.value=before.slice(0,s-n)+inp.value.slice(s);inp.setSelectionRange(s-n,s-n);preview();save();inp.focus();return}
  if(v==='neg'){var a=inp.value;inp.value=a.charAt(0)==='−'?a.slice(1):'−'+a;preview();save();inp.focus();return}
  if(fresh&&/^(÷|×|−|\+|\^|²|%)/.test(v)){inp.value='Ans'}   /* après un « = », un opérateur continue avec le dernier résultat */
  else if(fresh)inp.value='';
  fresh=false;insert(v);inp.focus();
 }
 function result(){
  var src=inp.value.trim();if(!src)return null;
  return evaluate(src,{mode:mode,ans:ans});
 }
 function showView(src){
  var v=src?view(src):null;
  if(v&&(v.frac||v.pow)){vw.innerHTML=v.h;vw.hidden=false}else{vw.innerHTML='';vw.hidden=true}
 }
 function preview(){
  clearTimeout(errTimer);
  var src=inp.value.trim();
  showView(src);
  if(!src){out.textContent='';out.className='cout';return}
  try{var r=result();out.textContent='= '+fmt(r);out.className='cout prev'}catch(e){out.textContent='';out.className='cout'}
 }
 function equal(){
  var src=inp.value.trim();if(!src)return;
  try{
   var r=result(),shown=fmt(r);
   hist.push({e:src,r:fmt(r,true),s:shown,m:mode});if(hist.length>40)hist.shift();
   ans=r;out.textContent='= '+shown;out.className='cout ok';fresh=true;inp.value='';showView('');renderTrace();save();
  }catch(e){
   out.textContent=(e&&e.message)||'Erreur';out.className='cout err';
  }
 }
 function renderTrace(){
  trace.innerHTML='';
  if(!hist.length){var li=document.createElement('li');li.className='empty';li.textContent='Les calculs que tu valides avec « = » s’affichent ici. Clique sur un calcul pour le reprendre.';trace.appendChild(li);return}
  hist.forEach(function(h,i){
   var li=document.createElement('li');
   var a=document.createElement('button');a.type='button';a.className='te';a.dataset.i=i;a.dataset.w='e';var vv=view(h.e);if(vv&&(vv.frac||vv.pow))a.innerHTML=vv.h;else a.textContent=h.e;a.setAttribute('aria-label','Reprendre le calcul '+h.e);
   var b=document.createElement('button');b.type='button';b.className='tr';b.dataset.i=i;b.dataset.w='r';b.textContent='= '+(h.s||h.r);b.setAttribute('aria-label','Reprendre le résultat '+(h.s||h.r));
   li.appendChild(a);li.appendChild(b);trace.appendChild(li)});
  var box=trace.parentElement;box.scrollTop=box.scrollHeight;
 }
 function init(){if(document.getElementById('calcBtn'))return;build()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(typeof window!=='undefined'?window:globalThis);
