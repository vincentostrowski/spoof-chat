import { useState } from "react";
import convoService from "../services/convoService";

const NewConvo = (props) => {
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState([""]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleUserChange = (index, event) => {
    const newUsers = [...users];
    newUsers[index] = event.target.value;
    setUsers(newUsers);
  };

  const handleAddUser = () => {
    if (users.length < 4) {
      setUsers([...users, ""]);
    } else {
      alert("You can only add up to 4 users.");
    }
  };

  const handleRemoveUser = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would handle the logic of submitting the values to an endpoint
    // For example, you might make a POST request to your server with the title and users as the request body
    const createConvo = async () => {
      try {
        const body = {
          name: title,
          participants: users,
        };
        await convoService.create(body);
        props.close();
        props.onNewConvoAdded();
      } catch (error) {
        console.log(error);
      }
    };

    createConvo();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          required
        />
      </label>
      {users.map((user, index) => (
        <div key={index}>
          <label>
            User {index + 1}:
            <input
              type="text"
              value={user}
              onChange={(event) => handleUserChange(index, event)}
              required
            />
          </label>
          <button type="button" onClick={() => handleRemoveUser(index)}>
            Remove User
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddUser}>
        Add Another User
      </button>
      <input type="submit" value="Submit" />
    </form>
  );
};

export default NewConvo;
