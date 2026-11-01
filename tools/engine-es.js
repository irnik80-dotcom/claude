/* Coniuga – spanyol ragozó motor. Ugyanazokat a neveket adja, mint az olasz motor (VERBS, TENSES, cell, check, SENTS, …),
   így a felület mindkét nyelvvel működik. A coniuga.html-be a tools/embed-engine.mjs másolja. */
const TLANG = {code:'es', bcp:'es-ES', name:'Español', ppLabel:'Participio', keys:['á','é','í','ó','ú','ü','ñ','¿','¡']};
const PERS = ['yo','tú','él/ella','nosotros','vosotros','ellos'];
const REFL = ['me','te','se','nos','os','se'];
const TENSES = [
  {id:'pres',  it:'Presente', hu:'jelen idő'},
  {id:'pp',    it:'Pretérito perfecto', hu:'összetett múlt'},
  {id:'imp',   it:'Pretérito imperfecto', hu:'folyamatos múlt'},
  {id:'trp',   it:'Pretérito pluscuamperfecto', hu:'régmúlt'},
  {id:'rem',   it:'Pretérito indefinido', hu:'egyszerű múlt'},
  {id:'trr',   it:'Pretérito anterior', hu:'régmúlt (irodalmi)'},
  {id:'fut',   it:'Futuro simple', hu:'jövő idő'},
  {id:'futa',  it:'Futuro compuesto', hu:'befejezett jövő'},
  {id:'cond',  it:'Condicional simple', hu:'feltételes mód'},
  {id:'condp', it:'Condicional compuesto', hu:'múlt idejű feltételes mód'},
  {id:'cong',  it:'Presente de subjuntivo', hu:'kötőmód, jelen'},
  {id:'congp', it:'Pretérito perfecto de subjuntivo', hu:'kötőmód, múlt'},
  {id:'congi', it:'Pretérito imperfecto de subjuntivo', hu:'kötőmód, folyamatos múlt'},
  {id:'congt', it:'Pretérito pluscuamperfecto de subjuntivo', hu:'kötőmód, régmúlt'},
  {id:'impv',  it:'Imperativo', hu:'felszólító mód'}
];
const COMPOUND = {pp:'pres', trp:'imp', trr:'rem', futa:'fut', condp:'cond', congp:'cong', congt:'congi'};
const SIMPLE = ['pres','imp','rem','fut','cond','cong','congi','impv'];
const PERS_IMPV = ['—','tú','usted','nosotros','vosotros','ustedes'];
const personLabel = (t, i) => t === 'impv' ? PERS_IMPV[i] : PERS[i];
const isIrrT = (vb, t) => COMPOUND[t] ? vb.irrT.includes('pp') : vb.irrT.includes(t);
const NO_IMPV = new Set(['poder','deber','soler','haber']);

/* hangsúly: ékezet a hangsúlyos magánhangzóra, ha simulószó kerül a végére (lávate, levantémonos) */
const VOW = 'aeiouáéíóúü';
function stressIndex(w){
  if (/[áéíóú]/.test(w)) return -1;
  const s = w.replace(/([qg])u([eiéí])/g, '$1#$2');
  const groups = []; let m; const re = /[aeiouü]+/g;
  while ((m = re.exec(s))) groups.push([m.index, m[0]]);
  if (!groups.length) return -1;
  const g = /[aeiouns]$/.test(s) && groups.length > 1 ? groups[groups.length - 2] : groups[groups.length - 1];
  const strong = g[1].search(/[aeo]/);
  return g[0] + (strong >= 0 ? strong : g[1].length - 1);
}
const ACUTE = {a:'á', e:'é', i:'í', o:'ó', u:'ú'};
function encl(base, add, drop){
  const w = drop ? base.slice(0, -drop) : base;
  const idx = stressIndex(base);
  let out = w + add;
  if (idx >= 0 && idx < w.length){
    const s = out.replace(/([qg])u([eiéí])/g, '$1#$2');
    const after = (s.slice(idx + 1).match(/[aeiouáéíóúü]+/g) || []).length;
    const tail = s.slice(idx + 1).match(/^[aeiou]*/)[0].length;   // a hangsúlyos csoport maradéka
    const sylAfter = after - (tail ? 1 : 0);
    if (sylAfter >= 2) out = out.slice(0, idx) + ACUTE[out[idx]] + out.slice(idx + 1);
  }
  return out;
}

const ENDS = {
  ar:{pres:['o','as','a','amos','áis','an'], subj:['e','es','e','emos','éis','en'], imp:['aba','abas','aba','ábamos','abais','aban'], pret:['é','aste','ó','amos','asteis','aron'], pp:'ado'},
  er:{pres:['o','es','e','emos','éis','en'], subj:['a','as','a','amos','áis','an'], imp:['ía','ías','ía','íamos','íais','ían'], pret:['í','iste','ió','imos','isteis','ieron'], pp:'ido'},
  ir:{pres:['o','es','e','imos','ís','en'], subj:['a','as','a','amos','áis','an'], imp:['ía','ías','ía','íamos','íais','ían'], pret:['í','iste','ió','imos','isteis','ieron'], pp:'ido'}
};
const FUT_E = ['é','ás','á','emos','éis','án'], COND_E = ['ía','ías','ía','íamos','íais','ían'];
const STRONG_E = ['e','iste','o','imos','isteis','ieron'];

/* adatok: ige|szint|jelzők|magyar|lengyel|angol
   jelzők: ie, ue, i (tőhangváltás), uue (jugar), acc (envío), zc (conozco), yo=…, pret=… (erős múlt tő), fut=…, pp=…, tu=… (felszólító tú), full (teljes táblázat lent) */
