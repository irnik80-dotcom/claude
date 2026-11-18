/* Presente – török ragozó motor. Ugyanazokat a neveket adja, mint a többi motor (VERBS, TENSES, cell, check, SENTS, …).
   Szabályalapú: magánhangzó-harmónia (2 és 4 alakú toldalékok), zöngésülés (git → gidiyor), d/t váltakozás (geldi / yaptı).
   Igeidők: şimdiki (-iyor), geniş (-r), görülen geçmiş (-di), öğrenilen geçmiş (-miş), gelecek (-ecek), dilek-şart (-se), emir. */
const TLANG = {code:'tr', bcp:'tr-TR', name:'Türkçe', ppLabel:null, keys:['ç','ğ','ı','İ','ö','ş','ü','â']};
const PERS = ['ben','sen','o','biz','siz','onlar'];
const REFL = ['','','','','',''];
const TENSES = [
  {id:'pres', it:'Şimdiki zaman', hu:'folyamatos jelen (-iyor)'},
  {id:'aor',  it:'Geniş zaman', hu:'általános jelen (-r)'},
  {id:'pp',   it:'Görülen geçmiş zaman', hu:'múlt idő (-di)'},
  {id:'mis',  it:'Öğrenilen geçmiş zaman', hu:'hallomásos múlt (-miş)'},
  {id:'fut',  it:'Gelecek zaman', hu:'jövő idő (-ecek)'},
  {id:'cond', it:'Dilek-şart kipi', hu:'feltételes mód (-se)'},
  {id:'impv', it:'Emir kipi', hu:'felszólító mód'}
];
const COMPOUND = {};
const SIMPLE = TENSES.map(x => x.id);
const PERS_IMPV = ['—','sen','o','—','siz','onlar'];
const personLabel = (t, i) => t === 'impv' ? PERS_IMPV[i] : PERS[i];
const isIrrT = (vb, t) => vb.irrT.includes(t);
const NO_IMPV = new Set();
const NA6 = () => ['—','—','—','—','—','—'];

/* igék: főnévi igenév|szint|jelzők|magyar|lengyel|angol
   jelzők (;-vel): soft=TŐ (magánhangzó előtti zöngés tő: git → gid), aorI / aorA (rendhagyó geniş zaman magánhangzó),
   pres=TŐ és fut=TŐ (rendhagyó tő: ye → yi-yor, yi-y-ecek), sizimp=ALAK, irr=rendhagyó igeidők */
