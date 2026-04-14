import Types "../types/users-matching-chat";
import Lib "../lib/users-matching-chat";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

// Mixin: exposes the public API for the users-matching-chat domain.
// Receives all required state slices as parameters.
mixin (
  users : Map.Map<Types.UserId, Types.UserProfile>,
  chats : Map.Map<Types.ChatId, Types.Chat>,
  messages : Map.Map<Types.ChatId, List.List<Types.Message>>,
  matchHistory : List.List<Types.MatchHistoryEntry>,
  nextChatId : { var value : Nat },
  nextMessageId : { var value : Nat },
) {

  // ── User Onboarding & Identity ────────────────────────────────────────────

  /// Register or update the caller's profile with a display name and interests.
  public shared ({ caller }) func registerUser(displayName : Text, interests : [Types.Interest]) : async Types.UserProfilePublic {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    let now = Time.now();
    Lib.upsertUser(users, caller, displayName, interests, now);
  };

  /// Get the caller's own profile.
  public shared query ({ caller }) func getMyProfile() : async ?Types.UserProfilePublic {
    Lib.findUser(users, caller);
  };

  /// Update the caller's display name and interests.
  public shared ({ caller }) func updateProfile(displayName : Text, interests : [Types.Interest]) : async Types.UserProfilePublic {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    let now = Time.now();
    Lib.upsertUser(users, caller, displayName, interests, now);
  };

  // ── Matching & Discovery ──────────────────────────────────────────────────

  /// Find a new match by shared interests (random fallback). Returns the new ChatId or null if no eligible users.
  public shared ({ caller }) func findNewMatch() : async ?Types.ChatId {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    switch (Lib.findMatch(caller, users, matchHistory)) {
      case null null;
      case (?partner) {
        let chatId = nextChatId.value;
        nextChatId.value += 1;
        let now = Time.now();
        let chat = Lib.newChat(chatId, caller, partner, now);
        chats.add(chatId, chat);
        messages.add(chatId, List.empty<Types.Message>());
        Lib.recordMatch(matchHistory, caller, partner, chatId);
        ?chatId;
      };
    };
  };

  // ── Chat & Messaging ──────────────────────────────────────────────────────

  /// Send a text message to a matched partner in the given chat.
  public shared ({ caller }) func sendMessage(chatId : Types.ChatId, text : Text) : async Types.MessagePublic {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    let chat = switch (chats.get(chatId)) {
      case (?c) c;
      case null Runtime.trap("Chat not found");
    };
    if (not Lib.isParticipant(chat, caller)) Runtime.trap("Not a participant");
    let msgId = nextMessageId.value;
    nextMessageId.value += 1;
    let now = Time.now();
    let msg = Lib.newMessage(msgId, chatId, caller, text, now);
    let chatMsgs = switch (messages.get(chatId)) {
      case (?m) m;
      case null {
        let m = List.empty<Types.Message>();
        messages.add(chatId, m);
        m;
      };
    };
    chatMsgs.add(msg);
    chat.lastMessageId := ?msgId;
    chat.lastMessageText := ?text;
    chat.lastMessageAt := ?now;
    msg.toPublicMessage();
  };

  /// Get all messages for a given chat (caller must be a participant).
  public shared query ({ caller }) func getChatMessages(chatId : Types.ChatId) : async [Types.MessagePublic] {
    let chat = switch (chats.get(chatId)) {
      case (?c) c;
      case null Runtime.trap("Chat not found");
    };
    if (not Lib.isParticipant(chat, caller)) Runtime.trap("Not a participant");
    let msgs = switch (messages.get(chatId)) {
      case (?m) m;
      case null return [];
    };
    msgs.map<Types.Message, Types.MessagePublic>(func(m) { m.toPublicMessage() }).toArray();
  };

  /// Get list of active chats with latest message text and unread count.
  public shared query ({ caller }) func listChats() : async [Types.ChatSummary] {
    let result = List.empty<Types.ChatSummary>();
    for ((_, chat) in chats.entries()) {
      if (Lib.isParticipant(chat, caller)) {
        result.add(Lib.getChatSummary(chat, caller, users, messages));
      };
    };
    result.toArray();
  };

  /// Mark all messages in a chat as read by the caller.
  public shared ({ caller }) func markMessagesRead(chatId : Types.ChatId) : async () {
    let chat = switch (chats.get(chatId)) {
      case (?c) c;
      case null Runtime.trap("Chat not found");
    };
    if (not Lib.isParticipant(chat, caller)) Runtime.trap("Not a participant");
    switch (messages.get(chatId)) {
      case (?msgs) Lib.markRead(msgs, caller);
      case null ();
    };
  };

  // ── Message Reactions ─────────────────────────────────────────────────────

  /// Add or replace an emoji reaction from the caller on a message.
  public shared ({ caller }) func addReaction(chatId : Types.ChatId, messageId : Types.MessageId, emoji : Text) : async () {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    let chat = switch (chats.get(chatId)) {
      case (?c) c;
      case null Runtime.trap("Chat not found");
    };
    if (not Lib.isParticipant(chat, caller)) Runtime.trap("Not a participant");
    let msgs = switch (messages.get(chatId)) {
      case (?m) m;
      case null Runtime.trap("No messages in chat");
    };
    let msg = switch (msgs.find(func(m : Types.Message) : Bool { m.id == messageId })) {
      case (?m) m;
      case null Runtime.trap("Message not found");
    };
    msg.addReaction(caller, emoji);
  };

  /// Remove the caller's reaction from a message.
  public shared ({ caller }) func removeReaction(chatId : Types.ChatId, messageId : Types.MessageId) : async () {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    let chat = switch (chats.get(chatId)) {
      case (?c) c;
      case null Runtime.trap("Chat not found");
    };
    if (not Lib.isParticipant(chat, caller)) Runtime.trap("Not a participant");
    let msgs = switch (messages.get(chatId)) {
      case (?m) m;
      case null Runtime.trap("No messages in chat");
    };
    let msg = switch (msgs.find(func(m : Types.Message) : Bool { m.id == messageId })) {
      case (?m) m;
      case null Runtime.trap("Message not found");
    };
    msg.removeReaction(caller);
  };

  /// Get reaction counts per emoji for a given message.
  public shared query ({ caller }) func getReactions(chatId : Types.ChatId, messageId : Types.MessageId) : async [(Text, Nat)] {
    let chat = switch (chats.get(chatId)) {
      case (?c) c;
      case null Runtime.trap("Chat not found");
    };
    if (not Lib.isParticipant(chat, caller)) Runtime.trap("Not a participant");
    let msgs = switch (messages.get(chatId)) {
      case (?m) m;
      case null return [];
    };
    let msg = switch (msgs.find(func(m : Types.Message) : Bool { m.id == messageId })) {
      case (?m) m;
      case null return [];
    };
    // Aggregate counts per emoji
    let counts = Map.empty<Text, Nat>();
    for (r in msg.reactions.values()) {
      let prev = switch (counts.get(r.emoji)) {
        case (?n) n;
        case null 0;
      };
      counts.add(r.emoji, prev + 1);
    };
    counts.toArray();
  };

  // ── Icebreaker Prompts ────────────────────────────────────────────────────

  /// Get a random icebreaker prompt for a chat.
  public shared query ({ caller }) func getIcebreakerPrompt(chatId : Types.ChatId) : async Types.IcebreakerPrompt {
    let chat = switch (chats.get(chatId)) {
      case (?c) c;
      case null Runtime.trap("Chat not found");
    };
    if (not Lib.isParticipant(chat, caller)) Runtime.trap("Not a participant");
    // Use chatId as seed for consistent prompt per chat
    Lib.randomPrompt(chatId);
  };

  /// Refresh to get a different icebreaker prompt (different from the current one).
  public shared query ({ caller }) func refreshIcebreakerPrompt(chatId : Types.ChatId, currentPromptId : Nat) : async Types.IcebreakerPrompt {
    let chat = switch (chats.get(chatId)) {
      case (?c) c;
      case null Runtime.trap("Chat not found");
    };
    if (not Lib.isParticipant(chat, caller)) Runtime.trap("Not a participant");
    // Mix chatId and currentPromptId for a varied seed
    Lib.differentPrompt(currentPromptId, chatId + currentPromptId + 1);
  };
};
