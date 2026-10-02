package com.example.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface ActivityDao {
    @Query("SELECT * FROM daily_activities WHERE date = :date ORDER BY sortOrder ASC, id ASC")
    fun getActivitiesForDate(date: String): Flow<List<ActivityEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertActivity(activity: ActivityEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertActivities(activities: List<ActivityEntity>)

    @Update
    suspend fun updateActivity(activity: ActivityEntity)

    @Query("UPDATE daily_activities SET isCompleted = :isCompleted WHERE id = :id")
    suspend fun updateCompletionStatus(id: Long, isCompleted: Boolean)

    @Delete
    suspend fun deleteActivity(activity: ActivityEntity)

    @Query("DELETE FROM daily_activities WHERE id = :id")
    suspend fun deleteActivityById(id: Long)

    @Query("SELECT EXISTS(SELECT 1 FROM date_initializations WHERE date = :date)")
    suspend fun isDateInitialized(date: String): Boolean

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun markDateInitialized(dateInit: DateInitEntity)

    @Query("DELETE FROM daily_activities WHERE date = :date")
    suspend fun deleteAllForDate(date: String)
}
