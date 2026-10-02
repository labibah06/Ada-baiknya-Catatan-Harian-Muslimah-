package com.example.data.repository

import com.example.data.local.ActivityDao
import com.example.data.local.ActivityEntity
import com.example.data.local.DateInitEntity
import kotlinx.coroutines.flow.Flow

class ActivityRepository(private val dao: ActivityDao) {

    fun getActivities(date: String): Flow<List<ActivityEntity>> =
        dao.getActivitiesForDate(date)

    suspend fun initializeDateIfNeeded(date: String) {
        val alreadyInit = dao.isDateInitialized(date)
        if (!alreadyInit) {
            val defaults = listOf(
                ActivityEntity(
                    date = date,
                    title = "🌙 Shalat Subuh",
                    time = "04:35",
                    note = "",
                    isCompleted = false,
                    isDefault = true,
                    sortOrder = 1
                ),
                ActivityEntity(
                    date = date,
                    title = "🌙 Shalat Dzuhur",
                    time = "11:55",
                    note = "",
                    isCompleted = false,
                    isDefault = true,
                    sortOrder = 2
                ),
                ActivityEntity(
                    date = date,
                    title = "🌙 Shalat Ashar",
                    time = "15:10",
                    note = "",
                    isCompleted = false,
                    isDefault = true,
                    sortOrder = 3
                ),
                ActivityEntity(
                    date = date,
                    title = "🌙 Shalat Maghrib",
                    time = "18:00",
                    note = "",
                    isCompleted = false,
                    isDefault = true,
                    sortOrder = 4
                ),
                ActivityEntity(
                    date = date,
                    title = "🌙 Shalat Isya",
                    time = "19:15",
                    note = "",
                    isCompleted = false,
                    isDefault = true,
                    sortOrder = 5
                ),
                ActivityEntity(
                    date = date,
                    title = "📖 Membaca Al-Qur'an",
                    time = "",
                    note = "",
                    isCompleted = false,
                    isDefault = true,
                    sortOrder = 6
                ),
                ActivityEntity(
                    date = date,
                    title = "🤲 Dzikir",
                    time = "",
                    note = "",
                    isCompleted = false,
                    isDefault = true,
                    sortOrder = 7
                )
            )
            dao.insertActivities(defaults)
            dao.markDateInitialized(DateInitEntity(date))
        }
    }

    suspend fun addActivity(date: String, title: String, time: String, note: String): Long {
        val entity = ActivityEntity(
            date = date,
            title = title.trim(),
            time = time.trim(),
            note = note.trim(),
            isCompleted = false,
            isDefault = false,
            sortOrder = 100
        )
        dao.markDateInitialized(DateInitEntity(date))
        return dao.insertActivity(entity)
    }

    suspend fun updateActivity(activity: ActivityEntity) {
        dao.updateActivity(activity)
    }

    suspend fun toggleCompletion(id: Long, completed: Boolean) {
        dao.updateCompletionStatus(id, completed)
    }

    suspend fun deleteActivity(id: Long) {
        dao.deleteActivityById(id)
    }

    suspend fun reloadDefaultsForDate(date: String) {
        dao.deleteAllForDate(date)
        val defaults = listOf(
            ActivityEntity(
                date = date,
                title = "🌙 Shalat Subuh",
                time = "04:35",
                note = "",
                isCompleted = false,
                isDefault = true,
                sortOrder = 1
            ),
            ActivityEntity(
                date = date,
                title = "🌙 Shalat Dzuhur",
                time = "11:55",
                note = "",
                isCompleted = false,
                isDefault = true,
                sortOrder = 2
            ),
            ActivityEntity(
                date = date,
                title = "🌙 Shalat Ashar",
                time = "15:10",
                note = "",
                isCompleted = false,
                isDefault = true,
                sortOrder = 3
            ),
            ActivityEntity(
                date = date,
                title = "🌙 Shalat Maghrib",
                time = "18:00",
                note = "",
                isCompleted = false,
                isDefault = true,
                sortOrder = 4
            ),
            ActivityEntity(
                date = date,
                title = "🌙 Shalat Isya",
                time = "19:15",
                note = "",
                isCompleted = false,
                isDefault = true,
                sortOrder = 5
            ),
            ActivityEntity(
                date = date,
                title = "📖 Membaca Al-Qur'an",
                time = "",
                note = "",
                isCompleted = false,
                isDefault = true,
                sortOrder = 6
            ),
            ActivityEntity(
                date = date,
                title = "🤲 Dzikir",
                time = "",
                note = "",
                isCompleted = false,
                isDefault = true,
                sortOrder = 7
            )
        )
        dao.insertActivities(defaults)
        dao.markDateInitialized(DateInitEntity(date))
    }
}
