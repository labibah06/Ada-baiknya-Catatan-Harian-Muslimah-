package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.local.ActivityEntity
import com.example.ui.components.ActivityCard
import com.example.ui.components.AddEditActivitySheet
import com.example.ui.components.AppHeader
import com.example.ui.components.DailySummaryCard
import com.example.ui.components.DateNavigator
import com.example.ui.components.DeleteConfirmationDialog
import com.example.ui.components.EmptyStateView
import com.example.ui.components.GreetingSection
import com.example.ui.theme.CharcoalDark
import com.example.ui.theme.CharcoalMedium
import com.example.ui.theme.DustyPinkPrimary
import com.example.ui.theme.SoftPinkBackground
import com.example.ui.viewmodel.DailyActivityViewModel
import com.example.utils.DateUtils
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DailyNotesScreen(
    viewModel: DailyActivityViewModel,
    modifier: Modifier = Modifier
) {
    val selectedDate by viewModel.selectedDate.collectAsStateWithLifecycle()
    val activities by viewModel.activities.collectAsStateWithLifecycle()

    val totalCount = activities.size
    val completedCount = activities.count { it.isCompleted }
    val isToday = selectedDate == DateUtils.today()

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val scope = rememberCoroutineScope()

    var showAddEditSheet by remember { mutableStateOf(false) }
    var editingActivity by remember { mutableStateOf<ActivityEntity?>(null) }
    var activityToDelete by remember { mutableStateOf<ActivityEntity?>(null) }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = SoftPinkBackground,
        floatingActionButton = {
            if (activities.isNotEmpty()) {
                FloatingActionButton(
                    onClick = {
                        editingActivity = null
                        showAddEditSheet = true
                    },
                    containerColor = DustyPinkPrimary,
                    contentColor = Color.White,
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.testTag("add_activity_fab")
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.Add,
                            contentDescription = "Tambah Catatan",
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Tambah",
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 14.sp
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .widthIn(max = 540.dp)
                    .padding(horizontal = 16.dp),
                contentPadding = PaddingValues(top = 10.dp, bottom = 90.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // 1. App Header (Ada Baiknya - Catatan Harian Muslimah)
                item {
                    AppHeader()
                }

                // 2. Greeting & Inspiration
                item {
                    GreetingSection()
                }

                // 3. Date Navigator (‹ Kemarin | [ Hari Ini ] | Besok ›)
                item {
                    DateNavigator(
                        selectedDate = selectedDate,
                        onPreviousDay = { viewModel.goToPreviousDay() },
                        onNextDay = { viewModel.goToNextDay() },
                        onToday = { viewModel.goToToday() },
                        onDateSelected = { pickedDate -> viewModel.selectDate(pickedDate) }
                    )
                }

                // 4. Daily Summary (Catatan Hari Ini: X / Y selesai, Progress bar, %)
                item {
                    DailySummaryCard(
                        totalCount = totalCount,
                        completedCount = completedCount,
                        isToday = isToday
                    )
                }

                // 5. Activity List Section Header & Add Button
                if (activities.isNotEmpty()) {
                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 4.dp, vertical = 2.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Daftar Aktivitas",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.SemiBold,
                                    color = CharcoalDark,
                                    fontSize = 15.sp
                                )
                            )

                            Button(
                                onClick = {
                                    editingActivity = null
                                    showAddEditSheet = true
                                },
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = DustyPinkPrimary,
                                    contentColor = Color.White
                                ),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                modifier = Modifier.testTag("top_add_activity_button")
                            ) {
                                Icon(
                                    imageVector = Icons.Outlined.Add,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "Catatan",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                    }

                    // Activity Items
                    items(
                        items = activities,
                        key = { it.id }
                    ) { activity ->
                        ActivityCard(
                            activity = activity,
                            onToggle = { viewModel.toggleActivity(it) },
                            onEdit = {
                                editingActivity = it
                                showAddEditSheet = true
                            },
                            onDelete = {
                                activityToDelete = it
                            }
                        )
                    }
                } else {
                    // Empty State
                    item {
                        EmptyStateView(
                            onAddActivity = {
                                editingActivity = null
                                showAddEditSheet = true
                            },
                            onReloadDefaults = {
                                viewModel.reloadDefaults()
                            }
                        )
                    }
                }

                // Bottom Motivation & Quote
                item {
                    Spacer(modifier = Modifier.height(16.dp))
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "“Tak harus banyak, yang penting ada baiknya.”",
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontStyle = FontStyle.Italic,
                                color = CharcoalMedium,
                                fontSize = 13.sp,
                                textAlign = TextAlign.Center
                            ),
                            modifier = Modifier.testTag("bottom_motivation_quote")
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "🌷",
                            fontSize = 14.sp
                        )
                    }
                }
            }
        }
    }

    // Add / Edit Modal BottomSheet
    if (showAddEditSheet) {
        AddEditActivitySheet(
            sheetState = sheetState,
            initialActivity = editingActivity,
            onDismiss = {
                scope.launch { sheetState.hide() }.invokeOnCompletion {
                    showAddEditSheet = false
                    editingActivity = null
                }
            },
            onSave = { title, time, note ->
                if (editingActivity != null) {
                    val updated = editingActivity!!.copy(
                        title = title,
                        time = time,
                        note = note
                    )
                    viewModel.updateActivity(updated)
                } else {
                    viewModel.addActivity(title, time, note)
                }
                scope.launch { sheetState.hide() }.invokeOnCompletion {
                    showAddEditSheet = false
                    editingActivity = null
                }
            }
        )
    }

    // Delete Confirmation Dialog
    if (activityToDelete != null) {
        DeleteConfirmationDialog(
            itemTitle = activityToDelete!!.title,
            onConfirm = {
                val id = activityToDelete!!.id
                viewModel.deleteActivity(id)
                activityToDelete = null
            },
            onDismiss = {
                activityToDelete = null
            }
        )
    }
}
