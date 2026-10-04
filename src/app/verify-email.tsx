import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { verifyEmailToken } from "../services/api";

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your email...");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    if (!token || Array.isArray(token)) {
      setMessage("This verification link is missing a valid token.");
      return () => {
        isCurrent = false;
      };
    }

    verifyEmailToken(token)
      .then(() => {
        if (isCurrent) {
          setIsVerified(true);
          setMessage("Your email has been verified. You can now log in.");
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to verify your email. Please request a new link.",
          );
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [token]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Email verification</Text>
      <Text style={styles.message}>{message}</Text>
      {isVerified ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/login" as any)}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    color: "#0F172A",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  message: {
    color: "#64748B",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#1B4FD8",
    borderRadius: 12,
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
