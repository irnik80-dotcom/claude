/* Világítás, fény – VII. fejezet (tankönyv 152–172. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var FIG = {
  sources: SV.boxes('Elsődleges és másodlagos fényforrások',[['☀️ Nap, lámpa, tűz','#fdeeb0'],['🌙 Hold, tükör, fal','#d4e6fb']],'maga világít · csak visszaveri a fényt'),
  shadow: SV.svg('Árnyék: a fény egyenes vonalban terjed',
    '<circle cx="45" cy="75" r="16" fill="#ffd23f" stroke="#1b2618" stroke-width="3"/>'+SV.r(130,50,24,50,'#555')+
    '<line x1="60" y1="70" x2="270" y2="40" stroke="#f2b705" stroke-width="3"/><line x1="60" y1="80" x2="270" y2="110" stroke="#f2b705" stroke-width="3"/>'+
    SV.r(268,40,20,70,'#8b8f87')+SV.t(160,140,'a tárgy mögött árnyék keletkezik',12)),
  reflect: SV.svg('Visszaverődés: a beesési szög egyenlő a visszaverődési szöggel',
    '<line x1="40" y1="110" x2="280" y2="110" stroke="currentColor" stroke-width="5"/><line x1="160" y1="110" x2="160" y2="20" stroke="#8b8f87" stroke-width="2" stroke-dasharray="5 4"/>'+
    '<line x1="70" y1="30" x2="160" y2="110" stroke="#f2b705" stroke-width="5"/><line x1="160" y1="110" x2="250" y2="30" stroke="#f2b705" stroke-width="5"/>'+
    SV.t(105,95,'α',18,'middle')+SV.t(215,95,"α'",18,'middle')+SV.t(160,14,'beesési merőleges',11)+SV.t(160,142,'α = α\'',14)),
  mirror: SV.svg('A síktükör képe: azonos nagyságú, látszólagos, ugyanolyan messze van',
    SV.r(150,20,10,110,'#8fc2f5')+SV.r(70,70,26,36,'#d6403f')+SV.t(83,125,'tárgy',11)+SV.r(214,70,26,36,'#ff9d96')+SV.t(227,125,'kép (látszólagos)',10)+
    '<line x1="96" y1="88" x2="214" y2="88" stroke="#8b8f87" stroke-width="2" stroke-dasharray="5 4"/>'),
  curve: SV.svg('Homorú és domború tükör',
    '<path d="M70 20 Q30 80 70 140" fill="none" stroke="#2f7fd1" stroke-width="7"/>'+SV.t(80,155,'homorú',12)+
    '<path d="M250 20 Q290 80 250 140" fill="none" stroke="#2f7fd1" stroke-width="7"/>'+SV.t(240,155,'domború',12)+SV.t(160,80,'(kanál két oldala)',11)),
  refract: SV.svg('Fénytörés: a fény megtörik két közeg határán',
    SV.r(20,80,280,60,'#bfe3ff')+SV.t(40,100,'víz / üveg',12,'start')+SV.t(40,40,'levegő',12,'start')+
    '<line x1="40" y1="80" x2="300" y2="80" stroke="currentColor" stroke-width="3"/>'+
    '<line x1="90" y1="20" x2="160" y2="80" stroke="#f2b705" stroke-width="5"/><line x1="160" y1="80" x2="200" y2="140" stroke="#f2b705" stroke-width="5"/>'+
    '<line x1="160" y1="80" x2="230" y2="20" stroke="#f2b705" stroke-width="2" stroke-dasharray="4 4"/>'+SV.t(115,60,'α',14)+SV.t(185,110,'β',14)),
  prism: SV.svg('A prizma felbontja a fehér fényt színekre',
    '<polygon points="130,120 180,30 230,120" fill="#cfe9ff" stroke="#1b2618" stroke-width="3"/>'+
    '<line x1="40" y1="90" x2="150" y2="85" stroke="#fff" stroke-width="5"/><line x1="40" y1="90" x2="150" y2="85" stroke="#8b8f87" stroke-width="1"/>'+
    ['#d6403f','#f08a24','#f2c230','#2e8b2e','#2f7fd1','#7a3bbd'].map(function(c,i){ return '<line x1="205" y1="90" x2="300" y2="'+(40+i*14)+'" stroke="'+c+'" stroke-width="4"/>'; }).join('')),
  lens: SV.svg('Gyűjtőlencse: középen vastagabb, a fényt a fókuszba gyűjti',
    '<path d="M150 20 Q175 80 150 140 Q125 80 150 20" fill="#cfe9ff" stroke="#1b2618" stroke-width="3"/>'+
    '<line x1="30" y1="55" x2="150" y2="55" stroke="#f2b705" stroke-width="3"/><line x1="30" y1="80" x2="150" y2="80" stroke="#f2b705" stroke-width="3"/><line x1="30" y1="105" x2="150" y2="105" stroke="#f2b705" stroke-width="3"/>'+
    '<line x1="150" y1="55" x2="250" y2="80" stroke="#f2b705" stroke-width="3"/><line x1="150" y1="105" x2="250" y2="80" stroke="#f2b705" stroke-width="3"/><circle cx="250" cy="80" r="5" fill="#d6403f"/>'+SV.t(250,100,'fókusz',11)),
  eye: SV.svg('A szem: a szemlencse az ideghártyán fordított képet állít elő',
    '<ellipse cx="170" cy="80" rx="70" ry="52" fill="#fff" stroke="#1b2618" stroke-width="3"/><circle cx="110" cy="80" r="18" fill="#2f7fd1" stroke="#1b2618" stroke-width="3"/><circle cx="110" cy="80" r="7" fill="#000"/>'+
    '<path d="M230 45 Q250 80 230 115" fill="none" stroke="#d6403f" stroke-width="5"/>'+SV.t(110,30,'pupilla',11)+SV.t(250,32,'ideghártya',11,'middle')+SV.t(160,150,'kicsinyített, fordított, valódi kép',11)),
  colors: SV.boxes('A fehér fény színei',[['vörös','#d6403f'],['narancs','#f08a24'],['sárga','#f2c230'],['zöld','#6bb52e'],['kék','#2f7fd1'],['ibolya','#7a3bbd']],'a vörösnek a legnagyobb, az ibolyának a legkisebb a hullámhossza')
};

window.LESSON = {
  id:'feny',
  screens:[
  { type:'info', section:'Tanulás', icon:'💡', title:'A fény és az árnyék', fig:FIG.shadow,
    body:'<p>Honnan jön a fény? Kétféle fényforrás van:</p><ul><li><mark class="k">Elsődleges</mark> fényforrás: <b>maga világít</b> (Nap, lámpa, tűz, fáklya).</li><li><mark class="k">Másodlagos</mark> fényforrás: <b>csak visszaveri</b> a fényt (Hold, tükör, fal, könyv).</li></ul><p>A fény egy adott anyagban <mark class="k">egyenes vonalban terjed</mark>. Ha a fénysugár útjába <b>átlátszatlan tárgyat</b> teszünk, <b>árnyék</b> keletkezik.</p>',
    mc:'<p>A fáklya elsődleges fényforrás: ő világít. A fáklyától megvilágított blokk másodlagos: csak visszaveri a fényt.</p>',
    tip:'<p>A Hold sem világít: a Nap fényét veri vissza. Ezért másodlagos fényforrás.</p>',
    src:'152–154. oldal' },

  { type:'info', section:'Tanulás', icon:'🪞', title:'A fény visszaverődése', fig:FIG.reflect,
    body:'<p>A fénysugár új közeg határán <mark class="k">visszaverődik</mark>.</p><p><b>A visszaverődés törvénye:</b></p><ul><li>a <b>beesési szög</b> egyenlő a <b>visszaverődési szöggel</b> (α = α\')</li><li>a beeső sugár, a visszavert sugár és a beesési merőleges <b>egy síkban</b> van</li></ul><p><b>Sima felületről</b> (tükör) a fény <b>rendezetten</b> verődik vissza. <b>Érdes felületről</b> <b>szórtan</b> verődik vissza, ezért látjuk a tárgyakat minden irányból.</p>',
    mc:'<p>Ha egyenes tükröt tartasz, a fény pontosan ugyanakkora szögben verődik vissza. Mint a biliárdgolyó a falról.</p>',
    src:'155–156. oldal' },

  { type:'info', section:'Tanulás', icon:'🪞', title:'A síktükör képe', fig:FIG.mirror,
    body:'<p>A <mark class="k">síktükörrel</mark> előállított kép:</p><ul><li><b>azonos nagyságú</b> a tárggyal,</li><li><b>ugyanolyan messze</b> van a tükör mögött, mint a tárgy előtte,</li><li>mindig <mark class="k">látszólagos</mark> (a tükör mögött keletkezik, nem lehet ernyőn felfogni).</li></ul><p>A tükör <b>felcseréli a jobb és bal oldalt</b>: ha a jobb kezedet emeled, a képed bal keze emelkedik.</p>',
    src:'156–157. oldal' },

  { type:'info', section:'Tanulás', icon:'🥄', title:'Gömbtükör', fig:FIG.curve,
    body:'<p>Kétféle <mark class="k">gömbtükör</mark> van:</p><ul><li><mark class="k">Homorú</mark> tükör: befelé hajlik, mint a kanál belseje. <b>Valódi és látszólagos</b> képet is előállíthat.</li><li><mark class="k">Domború</mark> tükör: kifelé hajlik, mint a kanál külseje. <b>Csak látszólagos</b> képet ad (kicsinyített, egyenes állású).</li></ul><p>A kép tulajdonságai:</p><ul><li><b>valódi</b> (a tükör előtt keletkezik) vagy <b>látszólagos</b> (a tükör mögött),</li><li><b>egyenes</b> vagy <b>fordított</b> állású,</li><li><b>nagyított</b> vagy <b>kicsinyített</b>.</li></ul>',
    tip:'<p>A <b>domború tükör</b> nagy területet mutat, ezért használják a kanyarokban és a gépkocsik külső tükrében. Az <b>homorú</b> tükör nagyítja a képet (borotválkozó-, sminktükör).</p>',
    src:'157–159. oldal' },

  { type:'info', section:'Tanulás', icon:'🌈', title:'Fénytörés', fig:FIG.refract,
    body:'<p>Ha a fény két átlátszó közeg határához érkezik:</p><ul><li>egy része <b>visszaverődik</b>,</li><li>másik része <b>irányt változtatva behatol</b> a második közegbe, és <mark class="k">megtörik</mark>.</li></ul><p>A <b>törési szög (β)</b>:</p><ul><li><b>kisebb</b>, ha a fény levegőből vízbe vagy üvegbe megy,</li><li><b>nagyobb</b>, ha vízből vagy üvegből a levegőbe lép.</li></ul><p>Nagyobb beesési szöghöz nagyobb törési szög tartozik.</p>',
    mc:'<p>Ha egy botot a vízbe teszel, „megtörik”. Pedig csak a fény törik a víz felszínén.</p>',
    src:'160–162. oldal' },

  { type:'info', section:'Tanulás', icon:'🔺', title:'Prizmák és a színek', fig:FIG.prism,
    body:'<p>A <mark class="k">prizma</mark> átlátszó anyagból készül, síkfelületek határolják. A prizmán áthaladó fénysugár <b>kétszer törik meg</b>, és a prizma <b>vastagabb vége</b> felé tér el.</p><p>A <mark class="k">fehér fény összetett</mark>: vörös, narancs, sárga, zöld, kék és ibolya színekből áll. A prizma <b>szétbontja</b> ezeket, ez a <b>színkép</b>. Így keletkezik a szivárvány is.</p>',
    tip:'<p>A színek sorrendje: <b>vörös, narancs, sárga, zöld, kék, ibolya</b>. Emlékeztető: a szivárványban a vörös van kívül.</p>',
    src:'163–165. oldal' },

  { type:'info', section:'Tanulás', icon:'🔍', title:'Lencsék', fig:FIG.lens,
    body:'<p>Az <mark class="k">optikai lencse</mark> átlátszó anyagból készül, felületét <b>gömbfelületdarabok</b> határolják.</p><ul><li><mark class="k">Gyűjtőlencse</mark>: <b>középen vastagabb</b>, pozitív dioptriájú. A fókuszon kívüli tárgyról <b>valódi</b> képet, a fókuszon belüli tárgyról <b>látszólagos</b> képet készít.</li><li><mark class="k">Szórólencse</mark>: <b>szélén vastagabb</b>, negatív dioptriájú. <b>Mindig látszólagos</b> képet állít elő.</li></ul><p>A <b>dioptria</b> a lencse erősségét mutatja: <b>D = 1 : f</b>, ahol f a fókusztávolság méterben.</p>',
    mc:'<p>Egy nagyító gyűjtőlencse. A Minecraftban a távcső (spyglass) is lencsékkel nagyít.</p>',
    src:'163–165. oldal' },

  { type:'info', section:'Tanulás', icon:'👁️', title:'A látás', fig:FIG.eye,
    body:'<p>A fény útja a szemünkben: a <b>pupillán</b> át jut be, a <b>szemlencse</b> az <b>ideghártyán</b> <b>kicsinyített, fordított állású, valódi</b> képet állít elő.</p><ul><li>A <b>pupilla</b> mérete szabályozza a szembe jutó fény mennyiségét.</li><li>A szemlencse <b>fókusztávolsága változtatható</b>, így látunk élesen közelre és távolra.</li></ul><p><b>Látáshibák:</b></p><ul><li><mark class="k">Rövidlátás</mark>: <b>szórólencsés</b> szemüveggel javítjuk.</li><li><mark class="k">Távollátás</mark>: <b>gyűjtőlencsés</b> szemüveggel javítjuk.</li></ul>',
    tip:'<p>Az agyunk „visszafordítja” a fordított képet, ezért látunk mégis egyenesen.</p>',
    src:'166–168. oldal' },

  { type:'info', section:'Tanulás', icon:'🔭', title:'Optikai eszközök',
    body:'<p>Az optikai eszközök <b>lencsét</b> és/vagy <b>tükröt</b> használnak:</p><ul><li><b>nagyító</b> (gyűjtőlencse),</li><li><b>szemüveg</b> (látáshibák javítására),</li><li><b>fényképezőgép</b> (valódi képet állít elő),</li><li><b>mikroszkóp</b> (apró dolgokat nagyít),</li><li><b>távcső</b> (távoli dolgokat hoz közel).</li></ul>',
    mc:'<p>A távcsővel (spyglass) Minecraftban is messzire látsz. Valódi távcsővel a csillagokat, a Holdat nézhetjük meg.</p>',
    src:'169–171. oldal' },

  { type:'info', section:'Tanulás', icon:'🎨', title:'A fény sebessége és a színek', fig:FIG.colors,
    body:'<p>A <mark class="k">fény elektromágneses hullám</mark>. Terjedési sebessége légüres térben és levegőben kb. <b>300 000 km/s</b>.</p><p>A színes fények <b>hullámhossza</b> különböző: a <b>vörösé</b> a legnagyobb, az <b>ibolyáé</b> a legkisebb.</p><p>A fehér fényből egy színt kivonva a többi szín keveréke a kivont szín <mark class="k">kiegészítő (komplementer)</mark> színe. A tárgyakat olyan színűnek látjuk, amilyen színű fényt <b>visszavernek</b>.</p>',
    tip:'<p>A Napból a fény kb. <b>8 perc</b> alatt ér a Földre. A Holdról kb. 1,3 másodperc alatt ér hozzánk a fény.</p>',
    src:'186–189. oldal' },

  { type:'info', section:'Tanulás', icon:'📋', title:'Ennyit kell tudni',
    body:'<ul><li>Elsődleges fényforrás világít, másodlagos visszaver. A fény egyenes vonalban terjed, árnyékot ad.</li><li>Visszaverődés: <b>α = α\'</b>. Síktükör képe: azonos nagyságú, látszólagos.</li><li>Gömbtükör: <b>homorú</b> (valódi és látszólagos kép), <b>domború</b> (csak látszólagos).</li><li>Fénytörés: levegő → víz esetén a törési szög kisebb.</li><li>Prizma: felbontja a fehér fényt színekre.</li><li>Gyűjtőlencse: középen vastag. Szórólencse: szélén vastag.</li><li>Rövidlátás: szórólencse. Távollátás: gyűjtőlencse.</li><li>A fény sebessége: <b>300 000 km/s</b>.</li></ul><p><b>Most jön a játék! 🎮</b></p>',
    src:'172. oldal – összefoglalás' },

  /* ===== JÁTÉKOK ===== */
  { type:'match', section:'Játék 1', title:'🔗 Párosítás: fogalom és meghatározás',
    pairs:[['elsődleges fényforrás','maga világít'],['másodlagos fényforrás','visszaveri a fényt'],['síktükör képe','látszólagos'],['gyűjtőlencse','középen vastagabb'],['szórólencse','szélén vastagabb'],['prizma','felbontja a fehér fényt']] },

  { type:'tf', section:'Játék 2', title:'⚡ Igaz vagy hamis?',
    items:[
      {t:'A Hold elsődleges fényforrás.', a:false, why:'A Hold csak visszaveri a Nap fényét: másodlagos.'},
      {t:'A fény egyenes vonalban terjed.', a:true, why:'Ezért keletkezik árnyék.'},
      {t:'A beesési szög egyenlő a visszaverődési szöggel.', a:true, why:'Ez a visszaverődés törvénye.'},
      {t:'A síktükör valódi képet állít elő.', a:false, why:'A síktükör képe mindig látszólagos.'},
      {t:'A rövidlátást gyűjtőlencsével javítjuk.', a:false, why:'A rövidlátást szórólencse javítja.'},
      {t:'A fehér fény színekből áll.', a:true, why:'A prizma ezeket szétbontja.'}
    ]},

  { type:'memory', section:'Játék 3', title:'🧠 Memóriajáték',
    pairs:[['α','beesési szög'],['β','törési szög'],['f','fókusztávolság'],['dioptria','lencse erőssége'],['homorú','valódi és látszólagos kép'],['domború','csak látszólagos kép']] },

  { type:'drag', section:'Játék 4', title:'📦 Elsődleges vagy másodlagos fényforrás?',
    bins:[{id:'elso',name:'Elsődleges',icon:'☀️'},{id:'masod',name:'Másodlagos',icon:'🌙'}],
    items:[{t:'Nap',c:'elso'},{t:'fáklya',c:'elso'},{t:'LED lámpa',c:'elso'},{t:'tűz',c:'elso'},{t:'Hold',c:'masod'},{t:'tükör',c:'masod'},{t:'könyv lapja',c:'masod'},{t:'fal',c:'masod'}] },

  { type:'drag', section:'Játék 5', title:'📦 Lencsék és hibák',
    bins:[{id:'gyujto',name:'Gyűjtőlencse',icon:'🔍'},{id:'szoro',name:'Szórólencse',icon:'🔎'}],
    items:[{t:'középen vastagabb',c:'gyujto'},{t:'távollátás javítása',c:'gyujto'},{t:'nagyító',c:'gyujto'},{t:'szélén vastagabb',c:'szoro'},{t:'rövidlátás javítása',c:'szoro'},{t:'negatív dioptria',c:'szoro'}] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'A fény ___ vonalban terjed. A síktükör képe ___. A prizma a fehér fényt ___ bontja. A fény sebessége ___ km/s.',
    answers:['egyenes','látszólagos','színekre','300 000'], extra:['görbe','valódi','3000'],
    explain:'A fény egyenes vonalban terjed, a síktükör képe látszólagos.' },

  /* ===== DOLGOZAT GYAKORLÓ ===== */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'A fény új közeg határán ___. A homorú tükör ___ képet is előállíthat. A gyűjtőlencse ___ vastagabb. A szemlencse az ideghártyán ___ állású képet hoz létre. A vörös fény hullámhossza a ___.',
    answers:['visszaverődik','valódi','középen','fordított','legnagyobb'], extra:['legkisebb','egyenes','szélén'],
    explain:'A Fény fejezet alapfogalmai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze!',
    pairs:[['síktükör','azonos nagyságú látszólagos kép'],['domború tükör','kicsinyített, látszólagos kép'],['gyűjtőlencse','fókuszba gyűjti a fényt'],['prizma','színekre bontja a fehér fényt'],['szem','fordított, kicsinyített, valódi kép']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'Levegőből vízbe lépve a fénysugár törési szöge kisebb a beesési szögnél.', a:true, why:'Sűrűbb közegbe lépve a fény a merőleges felé törik.'},
      {t:'A fény légüres térben nem terjed.', a:false, why:'A fény légüres térben is terjed, ott a leggyorsabb.'},
      {t:'A síktükörben a kép ugyanolyan messze van a tükör mögött, mint a tárgy előtte.', a:true, why:'Ez a síktükör egyik tulajdonsága.'},
      {t:'A szórólencse valódi képet állít elő.', a:false, why:'A szórólencse csak látszólagos képet ad.'},
      {t:'A pupilla a szembe jutó fény mennyiségét szabályozza.', a:true, why:'Sötétben nagyobb, fényben kisebb.'},
      {t:'A kék fény hullámhossza nagyobb, mint a vörösé.', a:false, why:'A vörösé a legnagyobb, az ibolyáé a legkisebb.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Mit jelent az, hogy a kép látszólagos?',
    options:['A tükör mögött keletkezik, ernyőn nem fogható fel.','A tükör előtt keletkezik.','Fordított állású.','Mindig kicsinyített.'], correct:0, explain:'A látszólagos kép a tükör mögött keletkezik.', hint:'Ernyőre nem vetíthető.' },
  { type:'quiz', section:'Dolgozat', q:'5. Melyik szemüveg javítja a rövidlátást?',
    options:['szórólencsés','gyűjtőlencsés','síküveg','színes'], correct:0, explain:'A rövidlátást szórólencsével javítjuk.', hint:'A szórólencse negatív dioptriájú.' },
  { type:'quiz', section:'Dolgozat', q:'6. Mekkora a beesési szög, ha a visszaverődési szög 35°?',
    options:['35°','55°','70°','145°'], correct:0, explain:'α = α\', ezért a beesési szög is 35°.', hint:'A két szög egyenlő.' },
  { type:'quiz', section:'Dolgozat', q:'7. Mi az a komplementer szín?',
    options:['a kivont szín mellé tartozó, a többi szín keveréke','a fehér fény','a vörös fény','minden fekete tárgy színe'], correct:0, explain:'A fehér fényből egy színt kivonva a többi szín keveréke a komplementer szín.', hint:'Fehér mínusz egy szín.' },

  { type:'calc', section:'Dolgozat', count:4, gens:[
    function(){ var a=pick([20,30,35,40,45,60]);
      return {q:'A fénysugár beesési szöge <b>'+a+'°</b> a síktükörre. <b>Mekkora a visszaverődési szög?</b> (°)', a:a, u:'°', hint:'α = α\'.', explain:'A visszaverődési szög is '+a+'°.'}; },
    function(){ var f=pick([0.5,0.25,0.2,1,0.1]);
      return {q:'Egy gyűjtőlencse fókusztávolsága <b>'+f+' m</b>. <b>Mekkora a dioptriája?</b> (D = 1 : f) (dioptria)', a:1/f, u:'D', tol:0.05, hint:'D = 1 : f, f méterben.', explain:'1 : '+f+' = '+(1/f)+' dioptria.'}; },
    function(){ var t=pick([2,3,5,10]);
      return {q:'A fény sebessége <b>300 000 km/s</b>. <b>Mekkora utat tesz meg '+t+' másodperc alatt?</b> (km)', a:300000*t, u:'km', hint:'s = v · t.', explain:'300 000 · '+t+' = '+fmt(300000*t)+' km.'}; },
    function(){ var d=pick([2,3,4,5]);
      return {q:'Egy tárgy <b>'+d+' m</b>-re áll a síktükörtől. <b>Milyen messze van a képe a tükör mögött?</b> (m)', a:d, u:'m', hint:'A kép ugyanolyan messze van a tükör mögött.', explain:'Ugyanannyira: '+d+' m.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Elsődleges fényforrás','Maga világít (Nap, lámpa).'],
      ['Másodlagos fényforrás','Csak visszaveri a fényt (Hold, tükör).'],
      ['A visszaverődés törvénye','α = α\', és a sugarak egy síkban vannak.'],
      ['A síktükör képe','Azonos nagyságú, ugyanolyan messze, mindig látszólagos.'],
      ['Gömbtükrök','Homorú: valódi és látszólagos kép. Domború: csak látszólagos.'],
      ['Fénytörés','Levegőből vízbe: a törési szög kisebb.'],
      ['A prizma','Kétszer töri meg a fényt, felbontja színekre.'],
      ['Gyűjtőlencse','Középen vastag, pozitív dioptria.'],
      ['Szórólencse','Szélén vastag, negatív dioptria.'],
      ['A szem képe','Kicsinyített, fordított, valódi kép az ideghártyán.'],
      ['Rövidlátás és távollátás','Rövidlátás: szórólencse. Távollátás: gyűjtőlencse.'],
      ['A fény sebessége','Kb. 300 000 km/s.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
