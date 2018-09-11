const express = require('express');
const app = express();

app.use(express.json());

app.post('/',function(req, res) {
	let obj=req.body;
  console.log(JSON.stringify(obj,null,4));
});

let port=process.env.PORT||20101
app.listen(port, () => console.log(`Ultrahook server listening on port ${port}`))
