import { useState } from "react";
import convoService from "../services/convoService";

const NewConvo = ({ close, onNewConvoAdded }) => {
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

    const createConvo = async () => {
      try {
        const body = {
          name: title,
          participants: users,
        };
        await convoService.create(body);
        close();
        onNewConvoAdded();
      } catch (error) {
        console.log(error);
        if (
          error.response &&
          error.response.data &&
          /^User .* not found$/.test(error.response.data.error)
        ) {
          alert(error.response.data.error);
        } else {
          alert("Something went wrong, try again");
        }
      }
    };

    createConvo();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center justify-center pointer-events-auto w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md max-w-md w-full"
        >
          {users.length > 1 && (
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              required
              placeholder="Title"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
          )}
          {users.map((user, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                value={user}
                onChange={(event) => handleUserChange(index, event)}
                required
                placeholder="Username"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveUser(index)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddUser}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mb-4"
            >
              Add Another User
            </button>
          </div>
          <div className="flex justify-center gap-2">
            <button
              type="submit"
              className="w-1/3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
            <button
              onClick={close}
              className="w-1/3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewConvo;
