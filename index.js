const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const PORT = 3000;
const app = express();

const IMAGES = [];
const imageDir = path.join(__dirname, 'images');

app.use('/images', express.static(imageDir));

app.get('/', (req, res) => {
  res.send(ejs.render(`
  Image list...
  <br>
  <ol>
  <% IMAGES.forEach(function(image, index){ %>
    <br>
    <li>
    <%-image%>
    <br>
    <a href="images/<%-image%>">
    <img src="images/<%-image%>" alt="HTML tutorial" style="width:180px;height:240px;"></a>
    </li>
  <% }); %>
</ol>
  `, {IMAGES}));
});

app.post('/api/upload', (req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const {image} = files;
    const {name, nric, plan} = fields;
    const fileName = `${name}_${nric}_plan_${plan}_${image.name}`.replace(/\s/g, ''); // remove spaces
    fs.renameSync(image.path, `${imageDir}/${fileName}`);
    IMAGES.unshift(fileName);
    res.json({ fields, files });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} ...`);
});