const VERB_RAW_TR = `olmak|1|aorI;irr=aor|lenni, válni vmivé|być, stawać się|to be, to become
yapmak|1||csinálni|robić|to do, to make
etmek|2|soft=ed;irr=pres,aor,fut,impv|tenni, csinálni (összetételekben)|robić (w złożeniach)|to do (in compounds)
gitmek|1|soft=gid;irr=pres,aor,fut,impv|menni|iść, jechać|to go
gelmek|1|aorI;irr=aor|jönni|przychodzić|to come
konuşmak|1||beszélni|mówić, rozmawiać|to speak
bilmek|1|aorI;irr=aor|tudni (vmit), ismerni|wiedzieć, znać|to know
istemek|1||akarni|chcieć|to want
görmek|1|aorI;irr=aor|látni|widzieć|to see
bakmak|1||nézni (vmire)|patrzeć|to look
izlemek|1||nézni (tévét, filmet)|oglądać|to watch
dinlemek|1||hallgatni|słuchać|to listen
okumak|1||olvasni; tanulni (iskolában)|czytać; uczyć się|to read; to study
yazmak|1||írni|pisać|to write
yemek|1|pres=yi;fut=yiy;sizimp=yiyin;irr=pres,fut,impv|enni|jeść|to eat
içmek|1||inni|pić|to drink
uyumak|1||aludni|spać|to sleep
yaşamak|1||élni, lakni|żyć, mieszkać|to live
çalışmak|1||dolgozni; tanulni|pracować; uczyć się|to work; to study
anlamak|1||érteni|rozumieć|to understand
sevmek|1||szeretni|kochać, lubić|to love, to like
almak|1|aorI;irr=aor|venni, kapni|brać, kupować|to take, to buy
vermek|1|aorI;irr=aor|adni|dawać|to give
demek|1|pres=di;fut=diy;irr=pres,fut|mondani|mówić, powiedzieć|to say
söylemek|2||mondani, elmondani|powiedzieć|to tell, to say
sormak|2||kérdezni|pytać|to ask
cevap vermek|2|aorI;irr=aor|válaszolni|odpowiadać|to answer
başlamak|2||kezdeni, kezdődni|zaczynać|to begin
bitirmek|2||befejezni|kończyć|to finish
öğrenmek|1||tanulni, megtanulni|uczyć się|to learn
öğretmek|2||tanítani|uczyć (kogoś)|to teach
düşünmek|2||gondolni, gondolkodni|myśleć|to think
beklemek|1||várni|czekać|to wait
yardım etmek|2|soft=ed;irr=pres,aor,fut,impv|segíteni|pomagać|to help
aramak|2||keresni; felhívni|szukać; dzwonić|to look for; to call
bulmak|2|aorI;irr=aor|találni|znajdować|to find
açmak|2||kinyitni|otwierać|to open
kapatmak|2||bezárni, kikapcsolni|zamykać, wyłączać|to close, to switch off
kalmak|2|aorI;irr=aor|maradni|zostawać|to stay
oturmak|1||ülni; lakni|siedzieć; mieszkać|to sit; to live
kalkmak|2||felkelni; indulni (jármű)|wstawać; odjeżdżać|to get up; to depart
uyanmak|2||felébredni|budzić się|to wake up
yatmak|2||lefeküdni|kłaść się|to lie down, to go to bed
giymek|2||felvenni, viselni (ruhát)|zakładać, nosić|to put on, to wear
yıkamak|2||mosni|myć, prać|to wash
pişirmek|2||főzni, sütni|gotować|to cook
temizlemek|2||takarítani|sprzątać|to clean
ödemek|2||fizetni|płacić|to pay
satın almak|2|aorI;irr=aor|megvásárolni|kupować|to buy
satmak|2||eladni|sprzedawać|to sell
göstermek|2||megmutatni|pokazywać|to show
unutmak|2||elfelejteni|zapominać|to forget
hatırlamak|2||emlékezni|pamiętać|to remember
getirmek|2||hozni|przynosić|to bring
götürmek|3||elvinni|zabierać, zawozić|to take (somewhere)
gezmek|2||sétálni, nézelődni, utazgatni|zwiedzać, spacerować|to stroll, to travel around
yürümek|2||gyalogolni|chodzić pieszo|to walk
koşmak|2||futni|biegać|to run
yüzmek|2||úszni|pływać|to swim
binmek|2||felszállni (járműre)|wsiadać|to get on, to ride
inmek|2||leszállni|wysiadać, schodzić|to get off, to go down
girmek|2||belépni, bemenni|wchodzić|to enter
çıkmak|2||kimenni; felmenni|wychodzić|to go out, to go up
dönmek|2||visszatérni; fordulni|wracać; skręcać|to return; to turn
koymak|3||tenni, rakni|kłaść|to put
oynamak|1||játszani|grać, bawić się|to play
şarkı söylemek|2||énekelni|śpiewać|to sing
dans etmek|2|soft=ed;irr=pres,aor,fut,impv|táncolni|tańczyć|to dance
gülmek|2||nevetni|śmiać się|to laugh
ağlamak|3||sírni|płakać|to cry
tanımak|3||ismerni (vkit)|znać (kogoś)|to know (a person)
kazanmak|3||nyerni; keresni (pénzt)|wygrywać; zarabiać|to win; to earn
kaybetmek|3|soft=kaybed;aorA;irr=pres,aor,fut,impv|elveszíteni|tracić, gubić|to lose
seyahat etmek|3|soft=ed;irr=pres,aor,fut,impv|utazni|podróżować|to travel
durmak|2|aorI;irr=aor|megállni|zatrzymywać się|to stop
ölmek|3|aorI;irr=aor|meghalni|umierać|to die
sanmak|3|aorI;irr=aor|vélni, hinni|sądzić|to suppose
evlenmek|3||megházasodni|pobierać się|to get married
taşınmak|3||költözni|przeprowadzać się|to move (house)
hissetmek|3|soft=hissed;aorA;irr=pres,aor,fut,impv|érezni|czuć|to feel
affetmek|3|soft=affed;aorA;irr=pres,aor,fut,impv|megbocsátani|wybaczać|to forgive`;

