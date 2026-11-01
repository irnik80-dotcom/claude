/* Égi jelenségek – X. fejezet (tankönyv 208–225. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var moon = function(cx, half, label){ /* half: 'new','right','full','left' */
  var o='<circle cx="'+cx+'" cy="70" r="28" fill="#2a2f3a" stroke="#1b2618" stroke-width="3"/>';
  if(half==='full') o+='<circle cx="'+cx+'" cy="70" r="28" fill="#f6efc0" stroke="#1b2618" stroke-width="3"/>';
  if(half==='right') o+='<path d="M'+cx+' 42 A28 28 0 0 1 '+cx+' 98 Z" fill="#f6efc0"/>';
  if(half==='left') o+='<path d="M'+cx+' 42 A28 28 0 0 0 '+cx+' 98 Z" fill="#f6efc0"/>';
  return o+SV.t(cx,122,label,11); };
var FIG = {
  compass: SV.svg('A Nap kijelöli az égtájakat: kelet, dél, nyugat',
    '<path d="M30 120 Q160 -30 290 120" fill="none" stroke="#f2b705" stroke-width="4" stroke-dasharray="7 6"/>'+SV.sun(65,92)+SV.t(40,138,'K (napkelte)',11,'start')+SV.t(160,50,'D (dél)',12)+SV.t(270,138,'Ny (napnyugta)',11,'end')+'<line x1="20" y1="120" x2="300" y2="120" stroke="currentColor" stroke-width="3"/>'),
  sun: SV.svg('A Nap a Naprendszer központi csillaga',
    SV.sun(55,75)+SV.t(55,128,'Nap',12)+'<circle cx="150" cy="75" r="7" fill="#8b8f87"/><circle cx="185" cy="75" r="9" fill="#d9a86c"/><circle cx="225" cy="75" r="10" fill="#2f7fd1"/><circle cx="265" cy="75" r="8" fill="#d6403f"/>'+SV.t(215,128,'a bolygók körülötte keringenek',11)),
  moon: SV.svg('A Hold fázisai kb. 29 napos ciklust mutatnak', moon(48,'new','újhold')+moon(123,'right','első negyed')+moon(198,'full','telihold')+moon(273,'left','utolsó negyed')),
  orbit: SV.svg('A Hold kering a Föld körül, a Föld a Nap körül',
    SV.sun(40,75)+'<circle cx="150" cy="75" r="16" fill="#2f7fd1" stroke="#1b2618" stroke-width="3"/>'+SV.t(150,115,'Föld',11)+
    '<circle cx="150" cy="75" r="45" fill="none" stroke="#8b8f87" stroke-width="2" stroke-dasharray="4 4"/><circle cx="195" cy="75" r="7" fill="#f6efc0" stroke="#1b2618" stroke-width="2"/>'+SV.t(240,70,'Hold:',12,'start')+SV.t(240,86,'nincs saját fénye',11,'start')),
  planets: SV.flow('A Naprendszer nyolc bolygója',[['Merkúr','#cfcfcf'],['Vénusz','#f2c230'],['Föld','#6ab0ff'],['Mars','#d6403f']],['','',''],'belső (kőzet) bolygók'),
  planets2: SV.flow('A külső bolygók',[['Jupiter','#d9a86c'],['Szaturnusz','#f0d78a'],['Uránusz','#9fe3ea'],['Neptunusz','#4a6fd1']],['','',''],'külső (gáz- és jégóriás) bolygók'),
  small: SV.boxes('A Nap körül keringő égitestek',[['kisbolygó','#d9d9d9'],['törpebolygó','#cfe9ff'],['üstökös','#fdeeb0'],['meteoroid','#ffd9d6']],'a meteoroid a légkörben meteorként elég'),
  distance: SV.svg('Nap–Föld távolság: 1 CsE = 150 millió km',
    SV.sun(45,75)+SV.arrow(75,75,215,'#2f7fd1')+'<circle cx="245" cy="75" r="14" fill="#2f7fd1" stroke="#1b2618" stroke-width="3"/>'+SV.t(160,55,'1 CsE = 150 millió km',13)+SV.t(160,110,'a fény ide kb. 8 perc alatt ér',12)),
  space: SV.svg('Teleszkóp és űrszonda',
    '<polygon points="60,100 130,50 140,65 70,115" fill="#8b8f87" stroke="#1b2618" stroke-width="3"/><line x1="80" y1="125" x2="95" y2="145" stroke="currentColor" stroke-width="4"/><line x1="105" y1="115" x2="95" y2="145" stroke="currentColor" stroke-width="4"/>'+SV.t(95,160,'távcső',11)+
    SV.r(200,60,50,30,'#d9d9d9')+SV.r(170,65,30,20,'#2f7fd1')+SV.r(250,65,30,20,'#2f7fd1')+SV.t(225,115,'űrszonda',11))
};

