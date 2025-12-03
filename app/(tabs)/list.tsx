import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar, Text } from "react-native-paper";

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

// Debugging: See DEBUGGING.md for documentation on non-trivial bug resolution

// Memoized Movie Card Component for performance optimization
const MovieCard = memo(({ item, onPress }: { item: any; onPress: () => void }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.posterContainer}>
      {item.Poster && item.Poster !== "N/A" ? (
        <Image source={{ uri: item.Poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noImagePlaceholder]}>
          <MaterialCommunityIcons
            name="image-off"
            size={40}
            color={COLORS.textSecondary}
          />
        </View>
      )}
      <View style={styles.movieTypeTag}>
        <Text style={styles.movieTypeText}>{item.Type?.toUpperCase()}</Text>
      </View>
    </View>

    <View style={styles.cardContent}>
      <Text style={styles.movieTitle} numberOfLines={2}>
        {item.Title}
      </Text>
      <Text style={styles.movieYear}>{item.Year}</Text>
    </View>
  </TouchableOpacity>
));

// Optional: Add custom name for debugging in React DevTools
MovieCard.displayName = "MovieCard";

export default function ListScreen() {
  const router = useRouter();
  const API_KEY = Constants.expoConfig?.extra?.omdbApiKey as string;

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function fetchMovies(searchText: string) {
    if (!searchText.trim()) {
      setMovies([]);
      return;
    }

    try {
      setLoadingMovies(true);
      setError("");
      setHasSearched(true);

      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchText.trim()}&type=movie`
      );
      const data = await res.json();

      if (data.Response === "False") {
        setMovies([]);
        setError(data.Error || "No results found");
      } else {
        setMovies(data.Search || []);
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
      setMovies([]);
    } finally {
      setLoadingMovies(false);
    }
  }

  useEffect(() => {
    fetchMovies("movie"); // default trending movies
  }, []);

  const handleSearch = useCallback(() => {
    fetchMovies(query);
  }, [query]);

  // Memoized render function for individual movie cards
  const renderMovieItem = useCallback(
    ({ item }: { item: any }) => (
      <MovieCard
        item={item}
        onPress={() =>
          router.push({
            pathname: "/movie-detail",
            params: { imdbID: item.imdbID },
          })
        }
      />
    ),
    [router]
  );

  const renderEmptyState = () => {
    if (loadingMovies) return null;

    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="movie-search-outline"
          size={64}
          color={COLORS.textSecondary}
        />
        <Text style={styles.emptyTitle}>
          {hasSearched ? "No movies found" : "Search for movies"}
        </Text>
        <Text style={styles.emptySubtitle}>
          {hasSearched
            ? "Try a different search term"
            : "Enter a movie title to get started"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>MovieFlix</Text>
          <Text style={styles.headerSubtitle}>Discover amazing movies</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection} pointerEvents="box-none">
          <Searchbar
            placeholder="Search movies..."
            onChangeText={setQuery}
            value={query}
            onSubmitEditing={handleSearch}
            style={styles.searchBar}
            iconColor={COLORS.primary}
            placeholderTextColor={COLORS.textSecondary}
            inputStyle={styles.searchInput}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loadingMovies}
          >
            {loadingMovies ? (
              <ActivityIndicator color={COLORS.text} size="small" />
            ) : (
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color={COLORS.text}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBanner}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color={COLORS.error}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Movie List with Performance Optimizations */}
        <FlatList
          data={movies}
          keyExtractor={(item, index) => `${item.imdbID}_${index}`}
          renderItem={renderMovieItem}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true} // Additional optimization for large lists
          maxToRenderPerBatch={10} // Controls how many items are rendered per batch
          windowSize={5} // Controls the window size for rendering
          initialNumToRender={10} // Number of items to render initially
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 12,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    height: 48,
    elevation: 2,
  },
  searchInput: {
    color: COLORS.text,
    fontSize: 16,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  errorBanner: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: `${COLORS.error}15`,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
    gap: 10,
    alignItems: "center",
  },
  errorText: {
    color: COLORS.error,
    flex: 1,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: 100,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  card: {
    flex: 0.48,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    marginBottom: 4,
  },
  posterContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 0.7,
    backgroundColor: COLORS.border,
  },
  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.border,
  },
  movieTypeTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: `${COLORS.primary}CC`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  movieTypeText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "700",
  },
  cardContent: {
    padding: 10,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
});