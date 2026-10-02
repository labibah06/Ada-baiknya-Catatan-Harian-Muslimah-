package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = DustyPinkPrimary,
    onPrimary = DustyPinkOnPrimary,
    primaryContainer = DustyPinkPrimaryContainer,
    onPrimaryContainer = DustyPinkOnPrimaryContainer,
    secondary = DustyPinkDark,
    onSecondary = Color.White,
    secondaryContainer = BlushPillBg,
    onSecondaryContainer = CharcoalDark,
    tertiary = SoftRoseAccent,
    onTertiary = Color.White,
    background = SoftPinkBackground,
    onBackground = CharcoalDark,
    surface = CardSurfaceWhite,
    onSurface = CharcoalDark,
    surfaceVariant = BlushPillBg,
    onSurfaceVariant = CharcoalMedium,
    outline = BlushCardBorder,
    outlineVariant = DividerSoft
)

private val DarkColorScheme = darkColorScheme(
    primary = SoftRoseAccent,
    onPrimary = CharcoalDark,
    primaryContainer = DustyPinkDark,
    onPrimaryContainer = DustyPinkPrimaryContainer,
    secondary = DustyPinkPrimary,
    onSecondary = Color.White,
    background = Color(0xFF1E1A1C),
    onBackground = Color(0xFFF4ECEF),
    surface = Color(0xFF292427),
    onSurface = Color(0xFFF4ECEF),
    surfaceVariant = Color(0xFF383135),
    onSurfaceVariant = Color(0xFFD7CCD1),
    outline = Color(0xFF4D4348)
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
