/* Elektromosság – VI. fejezet (tankönyv 113–151. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var circuit = function(label, bulbs, cap){ /* egyszerű áramkör: elem, kapcsoló, izzó(k) */
  var o='<rect x="40" y="30" width="240" height="90" fill="none" stroke="currentColor" stroke-width="4"/>'+
    SV.r(30,60,20,30,'#ffd23f')+SV.t(40,52,'+',14)+SV.t(40,110,'–',16)+
    '<line x1="140" y1="30" x2="170" y2="14" stroke="#d6403f" stroke-width="5"/>'+SV.t(155,8,'kapcsoló',10);
  bulbs.forEach(function(x){ o+='<circle cx="'+x+'" cy="120" r="13" fill="#fff3a0" stroke="#1b2618" stroke-width="3"/>'; });
  return SV.svg(label,o+SV.t(160,148,cap||'',12)); };
var FIG = {
  charge: SV.boxes('Pozitív, semleges és negatív állapot',[['+  több proton','#ffd9d6'],['0  egyenlő','#e8e8e8'],['–  több elektron','#d4e6fb']],'elektron-többlet vagy hiány okozza az elektromos állapotot'),
  circuit: circuit('Egyszerű áramkör: áramforrás, kapcsoló, fogyasztó, vezeték',[160],'zárt áramkör: folyik az áram'),
  voltage: SV.svg('Feszültség: az áramforrás töltéseket mozgató képessége',
    SV.r(40,50,60,50,'#ffd23f')+SV.t(70,82,'1,5 V',16,'middle','#1b2618')+SV.t(70,120,'elem',12)+
    SV.t(130,82,'+',26)+SV.r(150,50,60,50,'#ffd23f')+SV.t(180,82,'1,5 V',16,'middle','#1b2618')+SV.t(180,120,'elem',12)+
    SV.t(232,82,'=',26)+SV.r(250,50,50,50,'#9fe07f')+SV.t(275,82,'3 V',16,'middle','#1b2618')+SV.t(160,148,'sorba kötve a feszültségek összeadódnak',12)),
  ohm: SV.tri('Ohm törvénye: U egyenlő I szorozva R-rel','U','I','R','R = U : I   U = I · R   I = U : R'),
  series: SV.svg('Soros és párhuzamos kapcsolás',
    '<rect x="20" y="30" width="130" height="80" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="60" cy="110" r="12" fill="#fff3a0" stroke="#1b2618" stroke-width="3"/><circle cx="110" cy="110" r="12" fill="#fff3a0" stroke="#1b2618" stroke-width="3"/>'+SV.t(85,140,'soros: az áram ugyanaz',11)+
    '<rect x="180" y="30" width="125" height="80" fill="none" stroke="currentColor" stroke-width="3"/><line x1="215" y1="30" x2="215" y2="110" stroke="currentColor" stroke-width="3"/><line x1="270" y1="30" x2="270" y2="110" stroke="currentColor" stroke-width="3"/><circle cx="215" cy="70" r="12" fill="#fff3a0" stroke="#1b2618" stroke-width="3"/><circle cx="270" cy="70" r="12" fill="#fff3a0" stroke="#1b2618" stroke-width="3"/>'+SV.t(242,140,'párhuzamos: a feszültség ugyanaz',11)),
  magnet: SV.svg('Mágnes: azonos pólusok taszítanak, különbözők vonzanak',
    SV.r(20,30,60,30,'#d6403f')+SV.t(50,52,'É',14,'middle','#fff')+SV.r(80,30,60,30,'#2f7fd1')+SV.t(110,52,'D',14,'middle','#fff')+
    SV.r(180,30,60,30,'#d6403f')+SV.t(210,52,'É',14,'middle','#fff')+SV.r(240,30,60,30,'#2f7fd1')+SV.t(270,52,'D',14,'middle','#fff')+
    SV.t(110,90,'D–É: vonzzák',12)+SV.t(210,90,'É–É: taszítják',12)+
    SV.r(100,105,120,28,'#e8e8e8')+SV.t(160,124,'iránytű: az Északi felé áll',11)),
  coil: SV.svg('Áram mágneses hatása: elektromágnes',
    SV.r(100,55,120,40,'#aaa')+[0,1,2,3,4,5].map(function(i){ return '<ellipse cx="'+(115+i*18)+'" cy="75" rx="6" ry="26" fill="none" stroke="#d6403f" stroke-width="4"/>'; }).join('')+SV.t(160,32,'tekercs + lágyvas mag',12)+SV.t(160,130,'áram folyik → mágnes lesz',12)),
  work: SV.tri('Teljesítmény: P egyenlő U szorozva I-vel','P','U','I','P = U · I (W)   W = U · I · t (J)'),
  trafo: SV.svg('Transzformátor: a menetszámok aránya egyenlő a feszültségek arányával',
    SV.r(120,25,80,100,'#aaa')+[0,1,2,3].map(function(i){ return '<line x1="108" y1="'+(40+i*22)+'" x2="128" y2="'+(40+i*22)+'" stroke="#d6403f" stroke-width="5"/>'; }).join('')+
    [0,1].map(function(i){ return '<line x1="192" y1="'+(60+i*30)+'" x2="212" y2="'+(60+i*30)+'" stroke="#2f7fd1" stroke-width="5"/>'; }).join('')+
    SV.t(55,80,'U₁, N₁',14)+SV.t(260,80,'U₂, N₂',14)+SV.t(160,148,'U₁ : U₂ = N₁ : N₂',13))
};

