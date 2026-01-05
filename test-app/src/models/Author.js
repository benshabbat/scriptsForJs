// In-memory data storage for Author
// In production, use a real database like MongoDB, PostgreSQL, etc.

let authors = [
    { 
        id: '1', 
        name: 'Author 1', 
        description: 'Description 1',
        createdAt: new Date().toISOString()
    },
    { 
        id: '2', 
        name: 'Author 2', 
        description: 'Description 2',
        createdAt: new Date().toISOString()
    }
];

class Author {
    static getAll() {
        return authors;
    }

    static getById(id) {
        return authors.find(item => item.id === id);
    }

    static create(data) {
        const newItem = {
            id: Date.now().toString(),
            name: data.name,
            description: data.description || '',
            createdAt: new Date().toISOString()
        };
        authors.push(newItem);
        return newItem;
    }

    static update(id, data) {
        const index = authors.findIndex(item => item.id === id);
        if (index === -1) return null;

        authors[index] = {
            ...authors[index],
            ...data,
            id: authors[index].id,
            updatedAt: new Date().toISOString()
        };
        return authors[index];
    }

    static delete(id) {
        const index = authors.findIndex(item => item.id === id);
        if (index === -1) return false;

        authors.splice(index, 1);
        return true;
    }
}

export default Author;