const VERB_RAW_ES = `ser|1|full|lenni (vmi, vmilyen)|być|to be
estar|1|full|lenni (vhol, vmilyen állapotban)|być (stan, miejsce)|to be (state, location)
haber|1|full|(segédige); van (hay)|(czasownik posiłkowy); jest (hay)|(auxiliary); there is (hay)
tener|1|ie yo=tengo pret=tuv fut=tendr tu=ten|bírni, van neki|mieć|to have
hacer|1|yo=hago pret=hic fut=har pp=hecho tu=haz|csinálni|robić|to do, to make
ir|1|full|menni|iść, jechać|to go
poder|1|ue pret=pud fut=podr|tudni (képes), -hat/-het|móc|can, to be able to
decir|1|i yo=digo pret=dij fut=dir pp=dicho tu=di|mondani|mówić, powiedzieć|to say, to tell
ver|1|full|látni|widzieć|to see
dar|1|full|adni|dawać|to give
saber|1|full|tudni (vmit)|wiedzieć, umieć|to know
querer|1|ie pret=quis fut=querr|akarni; szeretni|chcieć; kochać|to want; to love
llegar|1||megérkezni|przybyć|to arrive
pasar|1||történni; eltölteni; átmenni|dziać się; spędzać; przechodzić|to happen; to spend; to pass
deber|1||kell (vminek); tartozni|musieć, powinien; być winnym|must, should; to owe
poner|1|yo=pongo pret=pus fut=pondr pp=puesto tu=pon|tenni, rakni|kłaść, stawiać|to put
parecer|1|zc|tűnni vminek|wydawać się|to seem
quedar|1||maradni; találkozni|zostać; umówić się|to stay; to meet up
creer|1||hinni|wierzyć, sądzić|to believe
hablar|1||beszélni|mówić|to speak
llevar|1||vinni; viselni|nieść, nosić|to carry; to wear
dejar|1||hagyni|zostawić; pozwolić|to leave; to let
seguir|1|i|követni; folytatni|iść za; kontynuować|to follow; to continue
encontrar|1|ue|találni|znaleźć|to find
llamar|1||hívni|wołać, dzwonić|to call
venir|1|ie yo=vengo pret=vin fut=vendr tu=ven|jönni|przychodzić|to come
pensar|1|ie|gondolni|myśleć|to think
salir|1|yo=salgo fut=saldr tu=sal|kimenni, elindulni|wychodzić, odjeżdżać|to go out, to leave
volver|1|ue pp=vuelto|visszatérni|wracać|to return
tomar|1||venni; inni|brać; pić|to take; to drink
conocer|1|zc|ismerni|znać|to know (be acquainted with)
vivir|1||élni, lakni|żyć, mieszkać|to live
sentir|1|ie|érezni; sajnálni|czuć; żałować|to feel; to be sorry
mirar|1||nézni|patrzeć|to look at
contar|1|ue|számolni; elmesélni|liczyć; opowiadać|to count; to tell
empezar|1|ie|kezdeni|zaczynać|to begin
esperar|1||várni; remélni|czekać; mieć nadzieję|to wait; to hope
buscar|1||keresni|szukać|to look for
entrar|1||belépni|wchodzić|to enter
trabajar|1||dolgozni|pracować|to work
escribir|1|pp=escrito|írni|pisać|to write
perder|1|ie|elveszíteni; lekésni|tracić, gubić; spóźnić się|to lose; to miss
entender|1|ie|érteni|rozumieć|to understand
pedir|1|i|kérni; rendelni|prosić; zamawiać|to ask for; to order
recibir|1||kapni|otrzymywać|to receive
recordar|1|ue|emlékezni|pamiętać|to remember
terminar|1||befejezni|kończyć|to finish
abrir|1|pp=abierto|kinyitni|otwierać|to open
leer|1||olvasni|czytać|to read
caer|2|yo=caigo|esni|spadać|to fall
cambiar|1||változtatni, változni|zmieniać|to change
oír|1|full|hallani|słyszeć|to hear
acabar|2||befejezni|kończyć|to finish
ganar|1||nyerni; keresni (pénzt)|wygrywać; zarabiać|to win; to earn
traer|1|yo=traigo pret=traj|hozni|przynosić|to bring
morir|2|ue pp=muerto|meghalni|umierać|to die
comprender|1||megérteni|rozumieć|to understand
explicar|1||elmagyarázni|wyjaśniać|to explain
preguntar|1||kérdezni|pytać|to ask
tocar|1||megérinteni; játszani (hangszeren)|dotykać; grać (na instrumencie)|to touch; to play (an instrument)
estudiar|1||tanulni|uczyć się, studiować|to study
nacer|2|zc|születni|rodzić się|to be born
correr|1||futni|biegać|to run
pagar|1||fizetni|płacić|to pay
ayudar|1||segíteni|pomagać|to help
gustar|1||tetszeni|podobać się|to like (to please)
jugar|1|uue|játszani|grać, bawić się|to play
escuchar|1||hallgatni|słuchać|to listen
intentar|1||megpróbálni|próbować|to try
usar|1||használni|używać|to use
decidir|1||eldönteni|decydować|to decide
olvidar|1||elfelejteni|zapominać|to forget
comer|1||enni|jeść|to eat
mostrar|1|ue|megmutatni|pokazywać|to show
mover|2|ue|mozgatni|ruszać|to move
continuar|2|acc|folytatni, folytatódni|kontynuować|to continue
aprender|1||tanulni (megtanulni)|uczyć się|to learn
comprar|1||venni, vásárolni|kupować|to buy
subir|1||felmenni|wchodzić (w górę)|to go up
bajar|1||lemenni; lehalkítani|schodzić; ściszać|to go down; to lower
cerrar|1|ie|bezárni|zamykać|to close
responder|1||válaszolni|odpowiadać|to answer
enseñar|1||tanítani; megmutatni|uczyć; pokazywać|to teach; to show
vender|1||eladni, árulni|sprzedawać|to sell
beber|1||inni|pić|to drink
viajar|1||utazni|podróżować|to travel
dormir|1|ue|aludni|spać|to sleep
cocinar|1||főzni|gotować|to cook
limpiar|1||takarítani|sprzątać|to clean
bailar|1||táncolni|tańczyć|to dance
cantar|1||énekelni|śpiewać|to sing
nadar|1||úszni|pływać|to swim
preparar|1||elkészíteni|przygotowywać|to prepare
necesitar|1||szüksége van vmire|potrzebować|to need
desayunar|1||reggelizni|jeść śniadanie|to have breakfast
cenar|1||vacsorázni|jeść kolację|to have dinner
visitar|1||meglátogatni|odwiedzać|to visit
caminar|1||gyalogolni, sétálni|chodzić, spacerować|to walk
lavar|1||mosni|myć, prać|to wash
despertarse|1|ie|felébredni|budzić się|to wake up
levantarse|1||felkelni|wstawać|to get up
acostarse|1|ue|lefeküdni|kłaść się spać|to go to bed
ducharse|1||zuhanyozni|brać prysznic|to take a shower
vestirse|1|i|felöltözni|ubierać się|to get dressed
llamarse|1||hívják vhogy|nazywać się|to be called
sentarse|1|ie|leülni|siadać|to sit down
irse|1|full|elmenni|odchodzić, wyjeżdżać|to leave, to go away
lavarse|1||megmosakodni|myć się|to wash (oneself)
almorzar|2|ue|ebédelni|jeść obiad|to have lunch
llover|2|ue|esni (eső)|padać (deszcz)|to rain
nevar|2|ie|havazni|padać (śnieg)|to snow
divertirse|2|ie|szórakozni|bawić się|to have fun
ponerse|2|yo=pongo pret=pus fut=pondr pp=puesto tu=pon|felvenni (ruhát); válni vmilyenné|zakładać; stawać się|to put on; to become
sentirse|2|ie|érezni magát|czuć się|to feel
quedarse|2||maradni|zostawać|to stay
acordarse|2|ue|emlékezni|pamiętać|to remember
encontrarse|2|ue|találkozni; érezni magát|spotykać się; czuć się|to meet; to feel
despedirse|2|i|elbúcsúzni|żegnać się|to say goodbye
casarse|2||összeházasodni|brać ślub|to get married
cansarse|2||elfáradni|męczyć się|to get tired
enfadarse|2||megharagudni|złościć się|to get angry
enamorarse|2||beleszeretni|zakochać się|to fall in love
equivocarse|2||tévedni|mylić się|to be wrong
preocuparse|2||aggódni|martwić się|to worry
quejarse|2||panaszkodni|narzekać|to complain
peinarse|2||megfésülködni|czesać się|to comb one's hair
reírse|2|full|nevetni|śmiać się|to laugh
mantener|2|ie yo=mantengo pret=mantuv fut=mantendr tu=mantén|fenntartani|utrzymywać|to maintain
obtener|2|ie yo=obtengo pret=obtuv fut=obtendr tu=obtén|megszerezni|uzyskać|to obtain
proponer|2|yo=propongo pret=propus fut=propondr pp=propuesto tu=propón|javasolni|proponować|to propose
suponer|2|yo=supongo pret=supus fut=supondr pp=supuesto tu=supón|feltételezni|przypuszczać|to suppose
producir|2|zc pret=produj|termelni|produkować|to produce
traducir|2|zc pret=traduj|fordítani|tłumaczyć|to translate
conducir|2|zc pret=conduj|vezetni (autót)|prowadzić (samochód)|to drive
ofrecer|2|zc|felajánlani|oferować|to offer
reconocer|2|zc|felismerni; elismerni|rozpoznać; przyznać|to recognize; to admit
aparecer|2|zc|megjelenni|pojawiać się|to appear
desaparecer|2|zc|eltűnni|znikać|to disappear
agradecer|2|zc|megköszönni|dziękować|to thank
crecer|2|zc|nőni|rosnąć|to grow
construir|2||építeni|budować|to build
destruir|2||lerombolni|niszczyć|to destroy
incluir|2||belefoglalni|zawierać, włączać|to include
elegir|2|i|választani|wybierać|to choose
corregir|2|i|kijavítani|poprawiać|to correct
dirigir|2||irányítani|kierować|to direct
escoger|2||kiválasztani|wybierać|to choose
recoger|2||összeszedni; elhozni vkit|zbierać; odbierać|to pick up
coger|2||fogni; elkapni|brać, łapać|to take, to catch
convencer|2||meggyőzni|przekonywać|to convince
conseguir|2|i|elérni, megszerezni|osiągnąć, zdobyć|to get, to achieve
servir|2|i|szolgálni; felszolgálni|służyć; podawać|to serve
repetir|2|i|megismételni|powtarzać|to repeat
sonreír|2|full|mosolyogni|uśmiechać się|to smile
preferir|2|ie|jobban szeretni|woleć|to prefer
convertir|2|ie|átalakítani|przekształcać|to convert
mentir|2|ie|hazudni|kłamać|to lie
encender|2|ie|bekapcsolni; meggyújtani|włączać; zapalać|to switch on; to light
comenzar|2|ie|kezdeni|zaczynać|to begin
recomendar|2|ie|ajánlani|polecać|to recommend
probar|2|ue|kipróbálni; megkóstolni|próbować|to try; to taste
soñar|2|ue|álmodni|śnić, marzyć|to dream
volar|2|ue|repülni|latać|to fly
costar|2|ue|kerülni (vmibe)|kosztować|to cost
devolver|2|ue pp=devuelto|visszaadni|zwracać|to give back
doler|2|ue|fájni|boleć|to hurt
enviar|2|acc|küldeni|wysyłać|to send
andar|2|pret=anduv|járni, sétálni|chodzić|to walk
descubrir|2|pp=descubierto|felfedezni|odkrywać|to discover
romper|2|pp=roto|eltörni, tönkretenni|łamać, tłuc|to break
describir|2|pp=descrito|leírni|opisywać|to describe
aceptar|2||elfogadni|akceptować|to accept
alquilar|2||bérelni|wynajmować|to rent
amar|2||szeretni|kochać|to love
apagar|2||kikapcsolni|wyłączać, gasić|to switch off
arreglar|2||megjavítani|naprawiać|to fix
besar|2||megcsókolni|całować|to kiss
celebrar|2||ünnepelni|świętować|to celebrate
charlar|2||beszélgetni|gawędzić|to chat
compartir|2||megosztani|dzielić się|to share
contestar|2||válaszolni|odpowiadać|to answer
cortar|2||vágni|ciąć|to cut
crear|2||alkotni|tworzyć|to create
cruzar|2||átkelni|przechodzić (przez)|to cross
cuidar|2||gondoskodni|opiekować się|to take care of
cumplir|2||teljesíteni; betölteni (kort)|spełniać; kończyć (lat)|to fulfil; to turn (age)
descansar|2||pihenni|odpoczywać|to rest
dibujar|2||rajzolni|rysować|to draw
discutir|2||vitatkozni|kłócić się, dyskutować|to argue
disfrutar|2||élvezni|cieszyć się|to enjoy
existir|2||létezni|istnieć|to exist
faltar|2||hiányozni|brakować|to be missing
fumar|2||dohányozni|palić|to smoke
funcionar|2||működni|działać|to work, to function
gastar|2||költeni|wydawać|to spend
gritar|2||kiabálni|krzyczeć|to shout
guardar|2||megőrizni, eltenni|przechowywać|to keep
importar|2||számítani; importálni|mieć znaczenie; importować|to matter; to import
invitar|2||meghívni|zapraszać|to invite
llorar|2||sírni|płakać|to cry
meter|2||betenni|wkładać|to put in
ocurrir|2||történni|zdarzać się|to happen
organizar|2||szervezni|organizować|to organize
parar|2||megállni|zatrzymywać się|to stop
pasear|2||sétálni|spacerować|to stroll
permitir|2||megengedni|pozwalać|to allow
pintar|2||festeni|malować|to paint
practicar|2||gyakorolni|ćwiczyć|to practise
presentar|2||bemutatni|przedstawiać|to present, to introduce
prestar|2||kölcsönadni|pożyczać|to lend
prometer|2||megígérni|obiecywać|to promise
quitar|2||elvenni, levenni|zabierać, zdejmować|to take away
regalar|2||ajándékozni|dawać w prezencie|to give (as a gift)
regresar|2||visszatérni|wracać|to return
reservar|2||lefoglalni|rezerwować|to book
sacar|2||kivenni; megvenni (jegyet)|wyjmować; kupić (bilet)|to take out; to get (tickets)
saludar|2||üdvözölni|witać|to greet
sufrir|2||szenvedni|cierpieć|to suffer
tirar|2||dobni; kidobni|rzucać; wyrzucać|to throw; to throw away
tratar|2||bánni vkivel; próbálni|traktować; próbować|to treat; to try
abrazar|2||megölelni|przytulać|to hug
contener|3|ie yo=contengo pret=contuv fut=contendr tu=contén|tartalmazni|zawierać|to contain
detener|3|ie yo=detengo pret=detuv fut=detendr tu=detén|megállítani; letartóztatni|zatrzymać; aresztować|to stop; to arrest
componer|3|yo=compongo pret=compus fut=compondr pp=compuesto tu=compón|komponálni, összeállítani|komponować|to compose
deshacer|3|yo=deshago pret=deshic fut=deshar pp=deshecho tu=deshaz|szétszedni; kicsomagolni|rozpakować; zniszczyć|to undo; to unpack
satisfacer|3|yo=satisfago pret=satisfic fut=satisfar pp=satisfecho tu=satisfaz|kielégíteni|zadowalać|to satisfy
convenir|3|ie yo=convengo pret=convin fut=convendr tu=convén|megfelelni; megegyezni|odpowiadać; uzgodnić|to suit; to agree
reducir|3|zc pret=reduj|csökkenteni|zmniejszać|to reduce
introducir|3|zc pret=introduj|bevezetni|wprowadzać|to introduce
merecer|3|zc|megérdemelni|zasługiwać|to deserve
obedecer|3|zc|engedelmeskedni|słuchać (być posłusznym)|to obey
pertenecer|3|zc|tartozni vhová|należeć|to belong
establecer|3|zc|létrehozni, megállapítani|ustanawiać|to establish
huir|3||elmenekülni|uciekać|to flee
contribuir|3||hozzájárulni|przyczyniać się|to contribute
distribuir|3||szétosztani|rozdzielać|to distribute
concluir|3||befejezni; következtetni|kończyć; wnioskować|to conclude
sustituir|3||helyettesíteni|zastępować|to replace
poseer|3||birtokolni|posiadać|to possess
exigir|3||követelni|wymagać|to demand
proteger|3||védeni|chronić|to protect
vencer|3||legyőzni|pokonać|to defeat
perseguir|3|i|üldözni|ścigać|to chase
distinguir|3||megkülönböztetni|rozróżniać|to distinguish
medir|3|i|mérni|mierzyć|to measure
sugerir|3|ie|javasolni|sugerować|to suggest
advertir|3|ie|figyelmeztetni|ostrzegać|to warn
defender|3|ie|védeni|bronić|to defend
negar|3|ie|tagadni|zaprzeczać|to deny
calentar|3|ie|melegíteni|podgrzewać|to heat
atravesar|3|ie|átkelni|przechodzić przez|to cross
resolver|3|ue pp=resuelto|megoldani|rozwiązywać|to solve
envolver|3|ue pp=envuelto|becsomagolni|owijać|to wrap
soler|3|ue|szokott (vmit tenni)|mieć zwyczaj|to usually (do)
demostrar|3|ue|bebizonyítani|udowadniać|to demonstrate
colgar|3|ue|felakasztani; letenni (telefont)|wieszać; rozłączyć się|to hang (up)
rogar|3|ue|kérni, könyörögni|prosić, błagać|to beg
aprobar|3|ue|jóváhagyni; átmenni (vizsgán)|zatwierdzać; zdać|to approve; to pass (an exam)
morder|3|ue|harapni|gryźć|to bite
oler|3|full|szagolni; illatozni|pachnieć; wąchać|to smell
confiar|3|acc|megbízni|ufać|to trust
esquiar|3|acc|síelni|jeździć na nartach|to ski
actuar|3|acc|cselekedni; szerepelni|działać; grać|to act
graduarse|3|acc|diplomát szerezni|ukończyć studia|to graduate
reunirse|3|acc|összegyűlni|spotykać się, zbierać się|to meet, to gather
caber|3|full|beleférni|mieścić się|to fit
valer|3|yo=valgo fut=valdr|érni (vmennyit)|być wartym|to be worth
cubrir|3|pp=cubierto|befedni|przykrywać|to cover
imprimir|3|pp=impreso/imprimido|nyomtatni|drukować|to print
anunciar|3||bejelenteni|ogłaszać|to announce
borrar|3||törölni|kasować|to erase
cobrar|3||beszedni (pénzt)|pobierać opłatę|to charge
desarrollar|3||fejleszteni|rozwijać|to develop
echar|3||dobni; kidobni|rzucać; wyrzucać|to throw
empujar|3||tolni|pchać|to push
engañar|3||becsapni|oszukiwać|to deceive
escapar|3||megszökni|uciekać|to escape
esconder|3||elrejteni|chować|to hide
firmar|3||aláírni|podpisywać|to sign
llenar|3||megtölteni|napełniać|to fill
lograr|3||elérni|osiągnąć|to achieve
luchar|3||harcolni|walczyć|to fight
manejar|3||kezelni; vezetni|obsługiwać; prowadzić|to handle; to drive
matar|3||megölni|zabijać|to kill
molestar|3||zavarni|przeszkadzać|to bother
notar|3||észrevenni|zauważać|to notice
odiar|3||gyűlölni|nienawidzić|to hate
participar|3||részt venni|uczestniczyć|to take part
pegar|3||ragasztani; megütni|kleić; bić|to stick; to hit
planchar|3||vasalni|prasować|to iron
respirar|3||lélegezni|oddychać|to breathe
robar|3||lopni|kraść|to steal
secar|3||szárítani|suszyć|to dry
utilizar|3||használni|wykorzystywać|to use
votar|3||szavazni|głosować|to vote
alcanzar|3||elérni|osiągać|to reach
aparcar|3||parkolni|parkować|to park
colocar|3||elhelyezni|umieszczać|to place
dedicar|3||szentelni|poświęcać|to dedicate
indicar|3||jelezni|wskazywać|to indicate
publicar|3||kiadni|publikować|to publish
acercarse|3||közeledni|zbliżać się|to approach
navegar|3||hajózni; böngészni|żeglować; surfować|to sail; to browse
entregar|3||átadni|doręczać|to deliver
obligar|3||kényszeríteni|zmuszać|to force
cargar|3||tölteni; rakodni|ładować|to load, to charge`;

