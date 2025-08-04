const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const { TURNSTILE_SECRET } = process.env;

const app = express();
const PORT = 3005;

// Middleware for cors and parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post('/', async (req, res) => {
  const token = req.body['cf-turnstile-response'];
  const { name, contactMethod, email, discordUsername, subject, message } = req.body;

  if (!token) {
    return res.status(400).send('Missing Turnstile response.');
  }

  try {
    // Validate Turnstile token with Cloudflare
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(verifyUrl, {
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const outcome = await result.json();
    if (outcome.success) {
      if (!name || !contactMethod || (contactMethod === 'email' && !email) || (contactMethod === 'discord' && !discordUsername) || !subject || !message) {
        return res.status(400).send({ success: false, message: 'All fields are required.' });
      }
      if (contactMethod === 'email' && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
        return res.status(400).send({ success: false, message: 'Invalid email format.' });
      } else if (contactMethod === 'discord' && !/^(?!.*\.\.)([a-z0-9_.]{2,32})$/.test(discordUsername)) {
        return res.status(400).send({ success: false, message: 'Discord username must be 2-32 lowercase letters, numbers, underscores, or periods. No consecutive periods.' });
      }
      if (subject.length > 100) {
        return res.status(400).send({ success: false, message: 'Subject must be less than 100 characters.' });
      }
      if (message.length > 1024) {
        return res.status(400).send({ success: false, message: 'Message must be less than 1024 characters.' });
      }
      // send a message to a discord webhook
      // THIS TIME WE ARE GOING TO HIDE IT IN A .env FILE SO THAT BOTS CANNOT SPAM AND ABUSE IT
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      // style it nicely with an embed
      const embed = {
        title: 'New Contact Form Submission',
        fields: [
          { name: 'Name', value: name || 'N/A', inline: true },
          { name: 'Contact Method', value: contactMethod, inline: true },
          { name: 'Email', value: email || 'N/A', inline: true },
          { name: 'Discord Username', value: discordUsername || 'N/A', inline: true },
          { name: 'Subject', value: subject, inline: false },
          { name: 'Message', value: message, inline: false }
        ],
        color: 5814783, // A nice blue color
        timestamp: new Date().toISOString()
      };
      await axios.post(webhookUrl, { embeds: [embed] });
      res.send({ success: true, message: 'Contact form submitted successfully.' });
    } else {
      res.status(403).send({ success: false, message: 'Turnstile validation failed.' });
    }
  } catch (err) {
    console.error('Error validating Turnstile:', err);
    res.status(500).send({ success: false, message: 'Error validating Turnstile. Try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

