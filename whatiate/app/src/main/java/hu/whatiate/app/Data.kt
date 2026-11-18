package hu.whatiate.app

import androidx.room.Dao
import androidx.room.Database
import androidx.room.Delete
import androidx.room.Entity
import androidx.room.Index
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.RoomDatabase
import androidx.room.Transaction
import kotlinx.coroutines.flow.Flow

enum class EntryType(val label: String, val emoji: String) {
    FOOD("Étel", "🍽"),
    SYMPTOM("Tünet", "🤕"),
    STOOL("WC", "🚽"),
    STRESS("Stressz", "😰");

    companion object {
        fun from(name: String): EntryType = entries.firstOrNull { it.name == name } ?: FOOD
    }
}

/**
 * Egyetlen táblában tároljuk mind a négy bejegyzéstípust:
 *  - FOOD:    title = étel neve
 *  - SYMPTOM: title = tünet neve, level = súlyosság 1–5
 *  - STOOL:   level = Bristol-típus 1–7
 *  - STRESS:  level = stressz 1–5
 */
@Entity(tableName = "entries", indices = [Index("timestamp")])
data class Entry(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val type: String,
    val title: String = "",
    val level: Int = 0,
    val note: String = "",
    /** Epoch millisecond, percre kerekítve. */
    val timestamp: Long,
)

@Dao
interface EntryDao {
    @Query("SELECT * FROM entries ORDER BY timestamp DESC, id DESC")
    fun observeAll(): Flow<List<Entry>>

    @Query("SELECT * FROM entries WHERE timestamp BETWEEN :from AND :to ORDER BY timestamp ASC, id ASC")
    suspend fun range(from: Long, to: Long): List<Entry>

    @Query("SELECT * FROM entries ORDER BY timestamp ASC, id ASC")
    suspend fun all(): List<Entry>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entry: Entry): Long

    @Insert
    suspend fun insertAll(entries: List<Entry>)

    @Delete
    suspend fun delete(entry: Entry)

    @Query("DELETE FROM entries")
    suspend fun clear()

    @Transaction
    suspend fun replaceAll(entries: List<Entry>) {
        clear()
        insertAll(entries.map { it.copy(id = 0) })
    }
}

@Database(entities = [Entry::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun dao(): EntryDao
}
