package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.example.data.local.AppDatabase
import com.example.data.repository.ActivityRepository
import com.example.ui.screens.DailyNotesScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.viewmodel.DailyActivityViewModel
import com.example.ui.viewmodel.DailyActivityViewModelFactory

class MainActivity : ComponentActivity() {

    private val viewModel: DailyActivityViewModel by viewModels {
        val database = AppDatabase.getInstance(applicationContext)
        val repository = ActivityRepository(database.activityDao())
        DailyActivityViewModelFactory(repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                DailyNotesScreen(viewModel = viewModel)
            }
        }
    }
}
