const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Handle other routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
