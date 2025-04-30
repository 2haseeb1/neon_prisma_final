Here’s the updated and expanded `README.md`, now including the `customer` module in the folder structure:

---

```markdown
# 🛠️ Bike Service Management API

A backend REST API to manage service records for bikes in a workshop or dealership. It enables users to register bikes, create and update service records, track service status, and identify overdue maintenance tasks.

---

## 🌐 Live Backend URL

> 🟢 [Deployed Backend (Railway/Render)](https://your-live-backend-url.com)

_Replace this with your actual deployment link._

---

## 🧰 Tech Stack

- **Node.js** — Runtime
- **Express.js** — Web framework
- **TypeScript** — Type-safe backend code
- **Prisma ORM** — Elegant database schema and query builder
- **PostgreSQL** — SQL-based relational database
- **Date-fns** — Date utility functions
- **http-status** — Semantic HTTP status codes

---

## 📁 Folder Structure


project-root/
├── src/
│   ├── modules/
│   │   ├── bike/
│   │   │   ├── bike.controller.ts
│   │   │   ├── bike.routes.ts
│   │   │   ├── bike.service.ts
│   │   ├── service/
│   │   │   ├── service.controller.ts
│   │   │   ├── service.routes.ts
│   │   │   ├── service.service.ts
│   │   ├── customer/
│   │   │   ├── customer.controller.ts
│   │   │   ├── customer.routes.ts
│   │   │   ├── customer.service.ts
│   ├── utils/
│   │   └── statusMapping.ts
│   ├── types/
│   │   └── serviceTypes.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
├── package.json
└── README.md


---

## 🛠️ Setup Guide

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/bike-service-api.git
cd bike-service-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database>
NODE_ENV=development
PORT=5020
```

4. **Run Prisma migrations**

```bash
npx prisma migrate dev --name init
```

5. **Start the development server**

```bash
npm run dev
```

---

## 🚀 Key Features

- 🛵 Register and manage bikes
- 👤 Manage customer information
- 🛠️ Schedule and update service records
- 🧾 Fetch all or individual service records
- ✅ Automatically mark service status as `done`
- ⚠️ Detect overdue or pending services
- 🔄 Bidirectional status mapping (API ↔ DB)
- 🧪 Modular, maintainable codebase with clear separation of concerns

---

## 🔗 Sample API Endpoints

| Method | Endpoint                         | Description                                |
|--------|----------------------------------|--------------------------------------------|
| GET    | `/api/bikes`                     | Fetch all bikes                            |
| GET    | `/api/bikes/:id`                 | Get a single bike by ID                    |
| POST   | `/api/customers`                 | Create a new customer                      |
| GET    | `/api/customers/:id`             | Get customer details                       |
| POST   | `/api/services`                  | Create a new service record                |
| GET    | `/api/services`                  | Get all service records                    |
| GET    | `/api/services/:id`              | Get a specific service record              |
| PUT    | `/api/services/:id`              | Update a service (e.g., set completion)    |
| PUT    | `/api/services/:id/complete`     | Mark a service as completed                |
| GET    | `/api/services/status`           | Fetch overdue or pending service records   |

---

## 📬 API Usage with Curl

Create a new customer:

```bash
curl -X POST http://localhost:5020/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

Create a new service:

```bash
curl -X POST http://localhost:5020/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "bikeId": "abc123",
    "serviceDate": "2025-04-30",
    "description": "Chain adjustment",
    "status": "pending"
  }'
```

Mark a service as complete:

```bash
curl -X PUT http://localhost:5020/api/services/<serviceId>/complete \
  -H "Content-Type: application/json" \
  -d '{
    "completionDate": "2025-05-01T14:30:00.000Z"
  }'
```

Check overdue services:

```bash
curl http://localhost:5020/api/services/status
```

---

## 🤝 Contributing

Feel free to fork this repo and submit pull requests. Follow these steps:

```bash
git checkout -b feature/my-new-feature
git commit -m "Add my new feature"
git push origin feature/my-new-feature
```

---

## 👨‍💻 Author

**Name** — [GitHub](https://github.com/yourusername)  
**Email** — your.email@example.com

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
```

Would you like me to export this to a downloadable `README.md` file now?