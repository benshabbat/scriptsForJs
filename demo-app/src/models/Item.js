// In-memory data storage (for demo purposes)
// In production, use a real database like MongoDB, PostgreSQL, etc.

let items = [
    { id: '1', name: 'Item 1', description: 'Description 1', price: 100 },
    { id: '2', name: 'Item 2', description: 'Description 2', price: 200 },
    { id: '3', name: 'Item 3', description: 'Description 3', price: 300 }
];

class Item {
    static getAll() {
        return items;
    }

    static getById(id) {
        return items.find(item => item.id === id);
    }

    static create(data) {
        const newItem = {
            id: Date.now().toString(),
            name: data.name,
            description: data.description || '',
            price: data.price || 0,
            createdAt: new Date().toISOString()
        };
        items.push(newItem);
        return newItem;
    }

    static update(id, data) {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return null;

        items[index] = {
            ...items[index],
            ...data,
            id: items[index].id, // Preserve id
            updatedAt: new Date().toISOString()
        };
        return items[index];
    }

    static delete(id) {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;

        items.splice(index, 1);
        return true;
    }
}

export default Item;
