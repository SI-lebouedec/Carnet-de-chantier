const $=id=>document.getElementById(id);
const B=document.body, HTML=document.documentElement;
const fr=(n,d)=>n.toFixed(d).replace('.',',');
const store=(k,v)=>{try{localStorage.setItem('ac7-'+k,v)}catch(e){}};
const load=k=>{try{return localStorage.getItem('ac7-'+k)}catch(e){return null}};
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),3200)}


/* ============ INITIALISATION DE LA PAGE ============ */
const MAIN0=document.getElementById('main');
const PAGE_KEY=MAIN0.dataset.page||'index';
const PAGE_SEQ=MAIN0.dataset.seq===undefined?-1:+MAIN0.dataset.seq;
const PAGE_THEME=MAIN0.dataset.theme||'thermique';
document.body.insertAdjacentHTML('afterbegin',`<div class="bar" id="bar"></div>
<div class="toast" id="toast" role="status"></div>

<!-- defs partagés -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
 <defs>
  <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
   <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/>
   <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.55" result="m"/>
   <feComposite in="SourceGraphic" in2="m" operator="in"/>
  </filter>
  <pattern id="hPierre" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line y2="14" stroke="#2B2D31" stroke-width="1.2"/><line x1="7" x2="7" y2="14" stroke="#2B2D31" stroke-width=".6"/></pattern>
  <pattern id="hLaine" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 Q5 0 10 10 T20 10 T30 10 T40 10" fill="none" stroke="#2B2D31" stroke-width="1.1"/></pattern>
  <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2B2D31"/></marker>
 </defs>
</svg>

<!-- fonds -->
<div class="bgfx" aria-hidden="true">
 <div class="lavis"></div>
 <div class="grid"></div>
 <svg class="pl pl-plan" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
  <rect class="thick" x="200" y="130" width="820" height="520"/>
  <rect x="212" y="142" width="796" height="496"/>
  <path d="M560 142V400M212 400H470M640 400H1008M780 400V638M560 270H1008"/>
  <rect class="cut" x="470" y="396" width="170" height="8"/>
  <path d="M470 400A74 74 0 0 1 544 326M640 400A74 74 0 0 0 566 326"/>
  <rect class="cut" x="330" y="124" width="130" height="24"/><path d="M330 130H460M330 142H460"/>
  <rect class="cut" x="700" y="124" width="150" height="24"/><path d="M700 130H850M700 142H850"/>
  <rect class="cut" x="194" y="470" width="24" height="110"/><path d="M200 470V580M212 470V580"/>
  <rect class="cut" x="1002" y="180" width="24" height="120"/><path d="M1008 180V300M1020 180V300"/>
  <path d="M780 500A62 62 0 0 0 718 438" />
  <path class="net" d="M232 380H430M232 380V250M232 250H330M600 300H930M930 300V380M780 420V600"/>
  <rect x="330" y="244" width="70" height="12"/><rect x="600" y="294" width="90" height="12"/><rect x="226" y="520" width="12" height="60"/>
  <path d="M200 700H1020M200 690V710M1020 690V710M168 130V650M158 130H178M158 650H178"/>
  <text x="560" y="722" text-anchor="middle">8,20 m</text><text x="122" y="400" transform="rotate(-90 122 400)" text-anchor="middle">5,20 m</text>
  <text x="330" y="225">SÉJOUR</text><text x="330" y="250" style="font-size:14px">28,4 m²</text>
  <text x="640" y="205">CUISINE</text><text x="800" y="480">CHAMBRE 1</text><text x="260" y="520">CHAMBRE 2</text><text x="610" y="330">SDB</text>
  <circle cx="1100" cy="190" r="30"/><path d="M1100 160V220M1100 160l-9 16M1100 160l9 16"/><text x="1092" y="152" style="font-size:16px">N</text>
  <rect x="820" y="690" width="310" height="80"/><path d="M820 720H1130"/><text x="834" y="712" style="font-size:16px">PLAN DU REZ-DE-CHAUSSÉE</text><text x="834" y="752" style="font-size:14px">ÉCH. 1/50 · PLANCHE 02</text>
 </svg>
 <svg class="pl pl-coupe" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
  <path class="thick" d="M60 560H1140"/><path d="M60 580H1140M80 600L120 580M160 600L200 580M240 600L280 580M320 600L360 580M400 600L440 580M480 600L520 580M560 600L600 580M640 600L680 580M720 600L760 580M800 600L840 580M880 600L920 580M960 600L1000 580M1040 600L1080 580"/>
  <rect x="240" y="170" width="26" height="390"/><rect x="266" y="170" width="70" height="390"/><rect x="336" y="170" width="26" height="390"/>
  <rect x="840" y="170" width="26" height="390"/><rect x="866" y="170" width="70" height="390"/><rect x="936" y="170" width="26" height="390"/>
  <path d="M240 400H962M240 396H962"/>
  <path class="thick" d="M200 170L600 40L1000 170"/><path d="M230 170L600 52L970 170"/>
  <path d="M600 40V170M420 100V170M780 100V170"/>
  <path d="M380 560V620M820 560V620M380 620H300M820 620H900"/>
  <path d="M120 170V560M110 170H130M110 560H130M110 400H130"/><text x="50" y="360" transform="rotate(-90 50 360)">H = 2,50 m</text>
  <path d="M240 140H962M240 130V150M962 130V150"/><text x="540" y="128">9,80 m</text>
  <circle cx="1090" cy="90" r="30"/><path class="net" d="M1040 130L760 240M1070 140L800 280"/>
  <text x="560" y="520">PLANCHER BAS</text><text x="560" y="372">PLANCHER HAUT</text><text x="420" y="720">COUPE A-A · ÉCH. 1/50</text>
 </svg>
 <svg class="pl pl-masse" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
  <path class="thick" d="M140 160L1060 120L1100 660L180 700Z" style="stroke-dasharray:22 10"/>
  <rect x="400" y="320" width="400" height="190"/><rect x="412" y="332" width="376" height="166"/><path d="M412 332L788 498M788 332L412 498" style="opacity:.5"/>
  <path d="M0 740H1200M0 770H1200"/><path d="M0 755H1200" style="stroke-dasharray:30 20"/>
  <circle cx="260" cy="260" r="40"/><circle cx="260" cy="260" r="4"/><circle cx="330" cy="560" r="55"/><circle cx="330" cy="560" r="4"/><circle cx="950" cy="300" r="46"/><circle cx="950" cy="300" r="4"/><circle cx="930" cy="590" r="36"/>
  <path class="net" d="M1100 200C900 80 500 80 300 330"/><circle cx="1100" cy="200" r="22"/>
  <circle cx="1100" cy="330" r="30"/><path d="M1100 300V360M1100 300l-9 16M1100 300l9 16"/><text x="1092" y="290" style="font-size:16px">N</text>
  <path d="M140 140H340M140 130V150M340 130V150"/><text x="150" y="126">10 m</text>
  <text x="440" y="420">BÂTIMENT · EMPRISE 12 × 6 m</text><text x="150" y="700" style="font-size:14px">PLAN DE MASSE · ÉCH. 1/200</text>
 </svg>
</div>

<!-- barre du haut -->
<div class="top"><div class="in">
 <button class="btn burger" id="burger" aria-label="Ouvrir la liste des séquences">☰ Mes séquences</button>
 <a class="logo" href="index.html"><span class="tile">AC</span><span><b>Carnet de chantier</b><small>Terminale STI2D · Architecture &amp; Construction</small></span></a>
 <span class="sp"></span>
 <a class="btn" href="index.html">Accueil</a>
</div></div>
<div class="thin"><span id="thinT"></span><i><b id="thinB"></b></i></div>
<div class="tabsTop"><div class="in" id="tabsTop"></div></div>

<!-- bandeau -->
<header class="hero">
 <div class="ph" role="img" aria-label="Photo illustrant la thématique"></div>
 <div class="tx">
  <span class="eyebrow" id="eyebrow"></span>
  <h1 id="h1"></h1>
  <p class="lede" id="lede"></p>
 </div>
</header>

<div class="scrim" id="scrim"></div>
<div class="layout">

 <!-- arborescence des séquences -->
 <nav class="navL" id="navL" aria-label="Séquences du carnet">
  <div class="navtop"><p class="navhead">Mes séquences</p><button class="navtog" id="tgL" aria-label="Replier en pastilles" title="Replier en pastilles">‹</button></div>
  <ul class="tree" id="tree"></ul>
 </nav>

 <main class="main" id="main-slot"></main>

</div>

<footer>Carnet de chantier · AC Terminale STI2D · Photos : voir les crédits en bas de page de chaque séquence.</footer>

<!-- Atelier -->
<button class="btn pri fab" id="fab">✎ Atelier de la charte</button>
<aside class="atelier" id="atelier" aria-label="Atelier de la charte">
 <header><h3>Atelier de la charte</h3><p>Chaque réglage change la page en direct. « Ma proposition » = ce que je te recommande ; tout est modifiable.</p><button class="x" id="ax" aria-label="Fermer">×</button></header>
 <div class="atabs" id="atabs"></div>
 <div id="apanes" style="display:contents"></div>
 <div class="afoot"><button class="btn" id="copy">Copier ma sélection</button><button class="btn" id="reset">Revenir à ma proposition</button><textarea id="ta" readonly></textarea></div>
</aside>
`);
document.getElementById('main-slot').replaceWith(MAIN0);
document.body.classList.add('fb-lexend','ft-hand','dys-off','bt-doux','bl-lavis','dx-rond','dm-clic','lt-montante','fm-annotee','bi-discret','nl-tree','nr-left','bg-plan','bn-photo','sp-hand','mo-full');
$('eyebrow').textContent=MAIN0.dataset.eyebrow||'';
$('h1').textContent=MAIN0.dataset.title||document.title;
$('lede').textContent=MAIN0.dataset.lede||'';
$('thinT').textContent=MAIN0.dataset.title||'';
if(!MAIN0.dataset.lede)$('lede').remove();
/* ---------- thématiques ---------- */
const THEMES=[
 {v:'thermique',t:'Thermique',d:'Abricot. Chaleur, isolation, énergie du bâtiment.',eb:'Séquence 2 · Thermique du bâtiment',p:'hero-s2.jpg'},
 {v:'acoustique',t:'Acoustique',d:'Menthe canard. Bruit, réverbération, isolation phonique.',eb:'Séquence 4 · Acoustique du bâtiment',p:'hero-s4.jpg'},
 {v:'mecanique',t:'Mécanique',d:'Ciel. Structures, charges, RDM.',eb:'Séquence 3 · Mécanique des structures',p:'hero-s3.jpg'},
 {v:'lumiere',t:'Lumière et confort',d:'Citron. Éclairage naturel, confort visuel.',eb:'Séquence 4 · Confort et lumière',p:'hero-s1.jpg'},
 {v:'energie',t:'Énergie',d:'Pastèque. Production, solaire, bilan carbone.',eb:'Séquence 9 · Énergie et environnement',p:'hero-s9.jpg'},
 {v:'s0',t:'Séquence 0',d:'',eb:'',p:'hero-s0.jpg'},
 {v:'s1',t:'Séquence 1',d:'',eb:'',p:'hero-s1.jpg'},
 {v:'s2',t:'Séquence 2',d:'',eb:'',p:'hero-s2.jpg'},
 {v:'s3',t:'Séquence 3',d:'',eb:'',p:'hero-s3.jpg'},
 {v:'s4',t:'Séquence 4',d:'',eb:'',p:'hero-s4.jpg'},
 {v:'s5',t:'Séquence 5',d:'',eb:'',p:'hero-s5.jpg'},
 {v:'s6',t:'Séquence 6',d:'',eb:'',p:'hero-s6.jpg'},
 {v:'s7',t:'Séquence 7',d:'',eb:'',p:'hero-s7.jpg'},
 {v:'s8',t:'Séquence 8',d:'',eb:'',p:'hero-s8.jpg'},
 {v:'s9',t:'Séquence 9',d:'',eb:'',p:'hero-s9.jpg'}
];
function setTheme(v){
 const t=THEMES.find(x=>x.v===v)||THEMES[0];
 HTML.setAttribute('data-theme',t.v);
 HTML.style.setProperty('--photo',`url('img/${HTML.dataset.photo==='home'?'hero-s8.jpg':t.p}')`);
}


