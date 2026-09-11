const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// دالة قراءة وتنفيذ schema.sql تلقائياً عند التشغيل
async function initDatabase() {
  try {
    const sqlPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await pool.query(sql);
      console.log('✅ تم إنشاء جداول قاعدة البيانات بنجاح!');
    } else {
      console.log('⚠️ لم يتم العثور على ملف schema.sql داخل مجلد server');
    }
  } catch (err) {
    console.error('❌ خطأ أثناء تنفيذ schema.sql:', err.message);
  }
}

// تشغيل تهيئة قاعدة البيانات
initDatabase();

// مسار رئيسي لاختبار السيرفر
app.get('/', (req, res) => {
  res.send('Tasbehaa Backend API is Online!');
});

// تشغيل السيرفر
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