const FULL = {
  ser:{pres:'soy eres es somos sois son', imp:'era eras era éramos erais eran', rem:'fui fuiste fue fuimos fuisteis fueron', cong:'sea seas sea seamos seáis sean', tu:'sé', pp:'sido'},
  estar:{pres:'estoy estás está estamos estáis están', pret:'estuv', cong:'esté estés esté estemos estéis estén', tu:'está'},
  ir:{pres:'voy vas va vamos vais van', imp:'iba ibas iba íbamos ibais iban', rem:'fui fuiste fue fuimos fuisteis fueron', cong:'vaya vayas vaya vayamos vayáis vayan', tu:'ve', impvNoi:'vamos/vayamos', vos:'id', pp:'ido', refl:['—','vete','váyase','vámonos','idos','váyanse']},
  haber:{pres:'he has ha/hay hemos habéis han', pret:'hub', fut:'habr', cong:'haya hayas haya hayamos hayáis hayan'},
  dar:{pres:'doy das da damos dais dan', rem:'di diste dio dimos disteis dieron', cong:'dé des dé demos deis den'},
  ver:{pres:'veo ves ve vemos veis ven', imp:'veía veías veía veíamos veíais veían', rem:'vi viste vio vimos visteis vieron', pp:'visto'},
  saber:{pres:'sé sabes sabe sabemos sabéis saben', pret:'sup', fut:'sabr', cong:'sepa sepas sepa sepamos sepáis sepan'},
  caber:{pres:'quepo cabes cabe cabemos cabéis caben', pret:'cup', fut:'cabr', cong:'quepa quepas quepa quepamos quepáis quepan'},
  oír:{pres:'oigo oyes oye oímos oís oyen', rem:'oí oíste oyó oímos oísteis oyeron', cong:'oiga oigas oiga oigamos oigáis oigan', tu:'oye', vos:'oíd'},
  reír:{pres:'río ríes ríe reímos reís ríen', rem:'reí reíste rio reímos reísteis rieron', cong:'ría rías ría riamos riáis rían', tu:'ríe', vos:'reíd', pp:'reído', refl:['—','ríete','ríase','riámonos','reíos','ríanse']},
  sonreír:{pres:'sonrío sonríes sonríe sonreímos sonreís sonríen', rem:'sonreí sonreíste sonrió sonreímos sonreísteis sonrieron', cong:'sonría sonrías sonría sonriamos sonriáis sonrían', tu:'sonríe', vos:'sonreíd', pp:'sonreído'},
  oler:{pres:'huelo hueles huele olemos oléis huelen', cong:'huela huelas huela olamos oláis huelan', tu:'huele'}
};

