package com.sweepr.demo.nuvo2

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import com.google.android.material.snackbar.Snackbar
import com.sweepr.framework.discovery.StaticNetworkDescriptor
import com.sweepr.framework.mobile.SweeprClient
import com.sweepr.framework.mobile.config.*
import com.sweepr.framework.mobile.interfaces.LogoutInterface
import com.sweepr.framework.models.CustomActionStatus
import com.sweepr.framework.resolution.*
import com.sweepr.demo.nuvo2.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // initialize SweeprClient
        initializeSweepr(applicationContext)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)

        val navController = findNavController(R.id.nav_host_fragment_content_main)
        appBarConfiguration = AppBarConfiguration(navController.graph)
        setupActionBarWithNavController(navController, appBarConfiguration)

        // setup a callback for a logout request
        setupSweeprMenu(navController)

        binding.fab.setOnClickListener { view ->
            Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                .setAction("Action", null).show()
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        return when (item.itemId) {
            R.id.action_settings -> true
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        return navController.navigateUp(appBarConfiguration)
                || super.onSupportNavigateUp()
    }

    companion object {
        private const val TAG = "MainActivity"

        @JvmStatic
        private fun initializeSweepr(context: Context) {
            val userAgent = BuildConfig.USER_AGENT + "/" + SweeprClient.getVersionName(
                context
            )
            val mqttPort = if (BuildConfig.MQTT_PORT.isEmpty()) 0
            else BuildConfig.MQTT_PORT.toInt()

            val config = SweeprConfiguration(
                BuildConfig.APP_NAME,
                SweeprServerConfiguration(BuildConfig.API_URL, userAgent,
                    null, // define URL for online assets to pick them up during user authentication
                    ServerUtterancesKind.Shared),
                SweeprMQTTConfiguration(
                    BuildConfig.MQTT_URL,
                    userAgent,
                    BuildConfig.MQTT_LOGIN,
                    BuildConfig.MQTT_PASSWORD,
                    mqttPort
                ),
                SweeprUXConfiguration(BuildConfig.APP_NAME, null,
                    true, // use it to get current WiFi name; otherwise specify custom NetworkDescriptor via action-delegates to provide this information
                    BuildConfig.SHOW_MENU.toBoolean(), // allow the user to logout
                    BuildConfig.ASSETS_LOCAL_PATH, // point folder in "assets://" or empty string to use build-in ones
                    BuildConfig.ASSETS_TIMESTAMP)
            )

            // start
            SweeprClient.start(config, context)

            // customize behavior
            SweeprClient.setActionDelegates(SweeprActionDelegates(
                null, // StaticNetworkDescriptor("Freak House"),
                object: SweeprAppActionStep {
                    override fun handleAppActionStep(actionName: String, resultKey: String, callback: ActionStepCallback) {

                        // handle custom action execution or override build-in during interaction execution
                        when(actionName) {
                            "xyz" -> {
                                Log.d(TAG, "Executing $actionName")
                                callback.onActionResult(null)
                            }

                            else -> callback.onActionResult(null)
                        }
                    }

                },
                object: SweeprScreenActionRequest {
                    override fun handleScreenAction(actionName: String, args: String, callback: ScreenActionCallback) {
                        // handle custom links navigation or button clicks
                        when (actionName) {
                            "navigate" -> Log.d(TAG, "Navigating to: $args")
                        }

                        callback.onScreenActionResult(CustomActionStatus.notImplemented)
                    }
                }
            ))
        }

        @JvmStatic
        fun setupSweeprMenu(navController: NavController) {

            SweeprClient.setLogoutDelegate(object: LogoutInterface {
                override fun onLogout() {
                    // executed on user's click to "LOGOUT" menu item
                    // by default SweeprFragment tries to execute `action_SweeprFragment_to_FirstFragment`
                    navController.popBackStack(R.id.LoginFragment, false)
                }
            })
        }
    }
}
