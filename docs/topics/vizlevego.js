/* Víz és levegő – V. fejezet (tankönyv 76–112. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var FIG = {
  heat: SV.boxes('A hő terjedésének három módja',[['hővezetés','#ffd9d6'],['hőáramlás','#fdeeb0'],['hősugárzás','#d5f0cb']],'szilárd, folyadék, gáz · folyadék, gáz · közeg nélkül'),
  expand: SV.svg('Hőtágulás: melegítéskor a test kitágul',
    SV.r(30,60,80,26,'#9fd0ff')+SV.t(70,110,'hideg: rövid',12)+SV.fire(70,128)+
    SV.r(150,60,120,26,'#ff9d96')+SV.t(210,110,'meleg: hosszabb',12)+SV.t(140,76,'→',26)),
  phases: SV.flow('Halmazállapot-változások',[['szilárd','#d4f1ff'],['folyadék','#9fd0ff'],['gáz','#e8e8e8']],['olvadás →  ← fagyás','forrás/párolgás → ← lecsapódás'],'olvadás: energiát vesz fel · fagyás: energiát ad le'),
  boil: SV.svg('Forrás: közben a hőmérséklet nem változik',
    '<polyline points="30,120 100,60 150,60 280,30" fill="none" stroke="#d6403f" stroke-width="5"/>'+SV.t(125,50,'olvadás',11)+SV.t(40,138,'idő →',11,'start')+SV.t(280,20,'forrás',11,'end')+SV.t(20,30,'T',14,'start')+
    '<polyline points="30,120 100,100 150,60 200,60 270,30" fill="none" stroke="none"/>'),
  press: SV.tri('Nyomás: p egyenlő F osztva A-val','F','p','A','p = F : A   (Pa = N/m²)'),
  hydro: SV.svg('Hidrosztatikai nyomás: minél mélyebb, annál nagyobb',
    SV.r(80,15,160,120,'#bfe3ff')+'<line x1="80" y1="40" x2="240" y2="40" stroke="#2f7fd1" stroke-width="2" stroke-dasharray="5 4"/>'+
    SV.arrow(130,55,175,'#d6403f')+SV.arrow(130,95,215,'#d6403f')+SV.t(250,60,'kicsi',12,'start')+SV.t(250,100,'nagy',12,'start')+SV.t(160,152,'p = ρ · h · g',13)),
  air: SV.svg('Légnyomás: a levegő súlya nyom minden irányból',
    '<rect x="100" y="14" width="120" height="100" fill="#e8f4ff" stroke="#1b2618" stroke-width="3" stroke-dasharray="6 5"/>'+SV.t(160,60,'levegőoszlop',13)+SV.t(160,80,'101,3 kPa',13)+
    SV.r(100,114,120,16,'#7a5b34')+SV.t(160,150,'tengerszint: kb. 101,3 kPa',12)),
  utube: SV.svg('Közlekedőedény: mindenhol egyenlő magasan áll a folyadék',
    SV.r(60,50,40,80,'#fff')+SV.r(120,50,40,80,'#fff')+SV.r(180,50,40,80,'#fff')+SV.r(60,100,160,30,'#bfe3ff')+
    SV.r(62,70,36,30,'#bfe3ff')+SV.r(122,70,36,30,'#bfe3ff')+SV.r(182,70,36,30,'#bfe3ff')+'<line x1="40" y1="70" x2="250" y2="70" stroke="#2f7fd1" stroke-width="2" stroke-dasharray="5 4"/>'+SV.t(160,150,'egy vízszintes síkban',12)),
  archi: SV.svg('Arkhimédész: a felhajtóerő a kiszorított víz súlya',
    SV.r(60,40,200,90,'#bfe3ff')+SV.r(130,60,50,40,'#a9743a')+SV.arrow(155,110,155,'#2e8b2e').replace(/.*/,'')+
    '<line x1="155" y1="58" x2="155" y2="20" stroke="#2e8b2e" stroke-width="5"/><polygon points="155,12 145,28 165,28" fill="#2e8b2e"/>'+SV.t(200,28,'Ff (felhajtóerő)',12,'start')+
    '<line x1="155" y1="102" x2="155" y2="136" stroke="#d6403f" stroke-width="5"/><polygon points="155,146 145,128 165,128" fill="#d6403f"/>'+SV.t(200,140,'Fg (gravitáció)',12,'start')),
  float: SV.boxes('Úszik, lebeg, elmerül',[['úszik','#9fe07f'],['lebeg','#fdeeb0'],['elmerül','#ff9d96']],'a test sűrűsége: kisebb · egyenlő · nagyobb')
};
FIG.archi = FIG.archi.replace(/<line x1="155" y1="110"[^>]*>/,'');

