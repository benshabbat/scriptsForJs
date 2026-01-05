# my-api

Express CRUD API generated automatically

## Installation

```bash
npm install
```

## Usage

### Development mode with auto-reload:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## API Endpoints

### Get all items
```
GET http://localhost:3000/api/items
```

### Get item by ID
```
GET http://localhost:3000/api/items/:id
```

### Create new item
```
POST http://localhost:3000/api/items
Content-Type: application/json

{
    "name": "New Item",
    "description": "Item description",
    "price": 150
}
```

### Update item
```
PUT http://localhost:3000/api/items/:id
Content-Type: application/json

{
    "name": "Updated Item",
    "description": "Updated description",
    "price": 200
}
```

### Delete item
```
DELETE http://localhost:3000/api/items/:id
```

## Project Structure

```
my-api/
├── src/
│   ├── controllers/
│   │   └── itemController.js
│   ├── models/
│   │   └── Item.js
│   ├── routes/
│   │   └── itemRoutes.js
│   ├── middlewares/
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Note

This project uses in-memory storage for demonstration purposes. 
For production, integrate a real database like MongoDB, PostgreSQL, or MySQL.
