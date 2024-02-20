const express = require('express');
const app = express();
const path = require('path');

app.use((_, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
