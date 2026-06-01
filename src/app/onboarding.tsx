import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const steps = [
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

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const isLastStep = currentStep === steps.length - 1;
  const { emoji, title, subtitle } = steps[currentStep];

  const handleContinue = () => {
    if (isLastStep) {
      router.push("/login");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Image Box */}
      <View style={styles.imageBox}>
        <Text style={styles.imageText}>{emoji}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentStep && styles.activeDot]}
          />
        ))}
      </View>

      {/* Continue / Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>
          {isLastStep ? "Get Started" : "Continue"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  skipButton: {
    position: "absolute",
    top: 56,
    right: 24,
  },

  skipText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },

  imageBox: {
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: "#EAF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },

  imageText: {
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

  dotsContainer: {
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

  button: {
    marginTop: 40,
    backgroundColor: "#1B4FD8",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});