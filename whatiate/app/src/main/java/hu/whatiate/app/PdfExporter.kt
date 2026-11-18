package hu.whatiate.app

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import java.io.File
import java.time.LocalDate

object PdfExporter {
    private const val W = 595
    private const val H = 842
    private const val M = 40f
    private const val BOTTOM = H - 50f

    // oszlopok: idő | típus | részletek | megjegyzés
    private const val X_TIME = M
    private const val X_TYPE = M + 42f
    private const val X_DETAIL = M + 100f
    private const val X_NOTE = M + 320f
    private const val W_DETAIL = 205
    private const val W_NOTE = W - M.toInt() - X_NOTE.toInt()

    private fun text(size: Float, bold: Boolean = false, color: Int = Color.BLACK) =
        TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
            textSize = size
            this.color = color
            typeface = if (bold) Typeface.DEFAULT_BOLD else Typeface.DEFAULT
        }

    private fun layout(s: String, paint: TextPaint, width: Int): StaticLayout =
        StaticLayout.Builder.obtain(s, 0, s.length, paint, width)
            .setAlignment(Layout.Alignment.ALIGN_NORMAL)
            .setLineSpacing(1.5f, 1f)
            .build()

    fun write(entries: List<Entry>, from: LocalDate, to: LocalDate, file: File) {
        val doc = PdfDocument()
        var pageNo = 0
        var page: PdfDocument.Page? = null
        var canvas: Canvas? = null
        var y = M

        val body = text(10f)
        val bold = text(10f, bold = true)
        val gray = text(9f, color = Color.DKGRAY)
        val dayPaint = text(12f, bold = true)
        val bg = Paint().apply { color = Color.rgb(224, 242, 241) }
        val line = Paint().apply { color = Color.rgb(200, 200, 200); strokeWidth = 0.5f }

        fun newPage() {
            page?.let {
                canvas!!.drawText("$pageNo. oldal", W / 2f - 18f, H - 25f, gray)
                doc.finishPage(it)
            }
            pageNo++
            page = doc.startPage(PdfDocument.PageInfo.Builder(W, H, pageNo).create())
            canvas = page!!.canvas
            y = M
        }

        newPage()
        canvas!!.drawText("What I Ate – étkezési és tünetnapló", M, y + 14f, text(18f, bold = true))
        y += 30f
        canvas!!.drawText(
            "Időszak: ${from.format(dateFmt)} – ${to.format(dateFmt)}    Készült: ${LocalDate.now().format(dateFmt)}",
            M, y + 9f, gray
        )
        y += 16f
        val counts = EntryType.entries.joinToString("   ") { t ->
            "${t.label}: ${entries.count { it.type == t.name }}"
        }
        canvas!!.drawText("Bejegyzések – $counts", M, y + 9f, gray)
        y += 22f

        if (entries.isEmpty()) {
            canvas!!.drawText("Ebben az időszakban nincs bejegyzés.", M, y + 10f, body)
        }

        val days = entries.groupBy { it.timestamp.toLocalDate() }.toSortedMap()
        for ((day, list) in days) {
            // a napfejléc mellé férjen ki legalább az első sor
            if (y + 20f + 30f > BOTTOM) newPage()
            canvas!!.drawRect(M, y, W - M, y + 18f, bg)
            canvas!!.drawText(day.format(dayHeaderFmt), M + 6f, y + 13f, dayPaint)
            y += 24f

            for (e in list) {
                val type = EntryType.from(e.type)
                val detail = layout(e.summary(), body, W_DETAIL)
                val note = layout(e.note, gray, W_NOTE)
                val h = maxOf(detail.height, note.height, 14) + 6f
                if (y + h > BOTTOM) newPage()
                val c = canvas!!
                c.drawText(e.timestamp.toLocalDateTime().format(timeFmt), X_TIME, y + 10f, bold)
                c.drawText(type.label, X_TYPE, y + 10f, body)
                c.save(); c.translate(X_DETAIL, y); detail.draw(c); c.restore()
                if (e.note.isNotBlank()) {
                    c.save(); c.translate(X_NOTE, y); note.draw(c); c.restore()
                }
                y += h
                c.drawLine(M, y - 2f, W - M, y - 2f, line)
            }
            y += 8f
        }

        page?.let {
            canvas!!.drawText("$pageNo. oldal", W / 2f - 18f, H - 25f, gray)
            doc.finishPage(it)
        }
        file.outputStream().use { doc.writeTo(it) }
        doc.close()
    }
}
