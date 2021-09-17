const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data so that Vp and vp don't exist only small chars
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user in the same room
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }

    users.push(user)   //pushing in the array
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]  //for removing by their index we get an object
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

addUser({
    id: 18,
    username: 'Vp  ',
    room: 'Sector 11'
})

addUser({
    id : 21,
    username : 'Divyam ',
    room : 'Sector 11'
})

addUser({
    id : 31,
    username : 'Pranav',
    room : 'Sector 8'
})

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}