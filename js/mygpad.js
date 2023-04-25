// WEBSOCKET
count=0;
let ctrl_socket;
var start=Date.now();
var isjoy=0;
var x=0;
var y=0;
var speed;

function throttle_send(x,y,limit,limitX,limitY){
	// IF Y<limitY... the motor won't run, so we send zero instead
	if(Math.abs(y)<limitY) y=0;
	// Realtime when we approach the small values... not otherwise
	if(Math.abs(x)<limitX || Math.abs(y)<limitY) ctrl_socket.send(JSON.stringify({"cmd":"pos","X":x,"Y":y}));
	else {
		diff=Date.now()-start;
		if (diff>limit) {
			ctrl_socket.send(JSON.stringify({"cmd":"pos","X":x,"Y":y}));
			start=Date.now();
		} 
	}
}

function padwsco() {
	ctrl_socket = new WebSocket("ws://"+SERVO_MCU);
	ctrl_socket.onopen = function(e) {
	    ctrl_socket.onmessage = function(event) {
		data=JSON.parse(event.data);
		if(data.data=="pos") {
			if (typeof data.X != "undefined") $('#Xws').text(data.X);
			if (typeof data.Y != "undefined") $('#Yws').text(data.Y);
		}
	    };
	    console.log("[open] Connection established");
	};
	ctrl_socket.onerror = function(error) { console.log(`[error]`); };
	ctrl_socket.onclose = function(event) {
		if (event.wasClean) { console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`); }
		else { console.log('[close] Connection died'); }
	};
}

function wsend(x,y) {

        if(y<0) power=Math.round(y/5.2);
        else power=Math.ceil(y/1.38);
        speed.setAirSpeed(power);

	mesh2.rotation.z = (Math.PI/2) + (x/4*(Math.PI/180));
	mesh3.rotation.z = (Math.PI/2) + (x/4*(Math.PI/180));

	if(ctrl_socket==undefined) padwsco();
	if(ctrl_socket.readyState===1) { throttle_send(x,y,75,5,30); }
	else {
		// TIMEOUT LET'S TRY TO RECONNECT
		count++;
		if(count==200) {
			count=0;
			ctrl_socket.close();
			padwsco();
		}
	}
}

function joy(e) {
  if(isjoy==0) {
	isjoy++;
	$("#tjoy").show();
	window.removeEventListener(e.type,joy);
	window.removeEventListener('gamepadconnected',pad);
        const rightJoystick = new JoystickController({
                x: "50px",
                y: "50px",
                leftToRight:true,
		bottomToUp:false,
                opacity: 1,
                maxRange: 64,
                level: 180,
		containerClass: "joy",
                joystickClass: "joystick",
		dstDiv: "joy",
                distortion: true,
              },
              (data) => {
                  wsend(data.leveledX,data.leveledY);
                  $('#X').text(data.leveledX);
                  $('#Y').text(data.leveledY);
        });
	$("#tjoy").hide();
  }
}

function pad() {
	 $("#container").show();
         window.removeEventListener('mouseover',joy);
         window.removeEventListener('touchstart',joy);
}

