# Prompt: tantárgyi gyakorló webalkalmazás (matek, fizika, kémia, történelem)

> Másold be ezt egy új Claude Code beszélgetés elejére. A szögletes zárójeles részeket ([…]) töltsd ki vagy töröld.

---

Egy gyakorló webalkalmazást szeretnék matek, fizika, kémia és történelem tanulásához. Egy korábbi projektben (Coniuga, olasz/spanyol igeragozás gyakorló) sok minden bevált. Az alábbiakban leírom, mit és hogyan csinálj, és milyen hibákat kerülj el.

## Kik vagyunk, hogyan dolgozz velem

- Magyar vagyok, magyarul válaszolj. Nem vagyok programozó: minden beállítási lépést kattintásról kattintásra írj le, a gomb pontos (angol) nevével, és azzal, hogy hol találom. Gyakran telefonról (iOS) dolgozom, ott sok menü máshol van vagy hiányzik. Ha nem találok valamit, kérj képernyőképet.
- A feleségem tanár, ő is használja, és a diákjai is (köztük [lengyel] diákok). Ez játékprojekt, néhány felhasználóval: ne riogass kvótákkal és üzemeltetési kockázatokkal, csak ha tényleg számít.
- Minden nagyobb lépés után: teszteld, commitold, pushold, frissítsd az artifactot, és röviden írd meg magyarul, mi készült el, és van-e teendőm.
- Ha valamit rosszul mondtál, javítsd ki nyíltan. Mielőtt teendőt adsz, ellenőrizd a tényleges állapotot. (Egyszer azt írtad, hogy „olvaszd be a main-be”, pedig a weboldal közvetlenül a fejlesztési ágból települt.)

## Felépítés (ez bevált)

1. **Egyetlen HTML-fájl a forrás** (pl. `tanulo.html`). Ez fut Claude-artifactként is, és ebből készül a weboldal.
   - `tools/build-site.mjs` generálja a `docs/index.html`-t: hozzáadja a bejelentkezést, a tanári nézetet és az `auth.js` modult.
   - A build szövegrészletekhez (anchorokhoz) igazodik. Ha a markup változik, frissíteni kell őket, és a build hibát dob, ha egy anchor nem található.
2. **Tantárgyanként külön „motor”** (adat + feladatgenerátor + ellenőrző) `<script type="text/x-engine" id="engine-…">` blokkokban.
   - Egy kis betöltő szkript a választott tárgy motorját futtatja: a szövegét új `<script>` elemként a betöltő után szúrja be.
   - Minden motor ugyanazokat a neveket adja (pl. `TOPICS`, `generate(topic, level)`, `check(answer, task)`, `explain(task)`), így a felület közös.
   - Tárgyváltás: a választás `localStorage`-ba kerül, utána újratöltés. Ha a tároló nem elérhető (pl. artifactban), `?subject=` URL-paraméter.
   - Nagyobb motort külön fájlban írj (`tools/engine-matek.js`), Node-ban teszteld, és egy `embed-*.mjs` szkript másolja jelölők közé a HTML-be.
3. **Weboldal: GitHub Pages** a `/docs` mappából.
   - Ingyenes fióknál a repónak nyilvánosnak kell lennie: titok nem kerülhet a repóba.
   - A Firebase-konfiguráció nyilvános lehet, azt a szabályok védik.
4. **Bejelentkezés és mentés: Firebase** (Authentication: Google + e-mail/jelszó; Firestore).
   - Minden felhasználónak egy profil-dokumentuma van: `users/{uid}`.
   - A válaszok naplója az `answers` alkollekcióba kerül.
   - Kijelentkezve minden `localStorage`-ba ment, bejelentkezve a fiókba.
   - Több tárgynál az adatokat tárgyanként külön mezőbe tedd. Mentéskor a többi tárgy mezőit változatlanul írd vissza, mert a `set()` az egész dokumentumot felülírja. A beállítások és a haladás (napi cél, sorozat) legyen közös.
   - Beállítási buktatók:
     - Authorized domains: `<user>.github.io` és `<projekt>.firebaseapp.com`.
     - Az adatbázis helye: `eur3`, production mode.
     - A szabályokat a konzolban kell bemásolni, és mindig a teljes szöveget add meg.
5. **Tanári nézet** (csak a tanár e-mail-címével és ellenőrzött e-mail-címmel).
   - Táblázatban látszik minden diák összesítése; egy diákra kattintva a teljes válasznapló (mit írt, mi lett volna a jó válasz, mikor).
   - A tanár címét a nyilvános repóban helyőrző jelölje, a valódi cím csak a konzolban legyen.
