package com.yourapp

import android.content.Context
import android.os.Build
import android.os.BatteryManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableNativeMap
import java.text.SimpleDateFormat
import java.util.*

class DeviceInfoModule(private val reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeviceInfoModule"
    }

    @ReactMethod
    fun getDeviceInfo(promise: Promise) {
        try {
            val result = WritableNativeMap()
            
            // Device Information
            result.putString("deviceModel", Build.MODEL)
            result.putString("brand", Build.BRAND)
            result.putString("manufacturer", Build.MANUFACTURER)
            result.putString("product", Build.PRODUCT)
            
            // Platform Information
            result.putString("platform", "Android")
            result.putInt("apiLevel", Build.VERSION.SDK_INT)
            result.putString("osVersion", Build.VERSION.RELEASE)
            
            // Locale Information
            result.putString("locale", Locale.getDefault().toString())
            result.putString("language", Locale.getDefault().language)
            result.putString("country", Locale.getDefault().country)
            
            // App Information
            val packageInfo = reactContext.packageManager.getPackageInfo(reactContext.packageName, 0)
            result.putString("appVersion", packageInfo.versionName)
            result.putInt("appVersionCode", packageInfo.versionCode)
            
            // Get battery level (if permission available)
            val batteryLevel = getBatteryLevel()
            result.putInt("batteryLevel", batteryLevel)
            result.putBoolean("isCharging", isCharging())
            
            // Custom formatted timestamp from native
            result.putString("nativeTimestamp", getFormattedTimestamp())
            
            // Custom message to prove it's from our Kotlin module
            result.putString("customMessage", "This data comes from custom Kotlin native module!")
            
            promise.resolve(result)
            
        } catch (e: Exception) {
            promise.reject("DEVICE_INFO_ERROR", "Failed to get device info: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getFormattedDate(timestamp: Double, promise: Promise) {
        try {
            val date = Date(timestamp.toLong())
            val formatter = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
            val formatted = formatter.format(date)
            
            val result = WritableNativeMap()
            result.putString("timestamp", timestamp.toString())
            result.putString("formattedDate", formatted)
            result.putString("timezone", TimeZone.getDefault().id)
            
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("DATE_FORMAT_ERROR", "Failed to format date: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getDeviceSummary(promise: Promise) {
        try {
            val summary = """
                Device: ${Build.MODEL}
                Brand: ${Build.BRAND}
                Android: ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT})
                Manufacturer: ${Build.MANUFACTURER}
                Locale: ${Locale.getDefault()}
                Time: ${getFormattedTimestamp()}
            """.trimIndent()
            
            promise.resolve(summary)
        } catch (e: Exception) {
            promise.reject("SUMMARY_ERROR", "Failed to get summary: ${e.message}", e)
        }
    }

    private fun getBatteryLevel(): Int {
        return try {
            val batteryManager = reactContext.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
            batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
        } catch (e: Exception) {
            -1 // Return -1 if battery info is not available
        }
    }

    private fun isCharging(): Boolean {
        return try {
            val batteryManager = reactContext.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
            batteryManager.isCharging
        } catch (e: Exception) {
            false
        }
    }

    private fun getFormattedTimestamp(): String {
        val formatter = SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS", Locale.getDefault())
        return formatter.format(Date())
    }
}