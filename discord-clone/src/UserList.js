import React from 'react'

function UserList({ users }) {
  return (
    <div className='userList'>
        <h2>
            Active Users
        </h2>
        <ul>
            {users && users.map((user) => (
                <li key={user.id}>{user.displayName}</li>
            ))}
        </ul>
    </div>
  )
}

export default UserList