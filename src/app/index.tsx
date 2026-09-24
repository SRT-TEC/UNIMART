import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  const goToOnboarding = () => {
    router.push("/onboarding");
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <View style={styles.logoBox}>
        <Text style={styles.logoText}>UM</Text>
      </View>

      <Text style={styles.appName}>UniMart</Text>
      <Text style={styles.tagline1}>Welcome to UniMart</Text>
      <Text style={styles.tagline2}>Buy, Sell & Swap on your campus</Text>

      <TouchableOpacity style={styles.btn} onPress={goToOnboarding}>
        <Text style={styles.btnText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#1B4FD8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  circle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -60,
    right: -60,
  },

  circle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -40,
    left: -60,
  },

  logoBox: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },

  logoText: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#1B4FD8",
  },

  appName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 0.5,
  },

  tagline1: {
    fontSize: 18,
    color: "white",
    marginTop: 8,
    fontWeight: "500",
  },

  tagline2: {
    fontSize: 14,
    color: "#BFCFFF",
    marginTop: 8,
    marginBottom: 40,
    textAlign: "center",
  },

  btn: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
  },

  btnText: {
    color: "#1B4FD8",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
});