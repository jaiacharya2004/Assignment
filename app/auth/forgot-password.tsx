import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function onResetPassword() {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      await forgotPassword(email);
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert("Reset Failed", error.message);
    }
  }

  function handleTryAnotherEmail() {
    setEmailSent(false);
    setEmail("");
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Reset Password
          </Text>

          {!emailSent ? (
            <>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Enter your email address and we will send you a link to reset your password.
              </Text>

              <TextInput
                label="Email"
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Enter your email address"
                left={<TextInput.Icon icon="email" />}
                returnKeyType="send"
                onSubmitEditing={onResetPassword}
                disabled={loading}
                editable={!loading}
              />

              <Button 
                mode="contained" 
                onPress={onResetPassword} 
                style={styles.button}
                loading={loading}
                disabled={loading || !email.trim()}
                icon="send"
              >
                Send Reset Link
              </Button>

              <Button 
                mode="text" 
                onPress={() => router.back()}
                style={styles.backButton}
                disabled={loading}
              >
                Back to Login
              </Button>
            </>
          ) : (
            <>
              <View style={styles.successIcon}>
                <Text style={styles.successEmoji}>✅</Text>
              </View>
              
              <Text variant="headlineSmall" style={styles.successTitle}>
                Check Your Email!
              </Text>
              
              <Text variant="bodyMedium" style={styles.successMessage}>
                We have sent a password reset link to:
              </Text>
              
              <Text variant="bodyLarge" style={styles.emailText}>
                {email}
              </Text>
              
              <Text variant="bodyMedium" style={styles.instructions}>
                Please check your email and follow the instructions to reset your password. The link will expire in 1 hour.
              </Text>

              <Text variant="bodySmall" style={styles.note}>
                💡 Check your spam or junk folder if you dont see the email.
              </Text>

              <View style={styles.buttonGroup}>
                <Button 
                  mode="outlined" 
                  onPress={handleTryAnotherEmail}
                  style={styles.secondaryButton}
                  icon="email-edit"
                >
                  Try Another Email
                </Button>
                
                <Button 
                  mode="contained" 
                  onPress={() => router.replace("/auth/login")}
                  style={styles.primaryButton}
                  icon="arrow-left"
                >
                  Back to Login
                </Button>
              </View>
            </>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
    lineHeight: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 10,
  },
  successIcon: {
    alignItems: "center",
    marginBottom: 16,
  },
  successEmoji: {
    fontSize: 48,
  },
  successTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  successMessage: {
    textAlign: "center",
    marginBottom: 8,
    color: "#666",
  },
  emailText: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
    color: "#2196F3",
    fontSize: 16,
  },
  instructions: {
    textAlign: "center",
    marginBottom: 16,
    color: "#666",
    lineHeight: 20,
    fontSize: 14,
  },
  note: {
    textAlign: "center",
    marginBottom: 24,
    color: "#FF9800",
    fontStyle: "italic",
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    paddingVertical: 6,
  },
  secondaryButton: {
    paddingVertical: 6,
  },
});