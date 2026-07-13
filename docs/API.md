# Nyiur Nanggroe — API Documentation

This document logs all key REST API endpoints built into the platform router.

## 1. Authentication Endpoints

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@email.com",
    "password": "Password123"
  }
  ```
- **Response**: `200 OK` (sets secure session cookies).

### Register
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "full_name": "John Doe",
    "email": "john@email.com",
    "password": "Password123",
    "phone": "081234567890",
    "province": "Aceh",
    "city": "Banda Aceh"
  }
  ```

### Logout
- **URL**: `/api/auth/logout`
- **Method**: `POST` / `GET`
- **Response**: Clears session and redirects to `/masuk` (GET).

---

## 2. Product Endpoints

### List Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Query Params**:
  - `q`: search query string
  - `category`: category slug
  - `limit`: limit response size

---

## 3. Cart & Order Endpoints

### Manage Cart
- **URL**: `/api/cart`
- **Method**: `GET` / `POST` / `PATCH` / `DELETE`

### Create Checkout
- **URL**: `/api/orders`
- **Method**: `POST`
