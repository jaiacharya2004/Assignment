import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
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
  success: "#4CAF50",
  border: "#2D3139",
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

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
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function onResetPassword() {
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email address");
      return;
    }
  
    if (!validateEmail(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }
  
    try {
      const result = await forgotPassword(email);
  
      if (result?.success) {
        setEmailSent(true);
      }
    } catch (error: any) {
      Alert.alert("Reset Failed", error.message);
    }
  }
  

  function handleTryAnotherEmail() {
    setEmailSent(false);
    setEmail("");
  }

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
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim },
                ],
                opacity: opacityAnim,
              },
            ]}
          >
            {!emailSent ? (
              <>
                {/* Header */}
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={28}
                    color={COLORS.text}
                  />
                </TouchableOpacity>

                <View style={styles.headerContainer}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name="lock-reset"
                      size={48}
                      color={COLORS.primary}
                    />
                  </View>
                  <Text style={styles.title}>Reset Password</Text>
                  <Text style={styles.subtitle}>
                    Enter your email and we'll send you a link to reset your password
                  </Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email Address</Text>
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
                      returnKeyType="send"
                      onSubmitEditing={onResetPassword}
                      disabled={loading}
                      editable={!loading}
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

                  {/* Info Box */}
                  <View style={styles.infoBox}>
                    <MaterialCommunityIcons
                      name="information"
                      size={20}
                      color={COLORS.primary}
                    />
                    <Text style={styles.infoText}>
                      We'll send a reset link to your email. The link expires in 1 hour.
                    </Text>
                  </View>

                  {/* Send Button */}
                  <TouchableOpacity
                    onPress={onResetPassword}
                    disabled={loading || !email.trim()}
                    style={[
                      styles.sendButton,
                      (loading || !email.trim()) && styles.sendButtonDisabled,
                    ]}
                  >
                    {loading ? (
                      <MaterialCommunityIcons
                        name="loading"
                        size={24}
                        color={COLORS.text}
                      />
                    ) : (
                      <>
                        <MaterialCommunityIcons
                          name="send"
                          size={20}
                          color={COLORS.text}
                        />
                        <Text style={styles.sendButtonText}>Send Reset Link</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Back Button */}
                  <TouchableOpacity
                    onPress={() => router.back()}
                    disabled={loading}
                    style={styles.backTextButton}
                  >
                    <Text style={styles.backTextButtonText}>
                      Remember your password? Back to Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Success State */}
                <View style={styles.successContainer}>
                  <View style={styles.successIconContainer}>
                    <MaterialCommunityIcons
                      name="email-check"
                      size={60}
                      color={COLORS.success}
                    />
                  </View>

                  <Text style={styles.successTitle}>Check Your Email!</Text>
                  <Text style={styles.successMessage}>
                    We've sent a password reset link to:
                  </Text>

                  <View style={styles.emailBox}>
                    <Text style={styles.emailText}>{email}</Text>
                  </View>

                  <Text style={styles.instructions}>
                    Follow the link in the email to reset your password. The link will expire in 1 hour.
                  </Text>

                  <View style={styles.tipsBox}>
                    <MaterialCommunityIcons
                      name="lightbulb-outline"
                      size={20}
                      color={COLORS.primary}
                    />
                    <Text style={styles.tipsText}>
                      Check your spam or junk folder if you don't see the email
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      onPress={handleTryAnotherEmail}
                      style={styles.secondaryButton}
                    >
                      <MaterialCommunityIcons
                        name="email-edit-outline"
                        size={20}
                        color={COLORS.primary}
                      />
                      <Text style={styles.secondaryButtonText}>
                        Try Another Email
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.replace("/auth/login")}
                      style={styles.primaryButton}
                    >
                      <MaterialCommunityIcons
                        name="arrow-left"
                        size={20}
                        color={COLORS.text}
                      />
                      <Text style={styles.primaryButtonText}>Back to Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
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
    flex: 1,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: `${COLORS.surface}80`,
    padding: 8,
    borderRadius: 8,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
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
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: `${COLORS.primary}15`,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    elevation: 4,
    marginTop: 8,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  backTextButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  backTextButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  successContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${COLORS.success}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.success,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  emailBox: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: "100%",
  },
  emailText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
  },
  instructions: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  tipsBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: `${COLORS.primary}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  tipsText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  buttonGroup: {
    gap: 12,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});

