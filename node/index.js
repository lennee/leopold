const app = require('./server/app.js');

const PORT = process.env.PORT || 3000;

require('dotenv').config();

app.listen(PORT, () => {
  console.log('listening on port 3000');
});
