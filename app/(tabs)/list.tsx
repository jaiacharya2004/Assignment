import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function ListScreen() {
  const router = useRouter();
  const API_KEY = Constants.expoConfig?.extra?.omdbApiKey as string;

  const [query, setQuery] = useState("");    // 🔍 Search query
  const [movies, setMovies] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [error, setError] = useState("");

  async function fetchMovies(searchText: string) {
    if (!searchText) return;
    try {
      setLoadingMovies(true);
      setError("");

      const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchText.trim()}`);
      const data = await res.json();

      if (data.Response === "False") {
        setMovies([]);
        setError(data.Error || "No results found");
      } else {
        setMovies(data.Search || []);
      }
    } catch (err) {
      setError("Error fetching movies");
    }

    setLoadingMovies(false);
  }

  useEffect(() => {
    fetchMovies("movie"); // default trending movies
  }, []);
  



  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Movie Search</Text>

      {/* 🔍 SEARCH BAR */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search movies..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => fetchMovies(query)}
        />

        <Button mode="contained" onPress={() => fetchMovies(query)}>
          Search
        </Button>
      </View>

      {loadingMovies && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* MOVIE LIST */}
      <FlatList
        data={movies}
        keyExtractor={(item, index) => item.imdbID + "_" + index}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/movie-detail",
                params: { imdbID: item.imdbID },
              })
            }
          >
            <Image source={{ uri: item.Poster }} style={styles.poster} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.movieTitle}>{item.Title}</Text>
              <Text>{item.Year}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { textAlign: "center", marginBottom: 16, fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    borderColor: "#ddd",
  },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
  card: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    marginBottom: 10,
  },
  poster: { width: 70, height: 100, borderRadius: 8 },
  movieTitle: { fontWeight: "bold", fontSize: 16 },
  logoutButton: { marginTop: 12 },
});
