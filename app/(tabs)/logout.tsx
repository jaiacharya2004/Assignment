import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";

export default function LogoutScreen() {
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
        Logout
      </Text>

      <Text style={styles.userText}>
        You are logged in as:
      </Text>

      <Text style={styles.emailText}>
        {user?.email}
      </Text>

      <Button
        mode="contained"
        onPress={onLogout}
        loading={loading}
        disabled={loading}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginBottom: 20,
    fontWeight: "bold",
  },
  userText: {
    color: "#666",
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 30,
  },
  logoutButton: {
    minWidth: 160,
    paddingVertical: 8,
  },
});
