import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Decorative background circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Logo Circle */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>UM</Text>
      </View>

      {/* App Name */}
      <Text style={styles.title}>UniMart</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Welcome to UniMart</Text>

      {/* Tagline */}
      <Text style={styles.tagline}>Buy, Sell & Swap on your campus</Text>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B4FD8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -60,
    right: -60,
  },

  bgCircle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -40,
    left: -60,
  },

  logoContainer: {
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

  logo: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#1B4FD8",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: 18,
    color: "white",
    marginTop: 8,
    fontWeight: "500",
  },

  tagline: {
    fontSize: 14,
    color: "#BFCFFF",
    marginTop: 8,
    marginBottom: 40,
    textAlign: "center",
  },

  button: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
  },

  buttonText: {
    color: "#1B4FD8",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
});