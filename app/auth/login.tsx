import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  TextInput as NativeTextInput,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";

const COLORS = {
  primary: "#1E88E5",
  secondary: "#0D47A1",
  background: "#0F1419",
  surface: "#1A1F2E",
  text: "#FFFFFF",
  textSecondary: "#B0BEC5",
  error: "#FF5252",
  border: "#2D3139",
};

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<NativeTextInput>(null);
  
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/list");
    }
  }, [user, router]);

  async function onLogin() {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="movie-outline"
                size={40}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to explore amazing movies</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                label="Email Address"
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor={COLORS.textSecondary}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.primary}
                textColor={COLORS.text}
                left={
                  <TextInput.Icon
                    icon="email-outline"
                    color={COLORS.textSecondary}
                  />
                }
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                ref={passwordInputRef as any}
                label="Password"
                mode="outlined"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textSecondary}
                returnKeyType="done"
                onSubmitEditing={onLogin}
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.primary}
                textColor={COLORS.text}
                left={
                  <TextInput.Icon
                    icon="lock-outline"
                    color={COLORS.textSecondary}
                  />
                }
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setShowPassword(!showPassword)}
                    color={COLORS.textSecondary}
                  />
                }
              />
            </View>

            {/* Forgot Password Button */}
            <TouchableOpacity
              onPress={() => router.push("/auth/forgot-password")}
              style={styles.forgotButtonContainer}
            >
              <Text style={styles.forgotButtonText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={onLogin}
              disabled={loading}
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
            >
              {loading ? (
                <MaterialCommunityIcons
                  name="loading"
                  size={24}
                  color={COLORS.text}
                />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>New to MovieFlix?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Link */}
            <TouchableOpacity
              onPress={() => router.push("/auth/signup")}
              style={styles.signupButton}
            >
              <Text style={styles.signupButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Info */}
          <View style={styles.footer}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.footerText}>
              Your data is secure and encrypted
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  formContainer: {
    gap: 16,
  },
  inputWrapper: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  forgotButtonContainer: {
    alignSelf: "flex-end",
    paddingVertical: 8,
  },
  forgotButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  signupButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  signupButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 8,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
});