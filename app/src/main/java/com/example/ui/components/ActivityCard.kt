package com.example.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccessTime
import androidx.compose.material.icons.outlined.DeleteOutline
import androidx.compose.material.icons.outlined.Edit
import androidx.compose.material.icons.outlined.MoreVert
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
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
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.ActivityEntity
import com.example.ui.theme.BlushCardBorder
import com.example.ui.theme.BlushPillBg
import com.example.ui.theme.CharcoalDark
import com.example.ui.theme.CharcoalMedium
import com.example.ui.theme.CharcoalMuted
import com.example.ui.theme.DustyPinkDark
import com.example.ui.theme.DustyPinkPrimary
import com.example.ui.theme.DustyPinkPrimaryContainer

@Composable
fun ActivityCard(
    activity: ActivityEntity,
    onToggle: (ActivityEntity) -> Unit,
    onEdit: (ActivityEntity) -> Unit,
    onDelete: (ActivityEntity) -> Unit,
    modifier: Modifier = Modifier
) {
    var menuExpanded by remember { mutableStateOf(false) }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .shadow(
                elevation = if (activity.isCompleted) 1.dp else 2.dp,
                shape = RoundedCornerShape(16.dp),
                spotColor = DustyPinkPrimary.copy(alpha = 0.06f),
                ambientColor = DustyPinkPrimary.copy(alpha = 0.03f)
            )
            .testTag("activity_card_${activity.id}"),
        shape = RoundedCornerShape(16.dp),
        color = if (activity.isCompleted) Color(0xFFFCF8FA) else Color.White,
        border = BorderStroke(
            1.dp,
            if (activity.isCompleted) BlushCardBorder.copy(alpha = 0.6f) else BlushCardBorder
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp)
        ) {
            // Header Row: Title & Action Menu
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = activity.title,
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 16.sp,
                            color = if (activity.isCompleted) CharcoalMuted else CharcoalDark,
                            textDecoration = if (activity.isCompleted) TextDecoration.LineThrough else TextDecoration.None
                        ),
                        modifier = Modifier.testTag("activity_title_${activity.id}")
                    )

                    // Time badge if available
                    if (activity.time.isNotBlank()) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(BlushPillBg)
                                .padding(horizontal = 8.dp, vertical = 3.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.AccessTime,
                                contentDescription = "Waktu",
                                modifier = Modifier.size(13.dp),
                                tint = DustyPinkPrimary
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = activity.time,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    fontWeight = FontWeight.Medium,
                                    fontSize = 12.sp,
                                    color = DustyPinkDark
                                )
                            )
                        }
                    }

                    // Note if available
                    if (activity.note.isNotBlank()) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "\"${activity.note}\"",
                            style = MaterialTheme.typography.bodySmall.copy(
                                fontStyle = FontStyle.Italic,
                                fontSize = 12.sp,
                                color = CharcoalMedium
                            )
                        )
                    }
                }

                // 3-dots Menu
                Box {
                    IconButton(
                        onClick = { menuExpanded = true },
                        modifier = Modifier
                            .size(36.dp)
                            .testTag("activity_menu_btn_${activity.id}")
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.MoreVert,
                            contentDescription = "Pilihan Catatan",
                            tint = CharcoalMedium,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    DropdownMenu(
                        expanded = menuExpanded,
                        onDismissRequest = { menuExpanded = false },
                        modifier = Modifier.background(Color.White)
                    ) {
                        DropdownMenuItem(
                            text = { Text("Edit", color = CharcoalDark) },
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.Outlined.Edit,
                                    contentDescription = null,
                                    tint = DustyPinkPrimary,
                                    modifier = Modifier.size(18.dp)
                                )
                            },
                            onClick = {
                                menuExpanded = false
                                onEdit(activity)
                            }
                        )

                        DropdownMenuItem(
                            text = { Text("Hapus", color = DustyPinkDark) },
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.Outlined.DeleteOutline,
                                    contentDescription = null,
                                    tint = DustyPinkDark,
                                    modifier = Modifier.size(18.dp)
                                )
                            },
                            onClick = {
                                menuExpanded = false
                                onDelete(activity)
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Checklist Footer Row: ○ Belum selesai / ✓ Sudah selesai
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .clickable { onToggle(activity) }
                    .padding(vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Circular Checkbox Icon
                Box(
                    modifier = Modifier
                        .size(26.dp)
                        .clip(CircleShape)
                        .background(
                            if (activity.isCompleted) DustyPinkPrimary else Color.Transparent
                        )
                        .border(
                            BorderStroke(
                                1.8.dp,
                                if (activity.isCompleted) DustyPinkPrimary else BlushCardBorder
                            ),
                            shape = CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    if (activity.isCompleted) {
                        Icon(
                            imageVector = Icons.Rounded.Check,
                            contentDescription = "Sudah selesai",
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(10.dp))

                Text(
                    text = if (activity.isCompleted) "Sudah selesai" else "Belum selesai",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = if (activity.isCompleted) FontWeight.SemiBold else FontWeight.Normal,
                        fontSize = 13.sp,
                        color = if (activity.isCompleted) DustyPinkPrimary else CharcoalMedium
                    ),
                    modifier = Modifier.testTag("status_text_${activity.id}")
                )
            }
        }
    }
}
