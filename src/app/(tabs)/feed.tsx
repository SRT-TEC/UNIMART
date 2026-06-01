import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const categories = [
  { id: "1", name: "All", icon: "🛍️" },
  { id: "2", name: "Electronics", icon: "📱" },
  { id: "3", name: "Textbooks", icon: "📚" },
  { id: "4", name: "Fashion", icon: "👗" },
  { id: "5", name: "Gadgets", icon: "💻" },
  { id: "6", name: "Hostel", icon: "🛏️" },
  { id: "7", name: "Services", icon: "🔧" },
];

const products = [
  { id: "1", name: "Used iPhone 12", price: "₦100,000", category: "Electronics", emoji: "📱", rating: 4.5, sold: 3 },
  { id: "2", name: "Calculus Textbook", price: "₦5,000", category: "Textbooks", emoji: "📚", rating: 4.0, sold: 12 },
  { id: "3", name: "Nike Sneakers", price: "₦25,000", category: "Fashion", emoji: "👟", rating: 4.8, sold: 5 },
  { id: "4", name: "Laptop Stand", price: "₦8,000", category: "Gadgets", emoji: "💻", rating: 4.2, sold: 7 },
  { id: "5", name: "Reading Lamp", price: "₦3,500", category: "Hostel", emoji: "💡", rating: 4.6, sold: 9 },
  { id: "6", name: "Wireless Earbuds", price: "₦15,000", category: "Electronics", emoji: "🎧", rating: 4.3, sold: 6 },
  { id: "7", name: "Jotter (5 pack)", price: "₦1,500", category: "Textbooks", emoji: "📓", rating: 4.1, sold: 20 },
  { id: "8", name: "Hoodie", price: "₦12,000", category: "Fashion", emoji: "👕", rating: 4.7, sold: 4 },
];

export default function Feed() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductPress = useCallback((product: any) => {
    setSelectedProduct(product);
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello 👋</Text>
          <Text style={styles.headerTitle}>Find a great deal</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search textbooks, gadgets..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              activeCategory === cat.name && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(cat.name)}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text
              style={[
                styles.categoryName,
                activeCategory === cat.name && styles.categoryNameActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            {filteredProducts.length} Products
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleProductPress(item)}
          >
            <View style={styles.productImage}>
              <Text style={styles.productEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <View style={styles.productMeta}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={styles.productRating}>{item.rating}</Text>
                <Text style={styles.productSold}> · {item.sold} sold</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Product Detail Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["70%"]}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetIndicator}
      >
        <BottomSheetView style={styles.sheetContent}>
          {selectedProduct && (
            <>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.sheetClose}
                onPress={handleCloseSheet}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>

              {/* Product Image */}
              <View style={styles.sheetImage}>
                <Text style={styles.sheetEmoji}>{selectedProduct.emoji}</Text>
              </View>

              {/* Product Info */}
              <Text style={styles.sheetName}>{selectedProduct.name}</Text>
              <Text style={styles.sheetPrice}>{selectedProduct.price}</Text>

              {/* Category & Rating */}
              <View style={styles.sheetMeta}>
                <View style={styles.sheetCategoryBadge}>
                  <Text style={styles.sheetCategoryText}>
                    {selectedProduct.category}
                  </Text>
                </View>
                <View style={styles.sheetRating}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.sheetRatingText}>
                    {selectedProduct.rating} · {selectedProduct.sold} sold
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.sheetDescription}>
                This is a great deal from a verified UniMart student seller.
                Item is in good condition and available for pickup on campus.
              </Text>

              {/* Action Buttons */}
              <View style={styles.sheetButtons}>
                <TouchableOpacity style={styles.chatButton}>
                  <Ionicons name="chatbubble-outline" size={18} color="#1B4FD8" />
                  <Text style={styles.chatButtonText}>Chat Seller</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wishlistButton}>
                  <Ionicons name="heart-outline" size={18} color="white" />
                  <Text style={styles.wishlistButtonText}>Add to Wishlist</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "white",
  },

  greeting: {
    fontSize: 13,
    color: "#64748B",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },

  notifButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },

  categoriesContainer: {
    backgroundColor: "white",
    paddingVertical: 12,
    marginBottom: 4,
  },

  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
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

  productsContent: {
    padding: 16,
    paddingBottom: 100,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 12,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  productCard: {
    width: "48.5%",
    backgroundColor: "white",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  productImage: {
    height: 120,
    backgroundColor: "#EAF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  productEmoji: {
    fontSize: 50,
  },

  productInfo: {
    padding: 10,
  },

  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1B4FD8",
    marginBottom: 6,
  },

  productMeta: {
    flexDirection: "row",
    alignItems: "center",
  },

  productRating: {
    fontSize: 11,
    color: "#64748B",
    marginLeft: 3,
  },

  productSold: {
    fontSize: 11,
    color: "#94A3B8",
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 16,
    color: "#94A3B8",
  },

  sheetBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  sheetIndicator: {
    backgroundColor: "#CBD5E1",
    width: 40,
  },

  sheetContent: {
    flex: 1,
    padding: 20,
  },

  sheetClose: {
    alignSelf: "flex-end",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  sheetImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#EAF2FF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  sheetEmoji: {
    fontSize: 80,
  },

  sheetName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },

  sheetPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B4FD8",
    marginBottom: 12,
  },

  sheetMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  sheetCategoryBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  sheetCategoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1B4FD8",
  },

  sheetRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  sheetRatingText: {
    fontSize: 13,
    color: "#64748B",
  },

  sheetDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 24,
  },

  sheetButtons: {
    flexDirection: "row",
    gap: 12,
  },

  chatButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#1B4FD8",
    gap: 8,
  },

  chatButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1B4FD8",
  },

  wishlistButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: "#1B4FD8",
    gap: 8,
  },

  wishlistButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});