const http = require('http');
const host = 'localhost';
const port = 8000;
const html =`<!DOCTYPE html>
	<html>
	<body>
	<canvas id="canvasdonut" width = window.innerWidth></canvas>
	</body>
	<script>
	(function() {
		var _onload = function() {
		  var canvastag = document.getElementById('canvasdonut');
		  canvastag.width  = window.innerWidth;
		  canvastag.height = window.innerHeight;
		  var tmr1 = undefined, tmr2 = undefined;
		  var A=1, B=1;

		  var R1 = 1;
		  var R2 = 2;
		  var K1 = 450;
		  var K2 = 5;
		  var canvasframe=function() {
			var ctx = canvastag.getContext('2d');
			ctx.fillStyle='#ffff';
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
			if(tmr1 === undefined) { // only update A and B if the first animation isn't doing it already
			  A += 0.035;
			  B += 0.015;
			}
			// precompute cosines and sines of A, B, theta, phi
			var cA=Math.cos(A), sA=Math.sin(A),
				cB=Math.cos(B), sB=Math.sin(B);
			for(var j=0;j<6.28;j+=0.3) { // j <=> theta
			  var ct=Math.cos(j),st=Math.sin(j); // cosine theta, sine theta
			  for(i=0;i<6.28;i+=0.1) {   // i <=> phi
				var sp=Math.sin(i),cp=Math.cos(i); // cosine phi, sine phi
				var ox = R2 + R1*ct, // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
					oy = R1*st;
		
				var x = ox*(cB*cp + sA*sB*sp) - oy*cA*sB; // final 3D x coordinate
				var y = ox*(sB*cp - sA*cB*sp) + oy*cA*cB; // final 3D y
				var ooz = 1/(K2 + cA*ox*sp + sA*oy); // one over z
				var xp=(canvastag.width/2 + K1*ooz*x); // x' = screen space coordinate, translated and scaled to fit our canvas element
				var yp=(canvastag.height/2 - K1*ooz*y); // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
				// luminance, scaled back to 0 to 1
				var L=0.7*(cp*ct*sB - cA*ct*sp - sA*st + cB*(cA*st - ct*sA*sp));
				if(L > 0) {
				  //ctx.fillStyle = 'rgba(0,0,0,'+L+')';
				  //ctx.fillRect(xp, yp, 1.5, 1.5);
				  ctx.beginPath();
				  ctx.arc(xp, yp, 1.5, 0, 2 * Math.PI, false);
				  ctx.fillStyle = 'rgba(0,0,0,'+L+')';
				  ctx.fill();
				}
			  }
			}
		  }
		
		  window.anim2 = function() {
			if(tmr2 === undefined) {
			  tmr2 = setInterval(canvasframe, 50);
			} else {
			  clearInterval(tmr2);
			  tmr2 = undefined;
			}
		  };
	
		  anim2();
		
		  canvasframe();
		}
		
		if(document.all)
		  window.attachEvent('onload',_onload);
		else
		 window.addEventListener("load",_onload,false);
		})();
	</script>
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



