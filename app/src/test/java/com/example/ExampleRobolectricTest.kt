package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.utils.DateUtils
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import java.time.LocalDate

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("Ada Baiknya", appName)
  }

  @Test
  fun `dateUtils format Indonesian display string`() {
    val date = LocalDate.of(2026, 10, 2)
    val display = DateUtils.toDisplayString(date)
    assertNotNull(display)
    // Should contain "Oktober" and "2026"
    assert(display.contains("Oktober"))
    assert(display.contains("2026"))
  }
}
