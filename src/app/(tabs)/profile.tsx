import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const listings = [
  { id: "1", name: "Used iPhone 12", price: "₦100,000", emoji: "📱", status: "Active" },
  { id: "2", name: "Calculus Textbook", price: "₦5,000", emoji: "📚", status: "Sold" },
  { id: "3", name: "Nike Sneakers", price: "₦25,000", emoji: "👟", status: "Active" },
];

const menuItems = [
  { id: "1", icon: "bookmark-outline", label: "Saved Items" },
  { id: "2", icon: "star-outline", label: "My Ratings" },
  { id: "3", icon: "shield-checkmark-outline", label: "Verify Student ID" },
  { id: "4", icon: "notifications-outline", label: "Notifications" },
  { id: "5", icon: "help-circle-outline", label: "Help & Support" },
  { id: "6", icon: "settings-outline", label: "Settings" },
];

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={22} color="#1B4FD8" />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SP</Text>
        </View>
        <Text style={styles.name}>Samuel Precious</Text>
        <Text style={styles.email}>abcr@university.edu</Text>

        {/* Verified Badge */}
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
          <Text style={styles.badgeText}>Verified Student</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Sold</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* My Listings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Listings</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listingsRow}
        >
          {listings.map((item) => (
            <TouchableOpacity key={item.id} style={styles.listingCard}>
              <View style={styles.listingImage}>
                <Text style={styles.listingEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.listingInfo}>
                <Text style={styles.listingName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.listingPrice}>{item.price}</Text>
                <View
                  style={[
                    styles.listingStatus,
                    item.status === "Sold" && styles.listingStatusSold,
                  ]}
                >
                  <Text
                    style={[
                      styles.listingStatusText,
                      item.status === "Sold" && styles.listingStatusTextSold,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
            >
              <View style={styles.menuIconBox}>
                <Ionicons name={item.icon as any} size={20} color="#1B4FD8" />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />

    </ScrollView>
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

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },

  editButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  profileCard: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1B4FD8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },

  email: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
    gap: 4,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A",
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    justifyContent: "space-around",
  },

  stat: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },

  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  statDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
  },

  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
  },

  seeAll: {
    fontSize: 13,
    color: "#1B4FD8",
    fontWeight: "500",
  },

  listingsRow: {
    gap: 12,
  },

  listingCard: {
    width: 130,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  listingImage: {
    height: 90,
    backgroundColor: "#EAF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  listingEmoji: {
    fontSize: 36,
  },

  listingInfo: {
    padding: 8,
  },

  listingName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },

  listingPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1B4FD8",
    marginTop: 2,
  },

  listingStatus: {
    marginTop: 4,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  listingStatusSold: {
    backgroundColor: "#FEE2E2",
  },

  listingStatusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16A34A",
  },

  listingStatusTextSold: {
    color: "#EF4444",
  },

  menuCard: {
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    gap: 8,
    marginBottom: 20,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#EF4444",
  },
});