/* crédits des photos de bandeau (Wikimedia Commons) */
const CRED={
 s0:['Seattle Municipal Archives','CC BY 2.0','Seattle_City_Light_engineer,_circa_1980_(48001331621).jpg'],
 s1:['Michal Stránský','CC BY-SA 4.0','Pasivni_dum_ze_sadu.jpg'],
 s2:['Tlue04','CC BY-SA 4.0','Nutzung_von_Abwärme_für_weitere_Technische_Prozesse.jpg'],
 s3:['MHM55','CC BY-SA 3.0','20100524-PontsIle-1.jpg'],
 s4:['Mihaelawojcik','CC BY 4.0','RF_Fully_Anechoic_Room_2.jpg'],
 s5:['Adamantios','CC BY-SA 3.0','Crane-orange-and-birds-0a.jpg'],
 s6:['Western Arctic National Parklands','CC BY 2.0','Archeologists_Hard_at_Work_(8516167281).jpg'],
 s7:['Jnn','CC BY 2.1 jp','Efflorescence0663253.JPG'],
 s8:['Dakota Roos','CC0','Dakota_Roos_2014-10-03_(Unsplash).jpg'],
 s9:['Justin Bere','CC BY-SA 4.0','Bere-architects_mayville-community-centre.jpg']};
