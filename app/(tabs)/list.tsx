import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";

export default function ListScreen() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  async function onLogout() {
    try {
      await signOut();
    } catch (error: any) {
      alert("Logout failed: " + error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to List Screen
      </Text>
      
      <Text style={styles.subtitle}>
        You are successfully logged in!
      </Text>

      {user && (
        <Text style={styles.userInfo}>
          Welcome, {user.displayName || user.email}!
        </Text>
      )}

      <Button 
        mode="contained" 
        onPress={onLogout}
        style={styles.logoutButton}
        loading={loading}
        disabled={loading}
      >
        Logout
      </Button>

      <Button 
        mode="outlined" 
        onPress={() => router.back()}
        style={styles.backButton}
      >
        Go Back
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
    color: "#666",
  },
  userInfo: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 14,
    color: "#333",
  },
  logoutButton: {
    marginBottom: 10,
    paddingVertical: 6,
    minWidth: 150,
  },
  backButton: {
    minWidth: 150,
    paddingVertical: 6,
  },
});