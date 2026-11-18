package hu.whatiate.app

import android.app.Application
import android.content.Context
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import androidx.room.Room
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.time.LocalDate

class MainViewModel(app: Application) : AndroidViewModel(app) {
    private val db = Room.databaseBuilder(app, AppDatabase::class.java, "whatiate.db").build()
    private val dao = db.dao()

    val entries: StateFlow<List<Entry>> =
        dao.observeAll().stateIn(viewModelScope, SharingStarted.Eagerly, emptyList())

    fun save(entry: Entry) = viewModelScope.launch { dao.upsert(entry) }

    fun delete(entry: Entry) = viewModelScope.launch { dao.delete(entry) }

    /** PDF a megadott időszakról; a fájlt a gyorsítótárban hozza létre. */
    suspend fun createPdf(context: Context, from: LocalDate, to: LocalDate): File =
        withContext(Dispatchers.IO) {
            val list = dao.range(from.startMillis(), to.endMillis())
            val dir = File(context.cacheDir, "exports").apply { mkdirs() }
            dir.listFiles()?.forEach { it.delete() }
            val file = File(dir, "whatiate-${from}_${to}.pdf")
            PdfExporter.write(list, from, to, file)
            file
        }

    suspend fun backupTo(context: Context, uri: Uri): Int = withContext(Dispatchers.IO) {
        val list = dao.all()
        val arr = JSONArray()
        list.forEach {
            arr.put(
                JSONObject()
                    .put("type", it.type)
                    .put("title", it.title)
                    .put("level", it.level)
                    .put("note", it.note)
                    .put("timestamp", it.timestamp)
            )
        }
        val root = JSONObject().put("app", "WhatIAte").put("version", 1).put("entries", arr)
        context.contentResolver.openOutputStream(uri, "wt")!!.use {
            it.write(root.toString(2).toByteArray(Charsets.UTF_8))
        }
        list.size
    }

    /** Visszaállítás: a jelenlegi napló teljes cseréje a fájl tartalmára. */
    suspend fun restoreFrom(context: Context, uri: Uri): Int = withContext(Dispatchers.IO) {
        val text = context.contentResolver.openInputStream(uri)!!.use {
            it.readBytes().toString(Charsets.UTF_8)
        }
        val root = JSONObject(text)
        require(root.optString("app") == "WhatIAte") { "Ez nem What I Ate mentés." }
        val arr = root.getJSONArray("entries")
        val list = (0 until arr.length()).map {
            val o = arr.getJSONObject(it)
            Entry(
                type = EntryType.from(o.getString("type")).name,
                title = o.optString("title"),
                level = o.optInt("level"),
                note = o.optString("note"),
                timestamp = o.getLong("timestamp"),
            )
        }
        dao.replaceAll(list)
        list.size
    }
}
