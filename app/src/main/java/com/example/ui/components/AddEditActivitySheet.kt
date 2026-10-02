package com.example.ui.components

import android.app.TimePickerDialog
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccessTime
import androidx.compose.material.icons.outlined.NoteAlt
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.SheetState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.ActivityEntity
import com.example.ui.theme.BlushCardBorder
import com.example.ui.theme.BlushPillBg
import com.example.ui.theme.CharcoalDark
import com.example.ui.theme.CharcoalMedium
import com.example.ui.theme.DustyPinkPrimary
import com.example.ui.theme.DustyPinkPrimaryContainer
import java.util.Calendar
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditActivitySheet(
    sheetState: SheetState,
    initialActivity: ActivityEntity?,
    onDismiss: () -> Unit,
    onSave: (title: String, time: String, note: String) -> Unit,
    modifier: Modifier = Modifier
) {
    var title by remember { mutableStateOf("") }
    var time by remember { mutableStateOf("") }
    var note by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val context = LocalContext.current

    LaunchedEffect(initialActivity) {
        if (initialActivity != null) {
            title = initialActivity.title
            time = initialActivity.time
            note = initialActivity.note
        } else {
            title = ""
            time = ""
            note = ""
        }
        errorMessage = null
    }

    val quickSuggestions = listOf(
        "Surah Al-Waqi'ah",
        "Surah Yasin",
        "Surah Al-Mulk",
        "Shalat Dhuha",
        "Shalat Tahajjud",
        "Sedekah Subuh",
        "Membaca 1 Juz",
        "Istighfar 100x",
        "Olahraga",
        "Belajar",
        "Pekerjaan Rumah"
    )

    fun openTimePicker() {
        val calendar = Calendar.getInstance()
        var hour = calendar.get(Calendar.HOUR_OF_DAY)
        var minute = calendar.get(Calendar.MINUTE)

        if (time.isNotBlank() && time.contains(":")) {
            val parts = time.split(":")
            val parsedHour = parts.getOrNull(0)?.toIntOrNull()
            val parsedMinute = parts.getOrNull(1)?.toIntOrNull()
            if (parsedHour != null && parsedMinute != null) {
                hour = parsedHour
                minute = parsedMinute
            }
        }

        TimePickerDialog(
            context,
            { _, selectedHour, selectedMinute ->
                time = String.format(Locale.ROOT, "%02d:%02d", selectedHour, selectedMinute)
            },
            hour,
            minute,
            true
        ).show()
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = Color.White,
        modifier = modifier
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
                .padding(bottom = 20.dp)
                .verticalScroll(rememberScrollState())
                .imePadding()
                .navigationBarsPadding()
        ) {
            // Sheet Title
            Text(
                text = if (initialActivity == null) "+ Tambah Catatan" else "Edit Catatan",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.SemiBold,
                    color = CharcoalDark,
                    fontSize = 19.sp
                )
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Quick suggestion chips
            Text(
                text = "Inspirasi kebaikan cepat:",
                style = MaterialTheme.typography.labelSmall.copy(
                    color = CharcoalMedium,
                    fontWeight = FontWeight.Medium
                )
            )
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                quickSuggestions.forEach { suggestion ->
                    Surface(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .clickable {
                                title = suggestion
                                errorMessage = null
                            },
                        shape = RoundedCornerShape(8.dp),
                        color = BlushPillBg,
                        border = BorderStroke(1.dp, BlushCardBorder)
                    ) {
                        Text(
                            text = suggestion,
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = DustyPinkPrimary,
                                fontWeight = FontWeight.Medium,
                                fontSize = 11.sp
                            ),
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Nama aktivitas (Wajib)
            Text(
                text = "Nama aktivitas",
                style = MaterialTheme.typography.labelMedium.copy(
                    fontWeight = FontWeight.SemiBold,
                    color = CharcoalDark
                )
            )
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = title,
                onValueChange = {
                    title = it
                    if (it.isNotBlank()) errorMessage = null
                },
                placeholder = {
                    Text(
                        "Contoh: Surah Al-Waqi'ah",
                        color = CharcoalMedium.copy(alpha = 0.6f)
                    )
                },
                isError = errorMessage != null,
                supportingText = {
                    if (errorMessage != null) {
                        Text(
                            text = errorMessage ?: "",
                            color = MaterialTheme.colorScheme.error,
                            fontSize = 12.sp
                        )
                    }
                },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("activity_name_input"),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = DustyPinkPrimary,
                    unfocusedBorderColor = BlushCardBorder,
                    cursorColor = DustyPinkPrimary
                )
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Waktu (Opsional)
            Text(
                text = "Waktu (opsional)",
                style = MaterialTheme.typography.labelMedium.copy(
                    fontWeight = FontWeight.SemiBold,
                    color = CharcoalDark
                )
            )
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = time,
                onValueChange = { time = it },
                placeholder = {
                    Text(
                        "Contoh: 06:15",
                        color = CharcoalMedium.copy(alpha = 0.6f)
                    )
                },
                trailingIcon = {
                    IconButton(onClick = { openTimePicker() }) {
                        Icon(
                            imageVector = Icons.Outlined.AccessTime,
                            contentDescription = "Pilih Waktu Jam",
                            tint = DustyPinkPrimary
                        )
                    }
                },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("activity_time_input"),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = DustyPinkPrimary,
                    unfocusedBorderColor = BlushCardBorder,
                    cursorColor = DustyPinkPrimary
                )
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Catatan kecil opsional
            Text(
                text = "Catatan kecil (opsional)",
                style = MaterialTheme.typography.labelMedium.copy(
                    fontWeight = FontWeight.SemiBold,
                    color = CharcoalDark
                )
            )
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = note,
                onValueChange = { note = it },
                placeholder = {
                    Text(
                        "Contoh: Setelah Subuh / 1 juz",
                        color = CharcoalMedium.copy(alpha = 0.6f)
                    )
                },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Outlined.NoteAlt,
                        contentDescription = null,
                        tint = DustyPinkPrimary.copy(alpha = 0.7f),
                        modifier = Modifier.size(18.dp)
                    )
                },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("activity_note_input"),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = DustyPinkPrimary,
                    unfocusedBorderColor = BlushCardBorder,
                    cursorColor = DustyPinkPrimary
                )
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Action Buttons: Batal & Simpan
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = onDismiss,
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp)
                        .testTag("cancel_activity_button"),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, BlushCardBorder),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = CharcoalMedium
                    )
                ) {
                    Text(
                        text = "Batal",
                        fontWeight = FontWeight.Medium,
                        fontSize = 14.sp
                    )
                }

                Button(
                    onClick = {
                        if (title.isBlank()) {
                            errorMessage = "Nama aktivitas belum diisi."
                        } else {
                            onSave(title, time, note)
                        }
                    },
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp)
                        .testTag("save_activity_button"),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DustyPinkPrimary,
                        contentColor = Color.White
                    )
                ) {
                    Text(
                        text = "Simpan",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 14.sp
                    )
                }
            }
        }
    }
}
