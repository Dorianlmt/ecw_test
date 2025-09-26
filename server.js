// server.js - Express app with an intentionally vulnerable login (CTF use only)
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`<h2>YNOV CTF — Prisma SQLi</h2>
    <form method="POST" action="/login">
      <input name="username" placeholder="username"/><br/>
      <input name="password" placeholder="password" type="password"/><br/>
      <button>Login</button>
    </form>
    <p>Users for tests: alice / alicepass, admin / adminpassword</p>`);
});

/*
 WARNING: This route is intentionally vulnerable for CTF purposes.
 It builds SQL by concatenation and uses prisma.$queryRawUnsafe.
 DO NOT use this pattern in production.
*/
app.post('/login', async (req, res) => {
  const { username = '', password = '' } = req.body || {};
  try {
    // Intentional vulnerability
    const sql = `SELECT * FROM "User" WHERE username = '${username}' AND password = '${password}' LIMIT 1;`;
    const users = await prisma.$queryRawUnsafe(sql);

    if (users && users.length > 0) {
      const user = users[0];
      if (user.isAdmin) {
        return res.send(`<h3>Bienvenue admin</h3><pre>${user.secret}</pre>`);
      } else {
        return res.send(`<h3>Bienvenue ${user.fullname}</h3><p>Pas d'accès admin.</p>`);
      }
    } else {
      return res.send('Invalid credentials.');
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send('Erreur lors de la requête.');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