CRED.thermique=CRED.s2;CRED.acoustique=CRED.s4;CRED.mecanique=CRED.s3;CRED.lumiere=CRED.s1;CRED.energie=CRED.s9;CRED.home=CRED.s8;
(function(){const k=document.documentElement.dataset.photo||document.documentElement.dataset.theme,c=CRED[k],h=document.querySelector('.hero');
 if(c&&h&&!h.querySelector('.ph-credit')){const a=document.createElement('div');a.className='ph-credit';
  a.innerHTML='Photo : '+c[0]+', '+c[1]+', <a href="https://commons.wikimedia.org/wiki/File:'+c[2]+'" target="_blank" rel="noopener">Wikimedia Commons</a>';h.appendChild(a)}})();

/* ---------- réglages ---------- */
const GROUPS=[
 {tab:'Identité',id:'th',title:'Thématique : couleur et photo',help:'Une dominante vive par thématique, mise en page identique. C\'est la base de « charte qui s\'ajuste ».',special:'theme',rec:'thermique',
  opts:THEMES.map(t=>({v:t.v,t:t.t,d:t.d}))},
 {tab:'Identité',id:'fb',title:'Police du texte courant',help:'Tous ces choix sont lisibles pour des élèves dyslexiques.',rec:'lexend',
  opts:[
   {v:'lexend',t:'Lexend (design system)',d:'Conçue pour la lecture fluide : lettres bien espacées, très lisible sur téléphone. Un peu plus large que Calibri.'},
   {v:'carlito',t:'Carlito = Calibri (tes séquences actuelles)',d:'Cohérent avec tes cours et tes documents imprimés. Plus compacte : plus de texte à l\'écran.'},
   {v:'atk',t:'Atkinson Hyperlegible',d:'Créée pour les malvoyants : chaque lettre se distingue nettement (I, l, 1 ; O, 0). Neutre et très sobre.'}]},
 {tab:'Identité',id:'ft',title:'Titres',help:'Tu as choisi le manuscrit.',rec:'hand',
  opts:[
   {v:'hand',t:'Manuscrit (Caveat)',d:'Chaleureux, signature visuelle forte, loin de l\'« IA ». À réserver aux titres courts.'},
   {v:'mix',t:'Mixte : manuscrit pour le titre, étiquettes condensées pour les parties',d:'Le titre de page reste manuscrit ; les titres de parties passent en capitales condensées, façon planche de plans. Plus technique.'},
   {v:'sobre',t:'Sobre : même police que le texte, en gras',d:'Le plus neutre. Convient si tu trouves le manuscrit fatigant sur de longues pages.'}]},
 {tab:'Identité',id:'dys',title:'Confort de lecture (dyslexie)',help:'Espaces entre lettres, mots et lignes agrandis. Pourrait devenir un bouton pour l\'élève.',rec:'off',
  opts:[{v:'off',t:'Normal',d:'Réglages de base.'},{v:'on',t:'Confort renforcé',d:'Interlettrage +3,5 %, interligne 1,95. L\'élève pourrait l\'activer lui-même.'}]},
 {tab:'Identité',id:'bt',title:'Boutons',help:'Plus arrondi, ombre discrète.',rec:'doux',
  opts:[
   {v:'doux',t:'Arrondi doux (design system)',d:'Angles 12 px, petite ombre floue. Se soulève au survol, s\'enfonce au clic.'},
   {v:'sticker',t:'Autocollant',d:'Angles presque droits, ombre décalée nette. Plus « planche de dessin », plus graphique.'},
   {v:'pastille',t:'Pastille',d:'Totalement arrondi, sans bordure ni ombre, fond teinté. Très léger, idéal sur mobile.'}]},

 {tab:'Blocs',id:'bl',title:'Blocs « bulles » (définitions, méthode, piège, à retenir)',help:'Trois façons de dessiner les bulles.',rec:'lavis',
  opts:[
   {v:'lavis',t:'Bulle lavis',d:'Grand arrondi, fond dégradé de la couleur du thème, titre manuscrit posé sur le contour. Doux et vivant.'},
   {v:'bd',t:'Bulle de bande dessinée',d:'Contour anthracite épais avec une petite queue. Donne l\'impression que « le cours te parle ».'},
   {v:'etiq',t:'Bulle étiquette (croquis de chantier)',d:'Bord en pointillé et étiquette condensée légèrement penchée, comme sur tes croquis de chantier.'}]},
 {tab:'Blocs',id:'dx',title:'Le tampon (vrai ou faux)',help:'Le tampon est vert « VRAI ! » ou rouge « FAUX ! » selon la réponse.',rec:'rond',
  opts:[
   {v:'rond',t:'Tampon rond encré',d:'Double bordure, légèrement penché, texture d\'encre irrégulière.'},
   {v:'rect',t:'Tampon rectangulaire',d:'Double cadre façon tampon de bureau. Plus lisible, moins décoratif.'},
   {v:'bande',t:'Bande diagonale',d:'Bandeau en travers du coin de la carte, comme un « ANNULÉ ».'}]},
 {tab:'Blocs',id:'dm',title:'Vrai ou faux : comment ça se joue',help:'Essaie les trois idées reçues en haut de la page.',rec:'clic',
  opts:[
   {v:'clic',t:'Je réponds d\'abord (interactif)',d:'L\'élève choisit Vrai ou Faux, le tampon s\'abat avec la bonne réponse, puis l\'explication apparaît. Un « Je ne sais pas » est possible, et « Rejouer » est toujours là.'},
   {v:'auto',t:'Réponse visible tout de suite',d:'Le tampon tombe tout seul et l\'explication est lisible. Pour une lecture rapide ou un cours projeté.'}]},
 {tab:'Blocs',id:'lt',title:'Lettrine',help:'Plus petite et montante, sans recouvrir le texte.',rec:'montante',
  opts:[{v:'montante',t:'Lettrine montante',d:'Grande initiale manuscrite en couleur de thème, posée sur la première ligne.'},{v:'aucune',t:'Aucune',d:'Texte courant sans effet.'}]},

 {tab:'Formules',id:'fm',title:'Présentation des formules',help:'L\'encadré annoté du design system, ou deux alternatives.',rec:'annotee',
  opts:[
   {v:'annotee',t:'Encadré annoté',d:'Formule au centre, une bulle par grandeur avec flèche, nom, « se lit… » pour les lettres grecques, unité en pastille. Sur mobile : version empilée.'},
   {v:'compacte',t:'Compacte',d:'Formule sur une ligne + pastilles. Pour les rappels, les tableaux, les cartes à retenir.'},
   {v:'redaction',t:'Rédaction pas à pas',d:'Les 5 étapes que tu exiges : cherché, formule, formule isolée, application numérique, résultat et conclusion.'}]},

 {tab:'Navigation',id:'nl',title:'Arborescence des séquences (à gauche)',help:'Le bouton rond en haut de l\'arborescence la replie en pastilles (0 à 9) ou la déplie. Le choix de l\'élève est mémorisé.',rec:'tree',
  opts:[
   {v:'tree',t:'Arborescence dépliée',d:'Toutes les séquences et les ressources, la séquence en cours dépliée avec ses pages.'},
   {v:'mini',t:'Pastilles seulement',d:'Les pastilles 0 à 9 et les ressources ; le nom apparaît au survol. Un clic sur une pastille redéplie.'},
   {v:'drawer',t:'Tiroir sur bouton',d:'Rien à gauche tant qu\'on n\'ouvre pas « Mes séquences ».'}]},
 {tab:'Navigation',id:'nr',title:'Sommaire de la page',help:'Où s\'affiche la liste des parties de la page. Par défaut : dans le menu de gauche, sous la page ouverte, avec la pastille qui émet un halo de la couleur de la séquence.',rec:'left',
  opts:[
   {v:'left',t:'Dans le menu de gauche (animé)',d:'Sous la séquence (ou la page) ouverte : une pastille par partie, une ligne qui se remplit en lisant, la pastille de la partie en cours émet un halo de la couleur de la séquence.'},
   {v:'top',t:'Onglets en haut',d:'Bandeau d\'onglets collé sous l\'en-tête (en plus du menu).'}]},

 {tab:'Fonds',id:'bg',title:'Fond de page',help:'Les plans se dessinent une fois (bien visibles), puis s\'effacent derrière le texte. Ils sont plus marqués sur les côtés que derrière la colonne de lecture.',rec:'plan',
  opts:[
   {v:'plan',t:'Plan de niveau',d:'Plan de rez-de-chaussée coté, avec le réseau de la thématique en couleur (ici : eau chaude).'},
   {v:'coupe',t:'Coupe de bâtiment',d:'Coupe sur terrain, fondations, plancher et charpente.'},
   {v:'masse',t:'Plan de masse',d:'Parcelle, emprise, arbres, nord, tracé du soleil.'},
   {v:'lavis',t:'Lavis aquarelle seul',d:'Taches de couleur très douces qui glissent quand on défile. Aucun dessin.'},
   {v:'grille',t:'Quadrillage',d:'Petit quadrillage de papier millimétré, comme tes séquences actuelles.'},
   {v:'papier',t:'Papier uni',d:'Rien derrière le texte : maximum de calme.'}]},
 {tab:'Fonds',id:'bi',title:'Intensité du fond',help:'Tu voulais qu\'il perturbe moins la lecture.',rec:'discret',
  opts:[
   {v:'discret',t:'Discret (nouveau réglage)',d:'Presque invisible derrière le texte, apparent sur les côtés. Le dessin initial reste bien visible quelques secondes.'},
   {v:'normal',t:'Normal',d:'Deux fois plus marqué.'},
   {v:'marque',t:'Marqué',d:'Le plan se voit nettement, même derrière le texte (déconseillé pour lire longtemps).'}]},
 {tab:'Fonds',id:'bn',title:'Bandeau de début de page',help:'Photo réelle de la thématique (à remplacer par des images libres de droits créditées).',rec:'photo',
  opts:[
   {v:'photo',t:'Photo, voile couleur, fondu',d:'La photo se teinte de la couleur du thème et se fond dans le papier. Titre posé en bas.'},
   {v:'equerre',t:'Photo en équerre',d:'Photo aux coins coupés, titre sur une carte posée dessus avec ombre décalée. Style planche technique.'},
   {v:'cinema',t:'Plein cadre',d:'Photo sombre, titre blanc sur la photo. Plus spectaculaire, plus « magazine ».'},
   {v:'aplat',t:'Sans photo',d:'Dégradé de la couleur du thème sur un quadrillage. Léger et rapide à charger.'}]},
 {tab:'Fonds',id:'sp',title:'Séparateurs',help:'Tu as choisi « très manuscrit ».',rec:'hand',
  opts:[
   {v:'hand',t:'Trait manuscrit',d:'Un trait de feutre à la couleur du thème.'},
   {v:'brush',t:'Coup de pinceau',d:'Trait fin doublé d\'une trace de pinceau.'},
   {v:'cote',t:'Ligne de cote',d:'Cote d\'architecte avec flèches aux extrémités et le mot « suite ».'},
   {v:'double',t:'Double trait',d:'Deux traits de couleurs voisines.'},
   {v:'pencil',t:'Crayon',d:'Trait de crayon doublé, avec une pointe de flèche.'}]},

 {tab:'Mouvement',id:'mo',title:'Animations',help:'Tu les trouvais trop discrètes : le niveau « Vivant » est maintenant nettement plus marqué. Le système respecte les réglages « réduire les animations » de l\'élève.',rec:'full',
  opts:[
   {v:'full',t:'Vivant (renforcé)',d:'Les blocs montent et se révèlent l\'un après l\'autre, le titre entre en scène, la photo respire, les bulles de formule sautent une à une, le tampon s\'abat avec un petit tremblement, le plan se dessine, tout se soulève au survol.'},
   {v:'sobre',t:'Sobre',d:'Seulement des fondus à l\'apparition des blocs.'},
   {v:'off',t:'Aucune',d:'Tout est fixe. Utile pour tester le rendu ou pour les élèves sensibles au mouvement.'}]}
];
const state={};
function applyOpt(g,v){
 const prevNr=state.nr;
 state[g.id]=v;
 if(g.special==='theme'){setTheme(v)}
 else{
  const p=g.id+'-';
  B.className=B.className.split(/\s+/).filter(c=>c&&!c.startsWith(p)).concat(p+v).join(' ');
 }
 document.querySelectorAll(`.card[data-g="${g.id}"]`).forEach(c=>c.classList.toggle('on',c.dataset.v===v));
 if(g.id==='bg'||g.id==='mo')redraw();
 if(g.id==='nl'||g.id==='nr')syncTog();
}
(function buildAtelier(){
 const tabs=[...new Set(GROUPS.map(g=>g.tab))];
 const atabs=$('atabs'),panes=$('apanes');
 tabs.forEach((t,i)=>{
  const b=document.createElement('button');b.textContent=t;b.className=i?'':'on';b.dataset.t=t;atabs.appendChild(b);
  const p=document.createElement('div');p.className='apane'+(i?'':' on');p.dataset.t=t;panes.appendChild(p);
  b.onclick=()=>{atabs.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));panes.querySelectorAll('.apane').forEach(x=>x.classList.toggle('on',x.dataset.t===t))};
 });
 GROUPS.forEach(g=>{
  const pane=panes.querySelector(`.apane[data-t="${g.tab}"]`);
  const d=document.createElement('div');d.className='grp';
  d.innerHTML=`<h4>${g.title}</h4>${g.help?`<p class="help">${g.help}</p>`:''}`;
  g.opts.forEach(o=>{
   const c=document.createElement('button');c.className='card';c.dataset.g=g.id;c.dataset.v=o.v;
   c.innerHTML=`${o.v===g.rec?'<em>Ma proposition</em>':''}<b>${o.t}</b><span>${o.d}</span>`;
   c.onclick=()=>{applyOpt(g,o.v);if(!g.special)store('o-'+g.id,o.v)};d.appendChild(c);
  });
  pane.appendChild(d);
 });
 GROUPS.forEach(g=>{
  const sv=g.special?PAGE_THEME:load('o-'+g.id);
  applyOpt(g,sv&&g.opts.some(o=>o.v===sv)?sv:g.rec);
 });
 $('reset').onclick=()=>GROUPS.forEach(g=>{if(!g.special)store('o-'+g.id,'');applyOpt(g,g.special?PAGE_THEME:g.rec)});
 $('copy').onclick=async()=>{
  const txt='Charte v7.1 — ma sélection :\n'+GROUPS.map(g=>'- '+g.title+' : '+g.opts.find(o=>o.v===state[g.id]).t).join('\n');
  const ta=$('ta');ta.value=txt;
  try{await navigator.clipboard.writeText(txt);$('copy').textContent='Copié ✓';setTimeout(()=>$('copy').textContent='Copier ma sélection',1800)}
  catch(e){ta.style.display='block';ta.select()}
 };
})();
function openAt(o){$('atelier').classList.toggle('open',o);$('fab').style.display=o?'none':''}
$('fab').onclick=()=>openAt(true);$('ax').onclick=()=>openAt(false);
addEventListener('keydown',e=>{if(e.key==='Escape'){openAt(false);closeNav()}});


