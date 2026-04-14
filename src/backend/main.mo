import Types "types/users-matching-chat";
import ChatMixin "mixins/users-matching-chat-api";
import Map "mo:core/Map";
import List "mo:core/List";

actor {
  // ── State ─────────────────────────────────────────────────────────────────
  let users = Map.empty<Types.UserId, Types.UserProfile>();
  let chats = Map.empty<Types.ChatId, Types.Chat>();
  let messages = Map.empty<Types.ChatId, List.List<Types.Message>>();
  let matchHistory = List.empty<Types.MatchHistoryEntry>();
  let nextChatId = { var value : Nat = 0 };
  let nextMessageId = { var value : Nat = 0 };

  // ── Mixins ────────────────────────────────────────────────────────────────
  include ChatMixin(users, chats, messages, matchHistory, nextChatId, nextMessageId);
};
