/* Lendület, forgás, munka, egyszerű gépek – Fizika 7., IV. fejezet (a vázlat és a tankönyv alapján) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var FIG = {
  elastic: SV.svg('Rugalmas és rugalmatlan alakváltozás',
    '<circle cx="70" cy="70" r="30" fill="#ff9d96" stroke="#1b2618" stroke-width="3"/>'+SV.t(70,125,'gumilabda',12)+SV.t(70,142,'visszanyeri az alakját',11)+
    SV.t(160,80,'vs',22)+
    '<ellipse cx="250" cy="90" rx="42" ry="16" fill="#e8d38a" stroke="#1b2618" stroke-width="3"/>'+SV.t(250,125,'gyurma',12)+SV.t(250,142,'marad az új alak',11)),
  newton3: SV.svg('Hatás és ellenhatás: egyforma nagy, ellentétes erők',
    SV.r(60,60,60,50,'#9fd0ff')+SV.r(200,60,60,50,'#ff9d96')+
    SV.arrow(125,85,190,'#2f7fd1')+SV.t(160,72,'F',16)+
    '<line x1="195" y1="100" x2="130" y2="100" stroke="#d6403f" stroke-width="5"/><polygon points="122,100 140,90 140,110" fill="#d6403f"/>'+SV.t(160,124,'F',16)+
    SV.t(90,140,'te',13)+SV.t(230,140,'a labda',13)),
  rocket: SV.svg('A rakéta hátrafelé löki a gázt, a gáz előre löki a rakétát',
    SV.r(100,60,100,36,'#d9d9d9')+'<polygon points="200,60 235,78 200,96" fill="#d6403f" stroke="#1b2618" stroke-width="3"/>'+SV.fire(60,70)+SV.fire(75,80)+
    SV.arrow(70,115,20,'#d6403f')+SV.t(48,135,'gáz',12)+SV.arrow(240,40,295,'#2e8b2e')+SV.t(262,32,'rakéta',12)),
  momentum: SV.svg('Lendület: tömeg szorozva sebességgel',
    SV.r(110,12,100,50,'#ffd23f')+SV.t(160,48,'I',32,'middle','#1b2618')+
    SV.r(40,80,100,50,'#9fe07f')+SV.t(90,116,'m',32,'middle','#1b2618')+SV.r(180,80,100,50,'#8fc2f5')+SV.t(230,116,'v',32,'middle','#1b2618')+
    SV.t(160,152,'I = m · v   (kg·m/s)',12)),
  circle: SV.svg('Körmozgás: a sebesség érintő irányú',
    '<circle cx="110" cy="80" r="50" fill="none" stroke="#8b8f87" stroke-width="3" stroke-dasharray="6 5"/>'+SV.r(148,60,24,24,'#ffd23f')+
    SV.arrow(160,110,160,'#2f7fd1').replace(/.*/,'')+
    '<line x1="160" y1="72" x2="160" y2="20" stroke="#2f7fd1" stroke-width="5"/><polygon points="160,12 150,30 170,30" fill="#2f7fd1"/>'+SV.t(215,38,'v (érintő irányú)',12,'start')+
    SV.t(215,90,'ha elengeded,',12,'start')+SV.t(215,106,'egyenesen repül tovább',12,'start')),
  pendulum: SV.svg('Inga: a lengésidő csak a fonal hosszától függ',
    '<line x1="120" y1="15" x2="200" y2="15" stroke="currentColor" stroke-width="5"/><line x1="160" y1="15" x2="160" y2="105" stroke="#8b8f87" stroke-width="3"/><circle cx="160" cy="115" r="12" fill="#d6403f" stroke="#1b2618" stroke-width="3"/>'+
    '<line x1="160" y1="15" x2="95" y2="95" stroke="#8b8f87" stroke-width="2" stroke-dasharray="5 4"/><circle cx="90" cy="103" r="10" fill="none" stroke="#d6403f" stroke-width="2" stroke-dasharray="4 3"/>'+
    '<line x1="160" y1="15" x2="225" y2="95" stroke="#8b8f87" stroke-width="2" stroke-dasharray="5 4"/><circle cx="230" cy="103" r="10" fill="none" stroke="#d6403f" stroke-width="2" stroke-dasharray="4 3"/>'+
    SV.t(160,152,'rövidebb inga → gyorsabban leng',12)),
  balance: SV.svg('Háromféle egyensúly',
    '<path d="M20 120 Q60 60 100 120" fill="none" stroke="#555" stroke-width="5"/><circle cx="60" cy="86" r="10" fill="#d6403f"/>'+SV.t(60,145,'biztos',12)+
    '<path d="M120 90 Q160 160 200 90" fill="none" stroke="#555" stroke-width="0"/><path d="M120 100 Q160 40 200 100" fill="none" stroke="#555" stroke-width="0"/>'+
    '<path d="M120 110 Q160 40 200 110" fill="none" stroke="#555" stroke-width="5"/><circle cx="160" cy="62" r="10" fill="#d6403f"/>'+SV.t(160,145,'bizonytalan',12)+
    '<line x1="220" y1="110" x2="300" y2="110" stroke="#555" stroke-width="5"/><circle cx="260" cy="98" r="10" fill="#d6403f"/>'+SV.t(260,145,'közömbös',12)),
  work: SV.svg('Munka: W egyenlő F szorozva s-sel',
    SV.r(60,70,60,40,'#a9743a')+SV.arrow(125,90,200,'#2f7fd1')+SV.t(160,75,'F',16)+
    '<line x1="90" y1="125" x2="250" y2="125" stroke="currentColor" stroke-width="3"/>'+SV.t(170,145,'s (elmozdulás)',12)+SV.t(250,90,'W = F · s',16,'start')),
  lever: SV.svg('Az emelő: hosszabb kar, kisebb erő',
    '<polygon points="160,110 140,135 180,135" fill="#555"/><line x1="40" y1="100" x2="280" y2="85" stroke="#a9743a" stroke-width="10"/>'+
    SV.r(240,60,34,26,'#8b8f87')+SV.t(257,78,'nagy',11,'middle','#fff')+'<line x1="50" y1="80" x2="50" y2="120" stroke="#2f7fd1" stroke-width="5"/><polygon points="50,125 40,105 60,105" fill="#2f7fd1"/>'+SV.t(50,150,'kicsi erő',12))
};
FIG.circle = FIG.circle.replace(/<line x1="160" y1="110"[^>]*>/,'');