/* l'Atelier de la charte n'apparaît que sur demande : ajouter ?atelier à l'adresse */
try{if(/[?&]atelier/.test(location.search))localStorage.setItem('ac7-atelier','1');if(/[?&]noatelier/.test(location.search))localStorage.removeItem('ac7-atelier')}catch(e){}
if(load('atelier')!=='1')$('fab').style.display='none';
/* ---------- fonds dessinés ---------- */
document.querySelectorAll('svg.pl').forEach(s=>s.querySelectorAll('path,line,rect,circle').forEach(e=>e.setAttribute('pathLength','1')));
function redraw(){
 const svgs=document.querySelectorAll('svg.pl');
 svgs.forEach(s=>s.classList.remove('drawn'));
 void document.body.offsetWidth;
 svgs.forEach(s=>s.classList.add('drawn'));
}
document.querySelectorAll('.fsvg>*').forEach((e,i)=>e.style.setProperty('--i',i));
document.querySelectorAll('.step').forEach(e=>{const p=e.parentElement;e.style.setProperty('--i',[...p.children].filter(c=>c.classList.contains('step')).indexOf(e))});


/* ---------- arborescence : séquences + ressources, générée depuis data.js ---------- */
const GL=GROUPS.find(g=>g.id==='nl'),GR=GROUPS.find(g=>g.id==='nr');
const tree=$('tree');
const hrefOf=s=>s.ready?s.href:s.legacy;
function seqLi(s){
 const li=document.createElement('li');
 const cur=PAGE_SEQ===s.n;
 li.className='seq seqn'+(cur?' open cur':'');
 const dot=`style="--dot:${SITE.dots[s.theme]}"`;
 if(s.ready){
  li.innerHTML=`<div class="srow"><a class="sl" href="${s.href}" data-tip="${s.n} · ${s.t}" ${dot}><span class="n">${s.n}</span><span class="t">${s.t}</span></a><button class="chv" type="button" aria-label="Déplier ou replier : ${s.t}" aria-expanded="${cur}"><span class="chev">›</span></button></div><div class="pages">${(s.sub||SITE.sub).map(([t,h])=>`<a href="${s.href}${h}">${t}</a>`).join('')}</div>`;
  const cb=li.querySelector('.chv');
  cb.onclick=()=>{const o=li.classList.toggle('open');cb.setAttribute('aria-expanded',o)};
 }else{
  li.innerHTML=`<div class="srow"><a class="sl" href="${s.legacy}" data-tip="${s.n} · ${s.t} (ancienne mise en page)" ${dot}><span class="n">${s.n}</span><span class="t">${s.t}</span></a></div>`;
 }
 return li;
}
function resLi(r){
 const li=document.createElement('li');
 const cur=PAGE_KEY===r.key||(r.sub&&PAGE_KEY.startsWith(r.key));
 li.className='seq seqn res'+(cur?' cur':'')+(cur&&r.sub?' open':'');
 const href=r.ready?r.href:r.legacy;
 const sub=r.sub?`<div class="pages"><div class="subp">${r.sub.map(([t,h])=>h?`<a href="${h}" class="${location.pathname.endsWith(h)?'on':''}">${t}</a>`:`<span class="off">${t}</span>`).join('')}</div></div>`:'';
 li.innerHTML=`<div class="srow"><a class="sl" href="${href}" data-tip="${r.t}"><span class="n sq">${r.sym}</span><span class="t">${r.t}</span></a>${r.sub?`<button class="chv" type="button" aria-label="Déplier ou replier : ${r.t}" aria-expanded="${cur}"><span class="chev">›</span></button>`:''}</div>${sub}`;
 const cb=li.querySelector('.chv');
 if(cb)cb.onclick=()=>{const o=li.classList.toggle('open');cb.setAttribute('aria-expanded',o)};
 return li;
}
(function(){
 const hub=document.createElement('li');hub.className='seq hub'+(PAGE_KEY==='index'?' cur':'');
 hub.innerHTML=`<div class="srow"><a class="sl" href="index.html" data-tip="Carnet de chantier"><span class="n sq">⌂</span><span class="t">Carnet de chantier · accueil</span></a></div>`;
 tree.appendChild(hub);
 SITE.seqs.forEach(s=>tree.appendChild(seqLi(s)));
 SITE.res.forEach(r=>tree.appendChild(resLi(r)));
})();

