package com.example.utils

import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

object DateUtils {
    private val ID_LOCALE = Locale("id", "ID")
    val INTERNAL_FORMATTER: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    private val DISPLAY_FORMATTER: DateTimeFormatter = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy", ID_LOCALE)

    fun today(): LocalDate {
        // Use device default local time zone
        return LocalDate.now(ZoneId.systemDefault())
    }

    fun toInternalString(date: LocalDate): String = date.format(INTERNAL_FORMATTER)

    fun toDisplayString(date: LocalDate): String {
        val formatted = date.format(DISPLAY_FORMATTER)
        return formatted.replaceFirstChar { if (it.isLowerCase()) it.titlecase(ID_LOCALE) else it.toString() }
    }

    fun fromEpochMillis(millis: Long): LocalDate {
        return Instant.ofEpochMilli(millis).atZone(ZoneId.systemDefault()).toLocalDate()
    }

    fun toEpochMillis(date: LocalDate): Long {
        return date.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli()
    }
}
