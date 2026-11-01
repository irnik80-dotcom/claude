/* Környezetünk globális problémái – IX. fejezet (tankönyv 191–207. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var FIG = {
  layers: SV.svg('A légkör rétegei',
    SV.r(40,15,240,26,'#2a3a6d')+SV.t(160,33,'exoszféra',12,'middle','#fff')+SV.r(40,41,240,26,'#3a5aa8')+SV.t(160,59,'termoszféra',12,'middle','#fff')+
    SV.r(40,67,240,26,'#5a82cf')+SV.t(160,85,'mezoszféra',12,'middle','#fff')+SV.r(40,93,240,26,'#8fb5e8')+SV.t(160,111,'sztratoszféra (ózonréteg)',12,'middle','#1b2618')+
    SV.r(40,119,240,26,'#cfe3f7')+SV.t(160,137,'troposzféra: itt élünk, itt az idő',12,'middle','#1b2618')),
  ozone: SV.svg('Az ózonréteg megköti a káros UV-sugárzást',
    SV.sun(45,50)+'<line x1="80" y1="50" x2="150" y2="50" stroke="#7a3bbd" stroke-width="4"/>'+SV.r(150,30,18,50,'#9fe07f')+SV.t(159,95,'ózonréteg',11)+SV.t(250,56,'a káros része nem jut át',11)+SV.t(160,135,'UV-sugárzás elleni védelem: napszemüveg, naptej, kalap',12)),
  green: SV.svg('Üvegházhatás: a légkör visszatartja a Föld hőjét',
    SV.sun(45,40)+'<line x1="80" y1="46" x2="160" y2="100" stroke="#f2b705" stroke-width="4"/>'+SV.r(30,110,260,24,'#7a5b34')+SV.t(160,128,'Föld',12,'middle','#fff')+
    '<path d="M140 110 Q160 70 190 60" fill="none" stroke="#d6403f" stroke-width="4"/><path d="M190 60 Q215 75 230 105" fill="none" stroke="#d6403f" stroke-width="4"/>'+SV.t(235,50,'a hő egy része',11,'start')+SV.t(235,64,'visszajut',11,'start')),
  fuel: SV.boxes('Energiahordozók',[['fosszilis','#ffd9d6'],['megújuló','#d5f0cb']],'szén, olaj, gáz, urán  |  Nap, szél, víz, bio'),
  house: SV.svg('A háztartás energiafelhasználása (2019)',
    SV.r(30,20,71*2.3,24,'#d6403f')+SV.t(34,38,'fűtés, hűtés  71%',12,'start','#fff')+SV.r(30,50,13*2.3,24,'#2f7fd1')+SV.t(34,68,'meleg víz  13%',12,'start','#fff')+
    SV.r(30,80,11*2.3,24,'#f2b705')+SV.t(34,98,'főzés  11%',12,'start','#1b2618')+SV.r(30,110,5*2.3,24,'#6bb52e')+SV.t(34,128,'világítás, gépek  5%',12,'start','#1b2618')),
  iso: SV.svg('Hőszigetelés: kisebb fűtési számla',
    SV.r(80,60,100,70,'#e8d38a')+'<polygon points="70,60 130,20 190,60" fill="#a9743a" stroke="#1b2618" stroke-width="3"/>'+SV.r(120,90,20,40,'#a9743a')+SV.r(65,55,10,80,'#9fd0ff')+SV.r(185,55,10,80,'#9fd0ff')+SV.t(250,85,'hőszigetelés',12,'start')+SV.t(250,102,'= kevesebb hő',12,'start')+SV.t(250,119,'megy el',12,'start'))
};

window.LESSON = {
  id:'kornyezet',
  screens:[
  { type:'info', section:'Tanulás', icon:'🌍', title:'A Föld légköre', fig:FIG.layers,
    body:'<p>A <mark class="k">légkör</mark> a Földet körülvevő <b>gáztömeg</b>, amely a Földdel együtt kering a Nap körül.</p><p>A légkör <b>réteges</b>. Az egyes rétegekben más-más az összetétel, a hőmérséklet, a nyomás és a sűrűség.</p><ul><li><b>Troposzféra</b>: a legalsó réteg, itt élünk, itt van az időjárás.</li><li><b>Sztratoszféra</b>: itt van az ózonréteg.</li><li>Fölötte a mezoszféra, a termoszféra és az exoszféra.</li></ul><p>A légkör <b>éltet és véd</b>: lélegzünk benne, és megvéd a káros sugárzástól.</p>',
    mc:'<p>Ha Minecraftban a magasba építesz, a levegő „ugyanolyan”. A valóságban a levegő a magassággal egyre ritkább.</p>',
    src:'191–194. oldal' },

  { type:'info', section:'Tanulás', icon:'🛡️', title:'Az ózonréteg és az UV-sugárzás', fig:FIG.ozone,
    body:'<p>Az <mark class="k">ózonrétegnek</mark> jelentős szerepe van az <b>ultraibolya (UV) sugárzás káros összetevőinek megkötésében</b>.</p><p>Az UV-sugárzás <b>leégést</b>, hosszabb távon bőrkárosodást okozhat.</p><p><b>Egyéni védekezés:</b></p><ul><li>naptej,</li><li>napszemüveg,</li><li>kalap és fedő ruházat,</li><li>árnyékban tartózkodás a déli órákban.</li></ul><p>Ez az egészségünk védelmének része.</p>',
    tip:'<p>A <b>légszennyezés</b> az emberiség egészét érintő <b>globális probléma</b>. Megoldása mindenki érdeke és feladata.</p>',
    src:'192–194. oldal' },

  { type:'info', section:'Tanulás', icon:'⚡', title:'Meddig bírjuk energiával?', fig:FIG.fuel,
    body:'<p>Egy társadalom <b>gazdasági fejlődése</b> együtt jár az <b>energiaszükséglet növekedésével</b>.</p><p>Az energiahordozók lehetnek:</p><ul><li><mark class="e1">Kimeríthető (nem megújuló)</mark>: <b>szén, földgáz, kőolaj</b> (ezek a fosszilisek), valamint az <b>urán</b>.</li><li><mark class="e2">Megújuló</mark>: <b>napenergia, bioenergia, vízenergia, szélenergia, geotermikus energia</b>.</li></ul><p>A <b>növekvő energiatermelés</b> a környezet <b>egyre nagyobb terhelését</b> jelenti, és súlyos, <b>globális problémákat</b> okoz.</p>',
    tip:'<p>A fosszilis energiahordozók <b>nem pótolódnak</b> az emberi időskálán. Ezért kell a <b>megújulókra</b> áttérni, és <b>energiát takarítani</b>.</p>',
    src:'195–198. oldal' },

  { type:'info', section:'Tanulás', icon:'🏠', title:'Energiatakarékosság a háztartásban', fig:FIG.house,
    body:'<p>Országunk <b>villamosenergia-fogyasztásának</b> kb. a <b>harmadát a háztartások</b>, negyedét a <b>közlekedés</b> teszi ki.</p><p>Egy család energiafelhasználásának <b>legnagyobb részét a fűtés</b> adja (kb. <b>71%</b>).</p><p>A fűtést <mark class="k">hőszigeteléssel</mark> jelentősen lehet csökkenteni.</p><p>Kis odafigyeléssel, <b>befektetés nélkül</b> is rengeteg energiát takaríthatunk meg.</p>',
    mc:'<p>Ha a házad jó falból van, kevesebb hő szökik el. A hőszigetelés ugyanezt csinálja.</p>',
    src:'199–202. oldal' },

  { type:'info', section:'Tanulás', icon:'💡', title:'Hogyan spórolhatok energiát?', fig:FIG.iso,
    body:'<ul><li><b>Kapcsold le a lámpát</b>, ha kimész a szobából.</li><li><b>LED-izzót</b> használj, kevesebbet fogyaszt.</li><li>A <b>használaton kívüli</b> készüléket ne hagyd készenléti (stand-by) állapotban.</li><li>Szellőztess <b>rövid ideig, de teljesen</b>, ne hagyd nyitva az ablakot fűtés közben.</li><li>Vásárláskor nézd az <b>energiaosztályt</b>: A a legjobb.</li><li>A hőszigetelés a legtöbbet segít.</li></ul><p><b>Számolás:</b> egy 100 W-os izzó 5 órán át ég. E = 100 · 5 = 500 Wh = <b>0,5 kWh</b>.</p>',
    src:'199–202. oldal' },

  { type:'info', section:'Tanulás', icon:'🌡️', title:'Éghajlatváltozás', fig:FIG.green,
    body:'<p>Az <b>éghajlat (klíma)</b> folyamatosan ingadozva változik. Több évtizede megfigyelhető, hogy <b>kismértékben növekszik az átlaghőmérséklet</b>.</p><p>Ennek egyik oka az <mark class="k">üvegházhatás</mark> erősödése: a légkör egyes gázai (pl. a <b>szén-dioxid</b>) <b>visszatartják a Föld hőjét</b>. Az égetés (fosszilis energiahordozók) során <b>szén-dioxid</b> kerül a levegőbe.</p><p>A következmények: <b>szélsőségesebb időjárás</b>, jégolvadás, a tengerek szintjének emelkedése.</p>',
    tip:'<p>Az üvegházhatás önmagában <b>természetes</b> és szükséges az élethez. A baj az, ha <b>túl erős</b> lesz.</p>',
    src:'203–206. oldal' },

  { type:'info', section:'Tanulás', icon:'🌱', title:'Mit tehetünk?',
    body:'<p>A környezet védelméhez <b>mindenki hozzájárulhat</b>:</p><ul><li><b>Takarékoskodj</b> az energiával és a vízzel.</li><li>Válaszd <b>inkább a tömegközlekedést</b>, a biciklit, a gyaloglást.</li><li><b>Szelektíven gyűjtsd</b> a hulladékot.</li><li>Használj <b>megújuló</b> energiát, ahol lehet.</li><li>A gyárak, erőművek <b>szűrőket</b> alkalmaznak, a járművekben <b>katalizátor</b> tisztítja a kipufogógázt.</li></ul><p>A jövő a <b>megújuló energiaforrásoké</b>: nap-, szél- és vízerőművek.</p>',
    mc:'<p>Ha minden kivágott fa helyére újat ültetsz, a „világod” megújul. A valóságban is ez a megújuló energia lényege.</p>',
    src:'207. oldal' },

  { type:'info', section:'Tanulás', icon:'📋', title:'Ennyit kell tudni',
    body:'<ul><li>A <b>légkör</b> réteges, éltet és véd. Az <b>ózonréteg</b> megköti a káros UV-t.</li><li>A <b>légszennyezés</b> globális probléma.</li><li><b>Nem megújuló</b>: szén, földgáz, kőolaj, urán. <b>Megújuló</b>: Nap, szél, víz, bio, geotermikus.</li><li>A fűtés a háztartás energiájának legnagyobb része (kb. 71%). Hőszigeteléssel csökkenthető.</li><li><b>Energiatakarékosság</b>: lámpa lekapcsolása, LED, készenléti állapot kerülése.</li><li><b>Üvegházhatás</b>: szén-dioxid visszatartja a hőt, nő az átlaghőmérséklet.</li></ul><p><b>Most jön a játék! 🎮</b></p>',
    src:'207. oldal – összefoglalás' },

  /* ===== JÁTÉKOK ===== */
  { type:'match', section:'Játék 1', title:'🔗 Párosítás: fogalom és jelentés',
    pairs:[['troposzféra','a légkör legalsó rétege'],['ózonréteg','megköti a káros UV-t'],['szén-dioxid','üvegházhatást erősít'],['LED','kevesebbet fogyaszt'],['hőszigetelés','csökkenti a fűtési igényt'],['katalizátor','tisztítja a kipufogógázt']] },

  { type:'tf', section:'Játék 2', title:'⚡ Igaz vagy hamis?',
    items:[
      {t:'A légkör egyforma összetételű és hőmérsékletű mindenhol.', a:false, why:'A légkör réteges, az egyes rétegek különböznek.'},
      {t:'Az ózonréteg a káros UV-sugárzást köti meg.', a:true, why:'Így védi az élőlényeket.'},
      {t:'A szén és a földgáz megújuló energiaforrás.', a:false, why:'Fosszilisek, nem pótolódnak.'},
      {t:'A háztartások energiájának legnagyobb részét a fűtés viszi el.', a:true, why:'Kb. 71%.'},
      {t:'A készenléti állapotban lévő készülék nem fogyaszt áramot.', a:false, why:'Készenlétben is fogyaszt egy keveset.'},
      {t:'A légszennyezés csak egy országot érint.', a:false, why:'Globális probléma: az egész emberiséget érinti.'}
    ]},

  { type:'memory', section:'Játék 3', title:'🧠 Memóriajáték',
    pairs:[['szén','fosszilis'],['szél','megújuló'],['urán','kimeríthető'],['napelem','áramot állít elő'],['A osztály','legtakarékosabb'],['UV','ultraibolya']] },

  { type:'drag', section:'Játék 4', title:'📦 Megújuló vagy kimeríthető?',
    bins:[{id:'megujulo',name:'Megújuló',icon:'🌱'},{id:'kimerit',name:'Kimeríthető',icon:'🛢️'}],
    items:[{t:'napenergia',c:'megujulo'},{t:'szélenergia',c:'megujulo'},{t:'vízenergia',c:'megujulo'},{t:'geotermikus energia',c:'megujulo'},{t:'szén',c:'kimerit'},{t:'kőolaj',c:'kimerit'},{t:'földgáz',c:'kimerit'},{t:'urán',c:'kimerit'}] },

  { type:'drag', section:'Játék 5', title:'📦 Spórolós vagy pazarló?',
    bins:[{id:'sporol',name:'Takarékos',icon:'✅'},{id:'pazarol',name:'Pazarló',icon:'❌'}],
    items:[{t:'LED-izzó használata',c:'sporol'},{t:'lámpa lekapcsolása',c:'sporol'},{t:'hőszigetelés',c:'sporol'},{t:'A osztályú készülék',c:'sporol'},{t:'világítás üres szobában',c:'pazarol'},{t:'nyitott ablak fűtéskor',c:'pazarol'},{t:'készenléti állapot',c:'pazarol'},{t:'G osztályú készülék',c:'pazarol'}] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'A légkör ___ elrendezésű. Az ___ megköti a káros UV-sugárzást. A háztartások energiájának legnagyobb részét a ___ viszi el. Az üvegházhatást a ___ erősíti.',
    answers:['réteges','ózonréteg','fűtés','szén-dioxid'], extra:['sima','víz','oxigén'],
    explain:'A légkör réteges, az ózonréteg véd az UV-től.' },

  /* ===== DOLGOZAT GYAKORLÓ ===== */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'A légkör a Földet körülvevő ___. A légszennyezés ___ probléma. A ___ energiaforrások közé tartozik a nap és a szél. A fűtés energiaigényét ___ csökkenthetjük.',
    answers:['gáztömeg','globális','megújuló','hőszigeteléssel'], extra:['helyi','fosszilis','vízzel'],
    explain:'A Környezetünk globális problémái fejezet alapjai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze!',
    pairs:[['troposzféra','itt zajlik az időjárás'],['sztratoszféra','itt van az ózonréteg'],['napkollektor','meleg vizet állít elő'],['napelem','elektromos áramot állít elő'],['háztartás legnagyobb fogyasztása','fűtés']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'A fosszilis energiahordozók elfogynak.', a:true, why:'Nem pótolódnak az emberi időskálán.'},
      {t:'Az UV-sugárzás ellen napszemüveg és naptej véd.', a:true, why:'Ez az egyéni védekezés része.'},
      {t:'A katalizátor a szennyezőanyagok kiszűrésére való.', a:true, why:'A kipufogógázban lévő szennyezőket szűri.'},
      {t:'Az üvegházhatás egyetlen oka az ember.', a:false, why:'Természetes jelenség is, az ember csak erősíti.'},
      {t:'Az A energiaosztály a legpazarlóbb.', a:false, why:'A legtakarékosabb az A.'},
      {t:'Az éghajlat egyáltalán nem változik.', a:false, why:'Az éghajlat folyamatosan ingadozva változik.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Melyik rétegben van az ózonréteg?',
    options:['sztratoszféra','troposzféra','exoszféra','a földfelszínen'], correct:0, explain:'Az ózonréteg a sztratoszférában van.', hint:'A troposzféra fölött.' },
  { type:'quiz', section:'Dolgozat', q:'5. Melyik NEM megújuló energiaforrás?',
    options:['kőolaj','szél','víz','Nap'], correct:0, explain:'A kőolaj fosszilis.', hint:'A fosszilisek elfogynak.' },
  { type:'quiz', section:'Dolgozat', q:'6. Mivel lehet leginkább csökkenteni a fűtés energiaigényét?',
    options:['hőszigeteléssel','nagyobb lámpával','több ablakkal','nagyobb radiátorral'], correct:0, explain:'A hőszigetelés csökkenti a hőveszteséget.', hint:'Kevesebb hő szökjön el.' },
  { type:'quiz', section:'Dolgozat', q:'7. Mi okozza a globális felmelegedést erősítő üvegházhatást?',
    options:['a szén-dioxid a légkörben','a hold fénye','a víz','a szél'], correct:0, explain:'A szén-dioxid visszatartja a Föld hőjét.', hint:'Égetéskor keletkezik.' },

  { type:'calc', section:'Dolgozat', count:4, gens:[
    function(){ var P=pick([100,200,500,1000,2000]), t=pick([2,5,10]);
      return {q:'Egy <b>'+P+' W</b>-os készülék <b>'+t+' órát</b> működik. <b>Mennyi energiát fogyaszt?</b> (kWh)', a:P*t/1000, u:'kWh', tol:0.001, hint:'E = P · t, utána oszd 1000-rel (W → kW).', explain:P+' W · '+t+' h = '+(P*t)+' Wh = '+(P*t/1000)+' kWh.'}; },
    function(){ var a=pick([60,100]), b=pick([10,15]), t=pick([5,10]);
      return {q:'Egy <b>'+a+' W</b>-os izzót <b>'+b+' W</b>-os LED-re cserélünk. Hány W-tal fogyaszt kevesebb? (W)', a:a-b, u:'W', hint:'Vond ki a két teljesítményt.', explain:a+' − '+b+' = '+(a-b)+' W.'}; },
    function(){ var s=pick([71,13,11,5]);
      return {q:'A háztartás energiájának <b>71%</b> a fűtés. Egy család összesen <b>1000 egység</b> energiát használ. <b>Hány egységet visz a fűtés?</b>', a:710, u:'egység', hint:'1000 · 0,71.', explain:'1000 · 0,71 = 710 egység.'}; },
    function(){ var k=pick([2,3,5,10]);
      return {q:'<b>'+k+' kWh</b> hány Wh? (1 kWh = 1000 Wh) (Wh)', a:k*1000, u:'Wh', hint:'Szorozd 1000-rel.', explain:k+' · 1000 = '+fmt(k*1000)+' Wh.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Mi a légkör?','A Földet körülvevő gáztömeg, réteges elrendezésű.'],
      ['Troposzféra','A legalsó réteg, itt élünk és itt az időjárás.'],
      ['Ózonréteg','Megköti az UV-sugárzás káros részét.'],
      ['Nem megújuló energiaforrások','Szén, földgáz, kőolaj, urán.'],
      ['Megújuló energiaforrások','Nap, szél, víz, bio, geotermikus.'],
      ['Mi viszi el a háztartás legtöbb energiáját?','A fűtés (kb. 71%).'],
      ['Mivel csökkenthető a fűtési energia?','Hőszigeteléssel.'],
      ['Üvegházhatás','Szén-dioxid visszatartja a Föld hőjét, nő az átlaghőmérséklet.'],
      ['Energiatakarékos tippek','LED, lámpa lekapcsolása, készenléti állapot kerülése, A osztályú gépek.'],
      ['Globális probléma','Az egész emberiséget érinti. Pl. légszennyezés, éghajlatváltozás.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