/* ---------- sommaire de la page (rail) ---------- */
let secs=[];
const WIDE=matchMedia('(min-width:1181px)');
function railInTree(){return true}   /* le sommaire de la page vit toujours dans l'arborescence de gauche */
function buildRail(){
 secs=[...document.querySelectorAll('#main section[data-rail],#main .famille[data-rail]')].filter(s=>!s.hidden);
 $('tabsTop').innerHTML='';
 const old=document.getElementById('rail');if(old)old.remove();
 const ul=document.createElement('ul');ul.className='rail'+(secs.length>8&&secs.every(s=>s.dataset.rail.length<=3)?' many':'');ul.id='rail';
 secs.forEach(s=>{
  const li=document.createElement('li');if(s.matches('.famille'))li.className='sub';li.innerHTML=`<a href="#${s.id}" data-id="${s.id}" title="${s.dataset.rail}">${s.dataset.rail}</a>`;ul.appendChild(li);
  const a=document.createElement('a');a.href='#'+s.id;a.dataset.id=s.id;a.innerHTML=s.dataset.rail.replace(/[α-ωΑ-Ω]+/g,'<span class="lc">$&</span>');$('tabsTop').appendChild(a);
 });
 /* grand écran : le sommaire s'installe dans la colonne de droite ; sinon, dans l'arborescence, sous l'entrée de la page ouverte */
 const li=tree.querySelector('li.seq.cur');
 if(!railInTree()){$('railHost').innerHTML='';if(secs.length)$('railHost').appendChild(ul)}
 else if(li&&secs.length){
  let pg=li.querySelector(':scope > .pages');
  if(!pg){pg=document.createElement('div');pg.className='pages';li.appendChild(pg)}
  if(li.classList.contains('seqn')&&!li.classList.contains('res')&&!li.classList.contains('hub'))pg.querySelectorAll(':scope > a').forEach(a=>a.remove());
  pg.classList.add('toc');pg.appendChild(ul);li.classList.add('open');
  const cb=li.querySelector('.chv');if(cb)cb.setAttribute('aria-expanded','true');
  /* au chargement : la page ouverte est remontée en haut de l'arborescence */
  if(!buildRail.done){buildRail.done=1;const tb=tree.getBoundingClientRect().top;tree.scrollTop=Math.max(0,li.getBoundingClientRect().top-tb-6)}
 }
 track();
}
/* ---------- repli des deux arborescences ---------- */
function syncTog(){
 const l=$('tgL'),r=$('tgR');if(!l)return;
 const lm=state.nl==='mini',rd=state.nr==='dots';
 l.textContent=lm?'›':'‹';
 l.title=lm?'Déplier les séquences':'Replier en pastilles';
 if(r){r.textContent=rd?'‹':'›';r.title=rd?'Afficher les titres des parties':'Replier en points';r.setAttribute('aria-label',r.title)}
 document.querySelectorAll('#navL .seq a.sl').forEach(b=>lm?b.setAttribute('title',b.dataset.tip):b.removeAttribute('title'));l.setAttribute('aria-label',l.title);
}
$('tgL').onclick=()=>{const v=state.nl==='mini'?'tree':'mini';applyOpt(GL,v);store('o-nl',v)};
syncTog();

