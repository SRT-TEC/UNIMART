import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const router = useRouter();

  const validate = () => {
    const e: typeof errors = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim()) e.lastName = "Last name is required";
    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = "Enter a valid email address";
    }
    if (!password.trim()) {
      e.password = "Password is required";
    } else if (password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword.trim()) {
      e.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      e.confirmPassword = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSignup = () => {
    if (!validate()) return;
    router.push("/(tabs)/feed");
  };

  const goToLogin = () => router.push("/login");

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.top}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>UM</Text>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join your campus marketplace today</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={[styles.input, errors.firstName ? styles.inputErr : null]}
                placeholder="First Name"
                placeholderTextColor="#94A3B8"
                autoCapitalize="words"
                value={firstName}
                onChangeText={(t) => {
                  setFirstName(t);
                  if (errors.firstName) setErrors((e) => ({ ...e, firstName: undefined }));
                }}
              />
              {errors.firstName && <Text style={styles.errText}>{errors.firstName}</Text>}
            </View>

            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={[styles.input, errors.lastName ? styles.inputErr : null]}
                placeholder="Last Name"
                placeholderTextColor="#94A3B8"
                autoCapitalize="words"
                value={lastName}
                onChangeText={(t) => {
                  setLastName(t);
                  if (errors.lastName) setErrors((e) => ({ ...e, lastName: undefined }));
                }}
              />
              {errors.lastName && <Text style={styles.errText}>{errors.lastName}</Text>}
            </View>
          </View>

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
                placeholder="Create a password"
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

          <View style={styles.field}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.passBox, errors.confirmPassword ? styles.inputErr : null]}>
              <TextInput
                style={styles.passInput}
                placeholder="Confirm  your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={(t) => {
                  setConfirmPassword(t);
                  if (errors.confirmPassword) setErrors((e) => ({ ...e, confirmPassword: undefined }));
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showConfirm ? "eye" : "eye-off"}
                  size={20}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errText}>{errors.confirmPassword}</Text>}
          </View>

          <Text style={styles.terms}>
            By signing up, you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>

          <TouchableOpacity style={styles.btn} onPress={onSignup}>
            <Text style={styles.btnText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={goToLogin}>
            <Text style={styles.loginBtnText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "white" },
  scrollContent: { padding: 24, flexGrow: 1, justifyContent: "center" },
  top: { alignItems: "center", marginBottom: 36 },
  logoBox: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: "#1B4FD8", justifyContent: "center",
    alignItems: "center", marginBottom: 16,
  },
  logoText: { fontSize: 24, fontWeight: "bold", color: "white" },
  title: { fontSize: 26, fontWeight: "bold", color: "#0F172A" },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 6 },
  form: { width: "100%" },
  nameRow: { flexDirection: "row", gap: 12 },
  halfField: { flex: 1 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#0F172A", marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16,
    fontSize: 15, color: "#0F172A", backgroundColor: "#F8FAFC",
  },
  inputErr: { borderColor: "#EF4444" },
  errText: { fontSize: 12, color: "#EF4444", marginTop: 4, marginLeft: 4 },
  passBox: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#E2E8F0",
    borderRadius: 12, backgroundColor: "#F8FAFC",
  },
  passInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, fontSize: 15, color: "#0F172A" },
  eyeBtn: { paddingHorizontal: 14 },
  terms: { fontSize: 12, color: "#64748B", textAlign: "center", marginBottom: 24, lineHeight: 18 },
  termsLink: { color: "#1B4FD8", fontWeight: "600" },
  btn: { backgroundColor: "#1B4FD8", paddingVertical: 14, borderRadius: 30, alignItems: "center" },
  btnText: { color: "white", fontSize: 16, fontWeight: "bold" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  line: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
  orText: { fontSize: 13, color: "#94A3B8", marginHorizontal: 12 },
  loginBtn: { borderWidth: 1.5, borderColor: "#1B4FD8", paddingVertical: 14, borderRadius: 30, alignItems: "center" },
  loginBtnText: { color: "#1B4FD8", fontSize: 15, fontWeight: "bold" },
});