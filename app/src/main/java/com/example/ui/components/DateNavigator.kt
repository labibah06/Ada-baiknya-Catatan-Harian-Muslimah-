package com.example.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBackIos
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.outlined.CalendarMonth
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.BlushCardBorder
import com.example.ui.theme.BlushPillBg
import com.example.ui.theme.CharcoalDark
import com.example.ui.theme.CharcoalMedium
import com.example.ui.theme.DustyPinkPrimary
import com.example.ui.theme.DustyPinkPrimaryContainer
import com.example.utils.DateUtils
import java.time.LocalDate

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DateNavigator(
    selectedDate: LocalDate,
    onPreviousDay: () -> Unit,
    onNextDay: () -> Unit,
    onToday: () -> Unit,
    onDateSelected: (LocalDate) -> Unit,
    modifier: Modifier = Modifier
) {
    val isToday = selectedDate == DateUtils.today()
    var showDatePicker by remember { mutableStateOf(false) }

    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Date Display Card (clickable to pick any date)
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .shadow(
                    elevation = 2.dp,
                    shape = RoundedCornerShape(16.dp),
                    spotColor = DustyPinkPrimary.copy(alpha = 0.08f),
                    ambientColor = DustyPinkPrimary.copy(alpha = 0.04f)
                )
                .clip(RoundedCornerShape(16.dp))
                .clickable { showDatePicker = true }
                .testTag("date_display_card"),
            shape = RoundedCornerShape(16.dp),
            color = Color.White,
            border = BorderStroke(1.dp, BlushCardBorder)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = if (isToday) "Hari ini" else "Tanggal yang dipilih",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = DustyPinkPrimary,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 11.sp
                        )
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = DateUtils.toDisplayString(selectedDate),
                        style = MaterialTheme.typography.titleMedium.copy(
                            color = CharcoalDark,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 17.sp
                        )
                    )
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(BlushPillBg)
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Outlined.CalendarMonth,
                        contentDescription = "Pilih Tanggal",
                        tint = DustyPinkPrimary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Pilih",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = DustyPinkPrimary,
                            fontWeight = FontWeight.Medium
                        )
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Navigation Row: ‹ Kemarin | [ Hari Ini ] | Besok ›
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedButton(
                onClick = onPreviousDay,
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp)
                    .testTag("prev_day_button"),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, BlushCardBorder),
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = Color.White,
                    contentColor = CharcoalDark
                )
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBackIos,
                    contentDescription = "Kemarin",
                    modifier = Modifier.size(12.dp),
                    tint = DustyPinkPrimary
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "Kemarin",
                    style = MaterialTheme.typography.labelMedium.copy(
                        fontWeight = FontWeight.Medium,
                        color = CharcoalDark
                    )
                )
            }

            Surface(
                modifier = Modifier
                    .weight(1.1f)
                    .height(44.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .clickable { onToday() }
                    .testTag("today_button"),
                shape = RoundedCornerShape(12.dp),
                color = if (isToday) DustyPinkPrimary else DustyPinkPrimaryContainer,
                border = BorderStroke(
                    1.dp,
                    if (isToday) DustyPinkPrimary else BlushCardBorder
                )
            ) {
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Hari Ini",
                        style = MaterialTheme.typography.labelMedium.copy(
                            fontWeight = FontWeight.SemiBold,
                            color = if (isToday) Color.White else DustyPinkPrimary
                        )
                    )
                }
            }

            OutlinedButton(
                onClick = onNextDay,
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp)
                    .testTag("next_day_button"),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, BlushCardBorder),
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = Color.White,
                    contentColor = CharcoalDark
                )
            ) {
                Text(
                    text = "Besok",
                    style = MaterialTheme.typography.labelMedium.copy(
                        fontWeight = FontWeight.Medium,
                        color = CharcoalDark
                    )
                )
                Spacer(modifier = Modifier.width(4.dp))
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
                    contentDescription = "Besok",
                    modifier = Modifier.size(12.dp),
                    tint = DustyPinkPrimary
                )
            }
        }
    }

    if (showDatePicker) {
        val initialMillis = remember(selectedDate) {
            DateUtils.toEpochMillis(selectedDate)
        }
        val datePickerState = rememberDatePickerState(initialSelectedDateMillis = initialMillis)

        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        val millis = datePickerState.selectedDateMillis
                        if (millis != null) {
                            val picked = DateUtils.fromEpochMillis(millis)
                            onDateSelected(picked)
                        }
                        showDatePicker = false
                    }
                ) {
                    Text(
                        text = "Pilih",
                        color = DustyPinkPrimary,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) {
                    Text(
                        text = "Batal",
                        color = CharcoalMedium
                    )
                }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }
}
