package com.booknow.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.testTagsAsResourceId
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MaterialTheme { AppRoot() } }
    }
}

@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun AppRoot(vm: BookViewModel = viewModel()) {
    var screen by remember { mutableStateOf("login") }
    Surface(Modifier.fillMaxSize().semantics { testTagsAsResourceId = true }) {
        when (screen) {
            "login" -> LoginScreen(vm) { screen = "rooms" }
            "rooms" -> RoomsScreen(vm) { screen = "booking" }
            "booking" -> BookingScreen(vm) { screen = "confirmation" }
            "confirmation" -> ConfirmationScreen(vm) { screen = "rooms" }
        }
    }
}

@Composable
fun LoginScreen(vm: BookViewModel, onSuccess: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize().padding(24.dp).imePadding(), verticalArrangement = Arrangement.Center) {
        Text("BookNow", style = MaterialTheme.typography.headlineLarge)
        Text("Sign in to book your stay", style = MaterialTheme.typography.bodyMedium)
        Spacer(Modifier.height(20.dp))
        OutlinedTextField(email, { email = it }, label = { Text("Email") }, singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth().testTag("login-email"))
        Spacer(Modifier.height(12.dp))
        OutlinedTextField(password, { password = it }, label = { Text("Password") }, singleLine = true,
            visualTransformation = androidx.compose.ui.text.input.PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth().testTag("login-password"))
        if (vm.error.isNotEmpty()) Text(vm.error, color = Color.Red, modifier = Modifier.testTag("login-error"))
        Spacer(Modifier.height(20.dp))
        Button(onClick = { if (vm.login(email, password)) onSuccess() },
            modifier = Modifier.fillMaxWidth().testTag("login-submit")) { Text("Log In") }
    }
}

@Composable
fun RoomsScreen(vm: BookViewModel, onSelect: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(16.dp).verticalScroll(rememberScrollState())) {
        Text("Rooms", style = MaterialTheme.typography.headlineMedium, modifier = Modifier.testTag("rooms-title"))
        Spacer(Modifier.height(12.dp))
        SAMPLE_ROOMS.forEach { room ->
            Card(Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                Column(Modifier.padding(12.dp)) {
                    Text("${room.icon}  ${room.name}", style = MaterialTheme.typography.titleMedium,
                        modifier = Modifier.testTag("room-name-${room.id}"))
                    Text(room.description, style = MaterialTheme.typography.bodySmall)
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("$${"%.2f".format(room.discountedPrice)} / night",
                            modifier = Modifier.testTag("room-price-${room.id}"))
                        Spacer(Modifier.width(12.dp))
                        // FIXED: the "Available" badge is green.
                        Text("Available", color = Color(0xFF2E7D32), modifier = Modifier.testTag("room-badge-${room.id}"))
                    }
                    Spacer(Modifier.height(8.dp))
                    Button(onClick = { vm.selectRoom(room); onSelect() },
                        modifier = Modifier.testTag("book-${room.id}")) { Text("Book") }
                }
            }
        }
    }
}

private val FIELDS = listOf(
    "firstName" to "First Name", "lastName" to "Last Name", "email" to "Email",
    "phone" to "Phone", "checkIn" to "Check-in (YYYY-MM-DD)", "checkOut" to "Check-out (YYYY-MM-DD)",
    "guests" to "Guests",
)

@Composable
fun BookingScreen(vm: BookViewModel, onDone: () -> Unit) {
    val form = remember { mutableStateMapOf<String, String>() }
    val room = vm.selectedRoom
    Column(Modifier.fillMaxSize().padding(16.dp).imePadding().verticalScroll(rememberScrollState())) {
        Text("Book: ${room?.name ?: ""}", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(8.dp))
        FIELDS.forEach { (key, label) ->
            val numeric = key == "phone" || key == "guests"
            OutlinedTextField(form[key] ?: "", { form[key] = it }, label = { Text(label) }, singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = if (numeric) KeyboardType.Number else KeyboardType.Text),
                modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp).testTag("booking-$key"))
        }
        if (vm.error.isNotEmpty()) Text(vm.error, color = Color.Red, modifier = Modifier.testTag("booking-error"))
        Spacer(Modifier.height(12.dp))
        Button(
            onClick = {
                // FIXED: only proceed when the booking is valid.
                val ok = vm.createBooking(
                    form["firstName"] ?: "", form["lastName"] ?: "", form["email"] ?: "",
                    form["phone"] ?: "", form["checkIn"] ?: "", form["checkOut"] ?: "",
                    (form["guests"] ?: "").toIntOrNull() ?: 0,
                )
                if (ok) onDone()
            },
            modifier = Modifier.fillMaxWidth().testTag("booking-submit"),
        ) { Text("Confirm Booking") }
    }
}

@Composable
fun ConfirmationScreen(vm: BookViewModel, onBack: () -> Unit) {
    val b = vm.currentBooking
    Column(Modifier.fillMaxSize().padding(24.dp).verticalScroll(rememberScrollState())) {
        Text("Booking Confirmed", style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.testTag("confirmation-title"))
        Spacer(Modifier.height(12.dp))
        // FIXED: the confirmation shows the reference number and a full booking summary.
        if (b != null) {
            Text("Reference: ${b.reference}", modifier = Modifier.testTag("confirmation-reference"))
            Spacer(Modifier.height(8.dp))
            Text("Room: ${b.room.name}", modifier = Modifier.testTag("confirmation-room"))
            Text("Guest: ${b.firstName} ${b.lastName}")
            Text("Dates: ${b.checkIn} → ${b.checkOut}  (${b.nights} night(s))",
                modifier = Modifier.testTag("confirmation-dates"))
            Text("Guests: ${b.guests}")
            Text("Total: $${"%.2f".format(b.total)}", modifier = Modifier.testTag("confirmation-total"))
        }
        Spacer(Modifier.height(20.dp))
        Button(onClick = onBack) { Text("Done") }
    }
}
