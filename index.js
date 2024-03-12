require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;
const urlDatabase = {};
let currentShortUrl = 1;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
   


app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validate URL format
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Check if URL already exists
  const existingEntry = Object.values(urlDatabase).find(entry => entry.original_url === originalUrl);
  if (existingEntry) {
    res.json({ original_url: existingEntry.original_url, short_url: existingEntry.short_url });
  } else {
    // Generate a new short URL
    const shortUrl = currentShortUrl++;

    // Save the new URL entry
    urlDatabase[shortUrl] = { original_url: originalUrl, short_url: shortUrl };

    res.json({ original_url: originalUrl, short_url: shortUrl });
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  // Find the original URL
  const urlEntry = urlDatabase[shortUrl];
  if (urlEntry) {
    res.redirect(urlEntry.original_url);
  } else {
    res.json({ error: 'invalid short url' });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
