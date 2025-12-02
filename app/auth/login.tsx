import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, TextInput as NativeTextInput, Platform, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<NativeTextInput>(null);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to list...");
      router.replace("/(tabs)/list");
    }
  }, [user, router]);

  async function onLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const result = await signIn(email, password);
      if (result.success) {
        console.log("Login successful - navigation will happen automatically");
        // The auth state change will trigger the redirect in index.tsx
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text variant="headlineMedium" style={styles.title}>
          Login
        </Text>

        <TextInput
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
            returnKeyType="done"
            onSubmitEditing={onLogin}
          />
          <IconButton
            icon={showPassword ? "eye-off" : "eye"}
            size={24}
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          />
        </View>

        <Button 
          mode="contained" 
          onPress={onLogin} 
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Login
        </Button>

        <Button 
          mode="text" 
          onPress={() => router.push("/auth/forgot-password")}
          style={styles.forgotPasswordButton}
          labelStyle={styles.forgotPasswordText}
        >
          Forgot Password?
        </Button>

        <View style={styles.signupContainer}>
          <Text>Dont have an account? </Text>
          <Button
            mode="text"
            onPress={() => router.push("/auth/signup")}
            style={styles.signupButton}
            labelStyle={styles.signupText}
          >
            Sign Up
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
  forgotPasswordButton: {
    marginTop: 8,
    alignSelf: "center",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#2196F3",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupButton: {
    margin: 0,
  },
  signupText: {
    fontSize: 14,
  },
});