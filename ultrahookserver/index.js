const express = require('express');
const app = express();

app.use(express.json());

app.post('/',function(req, res) {
	let obj=req.body;
  if ((obj.repository)&&(obj.repository.name)) {
  	record_webhook(obj.repository.name,obj);
  }
});

function record_webhook(repo_name,obj) {
	write_json_file(__dirname+'/received/'+repo_name+'.json',obj);
}

function write_json_file(fname,obj) {
	require('fs').writeFileSync(fname,JSON.stringify(obj,null,4));
}

let port=process.env.PORT||20101
app.listen(port, () => console.log(`Ultrahook server listening on port ${port}`))
