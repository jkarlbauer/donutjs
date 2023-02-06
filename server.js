const http = require('http');
const host = 'localhost';
const port = 8000;
const html =
`<!DOCTYPE html>
<html>
<body>
<canvas id="canvasdonut" width = window.innderWidth></canvas>
</body>
<script src = "donut.js"></script>
</html>`    

const requestListener = function(req, res){
	res.setHeader("Content-Type", "text/html");
	res.writeHead(200);
	res.end(html);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
	console.log("server running");
});



