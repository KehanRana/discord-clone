import React, { useEffect, useState } from "react";
import db from "./firebase";
import { Avatar } from "@material-ui/core";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await db.collection("users").get();
        const allUsers = usersSnapshot.docs.map((doc) => doc.data());

        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="userList">
      <h2>Server Members</h2>
      <ul>
        {users.map((user, photoURL) => (
          <div className="userList__user" key={user.id}>
            <Avatar className="userList__photo" src={photoURL} /> {user.displayName}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