window.LESSON = {
  id:'elektromossag',
  screens:[
  { type:'info', section:'Tanulás', icon:'⚡', title:'Elektromos töltés és állapot', fig:FIG.charge,
    body:'<p>Az anyagokban két fajta töltés van: <b>pozitív</b> (proton) és <b>negatív</b> (elektron).</p><ul><li><mark class="e1">Pozitív</mark> állapotú test: több a proton (elektronhiány).</li><li><mark class="e5">Negatív</mark> állapotú test: több az elektron (elektrontöbblet).</li><li><b>Semleges</b>: ugyanannyi proton és elektron.</li></ul><p>Két test <b>szoros érintkezésekor</b> elektronok mehetnek át az egyikről a másikra. Ezért „elektromosodik” a megdörzsölt lufi, és ezért ragad a hajadra.</p><p>Az azonos töltések <b>taszítják</b>, a különbözők <b>vonzzák</b> egymást.</p>',
    mc:'<p>A Minecraftban a villám a „töltés kisülése”. A valóságban is a felhők töltése ugrik át a földre.</p>',
    src:'113–116. oldal' },

  { type:'info', section:'Tanulás', icon:'🔩', title:'Vezetők és szigetelők',
    body:'<p>Elektromos vezetés szempontjából az anyagok:</p><ul><li><mark class="k">Vezetők</mark>: a töltések könnyen elmozdulhatnak bennük. Pl. <b>fémek</b> (réz, alumínium, vas).</li><li><mark class="k">Szigetelők</mark>: a töltések nehezen mozdulnak. Pl. <b>műanyag, gumi, üveg, fa, szövet</b>.</li></ul><p>A vezetékek belseje fém, a burkolata szigetelő.</p>',
    tip:'<p>Az <b>emberi test</b> is vezeti az áramot, mert a sejtjeiben lévő folyadékok elektrolitok. Ezért veszélyes az áramütés!</p>',
    src:'113–116. oldal' },

  { type:'info', section:'Tanulás', icon:'🔌', title:'Az elektromos áram és az áramkör', fig:FIG.circuit,
    body:'<p>A töltések <b>egyirányú, rendezett mozgása</b> az <mark class="k">elektromos áram</mark>.</p><ul><li>Áram csak <b>zárt áramkörben</b> folyik. A nyitott kapcsolónál megszakad.</li><li>Az áram iránya az áramforrás <b>pozitív pólusától a negatív felé</b> mutat.</li><li>Az áram erőssége: <b>I</b>, mértékegysége az <mark class="k">amper</mark> (A). <b>Árammérővel</b> mérjük.</li></ul><p><b>Az áramkör fő részei:</b> áramforrás, fogyasztó, vezetékek, kapcsoló.</p><p>Az áramköröket <b>kapcsolási rajzon</b> ábrázoljuk, egyezményes jelekkel.</p>',
    mc:'<p>A redstone-vezeték is zárt „áramkör”-ként működik: az elem (redstone-blokk) hozza az energiát, a lámpa a fogyasztó, a kar a kapcsoló.</p>',
    src:'117–120. oldal' },

  { type:'info', section:'Tanulás', icon:'🔋', title:'Feszültség', fig:FIG.voltage,
    body:'<p>Az áram oka a <mark class="k">feszültség</mark>. Az áramforrás <b>töltéseket mozgató képessége</b>.</p><ul><li>Jele: <b>U</b></li><li>Mértékegysége: <b>volt</b> (V)</li><li>Mérése: <b>voltmérővel</b>, az áramkör két kiválasztott pontja között.</li></ul><p>A voltmérőt a vizsgált fogyasztó (vagy áramforrás) két kivezetésére kötjük, vagyis <b>párhuzamosan</b>.</p><p>Az <b>ellentétes pólusaikkal sorba kapcsolt</b> áramforrások feszültsége <b>összeadódik</b>.</p>',
    tip:'<p>Egy ceruzaelem 1,5 V. A hálózati konnektor feszültsége <b>230 V</b>, ez életveszélyes!</p>',
    src:'121–123. oldal' },

  { type:'info', section:'Tanulás', icon:'🧱', title:'Ellenállás és Ohm törvénye', fig:FIG.ohm,
    body:'<p>Az <mark class="k">ellenállás</mark> a fogyasztónak az a tulajdonsága, ami megszabja, hogy adott feszültségnél <b>mekkora áram</b> folyik át rajta.</p><ul><li>Jele: <b>R</b></li><li>Mértékegysége: <b>ohm</b> (Ω)</li></ul><p><mark class="k">Ohm törvénye:</mark> a feszültség egyenesen arányos az áramerősséggel.</p><ul><li><b>R = U : I</b></li><li><b>U = I · R</b></li><li><b>I = U : R</b></li></ul><p><b>Példa:</b> egy fogyasztóra 12 V feszültséget kapcsolunk, és 3 A áram folyik át. R = 12 : 3 = <b>4 Ω</b>.</p>',
    tip:'<p>Minél nagyobb az ellenállás, annál kisebb az áram ugyanakkora feszültségnél.</p>',
    src:'124–126. oldal' },

  { type:'info', section:'Tanulás', icon:'🔗', title:'Soros és párhuzamos kapcsolás', fig:FIG.series,
    body:'<ul><li><mark class="k">Soros kapcsolás</mark>: a fogyasztók egymás után vannak. Az <b>áram mindenhol ugyanaz</b> (I = állandó). A feszültségek <b>összeadódnak</b>: U = U₁ + U₂. Ha az egyik kiég, a másik is kialszik.</li><li><mark class="k">Párhuzamos kapcsolás</mark>: a fogyasztók egymás mellett vannak. A <b>feszültség ugyanaz</b> (U = állandó). Az áramok <b>összeadódnak</b>: I = I₁ + I₂. Ha az egyik kiég, a másik világít.</li></ul><p>A lakásban a készülékeket <b>párhuzamosan</b> kötik, így mindegyik teljes feszültséget kap.</p>',
    mc:'<p>A karácsonyi izzósor régen soros volt: egy izzó kiégett, az egész kialudt. Most párhuzamos.</p>',
    src:'127–130. oldal' },

  { type:'info', section:'Tanulás', icon:'🧲', title:'Állandó mágnesek', fig:FIG.magnet,
    body:'<p>A természetben is van <b>mágneses</b> vasérc. A mágnesnek azokat a részeit, ahol a hatás a legerősebb, <mark class="k">pólusoknak</mark> nevezzük.</p><ul><li>A mágnesrúdnak két pólusa van: <b>északi</b> és <b>déli</b>.</li><li>Az <b>azonos</b> pólusok <b>taszítják</b>, a <b>különbözők vonzzák</b> egymást.</li><li>A mágnes a <b>vasat</b> vonzza.</li></ul><p>Az <b>iránytű</b> egy tengely körül elfordulható mágnes. A <b>Földnek is van mágneses mezője</b>, ezért az iránytű mindig észak felé mutat.</p><p>A mágnest <b>mágneses mező</b> veszi körül. Ez nem látható, de az iránytűvel kimutatható.</p>',
    src:'136–140. oldal' },

  { type:'info', section:'Tanulás', icon:'🧲', title:'Az áram hatásai, elektromágnes', fig:FIG.coil,
    body:'<p>Az áramnak többféle hatása van:</p><ul><li><mark class="k">Mágneses hatás</mark>: az áramvezető kitéríti az iránytűt. A vezetőben folyó áram <b>mágneses mezőt</b> hoz létre.</li><li><mark class="k">Hőhatás</mark>: a fogyasztók felmelegednek (vízforraló, vasaló).</li><li><mark class="k">Fényhatás</mark>: az izzó világít.</li><li><mark class="k">Élettani hatás</mark>: izomösszehúzódás, égési sérülés. Az áramütés veszélyességét elsősorban az <b>áram erőssége</b> határozza meg.</li></ul><p>A <mark class="k">lágyvas maggal ellátott tekercs</mark> az <b>elektromágnes</b>. Csak akkor mágnes, ha áram folyik rajta.</p>',
    tip:'<p><b>Áramütés ellen:</b> ne nyúlj sérült vezetékhez, ne használj elektromos készüléket vizes kézzel, és ne tedd az áramforráshoz a fémtárgyakat. Baleset esetén előbb kapcsold le az áramot, és hívj segítséget (112).</p>',
    src:'131–135. oldal' },

  { type:'info', section:'Tanulás', icon:'💡', title:'Elektromos munka és teljesítmény', fig:FIG.work,
    body:'<p>Az elektromos fogyasztó által végzett <mark class="k">munka</mark> a feszültség, az áramerősség és az idő szorzata.</p><ul><li><b>W = U · I · t</b></li><li>Mértékegysége: <b>joule</b> (J), vagy a <b>kWh</b> (kilowattóra).</li><li>1 kWh = 3 600 000 J</li></ul><p>A <mark class="k">teljesítmény</mark>: <b>P = U · I</b>, mértékegysége <b>watt</b> (W).</p><p><b>Példa:</b> egy 230 V-os, 2 A-es készülék teljesítménye 230 · 2 = <b>460 W</b>.</p><p>A háztartások fogyasztásának nagy részét a korszerűtlen fényforrások és fűtő/hűtő gépek adják. A <b>villanyóra</b> kWh-ban méri az elfogyasztott energiát.</p>',
    mc:'<p>A teljesítmény azt mutatja, mennyire „éhes” a gép. Egy nagy watt számú gép gyorsan eszi az energiát.</p>',
    src:'141–144. oldal' },

  { type:'info', section:'Tanulás', icon:'🔄', title:'Váltakozó feszültség, transzformátor', fig:FIG.trafo,
    body:'<p>Ha egy tekercset mágneses mezőben mozgatunk, a kivezetései között <mark class="k">feszültség indukálódik</mark>. Ez az <b>indukció</b>.</p><ul><li>A <b>generátor</b> az indukció elvén állít elő váltakozó feszültséget.</li><li>A <mark class="k">váltakozó áram</mark> erőssége és iránya is periodikusan változik. A hálózat frekvenciája <b>50 Hz</b>.</li><li>Hatásai: mágneses, hő, fény. Élettani hatása súlyosabb, mint az egyenáramé.</li></ul><p>A <mark class="k">transzformátor</mark> az indukció elvén működő, feszültség átalakítására szolgáló berendezés. A <b>menetszámok aránya</b> egyenlő a <b>feszültségek arányával</b>.</p>',
    tip:'<p>A telefontöltő is transzformátort használ: a 230 V-ot alacsony feszültségre csökkenti.</p>',
    src:'145–150. oldal' },

  { type:'info', section:'Tanulás', icon:'📋', title:'Ennyit kell tudni',
    body:'<ul><li>Pozitív: protontöbblet. Negatív: elektrontöbblet. Azonos taszít, különböző vonz.</li><li>Vezető: fém. Szigetelő: műanyag, gumi.</li><li>Áram: <b>I</b> (A), csak zárt körben. Feszültség: <b>U</b> (V). Ellenállás: <b>R</b> (Ω).</li><li>Ohm: <b>R = U : I</b>.</li><li>Soros: I állandó, U összeadódik. Párhuzamos: U állandó, I összeadódik.</li><li>Mágnes: azonos pólus taszít. Elektromágnes: tekercs + lágyvas mag.</li><li>Munka: <b>W = U · I · t</b>. Teljesítmény: <b>P = U · I</b>.</li><li>Transzformátor: menetszám-arány = feszültség-arány.</li></ul><p><b>Most jön a játék! 🎮</b></p>',
    src:'151. oldal – összefoglalás' },

  /* ===== JÁTÉKOK ===== */
  { type:'match', section:'Játék 1', title:'🔗 Párosítás: mennyiség és mértékegység',
    pairs:[['áramerősség (I)','A (amper)'],['feszültség (U)','V (volt)'],['ellenállás (R)','Ω (ohm)'],['teljesítmény (P)','W (watt)'],['munka (W)','J (joule)'],['áramerősség mérése','árammérő']] },

  { type:'tf', section:'Játék 2', title:'⚡ Igaz vagy hamis?',
    items:[
      {t:'Az áram csak zárt áramkörben folyik.', a:true, why:'Nyitott kapcsolónál megszakad az áram.'},
      {t:'A műanyag jó vezető.', a:false, why:'A műanyag szigetelő.'},
      {t:'Az azonos mágneses pólusok vonzzák egymást.', a:false, why:'Az azonos pólusok taszítják egymást.'},
      {t:'Párhuzamos kapcsolásnál a feszültség ugyanaz az ágakon.', a:true, why:'U = állandó, az áramok összeadódnak.'},
      {t:'Soros kapcsolásnál az áram mindenhol ugyanaz.', a:true, why:'I = állandó.'},
      {t:'Az áramforrás pozitív pólusától a negatív felé mutat az áram iránya.', a:true, why:'Ez az egyezményes irány.'}
    ]},

  { type:'memory', section:'Játék 3', title:'🧠 Memóriajáték',
    pairs:[['U','feszültség'],['I','áramerősség'],['R','ellenállás'],['Ω','ohm'],['kWh','kilowattóra'],['Hz','frekvencia']] },

  { type:'drag', section:'Játék 4', title:'📦 Vezető vagy szigetelő?',
    bins:[{id:'vezeto',name:'Vezető',icon:'🔩'},{id:'szigetelo',name:'Szigetelő',icon:'🧤'}],
    items:[{t:'réz',c:'vezeto'},{t:'vas',c:'vezeto'},{t:'alumínium',c:'vezeto'},{t:'gumi',c:'szigetelo'},{t:'műanyag',c:'szigetelo'},{t:'üveg',c:'szigetelo'},{t:'fa',c:'szigetelo'},{t:'ezüst',c:'vezeto'}] },

  { type:'drag', section:'Játék 5', title:'📦 Soros vagy párhuzamos?',
    bins:[{id:'soros',name:'Soros',icon:'➡️'},{id:'parh',name:'Párhuzamos',icon:'⏸️'}],
    items:[{t:'I = állandó',c:'soros'},{t:'U = U₁ + U₂',c:'soros'},{t:'egyik kiég, a másik is kialszik',c:'soros'},{t:'U = állandó',c:'parh'},{t:'I = I₁ + I₂',c:'parh'},{t:'a lakás konnektorai',c:'parh'}] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'Az ellenállás jele ___, mértékegysége az ___. Ohm törvénye: R = U osztva ___. A teljesítmény: P = U szorozva ___.',
    answers:['R','ohm','I-vel','I-vel'], extra:['t-vel','volt'],
    explain:'R = U : I és P = U · I. Mindkettőben I az áramerősség.' },

  /* ===== DOLGOZAT GYAKORLÓ ===== */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'Az áram csak ___ áramkörben folyik. A feszültség mértékegysége a ___. A ___ mágneses mező hozza létre az indukált feszültséget. A lágyvas maggal ellátott tekercs az ___. A váltakozó feszültség frekvenciája ___ Hz.',
    answers:['zárt','volt','változó','elektromágnes','50'], extra:['nyitott','amper','100'],
    explain:'Az Elektromosság fejezet alapjai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze a képlettel!',
    pairs:[['Ohm törvénye','R = U : I'],['elektromos munka','W = U · I · t'],['elektromos teljesítmény','P = U · I'],['soros kapcsolás','U = U₁ + U₂'],['párhuzamos kapcsolás','I = I₁ + I₂']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'Az emberi test vezeti az áramot.', a:true, why:'A sejtekben lévő folyadékok elektrolitok.'},
      {t:'A voltmérőt a fogyasztó két kivezetésére kötjük.', a:true, why:'A feszültséget két pont között mérjük.'},
      {t:'Az áramütés veszélyességét főleg az áram erőssége határozza meg.', a:true, why:'Ezért veszélyes az erős áram.'},
      {t:'Az iránytű a mágneses mezővel áll be.', a:true, why:'A mágneses erővonalak irányába.'},
      {t:'A transzformátor egyenáramot alakít át.', a:false, why:'A váltakozó feszültséget alakítja át.'},
      {t:'Soros kapcsolásnál a feszültségek összeadódnak.', a:true, why:'U = U₁ + U₂.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Mi az áram oka?',
    options:['a feszültség','az ellenállás','a teljesítmény','a töltés semleges állapota'], correct:0, explain:'A feszültség mozgatja a töltéseket.', hint:'Az áramforrás ezt adja.' },
  { type:'quiz', section:'Dolgozat', q:'5. Mi történik az áramkörben, ha kinyitod a kapcsolót?',
    options:['Megszakad az áram.','Nagyobb lesz az áram.','Az áram megfordul.','A feszültség nulla és az áram nem változik.'], correct:0, explain:'Az áramkör nyitott, ezért nem folyik áram.', hint:'Áram csak zárt körben folyik.' },
  { type:'quiz', section:'Dolgozat', q:'6. Mi történik a mágnes két azonos pólusa között?',
    options:['taszítják egymást','vonzzák egymást','semmi','összetapadnak'], correct:0, explain:'Azonos pólusok taszítanak.', hint:'É és É.' },
  { type:'quiz', section:'Dolgozat', q:'7. Egy fogyasztón 12 V esik és 3 A áram folyik. Mekkora az ellenállása?',
    options:['4 Ω','36 Ω','15 Ω','0,25 Ω'], correct:0, explain:'R = U : I = 12 : 3 = 4 Ω.', hint:'R = U : I.' },

  { type:'calc', section:'Dolgozat', count:7, gens:[
    function(){ var R=pick([2,3,4,5,10,20]), I=pick([1,2,3,5]);
      return {q:'Egy fogyasztón <b>'+(R*I)+' V</b> feszültség van, és <b>'+I+' A</b> áram folyik át. <b>Mekkora az ellenállása?</b> (Ω)', a:R, u:'Ω', hint:'R = U : I.', explain:(R*I)+' : '+I+' = '+R+' Ω.'}; },
    function(){ var R=pick([2,3,4,5,10,20]), I=pick([1,2,3,5]);
      return {q:'Egy <b>'+R+' Ω</b>-os fogyasztón <b>'+I+' A</b> áram folyik át. <b>Mekkora a feszültsége?</b> (V)', a:R*I, u:'V', hint:'U = I · R.', explain:I+' · '+R+' = '+(R*I)+' V.'}; },
    function(){ var R=pick([2,3,4,5,10]), I=pick([1,2,3,5]);
      return {q:'Egy <b>'+R+' Ω</b>-os fogyasztóra <b>'+(R*I)+' V</b> feszültséget kapcsolunk. <b>Mekkora áram folyik?</b> (A)', a:I, u:'A', hint:'I = U : R.', explain:(R*I)+' : '+R+' = '+I+' A.'}; },
    function(){ var U=pick([12,24,230]), I=pick([1,2,5]);
      return {q:'Egy készülék feszültsége <b>'+U+' V</b>, árama <b>'+I+' A</b>. <b>Mekkora a teljesítménye?</b> (W)', a:U*I, u:'W', hint:'P = U · I.', explain:U+' · '+I+' = '+(U*I)+' W.'}; },
    function(){ var U=pick([12,24]), I=pick([1,2,3]), t=pick([5,10,20]);
      return {q:'Egy <b>'+U+' V</b>-os, <b>'+I+' A</b>-es fogyasztó <b>'+t+' másodpercig</b> működik. <b>Mennyi elektromos munkát végez?</b> (J)', a:U*I*t, u:'J', hint:'W = U · I · t.', explain:U+' · '+I+' · '+t+' = '+(U*I*t)+' J.'}; },
    function(){ var a=pick([1.5,3,4.5,6]), b=pick([1.5,3,4.5]);
      return {q:'Két elemet sorba kötünk: az egyiké <b>'+a+' V</b>, a másiké <b>'+b+' V</b> (ellentétes pólusokkal). <b>Mekkora a teljes feszültség?</b> (V)', a:a+b, u:'V', tol:0.05, hint:'Soros kapcsolásnál összeadjuk.', explain:a+' + '+b+' = '+(a+b)+' V.'}; },
    function(){ var N2=pick([100,200,500]);
      return {q:'Egy transzformátor primer tekercsén <b>1000 menet</b> van, a feszültsége <b>230 V</b>. A szekunder tekercsén <b>'+N2+' menet</b> van. <b>Mekkora a szekunder feszültség?</b> (V)', a:230*N2/1000, u:'V', tol:0.05, hint:'U₁ : U₂ = N₁ : N₂.', explain:'230 · '+N2+' : 1000 = '+(230*N2/1000)+' V.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Mi az elektromos áram?','A töltések egyirányú, rendezett mozgása.'],
      ['Az áramkör fő részei','Áramforrás, fogyasztó, vezetékek, kapcsoló.'],
      ['Áramerősség','I, mértékegysége amper (A). Árammérővel mérjük.'],
      ['Feszültség','U, mértékegysége volt (V). Voltmérővel mérjük.'],
      ['Ohm törvénye','R = U : I (Ω).'],
      ['Soros kapcsolás','I = állandó, U = U₁ + U₂.'],
      ['Párhuzamos kapcsolás','U = állandó, I = I₁ + I₂.'],
      ['Mágneses pólusok','Azonos taszít, különböző vonz.'],
      ['Elektromágnes','Lágyvas maggal ellátott tekercs, amin áram folyik.'],
      ['Elektromos teljesítmény','P = U · I, mértékegysége watt (W).'],
      ['Elektromos munka','W = U · I · t, joule (J) vagy kWh.'],
      ['Transzformátor','Feszültséget alakít át. U₁ : U₂ = N₁ : N₂.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
