const dotenv = require('dotenv');
const express = require('express');
const { pool } = require('./db/pool');
const { ensureSessionsTable } = require('./data/sessionStore');

dotenv.config();

const app = express();
const port = 3000;
const frontendOrigin = 'http://localhost:5173';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', frontendOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json()); // Middleware to parse JSON bodies

// Import and use the runs router for all routes starting with /runs
const runsRouter = require('./routes/runs');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
app.use('/runs', runsRouter);  
app.use('/users', usersRouter);
app.use('/', authRouter);

// Basic route to test server functionality
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Test database connection
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      message: 'PostgreSQL connection works',
      dbTime: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Start the server
async function startServer() {
  await ensureSessionsTable();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
 
