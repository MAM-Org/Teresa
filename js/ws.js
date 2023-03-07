// WEBSOCKET
// Utils for websocket

let cnt_socket;

function wsco() {
    cnt_socket = new WebSocket("ws://"+GYRO_MCU+":8080");
    var attitude=$.flightIndicator('#attitude','attitude', { size:200,showBox:true });
    var heading=$.flightIndicator('#heading','heading', { size:200,showBox:true });
    cnt_socket.onopen = function(e) {
        // WAKE UP THE RP2040 TO GET DATA FROM ITS WS AND HANDLE IT
        sendMessage("init");
        cnt_socket.onmessage = function(event) {
                var rcv_data = JSON.parse(event.data);
                if(rcv_data.quat_z!=undefined) {
                        var targetQuaternion = new THREE.Quaternion(rcv_data.quat_z,rcv_data.quat_y,rcv_data.quat_w,rcv_data.quat_x);
                        var rotation = new THREE.Euler().setFromQuaternion(targetQuaternion,"XYZ");
                        // Move the 3D object
                        group.quaternion.slerp(targetQuaternion,1);
                        // Adapt pitch/roll/yow to current sensor positioning
                        pitch=-rcv_data.pitch;
                        attitude.setRoll(rotation.x*(180/Math.PI)-90-pitch);
                        heading.setHeading(rotation.z*(180/Math.PI));
                        attitude.setPitch(pitch);
                }
        };
        console.log("[open] Connection established");
    };
    cnt_socket.onerror = function(error) { console.log(`[error]`); };
    cnt_socket.onclose = function(event) {
          if (event.wasClean) {
                  console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                  setTimeout(() => { wsco(); }, 5000);
          }
          else {
                  console.log('[close] Connection died, retrying');
                  setTimeout(() => { wsco(); }, 2000);
          }
    };
}

function sendMessage(msg){
    waitForSocketConnection(cnt_socket, function(){
        console.log("Init message sent!!!");
        cnt_socket.send(msg);
    });
}

function waitForSocketConnection(cnt_socket,callback){
    setTimeout(
        function() {
            if (cnt_socket.readyState === 1) {
                console.log("Connection is made")
                if (callback != null){ callback(); }
            } else {
                console.log("Wait for connection...")
                waitForSocketConnection(cnt_socket,callback);
            }
        }, 5);
}

