package com.example.ui.components

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.CharcoalDark
import com.example.ui.theme.CharcoalMedium
import com.example.ui.theme.DustyPinkDark

@Composable
fun DeleteConfirmationDialog(
    itemTitle: String,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "Hapus catatan ini?",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.SemiBold,
                    color = CharcoalDark,
                    fontSize = 17.sp
                )
            )
        },
        text = {
            Text(
                text = "Catatan \"$itemTitle\" akan dihapus dari daftar hari ini.",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = CharcoalMedium,
                    fontSize = 14.sp
                )
            )
        },
        confirmButton = {
            Button(
                onClick = onConfirm,
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = DustyPinkDark,
                    contentColor = Color.White
                ),
                modifier = Modifier.testTag("delete_confirm_button")
            ) {
                Text(
                    text = "Hapus",
                    fontWeight = FontWeight.SemiBold
                )
            }
        },
        dismissButton = {
            TextButton(
                onClick = onDismiss,
                modifier = Modifier.testTag("delete_cancel_button")
            ) {
                Text(
                    text = "Batal",
                    color = CharcoalMedium
                )
            }
        },
        containerColor = Color.White,
        shape = RoundedCornerShape(16.dp),
        modifier = modifier
    )
}
