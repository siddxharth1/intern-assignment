### **Invoice Generator Application Documentation**

This documentation provides a comprehensive overview of both the backend and frontend setup for an Invoice Generator application. The project involves building a full-stack web application with a product addition feature, invoice generation, PDF export, and backend integration for storing invoice data.

---

## **Backend (Node.js, Express, MongoDB)**

### **Overview**

The backend is built using Node.js with Express and MongoDB for database management. It provides APIs to handle product data, generate invoices, and export them in PDF format. The backend communicates with the frontend through REST APIs.

### **Project Structure**
```
backend/
├── controllers/
│   └── invoiceController.js
├── models/
│   └── Product.js
├── routes/
│   └── invoiceRoutes.js
├── app.js
└── server.js
```

### **Technologies Used**
- **Node.js**: JavaScript runtime for backend.
- **Express.js**: Web framework for handling routes and middleware.
- **MongoDB**: NoSQL database for storing product and invoice data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **Cors**: Middleware to allow cross-origin requests.
- **Puppeteer**: Library for generating PDFs.

### **Installation Instructions**
1. Clone the backend repository:
   ```bash
   git clone https://github.com/your-repo/backend.git
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```bash
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/invoices
   ```

4. Run the application:
   ```bash
   npm start
   ```

### **API Endpoints**

#### **1. Add Product**
- **Endpoint**: `POST /api/invoices/add-product`
- **Description**: Adds a product to the invoice.
- **Request Body**:
  ```json
  {
    "name": "Product A",
    "quantity": 2,
    "price": 50
  }
  ```
- **Response**: The newly added product.

#### **2. Generate Invoice**
- **Endpoint**: `POST /api/invoices/generate`
- **Description**: Generates a PDF invoice for the list of added products.
- **Response**: PDF of the invoice.

#### **3. Get All Products**
- **Endpoint**: `GET /api/invoices/products`
- **Description**: Fetches all products for the current invoice.

---

## **Frontend (React, TypeScript, Tailwind CSS)**

### **Overview**

The frontend is built using React with TypeScript, and styled using Tailwind CSS. Redux is used for state management, while form validation ensures that all product inputs are valid before generating an invoice. A button on the Add Product page triggers invoice generation and PDF download using Puppeteer on the backend.

### **Project Structure**
```
frontend/
├── src/
│   ├── components/
│   │   └── AddProductPage.tsx
│   │   └── InvoicePage.tsx
│   ├── redux/
│   │   └── productSlice.ts
│   │   └── store.ts
│   ├── App.tsx
│   └── index.tsx
├── public/
└── package.json
```

### **Technologies Used**
- **React.js**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Redux**: State management tool.
- **Axios**: Library for making HTTP requests to the backend.

### **Installation Instructions**
1. Clone the frontend repository:
   ```bash
   git clone https://github.com/your-repo/frontend.git
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

### **Pages**

#### **1. Add Product Page**
- **Path**: `/add-product`
- **Description**: This page allows users to input product details such as name, quantity, and price. It includes form validation and state management using Redux.

#### **2. Invoice Page**
- **Path**: `/invoice`
- **Description**: This page displays the products added to the invoice and provides a button to generate the invoice in PDF format. It fetches product data from the backend and communicates with the backend to download the generated PDF.

### **Components**

#### **`AddProductPage.tsx`**
- This component handles the input form for adding products to the invoice.
- Uses Redux to store product data in the global state.

#### **`InvoicePage.tsx`**
- Displays the products and the total price.
- Calls the backend API to generate and download the invoice in PDF format.

### **Redux State Management**

#### **`productSlice.ts`**
- This Redux slice manages the state of the products being added.
- Actions:
  - `addProduct`: Adds a new product to the state.
  - `resetProducts`: Resets the product list.

#### **`store.ts`**
- Configures the Redux store, combining the `productSlice` reducer.

---

### **How It Works**

1. **Add Product Flow**:
   - The user navigates to the Add Product page, where they can enter product details.
   - Upon submission, the product is added to the Redux store.
   - The user can add multiple products.

2. **Invoice Generation**:
   - The user navigates to the Invoice Page, which displays all products.
   - Clicking on the "Generate Invoice" button calls the backend API to generate the invoice in PDF format, which is then downloaded.

---

### **Sample `.env` File for Backend**

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/invoices
```

---

### **Sample API Request for Product Addition**

**Request**:
```bash
POST /api/invoices/add-product
{
  "name": "Product A",
  "quantity": 2,
  "price": 50
}
```

**Response**:
```json
{
  "name": "Product A",
  "quantity": 2,
  "price": 50,
  "_id": "64f8fbb0efb59a0012345678"
}
```

---

### **Final Notes**

- Ensure MongoDB is running locally or use a cloud MongoDB service like Atlas for the backend database.
- The frontend and backend should be run on different ports (e.g., 5173 for frontend and 3000 for backend). Make sure to configure CORS properly to handle cross-origin requests.
- The PDF generation feature is implemented using Puppeteer on the backend. It requires the backend to generate and send the PDF to the frontend.

---

This documentation should provide a complete understanding of how to set up and run both the backend and frontend for the Invoice Generator application. For any further questions, feel free to reach out!