const P = s => s.split(' ');
const VERBS = [];
VERB_RAW_ES.trim().split('\n').forEach(l => {
  const [inf, lvl, flags, hu, pl, en] = l.split('|');
  const o = {inf, lvl: +lvl, hu, mean: {hu, pl, en}, fl: {}};
  (flags || '').split(' ').filter(Boolean).forEach(f => { const [k, v] = f.split('='); o.fl[k] = v === undefined ? true : v; });
  VERBS.push(o);
});

/* helyesírás: busqué, llegué, empecé, averigüé; escojo, sigo, venzo */
function jn(stem, end, cls, vb){
  if (cls === 'ar' && /^[eé]/.test(end)){
    if (/gu$/.test(stem)) return stem.slice(0,-2) + 'gü' + end;
    if (/c$/.test(stem)) return stem.slice(0,-1) + 'qu' + end;
    if (/g$/.test(stem)) return stem + 'u' + end;
    if (/z$/.test(stem)) return stem.slice(0,-1) + 'c' + end;
  }
  if (cls !== 'ar' && /^[aoáó]/.test(end) && vb){
    const b = vb.base;
    if (/g[ei]r$/.test(b) && /g$/.test(stem)) return stem.slice(0,-1) + 'j' + end;
    if (/guir$/.test(b) && /gu$/.test(stem)) return stem.slice(0,-1) + end;
    if (/c[ei]r$/.test(b) && !vb.fl.zc && /[^z]c$/.test(stem) && b !== 'hacer' && b !== 'decir') return stem.slice(0,-1) + 'z' + end;
  }
  return stem + end;
}
function changeStem(stem, kind, strong){
  // kind: ie | ue | i | uue ; strong=true: hangsúlyos alak (piens-), false: gyenge -ir változás (sint-, durm-, pid-)
  const lastIdx = ch => stem.lastIndexOf(ch);
  if (kind === 'uue'){ const k = lastIdx('u'); return strong ? stem.slice(0,k) + 'ue' + stem.slice(k+1) : stem; }
  if (kind === 'ie' || kind === 'i'){
    const k = lastIdx('e'); if (k < 0) return stem;
    if (strong) return stem.slice(0,k) + (kind === 'ie' ? 'ie' : 'i') + stem.slice(k+1);
    return stem.slice(0,k) + 'i' + stem.slice(k+1);
  }
  if (kind === 'ue'){
    const k = lastIdx('o'); if (k < 0) return stem;
    if (strong) return (k === 0 ? 'hue' : stem.slice(0,k) + 'ue') + stem.slice(k+1);
    return stem.slice(0,k) + 'u' + stem.slice(k+1);
  }
  return stem;
}
const accStem = stem => { const k = Math.max(stem.lastIndexOf('i'), stem.lastIndexOf('u')); return k < 0 ? stem : stem.slice(0,k) + ACUTE[stem[k]] + stem.slice(k+1); };
const STRONGP = [0,1,2,5];
function congiFrom(r3pl){
  const r = r3pl.replace(/ron$/, '');
  return ['ra','ras','ra','ramos','rais','ran'].map((e, i) => { const x = i === 3 ? aAcc(r) : r; return x + e + '/' + x + ['se','ses','se','semos','seis','sen'][i]; });
}
const aAcc = s => { const m = s.match(/^(.*)([aeiou])$/); return m ? m[1] + ACUTE[m[2]] : s; };

function conjugate(vb, regular){
  const b = vb.base, cls = b.slice(-2) === 'ír' ? 'ir' : b.slice(-2), stem = b.slice(0, -2);
  const fl = regular ? {} : vb.fl, full = regular ? null : FULL[b];
  const E = ENDS[cls];
  const st = fl.ie ? 'ie' : fl.ue ? 'ue' : fl.i ? 'i' : fl.uue ? 'uue' : null;
  const uir = /[^g]uir$/.test(b) && !regular;
  const vowelStem = /[aeo]$/.test(stem) && cls !== 'ar';
  const R = {};
  /* presente */
  R.pres = E.pres.map((e, i) => {
    let s = stem;
    if (st && STRONGP.includes(i)) s = changeStem(stem, st, true);
    if (fl.acc && STRONGP.includes(i)) s = accStem(s);
    if (uir && !/^[ií]/.test(e)) s = s + 'y';
    if (fl.zc && i === 0) s = stem.slice(0,-1) + 'zc';
    return jn(s, e, cls, vb);
  });
  if (fl.yo) R.pres[0] = fl.yo;
  if (vowelStem && cls === 'ir') R.pres[3] = stem + 'ímos';
  /* imperfecto */
  R.imp = E.imp.map(e => stem + e);
  /* indefinido */
  if (fl.pret){
    const ps = fl.pret;
    R.rem = STRONG_E.map((e, i) => (i === 5 && /j$/.test(ps)) ? ps + 'eron' : ps + e);
    if (/c$/.test(ps)) R.rem[2] = ps.slice(0,-1) + 'zo';
  } else {
    R.rem = E.pret.map((e, i) => {
      let s = stem;
      if (cls === 'ir' && st && (i === 2 || i === 5)) s = changeStem(stem, st, false);
      if (vowelStem || uir){
        if (e === 'ió') return s + 'yó';
        if (e === 'ieron') return s + 'yeron';
        if (vowelStem && e[0] === 'i') return s + 'í' + e.slice(1);
      }
      return jn(s, e, cls, vb);
    });
  }
  /* jövő, feltételes */
  const fs = fl.fut || b.replace(/ír$/, 'ir');
  R.fut = FUT_E.map(e => fs + e); R.cond = COND_E.map(e => fs + e);
  /* kötőmód jelen */
  const yoStem = R.pres[0].replace(/o$/, '');
  R.cong = E.subj.map((e, i) => {
    let s;
    if (STRONGP.includes(i) || fl.yo || fl.zc || uir) s = yoStem;
    else { s = (cls === 'ir' && st) ? changeStem(stem, st, false) : stem; }
    if (!STRONGP.includes(i) && fl.acc && !fl.yo) s = stem;
    return jn(s, e, cls, vb);
  });
  /* kötőmód múlt: az indefinido 3. t. sz.-ból */
  R.congi = congiFrom(R.rem[5]);
  /* participio */
  R.pp = fl.pp || (cls === 'ar' ? stem + 'ado' : (vowelStem ? stem + 'ído' : stem + 'ido'));
  /* teljes táblák */
  if (full){
    ['pres','imp','rem','cong'].forEach(k => { if (full[k]) R[k] = P(full[k]); });
    if (full.pret){ const ps = full.pret; R.rem = STRONG_E.map(e => ps + e); }
    if (full.fut){ R.fut = FUT_E.map(e => full.fut + e); R.cond = COND_E.map(e => full.fut + e); }
    if (full.pp) R.pp = full.pp;
    if (full.rem || full.pret) R.congi = congiFrom(R.rem[5]);
  }
  /* felszólító mód */
  if (NO_IMPV.has(b)) R.impv = ['—','—','—','—','—','—'];
  else {
    const tu = (full && full.tu) || fl.tu || R.pres[2].split('/')[0];
    const vos = (full && full.vos) || b.replace(/[rR]$/, 'd').replace(/ír$/, 'id');
    const noi = (full && full.impvNoi) || R.cong[3];
    R.impv = ['—', tu, R.cong[2], noi, vos, R.cong[5]];
  }
  return R;
}
function reflImpv(vb, F){
  const full = FULL[vb.base];
  if (full && full.refl) return full.refl.slice();
  if (NO_IMPV.has(vb.base)) return ['—','—','—','—','—','—'];
  const f = x => x.split('/')[0];
  const cls = vb.base.slice(-2) === 'ír' ? 'ir' : vb.base.slice(-2);
  const vos = cls === 'ir' ? vb.base.slice(0, -2) + 'íos' : vb.base.slice(0, -1) + 'os';
  return ['—', encl(f(F.impv[1]), 'te'), encl(f(F.impv[2]), 'se'), encl(f(F.impv[3]), 'nos', 1), vos, encl(f(F.impv[5]), 'se')];
}
function build(vb){
  vb.refl = /se$/.test(vb.inf);
  vb.base = vb.refl ? vb.inf.slice(0, -2) : vb.inf;
  const F = conjugate(vb, false), R = conjugate(vb, true);
  if (vb.refl){ F.impv = reflImpv(vb, F); R.impv = reflImpv(vb, R); }
  vb.F = F; vb.R = R;
  vb.irrT = [];
  SIMPLE.forEach(t => { if (F[t].some((x, i) => x !== R[t][i])) vb.irrT.push(t); });
  if (F.pp !== R.pp) vb.irrT.push('pp');
  vb.irr = vb.irrT.length > 0;
  vb.aux = 'haber';
  vb.noImpv = NO_IMPV.has(vb.base);
  return vb;
}
VERBS.forEach(build);
VERBS.sort((a, b) => a.inf.localeCompare(b.inf, 'es'));
const VBY0 = Object.fromEntries(VERBS.map(v => [v.inf, v]));

