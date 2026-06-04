import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const onboardingData = [
  {
    emoji: "🛍️",
    title: "Campus Shopping Made Simple",
    subtitle: "Everything a student needs, all in one marketplace.",
  },
  {
    emoji: "🎓",
    title: "Verify Your Student Status",
    subtitle: "Use your university email to join your campus community.",
  },
  {
    emoji: "💬",
    title: "Connect with Students",
    subtitle: "Chat securely with buyers and sellers right inside the app.",
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const isLast = step === onboardingData.length - 1;
  const current = onboardingData[step];

  const nextStep = () => {
    if (isLast) {
      router.push("/login");
    } else {
      setStep(step + 1);
    }
  };

  const skip = () => router.push("/login");

  return (
    <View style={styles.wrapper}>

      <TouchableOpacity style={styles.skipBtn} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.imgBox}>
        <Text style={styles.emoji}>{current.emoji}</Text>
      </View>

      <Text style={styles.title}>{current.title}</Text>
      <Text style={styles.subtitle}>{current.subtitle}</Text>

      <View style={styles.dots}>
        {onboardingData.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.activeDot]} />
        ))}
      </View>

      <TouchableOpacity style={styles.btn} onPress={nextStep}>
        <Text style={styles.btnText}>{isLast ? "Get Started" : "Continue"}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  skipBtn: {
    position: "absolute",
    top: 56,
    right: 24,
  },

  skipText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },

  imgBox: {
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: "#EAF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },

  emoji: {
    fontSize: 70,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0F172A",
    paddingHorizontal: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  dots: {
    flexDirection: "row",
    marginTop: 32,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 5,
  },

  activeDot: {
    backgroundColor: "#1B4FD8",
    width: 24,
    borderRadius: 5,
  },

  btn: {
    marginTop: 40,
    backgroundColor: "#1B4FD8",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
  },

  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});