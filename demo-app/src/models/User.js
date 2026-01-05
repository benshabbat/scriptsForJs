// In-memory data storage for User
// In production, use a real database like MongoDB, PostgreSQL, etc.

let users = [
    { 
        id: '1', 
        name: 'User 1', 
        description: 'Description 1',
        createdAt: new Date().toISOString()
    },
    { 
        id: '2', 
        name: 'User 2', 
        description: 'Description 2',
        createdAt: new Date().toISOString()
    }
];

class User {
    static getAll() {
        return users;
    }

    static getById(id) {
        return users.find(item => item.id === id);
    }

    static create(data) {
        const newItem = {
            id: Date.now().toString(),
            name: data.name,
            description: data.description || '',
            createdAt: new Date().toISOString()
        };
        users.push(newItem);
        return newItem;
    }

    static update(id, data) {
        const index = users.findIndex(item => item.id === id);
        if (index === -1) return null;

        users[index] = {
            ...users[index],
            ...data,
            id: users[index].id,
            updatedAt: new Date().toISOString()
        };
        return users[index];
    }

    static delete(id) {
        const index = users.findIndex(item => item.id === id);
        if (index === -1) return false;

        users.splice(index, 1);
        return true;
    }
}

export default User;