/* ---------- suivi de lecture ---------- */
let lastOn=-1;
function track(){
 const y=innerHeight*.32;let ci=0;
 secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<=y)ci=i});
 const links=[...document.querySelectorAll('#rail a')];
 document.querySelectorAll('#rail a,#tabsTop a').forEach(a=>{
  const i=secs.findIndex(s=>s.id===a.dataset.id);
  a.classList.toggle('on',i===ci);a.classList.toggle('vu',i<ci);
 });
 /* la ligne se remplit jusqu'à la pastille en cours, puis avance vers la suivante selon la lecture */
 const rail=document.getElementById('rail');
 if(rail&&links.length&&secs.length){
  const pos=i=>{const a=links[i];return a.parentElement.offsetTop+a.offsetTop+a.offsetHeight/2};
  let t=0;if(ci<secs.length-1){const t0=secs[ci].getBoundingClientRect().top-y,t1=secs[ci+1].getBoundingClientRect().top-y;t=Math.max(0,Math.min(1,-t0/((t1-t0)||1)))}
  else{const r=HTML.scrollTop/(HTML.scrollHeight-HTML.clientHeight||1);t=Math.max(0,(r-.97)/.03)}
  const p0=pos(ci),p1=ci<secs.length-1?pos(ci+1):p0+10;
  rail.style.setProperty('--fill',(p0+t*(p1-p0)).toFixed(1)+'px');
  if(ci!==lastOn){lastOn=ci;
   const box=rail.closest('#tree')?tree:null,a=links[ci];
   if(box&&a&&box.scrollHeight>box.clientHeight){const r=a.getBoundingClientRect(),b=box.getBoundingClientRect();
    if(r.top<b.top+40)box.scrollTop-=b.top+40-r.top;else if(r.bottom>b.bottom-40)box.scrollTop+=r.bottom-b.bottom+40}}
 }
 const h=HTML,p=h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100;
 $('bar').style.width=p+'%';$('thinB').style.width=p+'%';HTML.style.setProperty('--sx',(p/100).toFixed(3));
}
addEventListener('scroll',track,{passive:true});addEventListener('resize',track);

/* ---------- apparition ---------- */
document.querySelectorAll('.sec.rv').forEach(s=>[...s.children].forEach((c,i)=>c.style.transitionDelay=Math.min(i*70,280)+'ms'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vu')}),{threshold:.04,rootMargin:'0px 0px -12% 0px'});
document.querySelectorAll('.sec.rv,.pn').forEach(e=>io.observe(e));
const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('reveal-on')}),{threshold:.5});
document.querySelectorAll('.debunk').forEach(e=>io2.observe(e));

/* ---------- tiroir séquences ---------- */
function closeNav(){$('navL').classList.remove('open');$('scrim').classList.remove('on');document.documentElement.classList.remove('nl-lock')}
$('burger').onclick=()=>{$('navL').classList.add('open');$('scrim').classList.add('on');document.documentElement.classList.add('nl-lock')};
$('scrim').onclick=closeNav;
$('scrim').addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
addEventListener('resize',()=>{if(innerWidth>1180)closeNav()});


/* démarche étape par étape : le deuxième exemple d'une fiche (et les exercices) ne s'affichent pas d'emblée.
   L'élève fait le calcul, puis vérifie : chaque clic dévoile une étape de la méthode en 5 étapes. */
