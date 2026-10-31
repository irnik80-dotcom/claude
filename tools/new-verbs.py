# Új igék adatai (2. bővítés). Futtatás: python3 tools/new-verbs.py
# A szkript beírja az igéket a coniuga.html motorjába, és kiegészíti a tools/*.txt fordítási fájlokat.
# Mezők: inf | szint | magyar | lengyel | angol | JS-beállítás | mondat: (igeidő, személy, olasz ___, magyar, lengyel, angol, nőnem)
import re, sys, os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

V = [
 # ---- rendhagyók ----
 ("rifare",2,"újra megcsinál","przerabiać, robić ponownie","to redo","{pres:P('rifaccio rifai rifà rifacciamo rifate rifanno'), imp:'rifac', fut:'rifar', pp:'rifatto'}",
  ("pp",0,"Ho sbagliato, così ___ l'esercizio da capo.","Hibáztam, ezért elölről újracsináltam a feladatot.","Pomyliłem się, więc zrobiłem ćwiczenie od nowa.","I made a mistake, so I redid the exercise from scratch.")),
 ("riconoscere",2,"felismer","rozpoznawać","to recognize","{pp:'riconosciuto', ppReg:1}",
  ("pp",0,"Non ti ___ con gli occhiali!","Nem ismertelek fel a szemüvegben!","Nie poznałem cię w okularach!","I didn't recognise you with your glasses on!")),
 ("rinascere",3,"újjászületik","odradzać się","to be reborn","{pp:'rinato', e:1}",
  ("pres",2,"Ogni primavera la natura ___.","Minden tavasszal újjászületik a természet.","Każdej wiosny przyroda się odradza.","Every spring nature is reborn.")),
 ("ripartire",2,"újra elindul","ponownie wyruszać","to set off again","{e:1}",
  ("fut",3,"Dopo una breve sosta ___ per Napoli.","Rövid pihenő után továbbindulunk Nápolyba.","Po krótkim postoju ruszymy dalej do Neapolu.","After a short stop we'll set off again for Naples.")),
 ("rimettere",3,"visszatesz","odkładać na miejsce","to put back","{pp:'rimesso'}",
  ("impv",1,"___ il libro sullo scaffale, per favore.","Tedd vissza a könyvet a polcra, kérlek.","Odłóż książkę na półkę, proszę.","Put the book back on the shelf, please.")),
 ("scommettere",3,"fogad (tétre)","zakładać się","to bet","{pp:'scommesso'}",
  ("pres",0,"___ che domani pioverà.","Fogadok, hogy holnap esni fog.","Założę się, że jutro będzie padać.","I bet it will rain tomorrow.")),
 ("riaprire",2,"újra kinyit","ponownie otwierać","to reopen","{pp:'riaperto'}",
  ("fut",5,"I negozi ___ dopo le vacanze.","Az üzletek a szünet után újra kinyitnak.","Sklepy zostaną ponownie otwarte po wakacjach.","The shops will reopen after the holidays.")),
 ("riscrivere",3,"átír, újraír","przepisywać","to rewrite","{pp:'riscritto'}",
  ("pp",0,"___ la lettera tre volte.","Háromszor írtam át a levelet.","Trzy razy przepisałem list.","I rewrote the letter three times.")),
 ("accadere",3,"történik, megesik","zdarzać się","to happen","{e:1, fut:'accadr'}",
  ("pp",2,"Che cosa ___ ieri sera?","Mi történt tegnap este?","Co się stało wczoraj wieczorem?","What happened last night?")),
 ("ritenere",3,"vél, tart vminek","uważać (za)","to believe, to consider","TENERE:ri",
  ("pres",0,"___ che sia la scelta migliore.","Úgy vélem, ez a legjobb választás.","Uważam, że to najlepszy wybór.","I believe it's the best choice.")),
 ("trattenere",3,"visszatart","powstrzymywać","to hold back","TENERE:trat",
  ("pp",0,"A fatica ___ le lacrime.","Nagy nehezen visszatartottam a könnyeimet.","Z trudem powstrzymałem łzy.","I could barely hold back my tears.")),
 ("appartenere",3,"tartozik vkihez","należeć","to belong","TENERE:appar",
  ("imp",2,"Questa casa ___ ai miei nonni.","Ez a ház a nagyszüleimé volt.","Ten dom należał do moich dziadków.","This house belonged to my grandparents.")),
 ("convenire",3,"megéri, jobb","opłacać się","to be better, to be worth it","VENIRE:con:e",
  ("pres",2,"Ti ___ prendere il treno.","Jobban jársz, ha vonattal mész.","Opłaca ci się pojechać pociągiem.","You'd better take the train.")),
 ("intervenire",3,"közbelép","interweniować","to intervene","VENIRE:inter:e",
  ("pp",2,"La polizia ___ subito.","A rendőrség azonnal közbelépett.","Policja natychmiast interweniowała.","The police intervened immediately.","f")),
 ("divenire",3,"válik vmivé","stawać się","to become","VENIRE:di:e",
  ("rem",2,"Con gli anni ___ un grande pittore.","Az évek során nagy festővé vált.","Z biegiem lat stał się wielkim malarzem.","Over the years he became a great painter.")),
 ("svenire",3,"elájul","mdleć","to faint","VENIRE:s:e",
  ("pp",2,"Per il caldo Laura ___.","Laura elájult a hőségtől.","Laura zemdlała z gorąca.","Laura fainted from the heat.","f")),
 ("prevenire",3,"megelőz","zapobiegać","to prevent","VENIRE:pre",
  ("pres",2,"Lo sport ___ molte malattie.","A sport sok betegséget megelőz.","Sport zapobiega wielu chorobom.","Sport prevents many illnesses.")),
 ("sopravvivere",3,"túlél","przeżyć","to survive","{e:1, fut:'sopravvivr', pp:'sopravvissuto'}",
  ("pp",5,"Per fortuna tutti ___ all'incidente.","Szerencsére mindenki túlélte a balesetet.","Na szczęście wszyscy przeżyli wypadek.","Luckily everyone survived the accident.")),
 ("convivere",3,"együtt él","mieszkać razem","to live together","{fut:'convivr', pp:'convissuto'}",
  ("pres",5,"Marco e Anna ___ da due anni.","Marco és Anna két éve élnek együtt.","Marco i Anna mieszkają razem od dwóch lat.","Marco and Anna have been living together for two years.")),
 ("provvedere",3,"gondoskodik","zadbać, zająć się","to see to, to provide","{}",
  ("fut",0,"Non preoccuparti, ___ io ai biglietti.","Ne aggódj, én gondoskodom a jegyekről.","Nie martw się, ja zajmę się biletami.","Don't worry, I'll see to the tickets.")),
 ("intravedere",3,"megpillant","dostrzegać","to glimpse","{fut:'intravedr', pp:'intravisto'}",
  ("rem",0,"Tra la nebbia ___ una luce.","A ködben megpillantottam egy fényt.","We mgle dostrzegłem światło.","Through the fog I glimpsed a light.")),
 ("coinvolgere",3,"bevon","angażować","to involve","{pp:'coinvolto'}",
  ("pp",5,"___ anche i bambini nel progetto.","A gyerekeket is bevonták a projektbe.","W projekt zaangażowano także dzieci.","They also involved the children in the project.")),
 ("sconvolgere",3,"felkavar, megráz","wstrząsać","to shock, to upset","{pp:'sconvolto'}",
  ("pp",2,"La notizia mi ___.","A hír megrázott.","Ta wiadomość mną wstrząsnęła.","The news shocked me.")),
 ("rivolgersi",3,"fordul vkihez","zwracać się","to turn to, to ask","{pp:'rivolto'}",
  ("impv",2,"Per informazioni ___ alla reception.","Információért forduljon a recepcióhoz.","W sprawie informacji proszę zwrócić się do recepcji.","For information, please ask at reception.")),
 ("disporre",3,"elrendez","rozmieszczać, ustawiać","to arrange","PORRE:dis",
  ("pp",0,"___ le sedie in cerchio.","Körbe rendeztem a székeket.","Ustawiłem krzesła w kole.","I arranged the chairs in a circle.")),
 ("opporsi",3,"ellenez, szembeszáll","sprzeciwiać się","to oppose","{pres:P('oppongo opponi oppone opponiamo opponete oppongono'), imp:'oppon', fut:'opporr', pp:'opposto'}",
  ("pres",5,"Molti cittadini ___ al nuovo progetto.","Sok polgár ellenzi az új tervet.","Wielu mieszkańców sprzeciwia się nowemu projektowi.","Many citizens oppose the new project.")),
 ("dedurre",3,"következtet","wnioskować","to deduce","DURRE:de",
  ("pres",0,"Dal tuo sorriso ___ che è andato tutto bene.","A mosolyodból arra következtetek, hogy minden jól ment.","Z twojego uśmiechu wnioskuję, że wszystko poszło dobrze.","From your smile I gather everything went well.")),
 ("sedurre",3,"elcsábít, elbűvöl","uwodzić, oczarować","to seduce, to charm","DURRE:se",
  ("pp",2,"La città mi ___ subito.","A város azonnal elbűvölt.","Miasto od razu mnie oczarowało.","The city charmed me at once.")),
 ("sottrarre",3,"kivon, elvesz","odejmować","to subtract","TRARRE:sot",
  ("impv",1,"___ cinque da venti.","Vonj ki ötöt húszból.","Odejmij pięć od dwudziestu.","Subtract five from twenty.")),
 ("estrarre",3,"kihúz","wyrywać, wyciągać","to extract, to pull out","TRARRE:es",
  ("pp",2,"Il dentista mi ___ un dente.","A fogorvos kihúzta az egyik fogamat.","Dentysta wyrwał mi ząb.","The dentist pulled one of my teeth.")),
 ("distinguere",3,"megkülönböztet","odróżniać","to distinguish","{pp:'distinto'}",
  ("pres",0,"Non ___ mai i due gemelli.","Sosem tudom megkülönböztetni a két ikret.","Nigdy nie odróżniam tych dwóch bliźniaków.","I can never tell the two twins apart.")),
 ("fingere",2,"tettet, színlel","udawać","to pretend","{pp:'finto'}",
  ("imp",2,"Il bambino ___ di dormire.","A gyerek úgy tett, mintha aludna.","Dziecko udawało, że śpi.","The child was pretending to sleep.")),
 ("costringere",3,"kényszerít","zmuszać","to force","{pp:'costretto'}",
  ("pp",2,"La pioggia ci ___ a tornare indietro.","Az eső visszafordulásra kényszerített minket.","Deszcz zmusił nas do powrotu.","The rain forced us to turn back.")),
 ("dirigere",3,"irányít, vezényel","kierować, dyrygować","to direct, to conduct","{pp:'diretto'}",
  ("imp",2,"Mio zio ___ un'orchestra.","A nagybátyám egy zenekart vezényelt.","Mój wujek dyrygował orkiestrą.","My uncle used to conduct an orchestra.")),
 ("eleggere",3,"megválaszt","wybierać (w głosowaniu)","to elect","{pp:'eletto'}",
  ("pp",5,"Gli studenti ___ Giulia come rappresentante.","A diákok Giuliát választották képviselőnek.","Uczniowie wybrali Giulię na przedstawicielkę.","The students elected Giulia as their representative.")),
 ("rileggere",2,"újraolvas","czytać ponownie","to reread","{pp:'riletto'}",
  ("impv",1,"___ il testo prima di consegnarlo.","Olvasd át újra a szöveget, mielőtt beadod.","Przeczytaj tekst jeszcze raz przed oddaniem.","Reread the text before handing it in.")),
 ("friggere",2,"(olajban) kisüt","smażyć","to fry","{pp:'fritto'}",
  ("pres",2,"La nonna ___ le patate nell'olio d'oliva.","A nagymama olívaolajban süti a krumplit.","Babcia smaży ziemniaki na oliwie.","Grandma fries the potatoes in olive oil.")),
 ("sconfiggere",3,"legyőz","pokonać","to defeat","{pp:'sconfitto'}",
  ("pp",5,"Gli azzurri ___ la Francia.","Az olasz válogatott legyőzte Franciaországot.","Włosi pokonali Francję.","The Italian team beat France.")),
 ("scuotere",3,"ráz","potrząsać, kręcić (głową)","to shake","{pp:'scosso'}",
  ("rem",2,"Il vecchio ___ la testa senza parlare.","Az öreg szó nélkül megcsóválta a fejét.","Starzec bez słowa pokręcił głową.","The old man shook his head without speaking.")),
 ("promuovere",3,"előléptet","awansować (kogoś)","to promote","{pp:'promosso'}",
  ("pp",5,"Mi ___ a direttore.","Igazgatóvá léptettek elő.","Awansowano mnie na dyrektora.","They promoted me to director.")),
 ("commuovere",3,"meghat","wzruszać","to move (emotionally)","{pp:'commosso'}",
  ("pp",2,"Il film mi ___ molto.","A film nagyon meghatott.","Film bardzo mnie wzruszył.","The film moved me deeply.")),
 ("emergere",3,"felbukkan, kiderül","wyłaniać się, wychodzić na jaw","to emerge","{e:1, pp:'emerso'}",
  ("pp",5,"Dall'indagine ___ nuovi dettagli.","A nyomozásból új részletek derültek ki.","Ze śledztwa wyszły na jaw nowe szczegóły.","New details emerged from the investigation.")),
 ("immergere",3,"belemárt, belemerít","zanurzać","to dip, to immerse","{pp:'immerso'}",
  ("impv",1,"___ i biscotti nel latte.","Mártsd a kekszet a tejbe.","Zanurz herbatniki w mleku.","Dip the biscuits in the milk.")),
 ("spargere",3,"szétszór","rozrzucać","to scatter","{pp:'sparso'}",
  ("pp",2,"Il vento ___ le foglie dappertutto.","A szél mindenfelé szétszórta a leveleket.","Wiatr rozrzucił liście wszędzie.","The wind scattered the leaves everywhere.")),
 ("persuadere",3,"rábeszél","namawiać, przekonywać","to persuade","{pp:'persuaso'}",
  ("rem",0,"Alla fine lo ___ a restare.","Végül rábeszéltem, hogy maradjon.","W końcu namówiłem go, żeby został.","In the end I persuaded him to stay.")),
 ("invadere",3,"elözönöl, megszáll","najeżdżać, zalewać","to invade","{pp:'invaso'}",
  ("pres",5,"D'estate i turisti ___ la città.","Nyáron a turisták elözönlik a várost.","Latem turyści zalewają miasto.","In summer tourists invade the city.")),
 ("radere",3,"(le)borotvál","golić","to shave","{pp:'raso'}",
  ("pp",2,"Il barbiere mi ___ la barba.","A borbély leborotválta a szakállamat.","Fryzjer zgolił mi brodę.","The barber shaved off my beard.")),
 ("condividere",2,"megoszt, osztozik","dzielić (się), udostępniać","to share","{pp:'condiviso'}",
  ("pres",0,"___ un appartamento con due amici.","Két barátommal osztozom egy lakáson.","Dzielę mieszkanie z dwójką przyjaciół.","I share a flat with two friends.")),
 ("esplodere",3,"felrobban","wybuchać","to explode","{e:1, pp:'esploso'}",
  ("pp",2,"Una bomba ___ vicino alla stazione.","Egy bomba robbant az állomás közelében.","W pobliżu dworca wybuchła bomba.","A bomb exploded near the station.","f")),
 ("pretendere",3,"elvár, követel","wymagać, żądać","to demand, to expect","{pp:'preteso'}",
  ("pres",2,"Il capo ___ troppo da noi.","A főnök túl sokat vár el tőlünk.","Szef wymaga od nas za dużo.","The boss expects too much from us.")),
 ("intendere",3,"szándékozik; gondol vmire","zamierzać; mieć na myśli","to intend; to mean","{pp:'inteso'}",
  ("pres",1,"Che cosa ___ dire?","Mire gondolsz?","Co masz na myśli?","What do you mean?")),
 ("stendere",3,"kitereget, kiterít","rozwieszać, rozkładać","to hang out, to spread","{pp:'steso'}",
  ("pp",0,"___ il bucato in giardino.","Kiteregettem a ruhákat a kertben.","Rozwiesiłem pranie w ogrodzie.","I hung the washing out in the garden.")),
 ("appendere",3,"felakaszt","wieszać","to hang (up)","{pp:'appeso'}",
  ("impv",1,"___ il cappotto all'attaccapanni.","Akaszd a kabátot a fogasra.","Powieś płaszcz na wieszaku.","Hang your coat on the coat rack.")),
 ("interrompere",2,"félbeszakít","przerywać","to interrupt","{pp:'interrotto'}",
  ("pp",1,"Perché mi ___?","Miért szakítottál félbe?","Dlaczego mi przerwałeś?","Why did you interrupt me?")),
 ("soccorrere",3,"segítségére siet","udzielać pomocy, ratować","to rescue, to help","{pp:'soccorso'}",
  ("pp",5,"I passanti ___ il ciclista ferito.","A járókelők a sérült biciklis segítségére siettek.","Przechodnie udzielili pomocy rannemu rowerzyście.","Passers-by helped the injured cyclist.")),
 ("percorrere",3,"megtesz (utat), bejár","przemierzać, pokonywać","to cover, to travel","{pp:'percorso'}",
  ("pp",3,"___ cinquanta chilometri in bicicletta.","Ötven kilométert tettünk meg biciklivel.","Przejechaliśmy rowerem pięćdziesiąt kilometrów.","We covered fifty kilometres by bike.")),
 ("trascorrere",2,"(időt) eltölt","spędzać (czas)","to spend (time)","{pp:'trascorso'}",
  ("fut",3,"___ il Natale in montagna.","A karácsonyt a hegyekben töltjük.","Święta spędzimy w górach.","We'll spend Christmas in the mountains.")),
 ("occorrere",3,"szükséges, kell","być potrzebnym","to be needed","{e:1, pp:'occorso'}",
  ("pres",5,"Per questa ricetta ___ tre uova.","Ehhez a recepthez három tojás kell.","Do tego przepisu potrzebne są trzy jajka.","This recipe needs three eggs.")),
 ("porgere",3,"odanyújt","podawać","to hand","{pp:'porto'}",
  ("rem",2,"Il cameriere mi ___ il menù.","A pincér átnyújtotta nekem az étlapot.","Kelner podał mi menu.","The waiter handed me the menu.")),
 ("sorgere",3,"felkel (nap), keletkezik","wschodzić, powstawać","to rise","{e:1, pp:'sorto'}",
  ("pres",2,"D'estate il sole ___ presto.","Nyáron korán kel a nap.","Latem słońce wschodzi wcześnie.","In summer the sun rises early.")),
 ("scorgere",3,"megpillant","dostrzegać","to make out, to spot","{pp:'scorto'}",
  ("pp",0,"Da lontano ___ il campanile.","Messziről megpillantottam a harangtornyot.","Z daleka dostrzegłem dzwonnicę.","From afar I made out the bell tower.")),
 ("torcere",3,"kicsavar, csavar","wykręcać","to wring, to twist","{pp:'torto'}",
  ("pp",0,"___ i panni bagnati.","Kicsavartam a vizes ruhákat.","Wykręciłem mokre ubrania.","I wrung out the wet clothes.")),
 ("pungere",3,"megszúr, megcsíp","żądlić, kłuć","to sting, to prick","{pp:'punto'}",
  ("pp",2,"Un'ape mi ___ sul braccio.","Egy méh megcsípett a karomon.","Pszczoła użądliła mnie w rękę.","A bee stung me on the arm.")),
 ("tingere",3,"fest (hajat, anyagot)","farbować","to dye","{pp:'tinto'}",
  ("pp",2,"Sara ___ i capelli di rosso.","Sara vörösre festette a haját.","Sara ufarbowała włosy na rudo.","Sara dyed her hair red.")),
 ("rimpiangere",3,"visszasír","tęsknić za, żałować","to miss, to regret","{pp:'rimpianto'}",
  ("pres",0,"A volte ___ la vita in campagna.","Néha visszasírom a vidéki életet.","Czasem tęsknię za życiem na wsi.","Sometimes I miss life in the countryside.")),
 ("valere",3,"ér (vmennyit)","być wartym","to be worth","{e:1, pres:P('valgo vali vale valiamo valete valgono'), fut:'varr', pp:'valso'}",
  ("pres",2,"Questo quadro ___ una fortuna.","Ez a festmény egy vagyont ér.","Ten obraz jest wart fortunę.","This painting is worth a fortune.")),
 ("parere",3,"tűnik vminek","wydawać się","to seem","{e:1, pres:P('paio pari pare paiamo parete paiono'), fut:'parr', pp:'parso'}",
  ("pres",2,"Mi ___ una buona idea.","Jó ötletnek tűnik.","Wydaje mi się to dobrym pomysłem.","It seems a good idea to me.")),
 ("giacere",3,"fekszik, hever","leżeć","to lie (be lying)","{e:1, pres:P('giaccio giaci giace giacciamo giacete giacciono'), pp:'giaciuto'}",
  ("imp",2,"Il libro ___ sul tavolo da giorni.","A könyv napok óta az asztalon hevert.","Książka od kilku dni leżała na stole.","The book had been lying on the table for days.")),
 ("cucire",2,"varr","szyć","to sew","{pres:P('cucio cuci cuce cuciamo cucite cuciono')}",
  ("imp",2,"La nonna ___ i nostri vestiti.","A nagymama varrta a ruháinkat.","Babcia szyła nam ubrania.","Grandma used to sew our clothes.")),
 ("udire",3,"hall","słyszeć","to hear","{pres:P('odo odi ode udiamo udite odono')}",
  ("rem",0,"All'improvviso ___ un grido.","Hirtelen kiáltást hallottam.","Nagle usłyszałem krzyk.","Suddenly I heard a scream.")),
 ("riempire",2,"megtölt, kitölt","napełniać, wypełniać","to fill (in)","{pres:P('riempio riempi riempie riempiamo riempite riempiono')}",
  ("impv",1,"___ il modulo, per favore.","Töltsd ki az űrlapot, kérlek.","Wypełnij formularz, proszę.","Fill in the form, please.")),
 ("perdersi",2,"eltéved","zgubić się","to get lost","{pp:'perso/perduto'}",
  ("pp",3,"Senza mappa ___ nel centro storico.","Térkép nélkül eltévedtünk az óvárosban.","Bez mapy zgubiliśmy się na starówce.","Without a map we got lost in the old town.")),
 ("muoversi",2,"mozog, siet","ruszać się","to move, to hurry up","{pp:'mosso'}",
  ("impv",1,"___! Siamo in ritardo!","Mozogj már! Késésben vagyunk!","Rusz się! Jesteśmy spóźnieni!","Get a move on! We're late!")),
 # ---- szabályosak ----
 ("accettare",2,"elfogad","przyjmować, akceptować","to accept","{}",("pres",0,"___ volentieri il tuo invito.","Szívesen elfogadom a meghívásodat.","Chętnie przyjmuję twoje zaproszenie.","I gladly accept your invitation.")),
 ("adorare",2,"imád","uwielbiać","to adore","{}",("pres",0,"___ la cucina italiana.","Imádom az olasz konyhát.","Uwielbiam kuchnię włoską.","I love Italian food.")),
 ("affrontare",3,"szembenéz, megbirkózik","stawiać czoła","to face, to tackle","{}",("fut",3,"___ insieme ogni difficoltà.","Együtt nézünk szembe minden nehézséggel.","Razem stawimy czoła każdej trudności.","We'll face every difficulty together.")),
 ("allenarsi",2,"edz","trenować","to train","{}",("imp",0,"Da ragazzo ___ ogni giorno in palestra.","Fiatalon minden nap edzettem a konditeremben.","Jako chłopak codziennie trenowałem na siłowni.","As a boy I trained at the gym every day.")),
 ("analizzare",3,"elemez","analizować","to analyse","{}",("pp",5,"Gli esperti ___ i dati.","A szakértők elemezték az adatokat.","Eksperci przeanalizowali dane.","The experts analysed the data.")),
 ("annullare",3,"lemond, töröl","odwoływać","to cancel","{}",("pp",5,"___ il concerto per la pioggia.","Az eső miatt lemondták a koncertet.","Z powodu deszczu odwołano koncert.","They cancelled the concert because of the rain.")),
 ("apprezzare",2,"értékel, nagyra tart","doceniać","to appreciate","{}",("pres",0,"___ molto il tuo aiuto.","Nagyon értékelem a segítségedet.","Bardzo doceniam twoją pomoc.","I really appreciate your help.")),
 ("approvare",3,"jóváhagy","zatwierdzać","to approve","{}",("pp",2,"Il consiglio ___ il nuovo progetto.","A tanács jóváhagyta az új tervet.","Rada zatwierdziła nowy projekt.","The council approved the new project.")),
 ("aumentare",2,"emel, növel","podnosić, zwiększać","to raise, to increase","{}",("pp",5,"___ di nuovo i prezzi.","Megint emelték az árakat.","Znowu podnieśli ceny.","They've raised the prices again.")),
 ("avvicinarsi",2,"közeledik","zbliżać się","to approach","{}",("pres",5,"Le vacanze ___.","Közeleg a szünidő.","Zbliżają się wakacje.","The holidays are getting closer.")),
 ("bastare",2,"elég","wystarczać","to be enough","{e:1}",("pres",2,"Mi ___ un caffè.","Nekem elég egy kávé.","Wystarczy mi kawa.","A coffee is enough for me.")),
 ("bruciare",2,"odaéget, ég","przypalać, palić się","to burn","{}",("pp",0,"___ la torta nel forno.","Odaégettem a tortát a sütőben.","Przypaliłem ciasto w piekarniku.","I burnt the cake in the oven.")),
 ("bussare",2,"kopog","pukać","to knock","{}",("pp",2,"Qualcuno ___ alla porta.","Valaki kopogott az ajtón.","Ktoś zapukał do drzwi.","Someone knocked at the door.")),
 ("cancellare",2,"töröl","usuwać, kasować","to delete","{}",("pp",0,"Per sbaglio ___ tutte le foto.","Véletlenül kitöröltem az összes fényképet.","Przez pomyłkę usunąłem wszystkie zdjęcia.","I accidentally deleted all the photos.")),
 ("caricare",3,"feltölt, megrak","ładować","to charge, to load","{}",("impv",1,"___ il telefono prima di partire.","Töltsd fel a telefont, mielőtt elindulsz.","Naładuj telefon przed wyjazdem.","Charge your phone before you leave.")),
 ("chiacchierare",2,"beszélget, cseveg","gawędzić","to chat","{}",("imp",3,"___ per ore al bar.","Órákig beszélgettünk a kávézóban.","Godzinami gawędziliśmy w kawiarni.","We used to chat for hours at the café.")),
 ("collaborare",3,"együttműködik","współpracować","to work together","{}",("pres",3,"___ con un'azienda tedesca.","Egy német céggel működünk együtt.","Współpracujemy z niemiecką firmą.","We work with a German company.")),
 ("comunicare",3,"közöl","przekazywać, informować","to communicate, to let know","{}",("fut",0,"Vi ___ i risultati domani.","Holnap közlöm veletek az eredményeket.","Jutro przekażę wam wyniki.","I'll let you know the results tomorrow.")),
 ("confermare",2,"megerősít, visszaigazol","potwierdzać","to confirm","{}",("impv",2,"___ la prenotazione entro venerdì.","Kérem, péntekig erősítse meg a foglalást.","Proszę potwierdzić rezerwację do piątku.","Please confirm your booking by Friday.")),
 ("consegnare",3,"bead, kézbesít","oddawać, dostarczać","to hand in, to deliver","{}",("pp",0,"___ i compiti in ritardo.","Késve adtam be a házi feladatot.","Oddałem pracę domową z opóźnieniem.","I handed in my homework late.")),
 ("conservare",3,"megőriz","przechowywać","to keep, to preserve","{}",("pres",0,"___ tutte le lettere di mia madre.","Megőrzöm anyám összes levelét.","Przechowuję wszystkie listy mojej mamy.","I keep all my mother's letters.")),
 ("considerare",3,"tart vminek, megfontol","uważać za, rozważać","to consider","{}",("pres",5,"Tutti lo ___ un genio.","Mindenki zseninek tartja.","Wszyscy uważają go za geniusza.","Everyone considers him a genius.")),
 ("contare",2,"számol, számít","liczyć","to count","{}",("impv",1,"___ fino a dieci!","Számolj tízig!","Policz do dziesięciu!","Count to ten!")),
 ("copiare",2,"másol, puskáz","kopiować, ściągać","to copy","{}",("pp",2,"Luca ___ il compito dal compagno.","Luca lemásolta a házit az osztálytársától.","Luca ściągnął zadanie od kolegi.","Luca copied his homework from a classmate.")),
 ("curare",2,"gyógyít, gondoz","leczyć, dbać o","to treat, to look after","{}",("pres",2,"Questo medico ___ i bambini.","Ez az orvos gyerekeket gyógyít.","Ten lekarz leczy dzieci.","This doctor treats children.")),
 ("dedicare",3,"szentel, ajánl","dedykować, poświęcać","to dedicate","{}",("pres",0,"___ questa canzone a mia moglie.","Ezt a dalt a feleségemnek ajánlom.","Dedykuję tę piosenkę mojej żonie.","I dedicate this song to my wife.")),
 ("dimostrare",3,"bebizonyít, megmutat","udowadniać, pokazywać","to prove, to show","{}",("pp",1,"___ di essere molto coraggioso.","Bebizonyítottad, hogy nagyon bátor vagy.","Udowodniłeś, że jesteś bardzo odważny.","You've shown you are very brave.")),
 ("disturbare",2,"zavar","przeszkadzać","to disturb","{}",("pres",0,"Scusi se la ___.","Elnézést, hogy zavarom.","Przepraszam, że przeszkadzam.","Sorry to disturb you.")),
 ("dubitare",3,"kételkedik, kétel","wątpić","to doubt","{}",("pres",0,"___ che arrivi in tempo.","Kétlem, hogy időben megérkezik.","Wątpię, żeby zdążył na czas.","I doubt he'll arrive on time.")),
 ("esagerare",2,"túloz","przesadzać","to exaggerate","{}",("pres",1,"Secondo me ___ sempre!","Szerintem mindig túlzol!","Moim zdaniem zawsze przesadzasz!","I think you always exaggerate!")),
 ("fidarsi",2,"megbízik vkiben","ufać","to trust","{}",("pres",0,"Non ___ di lui.","Nem bízom benne.","Nie ufam mu.","I don't trust him.")),
 ("firmare",2,"aláír","podpisywać","to sign","{}",("impv",2,"___ qui, per favore.","Kérem, írja alá itt.","Proszę tu podpisać.","Sign here, please.")),
 ("fotografare",2,"fényképez","fotografować","to photograph","{}",("pp",3,"___ il tramonto dalla terrazza.","A teraszról lefényképeztük a naplementét.","Sfotografowaliśmy zachód słońca z tarasu.","We photographed the sunset from the terrace.")),
 ("frequentare",2,"jár (iskolába, tanfolyamra)","uczęszczać, chodzić do","to attend","{}",("imp",0,"Da ragazzo ___ il liceo classico.","Fiatalon klasszikus gimnáziumba jártam.","Jako chłopak chodziłem do liceum klasycznego.","As a boy I attended a classical high school.")),
 ("gettare",3,"eldob, kidob","wyrzucać","to throw (away)","{}",("pp",2,"Qualcuno ___ i rifiuti nel fiume.","Valaki a folyóba dobta a szemetet.","Ktoś wyrzucił śmieci do rzeki.","Someone threw rubbish into the river.")),
 ("immaginare",2,"elképzel","wyobrażać sobie","to imagine","{}",("pres",0,"___ che tu sia stanco.","Gondolom, fáradt vagy.","Wyobrażam sobie, że jesteś zmęczony.","I imagine you're tired.")),
 ("indossare",2,"visel (ruhát)","mieć na sobie, nosić","to wear","{}",("imp",2,"La sposa ___ un abito bianco.","A menyasszony fehér ruhát viselt.","Panna młoda miała na sobie białą suknię.","The bride was wearing a white dress.")),
 ("invitare",1,"meghív","zapraszać","to invite","{}",("pp",5,"I miei amici mi ___ a cena.","A barátaim meghívtak vacsorára.","Przyjaciele zaprosili mnie na kolację.","My friends invited me to dinner.")),
 ("legare",3,"köt, megköt","wiązać","to tie","{}",("pp",0,"___ la barca al molo.","Kikötöttem a csónakot a mólóhoz.","Przywiązałem łódź do pomostu.","I tied the boat to the pier.")),
 ("litigare",2,"veszekszik","kłócić się","to argue, to quarrel","{}",("imp",5,"I miei fratelli ___ sempre.","A testvéreim mindig veszekedtek.","Moi bracia ciągle się kłócili.","My brothers were always arguing.")),
 ("meritare",3,"megérdemel","zasługiwać","to deserve","{}",("pres",1,"Dopo tanto lavoro, ___ una vacanza.","Ennyi munka után megérdemelsz egy szabadságot.","Po tak ciężkiej pracy zasługujesz na urlop.","After all that work, you deserve a holiday.")),
 ("misurare",3,"mér","mierzyć","to measure","{}",("pp",2,"L'infermiera mi ___ la pressione.","Az ápolónő megmérte a vérnyomásomat.","Pielęgniarka zmierzyła mi ciśnienie.","The nurse took my blood pressure.")),
 ("notare",3,"észrevesz","zauważać","to notice","{}",("pp",1,"___ che Marco era triste?","Észrevetted, hogy Marco szomorú volt?","Zauważyłeś, że Marco był smutny?","Did you notice Marco was sad?")),
 ("occupare",3,"elfoglal","zajmować","to occupy, to take up","{}",("pres",2,"Questo armadio ___ troppo spazio.","Ez a szekrény túl sok helyet foglal.","Ta szafa zajmuje za dużo miejsca.","This wardrobe takes up too much space.")),
 ("pesare",2,"nyom (súlyra), lemér","ważyć","to weigh","{}",("pres",2,"La valigia ___ venti chili.","A bőrönd húsz kilót nyom.","Walizka waży dwadzieścia kilo.","The suitcase weighs twenty kilos.")),
 ("piantare",3,"ültet","sadzić","to plant","{}",("fut",3,"In primavera ___ dei pomodori.","Tavasszal paradicsomot fogunk ültetni.","Wiosną posadzimy pomidory.","In spring we'll plant some tomatoes.")),
 ("presentare",2,"bemutat","przedstawiać","to introduce, to present","{}",("pres",0,"Ti ___ mia sorella.","Bemutatom a húgomat.","Przedstawiam ci moją siostrę.","Let me introduce my sister.")),
 ("pronunciare",2,"kiejt","wymawiać","to pronounce","{}",("cond",1,"Come ___ questa parola?","Hogyan ejtenéd ki ezt a szót?","Jak wymówiłbyś to słowo?","How would you pronounce this word?")),
 ("pubblicare",3,"kiad, közzétesz","publikować, wydawać","to publish","{}",("pp",2,"La scrittrice ___ un nuovo romanzo.","Az írónő új regényt adott ki.","Pisarka wydała nową powieść.","The writer has published a new novel.")),
 ("respirare",2,"lélegzik","oddychać","to breathe","{}",("impv",1,"___ profondamente e rilassati.","Lélegezz mélyeket, és lazíts.","Oddychaj głęboko i się zrelaksuj.","Breathe deeply and relax.")),
 ("rifiutare",2,"visszautasít","odrzucać, odmawiać","to refuse, to turn down","{}",("pp",2,"Anna ___ l'offerta di lavoro.","Anna visszautasította az állásajánlatot.","Anna odrzuciła ofertę pracy.","Anna turned down the job offer.")),
 ("rinunciare",3,"lemond vmiről","rezygnować","to give up","{}",("pp",0,"___ al viaggio per motivi di lavoro.","Munkahelyi okokból lemondtam az utazásról.","Zrezygnowałem z podróży z powodów zawodowych.","I gave up the trip for work reasons.")),
 ("riparare",2,"megjavít","naprawiać","to repair","{}",("pp",2,"Il meccanico ___ la macchina.","A szerelő megjavította az autót.","Mechanik naprawił samochód.","The mechanic repaired the car.")),
 ("rispettare",2,"tisztel, betart","szanować, przestrzegać","to respect","{}",("impv",4,"___ le regole del gioco!","Tartsátok be a játékszabályokat!","Przestrzegajcie zasad gry!","Respect the rules of the game!")),
 ("rubare",2,"lop","kraść","to steal","{}",("pp",5,"Mi ___ il portafoglio in metro.","Ellopták a pénztárcámat a metrón.","Ukradli mi portfel w metrze.","My wallet was stolen on the underground.")),
 ("salvare",2,"ment, megment","zapisywać, ratować","to save","{}",("impv",1,"___ il file prima di chiudere.","Mentsd el a fájlt, mielőtt bezárod.","Zapisz plik przed zamknięciem.","Save the file before closing.")),
 ("saltare",2,"ugrik, kihagy","skakać, opuszczać","to jump, to skip","{}",("pp",0,"Stamattina ___ la colazione.","Ma reggel kihagytam a reggelit.","Dziś rano opuściłem śniadanie.","This morning I skipped breakfast.")),
 ("scappare",2,"elszalad, elszökik","uciekać","to run away","{e:1}",("pp",2,"Il cane ___ dal giardino.","A kutya elszökött a kertből.","Pies uciekł z ogrodu.","The dog ran away from the garden.")),
 ("sopportare",2,"elvisel","znosić","to stand, to bear","{}",("pres",0,"Non ___ il rumore del traffico.","Nem bírom a forgalom zaját.","Nie znoszę hałasu ulicznego.","I can't stand the traffic noise.")),
 ("sottolineare",3,"aláhúz, hangsúlyoz","podkreślać","to underline","{}",("impv",4,"___ i verbi irregolari.","Húzzátok alá a rendhagyó igéket.","Podkreślcie czasowniki nieregularne.","Underline the irregular verbs.")),
 ("spaventare",3,"megijeszt","straszyć","to frighten","{}",("pp",1,"Mi ___!","Megijesztettél!","Przestraszyłeś mnie!","You scared me!")),
 ("sprecare",3,"pazarol","marnować","to waste","{}",("pres",5,"Molte famiglie ___ troppo cibo.","Sok család túl sok ételt pazarol.","Wiele rodzin marnuje za dużo jedzenia.","Many families waste too much food.")),
 ("stampare",2,"nyomtat","drukować","to print","{}",("cond",1,"Mi ___ il biglietto?","Kinyomtatnád nekem a jegyet?","Wydrukowałbyś mi bilet?","Would you print the ticket for me?")),
 ("stancarsi",2,"elfárad","męczyć się","to get tired","{}",("pres",0,"Quando cammino in salita ___ subito.","Ha emelkedőn gyalogolok, hamar elfáradok.","Kiedy idę pod górę, szybko się męczę.","When I walk uphill I get tired quickly.")),
 ("svegliare",2,"felébreszt","budzić","to wake (someone) up","{}",("pp",2,"Il telefono mi ___ alle tre di notte.","A telefon hajnali háromkor felébresztett.","Telefon obudził mnie o trzeciej w nocy.","The phone woke me up at three in the morning.")),
 ("tentare",3,"megpróbál, megkísérel","próbować","to try, to attempt","{}",("congi",1,"Se ___ di nuovo, ci riusciresti.","Ha újra megpróbálnád, sikerülne.","Gdybyś spróbował jeszcze raz, udałoby ci się.","If you tried again, you'd succeed.")),
 ("tirare",2,"húz","ciągnąć","to pull","{}",("impv",1,"___ la porta, non spingere!","Húzd az ajtót, ne told!","Ciągnij drzwi, nie pchaj!","Pull the door, don't push!")),
 ("urlare",2,"ordít, üvölt","wrzeszczeć","to yell","{}",("imp",5,"I bambini ___ in cortile.","A gyerekek üvöltöztek az udvaron.","Dzieci wrzeszczały na podwórku.","The children were yelling in the courtyard.")),
 ("versare",3,"önt, tölt","nalewać","to pour","{}",("impv",2,"Mi ___ un bicchiere d'acqua, per favore.","Kérem, töltsön nekem egy pohár vizet.","Proszę nalać mi szklankę wody.","Please pour me a glass of water.")),
 ("voltare",3,"befordul, megfordít","skręcać, odwracać","to turn","{}",("impv",2,"Al secondo incrocio ___ a sinistra.","A második kereszteződésnél forduljon balra.","Na drugim skrzyżowaniu proszę skręcić w lewo.","At the second crossroads turn left.")),
 ("alzare",2,"felemel","podnosić","to raise, to lift","{}",("impv",4,"___ la mano se avete domande.","Tegyétek fel a kezeteket, ha kérdésetek van.","Podnieście rękę, jeśli macie pytania.","Raise your hand if you have any questions.")),
 ("abbassare",3,"lehalkít, leenged","ściszać, obniżać","to turn down, to lower","{}",("cond",1,"___ il volume, per favore?","Lehalkítanád, kérlek?","Ściszyłbyś, proszę?","Would you turn the volume down, please?")),
 ("vergognarsi",3,"szégyelli magát","wstydzić się","to be ashamed","{}",("pres",0,"___ di quello che ho detto.","Szégyellem, amit mondtam.","Wstydzę się tego, co powiedziałem.","I'm ashamed of what I said.")),
 ("abituarsi",3,"hozzászokik","przyzwyczajać się","to get used to","{}",("pp",0,"___ al clima italiano.","Hozzászoktam az olasz éghajlathoz.","Przyzwyczaiłem się do włoskiego klimatu.","I've got used to the Italian climate.")),
 ("occuparsi",3,"foglalkozik vmivel","zajmować się","to deal with, to work in","{}",("pres",2,"Mia sorella ___ di marketing.","A húgom marketinggel foglalkozik.","Moja siostra zajmuje się marketingiem.","My sister works in marketing.")),
 ("interessarsi",3,"érdeklődik","interesować się","to be interested","{}",("pres",0,"___ di storia antica.","Az ókori történelem érdekel.","Interesuję się historią starożytną.","I'm interested in ancient history.")),
 ("spogliarsi",3,"levetkőzik","rozbierać się","to undress","{}",("impv",2,"___ dietro il paravento, per favore.","Kérem, vetkőzzön le a paraván mögött.","Proszę rozebrać się za parawanem.","Please undress behind the screen.")),
 ("asciugarsi",3,"megtörölközik","wycierać się","to dry oneself","{}",("impv",1,"___ le mani con questo asciugamano.","Töröld meg a kezed ezzel a törölközővel.","Wytrzyj ręce tym ręcznikiem.","Dry your hands with this towel.")),
 ("vestire",2,"öltöztet","ubierać (kogoś)","to dress (someone)","{}",("pres",2,"La mamma ___ la bambina.","Az anya felöltözteti a kislányt.","Mama ubiera córeczkę.","The mother dresses the little girl.")),
 ("nutrire",3,"táplál, etet","karmić, żywić","to feed, to nourish","{}",("pres",5,"Gli uccelli ___ i piccoli con gli insetti.","A madarak rovarokkal etetik a fiókáikat.","Ptaki karmią młode owadami.","Birds feed their young with insects.")),
 ("stupire",3,"meglep, ámulatba ejt","zdumiewać","to amaze","{isc:1}",("pp",2,"La sua risposta mi ___.","A válasza meglepett.","Jego odpowiedź mnie zdumiała.","His answer amazed me.")),
 ("fallire",3,"csődbe megy, kudarcot vall","bankrutować, ponieść porażkę","to fail, to go bankrupt","{isc:1, e:1}",("pp",2,"L'azienda ___ dopo vent'anni.","A cég húsz év után csődbe ment.","Firma zbankrutowała po dwudziestu latach.","The company went bankrupt after twenty years.","f")),
 ("tossire",3,"köhög","kaszleć","to cough","{isc:1}",("imp",2,"Il bambino ___ tutta la notte.","A gyerek egész éjjel köhögött.","Dziecko kaszlało całą noc.","The child was coughing all night.")),
 ("impazzire",3,"megőrül","wariować","to go mad","{isc:1, e:1}",("fut",0,"Con questo rumore ___!","Ebben a zajban megőrülök!","Przy tym hałasie zwariuję!","With this noise I'll go mad!")),
 ("arricchire",3,"gazdagít","wzbogacać","to enrich","{isc:1}",("pres",2,"Viaggiare ___ la mente.","Az utazás gazdagítja a szellemet.","Podróżowanie wzbogaca umysł.","Travelling enriches the mind.")),
 ("diminuire",3,"csökkent, csökken","obniżać, zmniejszać","to reduce, to decrease","{isc:1}",("pp",2,"Il governo ___ le tasse.","A kormány csökkentette az adókat.","Rząd obniżył podatki.","The government lowered taxes.")),
 ("combattere",3,"harcol","walczyć","to fight","{}",("rem",5,"I soldati ___ con coraggio.","A katonák bátran harcoltak.","Żołnierze walczyli dzielnie.","The soldiers fought bravely.")),
 ("riflettere",3,"elgondolkodik","zastanawiać się","to think over, to reflect","{}",("impv",1,"___ bene prima di rispondere.","Gondold át jól, mielőtt válaszolsz.","Zastanów się dobrze, zanim odpowiesz.","Think carefully before answering.")),
 ("premere",3,"megnyom","naciskać","to press","{}",("impv",2,"___ il pulsante verde.","Nyomja meg a zöld gombot.","Proszę nacisnąć zielony przycisk.","Press the green button.")),
 ("spremere",3,"kifacsar","wyciskać","to squeeze","{}",("pp",0,"___ due arance per il succo.","Kifacsartam két narancsot a léhez.","Wycisnąłem dwie pomarańcze na sok.","I squeezed two oranges for juice.")),
]

