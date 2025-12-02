import React, { useRef, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, TextInput as NativeTextInput, Alert } from "react-native";
import { TextInput, Button, Text, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const emailInputRef = useRef<NativeTextInput>(null);
  const passwordInputRef = useRef<NativeTextInput>(null);
  const confirmPasswordInputRef = useRef<NativeTextInput>(null);

  async function onSignup() {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await signUp(email, password, name);
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text variant="headlineMedium" style={styles.title}>
          Create Account
        </Text>

        <TextInput
          label="Full Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter your name"
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current?.focus()}
        />

        <TextInput
          ref={emailInputRef as any}
          label="Email"
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Enter your email"
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordInputRef as any}
            label="Password"
            mode="outlined"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            placeholder="Enter your password"
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
          />
          <IconButton
            icon={showPassword ? "eye-off" : "eye"}
            size={24}
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          />
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            ref={confirmPasswordInputRef as any}
            label="Confirm Password"
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.passwordInput}
            placeholder="Confirm your password"
            returnKeyType="done"
            onSubmitEditing={onSignup}
          />
          <IconButton
            icon={showConfirmPassword ? "eye-off" : "eye"}
            size={24}
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </View>

        <Button 
          mode="contained" 
          onPress={onSignup} 
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Sign Up
        </Button>

        <View style={styles.loginContainer}>
          <Text>Already have an account? </Text>
          <Button
            mode="text"
            onPress={() => router.back()}
            style={styles.loginButton}
            labelStyle={styles.loginText}
          >
            Login
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 15,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 8,
    top: 8,
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginButton: {
    margin: 0,
  },
  loginText: {
    fontSize: 14,
  },
});