(function(){
 function stepify(box,st,shown,todo){
  if(!st)return;const steps=[...st.children].filter(e=>e.classList.contains('step'));if(steps.length<2)return;
  let n=Math.min(shown,steps.length);
  const lb=box.querySelector('.lb');
  if(todo&&lb)lb.textContent=lb.textContent.replace(/^Exemple résolu/,'À toi de jouer');
  box.classList.add('wk-todo');
  const hint=document.createElement('p');hint.className='wk-hint';
  const cl=box.classList.contains('cl');hint.textContent=todo?(cl?'Fais la résolution sur ton cahier, en suivant les étapes nommées ci-dessous. Puis vérifie : chaque clic dévoile une étape.':'Fais le calcul sur ton cahier, avec les cinq étapes de la méthode. Puis vérifie : chaque clic dévoile une étape.'):'Rédige sur ton cahier. Puis vérifie ta démarche : chaque clic dévoile une étape.';
  st.before(hint);
  st.setAttribute('aria-live','polite');
  const c=document.createElement('div');c.className='wk-ctl';
  c.innerHTML='<button type="button" class="btn wk-next"></button><button type="button" class="btn wk-all">Tout afficher</button><button type="button" class="btn wk-rs">Recommencer</button><span class="wk-ind"></span>';
  st.after(c);
  const nx=c.querySelector('.wk-next'),al=c.querySelector('.wk-all'),rs=c.querySelector('.wk-rs'),ind=c.querySelector('.wk-ind');
  const draw=()=>{
   steps.forEach((s,i)=>s.classList.toggle('hid',i>=n));
   const done=n>=steps.length;
   nx.hidden=done;al.hidden=done;rs.hidden=!done;
   if(!done){const t=steps[n].querySelector('small');nx.textContent='Vérifier : voir l’étape '+(n+1)+(t?' · '+t.textContent.toLowerCase():'');}
   ind.textContent=done?'Démarche complète':n===0?'aucune étape affichée':'étape '+n+' sur '+steps.length+' affichée'+(n>1?'s':'');
  };
  nx.onclick=()=>{n++;draw();const s=steps[n-1];s.scrollIntoView({block:'nearest',behavior:'smooth'})};
  al.onclick=()=>{n=steps.length;draw()};
  rs.onclick=()=>{n=Math.min(shown,steps.length);draw();box.scrollIntoView({block:'nearest'})};
  draw();
 }
 document.querySelectorAll('.sec').forEach(sec=>{
  let seen=false;
  const norm=e=>e?e.textContent.replace(/\s+/g,' ').trim():'';
  const reds=[...sec.querySelectorAll('.fm-r .steps')].map(norm);
  sec.querySelectorAll('.fm-r, .blk.exemple').forEach(el=>{
   if(el.classList.contains('fm-r')){seen=true;return}
   /* le premier exemple d'une formule (même calcul que sa fiche « rédaction ») reste affiché */
   if(!el.classList.contains('exo')&&reds.indexOf(norm(el.querySelector('.steps')))>=0)return;
   if(el.classList.contains('exo')){const d=el.querySelector('details.exo-d');if(!d)return;const st=d.querySelector('.steps');d.replaceWith(st);stepify(el,st,0,false);return}
   if((seen||el.classList.contains('todo'))&&!el.classList.contains('keep'))stepify(el,el.querySelector('.steps'),0,true);
  });
 });
})();

/* ---------- sections de référence repliées par défaut ---------- */
(function(){
 const FOLD={'Vrai ou faux ?':'Facultatif : teste ce que tu crois savoir.','Formules à connaître':'À ouvrir quand tu en as besoin.','Tableaux de référence':'À ouvrir quand tu en as besoin.'};
 const secs=[...document.querySelectorAll('main .sec[data-rail]')].filter(s=>FOLD[s.dataset.rail]);
 if(!secs.length)return;
 const setOpen=(s,on)=>{
  s.classList.toggle('open',on);
  const b=s.querySelector(':scope > .fold-bar .fold-tog');
  if(b){b.setAttribute('aria-expanded',on?'true':'false');b.firstChild.nodeValue=on?'Replier':'Ouvrir'}
  if(on){s.classList.add('vu');requestAnimationFrame(()=>{window.dispatchEvent(new Event('resize'));setTimeout(()=>window.dispatchEvent(new Event('resize')),120)})}
 };
 secs.forEach(s=>{
  const h=s.querySelector(':scope > h2');if(!h)return;
  const body=document.createElement('div');body.className='fold-body';body.id=s.id+'-fold';
  [...s.children].forEach(c=>{if(c!==h)body.appendChild(c)});
  const bar=document.createElement('div');bar.className='fold-bar';
  bar.innerHTML=`<span class="fold-hint">${FOLD[s.dataset.rail]}</span><button type="button" class="fold-tog" aria-expanded="false" aria-controls="${body.id}">Ouvrir</button>`;
  s.append(bar,body);s.classList.add('fold');
  bar.querySelector('button').addEventListener('click',()=>setOpen(s,!s.classList.contains('open')));
 });
 const openFor=id=>{const t=id&&document.getElementById(id);if(!t)return;const s=t.closest('.sec.fold')||(t.classList&&t.classList.contains('fold')?t:null);if(s&&!s.classList.contains('open')){setOpen(s,true);setTimeout(()=>t.scrollIntoView(),60)}};
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a)openFor(a.getAttribute('href').slice(1))});
 addEventListener('hashchange',()=>openFor(location.hash.slice(1)));
 if(location.hash)openFor(location.hash.slice(1));
})();

buildRail();window.__railReady=true;
setTimeout(()=>document.querySelectorAll('.sec.rv,.pn').forEach(e=>{if(e.getBoundingClientRect().top<innerHeight)e.classList.add('vu')}),60);
if(location.hash){/* aller à l'ancre, puis recaler après la mise en page (figures déplacées par compact.js, images) ; on s'arrête dès que le lecteur défile lui-même */
 const id=decodeURIComponent(location.hash.slice(1));let moved=false;
 const go=()=>{if(moved)return;const t=document.getElementById(id);if(t)t.scrollIntoView({behavior:'instant',block:'start'})};
 ['wheel','touchstart','keydown','mousedown'].forEach(ev=>addEventListener(ev,()=>{moved=true},{once:true,passive:true}));
 setTimeout(go,120);addEventListener('load',()=>{setTimeout(go,200);setTimeout(go,800)});setTimeout(go,1600)}