# passato remoto erős tövek (io, lui/lei, loro)
REM = {'rifare':'rifec','riconoscere':'riconobb','rinascere':'rinacqu','rimettere':'rimis','scommettere':'scommis','riscrivere':'riscriss','accadere':'accadd',
  'ritenere':'ritenn','trattenere':'trattenn','appartenere':'appartenn','convenire':'convenn','intervenire':'intervenn','divenire':'divenn','svenire':'svenn','prevenire':'prevenn',
  'sopravvivere':'sopravviss','convivere':'conviss','provvedere':'provvid','intravedere':'intravid','coinvolgere':'coinvols','sconvolgere':'sconvols','rivolgersi':'rivols',
  'disporre':'dispos','opporsi':'oppos','dedurre':'deduss','sedurre':'seduss','sottrarre':'sottrass','estrarre':'estrass','distinguere':'distins','fingere':'fins','costringere':'costrins',
  'dirigere':'diress','eleggere':'eless','rileggere':'riless','friggere':'friss','sconfiggere':'sconfiss','scuotere':'scoss','promuovere':'promoss','commuovere':'commoss',
  'emergere':'emers','immergere':'immers','spargere':'spars','persuadere':'persuas','invadere':'invas','radere':'ras','condividere':'condivis','esplodere':'esplos',
  'pretendere':'pretes','intendere':'intes','stendere':'stes','appendere':'appes','interrompere':'interrupp','soccorrere':'soccors','percorrere':'percors','trascorrere':'trascors',
  'occorrere':'occors','porgere':'pors','sorgere':'sors','scorgere':'scors','torcere':'tors','pungere':'puns','tingere':'tins','rimpiangere':'rimpians','valere':'vals','parere':'parv',
  'giacere':'giacqu','perdersi':'pers','muoversi':'moss'}
