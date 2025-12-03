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
  ScrollView,
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
  success: "#4CAF50",
  border: "#2D3139",
};

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const emailInputRef = useRef<NativeTextInput>(null);
  const passwordInputRef = useRef<NativeTextInput>(null);
  const confirmPasswordInputRef = useRef<NativeTextInput>(null);

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

  const validateForm = (): boolean => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return false;
    }

    if (!agreedToTerms) {
      Alert.alert(
        "Terms & Conditions",
        "Please agree to the Terms & Conditions to continue"
      );
      return false;
    }

    return true;
  };

  async function onSignup() {
    if (!validateForm()) return;

    try {
      await signUp(email, password, name);
      Alert.alert("Success", "Account created successfully!");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    }
  }

  const PasswordStrengthIndicator = () => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const getStrengthColor = () => {
      if (strength <= 1) return COLORS.error;
      if (strength <= 2) return "#FFA726";
      return COLORS.success;
    };

    const getStrengthText = () => {
      if (strength <= 1) return "Weak";
      if (strength <= 2) return "Fair";
      return "Strong";
    };

    return password ? (
      <View style={styles.strengthContainer}>
        <View style={styles.strengthBars}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.strengthBar,
                i < strength && {
                  backgroundColor: getStrengthColor(),
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
          {getStrengthText()}
        </Text>
      </View>
    ) : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
                  name="movie-plus-outline"
                  size={40}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join MovieFlix to discover amazing films
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Name Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  label="Full Name"
                  mode="outlined"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor={COLORS.textSecondary}
                  returnKeyType="next"
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                  outlineColor={COLORS.border}
                  activeOutlineColor={COLORS.primary}
                  textColor={COLORS.text}
                  left={
                    <TextInput.Icon
                      icon="account-outline"
                      color={COLORS.textSecondary}
                    />
                  }
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  ref={emailInputRef as any}
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
                <Text style={styles.inputLabel}>Password</Text>
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
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
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
                <PasswordStrengthIndicator />
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  ref={confirmPasswordInputRef as any}
                  label="Confirm Password"
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor={COLORS.textSecondary}
                  returnKeyType="done"
                  onSubmitEditing={onSignup}
                  outlineColor={COLORS.border}
                  activeOutlineColor={COLORS.primary}
                  textColor={COLORS.text}
                  left={
                    <TextInput.Icon
                      icon="lock-check-outline"
                      color={COLORS.textSecondary}
                    />
                  }
                  right={
                    <TextInput.Icon
                      icon={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      color={COLORS.textSecondary}
                    />
                  }
                />
                {password && confirmPassword && password === confirmPassword && (
                  <View style={styles.matchContainer}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={16}
                      color={COLORS.success}
                    />
                    <Text style={styles.matchText}>Passwords match</Text>
                  </View>
                )}
              </View>

              {/* Terms & Conditions */}
              <TouchableOpacity
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                style={styles.termsContainer}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreedToTerms && styles.checkboxChecked,
                  ]}
                >
                  {agreedToTerms && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color={COLORS.primary}
                    />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{" "}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                </Text>
              </TouchableOpacity>

              {/* Sign Up Button */}
              <TouchableOpacity
                onPress={onSignup}
                disabled={loading}
                style={[
                  styles.signupButton,
                  loading && styles.signupButtonDisabled,
                ]}
              >
                {loading ? (
                  <MaterialCommunityIcons
                    name="loading"
                    size={24}
                    color={COLORS.text}
                  />
                ) : (
                  <Text style={styles.signupButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  animatedContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
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
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
  },
  matchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  matchText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: "600",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: `${COLORS.primary}20`,
    borderColor: COLORS.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  signupButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    elevation: 4,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 12,
  },
  loginText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "700",
  },
});