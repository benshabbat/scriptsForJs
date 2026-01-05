// In-memory data storage for Book
// In production, use a real database like MongoDB, PostgreSQL, etc.

let books = [
    { 
        id: '1', 
        name: 'Book 1', 
        description: 'Description 1',
        createdAt: new Date().toISOString()
    },
    { 
        id: '2', 
        name: 'Book 2', 
        description: 'Description 2',
        createdAt: new Date().toISOString()
    }
];

class Book {
    static getAll() {
        return books;
    }

    static getById(id) {
        return books.find(item => item.id === id);
    }

    static create(data) {
        const newItem = {
            id: Date.now().toString(),
            name: data.name,
            description: data.description || '',
            createdAt: new Date().toISOString()
        };
        books.push(newItem);
        return newItem;
    }

    static update(id, data) {
        const index = books.findIndex(item => item.id === id);
        if (index === -1) return null;

        books[index] = {
            ...books[index],
            ...data,
            id: books[index].id,
            updatedAt: new Date().toISOString()
        };
        return books[index];
    }

    static delete(id) {
        const index = books.findIndex(item => item.id === id);
        if (index === -1) return false;

        books.splice(index, 1);
        return true;
    }
}

export default Book;