/* ---- hangtan ---- */
const VOW = 'aıoueiöüâîû';
const FRONT = 'eiöüî';
const lastV = s => { for (let i = s.length - 1; i >= 0; i--) if (VOW.includes(s[i])) return s[i]; return 'e'; };
const h2 = v => FRONT.includes(v) ? 'e' : 'a';
const h4 = v => ({a:'ı', ı:'ı', â:'ı', o:'u', u:'u', û:'u', e:'i', i:'i', î:'i', ö:'ü', ü:'ü'})[v] || 'i';
const isV = c => VOW.includes(c);
const VOICELESS = 'fstkçşhp';
/* toldalék hozzáfűzése: A = a/e, I = ı/i/u/ü, D = d/t; a harmónia mindig az addigi szó utolsó magánhangzójához igazodik */
function add(base, tmpl){
  let s = base;
  for (const ch of tmpl){
    if (ch === 'A') s += h2(lastV(s));
    else if (ch === 'I') s += h4(lastV(s));
    else if (ch === 'D') s += VOICELESS.includes(s[s.length - 1]) ? 't' : 'd';
    else s += ch;
  }
  return s;
}
const END_A = ['Im','sIn','','Iz','sInIz','lAr'];   /* -iyor, -r, -miş, -ecek után */
const END_B = ['m','n','','k','nIz','lAr'];         /* -di és -se után */

function conjTr(o){
  const words = o.inf.split(' '), last = words.pop(), pre = words.length ? words.join(' ') + ' ' : '';
  const st = last.replace(/m[ae]k$/, ''), fl = o.fl;
  const soft = fl.soft || st, vst = isV(st[st.length - 1]);
  const P = arr => arr.map(x => pre + x);
  const F = {};
  /* şimdiki zaman: a tő végi magánhangzó kiesik (başla → başlıyor) */
  let pb;
  if (fl.pres) pb = fl.pres + 'yor';
  else if (vst){ const b = st.slice(0, -1); pb = b + h4(lastV(b)) + 'yor'; }
  else pb = add(soft, 'Iyor');
  F.pres = P(END_A.map(e => add(pb, e)));
  /* geniş zaman: egy szótagú mássalhangzós tő -Ar (13 kivétel: -Ir), többszótagú -Ir, magánhangzós tő -r */
  const syl = [...st].filter(isV).length;
  let ab;
  if (vst) ab = st + 'r';
  else ab = add(soft, (fl.aorI ? 'I' : fl.aorA ? 'A' : syl > 1 ? 'I' : 'A') + 'r');
  F.aor = P(END_A.map(e => add(ab, e)));
  F.pp = P(END_B.map(e => add(add(st, 'DI'), e)));
  F.mis = P(END_A.map(e => add(add(st, 'mIş'), e)));
  const fb = add(fl.fut || (vst ? st + 'y' : soft), 'AcA');
  F.fut = P([fb + 'ğ' + h4(lastV(fb)) + 'm', add(fb + 'k', 'sIn'), fb + 'k', fb + 'ğ' + h4(lastV(fb)) + 'z', add(fb + 'k', 'sInIz'), add(fb + 'k', 'lAr')]);
  F.cond = P(END_B.map(e => add(add(st, 'sA'), e)));
  const sz = fl.sizimp || add(vst ? st + 'y' : soft, 'In');
  F.impv = ['—', pre + st, pre + add(st, 'sIn'), '—', pre + sz + '/' + pre + add(sz, 'Iz'), pre + add(st, 'sInlAr')];
  return F;
}

