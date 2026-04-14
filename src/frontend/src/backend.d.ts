import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Timestamp = bigint;
export interface MessagePublic {
    id: MessageId;
    text: string;
    sentAt: Timestamp;
    chatId: ChatId;
    reactions: Array<Reaction>;
    senderId: UserId;
    readBy: Array<UserId>;
}
export interface IcebreakerPrompt {
    id: bigint;
    text: string;
}
export type MessageId = bigint;
export type ChatId = bigint;
export interface ChatSummary {
    lastMessageText?: string;
    lastMessageAt?: Timestamp;
    partnerDisplayName: string;
    partnerId: UserId;
    unreadCount: bigint;
    chatId: ChatId;
}
export interface UserProfilePublic {
    id: UserId;
    displayName: string;
    interests: Array<Interest>;
    createdAt: Timestamp;
}
export interface Reaction {
    userId: UserId;
    emoji: string;
}
export enum Interest {
    Art = "Art",
    Food = "Food",
    Tech = "Tech",
    Books = "Books",
    Travel = "Travel",
    Gaming = "Gaming",
    Music = "Music",
    Sports = "Sports"
}
export interface backendInterface {
    addReaction(chatId: ChatId, messageId: MessageId, emoji: string): Promise<void>;
    findNewMatch(): Promise<ChatId | null>;
    getChatMessages(chatId: ChatId): Promise<Array<MessagePublic>>;
    getIcebreakerPrompt(chatId: ChatId): Promise<IcebreakerPrompt>;
    getMyProfile(): Promise<UserProfilePublic | null>;
    getReactions(chatId: ChatId, messageId: MessageId): Promise<Array<[string, bigint]>>;
    listChats(): Promise<Array<ChatSummary>>;
    markMessagesRead(chatId: ChatId): Promise<void>;
    refreshIcebreakerPrompt(chatId: ChatId, currentPromptId: bigint): Promise<IcebreakerPrompt>;
    registerUser(displayName: string, interests: Array<Interest>): Promise<UserProfilePublic>;
    removeReaction(chatId: ChatId, messageId: MessageId): Promise<void>;
    sendMessage(chatId: ChatId, text: string): Promise<MessagePublic>;
    updateProfile(displayName: string, interests: Array<Interest>): Promise<UserProfilePublic>;
}
