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

const categories = [
  { id: "1", name: "Electronics", icon: "📱" },
  { id: "2", name: "Textbooks", icon: "📚" },
  { id: "3", name: "Fashion", icon: "👗" },
  { id: "4", name: "Gadgets", icon: "💻" },
  
  { id: "6", name: "Services", icon: "🔧" },
];

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [condition, setCondition] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    // TODO: save product to database
    router.push("/(tabs)/feed");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sell an Item</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Image Upload Box */}
        <TouchableOpacity style={styles.imageUpload}>
          <Ionicons name="camera-outline" size={32} color="#94A3B8" />
          <Text style={styles.imageUploadText}>Add Photos</Text>
          <Text style={styles.imageUploadSubtext}>Tap to upload up to 5 photos</Text>
        </TouchableOpacity>

        {/* Product Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g.IPhone 12"
            placeholderTextColor="#94A3B8"
            value={productName}
            onChangeText={setProductName}
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.name && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryName,
                    selectedCategory === cat.name && styles.categoryNameActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (₦)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 15000"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        {/* Condition */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Condition</Text>
          <View style={styles.conditionRow}>
            {["New", "Like New", "Used"].map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.conditionChip,
                  condition === c && styles.conditionChipActive,
                ]}
                onPress={() => setCondition(c)}
              >
                <Text
                  style={[
                    styles.conditionText,
                    condition === c && styles.conditionTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your item — condition, specs, reason for selling..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location on Campus</Text>
          <View style={styles.locationInput}>
            <Ionicons name="location-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.locationTextInput}
              placeholder="e.g. Mozambique Hall, Block C"
              placeholderTextColor="#94A3B8"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Post Listing</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },

  scrollContent: {
    padding: 20,
  },

  imageUpload: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 14,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 6,
  },

  imageUploadText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },

  imageUploadSubtext: {
    fontSize: 12,
    color: "#94A3B8",
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0F172A",
  },

  categoryList: {
    gap: 8,
  },

  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    gap: 6,
    height: 40,
  },

  categoryChipActive: {
    backgroundColor: "#1B4FD8",
  },

  categoryIcon: {
    fontSize: 14,
  },

  categoryName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },

  categoryNameActive: {
    color: "white",
  },

  conditionRow: {
    flexDirection: "row",
    gap: 10,
  },

  conditionChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    backgroundColor: "white",
  },

  conditionChipActive: {
    borderColor: "#1B4FD8",
    backgroundColor: "#EEF2FF",
  },

  conditionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },

  conditionTextActive: {
    color: "#1B4FD8",
  },

  textArea: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0F172A",
    height: 110,
    textAlignVertical: "top",
  },

  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 8,
  },

  locationTextInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0F172A",
  },

  button: {
    backgroundColor: "#1B4FD8",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});