const VERBS = [];
VERB_RAW_TR.trim().split('\n').forEach(l => {
  const [inf, lvl, flags, hu, pl, en] = l.split('|');
  const fl = {};
  (flags || '').split(';').filter(Boolean).forEach(x => { const k = x.indexOf('='); if (k < 0) fl[x] = true; else fl[x.slice(0, k)] = x.slice(k + 1); });
  const vb = {inf, lvl: +lvl, hu, mhu: hu, mean: {hu, pl: pl || en, en}, fl, refl: false};
  vb.F = conjTr(vb);
  vb.irrT = (fl.irr || '').split(',').filter(Boolean);
  vb.R = {};
  SIMPLE.forEach(t => { vb.R[t] = vb.F[t].map(x => x === '—' || !vb.irrT.includes(t) ? x : '#'); });
  vb.irr = vb.irrT.length > 0;
  vb.noT = [];
  vb.noImpv = false;
  VERBS.push(vb);
});
VERBS.sort((a, b) => a.inf.localeCompare(b.inf, 'tr'));
const VBY0 = Object.fromEntries(VERBS.map(v => [v.inf, v]));

function cell(vb, t, i){
  const raw = (vb.F[t] || [])[i];
  if (!raw || raw === '—') return {display:'—', accept:[], irr:false, na:true};
  const alts = raw.split('/');
  return {display: alts[0] + (alts.length > 1 ? ' (' + alts.slice(1).join(', ') + ')' : ''), accept: alts, irr: raw !== vb.R[t][i]};
}

const PRON_RE = /^(ben|sen|o|biz|siz|onlar)\s+/;
function norm(s){
  s = (s || '').toLocaleLowerCase('tr').normalize('NFC').trim().replace(/\s+/g, ' ').replace(/[.!?,]+$/, '');
  return s.replace(PRON_RE, '');
}
/* ékezet nélkül beírt válasz (ı → i, ş → s, ğ → g …) „majdnem jó” */
const deacc = s => s.replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '');
function check(input, accept){
  const n = norm(input);
  if (!n) return 'empty';
  if (accept.some(a => norm(a) === n)) return 'ok';
  if (accept.some(a => deacc(norm(a)) === deacc(n))) return 'acc';
  return 'bad';
}