function cell(vb, t, i){
  const pron = vb.refl ? REFL[i] + ' ' : '';
  if (t === 'impv'){
    const raw = vb.F.impv[i];
    if (i === 0 || raw === '—') return {display:'—', accept:[], irr:false, na:true};
    const alts = raw.split('/');
    return {display: alts[0] + (alts.length > 1 ? ' (' + alts.slice(1).join(', ') + ')' : ''), accept: alts, irr: raw !== vb.R.impv[i]};
  }
  if (COMPOUND[t]){
    const pps = vb.F.pp.split('/');
    const auxV = VBY0.haber.F[COMPOUND[t]][i].split('/')[0];
    const alts = VBY0.haber.F[COMPOUND[t]][i].split('/');
    const accept = [];
    alts.forEach(a => pps.forEach(p => { if (a !== 'hay') accept.push(pron + a + ' ' + p); }));
    return {display: pron + auxV + ' ' + pps[0] + (pps.length > 1 ? ' (' + pps.slice(1).join(', ') + ')' : ''), accept, irr: vb.F.pp !== vb.R.pp};
  }
  const raw = vb.F[t][i], alts = raw.split('/').filter(a => !(vb.inf === 'haber' && a === 'hay'));
  return {display: pron + alts[0] + (alts.length > 1 ? ' (' + alts.slice(1).map(a => pron + a).join(', ') + ')' : ''),
          accept: alts.map(a => pron + a), irr: raw !== vb.R[t][i]};
}

