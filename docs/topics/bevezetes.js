/* Bevezetés a fizikába – mérés, tömeg, sűrűség, idő, hőmérséklet (I. fejezet) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var FIG = {
  measure: SV.svg('A mérés összehasonlítás: a mennyiség = számérték + mértékegység',
    SV.r(30,30,120,50,'#ffd23f')+SV.t(90,62,'17 m',28,'middle','#1b2618')+SV.t(90,100,'mennyiség',12)+
    SV.r(40,112,40,26,'#9fe07f')+SV.t(60,130,'17',14,'middle','#1b2618')+SV.t(60,150,'számérték',10)+SV.r(100,112,40,26,'#8fc2f5')+SV.t(120,130,'m',14,'middle','#1b2618')+SV.t(120,150,'egység',10)+
    '<line x1="190" y1="90" x2="300" y2="90" stroke="#8b8f87" stroke-width="3"/>'+
    [0,1,2,3,4,5,6,7,8,9,10].map(function(i){ return '<line x1="'+(190+i*11)+'" y1="'+(i%5?84:78)+'" x2="'+(190+i*11)+'" y2="90" stroke="currentColor" stroke-width="2"/>'; }).join('')+SV.t(245,72,'mérőszalag',12)),
  area: SV.svg('Terület és térfogat',
    SV.r(30,30,90,60,'#9fe07f')+SV.t(75,65,'T = a · b',14,'middle','#1b2618')+SV.t(75,112,'terület: m²',12)+
    '<polygon points="170,90 250,90 210,30" fill="#8fc2f5" stroke="#1b2618" stroke-width="3"/>'+SV.t(210,112,'T = a · m : 2',12)+
    SV.r(265,50,40,40,'#ffd23f')+SV.t(285,110,'V = a·b·c',11)+SV.t(285,126,'térfogat: m³',11)),
  density: SV.tri('Sűrűség: ró egyenlő m osztva V-vel','m','ρ','V','ρ = m : V   m = ρ · V   V = m : ρ'),
  time: SV.flow('Időegységek',[['év','#ffd9d6'],['nap','#fdeeb0'],['óra','#d5f0cb'],['perc','#cdeeed'],['mp','#d4e6fb']],['365','24','60','60'],'1 nap = 24 óra, 1 óra = 60 perc, 1 perc = 60 s'),
  temp: SV.svg('Celsius-skála: 0 °C a jég olvadása, 100 °C a víz forrása',
    SV.r(130,15,36,120,'#ffffff')+SV.r(138,60,20,75,'#d6403f')+'<circle cx="148" cy="140" r="14" fill="#d6403f" stroke="#1b2618" stroke-width="3"/>'+
    SV.t(185,28,'100 °C: a víz forr',12,'start')+SV.t(185,132,'0 °C: a jég olvad',12,'start')+SV.t(185,80,'20 °C: szobahőmérséklet',12,'start')+SV.t(30,80,'hőmérő',13,'start'))
};

window.LESSON = {
  id:'bevezetes',
  screens:[
  { type:'info', section:'Tanulás', icon:'📏', title:'A mérés', fig:FIG.measure,
    body:'<p>Mérni annyit jelent, hogy <mark class="k">összehasonlítunk</mark>. A mérendő dolgot összehasonlítjuk az <b>egységnyinek</b> választott mennyiséggel.</p><p>Ha a távolugró ugrása 7 méter, az azt jelenti, hogy a táv <b>hétszer akkora</b>, mint az 1 méter.</p><p>A mérés eredménye a <mark class="k">mennyiség</mark>. Mindig két részből áll:</p><ul><li>a <b>számértékből</b> (pl. 17),</li><li>és a <b>mértékegységből</b> (pl. m).</li></ul><p>Mértékegység nélkül a szám nem jelent semmit!</p>',
    mc:'<p>Ha ceruzával mérsz, az 17 ceruzányi lehet. De ez nem egyértelmű, mert mindenkinek más hosszú a ceruzája. Ezért használunk közös mértékegységet, mint a <b>méter</b>.</p>',
    src:'4. oldal' },

  { type:'info', section:'Tanulás', icon:'📐', title:'Hosszúság, terület, térfogat', fig:FIG.area,
    body:'<p>A <b>hosszúságot</b> közvetlenül mérjük (mérőszalag, vonalzó). Jele: l, mértékegysége: <b>m</b>.</p><p>A <mark class="k">terület</mark> jele <b>T</b>, mértékegysége <b>m²</b>. Általában <b>számítással</b> kapjuk meg.</p><ul><li>Téglalap: <b>T = a · b</b></li><li>Háromszög: <b>T = a · m : 2</b> (a az alap, m a hozzá tartozó magasság)</li></ul><p>1 m² = 100 cm · 100 cm = <b>10 000 cm²</b>.</p><p>A <mark class="k">térfogat</mark> jele <b>V</b>, mértékegysége <b>m³</b>. Téglatestnél: <b>V = a · b · c</b>.</p><p>1 dm³ = <b>1 liter</b>.</p>',
    mc:'<p>Egy Minecraft-blokk 1 m³: 1 m hosszú, 1 m széles, 1 m magas. Ha a térfogatot akarod, a három oldalt szorzod.</p>',
    tip:'<p>A terület és a térfogat <b>közvetett mérés</b>: nem közvetlenül mérjük, hanem a hosszúságokból számoljuk ki.</p>',
    src:'4–8. oldal' },

  { type:'info', section:'Tanulás', icon:'⚖️', title:'A tömeg mérése',
    body:'<p>A testek egyik jellemzője a <mark class="k">tömeg</mark>. Jele: <b>m</b>. Mértékegysége: <b>g</b> és <b>kg</b>.</p><p>1 kg = 1000 g.</p><p>A tömeget <b>mérleggel</b> mérjük. A tömeg azt mutatja meg, <b>mennyi anyag</b> van a testben. A Holdon is ugyanannyi, mint a Földön.</p>',
    mc:'<p>Egy láda vas nehezebb, mint egy láda fa, ha egyforma nagyok. Mert a vasban több anyag van ugyanakkora helyen. Ezt fejezi ki a sűrűség.</p>',
    src:'20. oldal' },

  { type:'info', section:'Tanulás', icon:'🧱', title:'Sűrűség', fig:FIG.density,
    body:'<p>A <mark class="k">sűrűség</mark> megmutatja, mekkora a test <b>tömege</b> a <b>térfogatához</b> képest. Jele: <b>ρ</b> (ró).</p><ul><li><b>ρ = m : V</b></li><li>Mértékegysége: <b>g/cm³</b> vagy <b>kg/m³</b></li></ul><p><b>Példák:</b></p><ul><li>víz: <b>1 g/cm³</b> (= 1000 kg/m³)</li><li>vas: kb. 7,8 g/cm³ (nehezebb a víznél, elmerül)</li><li>fa: legtöbbször kisebb, mint 1 g/cm³ (úszik)</li></ul><p><b>Számolás:</b> egy 200 g tömegű test térfogata 50 cm³. ρ = 200 : 50 = <b>4 g/cm³</b>.</p>',
    tip:'<p>A víz térfogata <b>4 °C-on a legkisebb</b>, vagyis itt a legnagyobb a sűrűsége. Ez ritka tulajdonság.</p>',
    src:'20–23. oldal' },

  { type:'info', section:'Tanulás', icon:'⏱️', title:'Az idő mérése', fig:FIG.time,
    body:'<p>Az idő jele <b>t</b>, mértékegysége a <mark class="k">másodperc</mark> (s).</p><ul><li>1 perc = 60 s</li><li>1 óra = 60 perc = 3600 s</li><li>1 nap = 24 óra</li><li>1 év = 365 nap = 12 hónap</li></ul><p>Az időt mindig valami <b>ismétlődő mozgással</b> mérjük. Ilyen a Nap látszólagos mozgása, az évszakok váltakozása, vagy az ingaóra lengése.</p>',
    tip:'<p>Számolásnál mindig váltsd át az időt <b>másodpercre</b>! Pl. 2 perc = 120 s.</p>',
    src:'26–29. oldal' },

  { type:'info', section:'Tanulás', icon:'🌡️', title:'A hőmérséklet mérése', fig:FIG.temp,
    body:'<p>A hőmérsékletet <mark class="k">hőmérővel</mark> mérjük. Jele: <b>T</b>.</p><p>Celsius két ismert pontot használt:</p><ul><li>a jég olvadása: <b>0 °C</b></li><li>a víz forrása: <b>100 °C</b></li></ul><p>A skálát a kettő között 100 egyenlő részre osztotta.</p><p>Háromféle hőmérséklet-mértékegység van:</p><ul><li><b>Celsius-fok</b> (°C), nálunk ezt használjuk</li><li><b>kelvin</b> (K)</li><li><b>Fahrenheit-fok</b> (°F)</li></ul>',
    mc:'<p>Ha a lávát vízhez érinted, a víz forr. Az igazi vízforrás 100 °C-on van, a jég pedig 0 °C-on olvad.</p>',
    src:'30–31. oldal' },

  { type:'info', section:'Tanulás', icon:'📋', title:'Ennyit kell tudni',
    body:'<ul><li>A mérés összehasonlítás. A <b>mennyiség = számérték + mértékegység</b>.</li><li>Terület: <b>T = a · b</b> (m²). Térfogat: <b>V = a · b · c</b> (m³). 1 dm³ = 1 liter.</li><li>Tömeg: <b>m</b>, kg és g. Sűrűség: <b>ρ = m : V</b> (g/cm³, kg/m³).</li><li>Idő: <b>t</b>, másodperc. 1 perc = 60 s, 1 óra = 60 perc.</li><li>Hőmérséklet: <b>T</b>, °C. 0 °C: jég olvad, 100 °C: víz forr.</li></ul><p><b>Most jön a játék! 🎮</b></p>',
    src:'32. oldal – összefoglalás' },

  /* ===== JÁTÉKOK ===== */
  { type:'match', section:'Játék 1', title:'🔗 Párosítás: mennyiség és mértékegység',
    pairs:[['hosszúság','m (méter)'],['terület','m² '],['térfogat','m³'],['tömeg','kg (kilogramm)'],['idő','s (másodperc)'],['hőmérséklet','°C']] },

  { type:'tf', section:'Játék 2', title:'⚡ Igaz vagy hamis?',
    items:[
      {t:'A mérés eredménye mindig számértékből és mértékegységből áll.', a:true, why:'Mértékegység nélkül a szám nem jelent semmit.'},
      {t:'1 m² = 100 cm².', a:false, why:'1 m² = 100 cm · 100 cm = 10 000 cm².'},
      {t:'1 dm³ egy liter.', a:true, why:'Így váltjuk át a térfogatot literre.'},
      {t:'A sűrűség jele a ró (ρ).', a:true, why:'ρ = m : V.'},
      {t:'A víz forráspontja 0 °C.', a:false, why:'A forráspontja 100 °C. A 0 °C a jég olvadáspontja.'},
      {t:'1 óra = 60 perc.', a:true, why:'És 1 perc = 60 másodperc.'}
    ]},

  { type:'memory', section:'Játék 3', title:'🧠 Memóriajáték',
    pairs:[['ρ','sűrűség'],['m','tömeg'],['V','térfogat'],['T (terület)','a · b'],['t','idő'],['°C','Celsius-fok']] },

  { type:'drag', section:'Játék 4', title:'📦 Hova tartozik a mértékegység?',
    bins:[{id:'hossz',name:'Hosszúság',icon:'📏'},{id:'tomeg',name:'Tömeg',icon:'⚖️'},{id:'ido',name:'Idő',icon:'⏱️'},{id:'terf',name:'Térfogat',icon:'🧊'}],
    items:[{t:'m',c:'hossz'},{t:'km',c:'hossz'},{t:'g',c:'tomeg'},{t:'kg',c:'tomeg'},{t:'perc',c:'ido'},{t:'óra',c:'ido'},{t:'liter',c:'terf'},{t:'m³',c:'terf'}] },

  { type:'cloze', section:'Játék 5', title:'✏️ Egészítsd ki a mondatot!',
    text:'A sűrűség jele ___, kiszámítása: tömeg osztva ___. A víz forráspontja ___ °C. A mérés eredménye a ___.',
    answers:['ρ','térfogattal','100','mennyiség'], extra:['0','idővel','sebesség'],
    explain:'ρ = m : V. A víz 100 °C-on forr.' },

  /* ===== DOLGOZAT GYAKORLÓ ===== */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'A mérés során ___ végzünk. A mennyiség számértékből és ___ áll. A tömeg és a térfogat hányadosa a ___. Az idő mértékegysége a ___. A jég olvadáspontja ___ °C.',
    answers:['összehasonlítást','mértékegységből','sűrűség','másodperc','0'], extra:['100','hőmérséklet','méter'],
    explain:'A bevezető fejezet alapfogalmai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze!',
    pairs:[['1 kg','1000 g'],['1 óra','60 perc'],['1 perc','60 s'],['1 dm³','1 liter'],['1 m²','10 000 cm²']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'A terület mértékegysége a méter.', a:false, why:'A terület mértékegysége m².'},
      {t:'A téglalap területe a · b.', a:true, why:'A két oldalt szorozzuk.'},
      {t:'A víz sűrűsége 1 g/cm³.', a:true, why:'Ez egyben 1000 kg/m³.'},
      {t:'Az időt ismétlődő mozgással mérjük.', a:true, why:'Pl. ingalengés, Föld forgása.'},
      {t:'Minden anyag sűrűsége ugyanakkora.', a:false, why:'Pl. a vas sokkal sűrűbb, mint a fa.'},
      {t:'A Celsius-skálán a víz 100 °C-on fagy.', a:false, why:'100 °C-on forr, 0 °C-on fagy.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Melyik a sűrűség helyes képlete?',
    options:['ρ = m : V','ρ = V : m','ρ = m · V','ρ = m + V'], correct:0, explain:'Sűrűség = tömeg : térfogat.', hint:'Tömeg osztva térfogattal.' },
  { type:'quiz', section:'Dolgozat', q:'5. Mekkora egy 4 m hosszú és 3 m széles téglalap területe?',
    options:['12 m²','7 m²','12 m','24 m²'], correct:0, explain:'T = a · b = 4 · 3 = 12 m².', hint:'Szorozd az oldalakat.' },
  { type:'quiz', section:'Dolgozat', q:'6. Melyik a legkisebb időegység?',
    options:['másodperc','perc','óra','nap'], correct:0, explain:'1 perc = 60 s, 1 óra = 60 perc, 1 nap = 24 óra.', hint:'Ezzel mérünk a legpontosabban.' },
  { type:'quiz', section:'Dolgozat', q:'7. Egy test térfogata 5 cm³, tömege 40 g. Mekkora a sűrűsége?',
    options:['8 g/cm³','35 g/cm³','200 g/cm³','0,125 g/cm³'], correct:0, explain:'ρ = m : V = 40 : 5 = 8 g/cm³.', hint:'Oszd a tömeget a térfogattal.' },

  { type:'calc', section:'Dolgozat', count:6, gens:[
    function(){ var a=pick([2,3,4,5,6,8,10]), b=pick([3,4,5,7,9,12]);
      return {q:'Egy téglalap oldalai <b>'+a+' m</b> és <b>'+b+' m</b>. <b>Mekkora a területe?</b> (m²)', a:a*b, u:'m²', hint:'T = a · b.', explain:a+' · '+b+' = '+(a*b)+' m².'}; },
    function(){ var a=pick([2,4,6,8,10]), m=pick([3,5,7,9]);
      return {q:'Egy háromszög alapja <b>'+a+' m</b>, a hozzá tartozó magassága <b>'+m+' m</b>. <b>Mekkora a területe?</b> (m²)', a:a*m/2, u:'m²', hint:'T = a · m : 2.', explain:a+' · '+m+' : 2 = '+(a*m/2)+' m².'}; },
    function(){ var a=pick([2,3,4]), b=pick([2,3,5]), c=pick([2,3,4]);
      return {q:'Egy téglatest élei: <b>'+a+' m</b>, <b>'+b+' m</b>, <b>'+c+' m</b>. <b>Mekkora a térfogata?</b> (m³)', a:a*b*c, u:'m³', hint:'V = a · b · c.', explain:a+' · '+b+' · '+c+' = '+(a*b*c)+' m³.'}; },
    function(){ var r=pick([2,3,4,5,8]), V=pick([5,10,20,25]);
      return {q:'Egy test térfogata <b>'+V+' cm³</b>, tömege <b>'+(r*V)+' g</b>. <b>Mekkora a sűrűsége?</b> (g/cm³)', a:r, u:'g/cm³', hint:'ρ = m : V.', explain:(r*V)+' : '+V+' = '+r+' g/cm³.'}; },
    function(){ var r=pick([2,3,5,8]), V=pick([4,10,20]);
      return {q:'Egy anyag sűrűsége <b>'+r+' g/cm³</b>. <b>Mekkora a tömege '+V+' cm³-nyi darabnak?</b> (g)', a:r*V, u:'g', hint:'m = ρ · V.', explain:r+' · '+V+' = '+(r*V)+' g.'}; },
    function(){ var m=pick([2,3,5,10]);
      return {q:'<b>'+m+' perc</b> hány másodperc? (s)', a:m*60, u:'s', hint:'1 perc = 60 s.', explain:m+' · 60 = '+(m*60)+' s.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Mi a mennyiség?','Számérték és mértékegység együtt. Pl. 17 m.'],
      ['Téglalap területe','T = a · b, mértékegysége m².'],
      ['Háromszög területe','T = a · m : 2.'],
      ['Téglatest térfogata','V = a · b · c, mértékegysége m³.'],
      ['1 dm³','1 liter.'],
      ['Sűrűség','ρ = m : V, mértékegysége g/cm³ vagy kg/m³.'],
      ['A víz sűrűsége','1 g/cm³ = 1000 kg/m³.'],
      ['Időegységek','1 perc = 60 s, 1 óra = 60 perc, 1 nap = 24 óra.'],
      ['Celsius-skála alappontjai','0 °C: jég olvad. 100 °C: víz forr.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
