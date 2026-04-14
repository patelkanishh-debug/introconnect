import Types "../types/users-matching-chat";
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";

module {

  // ── Icebreaker prompts ────────────────────────────────────────────────────

  let PROMPTS : [Text] = [
    "What's the last thing that made you smile today?",
    "If you could instantly master any skill, what would it be?",
    "What's your comfort show or book you revisit when you need cheering up?",
    "Would you rather explore the deep ocean or outer space?",
    "What hobby would you pick up if time and money were no object?",
    "What song has been stuck in your head lately?",
    "What's the most interesting fact you know?",
    "If you could have dinner with any fictional character, who would it be?",
    "What's one small thing that always brightens your day?",
    "Mountains or beach — which do you prefer, and why?",
    "What's a game, book, or show you'd recommend to anyone?",
    "If you could live in any time period, when would you choose?",
    "What's something you're quietly proud of?",
    "What's the weirdest food combination you secretly enjoy?",
    "If your life had a theme song, what would it be?",
    "What's a talent or skill most people don't know you have?",
    "What would your perfect lazy Sunday look like?",
    "What's the most spontaneous thing you've ever done?",
    "If you could speak any language fluently overnight, which one?",
    "What's a small act of kindness you remember receiving?",
  ];

  // ── User helpers ──────────────────────────────────────────────────────────

  public func newUser(id : Types.UserId, displayName : Text, now : Types.Timestamp) : Types.UserProfile {
    { id; var displayName; var interests = []; var createdAt = now };
  };

  public func toPublicProfile(self : Types.UserProfile) : Types.UserProfilePublic {
    { id = self.id; displayName = self.displayName; interests = self.interests; createdAt = self.createdAt };
  };

  public func findUser(
    users : Map.Map<Types.UserId, Types.UserProfile>,
    id : Types.UserId,
  ) : ?Types.UserProfilePublic {
    switch (users.get(id)) {
      case (?p) ?toPublicProfile(p);
      case null null;
    };
  };

  public func upsertUser(
    users : Map.Map<Types.UserId, Types.UserProfile>,
    id : Types.UserId,
    displayName : Text,
    interests : [Types.Interest],
    now : Types.Timestamp,
  ) : Types.UserProfilePublic {
    switch (users.get(id)) {
      case (?existing) {
        existing.displayName := displayName;
        existing.interests := interests;
        toPublicProfile(existing);
      };
      case null {
        let profile = newUser(id, displayName, now);
        profile.interests := interests;
        users.add(id, profile);
        toPublicProfile(profile);
      };
    };
  };

  // ── Matching helpers ──────────────────────────────────────────────────────

  public func previousMatches(
    matchHistory : List.List<Types.MatchHistoryEntry>,
    caller : Types.UserId,
  ) : Set.Set<Types.UserId> {
    let result = Set.empty<Types.UserId>();
    matchHistory.forEach(func(entry) {
      if (Principal.equal(entry.userId, caller)) {
        result.add(entry.matchedWith);
      };
    });
    result;
  };

  /// Returns a matched UserId (by shared interests, random fallback) or null if no candidates.
  public func findMatch(
    caller : Types.UserId,
    users : Map.Map<Types.UserId, Types.UserProfile>,
    matchHistory : List.List<Types.MatchHistoryEntry>,
  ) : ?Types.UserId {
    let callerProfile = switch (users.get(caller)) {
      case (?p) p;
      case null return null; // caller not registered
    };

    let prev = previousMatches(matchHistory, caller);

    // Collect candidates: other users not already matched
    let candidates = List.empty<Types.UserId>();
    for ((uid, _) in users.entries()) {
      if (
        not Principal.equal(uid, caller) and
        not prev.contains(uid)
      ) {
        candidates.add(uid);
      };
    };

    if (candidates.isEmpty()) return null;

    // Prefer candidates with shared interests
    let callerInterests = Set.fromArray(callerProfile.interests, interestCompare);
    let withShared = candidates.filter(func(uid) {
      switch (users.get(uid)) {
        case (?p) {
          p.interests.any(func(i) { callerInterests.contains(interestCompare, i) });
        };
        case null false;
      };
    });

    let pool = if (withShared.isEmpty()) candidates else withShared;

    // Pseudo-random pick using caller principal text hash as seed
    let seed = principalSeed(caller);
    let idx = seed % pool.size();
    ?pool.at(idx);
  };

  /// Records a new match entry to prevent rematching.
  public func recordMatch(
    matchHistory : List.List<Types.MatchHistoryEntry>,
    userA : Types.UserId,
    userB : Types.UserId,
    chatId : Types.ChatId,
  ) {
    matchHistory.add({ userId = userA; matchedWith = userB; chatId });
    matchHistory.add({ userId = userB; matchedWith = userA; chatId });
  };

  // ── Chat helpers ──────────────────────────────────────────────────────────

  public func newChat(id : Types.ChatId, userA : Types.UserId, userB : Types.UserId, now : Types.Timestamp) : Types.Chat {
    {
      id;
      participants = [userA, userB];
      createdAt = now;
      var lastMessageId = null;
      var lastMessageText = null;
      var lastMessageAt = null;
    };
  };

  public func isParticipant(chat : Types.Chat, userId : Types.UserId) : Bool {
    chat.participants.any(func(p) { Principal.equal(p, userId) });
  };

  public func getChatSummary(
    chat : Types.Chat,
    callerId : Types.UserId,
    users : Map.Map<Types.UserId, Types.UserProfile>,
    messages : Map.Map<Types.ChatId, List.List<Types.Message>>,
  ) : Types.ChatSummary {
    // find partner
    let partnerId = switch (chat.participants.find(func(p) { not Principal.equal(p, callerId) })) {
      case (?p) p;
      case null callerId; // fallback (shouldn't happen)
    };
    let partnerDisplayName = switch (users.get(partnerId)) {
      case (?p) p.displayName;
      case null "Unknown";
    };
    let msgs = switch (messages.get(chat.id)) {
      case (?m) m;
      case null List.empty<Types.Message>();
    };
    let unreadCount = countUnread(msgs, callerId);
    {
      chatId = chat.id;
      partnerDisplayName;
      partnerId;
      lastMessageText = chat.lastMessageText;
      lastMessageAt = chat.lastMessageAt;
      unreadCount;
    };
  };

  // ── Message helpers ───────────────────────────────────────────────────────

  public func newMessage(
    id : Types.MessageId,
    chatId : Types.ChatId,
    senderId : Types.UserId,
    text : Text,
    now : Types.Timestamp,
  ) : Types.Message {
    { id; chatId; senderId; text; sentAt = now; var readBy = [senderId]; var reactions = [] };
  };

  public func toPublicMessage(self : Types.Message) : Types.MessagePublic {
    { id = self.id; chatId = self.chatId; senderId = self.senderId; text = self.text; sentAt = self.sentAt; readBy = self.readBy; reactions = self.reactions };
  };

  public func countUnread(
    msgs : List.List<Types.Message>,
    readerId : Types.UserId,
  ) : Nat {
    msgs.foldLeft<Nat, Types.Message>(0, func(acc, msg) {
      if (msg.readBy.any(func(u) { Principal.equal(u, readerId) })) acc
      else acc + 1;
    });
  };

  public func markRead(
    msgs : List.List<Types.Message>,
    readerId : Types.UserId,
  ) {
    msgs.mapInPlace(func(msg) {
      if (not msg.readBy.any(func(u) { Principal.equal(u, readerId) })) {
        msg.readBy := msg.readBy.concat([readerId]);
      };
      msg;
    });
  };

  // ── Reaction helpers ──────────────────────────────────────────────────────

  public func addReaction(self : Types.Message, userId : Types.UserId, emoji : Text) {
    // Remove existing reaction from this user, then add new one
    let filtered = self.reactions.filter(func(r) { not Principal.equal(r.userId, userId) });
    self.reactions := filtered.concat([{ userId; emoji }]);
  };

  public func removeReaction(self : Types.Message, userId : Types.UserId) {
    self.reactions := self.reactions.filter(func(r) { not Principal.equal(r.userId, userId) });
  };

  // ── Icebreaker helpers ────────────────────────────────────────────────────

  public func randomPrompt(seed : Nat) : Types.IcebreakerPrompt {
    let idx = seed % PROMPTS.size();
    { id = idx; text = PROMPTS[idx] };
  };

  public func differentPrompt(currentId : Nat, seed : Nat) : Types.IcebreakerPrompt {
    let count = PROMPTS.size();
    // pick an offset so we never land on currentId
    // count is always >= 2, so (count - 1) is safe; use wrapping subtraction via Int
    let denom : Nat = if (count >= 2) count - 1 else 1;
    let offset = (seed % denom) + 1;
    let idx = (currentId + offset) % count;
    { id = idx; text = PROMPTS[idx] };
  };

  // ── Private helpers ───────────────────────────────────────────────────────

  func principalSeed(p : Types.UserId) : Nat {
    let bytes = p.toBlob();
    var h : Nat = 0;
    for (b in bytes.vals()) {
      h := (h * 31 + b.toNat()) % 1_000_000_007;
    };
    h;
  };

  func interestCompare(a : Types.Interest, b : Types.Interest) : { #less; #equal; #greater } {
    let aIdx = interestIndex(a);
    let bIdx = interestIndex(b);
    Nat.compare(aIdx, bIdx);
  };

  func interestIndex(i : Types.Interest) : Nat {
    switch i {
      case (#Books) 0;
      case (#Gaming) 1;
      case (#Music) 2;
      case (#Sports) 3;
      case (#Art) 4;
      case (#Tech) 5;
      case (#Travel) 6;
      case (#Food) 7;
    };
  };
};
