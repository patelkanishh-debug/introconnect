module {
  public type UserId = Principal;
  public type ChatId = Nat;
  public type MessageId = Nat;
  public type Timestamp = Int;

  public type Interest = {
    #Books;
    #Gaming;
    #Music;
    #Sports;
    #Art;
    #Tech;
    #Travel;
    #Food;
  };
};