6. **AI:** Gemini ingyenes kerettel, egy **Cloudflare Workeren** keresztül. A kulcs a Worker titkos változója (Secret).
   - A Worker ellenőrzi a Firebase ID-tokent, beállítja a CORS-t (csak a saját domain), és felhasználónként napi limitet tart.
   - Ne legyen nyilvános teszt-végpont, mert azzal bárki elhasználhatja a kvótát.
   - A `wrangler.toml` tartalmazza: `keep_vars = true`. A Worker a GitHubról települ: ellenőrizd, melyik ágat figyeli.
   - Az artifactban a Claude `sample` képességét használd ugyanazokkal a promptokkal.
   - A promptok egy közös modulban legyenek (`tools/ai-prompts.js`): sanitize, buildPrompt, JSON-séma, normalize. A Worker importálja, a HTML-be pedig egy embed-szkript másolja.
7. **Többnyelvű felület** az elejétől: `I18N` kulcs → [hu, pl, en], a `t(key, vars)` függvény, `data-i18n` attribútumok. A tartalom (feladatszöveg, magyarázat) is legyen lefordítva. Ha a szöveg a tárgy nevét tartalmazza, kezeld cserével vagy `kulcs@tárgy` felülírással.

## AI-szabályok (ezeken sokat tanultunk)

- **Az AI ne számoljon és ne döntsön a helyességről, ha a kód ezt meg tudja tenni.**
  - A helyes eredményt a kód állítja elő, és a promptba „ellenőrzött megoldásként” kerül bele.
  - Az AI csak magyaráz, tippet ad, szöveges választ értékel.
  - (Az igéknél az AI a helyes alakot is „kijavította”, amíg a promptban nem volt benne az ellenőrzött alak.)
- Mindig JSON-sémás válasz legyen, a kliensen `normalize()` és ellenőrzés.
- Ha a válasz hibás (`looksBroken`: üres mező, értelmetlen vagy nem latin karakterek), egyszer próbálja újra egy másik modellel.
- A modellek elavulnak és lelassulnak (a 2.5-ös Gemini 404-et adott, a „latest” 30–40 mp-ig tartott).
  - Gyors modell kell rövid feladatra, erősebb a hosszúra, minimális „thinking”-gel.
  - Teljes időkeret kb. 50 mp, modellenként 15/30 mp, a kliensen 65 mp-es timeout és barátságos hibaüzenet.
  - A `?models=1` lekérdezéssel lehet listázni az elérhető modelleket.
- Hőmérséklet: értékelésnél kb. 0,2, beszélgetésnél 0,7, történetnél 0,8–0,9.
- Történelemnél a hallucináció a fő veszély.
  - A tényadatok (évszámok, nevek, események) egy kézzel összeállított, ellenőrzött adatkészletből jöjjenek.
  - Az AI-tól csak elbeszélő, értelmező szöveget kérj, és írja oda, ha bizonytalan.
  - A generált szöveg mellé tedd ki a felhasznált tényeket.

## Funkciók, amelyek beváltak, és a tantárgyi megfelelőjük

| Coniuga | Matek / fizika / kémia / történelem |
|---|---|
| Ragozás: generált feladat, kóddal ellenőrizve, „elnéző” mód (ékezethiba külön jelölve) | Paraméteres feladatgenerátorok szintekkel. Elnéző ellenőrzés: egyenértékű alakok (1/2 = 0,5 = 0.5), tizedesvessző/pont, numerikus tűrés, mértékegység-átváltás, értékes jegyek. A „majdnem jó” külön kategória (pl. jó szám, rossz mértékegység). |
| 4 lehetőség közül (szójelentés) | Feleletválasztós fogalom-, képlet- és évszámfelismerés; a rossz válaszok tipikus hibákból generálva (előjelhiba, elcsúszott tizedesvessző, szomszédos évszázad). |
| Mondatok (hiányzó ige) | Hiányos levezetés vagy képlet kitöltése; kémiai egyenlet rendezése (együtthatók); idővonal-sorrendbe rakás. |
| Igetár részletes lappal + példamondattal | Képlettár / fogalomtár / periódusos rendszer / kronológia, kidolgozott példával és „Gyakorold ezt” gombbal. |
| Fordítás AI-javítással | Saját megoldás (levezetés, esszé, forráselemzés) értékelése AI-val, pontszámmal és hibalistával; a végeredményt a kód ellenőrzi. |
| Beszélgetés (szerepjáték) | „Interjú történelmi személlyel”, vagy szókratészi tanár, aki kérdésekkel vezet rá a megoldásra, és nem mondja meg rögtön. |
| Olvasás + szövegértési kérdések; saját szöveg beillesztése | Saját jegyzet vagy tankönyvi szöveg beillesztése: az AI kérdéseket és fogalommagyarázatot készít. |
| Kaland (lapozgatós könyv, döntések) | Történelmi kalandjáték (pl. „1848 márciusában vagy Pesten…”) a tényadatkészletre építve; fizika/kémia „laborszabadulószoba” feladatsorral. |
| Koppintható szó → buborék a jelentéssel | Koppintható fogalom vagy képletjel → buborék a definícióval, mértékegységgel; ☆ gombbal kártyába menthető. |
| Ismétlés (egyszerűsített SM-2, rossz válaszból automatikus kártya) | Ugyanez: a hibás feladattípusokból és fogalmakból automatikus ismétlőkártya. |
| Haladás: napi cél, sorozat, jelvények, heti ranglista (önkéntes, csak becenév + pont) | Ugyanez. A ranglista külön `board/{uid}` gyűjteményben, szigorú szabállyal (csak a megengedett mezők, típus- és méretkorlát). |
| Eredménynapló fülenként, statisztika feladattípusonként | Ugyanez témakörönként: melyik témában gyenge a diák (a tanári nézetben is). |
| PDF-export nyomtatással | Feladatlap, megoldókulcs és tanári riport PDF-be. |
| Lassú felolvasás és mondatkiemelés | Felolvasás történelmi szövegekhez, diszlexiás vagy fáradt olvasóknak. |

