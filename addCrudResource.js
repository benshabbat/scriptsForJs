#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get resource name from command line arguments
const resourceName = process.argv[2];

if (!resourceName) {
    console.error('❌ Error: Please provide a resource name');
    console.log('\nUsage: add-crud <ResourceName>');
    console.log('Example: add-crud User');
    process.exit(1);
}

// Validate resource name
function validateResourceName(name) {
    // Check length (prevent DoS and filesystem issues)
    if (name.length === 0 || name.length > 100) {
        console.error('❌ Error: Resource name must be between 1 and 100 characters.');
        process.exit(1);
    }
    
    const validPattern = /^[A-Z][a-zA-Z0-9]*$/;
    
    if (!validPattern.test(name)) {
        console.error('❌ Error: Resource name must start with uppercase letter and contain only letters and numbers.');
        console.error('Example: User, Product, BlogPost');
        process.exit(1);
    }
    
    // Prevent JavaScript reserved words
    const reserved = ['Object', 'Array', 'String', 'Number', 'Boolean', 'Function', 'Promise', 'Date', 'Error', 'JSON', 'Math', 'console', 'process', 'require', 'module', 'exports'];
    if (reserved.includes(name)) {
        console.error(`❌ Error: "${name}" is a reserved JavaScript name and cannot be used.`);
        process.exit(1);
    }
    
    return true;
}

validateResourceName(resourceName);

// Check if we're in an Express CRUD project
const currentDir = process.cwd();
const srcDir = path.join(currentDir, 'src');
const packageJsonPath = path.join(currentDir, 'package.json');

if (!fs.existsSync(srcDir) || !fs.existsSync(packageJsonPath)) {
    console.error('❌ Error: Not in an Express CRUD project directory');
    console.error('Please run this command from the root of your Express CRUD project');
    process.exit(1);
}

// Generate names
const resourceLower = resourceName.toLowerCase();
const resourcePlural = resourceLower + 's';
const routeFileName = `${resourceLower}Routes.js`;
const controllerFileName = `${resourceLower}Controller.js`;
const modelFileName = `${resourceName}.js`;

console.log(`\n🚀 Adding new CRUD resource: ${resourceName}\n`);

// Check if resource already exists
const modelPath = path.join(srcDir, 'models', modelFileName);
if (fs.existsSync(modelPath)) {
    console.error(`❌ Error: Resource "${resourceName}" already exists`);
    process.exit(1);
}

// Model template
const modelTemplate = `// In-memory data storage for ${resourceName}
// In production, use a real database like MongoDB, PostgreSQL, etc.

let ${resourcePlural} = [
    { 
        id: '1', 
        name: '${resourceName} 1', 
        description: 'Description 1',
        createdAt: new Date().toISOString()
    },
    { 
        id: '2', 
        name: '${resourceName} 2', 
        description: 'Description 2',
        createdAt: new Date().toISOString()
    }
];

class ${resourceName} {
    static getAll() {
        return ${resourcePlural};
    }

    static getById(id) {
        return ${resourcePlural}.find(item => item.id === id);
    }

    static create(data) {
        const newItem = {
            id: Date.now().toString(),
            name: data.name,
            description: data.description || '',
            createdAt: new Date().toISOString()
        };
        ${resourcePlural}.push(newItem);
        return newItem;
    }

    static update(id, data) {
        const index = ${resourcePlural}.findIndex(item => item.id === id);
        if (index === -1) return null;

        ${resourcePlural}[index] = {
            ...${resourcePlural}[index],
            ...data,
            id: ${resourcePlural}[index].id,
            updatedAt: new Date().toISOString()
        };
        return ${resourcePlural}[index];
    }

    static delete(id) {
        const index = ${resourcePlural}.findIndex(item => item.id === id);
        if (index === -1) return false;

        ${resourcePlural}.splice(index, 1);
        return true;
    }
}

export default ${resourceName};
`;

