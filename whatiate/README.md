# What I Ate

Egyszerű Android étkezési / tünetnapló (IBS követéséhez). Kotlin, Jetpack Compose, Room (SQLite), magyar felület.

- Bejegyzéstípusok: 🍽 étel (autocomplete), 🤕 tünet (1–5), 🚽 WC (Bristol 1–7), 😰 stressz (1–5), mindegyikhez megjegyzés.
- Időpont percre pontosan, alapból a mostani; dátum és idő utólag szabadon állítható.
- Napi bontású napló, szerkesztés és törlés.
- PDF export (7/14/30 nap, összes vagy egyéni időszak), megosztható.
- Mentés / visszaállítás JSON fájlba.

## Build

    ./gradlew assembleRelease   # app/build/outputs/apk/release/app-release.apk

Az `WhatIAte.apk` a kész, aláírt release build. A `whatiate-release.keystore` (jelszó: `whatiate`) csak
sideload-hoz való: ugyanezzel a kulccsal aláírt új verzió a régi fölé telepíthető az adatok elvesztése nélkül.
Play Store-ba ne ezt használd.