## Tárgyspecifikus tanácsok

- **Matek:**
  - Képletmegjelenítés KaTeX-kel (cdnjs-ről, rögzített verzióval).
  - Kifejezések ekvivalenciájának ellenőrzése math.js-szel: véletlen pontokban kiértékelve összehasonlítja a diák kifejezését a helyessel.
  - Lépésenkénti megoldás: minden lépést külön ellenőrizz.
  - Grafikonhoz egyszerű saját SVG elég.
- **Fizika:**
  - Mértékegységek kezelése (SI-prefixek, átváltás), értékes jegyek.
  - Képlettár a jelek jelentésével.
  - A generált feladatok fizikailag értelmes tartományban mozogjanak.
- **Kémia:**
  - Periódusos rendszer adatai beágyazva; moláris tömeg számolása kóddal.
  - Egyenletrendezés ellenőrzése atommérleggel; nevezéktan (név ↔ képlet) gyakorlása.
  - Alsó/felső indexek beírásához kis gombsor, úgy, ahogy az ékezetgombok működtek.
- **Történelem:**
  - Évszám-feladatoknál tűréshatár (pl. ±1 év = „majdnem jó”) és évszázad-felismerés.
  - Ok–okozat párosítás, forrásrészlet + kérdések.
  - Térképhez egyszerű SVG, nem külső szolgáltatás.

## Technikai buktatók, amelyekbe beleszaladtunk

- Template literálon belül a `'…${…}…'` keverése szintaxishibát okozott. Minden változtatás után futtass szintaxis-ellenőrzést az összes inline szkriptre (`new Function(...)`).
- Python-patch-szkriptben az aposztrófok escape-elése törte a JS-stringeket. A szöveget inkább fogalmazd át, vagy használj külön fájlt.
- iOS: nyomtatás után a tartalmat NEM szabad törölni (`afterprint`), különben a PDF vége lemarad.
- Az artifactban nincs nyomtatás, és a `localStorage` sem biztos: try/catch kell, és a funkciót el kell rejteni.
- A Safari beszédfelismerése gyenge vagy hiányzik: jelezd, és legyen tartalék megoldás.
- Az ékezet- vagy jelgombsor `textarea`-ban és `input`-ban is működjön (az utoljára fókuszált mezőbe írjon).
- Ha egy tárgy motorja hiányzó adatra hivatkozik (pl. a nyelvtan fül csak olaszhoz volt), a fület rejtsd el, és a generátor induláskor se fusson le, különben az egész oldal elszáll.
- Alapértelmezett értékek (pl. kiválasztott elem) tárgyanként: egy olyan elem, ami csak az egyik tárgyban létezik, a másikban összeomlást okoz.

## Munkamódszer

- Fázisokban dolgozz, mindegyik végén: build, szintaxis-ellenőrzés, Playwright-teszt (a Chromium előre telepítve van, nem kell `playwright install`), telefonméretű képernyőkép, commit, push, artifact-frissítés.
- A generátorokat tömegesen teszteld Node-ban vagy a böngészőben: több ezer generált feladatnál minden megadott jó válasznak át kell mennie az ellenőrzőn.
- Az adatfájlok (feladatbank, fogalmak, fordítások) legyenek külön szövegfájlokban (`tools/*.txt`), és szkript ágyazza be őket.
- A README-ben legyen benne a beüzemelés lépésről lépésre, és minden szkript célja.

## Első lépés

[Írd ide, mivel kezdjen, pl.: „Kezdd a matek motorral (törtek, egyenletek, százalékszámítás, 3 szint), egyetlen HTML-fájlként artifactban. A bejelentkezést és a weboldalt később tesszük hozzá, a Coniuga mintájára.”]
