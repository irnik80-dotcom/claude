/* Mozgás és erő – Fizika 7., III. fejezet (a vázlat és a tankönyv alapján) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var FIG = {
  path: SV.svg('Út és elmozdulás: a pálya hosszú, az elmozdulás egyenes',
    '<path d="M40 110 Q80 20 150 70 T270 50" fill="none" stroke="#2f7fd1" stroke-width="5" stroke-dasharray="10 6"/>'+
    '<line x1="40" y1="110" x2="270" y2="50" stroke="#d6403f" stroke-width="5"/><polygon points="272,50 252,44 256,64" fill="#d6403f"/>'+
    SV.r(28,100,24,24,'#ffd23f')+SV.t(40,118,'A',14,'middle','#1b2618')+SV.r(262,36,24,24,'#ffd23f')+SV.t(274,54,'B',14,'middle','#1b2618')+
    SV.t(130,40,'pálya (út)',13,'middle','#2f7fd1')+SV.t(190,125,'elmozdulás',13,'middle','#d6403f')),
  speed: SV.svg('Sebesség: v egyenlő s osztva t-vel',
    SV.r(110,12,100,50,'#ffd23f')+SV.t(160,48,'s',32,'middle','#1b2618')+
    SV.r(40,80,100,50,'#9fe07f')+SV.t(90,116,'v',32,'middle','#1b2618')+SV.r(180,80,100,50,'#8fc2f5')+SV.t(230,116,'t',32,'middle','#1b2618')+
    SV.t(160,152,'v = s : t   s = v · t   t = s : v',12)),
  conv: SV.svg('m/s és km/h átváltása',
    SV.r(25,40,100,50,'#9fe07f')+SV.t(75,72,'m/s',20,'middle','#1b2618')+
    SV.r(195,40,100,50,'#8fc2f5')+SV.t(245,72,'km/h',20,'middle','#1b2618')+
    SV.arrow(130,55,190,'#2f7fd1')+SV.t(160,45,'· 3,6',13)+
    '<line x1="190" y1="78" x2="140" y2="78" stroke="#d6403f" stroke-width="5"/><polygon points="130,78 148,68 148,88" fill="#d6403f"/>'+SV.t(160,106,': 3,6',13)+
    SV.t(160,140,'10 m/s = 36 km/h',13)),
  graph: SV.graphST([{k:20,c:'#d6403f',n:'A'},{k:10,c:'#2f7fd1',n:'B'}]),
  vt: SV.svg('Egyenletes mozgás: a sebesség állandó',
    '<line x1="40" y1="130" x2="300" y2="130" stroke="currentColor" stroke-width="3"/><line x1="40" y1="130" x2="40" y2="15" stroke="currentColor" stroke-width="3"/>'+
    '<line x1="40" y1="55" x2="290" y2="55" stroke="#2f7fd1" stroke-width="6"/>'+SV.t(300,148,'t',13,'end')+SV.t(48,18,'v',13,'start')+SV.t(165,45,'vízszintes vonal: v nem változik',12)),
  accel: SV.svg('Gyorsulás: a sebesség egyenletesen nő',
    '<line x1="40" y1="130" x2="300" y2="130" stroke="currentColor" stroke-width="3"/><line x1="40" y1="130" x2="40" y2="15" stroke="currentColor" stroke-width="3"/>'+
    '<line x1="40" y1="130" x2="280" y2="30" stroke="#d6403f" stroke-width="6"/>'+SV.t(300,148,'t',13,'end')+SV.t(48,18,'v',13,'start')+SV.t(190,100,'a = Δv : Δt',14,'start')),
  fall: SV.svg('Szabadesés: g körülbelül 10 m/s²',
    SV.r(50,20,24,24,'#e8d38a')+SV.t(62,72,'0 m/s',11)+SV.r(120,50,24,24,'#e8d38a')+SV.t(132,100,'10 m/s',11)+SV.r(190,80,24,24,'#e8d38a')+SV.t(202,128,'20 m/s',11)+SV.r(255,110,24,24,'#e8d38a')+SV.t(267,150,'30 m/s',11)+
    SV.t(160,14,'minden másodpercben +10 m/s',12)),
  bus: SV.svg('Tehetetlenség: a busz megáll, te előre dőlsz',
    SV.r(30,60,170,60,'#f2b705')+SV.r(45,70,28,24,'#cfe9ff')+SV.r(85,70,28,24,'#cfe9ff')+SV.r(125,70,28,24,'#cfe9ff')+SV.r(48,125,22,22,'#222')+SV.r(160,125,22,22,'#222')+
    SV.r(105,40,22,30,'#3b6ea5')+SV.arrow(130,28,185,'#d6403f')+SV.t(235,70,'a busz fékez',12)+SV.t(235,90,'te előre dőlsz',12)),
  force: SV.svg('Az erőt nyíllal rajzoljuk, mert iránya is van',
    SV.r(110,70,70,40,'#a9743a')+SV.arrow(105,90,40,'#d6403f')+SV.t(60,75,'F',20)+SV.arrow(185,90,260,'#2f7fd1')+SV.t(240,75,'F',20)+SV.t(160,140,'mérés: rugós erőmérővel, mértékegység: N (newton)',11)),
  fg: SV.svg('Gravitációs erő, tartóerő és súly',
    SV.r(125,70,70,40,'#a9743a')+SV.r(100,110,120,14,'#555')+
    '<line x1="160" y1="110" x2="160" y2="150" stroke="#d6403f" stroke-width="5"/><polygon points="160,160 150,142 170,142" fill="#d6403f"/>'+SV.t(235,148,'Fg (lefelé)',12,'start')+
    '<line x1="150" y1="68" x2="150" y2="28" stroke="#2e8b2e" stroke-width="5"/><polygon points="150,18 140,36 160,36" fill="#2e8b2e"/>'+SV.t(165,32,'Ft (tartóerő, felfelé)',12,'start')+
    SV.t(40,95,'G (súly):',12,'start')+SV.t(40,111,'a test nyomja',12,'start')+SV.t(40,127,'az asztalt',12,'start')),
  friction: SV.svg('Súrlódás: két felület között fékezi a mozgást',
    SV.r(80,60,80,40,'#a9743a')+SV.r(60,100,200,14,'#555')+SV.arrow(75,80,20,'#2f7fd1')+SV.t(40,70,'mozgás',11)+SV.arrow(165,108,225,'#d6403f')+SV.t(230,100,'Fs',16,'start')+
    SV.t(160,145,'gördülési < csúszási < tapadási súrlódás',12))
};

window.LESSON = {
  id:'mozgas',
  screens:[
  { type:'info', section:'Tanulás', icon:'🏃', title:'Pálya, út, elmozdulás', fig:FIG.path,
    body:'<p>A mozgásnál három fogalmat kell megkülönböztetni:</p><ul><li><mark class="k">Pálya</mark>: a vonal, amin a test végigmegy (mint a nyom a hóban).</li><li><mark class="k">Út</mark> (jele: <b>s</b>): a pálya <b>hossza</b>. Mértékegysége: méter (m).</li><li><mark class="k">Elmozdulás</mark>: egyenes nyíl az indulástól az érkezésig. Általában <b>rövidebb</b>, mint az út.</li></ul><p>Csak <b>egyenes pályán</b> egyenlő az út és az elmozdulás. Ez az egyenes vonalú mozgás.</p>',
    mc:'<p>Ha Minecraftban kanyargó úton mész A-ból B-be, az út hosszú. De ha egyenesen odarepülnél, az elmozdulás a kettő közti egyenes nyíl.</p>',
    src:'33–36. oldal' },

  { type:'info', section:'Tanulás', icon:'⏱️', title:'Sebesség: milyen gyorsan megy?', fig:FIG.speed,
    body:'<p>A <mark class="k">sebesség</mark> megmutatja, <b>mekkora utat</b> tesz meg a test <b>egy idő alatt</b>.</p><ul><li><b>v = s : t</b> (sebesség = út : idő)</li><li><b>s = v · t</b> és <b>t = s : v</b></li><li>Jele: <b>v</b> · Mértékegysége: <b>m/s</b> vagy <b>km/h</b></li></ul><p>A sebességnek <b>iránya</b> is van.</p><p>Takard le a háromszögben azt, amit keresel. Ami marad, megmondja a műveletet.</p><p><b>Példa:</b> az autó 2 óra alatt 216 km-t tesz meg. v = 216 km : 2 h = <b>108 km/h</b>.</p>',
    mc:'<p>Ha 20 blokkot futsz 4 másodperc alatt, a sebességed 20 : 4 = 5 blokk másodpercenként.</p>',
    tip:'<p>Ha út <b>méterben</b> és idő <b>másodpercben</b> van, a sebesség <b>m/s</b>. Ha út <b>km</b> és idő <b>óra</b>, akkor <b>km/h</b>. Ne keverd őket!</p>',
    src:'37–39. oldal' },

  { type:'info', section:'Tanulás', icon:'🔄', title:'m/s és km/h átváltása', fig:FIG.conv,
    body:'<ul><li><b>m/s → km/h</b>: szorozd <mark class="k">3,6</mark>-tal.</li><li><b>km/h → m/s</b>: oszd <mark class="k">3,6</mark>-tal.</li></ul><p>Példák:</p><ul><li>10 m/s = 10 · 3,6 = <b>36 km/h</b></li><li>72 km/h = 72 : 3,6 = <b>20 m/s</b></li></ul><p><b>Átlagsebesség</b> = összes út : összes idő.</p><p>A sebességmérő óra a <b>pillanatnyi</b> sebességet mutatja.</p>',
    tip:'<p>Egyszerű emlékeztető: a <b>km/h a „nagyobb szám”</b>. Ezért m/s-ból km/h-ba <b>szorzol</b>, km/h-ból m/s-ba <b>osztasz</b>.</p>',
    src:'37–39. oldal' },

  { type:'info', section:'Tanulás', icon:'📈', title:'Egyenletes mozgás és grafikon', fig:FIG.graph,
    body:'<p><mark class="k">Egyenletes mozgás</mark>: a test <b>egyenlő idők alatt egyenlő utakat</b> tesz meg. A sebessége nem változik. Pl. mozgólépcső, tempomattal haladó autó.</p><p><b>Út–idő grafikon</b>: ferde egyenes a 0-ból. <mark class="k">Meredekebb = gyorsabb</mark>.</p><p>Az ábrán az <b>A</b> gyorsabb, mert meredekebb. A sebességét leolvashatod: 80 m : 4 s = 20 m/s. A B-é: 20 m : 2 s = 10 m/s.</p>',
    tip:'<p>A grafikonról a sebességet így kapod: válassz egy pontot, és oszd el az utat az idővel. <b>v = s : t</b>.</p>',
    src:'37–39. oldal' },

  { type:'info', section:'Tanulás', icon:'➖', title:'Sebesség–idő grafikon', fig:FIG.vt,
    body:'<p>Egyenletes mozgásnál a <b>sebesség–idő grafikon</b> egy <mark class="k">vízszintes vonal</mark>. A sebesség nem változik.</p><p>Összefoglalva:</p><ul><li><b>s–t grafikon</b>: ferde egyenes a 0-ból</li><li><b>v–t grafikon</b>: vízszintes vonal</li></ul>',
    src:'37–39. oldal' },

  { type:'info', section:'Tanulás', icon:'🚀', title:'Változó mozgás és gyorsulás', fig:FIG.accel,
    body:'<p>Ha a sebesség <b>változik</b>, <mark class="k">változó mozgásról</mark> beszélünk. Ha a sebesség minden másodpercben <b>ugyanannyival</b> nő, a mozgás <mark class="k">egyenletesen gyorsuló</mark>. Pl. a lejtőn leguruló golyó.</p><p><mark class="k">Gyorsulás (a)</mark>: mennyivel nő a sebesség <b>1 másodperc</b> alatt.</p><ul><li><b>a = Δv : Δt</b> (Δ = „változás”)</li><li>Mértékegysége: <b>m/s²</b></li></ul><p><b>Példa:</b> a sebesség 4 s alatt 0-ról 20 m/s-ra nő. a = 20 : 4 = <b>5 m/s²</b>.</p>',
    mc:'<p>Ha elindulsz a minecartban, és másodpercenként 2 m/s-mal gyorsulsz, akkor a = 2 m/s².</p>',
    tip:'<p><b>Nő</b> a sebesség → gyorsuló mozgás. <b>Csökken</b> → lassuló mozgás. <b>Nem változik</b> → a gyorsulás 0.</p>',
    src:'40–42. oldal' },

  { type:'info', section:'Tanulás', icon:'🍎', title:'Szabadesés', fig:FIG.fall,
    body:'<p>Ha leejtünk valamit, a Föld vonzása <b>lefelé gyorsítja</b>. Ez a <mark class="k">szabadesés</mark>.</p><p>Levegő nélkül <b>minden test ugyanolyan gyorsan esik</b>. A pingponglabda és a gumilabda szinte egyszerre ér le.</p><p>A <mark class="k">nehézségi gyorsulás</mark>: <b>g ≈ 10 m/s²</b> (pontosan 9,81). Minden másodpercben 10 m/s-mal nő az eső test sebessége.</p>',
    mc:'<p>Egy homokblokk is így esik: másodpercről másodpercre egyre gyorsabban.</p>',
    tip:'<p>A <b>levegő</b> miatt esik lassabban a papírlap, mint a gombóc. Légüres térben egyszerre érnének le.</p>',
    src:'40–42. oldal' },

  { type:'info', section:'Tanulás', icon:'💪', title:'Mi az erő?', fig:FIG.force,
    body:'<p>Az <mark class="k">erő</mark> az a hatás, ami megváltoztatja egy test <b>mozgását</b> (elindítja, megállítja, gyorsítja, elfordítja) vagy az <b>alakját</b> (megnyújtja a gumikötelet).</p><ul><li>Jele: <b>F</b></li><li>Mértékegysége: <mark class="k">newton</mark> (N)</li><li>Mérése: <b>rugós erőmérő</b></li></ul><p>Az erőt <b>nyíllal</b> rajzoljuk, mert <b>iránya</b> is van.</p>',
    tip:'<p>1 N kb. akkora erő, amennyivel egy 10 dkg-os (kis alma) testet tartasz a kezedben.</p>',
    src:'43–45. oldal' },

  { type:'info', section:'Tanulás', icon:'🛑', title:'Newton I. törvénye: tehetetlenség', fig:FIG.bus,
    body:'<p>Minden test „lusta”: <b>marad nyugalomban</b>, vagy <b>megy tovább egyenesen, ugyanúgy</b>, amíg valami meg nem változtatja.</p><p>Ezt hívjuk <mark class="k">tehetetlenségnek</mark>.</p><p>Ezért dőlünk előre, amikor a busz hirtelen fékez. A busz megáll, de a tested még megy előre. <b>Ezért kell a biztonsági öv!</b></p>',
    mc:'<p>Gondolj egy gyorsan haladó minecartra, ami hirtelen megáll: ami benne ül, az még megy előre. Ez a tehetetlenség.</p>',
    src:'46–48. oldal' },

  { type:'info', section:'Tanulás', icon:'⚖️', title:'Tömeg és Newton II. törvénye',
    body:'<p><mark class="k">Tömeg</mark> (jele: <b>m</b>, mértékegysége: <b>kg</b>) a tehetetlenség mértéke. A nagyobb tömegű testet <b>nehezebb mozgásba hozni</b>. A kislabdát messzebb dobod, mint a 3 kg-os medicinlabdát.</p><p><b>II. törvény:</b> minél nagyobb az erő, annál jobban gyorsul a test. Minél nagyobb a tömeg, annál kevésbé.</p><p><mark class="k">F = m · a</mark></p><p><b>Példa:</b> egy 2 kg-os kocsit 3 m/s²-tel gyorsítunk. F = 2 · 3 = <b>6 N</b>.</p>',
    src:'46–48. oldal' },

  { type:'info', section:'Tanulás', icon:'⬇️', title:'Erőfajták: gravitáció, tartóerő, súly', fig:FIG.fg,
    body:'<ul><li><mark class="k">Gravitációs erő (Fg)</mark>: a Föld mindent lefelé húz. <b>Fg = m · g</b>. Pl. 2 kg → 20 N.</li><li><mark class="k">Tartóerő (Ft)</mark>: az asztal vagy a kötél felfelé tartja a testet, ezért nem esik le.</li><li><mark class="k">Súly (G)</mark>: ezzel az erővel nyomja a test a mérleget vagy húzza a kötelet. Mértékegysége: <b>N</b>!</li></ul><p><b>Tömeg és súly nem ugyanaz!</b></p><ul><li>Tömeg: jele m, mértékegysége kg. A Holdon ugyanannyi.</li><li>Súly: jele G, mértékegysége N. A Holdon a hatoda.</li></ul>',
    tip:'<p><b>Súlytalanság</b>: ha semmi nem tartja a testet, és szabadon esik, akkor nincs súlya. Ilyen az űrállomáson.</p>',
    src:'49–51. oldal' },

  { type:'info', section:'Tanulás', icon:'🧊', title:'Súrlódás és közegellenállás', fig:FIG.friction,
    body:'<ul><li><mark class="k">Súrlódás (Fs)</mark>: két felület között lép fel, <b>fékezi a mozgást</b>. Nagyobb, ha jobban összenyomjuk őket, és függ az anyaguktól. A felület nagyságától <b>nem</b> függ.</li><li><mark class="k">Közegellenállás</mark>: a levegő vagy a víz fékezi a benne mozgó testet. A papírlap lassabban esik, mint a gombóc. Az <b>áramvonalas</b> alak (hal, madár, versenyautó) kevésbé fékeződik.</li></ul><p><b>Gördülési &lt; csúszási &lt; tapadási</b> súrlódás. Ezért könnyebb gurítani, mint tolni (bőrönd kerékkel).</p>',
    tip:'<p><b>Hasznos</b> a súrlódás: cipőtalp, téli gumi, fék. <b>Káros</b>: kopás, nyikorgó ajtó. Ezért olajozunk és zsírozunk.</p>',
    src:'49–51. oldal' },

  { type:'info', section:'Tanulás', icon:'📋', title:'Ennyit kell tudni',
    body:'<ul><li><b>Út</b> (s, m) a pálya hossza. <b>Elmozdulás</b>: egyenes nyíl A-tól B-ig.</li><li><b>v = s : t</b> (m/s vagy km/h). m/s → km/h: · 3,6.</li><li>Egyenletes mozgás: s–t grafikon ferde egyenes, v–t vízszintes.</li><li><b>a = Δv : Δt</b> (m/s²). Szabadesésnél <b>g ≈ 10 m/s²</b>.</li><li><b>Erő</b>: F, N. Newton I.: tehetetlenség. Newton II.: <b>F = m · a</b>.</li><li><b>Fg = m · g</b>. A súly mértékegysége N, a tömegé kg.</li><li>Súrlódás: gördülési &lt; csúszási &lt; tapadási.</li></ul><p><b>Most jön a játék! 🎮</b></p>',
    src:'52. oldal – összefoglalás' },

  /* ===== JÁTÉKOK ===== */
  { type:'match', section:'Játék 1', title:'🔗 Párosítás: mennyiség és mértékegység',
    pairs:[['út (s)','m (méter)'],['sebesség (v)','m/s'],['idő (t)','s (másodperc)'],['erő (F)','N (newton)'],['tömeg (m)','kg'],['gyorsulás (a)','m/s²']] },

  { type:'tf', section:'Játék 2', title:'⚡ Igaz vagy hamis?',
    items:[
      {t:'Az elmozdulás nem lehet hosszabb, mint a megtett út.', a:true, why:'Az egyenes nyíl A-tól B-ig a legrövidebb, az út legalább ennyi.'},
      {t:'1 m/s = 3,6 km/h.', a:true, why:'m/s-ból km/h-ba 3,6-tal szorzunk.'},
      {t:'Levegő nélkül a nehezebb test gyorsabban esik le.', a:false, why:'Levegő nélkül minden test ugyanolyan gyorsan esik.'},
      {t:'Ha a busz hirtelen fékez, a tehetetlenség miatt előre dőlünk.', a:true, why:'A tested megy tovább előre, amíg valami meg nem állítja.'},
      {t:'A súly mértékegysége a kilogramm.', a:false, why:'A súly mértékegysége a newton (N). A kg a tömegé.'},
      {t:'A gördülési súrlódás kisebb, mint a csúszási súrlódás.', a:true, why:'Ezért könnyebb gurítani, mint tolni.'}
    ]},

  { type:'memory', section:'Játék 3', title:'🧠 Memóriajáték',
    pairs:[['s','út'],['v','sebesség'],['a','gyorsulás'],['F','erő'],['g','10 m/s²'],['m','tömeg']] },

  { type:'drag', section:'Játék 4', title:'📦 Mozgásfajták: gyorsul, lassul, egyenletes?',
    bins:[{id:'gyorsul',name:'Gyorsuló',icon:'🚀'},{id:'lassul',name:'Lassuló',icon:'🛑'},{id:'egyenletes',name:'Egyenletes',icon:'➡️'}],
    items:[{t:'leguruló golyó a lejtőn',c:'gyorsul'},{t:'leejtett kő',c:'gyorsul'},{t:'lámpánál fékező autó',c:'lassul'},{t:'megálló bicikli',c:'lassul'},
      {t:'mozgólépcső',c:'egyenletes'},{t:'tempomattal haladó autó',c:'egyenletes'}] },

  { type:'drag', section:'Játék 5', title:'📦 Erőfajták: melyik melyik?',
    bins:[{id:'grav',name:'Gravitációs',icon:'⬇️'},{id:'tarto',name:'Tartóerő',icon:'⬆️'},{id:'surl',name:'Súrlódás',icon:'🧊'},{id:'kozeg',name:'Közegellenállás',icon:'💨'}],
    items:[{t:'A Föld lefelé húzza az almát',c:'grav'},{t:'Az asztal tartja a könyvet',c:'tarto'},{t:'A kötél tartja a lámpát',c:'tarto'},{t:'A fékező cipőtalp a talajon',c:'surl'},
      {t:'A papírlap lassan hullik a levegőben',c:'kozeg'},{t:'Az ejtőernyő lassítja az ugrót',c:'kozeg'}] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'A sebesség jele ___. Kiszámítása: út osztva ___. Az erő mértékegysége a ___. Az erőt ___ rajzoljuk, mert iránya is van.',
    answers:['v','idővel','newton','nyíllal'], extra:['s','tömeggel','joule'],
    explain:'v = s : t. Az erőt nyíllal ábrázoljuk, mert vektormennyiség: iránya is van.' },

  /* ===== DOLGOZAT GYAKORLÓ ===== */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat a szókártyákkal!',
    text:'Az a vonal, amelyen a test végigmegy, a ___. A megtett út és az eltelt idő hányadosa a ___. Az erő mértékegysége a ___. A test tehetetlenségének mértéke a ___. Azt, hogy 1 másodperc alatt mennyivel nő a sebesség, a ___ mutatja meg. A cipő talpa azért bordázott, hogy nagyobb legyen a ___.',
    answers:['pálya','sebesség','newton','tömeg','gyorsulás','súrlódás'], extra:['út','erő'],
    explain:'Ezek a Mozgás témazáró alapfogalmai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze a mennyiséget a mértékegységével!',
    pairs:[['út (s)','m (méter)'],['sebesség (v)','m/s'],['idő (t)','s (másodperc)'],['erő (F)','N (newton)'],['tömeg (m)','kg']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'Az elmozdulás nem lehet hosszabb, mint a megtett út.', a:true, why:'Az egyenes nyíl a legrövidebb A és B között.'},
      {t:'1 m/s = 3,6 km/h.', a:true, why:'10 m/s = 36 km/h.'},
      {t:'Levegő nélkül a nehezebb test gyorsabban esik le.', a:false, why:'Levegő nélkül minden test egyszerre ér le.'},
      {t:'Ha a busz hirtelen fékez, a tehetetlenség miatt előre dőlünk.', a:true, why:'Newton I. törvénye.'},
      {t:'A súly mértékegysége a kilogramm.', a:false, why:'A súly mértékegysége N (newton).'},
      {t:'A gördülési súrlódás kisebb, mint a csúszási súrlódás.', a:true, why:'Gördülési < csúszási < tapadási.'}
    ]},

  { type:'quiz', section:'Dolgozat', fig:FIG.graph, q:'4. Két kisautó egyenletesen mozog. Melyik gyorsabb?',
    options:['A autó','B autó','egyforma','nem tudjuk'], correct:0, explain:'Az A meredekebb, ezért gyorsabb. 4 s alatt 80 m-t tesz meg.', hint:'A meredekebb vonal gyorsabb.' },
  { type:'quiz', section:'Dolgozat', fig:FIG.graph, q:'5. Mekkora utat tett meg az A autó 2 s alatt?',
    options:['40 m','20 m','80 m','10 m'], correct:0, explain:'Az A sebessége 20 m/s, ezért 2 s alatt 40 m.', hint:'Nézd meg, hol van az A vonal t = 2 s-nál.' },
  { type:'quiz', section:'Dolgozat', fig:FIG.graph, q:'6. Mekkora a B autó sebessége?',
    options:['10 m/s','20 m/s','5 m/s','40 m/s'], correct:0, explain:'A B autó 2 s alatt 20 m-t tesz meg: 20 : 2 = 10 m/s.', hint:'v = s : t. Olvass le egy pontot.' },

  { type:'quiz', section:'Dolgozat', q:'7. Miért kell bekötni a biztonsági övet?',
    options:['Mert fékezéskor a tehetetlenség miatt előre lendülnénk.','Mert így gyorsabban megy az autó.','Mert így kisebb a súrlódás.','Mert nehezebb lesz az autó.'], correct:0,
    explain:'Newton I. törvénye: a test megy tovább előre, ezért tart vissza az öv.', hint:'Gondolj a fékező buszra.' },
  { type:'quiz', section:'Dolgozat', q:'8. Melyik esik le hamarabb ugyanabból a magasságból, a levegőben?',
    options:['a gombóccá gyűrt papírlap','a kisimított papírlap','egyszerre érnek le','egyik sem esik'], correct:0,
    explain:'A kisimított papírt jobban fékezi a levegő (közegellenállás).', hint:'Melyiket fékezi jobban a levegő?' },
  { type:'quiz', section:'Dolgozat', q:'9. Egy 5 kg-os test gravitációs ereje a Földön (g = 10 m/s²)?',
    options:['50 N','5 N','5 kg','0,5 N'], correct:0, explain:'Fg = m · g = 5 · 10 = 50 N.', hint:'Fg = m · g.' },

  { type:'calc', section:'Dolgozat', count:6, gens:[
    function(){ var v=pick([40,60,80,90,100,120]), t=pick([2,3,4,5]);
      return {q:'Az autó <b>'+t+' óra</b> alatt <b>'+(v*t)+' km</b>-t tesz meg. <b>Mekkora a sebessége?</b> (km/h)', a:v, u:'km/h', hint:'v = s : t.', explain:(v*t)+' km : '+t+' h = '+v+' km/h.'}; },
    function(){ var v=pick([2,3,5,8,10,15,20]), t=pick([4,5,10,20]);
      return {q:'A kisautó <b>'+v+' m/s</b> sebességgel mozog <b>'+t+' másodpercig</b>. <b>Mekkora utat tesz meg?</b> (m)', a:v*t, u:'m', hint:'s = v · t.', explain:v+' m/s · '+t+' s = '+(v*t)+' m.'}; },
    function(){ var v=pick([2,4,5,10,20]), t=pick([3,5,6,10]);
      return {q:'A fiú <b>'+v+' m/s</b> sebességgel fut. <b>Mennyi idő alatt tesz meg '+(v*t)+' métert?</b> (s)', a:t, u:'s', hint:'t = s : v.', explain:(v*t)+' m : '+v+' m/s = '+t+' s.'}; },
    function(){ var x=pick([5,10,15,20,25]);
      return {q:'<b>'+x+' m/s</b> hány km/h? (km/h)', a:x*3.6, u:'km/h', tol:0.05, hint:'m/s-ból km/h-ba 3,6-tal szorzunk.', explain:x+' · 3,6 = '+(x*3.6)+' km/h.'}; },
    function(){ var a=pick([2,3,4,5]), dt=pick([2,3,5,10]);
      return {q:'A sebesség <b>'+dt+' s</b> alatt <b>'+(a*dt)+' m/s</b>-mal nő. <b>Mekkora a gyorsulás?</b> (m/s²)', a:a, u:'m/s²', hint:'a = Δv : Δt.', explain:(a*dt)+' : '+dt+' = '+a+' m/s².'}; },
    function(){ var m=pick([2,3,4,5,10]), a=pick([2,3,5]);
      return {q:'Egy <b>'+m+' kg</b>-os kocsit <b>'+a+' m/s²</b> gyorsulással gyorsítunk. <b>Mekkora erő kell?</b> (N)', a:m*a, u:'N', hint:'F = m · a.', explain:m+' · '+a+' = '+(m*a)+' N.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Út (s)','A pálya hossza, mértékegysége: méter (m).'],
      ['Elmozdulás','Egyenes nyíl az indulástól az érkezésig.'],
      ['Sebesség','v = s : t. Mértékegysége m/s vagy km/h.'],
      ['m/s → km/h','Szorozd 3,6-tal.'],
      ['Gyorsulás','a = Δv : Δt, mértékegysége m/s².'],
      ['Nehézségi gyorsulás (g)','Kb. 10 m/s².'],
      ['Newton I. törvénye','Tehetetlenség: a test marad nyugalomban vagy megy egyenesen, amíg valami meg nem változtatja.'],
      ['Newton II. törvénye','F = m · a'],
      ['Gravitációs erő','Fg = m · g'],
      ['Súly vagy tömeg: mértékegység?','Súly: N (newton). Tömeg: kg.'],
      ['Súrlódások sorrendje','Gördülési < csúszási < tapadási.'],
      ['Mi fékezi a levegőben mozgó testet?','A közegellenállás.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
