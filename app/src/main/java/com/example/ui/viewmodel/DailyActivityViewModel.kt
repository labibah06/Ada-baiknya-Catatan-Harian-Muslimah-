package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.ActivityEntity
import com.example.data.repository.ActivityRepository
import com.example.utils.DateUtils
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.time.LocalDate

@OptIn(ExperimentalCoroutinesApi::class)
class DailyActivityViewModel(
    private val repository: ActivityRepository
) : ViewModel() {

    private val _selectedDate = MutableStateFlow(DateUtils.today())
    val selectedDate: StateFlow<LocalDate> = _selectedDate.asStateFlow()

    init {
        // Initialize defaults for today on initial launch
        viewModelScope.launch {
            repository.initializeDateIfNeeded(DateUtils.toInternalString(DateUtils.today()))
        }
    }

    val activities: StateFlow<List<ActivityEntity>> = _selectedDate
        .flatMapLatest { date ->
            val dateStr = DateUtils.toInternalString(date)
            // Ensure date initialized if user visits it
            repository.initializeDateIfNeeded(dateStr)
            repository.getActivities(dateStr)
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun goToPreviousDay() {
        _selectedDate.value = _selectedDate.value.minusDays(1)
    }

    fun goToNextDay() {
        _selectedDate.value = _selectedDate.value.plusDays(1)
    }

    fun goToToday() {
        _selectedDate.value = DateUtils.today()
    }

    fun selectDate(date: LocalDate) {
        _selectedDate.value = date
    }

    fun toggleActivity(activity: ActivityEntity) {
        viewModelScope.launch {
            repository.toggleCompletion(activity.id, !activity.isCompleted)
        }
    }

    fun addActivity(title: String, time: String, note: String) {
        viewModelScope.launch {
            val dateStr = DateUtils.toInternalString(_selectedDate.value)
            repository.addActivity(date = dateStr, title = title, time = time, note = note)
        }
    }

    fun updateActivity(activity: ActivityEntity) {
        viewModelScope.launch {
            repository.updateActivity(activity)
        }
    }

    fun deleteActivity(id: Long) {
        viewModelScope.launch {
            repository.deleteActivity(id)
        }
    }

    fun reloadDefaults() {
        viewModelScope.launch {
            val dateStr = DateUtils.toInternalString(_selectedDate.value)
            repository.reloadDefaultsForDate(dateStr)
        }
    }
}
