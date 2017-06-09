import express from 'express';
import http from 'http';
import path from 'path';


const app = express();
const server = http.Server(app);


app.use('/app.js', express.static(
  path.resolve(__dirname, '../', 'client/app.js')
));

app.get(['/', '/*'], (req, res) => {
  console.log(req.url)
  res.sendFile(path.resolve(__dirname, '../', 'client/index.html'));
});

export default server;
