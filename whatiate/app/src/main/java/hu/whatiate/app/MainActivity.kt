package hu.whatiate.app

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TimePicker
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.material3.rememberTimePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneOffset

class MainActivity : ComponentActivity() {
    private val vm: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent { AppTheme { App(vm) } }
    }
}

private val LightColors = lightColorScheme(
    primary = Color(0xFF00796B),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFB2DFDB),
    onPrimaryContainer = Color(0xFF00201C),
    secondaryContainer = Color(0xFFD7EBE8),
    background = Color(0xFFF7FAF9),
    surface = Color(0xFFF7FAF9),
)
private val DarkColors = darkColorScheme(
    primary = Color(0xFF4DB6AC),
    onPrimary = Color(0xFF00201C),
    primaryContainer = Color(0xFF004D43),
    onPrimaryContainer = Color(0xFFB2DFDB),
)

@Composable
fun AppTheme(content: @Composable () -> Unit) {
    val dark = androidx.compose.foundation.isSystemInDarkTheme()
    MaterialTheme(colorScheme = if (dark) DarkColors else LightColors) {
        Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background, content = content)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun App(vm: MainViewModel) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val entries by vm.entries.collectAsState()
    val snackbar = remember { SnackbarHostState() }

    var editorOpen by rememberSaveable { mutableStateOf(false) }
    var editorId by rememberSaveable { mutableLongStateOf(0L) }
    var editorType by rememberSaveable { mutableStateOf(EntryType.FOOD.name) }
    var showExport by rememberSaveable { mutableStateOf(false) }
    var menuOpen by remember { mutableStateOf(false) }
    var pendingRestore by remember { mutableStateOf<android.net.Uri?>(null) }

    val backupLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.CreateDocument("application/json")
    ) { uri ->
        if (uri != null) scope.launch {
            runCatching { vm.backupTo(context, uri) }
                .onSuccess { snackbar.showSnackbar("Mentve: $it bejegyzés") }
                .onFailure { snackbar.showSnackbar("Mentési hiba: ${it.message}") }
        }
    }
    val restoreLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri -> if (uri != null) pendingRestore = uri }

    if (editorOpen) {
        BackHandler { editorOpen = false }
        val existing = entries.firstOrNull { it.id == editorId }
        Editor(
            existing = existing,
            initialType = EntryType.from(editorType),
            entries = entries,
            onClose = { editorOpen = false },
            onSave = { vm.save(it); editorOpen = false },
            onDelete = { existing?.let(vm::delete); editorOpen = false },
        )
        return
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbar) },
        topBar = {
            TopAppBar(
                title = { Text("What I Ate", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background),
                actions = {
                    TextButton(onClick = { showExport = true }) { Text("PDF") }
                    Box {
                        IconButton(onClick = { menuOpen = true }) {
                            Icon(Icons.Default.MoreVert, contentDescription = "Menü")
                        }
                        DropdownMenu(expanded = menuOpen, onDismissRequest = { menuOpen = false }) {
                            DropdownMenuItem(
                                text = { Text("Mentés fájlba (JSON)") },
                                onClick = {
                                    menuOpen = false
                                    backupLauncher.launch("whatiate-mentes-${LocalDate.now()}.json")
                                },
                            )
                            DropdownMenuItem(
                                text = { Text("Visszaállítás fájlból") },
                                onClick = {
                                    menuOpen = false
                                    restoreLauncher.launch(arrayOf("*/*"))
                                },
                            )
                        }
                    }
                },
            )
        },
        bottomBar = {
            Surface(tonalElevation = 3.dp) {
                Row(
                    Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                        .padding(bottom = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    EntryType.entries.forEach { t ->
                        FilledTonalButton(
                            onClick = { editorId = 0; editorType = t.name; editorOpen = true },
                            modifier = Modifier.weight(1f),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 2.dp, vertical = 8.dp),
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(t.emoji, fontSize = 20.sp)
                                Text(t.label, fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        },
    ) { padding ->
        Box(Modifier.padding(padding).fillMaxSize()) {
            if (entries.isEmpty()) {
                Text(
                    "Még nincs bejegyzés.\nAlul válaszd ki, mit szeretnél rögzíteni.",
                    modifier = Modifier.align(Alignment.Center).padding(32.dp),
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            } else {
                EntryList(entries) { e ->
                    editorId = e.id; editorType = e.type; editorOpen = true
                }
            }
        }
    }

    if (showExport) {
        ExportDialog(
            onDismiss = { showExport = false },
            onExport = { from, to ->
                showExport = false
                scope.launch {
                    runCatching {
                        val file = vm.createPdf(context, from, to)
                        val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
                        val send = Intent(Intent.ACTION_SEND).apply {
                            type = "application/pdf"
                            putExtra(Intent.EXTRA_STREAM, uri)
                            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                        }
                        context.startActivity(Intent.createChooser(send, "PDF megosztása"))
                    }.onFailure { snackbar.showSnackbar("PDF hiba: ${it.message}") }
                }
            },
        )
    }

    pendingRestore?.let { uri ->
        AlertDialog(
            onDismissRequest = { pendingRestore = null },
            title = { Text("Visszaállítás") },
            text = { Text("A mostani napló teljes tartalma lecserélődik a fájl tartalmára. Folytatod?") },
            confirmButton = {
                TextButton(onClick = {
                    pendingRestore = null
                    scope.launch {
                        runCatching { vm.restoreFrom(context, uri) }
                            .onSuccess { snackbar.showSnackbar("Visszaállítva: $it bejegyzés") }
                            .onFailure { snackbar.showSnackbar("Visszaállítási hiba: ${it.message}") }
                    }
                }) { Text("Visszaállít") }
            },
            dismissButton = { TextButton(onClick = { pendingRestore = null }) { Text("Mégse") } },
        )
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun EntryList(entries: List<Entry>, onClick: (Entry) -> Unit) {
    val grouped = remember(entries) { entries.groupBy { it.timestamp.toLocalDate() } }
    LazyColumn(Modifier.fillMaxSize(), verticalArrangement = Arrangement.spacedBy(6.dp)) {
        grouped.forEach { (day, list) ->
            stickyHeader(key = day.toString()) {
                Surface(color = MaterialTheme.colorScheme.background, modifier = Modifier.fillMaxWidth()) {
                    Text(
                        day.format(dayHeaderFmt).replaceFirstChar { it.uppercase() },
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                        style = MaterialTheme.typography.titleSmall,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold,
                    )
                }
            }
            items(list.size, key = { list[it].id }) { i ->
                EntryRow(list[i], onClick)
            }
        }
        item { Spacer(Modifier.height(16.dp)) }
    }
}

@Composable
fun EntryRow(e: Entry, onClick: (Entry) -> Unit) {
    val type = EntryType.from(e.type)
    Card(
        modifier = Modifier.padding(horizontal = 12.dp).fillMaxWidth().clickable { onClick(e) },
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
    ) {
        Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.width(52.dp)) {
                Text(
                    e.timestamp.toLocalDateTime().format(timeFmt),
                    fontWeight = FontWeight.Bold,
                )
            }
            Text(type.emoji, fontSize = 22.sp, modifier = Modifier.padding(end = 10.dp))
            Column(Modifier.weight(1f)) {
                Text(e.summary(), style = MaterialTheme.typography.bodyLarge)
                if (e.type == EntryType.STOOL.name) {
                    Text(BRISTOL[(e.level - 1).coerceIn(0, 6)], style = MaterialTheme.typography.bodySmall)
                }
                if (e.note.isNotBlank()) {
                    Text(
                        e.note,
                        style = MaterialTheme.typography.bodySmall,
                        fontStyle = FontStyle.Italic,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun Editor(
    existing: Entry?,
    initialType: EntryType,
    entries: List<Entry>,
    onClose: () -> Unit,
    onSave: (Entry) -> Unit,
    onDelete: () -> Unit,
) {
    val key = existing?.id ?: 0L
    var type by rememberSaveable(key) { mutableStateOf(EntryType.from(existing?.type ?: initialType.name)) }
    var title by rememberSaveable(key) { mutableStateOf(existing?.title ?: "") }
    var level by rememberSaveable(key) { mutableStateOf(existing?.level ?: 0) }
    var note by rememberSaveable(key) { mutableStateOf(existing?.note ?: "") }
    var ts by rememberSaveable(key) { mutableLongStateOf(existing?.timestamp ?: nowMinute()) }
    var showDate by remember { mutableStateOf(false) }
    var showTime by remember { mutableStateOf(false) }
    var confirmDelete by remember { mutableStateOf(false) }

    val valid = when (type) {
        EntryType.FOOD -> title.isNotBlank()
        EntryType.SYMPTOM -> title.isNotBlank() && level in 1..5
        EntryType.STOOL -> level in 1..7
        EntryType.STRESS -> level in 1..5
    }

    // korábbi címek gyakoriság szerint (autocomplete)
    val history = remember(entries, type) {
        val past = entries.filter { it.type == type.name && it.title.isNotBlank() }
            .groupingBy { it.title.trim() }.eachCount()
            .entries.sortedByDescending { it.value }.map { it.key }
        if (type == EntryType.SYMPTOM) (past + SYMPTOM_DEFAULTS).distinct() else past
    }
    val suggestions = remember(history, title) {
        val q = title.trim()
        history.filter { !it.equals(q, ignoreCase = true) && it.contains(q, ignoreCase = true) }.take(8)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (existing == null) "Új bejegyzés" else "Bejegyzés szerkesztése") },
                navigationIcon = {
                    IconButton(onClick = onClose) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Vissza")
                    }
                },
                actions = {
                    if (existing != null) {
                        IconButton(onClick = { confirmDelete = true }) {
                            Icon(Icons.Default.Delete, contentDescription = "Törlés")
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background),
            )
        },
        bottomBar = {
            Surface(tonalElevation = 3.dp) {
                Button(
                    onClick = {
                        onSave(
                            Entry(
                                id = existing?.id ?: 0,
                                type = type.name,
                                title = if (type == EntryType.FOOD || type == EntryType.SYMPTOM) title.trim() else "",
                                level = if (type == EntryType.FOOD) 0 else level,
                                note = note.trim(),
                                timestamp = ts,
                            )
                        )
                    },
                    enabled = valid,
                    modifier = Modifier.fillMaxWidth().padding(16.dp),
                ) { Text("Mentés") }
            }
        },
    ) { padding ->
        Column(
            Modifier.padding(padding).verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                EntryType.entries.forEach { t ->
                    FilterChip(
                        selected = type == t,
                        onClick = { if (type != t) { type = t; title = ""; level = 0 } },
                        label = { Text("${t.emoji} ${t.label}") },
                    )
                }
            }

            if (type == EntryType.FOOD || type == EntryType.SYMPTOM) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text(if (type == EntryType.FOOD) "Mit ettél?" else "Milyen tünet?") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                if (suggestions.isNotEmpty()) {
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        suggestions.forEach { s ->
                            AssistChip(onClick = { title = s }, label = { Text(s) })
                        }
                    }
                }
            }

            when (type) {
                EntryType.SYMPTOM -> ScalePicker("Súlyosság", level) { level = it }
                EntryType.STRESS -> ScalePicker("Stressz szintje", level) { level = it }
                EntryType.STOOL -> {
                    Text("Bristol-skála", style = MaterialTheme.typography.titleSmall)
                    BRISTOL.forEachIndexed { i, desc ->
                        FilterChip(
                            selected = level == i + 1,
                            onClick = { level = i + 1 },
                            label = { Text("${i + 1} – $desc") },
                            modifier = Modifier.fillMaxWidth(),
                        )
                    }
                }
                EntryType.FOOD -> {}
            }

            OutlinedTextField(
                value = note,
                onValueChange = { note = it },
                label = { Text("Megjegyzés (nem kötelező)") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 2,
            )

            Text("Időpont", style = MaterialTheme.typography.titleSmall)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                OutlinedButton(onClick = { showDate = true }) { Text(ts.toLocalDate().format(dateFmt)) }
                OutlinedButton(onClick = { showTime = true }) { Text(ts.toLocalDateTime().format(timeFmt)) }
                TextButton(onClick = { ts = nowMinute() }) { Text("Most") }
            }
        }
    }

    if (showDate) {
        val state = rememberDatePickerState(
            initialSelectedDateMillis = ts.toLocalDate().atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()
        )
        DatePickerDialog(
            onDismissRequest = { showDate = false },
            confirmButton = {
                TextButton(onClick = {
                    state.selectedDateMillis?.let { ms ->
                        val d = Instant.ofEpochMilli(ms).atZone(ZoneOffset.UTC).toLocalDate()
                        ts = LocalDateTime.of(d, ts.toLocalDateTime().toLocalTime()).toMillis()
                    }
                    showDate = false
                }) { Text("OK") }
            },
            dismissButton = { TextButton(onClick = { showDate = false }) { Text("Mégse") } },
        ) { DatePicker(state = state) }
    }

    if (showTime) {
        val cur = ts.toLocalDateTime()
        val state = rememberTimePickerState(cur.hour, cur.minute, is24Hour = true)
        AlertDialog(
            onDismissRequest = { showTime = false },
            confirmButton = {
                TextButton(onClick = {
                    ts = LocalDateTime.of(cur.toLocalDate(), java.time.LocalTime.of(state.hour, state.minute)).toMillis()
                    showTime = false
                }) { Text("OK") }
            },
            dismissButton = { TextButton(onClick = { showTime = false }) { Text("Mégse") } },
            text = { TimePicker(state = state) },
        )
    }

    if (confirmDelete) {
        AlertDialog(
            onDismissRequest = { confirmDelete = false },
            title = { Text("Törlés") },
            text = { Text("Biztosan törlöd ezt a bejegyzést?") },
            confirmButton = {
                TextButton(onClick = { confirmDelete = false; onDelete() }) { Text("Töröl") }
            },
            dismissButton = { TextButton(onClick = { confirmDelete = false }) { Text("Mégse") } },
        )
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ScalePicker(label: String, level: Int, onPick: (Int) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(label, style = MaterialTheme.typography.titleSmall)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            (1..5).forEach { n ->
                FilterChip(selected = level == n, onClick = { onPick(n) }, label = { Text("$n") })
            }
        }
        if (level in 1..5) {
            Text(SCALE_LABELS[level - 1], style = MaterialTheme.typography.bodySmall)
        } else {
            Text("1 = enyhe … 5 = nagyon erős", style = MaterialTheme.typography.bodySmall)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun ExportDialog(onDismiss: () -> Unit, onExport: (LocalDate, LocalDate) -> Unit) {
    var choice by rememberSaveable { mutableStateOf("14") }
    var from by rememberSaveable { mutableLongStateOf(LocalDate.now().minusDays(13).toEpochDay()) }
    var to by rememberSaveable { mutableLongStateOf(LocalDate.now().toEpochDay()) }
    var picking by remember { mutableStateOf<String?>(null) }
    val today = LocalDate.now()

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("PDF export") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("7" to "7 nap", "14" to "14 nap", "30" to "30 nap", "all" to "Összes", "custom" to "Egyéni")
                        .forEach { (k, l) ->
                            FilterChip(selected = choice == k, onClick = { choice = k }, label = { Text(l) })
                        }
                }
                if (choice == "custom") {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                        OutlinedButton(onClick = { picking = "from" }) { Text(LocalDate.ofEpochDay(from).format(dateFmt)) }
                        Text("–")
                        OutlinedButton(onClick = { picking = "to" }) { Text(LocalDate.ofEpochDay(to).format(dateFmt)) }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = {
                val range = when (choice) {
                    "7" -> today.minusDays(6) to today
                    "14" -> today.minusDays(13) to today
                    "30" -> today.minusDays(29) to today
                    "all" -> LocalDate.of(2000, 1, 1) to today
                    else -> LocalDate.ofEpochDay(minOf(from, to)) to LocalDate.ofEpochDay(maxOf(from, to))
                }
                onExport(range.first, range.second)
            }) { Text("PDF készítése") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Mégse") } },
    )

    picking?.let { which ->
        val cur = LocalDate.ofEpochDay(if (which == "from") from else to)
        val state = rememberDatePickerState(
            initialSelectedDateMillis = cur.atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()
        )
        DatePickerDialog(
            onDismissRequest = { picking = null },
            confirmButton = {
                TextButton(onClick = {
                    state.selectedDateMillis?.let { ms ->
                        val d = Instant.ofEpochMilli(ms).atZone(ZoneOffset.UTC).toLocalDate().toEpochDay()
                        if (which == "from") from = d else to = d
                    }
                    picking = null
                }) { Text("OK") }
            },
            dismissButton = { TextButton(onClick = { picking = null }) { Text("Mégse") } },
        ) { DatePicker(state = state) }
    }
}
