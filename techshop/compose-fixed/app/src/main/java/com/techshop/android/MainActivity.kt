package com.techshop.android

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
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import java.util.Calendar
import kotlin.random.Random

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MaterialTheme { AppRoot() } }
    }
}

@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun AppRoot(vm: AppViewModel = viewModel()) {
    var tab by remember { mutableStateOf("products") }     // products | cart
    var cartSub by remember { mutableStateOf("cart") }     // cart | checkout | confirmation
    var orderRef by remember { mutableStateOf<String?>(null) }

    Surface(Modifier.fillMaxSize().semantics { testTagsAsResourceId = true }) {
        // FIXED (BUG-015): the bottom navigation exists only after authentication.
        // Before login, the login screen is shown alone — no tabs.
        if (!vm.isAuthenticated) {
            LoginScreen(vm) { tab = "products"; cartSub = "cart" }
            return@Surface
        }
        Scaffold(
            bottomBar = {
                NavigationBar {
                    NavigationBarItem(
                        selected = tab == "products", onClick = { tab = "products" },
                        icon = { Text("🛍") }, label = { Text("Products") },
                        modifier = Modifier.testTag("tab-products"),
                    )
                    NavigationBarItem(
                        selected = tab == "cart", onClick = { tab = "cart" },
                        icon = { Text("🛒") }, label = { Text("Cart") },
                        modifier = Modifier.testTag("tab-cart"),
                    )
                }
            }
        ) { pad ->
            Box(Modifier.padding(pad)) {
                when (tab) {
                    "products" -> CatalogScreen(vm)
                    "cart" -> when (cartSub) {
                        "cart" -> CartScreen(vm, onProceed = { cartSub = "checkout" }) // FIXED (BUG-011)
                        "checkout" -> CheckoutScreen(vm) { ref ->
                            orderRef = ref; vm.clearCart(); cartSub = "confirmation"
                        }
                        "confirmation" -> ConfirmationScreen(orderRef) { cartSub = "cart" }
                    }
                }
            }
        }
    }
}

@Composable
fun LoginScreen(vm: AppViewModel, onSuccess: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    Column(
        Modifier.fillMaxSize().padding(24.dp).imePadding(),
        verticalArrangement = Arrangement.Center,
    ) {
        Text("TechShop", style = MaterialTheme.typography.headlineLarge)
        Text("Sign in to continue", style = MaterialTheme.typography.bodyMedium)
        Spacer(Modifier.height(20.dp))
        OutlinedTextField(
            value = email, onValueChange = { email = it },
            label = { Text("Email") }, singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth().testTag("login-email"),
        )
        Spacer(Modifier.height(12.dp))
        // FIXED (BUG-001): the password field is masked.
        OutlinedTextField(
            value = password, onValueChange = { password = it },
            label = { Text("Password") }, singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            modifier = Modifier.fillMaxWidth().testTag("login-password"),
        )
        if (vm.error.isNotEmpty()) {
            Text(vm.error, color = Color.Red, modifier = Modifier.testTag("login-error"))
        }
        Spacer(Modifier.height(20.dp))
        // FIXED (BUG-016): the login button now has a stable testTag.
        Button(
            onClick = { if (vm.login(email, password)) onSuccess() },
            modifier = Modifier.fillMaxWidth().testTag("login-submit"),
        ) { Text("Log In") }
    }
}

@Composable
fun CatalogScreen(vm: AppViewModel) {
    Column(Modifier.fillMaxSize().padding(16.dp).verticalScroll(rememberScrollState())) {
        // FIXED (BUG-014): the title reads "Products".
        Text("Products", style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.testTag("catalog-title"))
        Spacer(Modifier.height(12.dp))
        PRODUCTS.forEach { p ->
            Row(Modifier.fillMaxWidth().padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(p.icon, style = MaterialTheme.typography.headlineSmall)
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    // FIXED (BUG-007): a long name truncates cleanly instead of overflowing.
                    Text(p.name, style = MaterialTheme.typography.bodyLarge,
                        maxLines = 1, overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.testTag("name-${p.id}"))
                    Text("$${p.price}", style = MaterialTheme.typography.bodyMedium)
                    if (!p.inStock) {
                        // FIXED (BUG-008): the Out of Stock badge is red.
                        Text("Out of Stock", color = Color.Red,
                            modifier = Modifier.testTag("stock-${p.id}"))
                    }
                }
                Button(
                    onClick = { vm.addToCart(p) },
                    enabled = p.inStock,
                    modifier = Modifier.testTag("add-${p.id}"),
                ) { Text("Add") }
            }
            Divider()
        }
    }
}

