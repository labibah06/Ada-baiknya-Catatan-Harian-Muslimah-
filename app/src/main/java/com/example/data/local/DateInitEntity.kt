package com.example.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "date_initializations")
data class DateInitEntity(
    @PrimaryKey
    val date: String // YYYY-MM-DD
)