window.LESSON = {
  id:'lendulet',
  screens:[
  { type:'info', section:'Tanulás', icon:'🏀', title:'Rugalmas és rugalmatlan alakváltozás', fig:FIG.elastic,
    body:'<p>Ütközéskor a testek <b>alakja megváltozik</b>. Kétféle lehet:</p><ul><li><mark class="e2">Rugalmas</mark>: az erő megszűnése után a test <b>visszanyeri az alakját</b>. Pl. gumilabda, trambulin, rugó, teniszütő húrja.</li><li><mark class="e1">Rugalmatlan</mark>: az alakja <b>maradandóan megváltozik</b>. Pl. leejtett gyurma, leesett barack, összetört autó eleje.</li></ul>',
    mc:'<p>Egy slime-blokk visszapattan (rugalmas). Egy leesett homok viszont nem ugrik vissza (rugalmatlan).</p>',
    tip:'<p>Az autó eleje <b>szándékosan rugalmatlan</b> (gyűrődő zóna). Elnyeli a mozgási energiát, így az utasok kisebb ütést kapnak.</p>',
    src:'53–55. oldal' },

  { type:'info', section:'Tanulás', icon:'↔️', title:'Newton III. törvénye: hatás és ellenhatás', fig:FIG.newton3,
    body:'<p>Ha te <b>erővel hatsz</b> valamire, az <b>ugyanakkora erővel visszahat rád</b>.</p><p>Ezért fáj belerúgni a medicinlabdába!</p><p>Az erő és az ellenerő:</p><ul><li><b>egyforma nagy</b>,</li><li><b>ellentétes irányú</b>,</li><li>és <mark class="k">két különböző testre</mark> hat.</li></ul>',
    tip:'<p><b>Erő–ellenerő párok:</b> a tárgy nyomja az asztalt, az asztal tartja a tárgyat. Lépéskor te tolod a talajt hátra, a talaj téged előre.</p>',
    src:'56–58. oldal' },

  { type:'info', section:'Tanulás', icon:'🚀', title:'Rakétaelv', fig:FIG.rocket,
    body:'<p>A <mark class="k">rakéta hátrafelé löki ki a gázt</mark>, a gáz pedig <b>előrelöki a rakétát</b>. Ez Newton III. törvénye.</p><p>Mint a kiengedett lufi: a levegő hátra távozik, a lufi előre repül.</p><p>Így megy a <b>sugárhajtású repülő</b> és a <b>jet-ski</b> is.</p>',
    mc:'<p>A tűzijáték-rakéta is így megy: lefelé tolja a gázt, ezért emelkedik felfelé.</p>',
    src:'56–58. oldal' },

  { type:'info', section:'Tanulás', icon:'🧮', title:'Lendület: tömeg és sebesség', fig:FIG.momentum,
    body:'<p><mark class="k">Lendület</mark> = tömeg · sebesség.</p><ul><li><b>I = m · v</b></li><li>Mértékegysége: <b>kg·m/s</b></li></ul><p>Nagyobb a lendülete, ha <b>nehezebb</b> vagy <b>gyorsabb</b>. Egy lassú kamiont nehezebb megállítani, mint egy gyors biciklit. A lendületnek <b>iránya</b> is van.</p><p><b>Példa:</b> 70 kg-os távolugró, 10 m/s. I = 70 · 10 = <b>700 kg·m/s</b>.</p>',
    mc:'<p>Egy nehéz vaskocka gurulása nehezebben állítható meg, mint egy tollé. Ugyanolyan sebességnél a nagyobb tömegnek nagyobb a lendülete.</p>',
    src:'59–61. oldal' },

  { type:'info', section:'Tanulás', icon:'📦', title:'A lendület megmaradása',
    body:'<p>Ha két test <b>egymásnak ütközik</b>, az <mark class="k">összes lendületük nem változik</mark>. Csak <b>átadódik</b> az egyik testről a másikra.</p><ul><li>A mozgó golyó megáll, az álló golyó elindul.</li><li>Ha kiugrasz a csónakból, a csónak <b>hátrafelé</b> mozdul.</li></ul><p>Ez hasonlít az energia megmaradására: nem tűnik el, csak átkerül.</p>',
    mc:'<p>Gondolj egy csónakra: ha kiugrasz belőle előre, a csónak hátrafelé csúszik. Az összes lendület megmarad.</p>',
    src:'59–61. oldal' },

  { type:'info', section:'Tanulás', icon:'🎡', title:'Körmozgás és forgómozgás', fig:FIG.circle,
    body:'<ul><li><mark class="k">Körmozgás</mark>: a test <b>körpályán</b> mozog. Pl. az óriáskerék fülkéje, a bicikli szelepe.</li><li><mark class="k">Forgómozgás</mark>: <b>maga a test forog</b> egy tengely körül. Pl. kerék, ventilátor, a Föld.</li></ul><p>A sebesség <b>érintő irányú</b>: ha a víz leválik a forgó kerékről, <b>egyenesen repül tovább</b>.</p><ul><li><mark class="k">Fordulatszám (n)</mark>: hányat fordul 1 perc vagy 1 másodperc alatt. Mosógép: 1000/min.</li><li><mark class="k">Periódusidő (T)</mark>: mennyi idő alatt tesz meg egy teljes kört, mértékegysége s. A Föld egy fordulata: 24 óra.</li></ul>',
    src:'62–64. oldal' },

  { type:'info', section:'Tanulás', icon:'🪅', title:'Ingamozgás', fig:FIG.pendulum,
    body:'<p>A hinta, az ingaóra, a csillár <b>ide-oda leng</b>. Egy <b>teljes lengés</b>: az egyik szélétől el, és vissza ugyanoda.</p><ul><li><mark class="k">Lengésidő (T)</mark>: egy teljes lengés ideje, s-ban.</li><li><mark class="k">Amplitúdó (A)</mark>: a legnagyobb kitérés, méterben.</li></ul><p><b>A lengésidő csak a fonal hosszától függ!</b> Nem függ a test tömegétől, és attól sem, mennyire térítjük ki. <b>Rövidebb inga → gyorsabban leng.</b></p>',
    src:'65–67. oldal' },

  { type:'info', section:'Tanulás', icon:'⚖️', title:'Egyensúlyi helyzetek', fig:FIG.balance,
    body:'<ul><li><mark class="e2">Biztos (stabil)</mark>: kibillentve <b>visszatér</b>. Pl. keljfeljancsi, lógó hinta.</li><li><mark class="e1">Bizonytalan (labilis)</mark>: kibillentve <b>eldől</b>. Pl. élére állított vonalzó, kötéltáncos.</li><li><mark class="k">Közömbös</mark>: az <b>új helyén is</b> egyensúlyban marad. Pl. golyó az asztalon.</li></ul>',
    tip:'<p>A <b>Gömböc</b> magyar találmány. Alakja olyan, hogy magától mindig ugyanarra az oldalára billen vissza.</p>',
    src:'65–67. oldal' },

  { type:'info', section:'Tanulás', icon:'💪', title:'Munka a fizikában', fig:FIG.work,
    body:'<p>Munkát akkor végzünk, ha az <b>erő hatására</b> a test az erő irányában <b>elmozdul</b>.</p><ul><li><mark class="k">W = F · s</mark></li><li>Mértékegysége: <b>joule (J)</b>, mint az energiáé.</li></ul><p><b>Példa:</b> 20 N erővel 3 m-en át húzod a szánkót. W = 20 · 3 = <b>60 J</b>.</p><p><b>Nincs munka</b>, ha:</p><ul><li>nincs elmozdulás (csak tartod a nehéz labdát),</li><li>az elmozdulás merőleges az erőre (vízszintesen viszed a táskát).</li></ul>',
    mc:'<p>Amikor blokkot teszel, vagy csákánnyal ásol, erővel mozgatsz valamit: ez a munka. Ha csak állsz és tartod a blokkot a kezedben, nincs elmozdulás, tehát nincs fizikai munka.</p>',
    src:'68–70. oldal' },

  { type:'info', section:'Tanulás', icon:'🔧', title:'Egyszerű gépek: erőt spórolnak, munkát nem!', fig:FIG.lever,
    body:'<p>Az egyszerű gépekkel <mark class="k">erőt</mark> takaríthatunk meg, de <mark class="k">munkát nem</mark>.</p><ul><li><b>Lejtő típusúak</b>: lejtő, rámpa, szerpentin, ék (balta), csavar. Laposabb lejtőn kisebb erő kell, de hosszabb úton.</li><li><b>Emelő típusúak</b>: rúd, ami egy tengely körül fordul. Minél hosszabb a kar, annál kisebb erő kell.</li></ul><p><b>Emelők fajtái:</b></p><ul><li><b>kétoldalú</b> (a tengely a két erő között): olló, fogó, libikóka</li><li><b>egyoldalú</b> (a két erő a tengely egyik oldalán): talicska, diótörő, sörnyitó</li></ul><p><b>Csigák:</b></p><ul><li><b>állócsiga</b>: csak az erő irányát változtatja meg (zászlórúd, kútkerék)</li><li><b>mozgócsiga</b>: fele akkora erő elég (daru, vitorlás)</li><li><b>hengerkerék</b>: a nagy keréken kevesebb erő kell (autókormány, daráló)</li></ul>',
    mc:'<p>Ha egy nehéz blokkot kell felvinned a dombra, a hosszú, laposabb rámpa kisebb erőt kér, de hosszabb úton kell mennie. Ez a lejtő lényege.</p>',
    src:'71–74. oldal' },

  { type:'info', section:'Tanulás', icon:'📋', title:'Ennyit kell tudni',
    body:'<ul><li><b>Rugalmas</b>: visszanyeri az alakját. <b>Rugalmatlan</b>: maradandóan megváltozik.</li><li><b>Newton III.</b>: erő és ellenerő egyforma nagy, ellentétes, <b>két testre</b> hat.</li><li>Rakéta: hátrafelé löki a gázt, előre megy.</li><li><b>I = m · v</b> (kg·m/s). Az ütközéskor az összes lendület megmarad.</li><li>Körmozgás/forgómozgás. Fordulatszám n, periódusidő T.</li><li>Inga: a lengésidő csak a hossztól függ. A legnagyobb kitérés az amplitúdó.</li><li>Egyensúly: biztos, bizonytalan, közömbös.</li><li><b>W = F · s</b> (J). Nincs elmozdulás → nincs munka.</li><li>Egyszerű gépek: <b>erőt</b> spórolnak, <b>munkát nem</b>.</li></ul><p><b>Most jön a játék! 🎮</b></p>',
    src:'75. oldal – összefoglalás' },

  /* ===== JÁTÉKOK ===== */
  { type:'match', section:'Játék 1', title:'🔗 Párosítás: fogalom és meghatározás',
    pairs:[['Lendület','tömeg · sebesség'],['Munka','erő · elmozdulás'],['Lengésidő','egy teljes lengés ideje'],['Amplitúdó','a legnagyobb kitérés'],['Fordulatszám','hányat fordul 1 perc alatt'],['Periódusidő','egy teljes kör ideje']] },

  { type:'tf', section:'Játék 2', title:'⚡ Igaz vagy hamis?',
    items:[
      {t:'Ha belerúgok a labdába, a labda is visszahat a lábamra.', a:true, why:'Newton III. törvénye: hatás és ellenhatás.'},
      {t:'Az erő és az ellenerő ugyanarra a testre hat.', a:false, why:'Két különböző testre hatnak.'},
      {t:'A rakéta azért megy előre, mert hátrafelé gázt lök ki.', a:true, why:'A gáz előre löki a rakétát.'},
      {t:'A hosszabb inga gyorsabban leng.', a:false, why:'A rövidebb inga leng gyorsabban.'},
      {t:'Ha egy nehéz táskát csak egy helyben tartok, nem végzek munkát.', a:true, why:'Nincs elmozdulás, ezért nincs fizikai munka.'},
      {t:'Az egyszerű gépekkel munkát lehet megtakarítani.', a:false, why:'Csak erőt lehet megtakarítani, munkát nem.'}
    ]},

  { type:'memory', section:'Játék 3', title:'🧠 Memóriajáték',
    pairs:[['I','lendület'],['W','munka'],['T','lengésidő'],['A','amplitúdó'],['n','fordulatszám'],['kg·m/s','lendület mértékegysége']] },

  { type:'drag', section:'Játék 4', title:'📦 Rugalmas vagy rugalmatlan?',
    bins:[{id:'rugalmas',name:'Rugalmas',icon:'🏀'},{id:'rugalmatlan',name:'Rugalmatlan',icon:'🧱'}],
    items:[{t:'Ugrálás a trambulinon',c:'rugalmas'},{t:'A teniszlabda visszapattan',c:'rugalmas'},{t:'Gumilabda',c:'rugalmas'},{t:'Leejtett gyurmagolyó',c:'rugalmatlan'},{t:'Az autó eleje ütközéskor',c:'rugalmatlan'},{t:'Leesett barack',c:'rugalmatlan'}] },

  { type:'drag', section:'Játék 5', title:'📦 Egyensúlyi helyzetek',
    bins:[{id:'biztos',name:'Biztos',icon:'🟢'},{id:'bizonytalan',name:'Bizonytalan',icon:'🔴'},{id:'kozomb',name:'Közömbös',icon:'🟡'}],
    items:[{t:'keljfeljancsi',c:'biztos'},{t:'lógó hinta',c:'biztos'},{t:'élére állított vonalzó',c:'bizonytalan'},{t:'kötéltáncos',c:'bizonytalan'},{t:'golyó a vízszintes asztalon',c:'kozomb'},{t:'a Gömböc (visszabillen)',c:'biztos'}] },

  { type:'drag', section:'Játék 6', title:'📦 Egyszerű gépek: melyik típus?',
    bins:[{id:'lejto',name:'Lejtő típus',icon:'📐'},{id:'emelo',name:'Emelő típus',icon:'⚖️'},{id:'csiga',name:'Csiga / henger',icon:'⚙️'}],
    items:[{t:'rámpa',c:'lejto'},{t:'balta (ék)',c:'lejto'},{t:'olló',c:'emelo'},{t:'talicska',c:'emelo'},{t:'zászlórúd csigája',c:'csiga'},{t:'daru (mozgócsiga)',c:'csiga'}] },

  { type:'cloze', section:'Játék 7', title:'✏️ Egészítsd ki a mondatot!',
    text:'A lendület kiszámítása: tömeg szorozva ___. A munka mértékegysége a ___. Az egyszerű gépek ___ takarítanak meg, de nem takarítanak meg ___. A rakéta ___ löki ki a gázt.',
    answers:['sebességgel','joule','erőt','munkát','hátrafelé'], extra:['idővel','newton','előre'],
    explain:'I = m · v és W = F · s (joule). Az egyszerű gépek csak erőt spórolnak.' },

  /* ===== DOLGOZAT GYAKORLÓ ===== */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat a szókártyákkal!',
    text:'A labda leesés után visszanyeri az alakját: ez ___ alakváltozás. Minden erőhatással szemben fellép egy ___. A tömeg és a sebesség szorzata a ___. A ___ megmutatja, hányat fordul a test 1 perc alatt. Az inga legnagyobb kitérése az ___. Egyszerű gépekkel erőt meg lehet takarítani, de ___ nem.',
    answers:['rugalmas','ellenerő','lendület','fordulatszám','amplitúdó','munkát'], extra:['rugalmatlan','lengésidő'],
    explain:'A Lendület témazáró alapfogalmai.' },

  { type:'drag', section:'Dolgozat', title:'📝 2. Rugalmas (R) vagy rugalmatlan (N)?',
    bins:[{id:'rugalmas',name:'Rugalmas (R)',icon:'🏀'},{id:'rugalmatlan',name:'Rugalmatlan (N)',icon:'🧱'}],
    items:[{t:'Ugrálás a trambulinon',c:'rugalmas'},{t:'Leejtett gyurmagolyó az asztalon',c:'rugalmatlan'},{t:'A teniszlabda visszapattan a földről',c:'rugalmas'},{t:'Az autó eleje összegyűrődik ütközéskor',c:'rugalmatlan'}] },

  { type:'drag', section:'Dolgozat', title:'📝 3. Milyen egyensúlyi helyzetben vannak?',
    bins:[{id:'biztos',name:'Biztos',icon:'🟢'},{id:'bizonytalan',name:'Bizonytalan',icon:'🔴'},{id:'kozomb',name:'Közömbös',icon:'🟡'}],
    items:[{t:'keljfeljancsi',c:'biztos'},{t:'golyó a vízszintes asztalon',c:'kozomb'},{t:'élére állított vonalzó',c:'bizonytalan'}] },

  { type:'tf', section:'Dolgozat', title:'📝 4. Igaz vagy hamis?',
    items:[
      {t:'Ha belerúgok a labdába, a labda is visszahat a lábamra.', a:true, why:'Newton III. törvénye.'},
      {t:'Az erő és az ellenerő ugyanarra a testre hat.', a:false, why:'Két különböző testre hat.'},
      {t:'A rakéta azért megy előre, mert hátrafelé gázt lök ki.', a:true, why:'Rakétaelv.'},
      {t:'A hosszabb inga gyorsabban leng.', a:false, why:'A rövidebb leng gyorsabban.'},
      {t:'Ha egy nehéz táskát csak egy helyben tartok, nem végzek munkát.', a:true, why:'Nincs elmozdulás.'},
      {t:'Az egyszerű gépekkel munkát lehet megtakarítani.', a:false, why:'Csak erőt, munkát nem.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'5. Egy bicikli és egy kamion ugyanolyan gyorsan megy. Melyiknek nagyobb a lendülete?',
    options:['a kamionnak','a biciklinek','egyforma','nem lehet tudni'], correct:0, explain:'A lendület I = m · v. Ugyanakkora sebességnél a nagyobb tömegű test lendülete nagyobb.', hint:'I = m · v.' },
  { type:'quiz', section:'Dolgozat', q:'6. Kiugrasz a csónakból a partra. Merre mozdul a csónak?',
    options:['hátrafelé, a parttól el','előre, a part felé','sehova','felfelé'], correct:0, explain:'A lendület megmarad, ezért a csónak ellentétes irányba mozdul.', hint:'Newton III. és a lendület megmaradása.' },
  { type:'quiz', section:'Dolgozat', q:'7. Merre repül a víz a forgó bicikli kerekéről?',
    options:['érintő irányban, egyenesen tovább','a kerék közepe felé','mindig felfelé','mindig lefelé'], correct:0, explain:'A sebesség érintő irányú, ezért a leváló víz egyenesen repül tovább.', hint:'Körmozgásnál a sebesség érintő irányú.' },
  { type:'quiz', section:'Dolgozat', q:'8. Melyik egyszerű gép változtatja meg csak az erő irányát?',
    options:['az állócsiga','a mozgócsiga','a talicska','a lejtő'], correct:0, explain:'Az állócsiga csak az erő irányát változtatja meg.', hint:'Zászlórúd, kútkerék.' },
  { type:'quiz', section:'Dolgozat', q:'9. Mitől függ az inga lengésideje?',
    options:['csak a fonal hosszától','a test tömegétől','a kitérés nagyságától','a test színétől'], correct:0, explain:'A lengésidő csak a fonal hosszától függ.', hint:'Nem függ a tömegtől és a kitéréstől.' },

  { type:'calc', section:'Dolgozat', count:4, gens:[
    function(){ var m=pick([2,5,10,50,60,70,80]), v=pick([2,3,5,10]);
      return {q:'Egy <b>'+m+' kg</b>-os test <b>'+v+' m/s</b> sebességgel mozog. <b>Mekkora a lendülete?</b> (kg·m/s)', a:m*v, u:'kg·m/s', hint:'I = m · v.', explain:m+' · '+v+' = '+(m*v)+' kg·m/s.'}; },
    function(){ var F=pick([5,10,20,30,40,50]), s=pick([2,3,4,5,10]);
      return {q:'<b>'+F+' N</b> erővel húzol egy szánkót <b>'+s+' méteren</b> át. <b>Mekkora munkát végzel?</b> (J)', a:F*s, u:'J', hint:'W = F · s.', explain:F+' N · '+s+' m = '+(F*s)+' J.'}; },
    function(){ var m=pick([2,4,5,8,10,20]), v=pick([3,5,10]);
      return {q:'Egy test lendülete <b>'+(m*v)+' kg·m/s</b>, a tömege <b>'+m+' kg</b>. <b>Mekkora a sebessége?</b> (m/s)', a:v, u:'m/s', hint:'v = I : m.', explain:(m*v)+' : '+m+' = '+v+' m/s.'}; },
    function(){ var s=pick([2,3,5,6]), W=pick([30,60,90,120,150]);
      return {q:'Egy erő <b>'+W+' J</b> munkát végez <b>'+s+' m</b> úton. <b>Mekkora az erő?</b> (N)', a:W/s, u:'N', hint:'F = W : s.', explain:W+' : '+s+' = '+(W/s)+' N.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Rugalmas alakváltozás','Az erő megszűnése után visszanyeri az alakját (gumilabda).'],
      ['Rugalmatlan alakváltozás','Az alakja maradandóan megváltozik (gyurma).'],
      ['Newton III. törvénye','Hatás és ellenhatás: egyforma nagy, ellentétes erők, két testre hatnak.'],
      ['Lendület','I = m · v, mértékegysége kg·m/s.'],
      ['Lendületmegmaradás','Ütközéskor az összes lendület nem változik.'],
      ['Fordulatszám és periódusidő','n: hány fordulat 1 perc alatt. T: egy teljes kör ideje.'],
      ['Inga lengésideje','Csak a fonal hosszától függ.'],
      ['Háromféle egyensúly','Biztos (visszatér), bizonytalan (eldől), közömbös (marad).'],
      ['Munka','W = F · s, joule (J). Nincs elmozdulás, nincs munka.'],
      ['Egyszerű gépek','Erőt spórolnak, munkát nem.'],
      ['Állócsiga és mozgócsiga','Állócsiga: az erő irányát változtatja. Mozgócsiga: fele akkora erő.'],
      ['Emelők fajtái','Kétoldalú (olló, libikóka), egyoldalú (talicska, diótörő).']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
