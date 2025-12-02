import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text } from "react-native";

export default function MovieDetail() {
  const { imdbID } = useLocalSearchParams();
  const API_KEY = Constants.expoConfig?.extra?.omdbApiKey as string;

  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`)
      .then((res) => res.json())
      .then((data) => setDetails(data));
  }, []);

  if (!details) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <ScrollView style={{ paddingHorizontal: 20, paddingTop: 40 }}>
     <Image
  source={{ uri: details.Poster }}
  style={{
    width: "100%",
    height: 450,       // smaller height
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: "contain",
  }}
/>
  
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>
        {details.Title}
      </Text>
  
      <Text style={{ fontSize: 16, color: "#666", marginBottom: 10 }}>
        {details.Genre}
      </Text>
  
      {/* Rating + Runtime */}
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        ⭐ <Text style={{ fontWeight: "bold" }}>{details.imdbRating}</Text>/10
      </Text>
  
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        ⏱ Runtime: {details.Runtime}
      </Text>
  
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        📅 Released: {details.Released}
      </Text>
  
      {/* Plot */}
      <Text style={{ marginTop: 15, fontSize: 17, fontWeight: "bold" }}>
        Plot
      </Text>
      <Text style={{ fontSize: 15, marginTop: 5, lineHeight: 22 }}>
        {details.Plot}
      </Text>
  
      {/* Cast */}
      <Text style={{ marginTop: 20, fontSize: 17, fontWeight: "bold" }}>
        Cast
      </Text>
      <Text style={{ fontSize: 15, marginTop: 5 }}>
        {details.Actors}
      </Text>
  
      {/* Director */}
      <Text style={{ marginTop: 20, fontSize: 17, fontWeight: "bold" }}>
        Director
      </Text>
      <Text style={{ fontSize: 15, marginTop: 5 }}>
        {details.Director}
      </Text>
  
      {/* Awards */}
      {details.Awards !== "N/A" && (
        <>
          <Text style={{ marginTop: 20, fontSize: 17, fontWeight: "bold" }}>
            Awards
          </Text>
          <Text style={{ fontSize: 15, marginTop: 5 }}>
            🏆 {details.Awards}
          </Text>
        </>
      )}
  
      {/* Box Office */}
      {details.BoxOffice !== "N/A" && (
        <>
          <Text style={{ marginTop: 20, fontSize: 17, fontWeight: "bold" }}>
            Box Office
          </Text>
          <Text style={{ fontSize: 15, marginTop: 5 }}>
            💰 {details.BoxOffice}
          </Text>
        </>
      )}
    </ScrollView>
  );
  
}
