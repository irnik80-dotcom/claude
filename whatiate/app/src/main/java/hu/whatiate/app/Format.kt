package hu.whatiate.app

import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

val HU: Locale = Locale("hu", "HU")

val dateFmt: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy. MM. dd.", HU)
val timeFmt: DateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm", HU)
val dayHeaderFmt: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy. MMMM d., EEEE", HU)

fun zone(): ZoneId = ZoneId.systemDefault()

fun nowMinute(): Long = Instant.now().toEpochMilli().let { it - it % 60_000L }

fun Long.toLocalDateTime(): LocalDateTime = Instant.ofEpochMilli(this).atZone(zone()).toLocalDateTime()
fun Long.toLocalDate(): LocalDate = toLocalDateTime().toLocalDate()

fun LocalDateTime.toMillis(): Long = atZone(zone()).toInstant().toEpochMilli()
fun LocalDate.startMillis(): Long = atStartOfDay(zone()).toInstant().toEpochMilli()
fun LocalDate.endMillis(): Long = plusDays(1).atStartOfDay(zone()).toInstant().toEpochMilli() - 1

val BRISTOL = listOf(
    "Különálló kemény gömbök (nehéz távozás)",
    "Rögös, kolbász alakú",
    "Kolbász alakú, felszínén repedésekkel",
    "Sima, puha kolbász vagy kígyó alakú",
    "Puha, különálló darabok, éles szélekkel",
    "Pépes, rojtos szélű darabok",
    "Vizes, szilárd darabok nélkül",
)

val SCALE_LABELS = listOf("enyhe", "mérsékelt", "közepes", "erős", "nagyon erős")

val SYMPTOM_DEFAULTS = listOf(
    "Hasfájás", "Puffadás", "Hasmenés", "Székrekedés",
    "Hányinger", "Görcs", "Gázképződés", "Fáradtság",
)

/** Rövid leírás a listához és a PDF-hez (cím nélkül az étel esetén is a nevet adja). */
fun Entry.summary(): String = when (EntryType.from(type)) {
    EntryType.FOOD -> title
    EntryType.SYMPTOM -> "$title – $level/5"
    EntryType.STOOL -> "Bristol $level"
    EntryType.STRESS -> "Stressz $level/5"
}
