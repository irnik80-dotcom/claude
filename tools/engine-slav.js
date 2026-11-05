/* Coniuga – orosz és lengyel ragozó motor. Ugyanazokat a neveket adja, mint az olasz motor (VERBS, TENSES, cell, check, SENTS, …).
   Igeidők: jelen, múlt (nemek szerint), jövő (folyamatos: összetett; befejezett: ragozott), feltételes, felszólító.
   Az igék szemléletpárban szerepelnek; a befejezett igének nincs jelen ideje. */
const IS_RU = TL === 'ru';
const TLANG = IS_RU
  ? {code:'ru', bcp:'ru-RU', name:'Русский', ppLabel:null, keys:'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('')}
  : {code:'pl', bcp:'pl-PL', name:'Polski', ppLabel:null, keys:['ą','ć','ę','ł','ń','ó','ś','ź','ż']};
const PERS = IS_RU ? ['я','ты','он/она','мы','вы','они'] : ['ja','ty','on/ona','my','wy','oni'];
const REFL = ['','','','','',''];
const TENSES = IS_RU ? [
  {id:'pres', it:'Настоящее время', hu:'jelen idő'},
  {id:'pp',   it:'Прошедшее время', hu:'múlt idő'},
  {id:'fut',  it:'Будущее время', hu:'jövő idő'},
  {id:'cond', it:'Сослагательное наклонение', hu:'feltételes mód'},
  {id:'impv', it:'Повелительное наклонение', hu:'felszólító mód'}
] : [
  {id:'pres', it:'Czas teraźniejszy', hu:'jelen idő'},
  {id:'pp',   it:'Czas przeszły', hu:'múlt idő'},
  {id:'fut',  it:'Czas przyszły', hu:'jövő idő'},
  {id:'cond', it:'Tryb przypuszczający', hu:'feltételes mód'},
  {id:'impv', it:'Tryb rozkazujący', hu:'felszólító mód'}
];
const COMPOUND = {};
const SIMPLE = ['pres','pp','fut','cond','impv'];
const PERS_IMPV = IS_RU ? ['—','ты','—','—','вы','—'] : ['—','ty','on/ona','my','wy','oni'];
const personLabel = (t, i) => t === 'impv' ? PERS_IMPV[i] : PERS[i];
const isIrrT = (vb, t) => vb.irrT.includes(t);
const NO_IMPV = new Set();
const NA6 = () => ['—','—','—','—','—','—'];

/* igék: főnévi igenév|szemlélet (i = folyamatos, p = befejezett)|szint|jelzők|magyar|lengyel|angol
   jelzők (;-vel): p=E1 E2 T3 (egyes szám 1., 2. és többes 3. személy; a többi ebből jön) vagy mind a hat alak,
   pst=múlt idő tövei (orosz: hímnem nőnem többes; lengyel: hímnem nőnem férfi-tsz. nem-férfi-tsz.),
   imv=felszólító (te alak, - = nincs), fut=a jövő idő hat alakja (ha rendhagyó), nopres, irr=rendhagyó igeidők */
const VERB_RAW_RU = `быть|i|1|nopres;fut=буду будешь будет будем будете будут;pst=был была были;imv=будь;irr=fut,impv|lenni|być|to be
делать|i|1|p=делаю делаешь делают;imv=делай|csinálni|robić|to do, to make
сделать|p|1|p=сделаю сделаешь сделают;imv=сделай|megcsinálni|zrobić|to do, to make (perf.)
говорить|i|1|p=говорю говоришь говорят;imv=говори|beszélni, mondani|mówić|to speak, to say
сказать|p|1|p=скажу скажешь скажут;imv=скажи;irr=fut|megmondani, elmondani|powiedzieć|to say, to tell (perf.)
знать|i|1|p=знаю знаешь знают;imv=знай|tudni (vmit)|wiedzieć|to know
хотеть|i|1|p=хочу хочешь хочет хотим хотите хотят;imv=-;irr=pres|akarni|chcieć|to want
мочь|i|1|p=могу можешь может можем можете могут;pst=мог могла могли;imv=-;irr=pres,pp|tudni (képes), -hat/-het|móc|can, to be able to
идти|i|1|p=иду идёшь идут;pst=шёл шла шли;imv=иди;irr=pp|menni (gyalog, most)|iść|to go (on foot)
пойти|p|1|p=пойду пойдёшь пойдут;pst=пошёл пошла пошли;imv=пойди;irr=pp|elmenni, elindulni (gyalog)|pójść|to go, to set off (perf.)
ехать|i|1|p=еду едешь едут;imv=поезжай;irr=impv|menni (járművel)|jechać|to go (by vehicle)
жить|i|1|p=живу живёшь живут;imv=живи;irr=pres|élni, lakni|żyć, mieszkać|to live
работать|i|1|p=работаю работаешь работают;imv=работай|dolgozni|pracować|to work
читать|i|1|p=читаю читаешь читают;imv=читай|olvasni|czytać|to read
прочитать|p|2|p=прочитаю прочитаешь прочитают;imv=прочитай|elolvasni|przeczytać|to read (through) (perf.)
писать|i|1|p=пишу пишешь пишут;imv=пиши;irr=pres|írni|pisać|to write
написать|p|2|p=напишу напишешь напишут;imv=напиши;irr=fut|megírni|napisać|to write (perf.)
понимать|i|1|p=понимаю понимаешь понимают;imv=понимай|érteni|rozumieć|to understand
понять|p|2|p=пойму поймёшь поймут;pst=понял поняла поняли;imv=пойми;irr=fut,impv|megérteni|zrozumieć|to understand (perf.)
любить|i|1|p=люблю любишь любят;imv=люби;irr=pres|szeretni|kochać, lubić|to love, to like
видеть|i|1|p=вижу видишь видят;imv=-;irr=pres|látni|widzieć|to see
смотреть|i|1|p=смотрю смотришь смотрят;imv=смотри|nézni|patrzeć, oglądać|to watch, to look
слушать|i|1|p=слушаю слушаешь слушают;imv=слушай|hallgatni|słuchać|to listen
есть|i|1|p=ем ешь ест едим едите едят;pst=ел ела ели;imv=ешь;irr=pres,pp,impv|enni|jeść|to eat
пить|i|1|p=пью пьёшь пьют;imv=пей;irr=pres,impv|inni|pić|to drink
спать|i|1|p=сплю спишь спят;imv=спи;irr=pres|aludni|spać|to sleep
думать|i|1|p=думаю думаешь думают;imv=думай|gondolni, gondolkodni|myśleć|to think
спрашивать|i|2|p=спрашиваю спрашиваешь спрашивают;imv=спрашивай|kérdezni|pytać|to ask
спросить|p|2|p=спрошу спросишь спросят;imv=спроси;irr=fut|megkérdezni|zapytać|to ask (perf.)
отвечать|i|2|p=отвечаю отвечаешь отвечают;imv=отвечай|válaszolni|odpowiadać|to answer
ответить|p|2|p=отвечу ответишь ответят;imv=ответь;irr=fut|megválaszolni|odpowiedzieć|to answer (perf.)
покупать|i|2|p=покупаю покупаешь покупают;imv=покупай|vásárolni|kupować|to buy
купить|p|1|p=куплю купишь купят;imv=купи;irr=fut|megvenni|kupić|to buy (perf.)
давать|i|2|p=даю даёшь дают;imv=давай;irr=pres|adni|dawać|to give
дать|p|1|p=дам дашь даст дадим дадите дадут;imv=дай;irr=fut,impv|odaadni, adni|dać|to give (perf.)
брать|i|2|p=беру берёшь берут;imv=бери;irr=pres|venni, fogni|brać|to take
взять|p|2|p=возьму возьмёшь возьмут;pst=взял взяла взяли;imv=возьми;irr=fut,impv|elvenni, elvinni|wziąć|to take (perf.)
учить|i|2|p=учу учишь учат;imv=учи|tanulni (vmit), tanítani|uczyć (się)|to learn, to teach
учиться|i|2|p=учу учишь учат;imv=учи|tanulni, tanulmányokat folytatni|uczyć się, studiować|to study
заниматься|i|2|p=занимаю занимаешь занимают;imv=занимай|foglalkozni vmivel, sportolni|zajmować się, uprawiać|to be engaged in, to do (sport)
начинать|i|2|p=начинаю начинаешь начинают;imv=начинай|kezdeni|zaczynać|to begin
начать|p|2|p=начну начнёшь начнут;pst=начал начала начали;imv=начни;irr=fut,impv|elkezdeni|zacząć|to begin (perf.)
помогать|i|2|p=помогаю помогаешь помогают;imv=помогай|segíteni|pomagać|to help
помочь|p|2|p=помогу поможешь помогут;pst=помог помогла помогли;imv=помоги;irr=fut,pp|segíteni (egyszer)|pomóc|to help (perf.)
звонить|i|2|p=звоню звонишь звонят;imv=звони|telefonálni, csengeni|dzwonić|to call, to ring
позвонить|p|1|p=позвоню позвонишь позвонят;imv=позвони|felhívni|zadzwonić|to call (perf.)
ждать|i|2|p=жду ждёшь ждут;imv=жди;irr=pres|várni|czekać|to wait
стоять|i|2|p=стою стоишь стоят;imv=стой|állni|stać|to stand
сидеть|i|2|p=сижу сидишь сидят;imv=сиди;irr=pres|ülni|siedzieć|to sit
открыть|p|2|p=открою откроешь откроют;imv=открой;irr=fut|kinyitni|otworzyć|to open (perf.)
закрыть|p|2|p=закрою закроешь закроют;imv=закрой;irr=fut|bezárni|zamknąć|to close (perf.)
готовить|i|2|p=готовлю готовишь готовят;imv=готовь;irr=pres|főzni, készíteni|gotować, przygotowywać|to cook, to prepare
играть|i|1|p=играю играешь играют;imv=играй|játszani|grać, bawić się|to play
гулять|i|2|p=гуляю гуляешь гуляют;imv=гуляй|sétálni|spacerować|to go for a walk
петь|i|2|p=пою поёшь поют;imv=пой;irr=pres|énekelni|śpiewać|to sing
приходить|i|3|p=прихожу приходишь приходят;imv=приходи;irr=pres|érkezni, jönni (gyalog)|przychodzić|to come, to arrive
прийти|p|2|p=приду придёшь придут;pst=пришёл пришла пришли;imv=приди;irr=fut,pp|megérkezni, eljönni (gyalog)|przyjść|to come, to arrive (perf.)
забыть|p|2|p=забуду забудешь забудут;imv=забудь;irr=fut|elfelejteni|zapomnieć|to forget (perf.)
помнить|i|2|p=помню помнишь помнят;imv=помни|emlékezni|pamiętać|to remember
вставать|i|2|p=встаю встаёшь встают;imv=вставай;irr=pres|felkelni|wstawać|to get up
одеваться|i|3|p=одеваю одеваешь одевают;imv=одевай|öltözködni|ubierać się|to get dressed
путешествовать|i|2|p=путешествую путешествуешь путешествуют;imv=путешествуй|utazni|podróżować|to travel
танцевать|i|2|p=танцую танцуешь танцуют;imv=танцуй|táncolni|tańczyć|to dance
рисовать|i|2|p=рисую рисуешь рисуют;imv=рисуй|rajzolni|rysować|to draw
платить|i|2|p=плачу платишь платят;imv=плати;irr=pres|fizetni|płacić|to pay
ходить|i|2|p=хожу ходишь ходят;imv=ходи;irr=pres|járni (gyalog, rendszeresen)|chodzić|to walk, to go (regularly)
ездить|i|3|p=езжу ездишь ездят;imv=-;irr=pres|járni (járművel, rendszeresen)|jeździć|to travel (regularly)
мечтать|i|3|p=мечтаю мечтаешь мечтают;imv=мечтай|álmodozni|marzyć|to dream
решить|p|3|p=решу решишь решат;imv=реши|eldönteni, megoldani|zdecydować, rozwiązać|to decide, to solve (perf.)
показать|p|3|p=покажу покажешь покажут;imv=покажи;irr=fut|megmutatni|pokazać|to show (perf.)
вернуться|p|3|p=верну вернёшь вернут;imv=верни|visszatérni|wrócić|to come back (perf.)
остаться|p|3|p=остану останешь останут;imv=остань;irr=fut|ottmaradni|zostać|to stay (perf.)`;

const VERB_RAW_PL = `być|i|1|p=jestem jesteś jest jesteśmy jesteście są;fut=będę będziesz będzie będziemy będziecie będą;imv=bądź;irr=pres,fut,impv|lenni||to be
mieć|i|1|p=mam masz mają;imv=miej;irr=impv|vmije van, birtokolni||to have
robić|i|1|p=robię robisz robią;imv=rób|csinálni||to do, to make
zrobić|p|1|p=zrobię zrobisz zrobią;imv=zrób|megcsinálni||to do, to make (perf.)
mówić|i|1|p=mówię mówisz mówią;imv=mów|beszélni, mondani||to speak, to say
powiedzieć|p|1|p=powiem powiesz powiedzą;imv=powiedz;irr=fut,impv|megmondani, elmondani||to say, to tell (perf.)
wiedzieć|i|1|p=wiem wiesz wiedzą;imv=wiedz;irr=pres|tudni (vmit)||to know (a fact)
znać|i|1|p=znam znasz znają;imv=znaj|ismerni||to know (someone, something)
chcieć|i|1|p=chcę chcesz chcą;imv=chciej;irr=pres,impv|akarni||to want
móc|i|1|p=mogę możesz mogą;pst=mógł mogła mogli mogły;imv=-;irr=pres,pp|tudni (képes), -hat/-het||can, to be able to
iść|i|1|p=idę idziesz idą;pst=szedł szła szli szły;imv=idź;irr=pres,pp|menni (gyalog)||to go (on foot)
pójść|p|1|p=pójdę pójdziesz pójdą;pst=poszedł poszła poszli poszły;imv=-;irr=fut,pp|elmenni, elindulni (gyalog)||to go, to set off (perf.)
jechać|i|1|p=jadę jedziesz jadą;imv=jedź;irr=pres,impv|menni (járművel)||to go (by vehicle)
żyć|i|1|p=żyję żyjesz żyją;imv=żyj|élni||to live
mieszkać|i|1|p=mieszkam mieszkasz mieszkają;imv=mieszkaj|lakni||to live (somewhere)
pracować|i|1|p=pracuję pracujesz pracują;imv=pracuj|dolgozni||to work
czytać|i|1|p=czytam czytasz czytają;imv=czytaj|olvasni||to read
przeczytać|p|2|p=przeczytam przeczytasz przeczytają;imv=przeczytaj|elolvasni||to read (through) (perf.)
pisać|i|1|p=piszę piszesz piszą;imv=pisz;irr=pres|írni||to write
napisać|p|2|p=napiszę napiszesz napiszą;imv=napisz;irr=fut|megírni||to write (perf.)
rozumieć|i|1|p=rozumiem rozumiesz rozumieją;imv=-|érteni||to understand
zrozumieć|p|2|p=zrozumiem zrozumiesz zrozumieją;imv=zrozum|megérteni||to understand (perf.)
kochać|i|1|p=kocham kochasz kochają;imv=kochaj|szeretni (vkit)||to love
lubić|i|1|p=lubię lubisz lubią;imv=-|szeretni, kedvelni||to like
widzieć|i|1|p=widzę widzisz widzą;imv=-;irr=pres|látni||to see
oglądać|i|1|p=oglądam oglądasz oglądają;imv=oglądaj|nézni (tévét, filmet)||to watch
słuchać|i|1|p=słucham słuchasz słuchają;imv=słuchaj|hallgatni||to listen
jeść|i|1|p=jem jesz jedzą;pst=jadł jadła jedli jadły;imv=jedz;irr=pres,pp,impv|enni||to eat
pić|i|1|p=piję pijesz piją;imv=pij|inni||to drink
spać|i|1|p=śpię śpisz śpią;imv=śpij;irr=pres,impv|aludni||to sleep
myśleć|i|1|p=myślę myślisz myślą;imv=myśl|gondolni, gondolkodni||to think
pytać|i|2|p=pytam pytasz pytają;imv=pytaj|kérdezni||to ask
zapytać|p|2|p=zapytam zapytasz zapytają;imv=zapytaj|megkérdezni||to ask (perf.)
odpowiadać|i|2|p=odpowiadam odpowiadasz odpowiadają;imv=odpowiadaj|válaszolni||to answer
odpowiedzieć|p|2|p=odpowiem odpowiesz odpowiedzą;imv=odpowiedz;irr=fut,impv|megválaszolni||to answer (perf.)
kupować|i|2|p=kupuję kupujesz kupują;imv=kupuj|vásárolni||to buy
kupić|p|1|p=kupię kupisz kupią;imv=kup|megvenni||to buy (perf.)
dawać|i|2|p=daję dajesz dają;imv=dawaj;irr=pres|adni||to give
dać|p|1|p=dam dasz dadzą;imv=daj;irr=fut,impv|odaadni, adni||to give (perf.)
brać|i|2|p=biorę bierzesz biorą;imv=bierz;irr=pres,impv|venni, fogni||to take
wziąć|p|2|p=wezmę weźmiesz wezmą;pst=wziął wzięła wzięli wzięły;imv=weź;irr=fut,pp,impv|elvenni, elvinni||to take (perf.)
uczyć się|i|2|p=uczę uczysz uczą;imv=ucz|tanulni||to learn, to study
zaczynać|i|2|p=zaczynam zaczynasz zaczynają;imv=zaczynaj|kezdeni||to begin
zacząć|p|2|p=zacznę zaczniesz zaczną;pst=zaczął zaczęła zaczęli zaczęły;imv=zacznij;irr=fut,pp,impv|elkezdeni||to begin (perf.)
pomagać|i|2|p=pomagam pomagasz pomagają;imv=pomagaj|segíteni||to help
pomóc|p|2|p=pomogę pomożesz pomogą;pst=pomógł pomogła pomogli pomogły;imv=pomóż;irr=fut,pp,impv|segíteni (egyszer)||to help (perf.)
dzwonić|i|2|p=dzwonię dzwonisz dzwonią;imv=dzwoń|telefonálni, csengeni||to call, to ring
zadzwonić|p|1|p=zadzwonię zadzwonisz zadzwonią;imv=zadzwoń|felhívni||to call (perf.)
czekać|i|1|p=czekam czekasz czekają;imv=czekaj|várni||to wait
otworzyć|p|2|p=otworzę otworzysz otworzą;imv=otwórz;irr=impv|kinyitni||to open (perf.)
zamknąć|p|2|p=zamknę zamkniesz zamkną;pst=zamknął zamknęła zamknęli zamknęły;imv=zamknij;irr=pp|bezárni||to close (perf.)
gotować|i|2|p=gotuję gotujesz gotują;imv=gotuj|főzni||to cook
grać|i|1|p=gram grasz grają;imv=graj|játszani||to play
śpiewać|i|2|p=śpiewam śpiewasz śpiewają;imv=śpiewaj|énekelni||to sing
tańczyć|i|2|p=tańczę tańczysz tańczą;imv=tańcz|táncolni||to dance
przyjść|p|2|p=przyjdę przyjdziesz przyjdą;pst=przyszedł przyszła przyszli przyszły;imv=przyjdź;irr=fut,pp,impv|megérkezni, eljönni (gyalog)||to come, to arrive (perf.)
przychodzić|i|3|p=przychodzę przychodzisz przychodzą;imv=przychodź;irr=pres|érkezni, jönni (gyalog)||to come, to arrive
zapomnieć|p|2|p=zapomnę zapomnisz zapomną;imv=zapomnij;irr=fut,impv|elfelejteni||to forget (perf.)
pamiętać|i|2|p=pamiętam pamiętasz pamiętają;imv=pamiętaj|emlékezni||to remember
wstawać|i|2|p=wstaję wstajesz wstają;imv=wstawaj;irr=pres|felkelni||to get up
podróżować|i|2|p=podróżuję podróżujesz podróżują;imv=podróżuj|utazni||to travel
płacić|i|2|p=płacę płacisz płacą;imv=płać;irr=pres|fizetni||to pay
chodzić|i|2|p=chodzę chodzisz chodzą;imv=chodź;irr=pres|járni (gyalog, rendszeresen)||to walk, to go (regularly)
jeździć|i|3|p=jeżdżę jeździsz jeżdżą;imv=jeźdź;irr=pres|járni (járművel, rendszeresen)||to travel (regularly)
marzyć|i|3|p=marzę marzysz marzą;imv=marz|álmodozni||to dream
wrócić|p|2|p=wrócę wrócisz wrócą;imv=wróć;irr=fut|visszatérni||to come back (perf.)
zostać|p|2|p=zostanę zostaniesz zostaną;imv=zostań;irr=fut|ottmaradni; válni vmivé||to stay; to become (perf.)
pokazać|p|3|p=pokażę pokażesz pokażą;imv=pokaż;irr=fut|megmutatni||to show (perf.)
nazywać się|i|1|p=nazywam nazywasz nazywają;imv=-|hívják vhogy||to be called
ubierać się|i|3|p=ubieram ubierasz ubierają;imv=ubieraj|öltözködni||to get dressed
spacerować|i|2|p=spaceruję spacerujesz spacerują;imv=spaceruj|sétálni||to go for a walk
siedzieć|i|2|p=siedzę siedzisz siedzą;imv=siedź;irr=pres|ülni||to sit
stać|i|2|p=stoję stoisz stoją;imv=stój;irr=pres,impv|állni||to stand`;

/* ---- ragozás ---- */
const RU_V = /[аеёиоуыэюя]$/;
const ruSfx = (f, refl) => !refl || f === '—' ? f : (RU_V.test(f) ? f + 'сь' : f + 'ся');
function conjRu(o){
  const refl = /(ся|сь)$/.test(o.inf), base = refl ? o.inf.slice(0, -2) : o.inf;
  const R = f => ruSfx(f, refl);
  const P = (o.fl.p || '').split(' ').filter(Boolean);
  let six = P;
  if (P.length === 3){ const st = P[1].replace(/шь$/, ''); six = [P[0], P[1], st + 'т', st + 'м', st + 'те', P[2]]; }
  const pst = o.fl.pst ? o.fl.pst.split(' ') : ['л','ла','ли'].map(e => base.replace(/ть$/, e));
  const [m, f, pl] = pst.map(R);
  const F = {};
  F.pres = (o.asp === 'i' && !o.fl.nopres) ? six.map(R) : NA6();
  const BUD = ['буду','будешь','будет','будем','будете','будут'];
  F.fut = o.fl.fut ? o.fl.fut.split(' ') : o.asp === 'p' ? six.map(R) : BUD.map(b => b + ' ' + o.inf);
  const g = m + '/' + f;
  F.pp = [g, g, g, pl, pl, pl];
  const gb = m + ' бы/' + f + ' бы', pb = pl + ' бы';
  F.cond = [gb, gb, gb, pb, pb, pb];
  const imv = o.fl.imv;
  F.impv = !imv || imv === '-' ? NA6() : ['—', R(imv), '—', '—', R(imv + 'те'), '—'];
  return F;
}
const PL_BEDE = ['będę','będziesz','będzie','będziemy','będziecie','będą'];
function conjPl(o){
  const refl = / się$/.test(o.inf), base = refl ? o.inf.slice(0, -4) : o.inf;
  const S = s => refl ? s + ' się' : s;
  const P = (o.fl.p || '').split(' ').filter(Boolean);
  let six = P;
  if (P.length === 3){ const st = P[1].replace(/sz$/, ''); six = [P[0], P[1], st, st + 'my', st + 'cie', P[2]]; }
  let m, f, vir, nvir;
  if (o.fl.pst) [m, f, vir, nvir] = o.fl.pst.split(' ');
  else {
    const st = base.slice(0, -1);
    if (/e$/.test(st)){ const a = st.slice(0, -1) + 'a'; m = a + 'ł'; f = a + 'ła'; vir = st + 'li'; nvir = a + 'ły'; }
    else { m = st + 'ł'; f = st + 'ła'; vir = st + 'li'; nvir = st + 'ły'; }
  }
  const mb = m.replace(/ó(?=[^ó]*$)/, 'o');
  const alt = a => a.map(S).join('/');
  const F = {};
  F.pres = o.asp === 'i' ? six.map(S) : NA6();
  F.pp = [[mb+'em', f+'m'], [mb+'eś', f+'ś'], [m, f], [vir+'śmy', nvir+'śmy'], [vir+'ście', nvir+'ście'], [vir, nvir]].map(alt);
  F.cond = [[m+'bym', f+'bym'], [m+'byś', f+'byś'], [m+'by', f+'by'], [vir+'byśmy', nvir+'byśmy'], [vir+'byście', nvir+'byście'], [vir+'by', nvir+'by']].map(alt);
  if (o.fl.fut) F.fut = o.fl.fut.split(' ');
  else if (o.asp === 'p') F.fut = six.map(S);
  else F.fut = PL_BEDE.map((b, i) => {
    const l = i < 3 ? [m, f] : [vir, nvir];
    const forms = [base, ...l];
    return forms.map(x => refl ? `${b} się ${x}/${b} ${x} się` : `${b} ${x}`).join('/');
  });
  const imv = o.fl.imv;
  const third = o.fl.fut && o.asp === 'i' ? F.fut : six;   // być: niech będzie
  if (!imv || imv === '-') F.impv = NA6();
  else F.impv = ['—', S(imv), refl ? `niech się ${third[2]}/niech ${third[2]} się` : 'niech ' + third[2], S(imv + 'my'), S(imv + 'cie'), refl ? `niech się ${third[5]}/niech ${third[5]} się` : 'niech ' + third[5]];
  return F;
}

const VERBS = [];
(IS_RU ? VERB_RAW_RU : VERB_RAW_PL).trim().split('\n').forEach(l => {
  const [inf, asp, lvl, flags, hu, pl, en] = l.split('|');
  const fl = {};
  (flags || '').split(';').filter(Boolean).forEach(x => { const k = x.indexOf('='); if (k < 0) fl[x] = true; else fl[x.slice(0, k)] = x.slice(k + 1); });
  const vb = {inf, asp, lvl: +lvl, hu, mhu: hu, mean: {hu, pl: pl || en, en}, fl};
  vb.refl = IS_RU ? /(ся|сь)$/.test(inf) : / się$/.test(inf);
  vb.F = IS_RU ? conjRu(vb) : conjPl(vb);
  vb.irrT = (fl.irr || '').split(',').filter(Boolean);
  vb.R = {};
  SIMPLE.forEach(t => { vb.R[t] = vb.F[t].map(x => x === '—' || !vb.irrT.includes(t) ? x : '#'); });
  vb.irr = vb.irrT.length > 0;
  vb.noT = SIMPLE.filter(t => vb.F[t].every(x => x === '—'));
  vb.noImpv = vb.noT.includes('impv');
  vb.aspect = asp;
  VERBS.push(vb);
});
VERBS.sort((a, b) => a.inf.localeCompare(b.inf, TL));
const VBY0 = Object.fromEntries(VERBS.map(v => [v.inf, v]));

function cell(vb, t, i){
  const raw = (vb.F[t] || [])[i];
  if (!raw || raw === '—') return {display:'—', accept:[], irr:false, na:true};
  const alts = raw.split('/');
  const more = alts.slice(1, 3);
  return {display: alts[0] + (more.length ? ' (' + more.join(', ') + (alts.length > 3 ? ', …' : '') + ')' : ''), accept: alts, irr: raw !== vb.R[t][i]};
}

const PRON_RE = IS_RU ? /^(я|ты|он\/она|он|она|оно|мы|вы|они)\s+/ : /^(ja|ty|on\/ona|on|ona|ono|my|wy|oni|one)\s+/;
function norm(s){
  s = (s || '').toLowerCase().normalize('NFC').trim().replace(/\s+/g, ' ').replace(/[.!?,]+$/, '');
  return s.replace(PRON_RE, '');
}
const deacc = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L');
function check(input, accept){
  const n = norm(input);
  if (!n) return 'empty';
  if (accept.some(a => norm(a) === n)) return 'ok';
  if (accept.some(a => deacc(norm(a)) === deacc(n))) return 'acc';
  return 'bad';
}

/* példamondatok: ige|idő|személy|mondat ___ helyén az igével|magyar|lengyel|angol|f = nőnemű alak */
const SENT_RAW_RU = `быть|fut|0|Завтра я ___ дома.|Holnap otthon leszek.|Jutro będę w domu.|Tomorrow I'll be at home.
делать|pres|1|Что ты ___?|Mit csinálsz?|Co robisz?|What are you doing?
сделать|pp|3|Мы уже ___ домашнее задание.|Már megcsináltuk a házi feladatot.|Już zrobiliśmy zadanie domowe.|We've already done the homework.
говорить|pres|1|Ты ___ по-русски?|Beszélsz oroszul?|Mówisz po rosyjsku?|Do you speak Russian?
сказать|pp|2|Он ___ мне правду.|Megmondta nekem az igazat.|Powiedział mi prawdę.|He told me the truth.
знать|pres|0|Я не ___, где вокзал.|Nem tudom, hol van a pályaudvar.|Nie wiem, gdzie jest dworzec.|I don't know where the station is.
хотеть|pres|3|Мы ___ пить чай.|Teát akarunk inni.|Chcemy pić herbatę.|We want to drink tea.
мочь|pres|1|Ты ___ мне помочь?|Tudsz nekem segíteni?|Możesz mi pomóc?|Can you help me?
идти|pres|0|Я ___ в магазин.|A boltba megyek.|Idę do sklepu.|I'm going to the shop.
пойти|fut|3|Завтра мы ___ в кино.|Holnap moziba megyünk.|Jutro pójdziemy do kina.|Tomorrow we'll go to the cinema.
ехать|pres|5|Они ___ в Москву на поезде.|Vonattal mennek Moszkvába.|Jadą pociągiem do Moskwy.|They're going to Moscow by train.
жить|pres|0|Я ___ в Венгрии.|Magyarországon élek.|Mieszkam na Węgrzech.|I live in Hungary.
работать|pp|2|Мой отец ___ в банке.|Apám bankban dolgozott.|Mój tata pracował w banku.|My father worked in a bank.
читать|pres|2|Мама ___ книгу.|Anya könyvet olvas.|Mama czyta książkę.|Mum is reading a book.
прочитать|pp|0|Я ___ эту книгу за два дня.|Két nap alatt elolvastam ezt a könyvet.|Przeczytałem tę książkę w dwa dni.|I read this book in two days.
писать|pres|1|Кому ты ___ письмо?|Kinek írsz levelet?|Do kogo piszesz list?|Who are you writing a letter to?
написать|fut|0|Я ___ тебе завтра.|Holnap írok neked.|Napiszę do ciebie jutro.|I'll write to you tomorrow.
понимать|pres|0|Я не ___ это слово.|Nem értem ezt a szót.|Nie rozumiem tego słowa.|I don't understand this word.
понять|pp|3|Мы всё ___.|Mindent megértettünk.|Wszystko zrozumieliśmy.|We understood everything.
любить|pres|0|Я ___ музыку.|Szeretem a zenét.|Lubię muzykę.|I love music.
видеть|pp|0|Я ___ его вчера.|Tegnap láttam őt.|Widziałem go wczoraj.|I saw him yesterday.
смотреть|pres|5|Дети ___ телевизор.|A gyerekek tévét néznek.|Dzieci oglądają telewizję.|The children are watching TV.
слушать|impv|1|___ меня внимательно!|Figyelj rám jól!|Słuchaj mnie uważnie!|Listen to me carefully!
есть|pres|3|Мы ___ суп.|Levest eszünk.|Jemy zupę.|We're eating soup.
пить|pres|2|Он ___ кофе каждое утро.|Minden reggel kávét iszik.|Pije kawę każdego ranka.|He drinks coffee every morning.
спать|pres|5|Дети уже ___.|A gyerekek már alszanak.|Dzieci już śpią.|The children are already asleep.
думать|pres|1|О чём ты ___?|Mire gondolsz?|O czym myślisz?|What are you thinking about?
спрашивать|pres|5|Студенты часто ___.|A diákok gyakran kérdeznek.|Studenci często pytają.|Students often ask questions.
спросить|pp|0|Я ___ дорогу у прохожего.|Megkérdeztem az utat egy járókelőtől.|Zapytałem przechodnia o drogę.|I asked a passer-by for directions.
отвечать|pres|0|Я ___ на письма вечером.|Este válaszolok a levelekre.|Odpowiadam na listy wieczorem.|I answer letters in the evening.
ответить|fut|2|Он ___ завтра.|Holnap fog válaszolni.|Odpowie jutro.|He'll answer tomorrow.
покупать|pres|3|Мы ___ хлеб в этом магазине.|Ebben a boltban vesszük a kenyeret.|Kupujemy chleb w tym sklepie.|We buy bread in this shop.
купить|pp|3|Мы ___ новую машину.|Új autót vettünk.|Kupiliśmy nowy samochód.|We bought a new car.
давать|pres|2|Учитель ___ нам много заданий.|A tanár sok feladatot ad nekünk.|Nauczyciel daje nam dużo zadań.|The teacher gives us a lot of tasks.
дать|impv|1|___ мне, пожалуйста, воды.|Adj nekem vizet, kérlek.|Daj mi, proszę, wody.|Give me some water, please.
брать|pres|0|Я всегда ___ с собой воду.|Mindig viszek magammal vizet.|Zawsze biorę ze sobą wodę.|I always take water with me.
взять|pp|0|Я ___ зонтик.|Elvittem az esernyőt.|Wziąłem parasol.|I took the umbrella.
учить|pres|0|Я ___ русские слова.|Orosz szavakat tanulok.|Uczę się rosyjskich słów.|I'm learning Russian words.
учиться|pres|0|Я ___ в университете.|Egyetemen tanulok.|Studiuję na uniwersytecie.|I study at university.
заниматься|pres|5|Они ___ спортом.|Sportolnak.|Uprawiają sport.|They do sport.
начинать|pres|2|Он ___ день с кофе.|Kávéval kezdi a napot.|Zaczyna dzień od kawy.|He starts the day with coffee.
начать|pp|2|Он ___ работать в восемь.|Nyolckor kezdett dolgozni.|Zaczął pracować o ósmej.|He started working at eight.
помогать|pres|0|Я ___ маме.|Segítek anyának.|Pomagam mamie.|I help Mum.
помочь|cond|1|Ты ___ мне?|Segítenél nekem?|Pomógłbyś mi?|Would you help me?
звонить|pres|2|Телефон ___.|Cseng a telefon.|Telefon dzwoni.|The phone is ringing.
позвонить|fut|0|Я ___ тебе вечером.|Este felhívlak.|Zadzwonię do ciebie wieczorem.|I'll call you tonight.
ждать|pres|0|Я ___ автобус.|A buszra várok.|Czekam na autobus.|I'm waiting for the bus.
стоять|pres|2|Машина ___ у дома.|Az autó a ház előtt áll.|Samochód stoi przed domem.|The car is standing in front of the house.
сидеть|pres|2|Кошка ___ на окне.|A macska az ablakban ül.|Kot siedzi na oknie.|The cat is sitting on the windowsill.
открыть|impv|4|___ окно, пожалуйста.|Nyissa ki az ablakot, kérem.|Proszę otworzyć okno.|Open the window, please.
закрыть|pp|2|Она ___ дверь.|Bezárta az ajtót.|Zamknęła drzwi.|She closed the door.|f
готовить|pres|2|Бабушка ___ обед.|A nagymama ebédet főz.|Babcia gotuje obiad.|Grandma is cooking lunch.
играть|pres|5|Дети ___ в парке.|A gyerekek a parkban játszanak.|Dzieci bawią się w parku.|The children are playing in the park.
гулять|pp|3|Вчера мы ___ в парке.|Tegnap a parkban sétáltunk.|Wczoraj spacerowaliśmy po parku.|Yesterday we went for a walk in the park.
петь|pres|2|Моя сестра хорошо ___.|A húgom jól énekel.|Moja siostra dobrze śpiewa.|My sister sings well.
приходить|pres|2|Он всегда ___ вовремя.|Mindig időben érkezik.|Zawsze przychodzi na czas.|He always arrives on time.
прийти|pp|5|Гости ___ в семь.|A vendégek hétkor jöttek meg.|Goście przyszli o siódmej.|The guests arrived at seven.
забыть|pp|0|Я ___ ключи дома.|Otthon felejtettem a kulcsokat.|Zostawiłem klucze w domu.|I left my keys at home.
помнить|pres|1|Ты ___ его имя?|Emlékszel a nevére?|Pamiętasz jego imię?|Do you remember his name?
вставать|pres|0|Я ___ в семь часов.|Hét órakor kelek.|Wstaję o siódmej.|I get up at seven.
одеваться|pres|1|Почему ты так долго ___?|Miért öltözöl ilyen sokáig?|Dlaczego tak długo się ubierasz?|Why are you taking so long to get dressed?
путешествовать|cond|0|Я ___ по всему миру.|Beutaznám az egész világot.|Podróżowałbym po całym świecie.|I would travel all over the world.
танцевать|pp|5|Они ___ всю ночь.|Egész éjjel táncoltak.|Tańczyli całą noc.|They danced all night.
рисовать|pres|2|Мой сын хорошо ___.|A fiam jól rajzol.|Mój syn dobrze rysuje.|My son draws well.
платить|pres|0|Сегодня я ___.|Ma én fizetek.|Dziś ja płacę.|Today I'm paying.
ходить|pres|1|Ты часто ___ в театр?|Gyakran jársz színházba?|Często chodzisz do teatru?|Do you often go to the theatre?
ездить|pp|3|Летом мы ___ на море.|Nyáron a tengerhez jártunk.|Latem jeździliśmy nad morze.|In summer we used to go to the seaside.
мечтать|pres|0|Я ___ о собаке.|Kutyáról álmodozom.|Marzę o psie.|I dream of having a dog.
решить|pp|3|Мы ___ продать дом.|Úgy döntöttünk, eladjuk a házat.|Postanowiliśmy sprzedać dom.|We decided to sell the house.
показать|impv|1|___ мне фотографии!|Mutasd meg a fényképeket!|Pokaż mi zdjęcia!|Show me the photos!
вернуться|fut|0|Я ___ через час.|Egy óra múlva visszajövök.|Wrócę za godzinę.|I'll be back in an hour.
остаться|pp|0|Вчера я ___ дома.|Tegnap otthon maradtam.|Wczoraj zostałem w domu.|Yesterday I stayed at home.`;

const SENT_RAW_PL = `być|pres|0|___ z Węgier.|Magyarországról jöttem.||I'm from Hungary.
mieć|pres|1|Ile ___ lat?|Hány éves vagy?||How old are you?
robić|pres|1|Co ___?|Mit csinálsz?||What are you doing?
zrobić|pp|3|Już ___ zadanie domowe.|Már megcsináltuk a házi feladatot.||We've already done the homework.
mówić|pres|1|___ po polsku?|Beszélsz lengyelül?||Do you speak Polish?
powiedzieć|pp|2|On ___ mi prawdę.|Megmondta nekem az igazat.||He told me the truth.
wiedzieć|pres|0|Nie ___, gdzie jest dworzec.|Nem tudom, hol van a pályaudvar.||I don't know where the station is.
znać|pres|3|Dobrze ___ to miasto.|Jól ismerjük ezt a várost.||We know this city well.
chcieć|pres|3|___ pić herbatę.|Teát akarunk inni.||We want to drink tea.
móc|pres|1|___ mi pomóc?|Tudsz nekem segíteni?||Can you help me?
iść|pres|0|___ do sklepu.|A boltba megyek.||I'm going to the shop.
pójść|fut|3|Jutro ___ do kina.|Holnap moziba megyünk.||Tomorrow we'll go to the cinema.
jechać|pres|5|___ pociągiem do Krakowa.|Vonattal mennek Krakkóba.||They're going to Kraków by train.
żyć|pp|5|Moi dziadkowie ___ na wsi.|A nagyszüleim vidéken éltek.||My grandparents lived in the countryside.
mieszkać|pres|0|___ na Węgrzech.|Magyarországon lakom.||I live in Hungary.
pracować|pp|2|Mój tata ___ w banku.|Apám bankban dolgozott.||My father worked in a bank.
czytać|pres|2|Mama ___ książkę.|Anya könyvet olvas.||Mum is reading a book.
przeczytać|pp|0|___ tę książkę w dwa dni.|Két nap alatt elolvastam ezt a könyvet.||I read this book in two days.
pisać|pres|1|Do kogo ___ list?|Kinek írsz levelet?||Who are you writing a letter to?
napisać|fut|0|___ do ciebie jutro.|Holnap írok neked.||I'll write to you tomorrow.
rozumieć|pres|0|Nie ___ tego słowa.|Nem értem ezt a szót.||I don't understand this word.
zrozumieć|pp|3|Wszystko ___.|Mindent megértettünk.||We understood everything.
kochać|pres|2|Paweł ___ swoją rodzinę.|Paweł szereti a családját.||Paweł loves his family.
lubić|pres|0|Bardzo ___ muzykę.|Nagyon szeretem a zenét.||I really like music.
widzieć|pp|0|___ go wczoraj.|Tegnap láttam őt.||I saw him yesterday.
oglądać|pres|5|Dzieci ___ telewizję.|A gyerekek tévét néznek.||The children are watching TV.
słuchać|impv|1|___ mnie uważnie!|Figyelj rám jól!||Listen to me carefully!
jeść|pres|3|___ zupę.|Levest eszünk.||We're eating soup.
pić|pres|2|On ___ kawę każdego ranka.|Minden reggel kávét iszik.||He drinks coffee every morning.
spać|pres|5|Dzieci już ___.|A gyerekek már alszanak.||The children are already asleep.
myśleć|pres|1|O czym ___?|Mire gondolsz?||What are you thinking about?
pytać|pres|5|Studenci często ___.|A diákok gyakran kérdeznek.||Students often ask questions.
zapytać|pp|0|___ przechodnia o drogę.|Megkérdeztem az utat egy járókelőtől.||I asked a passer-by for directions.
odpowiadać|pres|0|___ na listy wieczorem.|Este válaszolok a levelekre.||I answer letters in the evening.
odpowiedzieć|fut|2|On ___ jutro.|Holnap fog válaszolni.||He'll answer tomorrow.
kupować|pres|3|___ chleb w tym sklepie.|Ebben a boltban vesszük a kenyeret.||We buy bread in this shop.
kupić|pp|3|___ nowy samochód.|Új autót vettünk.||We bought a new car.
dawać|pres|2|Nauczyciel ___ nam dużo zadań.|A tanár sok feladatot ad nekünk.||The teacher gives us a lot of tasks.
dać|impv|1|___ mi, proszę, wody.|Adj nekem vizet, kérlek.||Give me some water, please.
brać|pres|0|Zawsze ___ ze sobą wodę.|Mindig viszek magammal vizet.||I always take water with me.
wziąć|pp|0|___ parasol.|Elvittem az esernyőt.||I took the umbrella.
uczyć się|pres|0|___ na uniwersytecie.|Egyetemen tanulok.||I study at university.
zaczynać|pres|2|On ___ dzień od kawy.|Kávéval kezdi a napot.||He starts the day with coffee.
zacząć|pp|2|On ___ pracować o ósmej.|Nyolckor kezdett dolgozni.||He started working at eight.
pomagać|pres|0|___ mamie.|Segítek anyának.||I help Mum.
pomóc|cond|1|___ mi?|Segítenél nekem?||Would you help me?
dzwonić|pres|2|Telefon ___.|Cseng a telefon.||The phone is ringing.
zadzwonić|fut|0|___ do ciebie wieczorem.|Este felhívlak.||I'll call you tonight.
czekać|pres|0|___ na autobus.|A buszra várok.||I'm waiting for the bus.
otworzyć|impv|4|___ okno, proszę.|Nyissátok ki az ablakot, kérlek.||Open the window, please.
zamknąć|pp|2|Ona ___ drzwi.|Bezárta az ajtót.||She closed the door.|f
gotować|pres|2|Babcia ___ obiad.|A nagymama ebédet főz.||Grandma is cooking lunch.
grać|pres|1|___ na gitarze?|Gitározol?||Do you play the guitar?
śpiewać|pres|2|Moja siostra dobrze ___.|A húgom jól énekel.||My sister sings well.
tańczyć|pp|5|___ całą noc.|Egész éjjel táncoltak.||They danced all night.
przyjść|pp|5|Goście ___ o siódmej.|A vendégek hétkor jöttek meg.||The guests arrived at seven.
przychodzić|pres|2|On zawsze ___ na czas.|Mindig időben érkezik.||He always arrives on time.
zapomnieć|pp|0|___ kluczy.|Elfelejtettem a kulcsokat.||I forgot my keys.
pamiętać|pres|1|___ jego imię?|Emlékszel a nevére?||Do you remember his name?
wstawać|pres|0|___ o siódmej.|Hétkor kelek.||I get up at seven.
podróżować|cond|0|___ po całym świecie.|Beutaznám az egész világot.||I would travel all over the world.
płacić|pres|0|Dziś ja ___.|Ma én fizetek.||Today I'm paying.
chodzić|pres|1|Często ___ do teatru?|Gyakran jársz színházba?||Do you often go to the theatre?
jeździć|pp|3|Latem ___ nad morze.|Nyáron a tengerhez jártunk.||In summer we used to go to the seaside.
marzyć|pres|0|___ o psie.|Kutyáról álmodozom.||I dream of having a dog.
wrócić|fut|0|___ za godzinę.|Egy óra múlva visszajövök.||I'll be back in an hour.
zostać|pp|0|Wczoraj ___ w domu.|Tegnap otthon maradtam.||Yesterday I stayed at home.
pokazać|impv|1|___ mi zdjęcia!|Mutasd meg a fényképeket!||Show me the photos!
nazywać się|pres|0|___ Anna.|Annának hívnak.||My name is Anna.
ubierać się|pres|0|Rano ___ w pośpiechu.|Reggel sietve öltözöm fel.||In the morning I get dressed in a hurry.
spacerować|pp|3|Wczoraj ___ po parku.|Tegnap a parkban sétáltunk.||Yesterday we went for a walk in the park.
siedzieć|pres|2|Kot ___ na oknie.|A macska az ablakban ül.||The cat is sitting on the windowsill.
stać|pres|2|Samochód ___ przed domem.|Az autó a ház előtt áll.||The car is standing in front of the house.`;

const VBY = Object.fromEntries(VERBS.map(v => [v.inf, v]));
const SENTS = (IS_RU ? SENT_RAW_RU : SENT_RAW_PL).trim().split('\n').map(l => {
  const [inf, t, p, it, hu, pl, en, f] = l.split('|');
  return {inf, t, p: +p, it, hu, f: f === 'f', tr: {hu, pl: pl || en, en}};
}).filter(x => VBY[x.inf] && !cell(VBY[x.inf], x.t, x.p).na);
const SENT_BY = Object.fromEntries(SENTS.map(x => [x.inf, x]));
const capFirst = x => x ? x[0].toUpperCase() + x.slice(1) : x;
function sentFill(x){
  const c = cell(VBY[x.inf], x.t, x.p);
  const form = (x.f && c.accept.length > 1) ? c.accept[1] : c.accept[0];
  const [a, b] = x.it.split('___');
  const shown = a ? form : capFirst(form);
  return {form, accept: c.accept, irr: c.irr, before: a, after: b, shown, full: a + shown + b};
}
function setContentLang(l){
  VERBS.forEach(v => { v.hu = v.mean[l] || v.mean.hu; });
  SENTS.forEach(x => { x.hu = x.tr[l] || x.tr.hu; });
}
