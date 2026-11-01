/* Energia – Fizika 7., II. fejezet (tankönyv 20–32. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var FIG = {
  hook: SV.svg('A nap süt, a zombi felmelegszik',
    SV.sun(55,60)+SV.arrow(100,60,175,'#f2b705')+
    SV.r(215,40,34,34,'#6aa84f')+SV.r(210,74,44,44,'#3b6ea5')+SV.r(200,78,10,34,'#6aa84f')+SV.r(254,78,10,34,'#6aa84f')+SV.r(214,118,16,26,'#2b4a73')+SV.r(234,118,16,26,'#2b4a73')+SV.fire(217,20)+
    SV.t(55,128,'napfény',13)+SV.t(232,154,'a zombi felmelegszik',12)),
  unit: SV.svg('Az energia jele E, mértékegysége a joule',
    SV.r(30,35,70,70,'#ffd23f')+SV.t(65,86,'E',48,'middle','#1b2618')+SV.t(65,128,'energia',13)+SV.t(130,78,'→',40)+
    SV.r(180,35,110,70,'#6ab0ff')+SV.t(235,82,'J',44,'middle','#10200a')+SV.t(235,128,'joule (dzsúl)',13)),
  transfer: SV.svg('A forró víz energiája átkerül a hideg vízbe',
    SV.r(30,50,80,80,'#ff9d96')+SV.t(70,100,'FORRÓ',14,'middle','#1b2618')+SV.t(70,150,'energiája csökken ▼',11)+
    SV.arrow(120,90,200,'#d6403f')+SV.t(160,76,'energia',12)+
    SV.r(210,50,80,80,'#9fd0ff')+SV.t(250,100,'HIDEG',14,'middle','#1b2618')+SV.t(250,150,'energiája nő ▲',11)),
  ice: SV.svg('A jég 0 fokon olvad, közben felvesz energiát',
    SV.r(20,60,50,50,'#d4f1ff')+SV.r(70,60,50,50,'#d4f1ff')+SV.t(70,125,'jég: 0 °C',13)+
    SV.arrow(130,85,195,'#ff6b1c')+SV.t(162,70,'energia',12)+
    SV.r(205,85,95,25,'#6ab0ff')+SV.r(205,60,25,25,'#d4f1ff')+SV.t(252,125,'víz: még mindig 0 °C',12)+SV.fire(60,22)),
  light: SV.svg('A napfény energiát ad át a hőmérőnek',
    SV.sun(55,55)+SV.arrow(100,55,185,'#f2b705')+
    SV.r(215,15,30,100,'#ffffff')+SV.r(219,55,22,60,'#d6403f')+SV.r(205,105,50,36,'#d6403f')+SV.t(230,155,'hőmérő melegszik',12)+SV.t(55,120,'napfény',13)),
  rub: SV.svg('A tenyerek dörzsölésekor a mozgás hővé alakul',
    SV.r(60,40,90,38,'#f1c08a')+SV.r(60,78,90,38,'#e0a96d')+SV.t(105,64,'↔',26,'middle','#1b2618')+SV.t(105,138,'dörzsölés',12)+
    SV.t(185,85,'→',34)+SV.fire(225,60)+SV.t(240,115,'belső energia nő',12)+SV.t(240,138,'(felmelegszik)',11)),
  bow: SV.svg('Az íj húrja megfeszül: rugalmas energia',
    '<path d="M110 20 Q50 80 110 140" fill="none" stroke="#8a5a2b" stroke-width="10"/>'+
    '<polyline points="110,20 70,80 110,140" fill="none" stroke="currentColor" stroke-width="3"/>'+
    '<line x1="70" y1="80" x2="230" y2="80" stroke="#8b8f87" stroke-width="5"/><polygon points="250,80 225,68 225,92" fill="#8b8f87"/>'+
    SV.t(160,60,'rugalmas energia',12)+SV.t(235,115,'a nyíl elindul',12)),
  sand: SV.svg('A magasan lévő homokblokknak helyzeti energiája van',
    SV.r(40,15,40,40,'#e8d38a')+SV.t(60,80,'fent: helyzeti',12)+SV.t(60,95,'energia',12)+
    '<line x1="150" y1="25" x2="150" y2="80" stroke="#2f7fd1" stroke-width="6"/><polygon points="150,98 138,78 162,78" fill="#2f7fd1"/>'+
    SV.r(40,120,40,25,'#7a5b34')+SV.r(130,120,40,25,'#7a5b34')+SV.r(120,95,60,25,'#e8d38a')+SV.t(240,100,'lent: mozgási',12)+SV.t(240,115,'energia → belső',12)),
  chests: SV.svg('Két láda: az összes kő száma nem változik',
    SV.r(25,70,95,60,'#a9743a')+SV.r(25,60,95,18,'#8a5a2b')+SV.t(72,108,'20 → 10 kő',15,'middle','#fff')+
    SV.arrow(130,95,190,'#2f7fd1')+SV.t(160,82,'10 kő',12)+
    SV.r(200,70,95,60,'#a9743a')+SV.r(200,60,95,18,'#8a5a2b')+SV.t(247,108,'10 → 20 kő',15,'middle','#fff')+SV.t(160,152,'10 kő átkerül, az összeg mindig 30 kő',12)),
  sources: SV.svg('Megújuló és fosszilis energiaforrások',
    SV.sun(45,45)+SV.t(45,95,'Nap',12)+
    SV.r(100,30,8,50,'#ffffff')+SV.r(86,28,36,8,'#ffffff')+SV.t(104,95,'szél',12)+
    SV.r(150,50,60,18,'#6ab0ff')+SV.r(160,68,40,12,'#2f7fd1')+SV.t(180,95,'víz',12)+
    SV.t(80,122,'megújuló: nem fogy el',12)+
    SV.r(30,130,40,22,'#333')+SV.t(50,148,'szén',11,'middle','#fff')+SV.r(100,130,50,22,'#555')+SV.t(125,148,'kőolaj',11,'middle','#fff')+SV.r(180,130,60,22,'#8fb5d9')+SV.t(210,148,'földgáz',11,'middle','#1b2618')+
    SV.t(260,100,'fosszilis',12)+SV.t(260,115,'(elfogy)',12)),
  heat: (function(){ var d=[['Fa',15,'#a9743a'],['Szalma',17,'#e8d38a'],['Kőszén',30,'#444'],['Benzin',43,'#d6403f']], o='';
    d.forEach(function(x,i){ var y=14+i*34, w=x[1]*5.2; o+=SV.t(70,y+19,x[0],13,'end')+SV.r(76,y,w,26,x[2])+SV.t(76+w+6,y+19,x[1]+' MJ/kg',12,'start'); });
    return SV.svg('Fűtőérték: mennyi energiát ad 1 kg üzemanyag', o); })(),
  power: SV.svg('Teljesítmény: P egyenlő E osztva t-vel',
    SV.r(110,15,100,50,'#ffd23f')+SV.t(160,50,'E',32,'middle','#1b2618')+
    SV.r(40,85,100,50,'#9fe07f')+SV.t(90,120,'P',32,'middle','#1b2618')+SV.r(180,85,100,50,'#8fc2f5')+SV.t(230,120,'t',32,'middle','#1b2618')+
    SV.t(160,152,'P = E : t   E = P · t   (watt = J/s)',12)),
  label: SV.svg('Energiaosztályok: A a legtakarékosabb',
    [['A','#2e8b2e'],['B','#6bb52e'],['C','#c8d72e'],['D','#f2c230'],['E','#f08a24'],['F','#e0572a'],['G','#c0392b']].map(function(c,i){ return SV.r(30,12+i*20,50+i*28,18,c[1])+SV.t(40,26+i*20,c[0],13,'start','#10200a'); }).join('')+
    SV.t(250,32,'legtakarékosabb',12)+SV.t(250,148,'legpazarlóbb',12))
};

window.LESSON = {
  id:'energia',
  screens:[
  /* ================= TANULÁS ================= */
  { type:'info', section:'Tanulás', icon:'⚡', title:'Mi az az energia?', fig:FIG.hook,
    body:'<p>Biztos hallottad már: <mark class="k">„tele van energiával”</mark> vagy <mark class="k">„nincs energiám”</mark>. Ezeket a hétköznapokban mondjuk.</p><p>A fizikában az energia <b>pontos fogalom</b>, amit számmal is ki tudunk fejezni.</p><p><b>Ebben a témában megtudod:</b></p><ul><li>mi az energia és milyen fajtái vannak,</li><li>hogyan megy át egyik testből a másikba,</li><li>honnan szerezhetünk energiát,</li><li>mennyi energiát fogyaszt egy gép (teljesítmény),</li><li>és hogyan spórolhatunk vele.</li></ul>',
    mc:'<p>Minecraftban a zombi napfényben felgyullad. Mintha a Nap valamit átadna neki. Pontosan ez az <b>energiaátadás</b>.</p>',
    src:'20. oldal' },

  { type:'info', section:'Tanulás', icon:'🏷️', title:'Az energia jele és mértékegysége', fig:FIG.unit,
    body:'<p>Az energia a tárgyak, anyagok és hullámok <mark class="k">állapotát</mark> mutatja meg. Azt is mondhatjuk: megmutatja, <b>mire képes</b> valami. Tud-e melegíteni, mozgatni, világítani?</p><ul><li><b>Jele:</b> <mark class="k">E</mark></li><li><b>Mértékegysége:</b> <mark class="k">joule</mark>, jele <b>J</b>. Kiejtve: <i>dzsúl</i>.</li></ul><p>Az energiát <b>számmal</b> is meg lehet adni. Például egy víz energiája lehet <b>60 000 J</b>.</p><p>A mértékegységet <b>James Prescott Joule</b> angol tudósról nevezték el.</p>',
    mc:'<p>Gondolj úgy az energiára, mint egy <b>számra</b>, ami megmutatja, mennyi van valamiben. Mint a Minecraftban az életerő vagy az éhség: egy szám, ami változik, és amit át lehet adni.</p>',
    tip:'<p>1 J kb. annyi energia, mint egy kis alma (100 g) 1 méter magasra emelése. Egy pohár joghurtban kb. 600 000 J energia van!</p>',
    src:'20. és 22. oldal' },

  { type:'info', section:'Tanulás', icon:'🔁', title:'Energiaátadás', fig:FIG.transfer,
    body:'<p>Tegyünk <b>hideg vízbe forró vizet</b> tartalmazó poharat. Mit látunk?</p><ul><li>A hideg víz <b>felmelegszik</b>.</li><li>A forró víz <b>lehűl</b>.</li><li>Végül <b>közös hőmérséklet</b> alakul ki.</li></ul><p>Miért? Mert a forró víz <mark class="k">energiát ad át</mark> a hidegnek.</p><p>A forró víz energiája <b>csökken</b>, a hideg víz energiája <b>nő</b>. Mindkét test <b>állapota megváltozik</b>. Amennyit az egyik lead, pontosan annyit kap a másik.</p>',
    mc:'<p>Mint amikor átteszel dolgokat az egyik ládából a másikba. Az egyikben kevesebb lesz, a másikban több.</p>',
    src:'20. oldal' },

  { type:'sim', section:'Tanulás', title:'🌡️ Próbáld ki: átadjuk az energiát!',
    intro:'A forró víz energiája 300 000 J, a hideg vízé 60 000 J. <b>Húzd a csúszkát jobbra</b>, és nézd, mi történik. Az „Együtt” számot is figyeld!',
    src:'20. oldal',
    render:function(box, unlock){
      var HOT=300000, COLD=60000, MAX=40000, x=0;
      var wrap=FizEngine.el('div');
      wrap.innerHTML='<div class="cups">'+
        '<div class="cup"><div>🔥 Forró víz</div><div class="t" id="th"></div><div class="liq" id="lh"></div><div class="en" id="eh"></div><div id="dh" class="hint"></div></div>'+
        '<div class="cup"><div>🧊 Hideg víz</div><div class="t" id="tc"></div><div class="liq" id="lc"></div><div class="en" id="ec"></div><div id="dc" class="hint"></div></div></div>'+
        '<div class="tot" id="tot"></div>'+
        '<label for="sl"><b>Átadott energia:</b> <span id="xv"></span></label>'+
        '<input type="range" id="sl" min="0" max="'+MAX+'" step="2000" value="0">'+
        '<p class="hint" id="sh">Húzd el a csúszkát, és a „Tovább” gomb kinyílik.</p>';
      box.appendChild(wrap);
      var q=function(id){return wrap.querySelector('#'+id)};
      function col(t){var r=Math.round(60+(t-20)/60*195), b=Math.round(255-(t-20)/60*200);return 'rgb('+r+',110,'+b+')'}
      function upd(){
        var f=x/MAX, th=Math.round(80-30*f), tc=Math.round(20+30*f);
        q('th').textContent=th+' °C'; q('tc').textContent=tc+' °C';
        q('lh').style.background=col(th); q('lc').style.background=col(tc);
        q('eh').textContent=fmt(HOT-x)+' J'; q('ec').textContent=fmt(COLD+x)+' J';
        q('dh').textContent=x?('csökkent: −'+fmt(x)+' J'):'induló érték';
        q('dc').textContent=x?('nőtt: +'+fmt(x)+' J'):'induló érték';
        q('tot').innerHTML='Együtt: <span style="font-size:1.3em">'+fmt(HOT-x+COLD+x)+' J</span><br><b>mindig ugyanannyi!</b>';
        q('xv').textContent=fmt(x)+' J';
        if(x>0){ unlock(); q('sh').innerHTML='👏 Ha tovább húzod, a két víz hőmérséklete 50 °C-nál találkozik. A hőmérsékletek itt csak szemléltető számok.'; }
      }
      q('sl').oninput=function(){x=+this.value;upd()};
      upd();
    }},

  { type:'info', section:'Tanulás', icon:'🔥', title:'Belső energia', fig:FIG.ice,
    body:'<p>Ha egy anyag <mark class="k">hőmérséklete nő</mark>, a <mark class="e1">belső energiája</mark> is nő. Ha csökken a hőmérséklete, a belső energiája is csökken.</p><p>A belső energia azt mutatja, hogyan mozognak és kapcsolódnak az anyag <b>atomjai, molekulái</b>. Minél melegebb valami, annál nagyobb a belső energiája.</p><hr><p><b>Mi történik a jéggel?</b></p><ul><li>A jég <mark class="k">0 °C-on olvad</mark>.</li><li>Olvadás közben a hőmérséklete <b>nem változik</b>.</li><li>De közben <b>felvesz energiát</b>. Ez az olvadásra fordítódik: a rendezett részecskék <b>szétválnak</b>.</li></ul>',
    mc:'<p>A kemence is csak akkor olvaszt, ha kap hőt (tüzelőanyagot). Hő nélkül nincs olvadás.</p>',
    tip:'<p>Olvadáskor az anyag energiája <b>nő</b>, pedig a hőmérséklet nem változik. Ezt könnyű elfelejteni, ezért kérdezi a dolgozat is.</p>',
    src:'20–21. oldal' },

  { type:'info', section:'Tanulás', icon:'☀️', title:'A fénynek és a hangnak is van energiája', fig:FIG.light,
    body:'<p>A napra kitett tárgyak <b>felmelegednek</b>, a víz elpárolog, a lufiban lévő levegő kitágul. Tehát a napfény <mark class="k">energiát ad át</mark>. Ezt <mark class="k">napenergiának</mark> hívjuk.</p><p>Nem csak a fénynek van energiája. <b>Minden sugárzásnak és hullámnak</b> van:</p><ul><li>fény</li><li>infravörös sugárzás</li><li>mikrohullám</li><li>hang</li></ul>',
    mc:'<p>A fáklya fényt ad, a nap pedig felgyújtja a zombit. A játékban is látszik, hogy a fény <b>hatással van</b> a dolgokra.</p>',
    tip:'<p>Az <b>infralámpa</b> melegen tartja az ételt az étteremben, és a csibéket is ezzel keltetik ki. Az orvosok <b>ultrahanggal</b> kezelik a sérült izmot: az izom elnyeli a hangot, és felmelegszik.</p>',
    src:'21. oldal' },

  { type:'info', section:'Tanulás', icon:'🖐️', title:'Mozgásból belső energia', fig:FIG.rub,
    body:'<p>Miért dörzsölöd össze a tenyered, ha fázol? Mert a <mark class="e2">mozgás energiája</mark> átalakul <mark class="e1">belső energiává</mark>. Ezért melegszik fel a kezed.</p><ul><li>Haladó (arrébb mozduló) mozgás → <mark class="e2">mozgási energia</mark></li><li>Forgó mozgás → <mark class="e3">forgási energia</mark></li></ul><p>A mozgásból fakadó energiát együtt <mark class="k">mechanikai energiának</mark> hívjuk.</p><p><b>Ugyanez történik</b>, amikor gyufát gyújtasz, vagy kovakövet csiholsz.</p>',
    mc:'<p><b>Kovakő és acél:</b> amikor összeütöd, a mozgás szikrát és hőt csinál. Így gyújtod meg a tüzet.</p>',
    tip:'<p>Fékezz nagyot a biciklivel, és fogd meg a fékpofákat vagy a felnit. <b>Meleg lesz!</b> A mozgási energia belső energiává alakult.</p>',
    src:'21. oldal' },

  { type:'info', section:'Tanulás', icon:'🏹', title:'Rugalmas energia', fig:FIG.bow,
    body:'<p>Egy <b>összenyomott rugónak</b> energiája van. Ez a <mark class="e4">rugalmas energia</mark>.</p><p>Gondolj a hátrahúzós kisautóra: hátrahúzod, ezzel összenyomsz egy rugót. Amikor elengeded, a rugó kinyúlik, és az autó <b>mozgásba lendül</b>.</p><p>A rugalmas energia a mechanikai energia egyik fajtája.</p>',
    mc:'<p><b>Íj:</b> amikor felhúzod, a húr megfeszül. Ebben van a rugalmas energia. Ha elengeded, a nyíl elindul.</p>',
    src:'22. oldal' },

  { type:'info', section:'Tanulás', icon:'⛰️', title:'Helyzeti energia', fig:FIG.sand,
    body:'<p>Amikor elered az eső, az esőcseppek <b>zuhanni kezdenek</b>. Honnan van az energiájuk?</p><p>Onnan, hogy <b>magasan voltak</b>, és a Föld vonzza őket. A magasan lévő testek energiája a <mark class="e5">helyzeti energia</mark>.</p><p>Lefelé zuhanás közben a helyzeti energia <b>mozgási energiává</b> alakul.</p>',
    mc:'<p><b>Homokblokk:</b> amíg magasan van, helyzeti energiája van. Ha leesik, mozgási energiája lesz, és földet éréskor belső energiává alakul.</p>',
    tip:'<p>Joule híres kísérletében egy süllyedő nehezék megforgatott egy lapátkereket a vízben. A víz <b>felmelegedett</b>. Így kimutatta, hogy a mechanikai energia belső energiává alakítható.</p>',
    src:'22. oldal' },

  { type:'info', section:'Tanulás', icon:'📦', title:'Az energia nem vész el!', fig:FIG.chests,
    body:'<p>Egy folyamat közben az egyes testek energiája <b>megváltozik</b>. De az összes energia <mark class="k">mindig ugyanannyi marad</mark>.</p><p>Ezt hívjuk az <mark class="k">energia megmaradásának tételének</mark>.</p><p>Az energia csak <b>átkerül</b> egyik testből a másikba, vagy <b>átalakul</b> egy másik fajtává. Nem keletkezik a semmiből, és nem is tűnik el.</p><p><b>Példa:</b> a forró víz 1500 J energiát ad át a hideg víznek. A hideg víz energiája 1500 J-lal nő.</p>',
    mc:'<p>Átteszel 10 követ az egyik ládából a másikba. Az egyikben 10-zel kevesebb, a másikban 10-zel több. De a <b>kövek összes száma ugyanannyi</b> marad.</p>',
    src:'22. oldal' },

  { type:'info', section:'Tanulás', icon:'🌍', title:'Energiaforrások', fig:FIG.sources,
    body:'<p>Energiaforrás az, amiből energiát tudunk nyerni. <b>A legfontosabb a Nap.</b> Nélküle nem nőne növény, nem fújna szél, és nem esne eső.</p><ul><li><mark class="e2">Megújuló (zöld)</mark>: Nap, szél, víz, föld melege (geotermikus). <b>Nem fogy el.</b></li><li><mark class="e1">Fosszilis (nem megújuló)</mark>: szén, kőolaj (belőle benzin), földgáz. Elégetéssel adnak energiát. <b>Elfogynak.</b></li><li><mark class="k">Másodlagos</mark>: elektromos áram, gőz. <b>Erőművekben</b> állítják elő a többi forrásból.</li></ul>',
    mc:'<p>A fáklya fája elég, és csak addig ad fényt. Mint a fosszilis anyagok: elégetve adnak energiát, aztán elfogynak. A nap viszont mindig süt, vagyis megújuló.</p>',
    tip:'<p>A <b>napelem</b> elektromos áramot állít elő, a <b>napkollektor</b> meleg vizet. Mindkettő a Nap energiáját használja.</p>',
    src:'23–25. oldal' },

  { type:'info', section:'Tanulás', icon:'⛽', title:'Fűtőérték: melyik ad a legtöbbet?', fig:FIG.heat,
    body:'<p>A <mark class="k">fűtőérték</mark> megmutatja, mennyi energiát kapunk <b>1 kg</b> üzemanyag elégetésével.</p><ul><li>Mértékegysége: <b>MJ/kg</b> (megajoule per kilogramm).</li><li>1 MJ = 1 000 000 J, 1 kJ = 1000 J.</li><li>Földgáznál: <b>37 MJ/m³</b> (1 m³ gáz elégetésekor).</li></ul><p><b>Példa:</b> 3 kg benzin elégetésekor 3 · 43 = <b>129 MJ</b> energiát kapunk.</p><p>Minél nagyobb a fűtőérték, annál hatékonyabb az üzemanyag.</p>',
    src:'24–25. oldal' },

  { type:'info', section:'Tanulás', icon:'🍽️', title:'Energiaigények: étel és háztartás',
    body:'<p>Az <b>étel</b> a testünk üzemanyaga. Az elfogyasztott étel energiát ad a mozgáshoz, a testhőmérsékletünk fenntartásához és a gondolkodáshoz is. Ezért fontos a reggeli!</p><p>A <b>joghurt</b> dobozán ez áll: <b>596 kJ</b> (= 596 000 J). Ez az energia van a joghurtban.</p><p>A legtöbb energiát a <mark class="k">zsír</mark> tárolja, kb. kétszer annyit, mint a fehérje vagy a cukor.</p><p>A <b>lakásnak</b> is kell energia: fűtés, főzés, világítás, gépek. A <b>villanyóra</b> és a <b>gázóra</b> méri, mennyit használtunk el, és ennek ára van.</p>',
    mc:'<p>Az éhség- és életerő-sáv Minecraftban is mutatja, hogy az étel energiát ad. Az igazi életben is így van: étel nélkül lemerül a „sávod”.</p>',
    src:'26–27. oldal' },

  { type:'info', section:'Tanulás', icon:'🔌', title:'Teljesítmény: milyen gyorsan?', fig:FIG.power,
    body:'<p>A <mark class="k">teljesítmény</mark> megmutatja, <b>milyen gyorsan</b> használ el egy gép energiát. Vagyis mennyit 1 másodperc alatt.</p><ul><li>Jele: <b>P</b></li><li>Mértékegysége: <mark class="k">watt</mark> (W) = joule/másodperc</li><li><b>P = E : t</b> és <b>E = P · t</b></li></ul><p>Takard le a háromszögben azt, amit keresel. Ami marad, az megmondja a műveletet.</p><p><b>Példa:</b> egy mosogatógép 40 perc alatt 3600 kJ energiát fogyaszt. Teljesítménye: 3 600 000 J : 2400 s = <b>1500 W</b>.</p><p>Egy 7 W-os LED-lámpa másodpercenként 7 J energiát használ.</p>',
    tip:'<p>Számolásnál mindig <b>joule-t és másodpercet</b> használj! 1 kJ = 1000 J, 1 perc = 60 s, 1 óra = 3600 s.</p>',
    src:'27–28. oldal' },

  { type:'info', section:'Tanulás', icon:'♻️', title:'Energia és környezet: légy takarékos!', fig:FIG.label,
    body:'<p>Az üzemanyagok égetésekor <b>korom, füst, szén-dioxid, szén-monoxid</b> keletkezik. Ezek <mark class="k">szennyezik a levegőt</mark> (télen szmog lehet). A kitermelés is károsítja a természetet.</p><p><b>Hogyan takarékoskodhatsz?</b></p><ul><li>Kapcsold le a lámpát és a tévét, ha nem használod.</li><li>Használj LED-izzót.</li><li>Vásárláskor nézd az <b>energiaosztályt</b>: A a legtakarékosabb, G a legpazarlóbb.</li></ul>',
    mc:'<p>Ha szüntelenül égeted a fát, elfogy. Ezért érdemes megújuló energiát használni, és spórolni a világban is.</p>',
    src:'30–31. oldal' },

  { type:'info', section:'Tanulás', icon:'📋', title:'Ennyit kell tudni',
    body:'<ul><li>Az energia jele <b>E</b>, mértékegysége <b>joule (J)</b>.</li><li>Folyamatoknál <b>energiaátadás</b> történik, az összes energia <b>megmarad</b>.</li><li><mark class="e1">Belső</mark> (hőmérséklet), <mark class="e2">mozgási</mark>, <mark class="e3">forgási</mark>, <mark class="e4">rugalmas</mark>, <mark class="e5">helyzeti</mark> energia. A fénynek és a hangnak is van energiája.</li><li><b>Megújuló:</b> Nap, szél, víz, geotermikus. <b>Fosszilis:</b> szén, kőolaj, földgáz. <b>Másodlagos:</b> elektromos áram.</li><li><b>Fűtőérték</b> (MJ/kg): mennyi energiát ad 1 kg üzemanyag.</li><li><b>Teljesítmény:</b> P = E : t, mértékegysége watt (W).</li><li>Takarékoskodj: LED, lámpa lekapcsolása, A osztályú gép.</li></ul><p><b>Most jön a játék! 🎮</b></p>',
    src:'22., 25., 28., 31. oldal – összefoglalások' },

  /* ================= JÁTÉKOK ================= */
  { type:'match', section:'Játék 1', title:'🔗 Párosítás: mi tartozik össze?',
    pairs:[['Az energia jele','E'],['Az energia mértékegysége','joule (J)'],['Összenyomott rugó','rugalmas energia'],['Magasan lévő test','helyzeti energia'],['Haladó mozgás','mozgási energia'],['Forgó mozgás','forgási energia']] },

  { type:'tf', section:'Játék 2', title:'⚡ Igaz vagy hamis?',
    items:[
      {t:'Csak a mozgó tárgyaknak van energiájuk.', a:false, why:'A fénynek, a hangnak és az összenyomott rugónak is van energiája.'},
      {t:'A hangnak is van energiája.', a:true, why:'Minden hullámnak és sugárzásnak van energiája, a hangnak is.'},
      {t:'Amikor a forró víz átad energiát a hidegnek, a forró víz energiája nő.', a:false, why:'A forró víz energiája csökken, a hideg víz energiája nő.'},
      {t:'A jég olvadás közben felvesz energiát.', a:true, why:'Az olvadásra fordítódik az energia, közben a hőmérséklet nem változik.'},
      {t:'A szén és a földgáz megújuló energiaforrás.', a:false, why:'Fosszilisek, elfogynak. Megújuló pl. a Nap, a szél és a víz.'},
      {t:'A teljesítmény mértékegysége a watt.', a:true, why:'1 watt = 1 joule másodpercenként.'}
    ]},

  { type:'memory', section:'Játék 3', title:'🧠 Memóriajáték',
    pairs:[['E','energia jele'],['J','joule'],['P','teljesítmény'],['W','watt'],['Rugó','rugalmas energia'],['Zuhanás','mozgási energia']] },

  { type:'drag', section:'Játék 4', title:'📦 Csoportosítsd: megújuló vagy fosszilis?',
    bins:[{id:'megujulo',name:'Megújuló',icon:'🌱'},{id:'fosszilis',name:'Fosszilis',icon:'🛢️'},{id:'masodlagos',name:'Másodlagos',icon:'🔌'}],
    items:[{t:'Nap',c:'megujulo'},{t:'szél',c:'megujulo'},{t:'víz energiája',c:'megujulo'},{t:'geotermikus energia',c:'megujulo'},
      {t:'szén',c:'fosszilis'},{t:'kőolaj',c:'fosszilis'},{t:'földgáz',c:'fosszilis'},{t:'elektromos áram',c:'masodlagos'}] },

  { type:'drag', section:'Játék 5', title:'📦 Csoportosítsd: melyik energiafajta?',
    bins:[{id:'belso',name:'Belső',icon:'🔥'},{id:'mozgasi',name:'Mozgási',icon:'🏃'},{id:'rugalmas',name:'Rugalmas',icon:'🏹'},{id:'helyzeti',name:'Helyzeti',icon:'⛰️'}],
    items:[{t:'forró tea',c:'belso'},{t:'meleg víz',c:'belso'},{t:'száguldó kerékpár',c:'mozgasi'},{t:'zuhanó esőcsepp',c:'mozgasi'},
      {t:'felhúzott íj húrja',c:'rugalmas'},{t:'összenyomott rugó',c:'rugalmas'},{t:'hegytetőn álló szikla',c:'helyzeti'},{t:'magasan lévő tégla',c:'helyzeti'}] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'Az energia jele ___, mértékegysége a ___. A forró víz energiája ___, a hideg víz energiája ___. Az összes energia ___.',
    answers:['E','joule','csökken','nő','megmarad'], extra:['méter','eltűnik','kilogramm'],
    explain:'Az energia átkerül a forró vízből a hidegbe, de az összege nem változik.' },

  /* ================= DOLGOZAT GYAKORLÓ ================= */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat a szókártyákkal!',
    text:'A teljesítmény mértékegysége a ___. Az olyan energiaforrás, ami nem fogy el, ___. A ___ megmutatja, mennyi energiát ad 1 kg üzemanyag. Az elektromos áram ___ energiaforrás. A jég olvadáskor ___ energiát.',
    answers:['watt','megújuló','fűtőérték','másodlagos','vesz fel'], extra:['fosszilis','ad le','joule'],
    explain:'Ezek az energiaforrások és a teljesítmény alapfogalmai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze a mennyiséget a mértékegységével!',
    pairs:[['energia (E)','J (joule)'],['teljesítmény (P)','W (watt)'],['idő (t)','s (másodperc)'],['fűtőérték (szén, fa)','MJ/kg'],['1 MJ','1 000 000 J']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'A Nap a legfontosabb energiaforrásunk.', a:true, why:'A Nap nélkül nem lenne növény, szél, eső.'},
      {t:'A zsír tárolja a legtöbb energiát grammonként.', a:true, why:'Kb. kétszer annyit, mint a fehérje vagy a cukor.'},
      {t:'A G energiaosztályú gép a legtakarékosabb.', a:false, why:'Az A a legtakarékosabb, a G a legpazarlóbb.'},
      {t:'A forró víz energiája csökken, ha átad energiát a hideg víznek.', a:true, why:'Amennyit ő lead, annyit kap a hideg víz.'},
      {t:'Az üzemanyagok elégetése nem szennyezi a levegőt.', a:false, why:'Korom, szén-dioxid, szén-monoxid keletkezik.'},
      {t:'Az energia keletkezhet a semmiből.', a:false, why:'Az energia nem keletkezik és nem tűnik el, csak átalakul vagy átkerül.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. A jég 0 °C-on olvad. Mi lesz a felvett energiával olvadás közben?',
    options:['Az olvadásra fordítódik.','Eltűnik.','A jég hőmérséklete nő.','Fénnyé alakul.'], correct:0,
    explain:'Olvadás közben a hőmérséklet nem változik, az energia a részecskék szétválasztására megy el.', hint:'A hőmérséklet nem változik olvadás közben.' },

  { type:'quiz', section:'Dolgozat', q:'5. Miért melegszik fel a kezed, ha összedörzsölöd?',
    options:['A mozgási energia belső energiává alakul.','A kezed energiát vesz fel a levegőből.','Elfogy az energiád.','A fény felmelegíti.'], correct:0,
    explain:'A mozgás energiája belső energiává alakul, ezért nő a hőmérséklet.', hint:'Mozgásból mi lesz?' },

  { type:'quiz', section:'Dolgozat', q:'6. Melyik NEM megújuló energiaforrás?',
    options:['kőolaj','szél','víz','Nap'], correct:0, explain:'A kőolaj fosszilis, elfogy. A többi megújuló.', hint:'Melyik adja elégetéssel az energiát?' },

  { type:'quiz', section:'Dolgozat', q:'7. Egy gép teljesítménye 100 W. Mit jelent ez?',
    options:['Másodpercenként 100 J energiát használ.','100 J energiát tárol.','100 másodpercig működik.','Összesen 100 kg üzemanyagot fogyaszt.'], correct:0,
    explain:'1 W = 1 J/s, tehát 100 W = másodpercenként 100 J.', hint:'A watt = joule másodpercenként.' },

  { type:'quiz', section:'Dolgozat', q:'8. Melyik tárolja a legtöbb energiát ugyanakkora tömegben?',
    options:['a zsír','a cukor','a fehérje','a víz'], correct:0, explain:'A zsír energiatartalma kb. kétszerese a cukorénak és a fehérjéjének.', hint:'Ezért hizlal a zsíros étel.' },

  { type:'calc', section:'Dolgozat', count:5, gens:[
    function(){ var d=500*(1+Math.floor(Math.random()*10));
      return {q:'Egy forró víz energiája <b>'+fmt(d)+' J</b>-lal csökken, miközben átad energiát egy hideg víznek. <b>Mennyivel nő a hideg víz energiája?</b> (J)', a:d, u:'J',
        hint:'Amennyit a forró víz lead, annyit vesz fel a hideg.', explain:'A hideg víz energiája '+fmt(d)+' J-lal nő.'}; },
    function(){ var a=10000*(3+Math.floor(Math.random()*20)), b=10000*(2+Math.floor(Math.random()*10));
      return {q:'Két víz energiája együtt: <b>'+fmt(a)+' J</b> + <b>'+fmt(b)+' J</b>. Kölcsönhatás után mennyi az összes energiájuk? (J)', a:a+b, u:'J',
        hint:'Az összes energia megmarad. Add össze!', explain:fmt(a)+' + '+fmt(b)+' = '+fmt(a+b)+' J. Az összeg nem változik.'}; },
    function(){ var P=pick([500,800,1000,1200,1500,1800,2000]), t=pick([10,20,30,40,60]), E=P*t*60/1000;
      return {q:'Egy gép <b>'+t+' perc</b> alatt <b>'+fmt(E)+' kJ</b> energiát fogyaszt. <b>Mekkora a teljesítménye?</b> (W)', a:P, u:'W',
        hint:'P = E : t. Váltsd át: E-t joule-ra (1 kJ = 1000 J), t-t másodpercre (1 perc = 60 s).',
        explain:fmt(E*1000)+' J : '+(t*60)+' s = '+fmt(P)+' W.'}; },
    function(){ var P=pick([5,7,10,40,60,80,100]), t=pick([10,30,60,120]);
      return {q:'Egy <b>'+P+' W</b>-os égő <b>'+t+' másodpercig</b> világít. <b>Mennyi energiát használ fel?</b> (J)', a:P*t, u:'J',
        hint:'E = P · t.', explain:P+' W · '+t+' s = '+fmt(P*t)+' J.'}; },
    function(){ var f=pick([['fa',15],['kőszén',30],['benzin',43]]), m=2+Math.floor(Math.random()*8);
      return {q:'<b>'+m+' kg '+f[0]+'</b> elégetésekor hány MJ energiát nyerünk? A '+f[0]+' fűtőértéke <b>'+f[1]+' MJ/kg</b>. (MJ)', a:f[1]*m, u:'MJ',
        hint:'Szorozd meg a tömeget a fűtőértékkel.', explain:m+' kg · '+f[1]+' MJ/kg = '+(f[1]*m)+' MJ.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Mi az energia jele és mértékegysége?','E és joule (J)'],
      ['Belső energia','A hőmérséklethez tartozik. Nő, ha az anyag melegszik.'],
      ['Mozgási energia','A haladó mozgásból fakadó energia.'],
      ['Forgási energia','A forgó mozgásból fakadó energia.'],
      ['Rugalmas energia','Pl. az összenyomott rugónak van.'],
      ['Helyzeti energia','A magasan lévő testeké. A Föld vonzása mozgásba hozhatja.'],
      ['Mit mond ki az energia megmaradásának tétele?','Az összes energia a folyamat alatt ugyanannyi marad.'],
      ['Megújuló energiaforrások','Nap, szél, víz, geotermikus. Nem fogynak el.'],
      ['Fosszilis energiaforrások','Szén, kőolaj, földgáz. Elégetéssel adnak energiát, elfogynak.'],
      ['Fűtőérték','Mennyi energiát ad 1 kg üzemanyag. Mértékegysége: MJ/kg.'],
      ['Teljesítmény','P = E : t, mértékegysége watt (W). Azt mutatja, milyen gyorsan használ el energiát a gép.'],
      ['Melyik energiaosztály a legtakarékosabb?','Az A osztály.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