window.LESSON = {
  id:'egijelensegek',
  screens:[
  { type:'info', section:'Tanulás', icon:'☀️', title:'A Nap és az égtájak', fig:FIG.compass,
    body:'<p>A Nap égi mozgása kijelöli a <b>négy égtájat</b>: <mark class="k">észak, kelet, dél, nyugat</mark>.</p><ul><li>Reggel <b>keleten</b> kel fel,</li><li>délben <b>délen</b> van a legmagasabban,</li><li>este <b>nyugaton</b> nyugszik le.</li></ul><p>A Nap égi mozgása adja a <b>napok és az évek ritmusát</b>. Egy <b>nap</b> a Föld egy teljes körbefordulása, egy <b>év</b> a Föld egy Nap körüli keringése.</p>',
    mc:'<p>Minecraftban is a Nap kel keleten és nyugszik nyugaton. Így találsz el az irányokat, ha elveszel.</p>',
    src:'208–210. oldal' },

  { type:'info', section:'Tanulás', icon:'🌟', title:'A Nap: éltető csillagunk', fig:FIG.sun,
    body:'<p>A Nap a <mark class="k">Naprendszer központi csillaga</mark>. Körülötte keringenek a bolygók, az üstökösök.</p><p>A Nap <b>központjában</b> zajlik az <b>energiatermelés</b>. Az így keletkező <b>fényt és hőt</b> sugározza a világmindenségbe.</p><p>Éltető ereje miatt a Napnak <b>kiemelkedő kulturális jelentősége</b> van: sok nép tisztelte istenként.</p>',
    tip:'<p>A Nap egy csillag, mint az éjszakai égbolt többi fénylő pontja. Csak sokkal közelebb van hozzánk.</p>',
    src:'208–210. oldal' },

  { type:'info', section:'Tanulás', icon:'🌙', title:'A Hold: állandó kísérőnk', fig:FIG.orbit,
    body:'<p>A <mark class="k">Hold</mark> a Föld körül kering, és közben a <b>saját tengelye körül is forog</b>.</p><p>A Holdnak <b>nincs önálló fénye</b>: csak visszaveri a Nap fényét (másodlagos fényforrás).</p><p>Ezért a Hold alakja egyre változni látszik: ezek a <mark class="k">holdfázisok</mark>.</p>',
    mc:'<p>Minecraftban is van Hold, és fázisai vannak. A holdfázisok a játékban a nyolc napos ciklust követik, a valóságban kb. 29 napot.</p>',
    src:'211–213. oldal' },

  { type:'info', section:'Tanulás', icon:'🌓', title:'Holdfázisok és a naptár', fig:FIG.moon,
    body:'<p>A Hold fázisai kb. <mark class="k">29 napos</mark> ciklust mutatnak:</p><ul><li><b>újhold</b>: a Hold nem látszik,</li><li><b>első negyed</b>, majd <b>telihold</b> (teljes kör),</li><li><b>utolsó negyed</b>, majd újra újhold.</li></ul><p>A <b>Nap és a Hold égi mozgásai</b> adják a <b>naptárak alapját</b>: a Nap az évet, a Hold a hónapot.</p>',
    tip:'<p>Az év hossza nem pontosan 365 nap, ezért vezették be a <b>szökőnapot</b>. XIII. Gergely pápa 1582-ben vezette be a mai <b>Gergely-naptárat</b>: október 4-e után október 15-e következett.</p>',
    src:'211–213. oldal' },

  { type:'info', section:'Tanulás', icon:'✨', title:'A csillagok',
    body:'<p>A <mark class="k">csillagok</mark> <b>saját fényükkel</b> világító, óriási, forró gázgömbök. A Nap is egy csillag.</p><p>Azért tűnnek parányi pontnak, mert <b>nagyon messze</b> vannak. A távolságukat <b>fényévben</b> mérjük: ez az az út, amit a fény egy év alatt megtesz.</p><p>Az emberek az égen látható csillagokat <b>csillagképekbe</b> rendezték (pl. Nagy Medve, Orion). A <b>Sarkcsillag</b> mindig észak felé mutat, így segít a tájékozódásban.</p>',
    mc:'<p>A Minecraft égbolt csillagai az éjszaka apró fénypontok. Az igaziak ezek százmilliárdjai, és mindegyik egy-egy Nap.</p>',
    tip:'<p>Az egy fényév kb. 9 460 milliárd km. A Naphoz legközelebbi csillag, a Proxima Centauri 4,2 fényévre van.</p>',
    src:'214–216. oldal' },

  { type:'info', section:'Tanulás', icon:'🪐', title:'Bolygók: a világkép', fig:FIG.planets,
    body:'<p>Régen azt gondolták, a <b>Föld áll a világ közepén</b>, és körülötte kering a Nap, a Hold és az ismert bolygók (<b>földközéppontú világkép</b>).</p><p>Ma tudjuk, hogy a bolygók a <mark class="k">Nap körül keringenek</mark> (<b>napközéppontú világkép</b>).</p><p>A Naprendszer <mark class="k">nyolc bolygója</mark> a Naptól távolodva:</p><ol><li>Merkúr</li><li>Vénusz</li><li>Föld</li><li>Mars</li><li>Jupiter</li><li>Szaturnusz</li><li>Uránusz</li><li>Neptunusz</li></ol>',
    tip:'<p>Emlékeztető: <b>Mer</b>kúr <b>Vé</b>nusz <b>Fö</b>ld <b>Ma</b>rs <b>Ju</b>piter <b>Sza</b>turnusz <b>Ur</b>ánusz <b>Ne</b>ptunusz.</p>',
    src:'217–219. oldal' },

  { type:'info', section:'Tanulás', icon:'📏', title:'Távolságok a Naprendszerben', fig:FIG.distance,
    body:'<p>A Nap–Föld <b>közepes távolság</b> <mark class="k">1 CsE</mark> (csillagászati egység) = <b>150 millió km</b>.</p><p>Ezzel mérjük a bolygók távolságát: pl. a Mars kb. <b>1,5 CsE</b>, azaz 225 millió km-re kering a Naptól.</p><p>A fény a Napból kb. <b>8 perc</b> alatt ér a Földre, mert 150 000 000 km : 300 000 km/s = 500 s.</p>',
    src:'217–219. oldal' },

  { type:'info', section:'Tanulás', icon:'☄️', title:'Az égbolt egyéb objektumai', fig:FIG.small,
    body:'<p>A Nap körül nemcsak bolygók keringenek:</p><ul><li><mark class="k">Kisbolygók</mark>: kisebb sziklás égitestek (főleg a Mars és a Jupiter között).</li><li><mark class="k">Törpebolygók</mark>: kisebbek a bolygóknál (pl. a Plútó).</li><li><mark class="k">Üstökösök</mark>: jégből és porból álló égitestek, a Nap közelében farkat növesztenek.</li><li><mark class="k">Meteoroidok</mark>: apró kődarabok. Ha a légkörben elégnek, <b>hullócsillagnak</b> (meteornak) látjuk.</li></ul>',
    tip:'<p>A hullócsillag nem csillag! Egy porszem vagy kavics, ami a légkörben elég.</p>',
    src:'220–221. oldal' },

  { type:'info', section:'Tanulás', icon:'🚀', title:'Az űrkutatás', fig:FIG.space,
    body:'<p>A tudósok a <b>17. századtól</b> <mark class="k">távcsővel</mark> figyelték az eget. Lejegyezték a csillagok és bolygók fényességét és mozgását. <b>Csillagvizsgálókban</b> ma is így dolgoznak.</p><p>Ma már <mark class="k">űrszondákat</mark> is használnak a bolygók kutatására. Az űrszondák a bolygókhoz repülnek, vagy elhaladnak mellettük, és képeket, mérési adatokat küldenek a Földre.</p>',
    mc:'<p>Egy Minecraftban építhető távcső is közelebb hozza a távoli dolgokat, de a valódi csillagászok sokkal nagyobb távcsöveket és űrszondákat használnak.</p>',
    src:'222–224. oldal' },

  { type:'info', section:'Tanulás', icon:'📋', title:'Ennyit kell tudni',
    body:'<ul><li>A Nap kijelöli az <b>égtájakat</b> és adja a napok, évek ritmusát.</li><li>A <b>Nap</b> a Naprendszer központi csillaga, fényt és hőt sugároz.</li><li>A <b>Hold</b> a Föld körül kering, nincs saját fénye. A fázisok ciklusa kb. <b>29 nap</b>.</li><li>Napközéppontú világkép: a bolygók a Nap körül keringenek.</li><li>A <b>nyolc bolygó</b>: Merkúr, Vénusz, Föld, Mars, Jupiter, Szaturnusz, Uránusz, Neptunusz.</li><li><b>1 CsE = 150 millió km</b> (Nap–Föld távolság).</li><li>Kisbolygók, törpebolygók, üstökösök, meteoroidok.</li><li>Távcső és űrszondák segítik az űrkutatást.</li></ul><p><b>Most jön a játék! 🎮</b></p>',
    src:'225. oldal – összefoglalás' },

  /* ===== JÁTÉKOK ===== */
  { type:'match', section:'Játék 1', title:'🔗 Párosítás: égitestek',
    pairs:[['Nap','a Naprendszer központi csillaga'],['Hold','a Föld kísérője, nincs saját fénye'],['Föld','a harmadik bolygó'],['Jupiter','a legnagyobb bolygó'],['üstökös','jégből és porból áll, farka van'],['meteoroid','apró kődarab, légkörben elég']] },

  { type:'tf', section:'Játék 2', title:'⚡ Igaz vagy hamis?',
    items:[
      {t:'A Hold saját fénnyel világít.', a:false, why:'A Hold csak visszaveri a Nap fényét.'},
      {t:'A Nap a Naprendszer központi csillaga.', a:true, why:'A bolygók ő körülötte keringenek.'},
      {t:'A Naprendszernek tíz bolygója van.', a:false, why:'Nyolc bolygó van.'},
      {t:'A Hold fázisai kb. 29 naposak.', a:true, why:'Ez a holdhónap hossza.'},
      {t:'A Nap kelet felé nyugszik le.', a:false, why:'Keleten kel fel, nyugaton nyugszik.'},
      {t:'1 CsE a Nap–Föld közepes távolság.', a:true, why:'Ez 150 millió km.'}
    ]},

  { type:'memory', section:'Játék 3', title:'🧠 Memóriajáték',
    pairs:[['CsE','csillagászati egység'],['150 millió km','1 CsE'],['telihold','teljes kör alakú Hold'],['29 nap','holdfázis-ciklus'],['üstökös','farka van'],['Szaturnusz','gyűrűs bolygó']] },

  { type:'drag', section:'Játék 4', title:'📦 Bolygó, törpebolygó vagy más égitest?',
    bins:[{id:'bolygo',name:'Bolygó',icon:'🪐'},{id:'torp',name:'Törpebolygó',icon:'🔵'},{id:'egyeb',name:'Más égitest',icon:'☄️'}],
    items:[{t:'Merkúr',c:'bolygo'},{t:'Mars',c:'bolygo'},{t:'Neptunusz',c:'bolygo'},{t:'Plútó',c:'torp'},{t:'üstökös',c:'egyeb'},{t:'meteoroid',c:'egyeb'},{t:'Hold',c:'egyeb'},{t:'Nap',c:'egyeb'}] },

  { type:'drag', section:'Játék 5', title:'📦 Mennyi ideig tart?',
    bins:[{id:'nap',name:'Egy nap',icon:'☀️'},{id:'honap',name:'Kb. egy hónap',icon:'🌙'},{id:'ev',name:'Egy év',icon:'🌍'}],
    items:[{t:'a Föld egy fordulata a tengelye körül',c:'nap'},{t:'a Hold fázisainak ciklusa',c:'honap'},{t:'a Föld egy keringése a Nap körül',c:'ev'},{t:'365 nap',c:'ev'},{t:'24 óra',c:'nap'},{t:'kb. 29 nap',c:'honap'}] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'A Naprendszer központi csillaga a ___. A Hold nincs ___ fénye. A Naprendszer ___ bolygóból áll. A Nap–Föld távolság 1 ___.',
    answers:['Nap','saját','nyolc','CsE'], extra:['Hold','kék','tíz'],
    explain:'A Nap a központi csillag, a Hold csak visszaveri a fényt, 8 bolygó van, 1 CsE = 150 millió km.' },

  /* ===== DOLGOZAT GYAKORLÓ ===== */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'A Nap égi mozgása kijelöli a négy ___. A Hold fázisai kb. ___ napos ciklust mutatnak. A napközéppontú világkép szerint a bolygók a ___ körül keringenek. A Mars, a Jupiter és a Szaturnusz ___.',
    answers:['égtájat','29','Nap','bolygók'], extra:['Föld','7','csillagok'],
    explain:'Az Égi jelenségek fejezet alapjai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze!',
    pairs:[['újhold','a Hold nem látszik'],['telihold','teljes kör alakú Hold'],['kisbolygó','kisebb sziklás égitest'],['hullócsillag','a légkörben elégő meteoroid'],['űrszonda','képeket és adatokat küld a Földre']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'A földközéppontú világkép szerint a Föld áll a középpontban.', a:true, why:'Régen így gondolták.'},
      {t:'A Nap egy csillag.', a:true, why:'A legközelebbi csillagunk.'},
      {t:'A hullócsillag valódi csillag.', a:false, why:'Egy meteoroid, ami elég a légkörben.'},
      {t:'A Mars a Naptól számítva a negyedik bolygó.', a:true, why:'Merkúr, Vénusz, Föld, Mars.'},
      {t:'A Föld a Nap körül kering.', a:true, why:'Egy keringés egy év.'},
      {t:'A Hold a Nap körül nem kering, csak a Föld körül.', a:false, why:'A Holddal együtt a Föld kering a Nap körül.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Hány bolygója van a Naprendszernek?',
    options:['8','9','7','10'], correct:0, explain:'Merkúr, Vénusz, Föld, Mars, Jupiter, Szaturnusz, Uránusz, Neptunusz.', hint:'Számold végig őket.' },
  { type:'quiz', section:'Dolgozat', q:'5. Melyik a Földhöz legközelebbi nagyobb égitest?',
    options:['a Hold','a Mars','a Nap','a Jupiter'], correct:0, explain:'A Hold a Föld természetes kísérője.', hint:'Ő kering a Föld körül.' },
  { type:'quiz', section:'Dolgozat', q:'6. Mi az 1 CsE?',
    options:['A Nap–Föld közepes távolság, 150 millió km.','A Föld–Hold távolság.','A fény egy év alatt megtett útja.','A Nap átmérője.'], correct:0, explain:'1 CsE = 150 millió km.', hint:'CsE: csillagászati egység.' },
  { type:'quiz', section:'Dolgozat', q:'7. Miért változnak a holdfázisok?',
    options:['A Hold a Föld körül kering, és a Nap fényét veri vissza.','A Hold fénye ki-be kapcsol.','A Föld árnyéka mindig eltakarja.','A Nap fénye változik.'], correct:0, explain:'A keringés közben más és más oldalát látjuk megvilágítva.', hint:'A Holdnak nincs saját fénye.' },

  { type:'calc', section:'Dolgozat', count:4, gens:[
    function(){ var x=pick([2,3,4]);
      return {q:'Egy bolygó a Naptól <b>'+x+' CsE</b> távolságra kering. <b>Hány millió km ez?</b> (1 CsE = 150 millió km) (millió km)', a:150*x, u:'millió km', hint:'Szorozd 150-nel.', explain:x+' · 150 = '+(150*x)+' millió km.'}; },
    function(){ var c=pick([2,3]);
      return {q:'A Hold fázisai kb. 29 naponként ismétlődnek. <b>Hány nap telik el '+c+' ciklus alatt?</b> (nap)', a:29*c, u:'nap', hint:'Szorozd 29-cel.', explain:c+' · 29 = '+(29*c)+' nap.'}; },
    function(){ var v=pick([2,3,5,10]);
      return {q:'A fény a Napból <b>150 000 000 km</b>-t tesz meg a Földig, <b>300 000 km/s</b> sebességgel. <b>Hány másodperc alatt ér ide?</b> (s)', a:500, u:'s', hint:'t = s : v.', explain:'150 000 000 : 300 000 = 500 s, ez kb. 8 perc.'}; },
    function(){ var d=pick([2,3,5,7]);
      return {q:'Egy év 365 nap. <b>Hány nap telik el '+d+' év alatt?</b> (A szökőnapot most ne vedd figyelembe.) (nap)', a:365*d, u:'nap', hint:'Szorozd 365-tel.', explain:d+' · 365 = '+fmt(365*d)+' nap.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Mi kelti az égtájakat?','A Nap égi mozgása: észak, kelet, dél, nyugat.'],
      ['A Nap','A Naprendszer központi csillaga, fényt és hőt sugároz.'],
      ['A Hold','A Föld körül kering, nincs saját fénye. Fázisai kb. 29 naposak.'],
      ['Napközéppontú világkép','A bolygók a Nap körül keringenek.'],
      ['A nyolc bolygó','Merkúr, Vénusz, Föld, Mars, Jupiter, Szaturnusz, Uránusz, Neptunusz.'],
      ['1 CsE','A Nap–Föld közepes távolság, 150 millió km.'],
      ['Üstökös','Jégből és porból álló égitest, a Nap közelében farkat növeszt.'],
      ['Meteoroid és hullócsillag','A meteoroid apró kődarab. Ha a légkörben elég, hullócsillag.'],
      ['Törpebolygó','Kisebb a bolygónál, pl. a Plútó.'],
      ['Űrkutatás eszközei','Távcső és űrszondák.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
