# Inventory and Data Management System

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Dotenv

## Installation

```bash
npm install
```

Start MongoDB locally.

Run the project:

```bash
npm run dev
```

Server:

```text
http://localhost:5000
```

## API Endpoints

### Create Product

POST /api/products

### Get All Products

GET /api/products

### Get Product By Id

GET /api/products/:id

### Update Product

PUT /api/products/:id

### Delete Product

DELETE /api/products/:id

### Update Stock

PATCH /api/products/:id/stock

### Low Stock Report

GET /api/products/low-stock

### Category Summary

GET /api/products/summary