import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const conversations = [
  {
    id: "1",
    name: "Oyedele Precious",
    lastMessage: "Is the iPhone still available?",
    time: "2:30 PM",
    unread: 2,
    emoji: "👩🏿",
    product: "Used iPhone 12",
  },
  {
    id: "2",
    name: "Oyeniran Temidayo",
    lastMessage: "Can you do ₦4,500 for the textbook?",
    time: "1:15 PM",
    unread: 0,
    emoji: "👨🏿 ",
    product: "Calculus Textbook",
  },
  {
    id: "3",
    name: "Babatunde Roland",
    lastMessage: "I'll pick it up tomorrow morning",
    time: "11:00 AM",
    unread: 1,
    emoji: "👨🏿",
    product: "Nike Sneakers",
  },
  {
    id: "4",
    name: "Sowande Jesutofunmi",
    lastMessage: "Thanks! Transaction was smooth 👍",
    time: "Yesterday",
    unread: 0,
    emoji: "👨🏿",
    product: "Reading Lamp",
  },
  {
    id: "5",
    name: "Oyeniran Samuel",
    lastMessage: "What's the condition of the laptop stand?",
    time: "Yesterday",
    unread: 0,
    emoji: "👨🏿",
    product: "Laptop Stand",
  },
];

export default function Chat() {
  const [search, setSearch] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", text: "Is the iPhone still available?", sender: "them", time: "2:28 PM" },
    { id: "2", text: "Yes it is! Still in great condition", sender: "me", time: "2:29 PM" },
    { id: "3", text: "How negotiable is the price?", sender: "them", time: "2:30 PM" },
  ]);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeChatData = conversations.find((c) => c.id === activeChat);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: message,
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setMessage("");
  };

  // Chat Window
  if (activeChat) {
    return (
      <View style={styles.container}>

        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setActiveChat(null)}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderName}>{activeChatData?.name}</Text>
            <Text style={styles.chatHeaderProduct}>{activeChatData?.product}</Text>
          </View>
          <TouchableOpacity style={styles.chatHeaderAvatar}>
            <Text style={styles.chatHeaderAvatarText}>{activeChatData?.emoji}</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === "me" ? styles.myBubble : styles.theirBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === "me" ? styles.myMessageText : styles.theirMessageText,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  item.sender === "me" ? styles.myMessageTime : styles.theirMessageTime,
                ]}
              >
                {item.time}
              </Text>
            </View>
          )}
        />

        {/* Message Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>

      </View>
    );
  }

  // Conversations List
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="create-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Conversations */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conversationsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubtext}>
              Start chatting with sellers on the marketplace
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => setActiveChat(item.id)}
          >
            {/* Avatar */}
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>{item.emoji}</Text>
            </View>

            {/* Info */}
            <View style={styles.conversationInfo}>
              <View style={styles.conversationTop}>
                <Text style={styles.conversationName}>{item.name}</Text>
                <Text style={styles.conversationTime}>{item.time}</Text>
              </View>
              <Text style={styles.conversationProduct}>{item.product}</Text>
              <View style={styles.conversationBottom}>
                <Text style={styles.conversationLastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

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

  conversationsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EAF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarEmoji: {
    fontSize: 28,
  },

  conversationInfo: {
    flex: 1,
  },

  conversationTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  conversationName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  conversationTime: {
    fontSize: 12,
    color: "#94A3B8",
  },

  conversationProduct: {
    fontSize: 11,
    color: "#1B4FD8",
    fontWeight: "500",
    marginTop: 1,
  },

  conversationBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },

  conversationLastMessage: {
    fontSize: 13,
    color: "#64748B",
    flex: 1,
  },

  unreadBadge: {
    backgroundColor: "#1B4FD8",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  unreadText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "white",
  },

  separator: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
    gap: 8,
  },

  emptyEmoji: {
    fontSize: 48,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },

  emptySubtext: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
  },

  // Chat window styles
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 12,
  },

  chatHeaderInfo: {
    flex: 1,
  },

  chatHeaderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
  },

  chatHeaderProduct: {
    fontSize: 12,
    color: "#1B4FD8",
    fontWeight: "500",
  },

  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  chatHeaderAvatarText: {
    fontSize: 22,
  },

  messagesList: {
    padding: 16,
    paddingBottom: 20,
    gap: 10,
  },

  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },

  myBubble: {
    backgroundColor: "#1B4FD8",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },

  theirBubble: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },

  myMessageText: {
    color: "white",
  },

  theirMessageText: {
    color: "#0F172A",
  },

  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },

  myMessageTime: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },

  theirMessageTime: {
    color: "#94A3B8",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 10,
  },

  messageInput: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
    maxHeight: 100,
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1B4FD8",
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
});