import Common "common";

module {
  public type UserId = Common.UserId;
  public type ChatId = Common.ChatId;
  public type MessageId = Common.MessageId;
  public type Timestamp = Common.Timestamp;
  public type Interest = Common.Interest;

  // User profile — name-only anonymity, no email, no photo
  public type UserProfile = {
    id : UserId;
    var displayName : Text;
    var interests : [Interest];
    var createdAt : Timestamp;
  };

  // Public (shared) version of UserProfile for API boundary
  public type UserProfilePublic = {
    id : UserId;
    displayName : Text;
    interests : [Interest];
    createdAt : Timestamp;
  };

  // A matched pair of users
  public type Match = {
    id : Nat;
    chatId : ChatId;
    userA : UserId;
    userB : UserId;
    matchedAt : Timestamp;
    sharedInterests : [Interest];
  };

  // Internal match history entry to prevent rematches
  public type MatchHistoryEntry = {
    userId : UserId;
    matchedWith : UserId;
    chatId : ChatId;
  };

  // A single chat message
  public type Message = {
    id : MessageId;
    chatId : ChatId;
    senderId : UserId;
    text : Text;
    sentAt : Timestamp;
    var readBy : [UserId];
    var reactions : [Reaction];
  };

  // Public (shared) version of Message
  public type MessagePublic = {
    id : MessageId;
    chatId : ChatId;
    senderId : UserId;
    text : Text;
    sentAt : Timestamp;
    readBy : [UserId];
    reactions : [Reaction];
  };

  // Emoji reaction on a message
  public type Reaction = {
    userId : UserId;
    emoji : Text;
  };

  // A chat session between two matched users
  public type Chat = {
    id : ChatId;
    participants : [UserId];
    createdAt : Timestamp;
    var lastMessageId : ?MessageId;
    var lastMessageText : ?Text;
    var lastMessageAt : ?Timestamp;
  };

  // Public (shared) summary of a chat for the list view
  public type ChatSummary = {
    chatId : ChatId;
    partnerDisplayName : Text;
    partnerId : UserId;
    lastMessageText : ?Text;
    lastMessageAt : ?Timestamp;
    unreadCount : Nat;
  };

  // An icebreaker prompt
  public type IcebreakerPrompt = {
    id : Nat;
    text : Text;
  };
};
