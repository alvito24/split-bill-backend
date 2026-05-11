# Split Bill Backend

Backend API untuk aplikasi Split Bill Cerdas - sistem pembagian tagihan makan bersama yang memudahkan perhitungan biaya per orang dengan otomatis menghitung pajak dan service charge.

## 📋 Deskripsi

Split Bill Backend adalah REST API yang menyediakan layanan untuk:
- Membuat room patungan dengan detail pajak dan service
- Menambahkan item pesanan ke dalam room
- Klaim item oleh anggota
- Menghitung otomatis total tagihan per anggota (termasuk pajak dan service)
- Real-time summary pembagian biaya

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **CORS**: cors v2.8.6
- **Environment Variables**: dotenv v17.4.2
- **Development**: nodemon v3.1.14

## 📁 Struktur Folder

```
splitbill-backend/
├── src/
│   ├── index.js              # Entry point aplikasi
│   ├── store.js              # In-memory data store
│   ├── routes/
│   │   └── rooms.js          # Room API endpoints
│   └── middleware/
│       ├── logger.js         # Request logging middleware
│       └── validator.js      # Input validation middleware
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies & scripts
└── README.md                # Dokumentasi
```

## 🚀 Cara Menjalankan Backend Secara Lokal

### Prerequisites

Pastikan Anda sudah menginstall:
- Node.js (versi 14 atau lebih baru)
- npm atau yarn

### Langkah-langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/alvito24/split-bill-backend.git
   cd split-bill-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Buat file `.env` di root folder dengan isi:
   ```env
   PORT=3001
   ALLOWED_ORIGIN=http://localhost:3000
   ```
   
   **Keterangan:**
   - `PORT`: Port untuk menjalankan backend (default: 3001)
   - `ALLOWED_ORIGIN`: URL frontend yang diizinkan untuk CORS (default: http://localhost:3000)

4. **Jalankan server**
   
   **Development mode** (dengan auto-reload):
   ```bash
   npm run dev
   ```
   
   **Production mode**:
   ```bash
   npm start
   ```

5. **Verifikasi server berjalan**
   
   Server akan berjalan di `http://localhost:3001`
   
   Anda bisa test dengan curl:
   ```bash
   curl http://localhost:3001/api/rooms
   ```

## 📡 API Endpoints

### 1. Create Room
**POST** `/api/rooms`

Request body:
```json
{
  "name": "Makan Siang Tim",
  "taxPercent": 11,
  "servicePercent": 5,
  "members": ["Andi", "Budi", "Cici"]
}
```

Response:
```json
{
  "roomId": "uuid-string",
  "room": {
    "id": "uuid-string",
    "name": "Makan Siang Tim",
    "taxPercent": 11,
    "servicePercent": 5,
    "members": ["Andi", "Budi", "Cici"],
    "items": [],
    "summary": {}
  }
}
```

### 2. Get Room by ID
**GET** `/api/rooms/:roomId`

Response:
```json
{
  "id": "uuid-string",
  "name": "Makan Siang Tim",
  "taxPercent": 11,
  "servicePercent": 5,
  "members": ["Andi", "Budi", "Cici"],
  "items": [...],
  "summary": {
    "Andi": {
      "subtotal": 50000,
      "tax": 5500,
      "service": 2500,
      "total": 58000
    }
  }
}
```

### 3. Add Item to Room
**POST** `/api/rooms/:roomId/items`

Request body:
```json
{
  "name": "Nasi Goreng",
  "price": 25000
}
```

### 4. Claim Item
**POST** `/api/rooms/:roomId/items/:itemId/claim`

Request body:
```json
{
  "memberName": "Andi"
}
```

## 🔧 Development

### Available Scripts

- `npm start` - Menjalankan server production
- `npm run dev` - Menjalankan server development dengan nodemon (auto-reload)

### Data Storage

Backend ini menggunakan **in-memory storage** untuk menyimpan data. Data akan hilang ketika server di-restart. Cocok untuk development dan testing.

## 📝 Notes

- Backend ini tidak menggunakan database, semua data disimpan di memory
- CORS sudah dikonfigurasi untuk menerima request dari frontend
- Semua request dan response di-log melalui middleware logger
- Input validation dilakukan untuk semua endpoint

## 👤 Author

Alvito March Vieri Nanda Sulistyo - EISD - Software Development