const ACC = {a:'á', e:'é', i:'í', o:'ó', u:'ú', n:'ñ'};
function norm(s){
  s = (s || '').toLowerCase().normalize('NFC').trim().replace(/\s+/g, ' ');
  s = s.replace(/([aeioun])['`´’]/g, (m, c) => ACC[c]).replace(/n~/g, 'ñ');
  s = s.replace(/^[¡¿]+|[!?]+$/g, '');
  s = s.replace(/^(yo|tú|tu|él|el|ella|usted|nosotros|nosotras|vosotros|vosotras|ellos|ellas|ustedes|él\/ella)\s+/, '');
  return s;
}
const deacc = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
function check(input, accept){
  const n = norm(input);
  if (!n) return 'empty';
  if (accept.some(a => norm(a) === n)) return 'ok';
  if (accept.some(a => deacc(norm(a)) === deacc(n))) return 'acc';
  return 'bad';
}

/* példamondatok: ige|idő|személy|spanyol mondat ___ helyén az igével|magyar|lengyel|angol */
const SENT_RAW_ES = `ser|pres|0|___ de Hungría.|Magyarországról származom.|Jestem z Węgier.|I'm from Hungary.
estar|pres|3|Hoy ___ muy cansados.|Ma nagyon fáradtak vagyunk.|Dziś jesteśmy bardzo zmęczeni.|Today we are very tired.
tener|pres|1|¿Cuántos años ___?|Hány éves vagy?|Ile masz lat?|How old are you?
hacer|pp|3|Hoy ___ una tarta de chocolate.|Ma csokitortát sütöttünk.|Dziś upiekliśmy tort czekoladowy.|Today we've made a chocolate cake.
ir|rem|3|El verano pasado ___ a Sevilla.|Tavaly nyáron Sevillába mentünk.|Zeszłego lata pojechaliśmy do Sewilli.|Last summer we went to Seville.
poder|congi|0|Si ___, te ayudaría.|Ha tudnék, segítenék neked.|Gdybym mógł, pomógłbym ci.|If I could, I would help you.
decir|rem|2|Mi madre me ___ la verdad.|Az anyám megmondta nekem az igazat.|Mama powiedziała mi prawdę.|My mother told me the truth.
ver|pp|0|Nunca ___ el mar.|Még soha nem láttam a tengert.|Nigdy nie widziałem morza.|I have never seen the sea.
dar|pres|2|El profesor nos ___ muchos deberes.|A tanár sok házi feladatot ad nekünk.|Nauczyciel zadaje nam dużo zadań.|The teacher gives us a lot of homework.
saber|pres|0|No ___ dónde está la estación.|Nem tudom, hol van az állomás.|Nie wiem, gdzie jest dworzec.|I don't know where the station is.
querer|cond|0|___ un café con leche, por favor.|Egy tejeskávét kérnék.|Poproszę kawę z mlekiem.|I'd like a white coffee, please.
llegar|rem|5|Los invitados ___ tarde.|A vendégek későn érkeztek.|Goście przyszli późno.|The guests arrived late.
pasar|imp|3|De niños ___ los veranos en el pueblo.|Gyerekként a nyarakat a faluban töltöttük.|Jako dzieci spędzaliśmy wakacje na wsi.|As children we spent the summers in the village.
deber|pres|1|___ estudiar más.|Többet kell tanulnod.|Musisz więcej się uczyć.|You must study more.
poner|pp|0|¿Dónde ___ las llaves?|Hová tettem a kulcsokat?|Gdzie położyłem klucze?|Where have I put the keys?
parecer|pres|2|Tu hermano ___ simpático.|A bátyád szimpatikusnak tűnik.|Twój brat wydaje się sympatyczny.|Your brother seems nice.
quedar|fut|3|Mañana ___ en la plaza a las ocho.|Holnap nyolckor a téren találkozunk.|Jutro spotkamy się na placu o ósmej.|Tomorrow we'll meet in the square at eight.
creer|pres|0|No ___ que llueva hoy.|Nem hiszem, hogy ma esni fog.|Nie sądzę, żeby dziś padało.|I don't think it'll rain today.
hablar|pres|4|¿___ inglés?|Beszéltek angolul?|Mówicie po angielsku?|Do you (all) speak English?
llevar|imp|2|Siempre ___ un sombrero rojo.|Mindig piros kalapot viselt.|Zawsze nosił czerwony kapelusz.|He always wore a red hat.
dejar|pp|1|¿Por qué ___ el trabajo?|Miért hagytad ott a munkát?|Dlaczego rzuciłeś pracę?|Why have you left your job?
seguir|impv|1|___ todo recto y luego gira a la derecha.|Menj egyenesen, aztán fordulj jobbra.|Idź prosto, a potem skręć w prawo.|Go straight on and then turn right.
encontrar|rem|0|___ un billete de veinte euros en la calle.|Találtam egy húszeurós bankjegyet az utcán.|Znalazłem na ulicy banknot dwudziestoeurowy.|I found a twenty-euro note in the street.
llamar|fut|0|Te ___ esta noche.|Ma este felhívlak.|Zadzwonię do ciebie dziś wieczorem.|I'll call you tonight.
venir|fut|5|Mis padres ___ el sábado.|A szüleim szombaton jönnek.|Moi rodzice przyjadą w sobotę.|My parents will come on Saturday.
pensar|pres|5|¿Qué ___ tus amigos de esto?|Mit gondolnak erről a barátaid?|Co twoi przyjaciele o tym myślą?|What do your friends think about this?
salir|trp|2|Cuando llegamos a la estación, el tren ya ___.|Mire az állomásra értünk, a vonat már elment.|Kiedy dotarliśmy na dworzec, pociąg już odjechał.|When we got to the station, the train had already left.
volver|rem|2|Mi abuelo ___ a casa muy tarde.|A nagyapám nagyon későn jött haza.|Dziadek wrócił do domu bardzo późno.|My grandfather came home very late.
tomar|pres|0|Por la mañana ___ un café.|Reggel iszom egy kávét.|Rano piję kawę.|In the morning I have a coffee.
conocer|pres|0|No ___ a nadie en esta ciudad.|Senkit sem ismerek ebben a városban.|Nikogo nie znam w tym mieście.|I don't know anyone in this city.
vivir|imp|3|Antes ___ en Madrid.|Korábban Madridban laktunk.|Wcześniej mieszkaliśmy w Madrycie.|We used to live in Madrid.
sentir|pres|0|Lo ___ mucho.|Nagyon sajnálom.|Bardzo mi przykro.|I'm very sorry.
mirar|impv|4|¡___ qué atardecer tan bonito!|Nézzétek, milyen szép naplemente!|Patrzcie, jaki piękny zachód słońca!|Look, what a beautiful sunset!
contar|rem|2|El abuelo nos ___ una historia increíble.|A nagyapa egy hihetetlen történetet mesélt nekünk.|Dziadek opowiedział nam niesamowitą historię.|Grandpa told us an incredible story.
empezar|pres|2|La película ___ a las nueve.|A film kilenckor kezdődik.|Film zaczyna się o dziewiątej.|The film starts at nine.
esperar|imp|0|Te ___ en la estación, pero no viniste.|Vártalak az állomáson, de nem jöttél.|Czekałem na ciebie na dworcu, ale nie przyszedłeś.|I was waiting for you at the station, but you didn't come.
buscar|pres|0|___ un piso cerca del centro.|Lakást keresek a központ közelében.|Szukam mieszkania blisko centrum.|I'm looking for a flat near the centre.
entrar|rem|5|Los ladrones ___ por la ventana.|A betörők az ablakon jöttek be.|Złodzieje weszli przez okno.|The thieves came in through the window.
trabajar|pres|2|Mi hermana ___ en un hospital.|A nővérem kórházban dolgozik.|Moja siostra pracuje w szpitalu.|My sister works in a hospital.
escribir|pp|0|Ya ___ la carta.|Már megírtam a levelet.|Już napisałem list.|I've already written the letter.
perder|rem|0|Ayer ___ el autobús.|Tegnap lekéstem a buszt.|Wczoraj spóźniłem się na autobus.|Yesterday I missed the bus.
entender|pres|0|No ___ esta palabra.|Nem értem ezt a szót.|Nie rozumiem tego słowa.|I don't understand this word.
pedir|rem|5|Mis amigos ___ una paella para todos.|A barátaim paellát rendeltek mindenkinek.|Moi przyjaciele zamówili paellę dla wszystkich.|My friends ordered a paella for everyone.
recibir|pp|3|___ tu mensaje.|Megkaptuk az üzenetedet.|Dostaliśmy twoją wiadomość.|We've received your message.
recordar|pres|1|¿___ su nombre?|Emlékszel a nevére?|Pamiętasz jego imię?|Do you remember his name?
terminar|futa|0|Para las seis ya ___ el informe.|Hatra már befejezem a jelentést.|Do szóstej skończę już raport.|By six I will have finished the report.
abrir|impv|2|___ la ventana, por favor.|Nyissa ki az ablakot, kérem.|Proszę otworzyć okno.|Open the window, please.
leer|rem|2|Mi padre ___ el periódico en el tren.|Az apám a vonaton olvasta el az újságot.|Tata przeczytał gazetę w pociągu.|My father read the newspaper on the train.
caer|rem|5|Las hojas ___ de los árboles.|A levelek lehullottak a fákról.|Liście spadły z drzew.|The leaves fell from the trees.
cambiar|pp|2|La ciudad ___ mucho.|A város sokat változott.|Miasto bardzo się zmieniło.|The city has changed a lot.
oír|rem|1|¿___ ese ruido?|Hallottad ezt a zajt?|Słyszałeś ten hałas?|Did you hear that noise?
ganar|rem|2|Nuestro equipo ___ el partido.|A csapatunk megnyerte a meccset.|Nasza drużyna wygrała mecz.|Our team won the match.
traer|pp|1|¿___ el paraguas?|Elhoztad az esernyőt?|Przyniosłeś parasol?|Have you brought the umbrella?
comprender|pres|3|___ tu problema.|Megértjük a problémádat.|Rozumiemy twój problem.|We understand your problem.
explicar|rem|2|La profesora ___ la regla dos veces.|A tanárnő kétszer magyarázta el a szabályt.|Nauczycielka dwa razy wyjaśniła regułę.|The teacher explained the rule twice.
preguntar|pp|1|¿Le ___ al médico?|Megkérdezted az orvost?|Zapytałeś lekarza?|Have you asked the doctor?
tocar|pres|2|Mi hijo ___ la guitarra.|A fiam gitározik.|Mój syn gra na gitarze.|My son plays the guitar.
estudiar|imp|0|Cuando ___ en Salamanca, vivía con dos amigas.|Amikor Salamancában tanultam, két barátnőmmel laktam.|Kiedy studiowałem w Salamance, mieszkałem z dwiema koleżankami.|When I was studying in Salamanca, I lived with two friends.
nacer|rem|0|___ en 1990.|1990-ben születtem.|Urodziłem się w 1990 roku.|I was born in 1990.
correr|pres|2|Mi vecino ___ todas las mañanas.|A szomszédom minden reggel fut.|Mój sąsiad biega każdego ranka.|My neighbour runs every morning.
pagar|rem|0|Anoche ___ yo la cena.|Tegnap este én fizettem a vacsorát.|Wczoraj wieczorem ja zapłaciłem za kolację.|Last night I paid for dinner.
ayudar|fut|3|Te ___ con la mudanza.|Segítünk neked a költözésben.|Pomożemy ci w przeprowadzce.|We'll help you with the move.
gustar|pres|2|Me ___ mucho la música española.|Nagyon tetszik a spanyol zene.|Bardzo podoba mi się hiszpańska muzyka.|I really like Spanish music.
jugar|imp|5|Los niños ___ en el parque.|A gyerekek a parkban játszottak.|Dzieci bawiły się w parku.|The children were playing in the park.
escuchar|pres|3|Siempre ___ la radio en el coche.|Mindig rádiót hallgatunk az autóban.|Zawsze słuchamy radia w samochodzie.|We always listen to the radio in the car.
intentar|fut|0|Lo ___ otra vez.|Megpróbálom még egyszer.|Spróbuję jeszcze raz.|I'll try again.
usar|pres|1|¿___ gafas para leer?|Használsz szemüveget olvasáshoz?|Używasz okularów do czytania?|Do you use glasses for reading?
decidir|pp|3|___ vender la casa.|Úgy döntöttünk, eladjuk a házat.|Postanowiliśmy sprzedać dom.|We've decided to sell the house.
olvidar|pp|0|___ mi contraseña.|Elfelejtettem a jelszavamat.|Zapomniałem hasła.|I've forgotten my password.
comer|pres|3|Los domingos ___ en casa de mis abuelos.|Vasárnaponként a nagyszüleimnél ebédelünk.|W niedziele jemy u dziadków.|On Sundays we eat at my grandparents'.
mostrar|rem|2|El guía nos ___ la catedral.|Az idegenvezető megmutatta nekünk a katedrálist.|Przewodnik pokazał nam katedrę.|The guide showed us the cathedral.
continuar|pres|2|La lluvia ___ toda la tarde.|Az eső egész délután tart.|Deszcz pada całe popołudnie.|The rain goes on all afternoon.
aprender|pres|0|___ español desde hace un año.|Egy éve tanulok spanyolul.|Uczę się hiszpańskiego od roku.|I've been learning Spanish for a year.
comprar|pp|2|Mi hermano ___ un coche nuevo.|A bátyám új autót vett.|Mój brat kupił nowy samochód.|My brother has bought a new car.
subir|rem|3|___ a la montaña en tres horas.|Három óra alatt felmentünk a hegyre.|Weszliśmy na górę w trzy godziny.|We climbed the mountain in three hours.
bajar|impv|1|___ la voz, por favor.|Halkítsd le a hangod, kérlek.|Ścisz głos, proszę.|Lower your voice, please.
cerrar|pres|5|Las tiendas ___ a las ocho.|Az üzletek nyolckor zárnak.|Sklepy zamykają o ósmej.|The shops close at eight.
responder|rem|2|No ___ a mi pregunta.|Nem válaszolt a kérdésemre.|Nie odpowiedział na moje pytanie.|He didn't answer my question.
enseñar|imp|2|Mi abuela me ___ a cocinar.|A nagymamám tanított főzni.|Babcia uczyła mnie gotować.|My grandmother taught me to cook.
vender|pres|5|En este mercado ___ fruta muy buena.|Ezen a piacon nagyon jó gyümölcsöt árulnak.|Na tym targu sprzedają bardzo dobre owoce.|At this market they sell very good fruit.
beber|cong|1|Es importante que ___ mucha agua.|Fontos, hogy sok vizet igyál.|Ważne, żebyś pił dużo wody.|It's important that you drink a lot of water.
viajar|cond|3|Si tuviéramos dinero, ___ por todo el mundo.|Ha lenne pénzünk, beutaznánk az egész világot.|Gdybyśmy mieli pieniądze, podróżowalibyśmy po całym świecie.|If we had money, we would travel all over the world.
dormir|rem|0|Anoche ___ muy mal.|Tegnap éjjel nagyon rosszul aludtam.|Wczoraj w nocy bardzo źle spałem.|Last night I slept very badly.
cocinar|fut|0|Esta noche ___ yo.|Ma este én főzök.|Dziś wieczorem ja ugotuję.|Tonight I'll cook.
limpiar|pp|3|Ya ___ toda la casa.|Már kitakarítottuk az egész házat.|Już posprzątaliśmy cały dom.|We've already cleaned the whole house.
bailar|imp|5|Mis padres ___ salsa todos los sábados.|A szüleim minden szombaton salsát táncoltak.|Moi rodzice tańczyli salsę w każdą sobotę.|My parents used to dance salsa every Saturday.
cantar|pres|2|Mi hija ___ en un coro.|A lányom kórusban énekel.|Moja córka śpiewa w chórze.|My daughter sings in a choir.
nadar|cond|0|___ todos los días si tuviera una piscina.|Minden nap úsznék, ha lenne medencém.|Pływałbym codziennie, gdybym miał basen.|I would swim every day if I had a pool.
preparar|pres|2|Mi padre ___ la cena.|Az apám készíti a vacsorát.|Tata przygotowuje kolację.|My father is making dinner.
necesitar|pres|0|___ ayuda.|Segítségre van szükségem.|Potrzebuję pomocy.|I need help.
desayunar|imp|0|De pequeño ___ churros con chocolate.|Kiskoromban churrost reggeliztem csokoládéval.|Jako dziecko jadłem na śniadanie churros z czekoladą.|As a child I had churros with chocolate for breakfast.
cenar|fut|3|Esta noche ___ en un restaurante.|Ma este étteremben vacsorázunk.|Dziś wieczorem zjemy kolację w restauracji.|Tonight we'll have dinner at a restaurant.
visitar|fut|3|El año que viene ___ México.|Jövőre Mexikóba látogatunk.|W przyszłym roku odwiedzimy Meksyk.|Next year we'll visit Mexico.
caminar|imp|3|___ por la playa cada tarde.|Minden délután sétáltunk a parton.|Każdego popołudnia spacerowaliśmy po plaży.|We used to walk along the beach every afternoon.
lavar|pres|0|Yo ___ los platos y tú los secas.|Én elmosogatok, te pedig eltörölgeted.|Ja myję naczynia, a ty je wycierasz.|I wash the dishes and you dry them.
despertarse|rem|0|Hoy ___ a las seis.|Ma hatkor ébredtem fel.|Dziś obudziłem się o szóstej.|Today I woke up at six.
levantarse|pres|0|Todos los días ___ a las siete.|Minden nap hétkor kelek.|Codziennie wstaję o siódmej.|Every day I get up at seven.
acostarse|pres|5|Los niños ___ a las nueve.|A gyerekek kilenckor fekszenek le.|Dzieci kładą się spać o dziewiątej.|The children go to bed at nine.
ducharse|pres|1|¿___ por la mañana o por la noche?|Reggel vagy este zuhanyozol?|Bierzesz prysznic rano czy wieczorem?|Do you shower in the morning or in the evening?
vestirse|pres|2|Mi hermano ___ muy rápido.|Az öcsém nagyon gyorsan öltözik fel.|Mój brat bardzo szybko się ubiera.|My brother gets dressed very quickly.
llamarse|pres|0|Hola, ___ Ana.|Szia, Annának hívnak.|Cześć, mam na imię Ana.|Hi, my name is Ana.
sentarse|rem|5|Los invitados ___ a la mesa.|A vendégek asztalhoz ültek.|Goście usiedli przy stole.|The guests sat down at the table.
irse|pp|5|Mis amigos ya ___.|A barátaim már elmentek.|Moi przyjaciele już poszli.|My friends have already left.
lavarse|impv|1|___ las manos antes de comer.|Mosd meg a kezed evés előtt.|Umyj ręce przed jedzeniem.|Wash your hands before eating.
divertirse|rem|3|___ mucho en la fiesta.|Nagyon jól szórakoztunk a bulin.|Świetnie bawiliśmy się na imprezie.|We had a lot of fun at the party.
almorzar|pres|0|Normalmente ___ a las dos.|Általában kettőkor ebédelek.|Zwykle jem obiad o drugiej.|I usually have lunch at two.
llover|pp|2|Hoy ___ todo el día.|Ma egész nap esett.|Dziś padało cały dzień.|It has rained all day today.
producir|pres|2|Esta región ___ un vino excelente.|Ez a vidék kiváló bort termel.|Ten region produkuje doskonałe wino.|This region produces an excellent wine.
traducir|rem|0|___ el libro al húngaro.|Lefordítottam a könyvet magyarra.|Przetłumaczyłem książkę na węgierski.|I translated the book into Hungarian.
conducir|pres|0|No ___ cuando bebo.|Nem vezetek, ha iszom.|Nie prowadzę, kiedy piję.|I don't drive when I drink.
ofrecer|rem|5|Nos ___ un trabajo en Barcelona.|Munkát ajánlottak nekünk Barcelonában.|Zaproponowali nam pracę w Barcelonie.|They offered us a job in Barcelona.
construir|rem|5|Los romanos ___ este puente.|A rómaiak építették ezt a hidat.|Rzymianie zbudowali ten most.|The Romans built this bridge.
elegir|pres|0|Siempre ___ el mismo plato.|Mindig ugyanazt az ételt választom.|Zawsze wybieram to samo danie.|I always choose the same dish.
conseguir|pp|2|Por fin ___ el trabajo que quería.|Végre megkapta a munkát, amit szeretett volna.|W końcu dostała pracę, której chciała.|She has finally got the job she wanted.
servir|rem|2|El camarero nos ___ la sopa fría.|A pincér hidegen hozta ki nekünk a levest.|Kelner podał nam zimną zupę.|The waiter served us cold soup.
repetir|impv|2|___ la pregunta, por favor.|Kérem, ismételje meg a kérdést.|Proszę powtórzyć pytanie.|Please repeat the question.
preferir|pres|0|___ el té al café.|A teát jobban szeretem a kávénál.|Wolę herbatę od kawy.|I prefer tea to coffee.
mentir|rem|2|Me ___.|Hazudott nekem.|Okłamał mnie.|He lied to me.
probar|impv|1|___ esta tarta, está buenísima.|Kóstold meg ezt a tortát, nagyon finom.|Spróbuj tego ciasta, jest pyszne.|Try this cake, it's delicious.
soñar|imp|0|De niño ___ con ser astronauta.|Gyerekként arról álmodtam, hogy űrhajós leszek.|Jako dziecko marzyłem, żeby zostać astronautą.|As a child I dreamt of being an astronaut.
volar|pp|0|Nunca ___ en helicóptero.|Még sosem repültem helikopterrel.|Nigdy nie leciałem helikopterem.|I've never flown in a helicopter.
costar|pres|5|¿Cuánto ___ estos zapatos?|Mennyibe kerül ez a cipő?|Ile kosztują te buty?|How much do these shoes cost?
devolver|pp|0|Ya te ___ el libro.|Már visszaadtam neked a könyvet.|Już oddałem ci książkę.|I've already given you the book back.
doler|pres|2|Me ___ la cabeza.|Fáj a fejem.|Boli mnie głowa.|I have a headache.
enviar|pres|0|Te ___ las fotos esta noche.|Ma este elküldöm neked a fotókat.|Wyślę ci zdjęcia dziś wieczorem.|I'll send you the photos tonight.
andar|rem|3|___ diez kilómetros por la playa.|Tíz kilométert sétáltunk a parton.|Przeszliśmy dziesięć kilometrów plażą.|We walked ten kilometres along the beach.
romper|pp|2|El perro ___ mi zapato.|A kutya tönkretette a cipőmet.|Pies zniszczył mi buta.|The dog has ruined my shoe.
descubrir|rem|5|Los científicos ___ una nueva especie.|A tudósok új fajt fedeztek fel.|Naukowcy odkryli nowy gatunek.|The scientists discovered a new species.
proponer|rem|2|Mi jefe ___ una solución interesante.|A főnököm érdekes megoldást javasolt.|Mój szef zaproponował ciekawe rozwiązanie.|My boss proposed an interesting solution.
aparecer|rem|2|De repente ___ un gato negro.|Hirtelen megjelent egy fekete macska.|Nagle pojawił się czarny kot.|Suddenly a black cat appeared.
agradecer|pres|0|Te ___ tu ayuda.|Köszönöm a segítségedet.|Dziękuję ci za pomoc.|Thank you for your help.
crecer|pp|2|¡Cuánto ___ tu hijo!|Mennyit nőtt a fiad!|Ale twój syn urósł!|How much your son has grown!
recoger|fut|0|Te ___ en el aeropuerto.|Érted megyek a reptérre.|Odbiorę cię z lotniska.|I'll pick you up at the airport.
alquilar|rem|3|___ un coche para el viaje.|Béreltünk egy autót az útra.|Wynajęliśmy samochód na wyjazd.|We rented a car for the trip.
casarse|rem|5|Mis padres ___ en 1985.|A szüleim 1985-ben házasodtak össze.|Moi rodzice pobrali się w 1985 roku.|My parents got married in 1985.
compartir|pres|3|___ un piso con dos estudiantes.|Két diákkal lakunk együtt egy lakásban.|Dzielimy mieszkanie z dwoma studentami.|We share a flat with two students.
descansar|cong|1|Quiero que ___ un poco.|Azt akarom, hogy pihenj egy kicsit.|Chcę, żebyś trochę odpoczął.|I want you to rest a bit.
disfrutar|impv|4|¡___ de las vacaciones!|Élvezzétek a szabadságot!|Cieszcie się wakacjami!|Enjoy your holidays!
enfadarse|pp|2|Mi madre ___ conmigo.|Az anyám megharagudott rám.|Mama się na mnie zezłościła.|My mother has got angry with me.
equivocarse|rem|0|Perdón, ___ de número.|Bocsánat, rossz számot hívtam.|Przepraszam, pomyliłem numer.|Sorry, I got the wrong number.
invitar|pp|5|Nos ___ a su boda.|Meghívtak minket az esküvőjükre.|Zaprosili nas na swój ślub.|They've invited us to their wedding.
llorar|imp|2|El bebé ___ toda la noche.|A baba egész éjjel sírt.|Dziecko płakało całą noc.|The baby was crying all night.
organizar|fut|3|___ una fiesta sorpresa para Marta.|Meglepetésbulit szervezünk Martának.|Zorganizujemy przyjęcie-niespodziankę dla Marty.|We'll organize a surprise party for Marta.
practicar|cong|0|Mi profesor quiere que ___ más.|A tanárom azt akarja, hogy többet gyakoroljak.|Mój nauczyciel chce, żebym więcej ćwiczył.|My teacher wants me to practise more.
prestar|cond|1|¿Me ___ tu bicicleta?|Kölcsönadnád a biciklidet?|Pożyczyłbyś mi rower?|Would you lend me your bike?
prometer|pp|0|Te lo ___.|Megígértem neked.|Obiecałem ci to.|I've promised you.
regalar|rem|3|Le ___ un reloj a papá.|Egy órát ajándékoztunk apának.|Podarowaliśmy tacie zegarek.|We gave Dad a watch.
reservar|pp|0|___ una mesa para cuatro.|Foglaltam egy asztalt négy főre.|Zarezerwowałem stolik dla czterech osób.|I've booked a table for four.
sacar|rem|1|¿___ las entradas?|Megvetted a jegyeket?|Kupiłeś bilety?|Did you get the tickets?
abrazar|rem|2|Me ___ muy fuerte.|Nagyon erősen megölelt.|Mocno mnie przytuliła.|She hugged me very tightly.
cruzar|rem|0|___ la calle sin mirar.|Körülnézés nélkül mentem át az úttesten.|Przeszedłem przez ulicę, nie patrząc.|I crossed the street without looking.
apagar|impv|1|___ la luz, por favor.|Kapcsold le a villanyt, kérlek.|Zgaś światło, proszę.|Turn off the light, please.
mantener|pres|3|___ el contacto con nuestros amigos de la universidad.|Tartjuk a kapcsolatot az egyetemi barátainkkal.|Utrzymujemy kontakt z przyjaciółmi ze studiów.|We keep in touch with our friends from university.
obtener|pp|2|Mi hija ___ una beca.|A lányom ösztöndíjat kapott.|Moja córka dostała stypendium.|My daughter has got a scholarship.
reconocer|rem|0|No te ___ con el pelo corto.|Nem ismertelek fel rövid hajjal.|Nie poznałem cię w krótkich włosach.|I didn't recognize you with short hair.
destruir|rem|2|El terremoto ___ el pueblo.|A földrengés lerombolta a falut.|Trzęsienie ziemi zniszczyło wioskę.|The earthquake destroyed the village.
recomendar|pres|0|Te ___ este libro.|Ajánlom neked ezt a könyvet.|Polecam ci tę książkę.|I recommend this book to you.
encender|impv|1|___ la luz, que no veo nada.|Kapcsold fel a villanyt, mert semmit sem látok.|Zapal światło, bo nic nie widzę.|Turn on the light, I can't see a thing.
convencer|rem|5|Me ___ para ir a la fiesta.|Rávettek, hogy elmenjek a buliba.|Przekonali mnie, żebym poszedł na imprezę.|They convinced me to go to the party.
corregir|fut|2|La profesora ___ los exámenes el lunes.|A tanárnő hétfőn javítja ki a dolgozatokat.|Nauczycielka poprawi sprawdziany w poniedziałek.|The teacher will mark the exams on Monday.
acordarse|pres|1|¿___ de mí?|Emlékszel rám?|Pamiętasz mnie?|Do you remember me?
reírse|rem|5|Todos ___ con su chiste.|Mindenki nevetett a viccén.|Wszyscy śmiali się z jego żartu.|Everyone laughed at his joke.
sonreír|imp|2|La niña ___ a todo el mundo.|A kislány mindenkire mosolygott.|Dziewczynka uśmiechała się do wszystkich.|The little girl smiled at everyone.
caber|pres|5|Las maletas no ___ en el coche.|A bőröndök nem férnek be az autóba.|Walizki nie mieszczą się w samochodzie.|The suitcases don't fit in the car.
valer|pres|2|¿Cuánto ___ este cuadro?|Mennyit ér ez a festmény?|Ile jest wart ten obraz?|How much is this painting worth?
oler|pres|2|¡Qué bien ___ esta sopa!|De jó illata van ennek a levesnek!|Jak pięknie pachnie ta zupa!|This soup smells so good!
huir|rem|5|Los ladrones ___ en una moto.|A tolvajok motoron menekültek el.|Złodzieje uciekli na motorze.|The thieves fled on a motorbike.
morir|pp|2|Mi gato ___.|Meghalt a macskám.|Umarł mój kot.|My cat has died.`;
const SENT_RAW = SENT_RAW_ES;
const VBY = Object.fromEntries(VERBS.map(v => [v.inf, v]));
const SENTS = SENT_RAW.trim().split('\n').map(l => { const [inf, t, p, it, hu, pl, en] = l.split('|'); return {inf, t, p: +p, it, hu, tr: {hu, pl, en}}; }).filter(x => VBY[x.inf]);
const SENT_BY = Object.fromEntries(SENTS.map(x => [x.inf, x]));
const capFirst = x => {
  if (!x) return x;
  const m = x.match(/^([¡¿]*)(.)/);
  return m[1] + m[2].toUpperCase() + x.slice(m[0].length);
};
function sentFill(x){
  const c = cell(VBY[x.inf], x.t, x.p);
  const form = c.accept[0] || c.display;
  const [a, b] = x.it.split('___');
  const lead = !a || /^[¡¿]+$/.test(a);
  const shown = lead ? capFirst(form) : form;
  return {form, accept: c.accept, irr: c.irr, before: a, after: b, shown, full: a + shown + b};
}
VERBS.forEach(v => { v.mhu = v.hu; });
function setContentLang(l){
  VERBS.forEach(v => { v.hu = v.mean[l] || v.mean.hu; });
  SENTS.forEach(x => { x.hu = x.tr[l] || x.tr.hu; });
}
if (typeof module !== 'undefined') module.exports = {VERBS, VBY, cell, check, TENSES, SENTS, sentFill, setContentLang, personLabel, isIrrT, encl};
