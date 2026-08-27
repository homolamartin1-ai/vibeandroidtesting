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
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
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
    var tab by remember { mutableStateOf("login") }        // login | products | cart
    var cartSub by remember { mutableStateOf("cart") }     // cart | checkout | confirmation
    var orderRef by remember { mutableStateOf<String?>(null) }

    // testTagsAsResourceId exposes each testTag as an Android resource-id,
    // so Maestro / Appium / UI Automator can locate Compose elements by id.
    Surface(Modifier.fillMaxSize().semantics { testTagsAsResourceId = true }) {
        Scaffold(
            bottomBar = {
                // BUG-015: the bottom navigation is shown from launch, so Products
                // and Cart are reachable BEFORE the user has authenticated. It
                // should be gated on vm.isAuthenticated.
                NavigationBar {
                    NavigationBarItem(
                        selected = tab == "login", onClick = { tab = "login" },
                        icon = { Text("👤") }, label = { Text("Sign In") },
                    )
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
                    "login" -> LoginScreen(vm) { tab = "products" }
                    "products" -> CatalogScreen(vm)
                    "cart" -> when (cartSub) {
                        "cart" -> CartScreen(
                            vm,
                            onProceed = {
                                // BUG-011: the Proceed button does nothing — checkout
                                // is unreachable via the UI. Should be: cartSub = "checkout".
                            },
                        )
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
        Modifier.fillMaxSize().padding(24.dp),
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
        // BUG-001: the password field is NOT masked — characters are shown in
        // plaintext. It should use PasswordVisualTransformation().
        OutlinedTextField(
            value = password, onValueChange = { password = it },
            label = { Text("Password") }, singleLine = true,
            modifier = Modifier.fillMaxWidth().testTag("login-password"),
        )
        if (vm.error.isNotEmpty()) {
            Text(vm.error, color = Color.Red, modifier = Modifier.testTag("login-error"))
        }
        Spacer(Modifier.height(20.dp))
        // BUG-016: the login button has NO testTag / content-description, so there
        // is no stable locator for it. The fix is to add one (e.g. "login-submit").
        Button(
            onClick = { if (vm.login(email, password)) onSuccess() },
            modifier = Modifier.fillMaxWidth(),
        ) { Text("Log In") }
    }
}

@Composable
fun CatalogScreen(vm: AppViewModel) {
    Column(Modifier.fillMaxSize().padding(16.dp).verticalScroll(rememberScrollState())) {
        // BUG-014: the title reads "Untitled" instead of "Products".
        Text("Untitled", style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.testTag("catalog-title"))
        Spacer(Modifier.height(12.dp))
        PRODUCTS.forEach { p ->
            Row(Modifier.fillMaxWidth().padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(p.icon, style = MaterialTheme.typography.headlineSmall)
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    // BUG-007: no maxLines — a long product name overflows the cell.
                    Text(p.name, style = MaterialTheme.typography.bodyLarge,
                        modifier = Modifier.testTag("name-${p.id}"))
                    Text("$${p.price}", style = MaterialTheme.typography.bodyMedium)
                    if (!p.inStock) {
                        // BUG-008: the Out of Stock badge is green — it should be red.
                        Text("Out of Stock", color = Color.Green,
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
    // BUG-006: the displayed total is captured once and never recomputed, so it
    // does NOT update when a quantity changes. It should read vm.total live.
    val displayedTotal = remember { vm.total }
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
                // BUG-005: decrement has no minimum — quantity can go to 0 / negative.
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
        Text("Total: $${"%.2f".format(displayedTotal)}",
            style = MaterialTheme.typography.titleLarge, modifier = Modifier.testTag("order-total"))
        if (vm.subtotal < 10) {
            Text("Minimum order value is \$10.00", color = Color.Red,
                modifier = Modifier.testTag("min-order-error"))
        }
        Spacer(Modifier.height(12.dp))
        Button(onClick = onProceed, modifier = Modifier.fillMaxWidth().testTag("proceed-checkout")) {
            Text("Proceed to Checkout")
        }
    }
}

private val FIELDS = listOf(
    "firstName" to "First Name", "lastName" to "Last Name", "email" to "Email",
    "phone" to "Phone", "card" to "Card Number", "expiry" to "Expiry (MM/YY)", "cvv" to "CVV",
)

@Composable
fun CheckoutScreen(vm: AppViewModel, onDone: (String) -> Unit) {
    val form = remember { mutableStateMapOf<String, String>() }
    var error by remember { mutableStateOf("") }

    // BUG-017: the checkout form is a plain Column with no imePadding — the
    // keyboard covers the CVV field (the last one) and it cannot be scrolled
    // into view. It should apply Modifier.imePadding() and be scrollable to the end.
    Column(Modifier.fillMaxSize().padding(16.dp).verticalScroll(rememberScrollState())) {
        Text("Checkout", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(8.dp))
        FIELDS.forEach { (key, label) ->
            val numeric = key == "phone" || key == "card"   // BUG-010: cvv is NOT numeric here
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
                // BUG-012: the form submits even when fields are empty — there is
                // no required-field validation.
                // BUG-009: a past expiry date is accepted — no MM/YY past check.
                error = ""
                val ref = "TS-" + (100000 + Random.nextInt(900000)).toString()
                onDone(ref)
            },
            modifier = Modifier.fillMaxWidth().testTag("checkout-submit"),
        ) { Text("Place Order") }
    }
}

@Composable
fun ConfirmationScreen(orderRef: String?, onBack: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(24.dp), verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Order Confirmed", style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.testTag("confirmation-title"))
        Spacer(Modifier.height(12.dp))
        // BUG-013: the confirmation does NOT show the order reference. It should
        // display it in an element tagged "confirmation-order-ref".
        Text("Thank you for your purchase.")
        Spacer(Modifier.height(20.dp))
        Button(onClick = onBack) { Text("Done") }
    }
}
