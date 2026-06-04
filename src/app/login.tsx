import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onLogin = () => {
    if (!validate()) return;
    router.push("/(tabs)/feed");
  };

  const goToSignup = () => router.push("/signup");

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.top}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>UM</Text>
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your UniMart account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>University Email</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputErr : null]}
            placeholder="abc@university.edu"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
            }}
          />
          {errors.email && <Text style={styles.errText}>{errors.email}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.passBox, errors.password ? styles.inputErr : null]}>
            <TextInput
              style={styles.passInput}
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errText}>{errors.password}</Text>}
        </View>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={onLogin}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.signupBtn} onPress={goToSignup}>
          <Text style={styles.signupBtnText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
    padding: 24,
    justifyContent: "center",
  },
  top: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1B4FD8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
  },
  form: {
    width: "100%",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },
  inputErr: {
    borderColor: "#EF4444",
  },
  errText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  passBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },
  passInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0F172A",
  },
  eyeBtn: {
    paddingHorizontal: 14,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    color: "#1B4FD8",
    fontWeight: "500",
  },
  btn: {
    backgroundColor: "#1B4FD8",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  orText: {
    fontSize: 13,
    color: "#94A3B8",
    marginHorizontal: 12,
  },
  signupBtn: {
    borderWidth: 1.5,
    borderColor: "#1B4FD8",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  signupBtnText: {
    color: "#1B4FD8",
    fontSize: 16,
    fontWeight: "bold",
  },
});