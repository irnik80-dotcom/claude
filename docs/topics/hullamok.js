/* Hullámok – VIII. fejezet (tankönyv 173–190. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var FIG = {
  wave: SV.wave('Hullám: hullámhegyek és hullámvölgyek',40,2,'hullámhegy fent, hullámvölgy lent'),
  rippled: SV.svg('Hullámforrás: a rezgés hullámokat kelt',
    '<circle cx="100" cy="75" r="8" fill="#d6403f"/>'+[28,52,76].map(function(r){ return '<circle cx="100" cy="75" r="'+r+'" fill="none" stroke="#2f7fd1" stroke-width="3"/>'; }).join('')+SV.t(230,70,'a rezgetés hullámot kelt',12)+SV.t(230,90,'minden anyagban',12)),
  string: SV.svg('A rezgő húr hangot kelt',
    '<line x1="30" y1="75" x2="290" y2="75" stroke="#8b8f87" stroke-width="2" stroke-dasharray="5 4"/>'+'<path d="M30 75 Q160 5 290 75" fill="none" stroke="#a9743a" stroke-width="5"/><path d="M30 75 Q160 145 290 75" fill="none" stroke="#a9743a" stroke-width="5" opacity="0.45"/>'+SV.t(160,150,'húr hossza, vastagsága és feszessége befolyásolja a hangot',11)),
  instr: SV.boxes('Hangszerek hangkeltés szerint',[['kordofon','#ffd9d6'],['membrafon','#fdeeb0'],['aerofon','#d5f0cb'],['idiofon','#d4e6fb']],'gitár · üstdob · furulya · gong'),
  ear: SV.svg('A hang útja a fülben',
    '<path d="M60 40 Q20 75 60 115" fill="none" stroke="#e0a96d" stroke-width="12"/>'+SV.t(40,138,'fülkagyló',11)+
    SV.arrow(85,78,150,'#2f7fd1')+SV.r(160,60,12,36,'#d9d9d9')+SV.t(166,112,'dobhártya',11)+SV.r(180,70,60,16,'#e0a96d')+SV.t(250,82,'hallócsontok',11,'start')),
  sound: SV.svg('A hang sebessége levegőben kb. 340 m/s',
    SV.r(30,50,60,50,'#ffd23f')+SV.t(60,80,'dörgés',12,'middle','#1b2618')+SV.arrow(95,75,225,'#2f7fd1')+SV.t(160,60,'340 m/s',14)+SV.r(235,50,60,50,'#d9d9d9')+SV.t(265,80,'te',14,'middle','#1b2618')+SV.t(160,135,'s = v · t',14)),
  scale: SV.svg('A hallható hangtartomány: 20 – 20 000 Hz',
    SV.r(20,50,70,50,'#d4e6fb')+SV.t(55,80,'infrahang',11,'middle','#1b2618')+SV.r(90,50,140,50,'#9fe07f')+SV.t(160,80,'hallható hang',13,'middle','#1b2618')+SV.r(230,50,70,50,'#ffd9d6')+SV.t(265,80,'ultrahang',11,'middle','#1b2618')+
    SV.t(90,120,'20 Hz',12)+SV.t(230,120,'20 000 Hz',12)),
  pitch: SV.svg('Magas és mély hang: rövid húr = magas, hosszú húr = mély',
    '<line x1="20" y1="45" x2="300" y2="45" stroke="#a9743a" stroke-width="5"/>'+SV.t(160,32,'hosszú húr: mély hang',12)+
    '<line x1="120" y1="105" x2="200" y2="105" stroke="#a9743a" stroke-width="5"/>'+SV.t(160,128,'rövid húr: magas hang',12)),
  em: SV.svg('A fény elektromágneses hullám, sebessége 300 000 km/s',
    SV.wave('x',20,3).replace(/<svg[^>]*>/,'').replace('</svg>','')+SV.t(160,140,'a fény: elektromágneses hullám',13))
};

window.LESSON = {
  id:'hullamok',
  screens:[
  { type:'info', section:'Tanulás', icon:'🌊', title:'Hullámok a természetben', fig:FIG.rippled,
    body:'<p>A <mark class="k">hullám</mark> bármilyen halmazállapotú anyagban létrejöhet. A <mark class="k">hullámforrás rezgetéssel</mark> kelti a hullámokat.</p><p>A hullám <b>hullámhegyek és -völgyek</b> (vagy <b>sűrűsödések és ritkulások</b>) terjedésével távolodik a forrástól.</p><ul><li>Hullámok vannak a <b>vízen</b>, a <b>kötélen</b>, a <b>levegőben</b>.</li><li>A <b>hang is hullám</b>.</li></ul><p>A hullám az anyag határáról <b>visszaverődhet</b>, vagy <b>átléphet</b> egy új anyagba. Ekkor <b>megváltozik</b> a terjedési sebessége és a hullámhossza.</p>',
    mc:'<p>Ha követ dobsz a vízbe, körkörös hullámok indulnak. A hullám az energiát viszi tovább, nem a vizet.</p>',
    src:'173–175. oldal' },

  { type:'info', section:'Tanulás', icon:'〰️', title:'A hullám jellemzői', fig:FIG.wave,
    body:'<ul><li><b>Hullámhossz (λ)</b>: két szomszédos hullámhegy távolsága.</li><li><b>Amplitúdó</b>: a legnagyobb kitérés.</li><li><b>Frekvencia (f)</b>: hány rezgés van 1 másodperc alatt. Mértékegysége: <b>hertz</b> (Hz).</li><li><b>Periódusidő (T)</b>: egy rezgés ideje. <b>f = 1 : T</b>.</li></ul><p><b>Példa:</b> ha egy rezgés 0,5 másodpercig tart, a frekvencia f = 1 : 0,5 = <b>2 Hz</b>.</p>',
    tip:'<p>Minél több rezgés van másodpercenként, annál nagyobb a frekvencia.</p>',
    src:'175–176. oldal' },

  { type:'info', section:'Tanulás', icon:'🎸', title:'A hangkeltés', fig:FIG.string,
    body:'<p>A hangokat a <mark class="k">hangforrás rezgése</mark> hozza létre.</p><ul><li>A kifeszített <b>húr hangját</b> a húr <b>hossza, vastagsága és feszessége</b> befolyásolja.</li><li>A megpendített húron <b>állóhullámok</b> jönnek létre.</li><li>A <b>sípok</b> hangját a síp hosszának változtatásával módosíthatjuk.</li><li>A <b>hangszóró membránja</b> rezegve hangot kelt.</li></ul>',
    mc:'<p>A zenélő blokkok hangja is a játékban csak utánozza a valódi hangszereket. Az igazi hangszereknél a hang mindig rezgésből jön.</p>',
    src:'176–178. oldal' },

  { type:'info', section:'Tanulás', icon:'🎻', title:'Hangszerek', fig:FIG.instr,
    body:'<p>A hangszereket <b>hangkeltés szerint</b> is csoportosítjuk:</p><ul><li><mark class="e1">Kordofon</mark>: <b>húr</b> rezeg (gitár, hegedű).</li><li><mark class="e4">Membrafon</mark>: kifeszített <b>hártya (membrán)</b> rezeg (üstdob, köcsögduda).</li><li><mark class="e2">Aerofon</mark>: a <b>levegő</b> rezgése kelti a hangot (furulya, orgona).</li><li><mark class="e5">Idiofon</mark>: a <b>hangszertest saját rezgése</b> (gong, kereplő).</li></ul><p>Régi csoportosítás a megszólaltatás módja szerint: <b>fúvós, vonós, pengetős, billentyűs, ütős</b>.</p>',
    src:'178. oldal' },

  { type:'info', section:'Tanulás', icon:'👂', title:'Hallás, a fül', fig:FIG.ear,
    body:'<p>A <mark class="k">fül</mark> érzékeli a hangokat.</p><ul><li>A <b>fülkagyló</b> a hangot a <b>dobhártyára</b> tereli.</li><li>A dobhártya <b>megrezeg</b>, a rezgést a hallócsontok viszik tovább.</li></ul><p>A <mark class="k">hangerősséget</mark> <b>decibelben</b> (dB) mérjük.</p><ul><li><b>Hallásküszöb</b>: 0 dB.</li><li><b>Fájdalomküszöb</b>: 130 dB.</li></ul>',
    tip:'<p>A <b>túl hangos zene</b> tartósan károsíthatja a hallásodat. Vigyázz a füledre!</p>',
    src:'179–180. oldal' },

  { type:'info', section:'Tanulás', icon:'🚀', title:'A hang terjedése', fig:FIG.sound,
    body:'<p>A hang terjedéséhez <mark class="k">közvetítő anyag</mark> kell (levegő, víz, szilárd anyag). <b>Légüres térben nem terjed.</b></p><p>A hang sebességét befolyásolja a <b>közvetítő anyag fajtája</b> és a <b>hőmérséklete</b>.</p><p>Levegőben a hang sebessége kb. <mark class="k">340 m/s</mark>.</p><p><b>Számolás:</b> ha a villám után 3 másodperccel hallod a dörgést, a villám <b>s = v · t = 340 · 3 = 1020 m</b> távol csapott be.</p>',
    mc:'<p>A világűrben nincs levegő, ezért ott a robbanás hang nélküli.</p>',
    src:'181–182. oldal' },

  { type:'info', section:'Tanulás', icon:'🎶', title:'Magas és mély hangok', fig:FIG.scale,
    body:'<p>A <mark class="k">hangmagasság</mark> a hang <b>frekvenciájától</b> függ. Nagyobb frekvencia = magasabb hang.</p><ul><li>Minél <b>hosszabb a húr</b>, annál <b>mélyebb</b> hangot kelt.</li><li>Az emberi fül <b>20 – 20 000 Hz</b> közötti hangokat hall.</li><li>20 Hz alatt: <mark class="k">infrahang</mark>.</li><li>20 000 Hz felett: <mark class="k">ultrahang</mark>.</li></ul><p>A hangok egyediségét a <mark class="k">hangszín</mark> határozza meg. Ezért különbözik a gitár és a zongora hangja ugyanazon hangmagasságnál.</p>',
    tip:'<p>A denevér és a delfin <b>ultrahangot</b> használ tájékozódásra. Az orvosok az ultrahangot a vizsgálatokra használják.</p>',
    src:'183–185. oldal' },

  { type:'info', section:'Tanulás', icon:'🌈', title:'Fényhullámok', fig:FIG.em,
    body:'<p>A <mark class="k">fény elektromágneses hullám</mark>. Terjedési sebessége légüres térben és levegőben kb. <b>300 000 km/s</b>.</p><p>A fény <b>légüres térben is terjed</b>, ezért jön el hozzánk a Nap fénye.</p><p>A <b>fehér fény összetett</b>: vörös, narancs, sárga, zöld, kék, ibolya színekből áll. A különböző színű fények <b>hullámhossza</b> eltérő: a vörösé a legnagyobb, az ibolyáé a legkisebb.</p>',
    tip:'<p>A fény sokkal gyorsabb, mint a hang. Ezért látjuk a villámot, mielőtt hallanánk a dörgést.</p>',
    src:'186–189. oldal' },

  { type:'info', section:'Tanulás', icon:'📋', title:'Ennyit kell tudni',
    body:'<ul><li>A hullámot <b>rezgés</b> kelti. A hullám energiát visz, anyagot nem.</li><li>f (Hz) = rezgések száma 1 s alatt. <b>f = 1 : T</b>.</li><li>Hangszerek: <b>kordofon, membrafon, aerofon, idiofon</b>.</li><li>Hallásküszöb 0 dB, fájdalomküszöb 130 dB.</li><li>A hang terjedéséhez közeg kell. Levegőben <b>340 m/s</b>.</li><li>Hallható tartomány: <b>20 – 20 000 Hz</b>. Alatta infrahang, felette ultrahang.</li><li>A fény elektromágneses hullám, <b>300 000 km/s</b>.</li></ul><p><b>Most jön a játék! 🎮</b></p>',
    src:'190. oldal – összefoglalás' },

  /* ===== JÁTÉKOK ===== */
  { type:'match', section:'Játék 1', title:'🔗 Párosítás: hangszercsoportok',
    pairs:[['kordofon','húr rezeg'],['membrafon','hártya rezeg'],['aerofon','levegő rezeg'],['idiofon','a test saját rezgése'],['gitár, hegedű','kordofon hangszer'],['furulya, orgona','aerofon hangszer']] },

  { type:'tf', section:'Játék 2', title:'⚡ Igaz vagy hamis?',
    items:[
      {t:'A hang légüres térben is terjed.', a:false, why:'A hang terjedéséhez közvetítő anyag kell.'},
      {t:'A hang sebessége levegőben kb. 340 m/s.', a:true, why:'Ezzel számolunk.'},
      {t:'Az emberi fül 20 000 Hz felett is hall.', a:false, why:'20 000 Hz felett az ultrahang van, ezt nem halljuk.'},
      {t:'A hosszabb húr mélyebb hangot ad.', a:true, why:'A hangmagasság a frekvenciától függ.'},
      {t:'A fény sebessége nagyobb, mint a hangé.', a:true, why:'300 000 km/s és 340 m/s.'},
      {t:'A hangerősséget hertzben mérjük.', a:false, why:'Decibelben (dB). A hertz a frekvencia egysége.'}
    ]},

  { type:'memory', section:'Játék 3', title:'🧠 Memóriajáték',
    pairs:[['Hz','hertz'],['dB','decibel'],['f','frekvencia'],['T','periódusidő'],['340 m/s','hang sebessége'],['300 000 km/s','fény sebessége']] },

  { type:'drag', section:'Játék 4', title:'📦 Hallható? Infra- vagy ultrahang?',
    bins:[{id:'infra',name:'Infrahang',icon:'⬇️'},{id:'hall',name:'Hallható',icon:'👂'},{id:'ultra',name:'Ultrahang',icon:'⬆️'}],
    items:[{t:'10 Hz',c:'infra'},{t:'5 Hz',c:'infra'},{t:'100 Hz',c:'hall'},{t:'1000 Hz',c:'hall'},{t:'10 000 Hz',c:'hall'},{t:'25 000 Hz',c:'ultra'},{t:'40 000 Hz',c:'ultra'}] },

  { type:'drag', section:'Játék 5', title:'📦 Hangszerek: melyik csoport?',
    bins:[{id:'kordofon',name:'Kordofon',icon:'🎸'},{id:'membrafon',name:'Membrafon',icon:'🥁'},{id:'aerofon',name:'Aerofon',icon:'🎷'},{id:'idiofon',name:'Idiofon',icon:'🔔'}],
    items:[{t:'gitár',c:'kordofon'},{t:'hegedű',c:'kordofon'},{t:'üstdob',c:'membrafon'},{t:'furulya',c:'aerofon'},{t:'orgona',c:'aerofon'},{t:'gong',c:'idiofon'},{t:'kereplő',c:'idiofon'}] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'A hangokat a hangforrás ___ kelti. A hangot a ___ érzékeli. Levegőben a hang sebessége kb. ___ m/s. A hallható hangok frekvenciája ___ és 20 000 Hz között van.',
    answers:['rezgése','fül','340','20'], extra:['színe','szem','300 000'],
    explain:'A hang rezgésből jön, levegőben kb. 340 m/s a sebessége.' },

  /* ===== DOLGOZAT GYAKORLÓ ===== */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'A hullámforrás ___ kelti a hullámokat. A hang terjedéséhez ___ anyag kell. A ___ hangok frekvenciája 20 Hz alatti. A hangszín határozza meg a hang ___. A fény ___ hullám.',
    answers:['rezgetéssel','közvetítő','infra','egyediségét','elektromágneses'], extra:['ultra','mechanikai','erősségét'],
    explain:'A Hullámok fejezet alapjai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze!',
    pairs:[['hangerősség mértékegysége','dB (decibel)'],['frekvencia mértékegysége','Hz (hertz)'],['hallásküszöb','0 dB'],['fájdalomküszöb','130 dB'],['hang sebessége levegőben','340 m/s']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'A hang is hullám.', a:true, why:'Rezgés terjed hullám formájában.'},
      {t:'A fény csak levegőben terjed.', a:false, why:'Légüres térben is terjed.'},
      {t:'A hosszabb húr magasabb hangot ad.', a:false, why:'A hosszabb húr mélyebb hangot ad.'},
      {t:'Az ultrahang 20 000 Hz feletti hang.', a:true, why:'Ezt az ember már nem hallja.'},
      {t:'A hangszórót a membrán rezgetése szólaltatja meg.', a:true, why:'A rezgő membrán hangot kelt.'},
      {t:'A vörös fény hullámhossza a legkisebb.', a:false, why:'A legkisebb az ibolyáé.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Mi határozza meg a hang magasságát?',
    options:['a frekvenciája','a színe','az amplitúdója','a terjedési sebessége'], correct:0, explain:'Nagyobb frekvencia = magasabb hang.', hint:'Mértékegysége a hertz.' },
  { type:'quiz', section:'Dolgozat', q:'5. Miért látjuk előbb a villámot, mint amennyit hallunk a dörgést?',
    options:['A fény sokkal gyorsabb, mint a hang.','A hang gyorsabb.','A villám nem ad hangot.','A szemünk gyorsabb.'], correct:0, explain:'A fény 300 000 km/s, a hang csak 340 m/s.', hint:'Gondolj a két sebességre.' },
  { type:'quiz', section:'Dolgozat', q:'6. Melyik hangszer aerofon?',
    options:['furulya','gitár','üstdob','gong'], correct:0, explain:'A furulyában a levegő rezgése kelti a hangot.', hint:'Aerofon: levegő.' },
  { type:'quiz', section:'Dolgozat', q:'7. Milyen közegben NEM terjed a hang?',
    options:['légüres térben','vízben','levegőben','acélban'], correct:0, explain:'A hang terjedéséhez közvetítő anyag kell.', hint:'Ott nincs anyag.' },

  { type:'calc', section:'Dolgozat', count:5, gens:[
    function(){ var t=pick([1,2,3,5,10]);
      return {q:'A villám után <b>'+t+' másodperccel</b> halljuk a dörgést. <b>Milyen messze csapott be a villám?</b> (v = 340 m/s) (m)', a:340*t, u:'m', hint:'s = v · t.', explain:'340 · '+t+' = '+fmt(340*t)+' m.'}; },
    function(){ var T=pick([0.5,0.25,0.1,0.2]);
      return {q:'Egy rezgés ideje <b>'+T+' s</b>. <b>Mekkora a frekvencia?</b> (Hz)', a:1/T, u:'Hz', tol:0.05, hint:'f = 1 : T.', explain:'1 : '+T+' = '+(1/T)+' Hz.'}; },
    function(){ var f=pick([2,4,5,10,20]);
      return {q:'A frekvencia <b>'+f+' Hz</b>. <b>Mennyi egy rezgés ideje?</b> (s)', a:1/f, u:'s', tol:0.005, hint:'T = 1 : f.', explain:'1 : '+f+' = '+(1/f)+' s.'}; },
    function(){ var t=pick([1,2,3,4]);
      return {q:'Kiabálsz egy sziklafalnak, és a visszhangot <b>'+(2*t)+' másodperc</b> múlva hallod. A hang oda-vissza utat tesz meg. <b>Milyen messze van a sziklafal?</b> (v = 340 m/s) (m)', a:340*t, u:'m', hint:'A hang '+t+' s alatt ér oda. s = v · t.', explain:'Egy irányban '+t+' s: 340 · '+t+' = '+(340*t)+' m.'}; },
    function(){ var k=pick([2,5,10,20]);
      return {q:'<b>'+k+' kHz</b> hány Hz? (1 kHz = 1000 Hz) (Hz)', a:k*1000, u:'Hz', hint:'Szorozd 1000-rel.', explain:k+' · 1000 = '+fmt(k*1000)+' Hz.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Mi kelti a hullámot?','A hullámforrás rezgése.'],
      ['Frekvencia','Rezgések száma 1 másodperc alatt, hertz (Hz). f = 1 : T.'],
      ['Mi a hang?','Rezgés, ami hullámként terjed közvetítő anyagban.'],
      ['Hang sebessége levegőben','Kb. 340 m/s.'],
      ['Hallható tartomány','20 – 20 000 Hz.'],
      ['Infrahang és ultrahang','Infra: 20 Hz alatt. Ultra: 20 000 Hz felett.'],
      ['Hangerősség','Mértékegysége dB. Hallásküszöb 0, fájdalomküszöb 130.'],
      ['Mitől függ a hangmagasság?','A frekvenciától. Hosszabb húr = mélyebb hang.'],
      ['Hangszercsoportok','Kordofon, membrafon, aerofon, idiofon.'],
      ['A fény sebessége','Kb. 300 000 km/s.'],
      ['Mi a hangszín?','Ami megkülönbözteti a különböző hangszerek hangját.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
