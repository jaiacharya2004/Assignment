import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Chip, Text } from "react-native-paper";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#1E88E5",
  secondary: "#0D47A1",
  background: "#0F1419",
  surface: "#1A1F2E",
  text: "#FFFFFF",
  textSecondary: "#B0BEC5",
  accent: "#00BCD4",
  border: "#2D3139",
};

// Debugging Note: For debugging documentation and bug resolution process,
// refer to DEBUGGING.md in the project root

export default function MovieDetail() {
  const { imdbID } = useLocalSearchParams();
  const router = useRouter();
  const API_KEY = Constants.expoConfig?.extra?.omdbApiKey as string;

  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [imdbID]);

  // Performance optimization: Memoize genre array to prevent recalculation on every render
  const movieGenres = useMemo(() => {
    if (!details?.Genre || details.Genre === "N/A") return [];
    return details.Genre.split(", ");
  }, [details?.Genre]);

  // Performance optimization: Memoize ratings to prevent recalculation
  const movieRatings = useMemo(() => {
    if (!details?.Ratings || !Array.isArray(details.Ratings)) return [];
    return details.Ratings;
  }, [details?.Ratings]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  }

  if (!details) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={48}
            color={COLORS.textSecondary}
          />
          <Text style={styles.errorText}>Failed to load movie details</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rating = parseFloat(details.imdbRating);
  const isValidRating = !isNaN(rating) && rating > 0;

  const InfoRow = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={20} color={COLORS.primary} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "N/A"}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={28}
          color={COLORS.text}
        />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Poster Section */}
        <View style={styles.posterSection}>
          {details.Poster && details.Poster !== "N/A" ? (
            <Image
              source={{ uri: details.Poster }}
              style={styles.posterImage}
            />
          ) : (
            <View style={[styles.posterImage, styles.posterPlaceholder]}>
              <MaterialCommunityIcons
                name="image-off"
                size={60}
                color={COLORS.textSecondary}
              />
            </View>
          )}

          {isValidRating && (
            <View style={styles.ratingBadge}>
              <MaterialCommunityIcons
                name="star"
                size={18}
                color="#FFD700"
              />
              <Text style={styles.ratingText}>{details.imdbRating}</Text>
            </View>
          )}
        </View>

        {/* Title and Type */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{details.Title}</Text>
          <View style={styles.metaRow}>
            <Chip
              style={styles.chip}
              textStyle={styles.chipText}
              icon="calendar"
            >
              {details.Year}
            </Chip>
            <Chip
              style={styles.chip}
              textStyle={styles.chipText}
              icon="clock-outline"
            >
              {details.Runtime}
            </Chip>
          </View>
        </View>

        {/* Genre Tags - Using memoized genres array */}
        {movieGenres.length > 0 && (
          <View style={styles.genreSection}>
            <View style={styles.genreContainer}>
              {movieGenres.map((genre: string, idx: number) => (
                <Chip
                  key={`${genre}_${idx}`}
                  style={styles.genreChip}
                  textStyle={styles.genreChipText}
                >
                  {genre}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* Key Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="information"
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.sectionTitle}>Information</Text>
          </View>
          <View style={styles.infoGrid}>
            <InfoRow
              icon="account-multiple"
              label="Director"
              value={details.Director}
            />
            <InfoRow
              icon="theater"
              label="Actors"
              value={details.Actors}
            />
            {details.Writer && (
              <InfoRow
                icon="pencil"
                label="Writer"
                value={details.Writer}
              />
            )}
            {details.Country && (
              <InfoRow
                icon="globe"
                label="Country"
                value={details.Country}
              />
            )}
            {details.Language && (
              <InfoRow
                icon="translate"
                label="Language"
                value={details.Language}
              />
            )}
          </View>
        </View>

        {/* Plot Section */}
        {details.Plot && details.Plot !== "N/A" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="format-text"
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>Plot</Text>
            </View>
            <Text style={styles.plotText}>{details.Plot}</Text>
          </View>
        )}

        {/* Awards Section */}
        {details.Awards && details.Awards !== "N/A" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="trophy"
                size={22}
                color={COLORS.accent}
              />
              <Text style={styles.sectionTitle}>Awards</Text>
            </View>
            <View style={styles.awardBox}>
              <Text style={styles.awardText}>{details.Awards}</Text>
            </View>
          </View>
        )}

        {/* Box Office Section */}
        {details.BoxOffice && details.BoxOffice !== "N/A" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>Box Office</Text>
            </View>
            <View style={styles.boxOfficeBox}>
              <Text style={styles.boxOfficeText}>{details.BoxOffice}</Text>
            </View>
          </View>
        )}

        {/* Ratings Section - Using memoized ratings array */}
        {movieRatings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="star"
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>Ratings</Text>
            </View>
            <View style={styles.ratingsContainer}>
              {movieRatings.map((rating: any, idx: number) => (
                <View key={`${rating.Source}_${idx}`} style={styles.ratingItem}>
                  <Text style={styles.ratingSource}>{rating.Source}</Text>
                  <Text style={styles.ratingValue}>{rating.Value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* IMDb ID */}
        <View style={styles.imdbSection}>
          <MaterialCommunityIcons
            name="link"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.imdbText}>IMDb ID: {details.imdbID}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    position: "absolute",
    top: 36,
    left: 16,
    zIndex: 10,
    backgroundColor: `${COLORS.surface}80`,
    padding: 8,
    borderRadius: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 16,
  },
  posterSection: {
    position: "relative",
    width: "100%",
    aspectRatio: 0.7,
    backgroundColor: COLORS.surface,
    marginBottom: 20,
  },
  posterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  posterPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    elevation: 5,
  },
  ratingText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 16,
  },
  titleSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.surface,
  },
  chipText: {
    color: COLORS.text,
    fontSize: 12,
  },
  genreSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreChip: {
    backgroundColor: `${COLORS.primary}20`,
  },
  genreChipText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  plotText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
  },
  awardBox: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  awardText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  boxOfficeBox: {
    backgroundColor: `${COLORS.primary}15`,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  boxOfficeText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "700",
  },
  ratingsContainer: {
    gap: 8,
  },
  ratingItem: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingSource: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  ratingValue: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: "700",
  },
  imdbSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  imdbText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});