@Composable
fun CartScreen(vm: AppViewModel, onProceed: () -> Unit) {
    // FIXED (BUG-006): the total reads vm.total live, so it updates on quantity change.
    var codeInput by remember { mutableStateOf("") }

    Column(Modifier.fillMaxSize().padding(16.dp).verticalScroll(rememberScrollState())) {
        Text("Cart", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(8.dp))
        if (vm.items.isEmpty()) {
            Text("Your cart is empty", modifier = Modifier.testTag("cart-empty"))
            return@Column
        }
        vm.items.forEach { (id, qty) ->
            val p = productFor(id)
            Row(Modifier.fillMaxWidth().padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(p.name)
                    Text("$${p.price} each")
                }
                Button(onClick = { vm.setQuantity(id, qty - 1) },
                    modifier = Modifier.testTag("qty-dec-$id")) { Text("−") }
                Text("$qty", modifier = Modifier.padding(horizontal = 12.dp).testTag("qty-$id"))
                Button(onClick = { vm.setQuantity(id, qty + 1) },
                    modifier = Modifier.testTag("qty-inc-$id")) { Text("+") }
                Spacer(Modifier.width(8.dp))
                TextButton(onClick = { vm.removeItem(id) },
                    modifier = Modifier.testTag("remove-$id")) { Text("Remove") }
            }
        }
        Spacer(Modifier.height(12.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(value = codeInput, onValueChange = { codeInput = it },
                label = { Text("Discount code") }, singleLine = true,
                modifier = Modifier.weight(1f).testTag("discount-input"))
            Spacer(Modifier.width(8.dp))
            Button(onClick = { vm.discountCode = codeInput.trim().uppercase() },
                modifier = Modifier.testTag("apply-discount")) { Text("Apply") }
        }
        Spacer(Modifier.height(12.dp))
        Text("Total: $${"%.2f".format(vm.total)}",
            style = MaterialTheme.typography.titleLarge, modifier = Modifier.testTag("order-total"))
        if (vm.subtotal < 10) {
            Text("Minimum order value is \$10.00", color = Color.Red,
                modifier = Modifier.testTag("min-order-error"))
        }
        Spacer(Modifier.height(12.dp))
        Button(
            onClick = onProceed,
            enabled = vm.subtotal >= 10,
            modifier = Modifier.fillMaxWidth().testTag("proceed-checkout"),
        ) { Text("Proceed to Checkout") }
    }
}

private val FIELDS = listOf(
    "firstName" to "First Name", "lastName" to "Last Name", "email" to "Email",
    "phone" to "Phone", "card" to "Card Number", "expiry" to "Expiry (MM/YY)", "cvv" to "CVV",
)

private fun expiryInPast(mmYY: String): Boolean {
    val m = Regex("^(\\d{2})/(\\d{2})$").find(mmYY) ?: return true
    val month = m.groupValues[1].toInt()
    val year = 2000 + m.groupValues[2].toInt()
    if (month !in 1..12) return true
    val cal = Calendar.getInstance()
    val nowYear = cal.get(Calendar.YEAR)
    val nowMonth = cal.get(Calendar.MONTH) + 1
    return year < nowYear || (year == nowYear && month < nowMonth)
}

@Composable
fun CheckoutScreen(vm: AppViewModel, onDone: (String) -> Unit) {
    val form = remember { mutableStateMapOf<String, String>() }
    var error by remember { mutableStateOf("") }

    // FIXED (BUG-017): imePadding keeps the focused field (incl. CVV) above the keyboard.
    Column(Modifier.fillMaxSize().padding(16.dp).imePadding().verticalScroll(rememberScrollState())) {
        Text("Checkout", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(8.dp))
        FIELDS.forEach { (key, label) ->
            // FIXED (BUG-010): CVV, phone and card all use the numeric keypad.
            val numeric = key in listOf("phone", "card", "cvv")
            OutlinedTextField(
                value = form[key] ?: "", onValueChange = { form[key] = it },
                label = { Text(label) }, singleLine = true,
                keyboardOptions = KeyboardOptions(
                    keyboardType = if (numeric) KeyboardType.Number else KeyboardType.Text
                ),
                modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp).testTag("checkout-$key"),
            )
        }
        if (error.isNotEmpty()) {
            Text(error, color = Color.Red, modifier = Modifier.testTag("checkout-error"))
        }
        Spacer(Modifier.height(12.dp))
        Button(
            onClick = {
                error = validate(form)
                if (error.isEmpty()) {
                    val ref = "TS-" + (100000 + Random.nextInt(900000)).toString()
                    onDone(ref)
                }
            },
            modifier = Modifier.fillMaxWidth().testTag("checkout-submit"),
        ) { Text("Place Order") }
    }
}

private fun validate(form: Map<String, String>): String {
    // FIXED (BUG-012): every field is required.
    for ((key, _) in FIELDS) {
        if ((form[key] ?: "").isBlank()) return "All fields are required"
    }
    if (!Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$").matches(form["email"] ?: "")) return "Enter a valid email"
    if (!Regex("^\\d{10}$").matches(form["phone"] ?: "")) return "Phone must be 10 digits"
    if (!Regex("^\\d{16}$").matches(form["card"] ?: "")) return "Card number must be 16 digits"
    // FIXED (BUG-009): reject past expiry dates.
    if (expiryInPast(form["expiry"] ?: "")) return "Expiry date must not be in the past"
    // FIXED (BUG-010): CVV must be exactly 3 digits.
    if (!Regex("^\\d{3}$").matches(form["cvv"] ?: "")) return "CVV must be 3 digits"
    return ""
}

@Composable
fun ConfirmationScreen(orderRef: String?, onBack: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(24.dp), verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Order Confirmed", style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.testTag("confirmation-title"))
        Spacer(Modifier.height(12.dp))
        // FIXED (BUG-013): the confirmation shows the order reference.
        Text("Order reference: ${orderRef ?: ""}",
            modifier = Modifier.testTag("confirmation-order-ref"))
        Spacer(Modifier.height(8.dp))
        Text("Thank you for your purchase.")
        Spacer(Modifier.height(20.dp))
        Button(onClick = onBack) { Text("Done") }
    }
}