/* példamondatok: ige|idő|személy|mondat ___ helyén az igével|magyar|lengyel|angol */
const SENT_RAW_TR = `olmak|fut|0|Ben doktor ___.|Orvos leszek.|Będę lekarzem.|I'll be a doctor.
yapmak|pres|1|Ne ___?|Mit csinálsz?|Co robisz?|What are you doing?
etmek|aor|0|Çok teşekkür ___.|Nagyon köszönöm.|Bardzo dziękuję.|Thank you very much.
gitmek|pres|0|Markete ___.|A boltba megyek.|Idę do sklepu.|I'm going to the shop.
gelmek|pp|5|Misafirler saat yedide ___.|A vendégek hétkor jöttek meg.|Goście przyszli o siódmej.|The guests arrived at seven.
konuşmak|aor|0|Biraz Türkçe ___.|Beszélek egy kicsit törökül.|Mówię trochę po turecku.|I speak a little Turkish.
bilmek|aor|5|Onlar bu şehri çok iyi ___.|Nagyon jól ismerik ezt a várost.|Bardzo dobrze znają to miasto.|They know this city very well.
istemek|pres|3|Çay içmek ___.|Teát akarunk inni.|Chcemy pić herbatę.|We want to drink tea.
görmek|pp|0|Onu dün ___.|Tegnap láttam őt.|Widziałem go wczoraj.|I saw him yesterday.
bakmak|impv|1|Şuna ___!|Nézd csak!|Popatrz na to!|Look at that!
izlemek|pres|5|Çocuklar televizyon ___.|A gyerekek tévét néznek.|Dzieci oglądają telewizję.|The children are watching TV.
dinlemek|impv|4|Beni dikkatle ___!|Figyeljetek rám jól!|Słuchajcie mnie uważnie!|Listen to me carefully!
okumak|pres|2|Annem kitap ___.|Anyám könyvet olvas.|Moja mama czyta książkę.|My mum is reading a book.
yazmak|fut|0|Sana yarın ___.|Holnap írok neked.|Napiszę do ciebie jutro.|I'll write to you tomorrow.
yemek|pres|3|Çorba ___.|Levest eszünk.|Jemy zupę.|We're eating soup.
içmek|aor|2|O her sabah kahve ___.|Minden reggel kávét iszik.|Pije kawę każdego ranka.|He drinks coffee every morning.
uyumak|pres|5|Çocuklar artık ___.|A gyerekek már alszanak.|Dzieci już śpią.|The children are already asleep.
yaşamak|pres|0|Macaristan'da ___.|Magyarországon élek.|Mieszkam na Węgrzech.|I live in Hungary.
çalışmak|pp|2|Babam bir bankada ___.|Apám egy bankban dolgozott.|Mój tata pracował w banku.|My father worked in a bank.
anlamak|pp|3|Her şeyi ___.|Mindent megértettünk.|Wszystko zrozumieliśmy.|We understood everything.
sevmek|aor|0|Müziği çok ___.|Nagyon szeretem a zenét.|Bardzo lubię muzykę.|I really like music.
almak|pp|0|Şemsiyemi ___.|Elvittem az esernyőmet.|Wziąłem parasol.|I took my umbrella.
vermek|impv|1|Bana biraz su ___, lütfen.|Adj egy kis vizet, kérlek.|Daj mi trochę wody, proszę.|Give me some water, please.
demek|pp|2|O sana ne ___?|Mit mondott neked?|Co ci powiedział?|What did he say to you?
söylemek|pp|2|Bana doğruyu ___.|Megmondta nekem az igazat.|Powiedział mi prawdę.|He told me the truth.
sormak|pp|0|Yolu bir yayaya ___.|Megkérdeztem az utat egy járókelőtől.|Zapytałem przechodnia o drogę.|I asked a passer-by for directions.
cevap vermek|fut|2|Yarın ___.|Holnap fog válaszolni.|Odpowie jutro.|He'll answer tomorrow.
başlamak|aor|2|Film saat sekizde ___.|A film nyolckor kezdődik.|Film zaczyna się o ósmej.|The film starts at eight.
bitirmek|pp|3|Ödevi ___.|Befejeztük a házi feladatot.|Skończyliśmy zadanie domowe.|We finished the homework.
öğrenmek|pres|0|Türkçe ___.|Törökül tanulok.|Uczę się tureckiego.|I'm learning Turkish.
öğretmek|aor|2|Annem okulda matematik ___.|Anyám matematikát tanít az iskolában.|Moja mama uczy matematyki w szkole.|My mum teaches maths at school.
düşünmek|pres|1|Ne ___?|Mire gondolsz?|O czym myślisz?|What are you thinking about?
beklemek|pres|0|Otobüsü ___.|A buszra várok.|Czekam na autobus.|I'm waiting for the bus.
yardım etmek|aor|0|Anneme ___.|Segítek anyámnak.|Pomagam mamie.|I help my mum.
aramak|fut|0|Seni akşam ___.|Este felhívlak.|Zadzwonię do ciebie wieczorem.|I'll call you tonight.
bulmak|pp|0|Kaybolan kitabı ___.|Megtaláltam az elveszett könyvet.|Znalazłem zgubioną książkę.|I found the lost book.
açmak|impv|4|Pencereyi ___, lütfen.|Nyissa ki az ablakot, kérem.|Proszę otworzyć okno.|Open the window, please.
kapatmak|pp|2|Kapıyı ___.|Bezárta az ajtót.|Zamknęła drzwi.|She closed the door.
kalmak|pp|0|Dün evde ___.|Tegnap otthon maradtam.|Wczoraj zostałem w domu.|Yesterday I stayed at home.
oturmak|pres|2|Kedi pencerenin önünde ___.|A macska az ablak előtt ül.|Kot siedzi przed oknem.|The cat is sitting in front of the window.
kalkmak|aor|0|Her sabah saat yedide ___.|Minden reggel hétkor kelek.|Codziennie wstaję o siódmej.|I get up at seven every morning.
uyanmak|pp|1|Saat kaçta ___?|Hánykor ébredtél?|O której się obudziłeś?|What time did you wake up?
yatmak|aor|3|Genellikle saat on birde ___.|Általában tizenegykor fekszünk le.|Zwykle kładziemy się o jedenastej.|We usually go to bed at eleven.
giymek|pres|2|Bugün yeni ceketini ___.|Ma az új kabátját viseli.|Dziś ma na sobie nową kurtkę.|Today he's wearing his new jacket.
yıkamak|pres|0|Ellerimi ___.|Kezet mosok.|Myję ręce.|I'm washing my hands.
pişirmek|pres|2|Büyükannem yemek ___.|A nagymamám főz.|Babcia gotuje obiad.|Grandma is cooking.
temizlemek|fut|3|Yarın evi ___.|Holnap kitakarítjuk a házat.|Jutro posprzątamy dom.|Tomorrow we'll clean the house.
ödemek|aor|0|Bugün ben ___.|Ma én fizetek.|Dziś ja płacę.|Today I'm paying.
satın almak|pp|3|Yeni bir araba ___.|Új autót vettünk.|Kupiliśmy nowy samochód.|We bought a new car.
satmak|fut|5|Evlerini ___.|Eladják a házukat.|Sprzedadzą swój dom.|They're going to sell their house.
göstermek|impv|1|Bana fotoğrafları ___!|Mutasd meg a fényképeket!|Pokaż mi zdjęcia!|Show me the photos!
unutmak|pp|0|Anahtarlarımı evde ___.|Otthon felejtettem a kulcsaimat.|Zostawiłem klucze w domu.|I left my keys at home.
hatırlamak|pres|0|Onun adını ___.|Emlékszem a nevére.|Pamiętam jego imię.|I remember his name.
getirmek|impv|1|Bana bir bardak su ___!|Hozz nekem egy pohár vizet!|Przynieś mi szklankę wody!|Bring me a glass of water!
götürmek|fut|0|Çocukları okula ben ___.|Én viszem a gyerekeket az iskolába.|Ja zawiozę dzieci do szkoły.|I'll take the children to school.
gezmek|pp|3|Dün parkta ___.|Tegnap a parkban sétáltunk.|Wczoraj spacerowaliśmy po parku.|Yesterday we walked around the park.
yürümek|aor|0|Her akşam parkta ___.|Minden este sétálok a parkban.|Co wieczór spaceruję po parku.|I walk in the park every evening.
koşmak|pres|5|Çocuklar bahçede ___.|A gyerekek a kertben futkároznak.|Dzieci biegają po ogrodzie.|The children are running in the garden.
yüzmek|mis|2|Dün denizde ___.|Állítólag tegnap a tengerben úszott.|Podobno wczoraj pływał w morzu.|Apparently he swam in the sea yesterday.
binmek|pp|3|Trene ___.|Felszálltunk a vonatra.|Wsiedliśmy do pociągu.|We got on the train.
inmek|impv|4|Bir sonraki durakta ___.|A következő megállóban szálljanak le.|Proszę wysiąść na następnym przystanku.|Get off at the next stop.
girmek|impv|1|___, kapı açık!|Gyere be, nyitva az ajtó!|Wejdź, drzwi są otwarte!|Come in, the door is open!
çıkmak|pp|2|Az önce dışarı ___.|Épp most ment ki.|Właśnie wyszedł.|He has just gone out.
dönmek|fut|0|Bir saat sonra ___.|Egy óra múlva visszajövök.|Wrócę za godzinę.|I'll be back in an hour.
koymak|pp|1|Anahtarları nereye ___?|Hova tetted a kulcsokat?|Gdzie położyłeś klucze?|Where did you put the keys?
oynamak|pres|5|Çocuklar parkta ___.|A gyerekek a parkban játszanak.|Dzieci bawią się w parku.|The children are playing in the park.
şarkı söylemek|aor|2|Kız kardeşim çok güzel ___.|A húgom nagyon szépen énekel.|Moja siostra bardzo ładnie śpiewa.|My sister sings very well.
dans etmek|pp|5|Bütün gece ___.|Egész éjjel táncoltak.|Tańczyli całą noc.|They danced all night.
gülmek|pres|2|Neden ___?|Miért nevet?|Dlaczego się śmieje?|Why is he laughing?
ağlamak|pres|2|Bebek ___.|Sír a baba.|Dziecko płacze.|The baby is crying.
tanımak|aor|0|Onu çok iyi ___.|Nagyon jól ismerem őt.|Znam go bardzo dobrze.|I know him very well.
kazanmak|pp|3|Maçı ___!|Megnyertük a meccset!|Wygraliśmy mecz!|We won the match!
kaybetmek|pp|0|Cüzdanımı ___.|Elvesztettem a pénztárcámat.|Zgubiłem portfel.|I lost my wallet.
seyahat etmek|cond|3|Keşke daha çok ___!|Bárcsak többet utaznánk!|Gdybyśmy tylko więcej podróżowali!|If only we travelled more!
durmak|impv|1|___! Kırmızı ışık yanıyor.|Állj meg! Piros a lámpa.|Stój! Jest czerwone światło.|Stop! The light is red.
ölmek|pp|2|Dedesi geçen yıl ___.|A nagyapja tavaly halt meg.|Jego dziadek zmarł w zeszłym roku.|His grandfather died last year.
sanmak|aor|0|Yarın yağmur yağacak ___.|Azt hiszem, holnap esni fog.|Sądzę, że jutro będzie padać.|I think it will rain tomorrow.
evlenmek|mis|5|Duydun mu? Ayşe ile Mehmet ___!|Hallottad? Ayşe és Mehmet összeházasodtak!|Słyszałeś? Ayşe i Mehmet się pobrali!|Did you hear? Ayşe and Mehmet got married!
taşınmak|fut|3|Gelecek ay yeni bir eve ___.|Jövő hónapban új házba költözünk.|W przyszłym miesiącu przeprowadzimy się do nowego domu.|Next month we'll move to a new house.
hissetmek|pres|0|Kendimi iyi ___.|Jól érzem magam.|Czuję się dobrze.|I feel good.
affetmek|impv|1|Beni ___!|Bocsáss meg!|Wybacz mi!|Forgive me!`;

const VBY = Object.fromEntries(VERBS.map(v => [v.inf, v]));
const SENTS = SENT_RAW_TR.trim().split('\n').map(l => {
  const [inf, t, p, it, hu, pl, en] = l.split('|');
  return {inf, t, p: +p, it, hu, tr: {hu, pl: pl || en, en}};
}).filter(x => VBY[x.inf] && !cell(VBY[x.inf], x.t, x.p).na);
const SENT_BY = Object.fromEntries(SENTS.map(x => [x.inf, x]));
const capFirst = x => x ? x[0].toLocaleUpperCase('tr') + x.slice(1) : x;
function sentFill(x){
  const c = cell(VBY[x.inf], x.t, x.p);
  const form = c.accept[0];
  const [a, b] = x.it.split('___');
  const shown = a ? form : capFirst(form);
  return {form, accept: c.accept, irr: c.irr, before: a, after: b, shown, full: a + shown + b};
}
function setContentLang(l){
  VERBS.forEach(v => { v.hu = v.mean[l] || v.mean.hu; });
  SENTS.forEach(x => { x.hu = x.tr[l] || x.tr.hu; });
}