/* ---------- bulles de glossaire ---------- */
(function(){
 const els=[...document.querySelectorAll('.gloss[data-gloss]')];if(!els.length)return;
 const tip=document.createElement('div');tip.className='gtip';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.appendChild(tip);
 let cur=null;
 function show(el){
  const g=(window.GLOSS||{})[el.dataset.gloss];if(!g)return;cur=el;
  tip.innerHTML='<button class="gx" type="button" aria-label="Fermer la définition">×</button><b>'+g.t+'</b><span>'+g.d+'</span><a href="glossaire.html#'+el.dataset.gloss+'">Voir dans le glossaire →</a>';
  tip.hidden=false;const r=el.getBoundingClientRect(),w=Math.min(340,innerWidth-24);tip.style.width=w+'px';
  let x=Math.max(12,Math.min(r.left,innerWidth-w-12)),y=r.bottom+8;
  tip.style.left=x+'px';tip.style.top=y+'px';
  const th=tip.offsetHeight;if(y+th>innerHeight-8&&r.top>th+16)tip.style.top=(r.top-th-8)+'px';
 }
 function hide(){tip.hidden=true;cur=null;pinned=false}
 let pinned=false;
 tip.addEventListener('click',e=>{if(e.target.closest('.gx')){e.preventDefault();hide()}});
 let tm;
 els.forEach(el=>{
  el.addEventListener('mouseenter',()=>{clearTimeout(tm);show(el)});
  el.addEventListener('mouseleave',()=>{tm=setTimeout(()=>{if(!pinned&&!tip.matches(':hover'))hide()},180)});
  el.addEventListener('focus',()=>show(el));
  el.addEventListener('click',e=>{e.preventDefault();if(pinned&&cur===el&&!tip.hidden)hide();else{show(el);pinned=true}});
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(el)}});
 });
 tip.addEventListener('mouseleave',()=>{if(!pinned)tm=setTimeout(hide,180)});
 tip.addEventListener('mouseenter',()=>clearTimeout(tm));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
 document.addEventListener('click',e=>{if(!e.target.closest('.gloss,.gtip'))hide()});
 addEventListener('scroll',hide,{passive:true});
})();

/* connexion élève + bouton « Signaler un problème » (modules séparés) */
(function(){['contra','a11y','confort','compact','calc'].forEach(function(n){var q=document.createElement('script');q.src='assets/'+n+'.js';document.body.appendChild(q)})})();
(function(){var a=document.createElement('script');a.src='assets/session.js';a.onload=function(){var b=document.createElement('script');b.src='assets/signal.js';document.body.appendChild(b)};document.body.appendChild(a)})();

/* ---------- recherche dans le glossaire ---------- */
(function(){
 function go(){
  const q=document.getElementById('gq');if(!q)return;
  const norm=x=>x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’']/g,"'").trim();
  const entries=[...document.querySelectorAll('.entry[data-s]')],secs=[...document.querySelectorAll('section[id^="g-"]')],no=document.getElementById('gnores');
  function run(){
   const t=norm(q.value),ws=t.split(/\s+/).filter(Boolean);let n=0;
   entries.forEach(e=>{const s=e.dataset.s,ok=!ws.length||ws.every(w=>s.indexOf(w)>-1);e.hidden=!ok;if(ok)n++});
   secs.forEach(s=>{const any=[...s.querySelectorAll('.entry')].some(e=>!e.hidden);s.hidden=!any;
    const a=document.querySelector('.alpha a[href="#'+s.id+'"]');if(a)a.classList.toggle('off',!any)});
   if(no)no.style.display=n?'none':'block';
  }
  q.addEventListener('input',run);run();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();


/* ---------- schémas : bouton « Agrandir » quand l'échelle est trop petite pour lire ---------- */
(function(){
 var SEL='figure.fig svg,.dcg-fig svg,.wall svg,.gn-netw svg,.pfx-sc svg,#pfx-svg';
 function vbw(s){var v=(s.getAttribute('viewBox')||'').split(/[\s,]+/).map(Number);return v.length===4&&v[2]>0?v:null}
 function host(s){return s.closest('figure.fig,.dcg-fig,.sv,.pfx-sc,.gn-netw')||s.parentNode}
 function openZoom(s){
  var vb=vbw(s),ov=document.createElement('div');ov.className='zoomov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Schéma agrandi');
  var portrait=innerHeight>innerWidth,wide=vb&&vb[2]/vb[3]>1.15;
  if(portrait&&wide)ov.classList.add('rot');
  var bar=document.createElement('div');bar.className='zbar';
  var rb=document.createElement('button');rb.type='button';rb.textContent='↻ Pivoter';rb.onclick=function(){ov.classList.toggle('rot')};
  var cb=document.createElement('button');cb.type='button';cb.textContent='✕ Fermer';
  bar.appendChild(rb);bar.appendChild(cb);
  var box=document.createElement('div');box.className='zbox';
  var c=s.cloneNode(true);c.removeAttribute('style');c.removeAttribute('width');c.removeAttribute('height');box.appendChild(c);
  var hint=document.createElement('div');hint.className='zhint';hint.textContent=portrait&&wide?'Schéma tourné pour être lu en grand : « Pivoter » pour revenir.':'';
  ov.appendChild(bar);ov.appendChild(box);ov.appendChild(hint);
  function close(){ov.remove();document.removeEventListener('keydown',key);if(opener)opener.focus()}
  function key(e){if(e.key==='Escape')close()}
  var opener=document.activeElement;
  cb.onclick=close;ov.addEventListener('click',function(e){if(e.target===ov)close()});document.addEventListener('keydown',key);
  document.body.appendChild(ov);cb.focus();
 }
 function scan(){
  var small=innerWidth<=760;
  document.querySelectorAll(SEL).forEach(function(s){
   var vb=vbw(s);if(!vb)return;var h=host(s);
   if(s.closest('.zoomov'))return;
   var b=s.nextElementSibling&&s.nextElementSibling.classList.contains('zbtn')?s.nextElementSibling:null;
   var scale=s.getBoundingClientRect().width/vb[2];
   var need=small&&scale>0&&scale<.82;
   if(need&&!b){b=document.createElement('button');b.type='button';b.className='zbtn';b.textContent='⤢ Agrandir';b.setAttribute('aria-label','Agrandir ce schéma');b.addEventListener('click',function(){openZoom(s)});s.parentNode.insertBefore(b,s.nextSibling)}
   else if(!need&&b)b.remove();
  });
 }
 var t;function later(){clearTimeout(t);t=setTimeout(scan,150)}
 addEventListener('load',function(){scan();setTimeout(scan,1200)});addEventListener('resize',later);addEventListener('orientationchange',later);
 document.addEventListener('DOMContentLoaded',function(){setTimeout(scan,300)});
})();