// Controller template
const controllerTemplate = `import ${resourceName} from '../models/${modelFileName}';

// GET all ${resourcePlural}
export const getAll${resourceName}s = (req, res) => {
    try {
        const items = ${resourceName}.getAll();
        res.json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// GET ${resourceLower} by id
export const get${resourceName}ById = (req, res) => {
    try {
        const item = ${resourceName}.getById(req.params.id);
        if (!item) {
            return res.status(404).json({
                success: false,
                error: '${resourceName} not found'
            });
        }
        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// POST create ${resourceLower}
export const create${resourceName} = (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Name is required'
            });
        }

        const newItem = ${resourceName}.create({ name, description });
        res.status(201).json({
            success: true,
            data: newItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// PUT update ${resourceLower}
export const update${resourceName} = (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedItem = ${resourceName}.update(req.params.id, { name, description });
        
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                error: '${resourceName} not found'
            });
        }

        res.json({
            success: true,
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// DELETE ${resourceLower}
export const delete${resourceName} = (req, res) => {
    try {
        const deleted = ${resourceName}.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: '${resourceName} not found'
            });
        }

        res.json({
            success: true,
            message: '${resourceName} deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
`;

// Routes template
const routesTemplate = `import express from 'express';
import * as ${resourceLower}Controller from '../controllers/${controllerFileName}';

const router = express.Router();

// GET all ${resourcePlural}
router.get('/', ${resourceLower}Controller.getAll${resourceName}s);

// GET ${resourceLower} by id
router.get('/:id', ${resourceLower}Controller.get${resourceName}ById);

// POST create new ${resourceLower}
router.post('/', ${resourceLower}Controller.create${resourceName});

// PUT update ${resourceLower}
router.put('/:id', ${resourceLower}Controller.update${resourceName});

// DELETE ${resourceLower}
router.delete('/:id', ${resourceLower}Controller.delete${resourceName});

export default router;
`;

// Write files
const files = [
    { 
        path: path.join(srcDir, 'models', modelFileName), 
        content: modelTemplate,
        type: 'Model'
    },
    { 
        path: path.join(srcDir, 'controllers', controllerFileName), 
        content: controllerTemplate,
        type: 'Controller'
    },
    { 
        path: path.join(srcDir, 'routes', routeFileName), 
        content: routesTemplate,
        type: 'Routes'
    }
];

files.forEach(file => {
    try {
        fs.writeFileSync(file.path, file.content);
        console.log(`✅ Created ${file.type}: ${path.basename(file.path)}`);
    } catch (error) {
        console.error(`❌ Error creating ${file.type}: ${error.message}`);
        process.exit(1);
    }
});

// Update server.js
const serverPath = path.join(srcDir, 'server.js');
try {
    let serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Check if route already imported
    const importStatement = `import ${resourceLower}Routes from './routes/${routeFileName}';`;
    if (!serverContent.includes(importStatement)) {
        // Find the last import statement
        const importRegex = /import .+ from .+;/g;
        const imports = serverContent.match(importRegex);
        if (imports && imports.length > 0) {
            const lastImport = imports[imports.length - 1];
            serverContent = serverContent.replace(lastImport, `${lastImport}\n${importStatement}`);
        }
    }
    
    // Check if route already registered
    const routeStatement = `app.use('/api/${resourcePlural}', ${resourceLower}Routes);`;
    if (!serverContent.includes(routeStatement)) {
        // Find where to add the route (after other app.use routes)
        const routeRegex = /app\.use\('\/api\/\w+',\s+\w+Routes\);/g;
        const routes = serverContent.match(routeRegex);
        if (routes && routes.length > 0) {
            const lastRoute = routes[routes.length - 1];
            serverContent = serverContent.replace(lastRoute, `${lastRoute}\n${routeStatement}`);
        } else {
            // If no routes exist, add after items route
            const itemsRoute = "app.use('/api/items', itemRoutes);";
            if (serverContent.includes(itemsRoute)) {
                serverContent = serverContent.replace(itemsRoute, `${itemsRoute}\n${routeStatement}`);
            }
        }
    }
    
    fs.writeFileSync(serverPath, serverContent);
    console.log(`✅ Updated server.js with ${resourceName} routes`);
} catch (error) {
    console.log(`⚠️  Note: Could not automatically update server.js: ${error.message}`);
    console.log('Please add the routes manually.');
}

console.log(`\n✨ CRUD resource "${resourceName}" created successfully!\n`);
console.log('📝 Your new endpoints are ready:');
console.log(`   GET    /api/${resourcePlural}      - Get all ${resourcePlural}`);
console.log(`   GET    /api/${resourcePlural}/:id  - Get ${resourceLower} by id`);
console.log(`   POST   /api/${resourcePlural}      - Create ${resourceLower}`);
console.log(`   PUT    /api/${resourcePlural}/:id  - Update ${resourceLower}`);
console.log(`   DELETE /api/${resourcePlural}/:id  - Delete ${resourceLower}`);
console.log('');
