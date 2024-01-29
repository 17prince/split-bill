import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [showAddFriends, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((cs) => !cs);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend((selectOne) =>
      selectOne?.id === friend?.id ? null : friend
    );
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          allFriends={friends}
          onSelection={handleSelectFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriends && <FormAddFriend onAddFriend={setFriends} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriends ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          friendToAsk={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ allFriends, onSelection, selectedFriend }) {
  return (
    <ul>
      {allFriends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend?.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ₹{Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you ₹{Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const userId = crypto.randomUUID();

    const newFriend = {
      id: userId,
      name,
      balance: 0,
      image: `${image}?u=${userId}`,
    };

    // Adding friend
    onAddFriend((cs) => [...cs, newFriend]);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friendname</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌅 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friendToAsk, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const padiByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? padiByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friendToAsk.name} </h2>

      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🕴️ Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑 {friendToAsk.name} Expense</label>
      <input type="text" disabled value={padiByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friendToAsk.name}</option>
      </select>

      <Button>Split bill </Button>
    </form>
  );
}

export default App;