IMPV_TU = {'rifare':"rifai/rifa'"}

def js_line(inf, lvl, hu, opts):
    hu_js = hu.replace("'", "\\'")
    if opts.startswith('TENERE:'):
        return f"tenere('{opts.split(':')[1]}','{hu_js}',{lvl});"
    if opts.startswith('PORRE:'):
        return f"porre('{opts.split(':')[1]}','{hu_js}',{lvl});"
    if opts.startswith('DURRE:'):
        return f"durre('{opts.split(':')[1]}','{hu_js}',{lvl});"
    if opts.startswith('TRARRE:'):
        return f"trarre('{opts.split(':')[1]}','{hu_js}',{lvl});"
    if opts.startswith('VENIRE:'):
        parts = opts.split(':')
        return f"venire2('{parts[1]}','{hu_js}',{lvl},{1 if len(parts)>2 else 0});"
    return f"v('{inf}','{hu_js}',{lvl},{opts});"

def main():
    infs = [x[0] for x in V]
    assert len(infs) == len(set(infs)), 'duplikált ige'
    html_p = os.path.join(ROOT, 'coniuga.html')
    html = open(html_p, encoding='utf8').read()
    existing = set(re.findall(r"^\s*(?:v|ppv)\('([a-z]+)'", html, re.M))
    dup = [i for i in infs if i in existing]
    if dup: sys.exit('Már létező igék: ' + ', '.join(dup))
    # --- JS blokk ---
    lines = ["/* ===== 4. bővítés: további igék (tools/new-verbs.py) ===== */",
             "function venire2(pre, hu, lvl, ess){ v(pre+'venire', hu, lvl, Object.assign({pres:P('vengo vieni viene veniamo venite vengono').map(x=>pre+x), fut:pre+'verr', pp:pre+'venuto'}, ess?{e:1}:{})); }",
             "Object.assign(REM_STRONG, " + repr(REM).replace("'", "'") + ");",
             "Object.assign(IMPV_TU, " + repr(IMPV_TU) + ");"]
    for inf, lvl, hu, pl, en, opts, sent in V:
        lines.append(js_line(inf, lvl, hu, opts))
    block = "\n".join(lines) + "\n"
    anchor = "/* ---- ragozás kiszámítása ---- */"
    marker_s, marker_e = "/*NEW-VERBS-START*/\n", "/*NEW-VERBS-END*/\n"
    if marker_s in html:
        html = re.sub(re.escape(marker_s) + r"[\s\S]*?" + re.escape(marker_e), marker_s + block + marker_e, html)
    else:
        html = html.replace(anchor, marker_s + block + marker_e + "\n" + anchor, 1)
    open(html_p, 'w', encoding='utf8').write(html)
    # --- fordítási fájlok ---
    def upsert(path, rows):
        old = [l for l in open(path, encoding='utf8').read().strip().split('\n') if l]
        keep = [l for l in old if l.split('|')[0] not in infs]
        open(path, 'w', encoding='utf8').write('\n'.join(keep + rows) + '\n')
    upsert(os.path.join(ROOT, 'tools/i18n-verbs.txt'), [f"{x[0]}|{x[3]}|{x[4]}" for x in V])
    sents, sents_tr = [], []
    for inf, lvl, hu, pl, en, opts, s in V:
        t, p, it, shu, spl, sen = s[:6]
        f = '|f' if len(s) > 6 and s[6] == 'f' else ''
        assert it.count('___') == 1, inf
        sents.append(f"{inf}|{t}|{p}|{it}|{shu}{f}")
        sents_tr.append(f"{inf}|{spl}|{sen}")
    upsert(os.path.join(ROOT, 'tools/sentences.txt'), sents)
    upsert(os.path.join(ROOT, 'tools/i18n-sentences.txt'), sents_tr)
    print(f'{len(V)} új ige beírva.')

if __name__ == '__main__':
    main()
