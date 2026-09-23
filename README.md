# ប្រព័ន្ធភោជនីយដ្ឋាន (Restaurant System)

ប្រព័ន្ធគ្រប់គ្រងភោជនីយដ្ឋានពេញលេញ៖ user, category, menu, table, order, payment, និង
report ចំណូលប្រចាំថ្ងៃ (ថៅកែអាចមើលបាន)។

## រចនាសម្ព័ន្ធ

```
restaurant-system/
  backend/      <- Node.js + Express + MongoDB API
  frontend/     <- Dashboard (HTML/JS ធម្មតា, មិនចាំបាច់ build)
```

## តម្រូវការ

- Node.js (v18+)
- MongoDB កំពុង run (local ឬ MongoDB Atlas)

## ១. ដំឡើង Backend

```bash
cd backend
npm install
cp .env.example .env
```

បើក `.env` និងកែប្រែ៖
```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/restaurant_system
JWT_SECRET=ដាក់អក្សរសម្ងាត់វែងណាមួយត្រង់នេះ
```

ដំណើរការ server:
```bash
npm start
```
Server នឹង run នៅ `http://localhost:3000`

## ២. បង្កើត Admin/Owner account ដំបូង

ព្រោះ route បង្កើត user ត្រូវការ admin login ស្រាប់ (chicken-and-egg problem)
សូមប្រើ MongoDB Compass/shell បញ្ចូល user ដំបូងដោយផ្ទាល់ ឬប្រើ script ខាងក្រោម:

```bash
node seed-admin.js
```
(មើលឯកសារ `seed-admin.js` — Default: email `admin@gmail.com`, password `123456`, role `super`)

## ៣. បើក Frontend Dashboard

គ្រាន់តែបើកឯកសារ `frontend/index.html` ក្នុង browser ផ្ទាល់ (double-click)
ឬប្រើ extension "Live Server" ក្នុង VS Code។

ពេលបើក វានឹងសួររក **API URL** (default: `http://localhost:3000/api`) — ទុកតាម default
ប្រសិនបើ backend run លើ port 3000។

Login ដោយ admin account ដែលបង្កើតរួច។

## មុខងារសំខាន់ៗ

- 📊 **សរុបប្រចាំថ្ងៃ** — ថៅកែឃើញចំណូលសរុប, ចំនួនកម្មង់, និងចំនួនលក់តាមប្រភេទ
  (បាយ/គុយទាវ/កាហ្វេ) សម្រាប់ថ្ងៃនេះ (admin/super role ប៉ុណ្ណោះ)
- 🧾 **កម្មង់ថ្មី** — បុគ្គលិកជ្រើសតុ + ម្ហូប + ចំនួន រួចបញ្ជូនកម្មង់
- 📋 **កម្មង់ទាំងអស់** — មើល/ប្តូរស្ថានភាព (pending → confirmed → completed)
- 🍜 **ម៉ឺនុយ** — មើលម៉ឺនុយទាំងអស់ (admin បន្ថែម/លុបបាន)
- 🏷️ **ប្រភេទ** — គ្រប់គ្រងប្រភេទម្ហូប (admin only)

## Role permissions

| Role  | អាចធ្វើអ្វីខ្លះ |
|-------|-----------------|
| super/admin | គ្រប់យ៉ាង រួមទាំង report, user management |
| user  | បង្កើតកម្មង់, មើលម៉ឺនុយ, ប្តូរស្ថានភាពកម្មង់ |

## API Endpoints សង្ខេប

```
POST   /api/user/login
POST   /api/user               (admin) - បង្កើត staff account
GET    /api/user               (admin)

GET    /api/category
POST   /api/category           (admin)

GET    /api/menu
POST   /api/menu               (admin)

POST   /api/order               { table, items: [{menu, quantity}] }
GET    /api/order
PATCH  /api/order/:id/status    { status }

POST   /api/payment             { order, amount, method }

GET    /api/report/daily        (admin) - របាយការណ៍ថ្ងៃនេះ
```
