# 🧩 HNG Stage 1 – String Analyzer API (Express.js)

This project is a RESTful API built with **Node.js** and **Express.js** that analyzes and stores string data, providing computed properties like length, palindrome status, character frequency, and more.

It also supports **query-based filtering**, **natural language search**, and **deletion** of stored strings.

---

## 🚀 Endpoints Overview

| Method | Endpoint | Description |
| ------- | -------- | ----------- |
| **POST** | `/strings` | Analyze and store a string |
| **GET** | `/strings/:string_value` | Retrieve a specific analyzed string |
| **GET** | `/strings` | Fetch all strings (supports filters) |
| **GET** | `/strings/filter-by-natural-language` | Query strings using natural language |
| **DELETE** | `/strings/:string_value` | Delete a string from the store |

---

## 🧠 Example Requests and Responses

### ✅ Create / Analyze String
**POST** `/strings`

**Request Body**
```json
{
  "value": "madam racecar level"
}
```

**Response (201 Created)**
```json
{
  "id": "fda3d233a...",
  "value": "madam racecar level",
  "properties": {
    "length": 19,
    "is_palindrome": false,
    "unique_characters": 9,
    "word_count": 3,
    "sha256_hash": "fda3d233a...",
    "character_frequency_map": {
      "m": 2,
      "a": 4,
      "d": 1
    }
  },
  "created_at": "2025-10-20T12:00:00Z"
}
```

---

### 🔍 Get All Strings with Filters
**GET** `/strings?is_palindrome=true&min_length=5&contains_character=a`

**Response**
```json
{
  "data": [ /* matching strings */ ],
  "count": 3,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "contains_character": "a"
  }
}
```

---

### 💬 Natural Language Query
**GET** `/strings/filter-by-natural-language?query=all%20multiple%20words`

**Response**
```json
{
  "data": [ /* filtered strings */ ],
  "count": 5,
  "interpreted_query": {
    "original": "all multiple words",
    "parsed_filters": {
      "min_word_count": 2
    }
  }
}
```

---

### ❌ Delete String
**DELETE** `/strings/:string_value`

**Response**
- **204 No Content** if deleted successfully  
- **404 Not Found** if string doesn’t exist  

---

## ⚙️ Setup Instructions

### 🧩 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/hng-string-analyzer.git
cd hng-string-analyzer
```

---

### 🧩 2️⃣ Install Dependencies
```bash
npm install
```

---

### 🧩 3️⃣ Create an Environment File
Create a `.env` file in your root folder:
```env
PORT=3000
```

---

### 🧩 4️⃣ Run the Project
```bash
node server.js
```

Visit the app in your browser or API tool:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧰 Dependencies

| Package | Purpose |
| -------- | -------- |
| **express** | Web framework for building APIs |
| **cors** | Handles cross-origin requests |
| **dotenv** | Loads environment variables |
| **crypto** | Used to generate SHA-256 hash |

To install all:
```bash
npm install express cors dotenv
```

---

## 🧪 Testing the API

You can test using:

### 🟩 Browser
Visit:  
`http://localhost:3000/test`

### 🟨 Postman
Send requests to any endpoint:
- `POST /strings`
- `GET /strings`
- `GET /strings/filter-by-natural-language`

### 🟦 cURL Example
```bash
curl -X POST http://localhost:3000/strings   -H "Content-Type: application/json"   -d '{"value": "racecar"}'
```

---

## 💻 Frontend Integration

You can use a simple HTML + JavaScript frontend to:
- Input strings and analyze them
- View stored results in real time
- Filter or delete entries
- Auto-refresh list (live reload)

All served on the same port (`3000`) by placing your `index.html` file inside a `public` folder and using:
```js
app.use(express.static('public'));
```

---

## 🧱 Project Structure
```
hng-string-analyzer/
│
├── controller.js       # Handles all logic and endpoints
├── routes.js           # Defines API routes
├── utils.js            # Contains helper (analysis) functions
├── server.js           # Entry point
├── public/             # Frontend files (index.html, script.js, etc.)
├── .env.example        # Example environment file
└── README.md           # Documentation
```

---

## ⚠️ Error Handling

| Status | Meaning | Example Cause |
| ------- | -------- | ------------- |
| **400** | Bad Request | Missing or invalid query/field |
| **409** | Conflict | String already exists |
| **404** | Not Found | String doesn’t exist |
| **422** | Unprocessable Entity | Conflicting or invalid filters |

---

## 🌐 Deployment

You can deploy using:
- [Railway.app](https://railway.app)
- [Heroku](https://heroku.com)
- [AWS EC2](https://aws.amazon.com/ec2/)
- [PXXL App](https://pxxl.app)

Make sure to set your environment variables before deployment.

---

## 👨🏽‍💻 Author

**Ikemdinachi Uzochukwu**  
- [GitHub](https://github.com/<your-username>)  
- [LinkedIn](https://linkedin.com/in/<your-link>)