window.LESSON = {
  id:'vizlevego',
  screens:[
  { type:'info', section:'Tanulás', icon:'♨️', title:'Hőterjedés', fig:FIG.heat,
    body:'<p>A hő háromféleképpen terjedhet:</p><ul><li><mark class="e1">Hővezetés</mark>: szilárd anyagokban, folyadékokban és gázokban. Pl. a forró kanál nyele felmelegszik.</li><li><mark class="e4">Hőáramlás</mark>: folyadékokban és gázokban. A meleg levegő vagy víz <b>felfelé áramlik</b>.</li><li><mark class="e2">Hősugárzás</mark>: <b>nincs szükség közvetítő közegre</b>. Így jön a napfény is a Földre.</li></ul><p>Amiben <b>gyorsan</b> terjed a hő, az a <mark class="k">hővezető</mark> (fém). Amiben <b>lassan</b>, az a <mark class="k">hőszigetelő</mark> (fa, műanyag, levegő, gyapjú).</p>',
    mc:'<p>A forró lávakő melletti blokk felmelegszik: hővezetés. A tűz feletti levegő felfelé száll: hőáramlás. A nap melegít: hősugárzás.</p>',
    src:'76–79. oldal' },

  { type:'info', section:'Tanulás', icon:'📏', title:'Hőtágulás', fig:FIG.expand,
    body:'<p>Melegítéskor a testek <mark class="k">kitágulnak</mark>, lehűléskor összehúzódnak. Ez a <mark class="k">hőtágulás</mark>.</p><p>A hőtágulás annál nagyobb, minél:</p><ul><li><b>nagyobb a hőmérséklet-változás</b>,</li><li><b>nagyobb a kezdeti hosszúság vagy térfogat</b>,</li><li>az anyagtól is függ (szilárd és folyékony anyagoknál).</li></ul><p>Ezért hagynak <b>hézagot</b> a vasúti sínek, a hidak elemei között.</p>',
    tip:'<p>A hőmérő is a hőtágulást használja: melegítéskor a folyadék kitágul, és feljebb emelkedik a csőben.</p>',
    src:'78–79. oldal' },

  { type:'info', section:'Tanulás', icon:'🧊', title:'Olvadás és fagyás',
    body:'<p><mark class="k">Olvadás</mark>: a szilárd anyag folyékonnyá válik. Közben az anyag <b>energiát vesz fel</b>.</p><p><mark class="k">Fagyás</mark>: a folyadék szilárddá válik. Közben <b>energiát ad le</b>.</p><ul><li>Az <b>olvadáspont</b> az a hőmérséklet, amelyen az anyag megolvad. A jégé, a vasé, az aranyé egyenlő a fagyásponttal.</li><li>Néhány anyag (pl. az üveg, a vaj) nincs határozott olvadáspontja: fokozatosan lágyul.</li></ul><p>A víz különleges: <b>4 °C-on</b> a legnagyobb a sűrűsége, vagyis a térfogata a legkisebb.</p>',
    mc:'<p>Ha lávát öntesz hideg vízre, a láva megszilárdul. A fagyás energialeadással jár.</p>',
    tip:'<p>A jég olvadáspontja <b>0 °C</b>. Olvadás közben a hőmérséklet <b>nem változik</b>, mert a felvett energia a részecskék szétválasztására fordítódik.</p>',
    src:'80–83. oldal' },

  { type:'info', section:'Tanulás', icon:'💨', title:'Párolgás, forrás, lecsapódás', fig:FIG.phases,
    body:'<ul><li><mark class="k">Párolgás</mark>: a folyadék légneművé válik. <b>Minden hőmérsékleten</b>, a <b>felszínen</b> történik. A párolgó folyadék <b>hűti</b> a környezetét (ezért izzadunk).</li><li><mark class="k">Forrás</mark>: a folyadék <b>belsejében</b> is gőz képződik. A hőmérsékletet <b>forráspontnak</b> hívjuk. Forrás közben az anyag <b>hőt vesz fel</b>, a hőmérséklete nem nő.</li><li><mark class="k">Lecsapódás</mark>: a légnemű anyag folyékonnyá válik. Közben az anyag energiája <b>csökken</b>, a környezeté <b>nő</b>.</li></ul><p>A párolgás sebessége függ: az anyagtól, a levegő páratartalmától és a párolgó felület nagyságától.</p>',
    tip:'<p>A <b>forráspont függ a nyomástól</b>. Hegytetőn kisebb a nyomás, ezért ott kisebb hőmérsékleten forr a víz.</p>',
    src:'84–87. oldal' },

  { type:'info', section:'Tanulás', icon:'🤝', title:'Termikus kölcsönhatás',
    body:'<p>Ha két <b>különböző hőmérsékletű</b> test érintkezik, <mark class="k">termikus kölcsönhatás</mark> jön létre.</p><p>Közben <b>energiaátadás</b> történik, és ez addig tart, amíg a két test <b>hőmérséklete egyenlő</b> nem lesz.</p><p>A kialakuló közös hőmérséklet függ:</p><ul><li>a testek <b>kiindulási hőmérsékletétől</b>,</li><li>a két test <b>tömegétől</b>,</li><li>a két test <b>anyagi minőségétől</b>.</li></ul><p>A melegebb test hűl, a hidegebb melegszik. Amennyit az egyik lead, annyit vesz fel a másik.</p>',
    mc:'<p>Ha egy forró teát hideg vízbe teszel, a tea hűl, a víz melegszik, és végül ugyanakkora lesz a hőmérsékletük.</p>',
    src:'88–90. oldal' },

  { type:'info', section:'Tanulás', icon:'👇', title:'A nyomás', fig:FIG.press,
    body:'<p>A <mark class="k">nyomás</mark> megmutatja, mekkora erő hat <b>egy felületre</b>.</p><ul><li><b>p = F : A</b> (nyomóerő : nyomott felület)</li><li>Mértékegysége: <b>Pa</b> (pascal) = N/m²</li></ul><p>A nyomás <b>nő</b>, ha növeljük az erőt vagy <b>csökkentjük a felületet</b>.</p><p>A nyomás <b>csökken</b>, ha csökkentjük az erőt vagy <b>növeljük a felületet</b>.</p>',
    tip:'<p>Ezért vág a <b>késél</b> (kis felület, nagy nyomás), és ezért nem süllyedsz a hóba <b>síléccel</b> (nagy felület, kis nyomás).</p>',
    mc:'<p>Ha a kezeddel nyomod a talajt, kicsi a nyomás. Ha egy hegyes csákánnyal ütsz, ugyanakkora erő sokkal nagyobb nyomást kelt.</p>',
    src:'91–93. oldal' },

  { type:'info', section:'Tanulás', icon:'🌊', title:'Hidrosztatikai nyomás', fig:FIG.hydro,
    body:'<p>A folyadék <b>súlyából</b> származó nyomás a <mark class="k">hidrosztatikai nyomás</mark>.</p><ul><li><b>p = ρ · h · g</b></li><li>ρ: a folyadék sűrűsége, h: a mélység, g ≈ 10 m/s²</li></ul><p>Annál nagyobb, minél:</p><ul><li><b>mélyebben</b> vagyunk,</li><li><b>sűrűbb</b> a folyadék.</li></ul><p>Azonos mélységben a nyomás <b>minden irányban ugyanakkora</b>. A nyomást <b>manométerrel</b> mérjük.</p>',
    mc:'<p>Minél mélyebbre úszol a Minecraft tengerében, annál jobban nyom a víz. A búvároknak is ezért fáj a fülük mélyen.</p>',
    tip:'<p>1 m mély vízben a nyomás 1000 · 1 · 10 = <b>10 000 Pa</b>. 10 m mélyen már 100 000 Pa.</p>',
    src:'94–96. oldal' },

  { type:'info', section:'Tanulás', icon:'🌬️', title:'A légnyomás', fig:FIG.air,
    body:'<p>A levegőnek is van súlya. A levegő súlyából származó, <b>minden irányba</b> ható nyomás a <mark class="k">légnyomás</mark>.</p><ul><li>Tengerszinten: <b>101,3 kPa</b> (kb. 100 000 Pa).</li><li>Mérése: <b>barométerrel</b>.</li><li>Függ a <b>levegőoszlop magasságától</b>: hegyen kisebb.</li></ul><p>A nyomáskülönbséget használja a <b>pumpa</b>, a <b>szódásszifon</b> és a <b>szívószál</b> is.</p>',
    tip:'<p>1 kPa = 1000 Pa. Ezért 101,3 kPa = 101 300 Pa.</p>',
    src:'97–100. oldal' },

  { type:'info', section:'Tanulás', icon:'🔗', title:'Közlekedőedények és hajszálcsövesség', fig:FIG.utube,
    body:'<p><mark class="k">Közlekedőedény</mark>: felül nyitott edények vagy csövek rendszere, amelynek ágai között a folyadék <b>szabadon áramolhat</b>.</p><p>Minden ágban a nyugvó folyadék felszíne <b>ugyanabban a vízszintes síkban</b> van. Ezen alapul a vízmérték, a kávéskanna, az artézi kút.</p><p><mark class="k">Hajszálcső</mark>: nagyon kicsi belső átmérőjű cső. Benne a víz felszíne <b>magasabban</b> áll, mint kint. Ezt <mark class="k">hajszálcsövességnek</mark> nevezzük. Így jut fel a víz a növényekben, és így szívja fel a víz a kendő.</p>',
    src:'101–103. oldal' },

  { type:'info', section:'Tanulás', icon:'🛟', title:'Arkhimédész törvénye', fig:FIG.archi,
    body:'<p>Minden folyadékba (vagy gázba) merülő testre <mark class="k">felhajtóerő</mark> hat.</p><p><b>Arkhimédész törvénye:</b> a felhajtóerő nagysága <b>egyenlő a test által kiszorított folyadék súlyával</b>.</p><p>A kiszorított folyadék súlya függ:</p><ul><li>a test <b>folyadékba merülő térfogatától</b>,</li><li>a folyadék <b>sűrűségétől</b>.</li></ul><p><b>Példa:</b> egy kocka 5 liter vizet szorít ki. A víz 1 kg/liter, ezért a kiszorított víz tömege 5 kg, súlya 50 N. A felhajtóerő <b>50 N</b>.</p>',
    mc:'<p>Ezért érzed könnyebbnek magad a vízben, és ezért tudsz felemelni egy nehéz követ a víz alatt.</p>',
    src:'104–106. oldal' },

  { type:'info', section:'Tanulás', icon:'🚢', title:'Úszás, lebegés, merülés', fig:FIG.float,
    body:'<p>Hogy mi történik egy testtel a folyadékban, az a <b>sűrűségétől</b> függ:</p><ul><li><mark class="e2">Úszik</mark>: ρ test &lt; ρ folyadék. Itt <b>Fg = Ff</b> (a gravitációs erő egyenlő a felhajtóerővel). A test egy része kilóg.</li><li><mark class="k">Lebeg</mark>: ρ test = ρ folyadék. Itt is <b>Fg = Ff</b>, a test teljesen bent van, és bárhol megáll.</li><li><mark class="e1">Elmerül</mark>: ρ test &gt; ρ folyadék. <b>Fg &gt; Ff</b>, a test lesüllyed.</li></ul>',
    tip:'<p>A hajó vasból van, mégis úszik! Mert nagy a térfogata, így <b>átlagos sűrűsége kisebb a vízénél</b>.</p>',
    src:'107–110. oldal' },

  { type:'info', section:'Tanulás', icon:'📋', title:'Ennyit kell tudni',
    body:'<ul><li>Hőterjedés: <b>vezetés, áramlás, sugárzás</b>. Hőtágulás: melegítéskor tágul.</li><li>Olvadás, fagyás, párolgás, forrás, lecsapódás. Olvadáskor és forráskor energiát <b>vesz fel</b>, fagyáskor és lecsapódáskor <b>ad le</b>.</li><li>Termikus kölcsönhatás: a hőmérsékletek kiegyenlítődnek.</li><li>Nyomás: <b>p = F : A</b> (Pa). Hidrosztatikai: <b>p = ρ · h · g</b>.</li><li>Légnyomás: 101,3 kPa, barométerrel mérjük.</li><li>Közlekedőedény: azonos szint. Hajszálcsövesség: felszívás.</li><li>Arkhimédész: <b>Ff = a kiszorított folyadék súlya</b>.</li><li>Úszik, lebeg, elmerül: a sűrűségektől függ.</li></ul><p><b>Most jön a játék! 🎮</b></p>',
    src:'111. oldal – összefoglalás' },

  /* ===== JÁTÉKOK ===== */
  { type:'match', section:'Játék 1', title:'🔗 Párosítás: halmazállapot-változások',
    pairs:[['szilárd → folyadék','olvadás'],['folyadék → szilárd','fagyás'],['folyadék → gáz','párolgás, forrás'],['gáz → folyadék','lecsapódás'],['0 °C','a jég olvadáspontja'],['100 °C','a víz forráspontja']] },

  { type:'tf', section:'Játék 2', title:'⚡ Igaz vagy hamis?',
    items:[
      {t:'A hősugárzáshoz közvetítő közeg kell.', a:false, why:'A hősugárzás közvetítő közeg nélkül is terjed (a napfény is).'},
      {t:'Olvadáskor az anyag energiát vesz fel.', a:true, why:'Az olvadásra fordítódik, közben a hőmérséklet nem változik.'},
      {t:'A párolgás csak 100 °C-on történik.', a:false, why:'A párolgás minden hőmérsékleten megtörténik, a felszínen.'},
      {t:'Minél nagyobb a felület, annál kisebb a nyomás ugyanakkora erőnél.', a:true, why:'p = F : A, nagyobb A-nál kisebb p.'},
      {t:'A légnyomás tengerszinten kb. 101,3 kPa.', a:true, why:'Ezt barométerrel mérjük.'},
      {t:'Ha a test sűrűsége nagyobb a folyadékénál, a test úszik.', a:false, why:'Akkor elmerül. Úszik, ha a sűrűsége kisebb.'}
    ]},

  { type:'memory', section:'Játék 3', title:'🧠 Memóriajáték',
    pairs:[['p','nyomás'],['Pa','pascal'],['ρ','sűrűség'],['Ff','felhajtóerő'],['barométer','légnyomásmérő'],['manométer','folyadék nyomásmérő']] },

  { type:'drag', section:'Játék 4', title:'📦 Úszik, lebeg vagy elmerül?',
    bins:[{id:'uszik',name:'Úszik',icon:'🛶'},{id:'lebeg',name:'Lebeg',icon:'🤿'},{id:'merul',name:'Elmerül',icon:'⚓'}],
    items:[{t:'fa a vízben',c:'uszik'},{t:'jég a vízben',c:'uszik'},{t:'olajfolt a vízen',c:'uszik'},{t:'vas a vízben',c:'merul'},{t:'kő a vízben',c:'merul'},{t:'ugyanolyan sűrű test, mint a víz',c:'lebeg'}] },

  { type:'drag', section:'Játék 5', title:'📦 Hőterjedés: vezetés, áramlás, sugárzás?',
    bins:[{id:'vez',name:'Hővezetés',icon:'🥄'},{id:'aram',name:'Hőáramlás',icon:'🌀'},{id:'sug',name:'Hősugárzás',icon:'☀️'}],
    items:[{t:'a forró kanál nyele felmelegszik',c:'vez'},{t:'a meleg levegő felszáll a radiátor felett',c:'aram'},{t:'a napfény melegít',c:'sug'},{t:'a tűz melege messziről is érezhető',c:'sug'},{t:'a forró víz mozgása a fazékban',c:'aram'},{t:'a hideg vasrúd egyik vége a tűzben',c:'vez'}] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'A nyomás kiszámítása: erő osztva ___. A nyomás mértékegysége a ___. A légnyomást ___ mérjük. Az úszó test sűrűsége ___, mint a folyadéké.',
    answers:['felülettel','pascal','barométerrel','kisebb'], extra:['idővel','manométerrel','nagyobb'],
    explain:'p = F : A. Az úszó test sűrűsége kisebb a folyadékénál.' },

  /* ===== DOLGOZAT GYAKORLÓ ===== */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'A szilárd anyag folyadékká válása az ___. Forrás közben az anyag hőt ___. A víz sűrűsége ___ °C-on a legnagyobb. A hidrosztatikai nyomás a ___ növekedésével nő. Arkhimédész törvénye szerint a ___ egyenlő a kiszorított folyadék súlyával.',
    answers:['olvadás','vesz fel','4','mélység','felhajtóerő'], extra:['ad le','0','tömeg'],
    explain:'Ezek a Víz és levegő fejezet alapfogalmai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze a fogalmat a képlettel!',
    pairs:[['nyomás','p = F : A'],['hidrosztatikai nyomás','p = ρ · h · g'],['sűrűség','ρ = m : V'],['felhajtóerő','a kiszorított folyadék súlya'],['légnyomás tengerszinten','101,3 kPa']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'A fém jó hővezető.', a:true, why:'A fémekben gyorsan terjed a hő.'},
      {t:'A párolgó folyadék hűti a környezetét.', a:true, why:'Ezért hűt az izzadás is.'},
      {t:'A forráspont független a nyomástól.', a:false, why:'A forráspont függ a nyomástól.'},
      {t:'A közlekedőedény ágaiban a folyadék ugyanabban a szintben áll.', a:true, why:'Ez a közlekedőedények törvénye.'},
      {t:'A hajszálcsőben a víz felszíne alacsonyabban áll, mint kívül.', a:false, why:'Magasabban áll: ez a hajszálcsövesség.'},
      {t:'A lebegő testre ható felhajtóerő egyenlő a gravitációs erővel.', a:true, why:'Fg = Ff, ezért marad egy helyben.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Mi történik termikus kölcsönhatáskor?',
    options:['A két test hőmérséklete kiegyenlítődik.','A két test hőmérséklete távolodik.','Mindkét test felmelegszik.','Semmi sem változik.'], correct:0, explain:'Az energiaátadás addig tart, amíg a hőmérsékletek egyenlők nem lesznek.', hint:'A meleg lead, a hideg felvesz.' },
  { type:'quiz', section:'Dolgozat', q:'5. Miért süllyed kevésbé a hóba az, aki sílécen áll?',
    options:['Mert nagyobb a felület, így kisebb a nyomás.','Mert könnyebb.','Mert kisebb a sűrűsége.','Mert a hó melegebb.'], correct:0, explain:'p = F : A. Nagyobb A-nál kisebb a nyomás.', hint:'Gondolj p = F : A-ra.' },
  { type:'quiz', section:'Dolgozat', q:'6. Mikor forr kisebb hőmérsékleten a víz?',
    options:['hegytetőn, kisebb nyomásnál','tengerszinten','nyomás alatt','mélyen a víz alatt'], correct:0, explain:'A forráspont függ a nyomástól. Kisebb nyomásnál alacsonyabb.', hint:'Hegyen kisebb a légnyomás.' },
  { type:'quiz', section:'Dolgozat', q:'7. Mitől függ a kiszorított folyadék súlya?',
    options:['a merülő térfogattól és a folyadék sűrűségétől','a test színétől','a test alakjától csak','a víz hőmérsékletétől csak'], correct:0, explain:'Arkhimédész törvénye szerint ezektől függ a felhajtóerő.', hint:'Térfogat és sűrűség.' },
  { type:'quiz', section:'Dolgozat', q:'8. Egy test elmerül a vízben. Mit tudunk?',
    options:['Sűrűbb a víznél, és Fg > Ff.','Könnyebb a víznél.','Sűrűsége egyenlő a vízével.','Fg < Ff.'], correct:0, explain:'Elmerül, ha a sűrűsége nagyobb, és a gravitációs erő nagyobb a felhajtóerőnél.', hint:'Fg > Ff.' },

  { type:'calc', section:'Dolgozat', count:6, gens:[
    function(){ var p=pick([10,20,50,100,200]), A=pick([2,4,5,10]);
      return {q:'<b>'+fmt(p*A)+' N</b> erő hat <b>'+A+' m²</b> felületre. <b>Mekkora a nyomás?</b> (Pa)', a:p, u:'Pa', hint:'p = F : A.', explain:fmt(p*A)+' : '+A+' = '+p+' Pa.'}; },
    function(){ var p=pick([10,20,50,100]), A=pick([2,4,5]);
      return {q:'A nyomás <b>'+p+' Pa</b>, a felület <b>'+A+' m²</b>. <b>Mekkora erő hat?</b> (N)', a:p*A, u:'N', hint:'F = p · A.', explain:p+' · '+A+' = '+(p*A)+' N.'}; },
    function(){ var h=pick([1,2,3,5,10]);
      return {q:'<b>'+h+' m</b> mélyen vízben (ρ = 1000 kg/m³, g = 10 m/s²) <b>mekkora a hidrosztatikai nyomás?</b> (Pa)', a:1000*h*10, u:'Pa', hint:'p = ρ · h · g.', explain:'1000 · '+h+' · 10 = '+fmt(10000*h)+' Pa.'}; },
    function(){ var V=pick([2,5,10,20]);
      return {q:'Egy test <b>'+V+' liter</b> vizet szorít ki. <b>Mekkora a felhajtóerő?</b> (1 liter víz tömege 1 kg, g = 10 m/s²) (N)', a:V*10, u:'N', hint:'A kiszorított víz tömege V kg, súlya 10-szer ennyi N.', explain:V+' kg víz súlya '+(V*10)+' N.'}; },
    function(){ var m=pick([2,4,5,8]), V=pick([2,4,5]);
      return {q:'Egy test tömege <b>'+(m*V)+' g</b>, térfogata <b>'+V+' cm³</b>. <b>Mekkora a sűrűsége?</b> (g/cm³) Ha ez nagyobb mint 1, elmerül a vízben.', a:m, u:'g/cm³', hint:'ρ = m : V.', explain:(m*V)+' : '+V+' = '+m+' g/cm³.'}; },
    function(){ var kPa=pick([90,95,100,101]);
      return {q:'<b>'+kPa+' kPa</b> hány pascal? (Pa)', a:kPa*1000, u:'Pa', hint:'1 kPa = 1000 Pa.', explain:kPa+' · 1000 = '+fmt(kPa*1000)+' Pa.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['A hő terjedésének módjai','Hővezetés, hőáramlás, hősugárzás.'],
      ['Hővezető és hőszigetelő','Hővezető: gyorsan terjed benne a hő (fém). Hőszigetelő: lassan (fa, gyapjú).'],
      ['Olvadás és fagyás','Olvadás: szilárd → folyadék, energiát vesz fel. Fagyás: folyadék → szilárd, energiát ad le.'],
      ['Párolgás vagy forrás?','Párolgás: minden hőmérsékleten, a felszínen. Forrás: a folyadék belsejében is, forráspontnál.'],
      ['Lecsapódás','Gáz → folyadék. Az anyag energiája csökken.'],
      ['Nyomás','p = F : A, mértékegysége Pa (N/m²).'],
      ['Hidrosztatikai nyomás','p = ρ · h · g. Mélyebben nagyobb.'],
      ['Légnyomás','Tengerszinten 101,3 kPa. Barométerrel mérjük.'],
      ['Közlekedőedény','Az ágakban a folyadék szintje egyenlő.'],
      ['Arkhimédész törvénye','A felhajtóerő egyenlő a kiszorított folyadék súlyával.'],
      ['Mikor úszik a test?','Ha a sűrűsége kisebb a folyadékénál (Fg = Ff).'],
      ['Mikor merül el a test?','Ha a sűrűsége nagyobb (Fg > Ff).']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
