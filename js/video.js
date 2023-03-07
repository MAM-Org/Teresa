
    function startWebRTC() {
        var config = { sdpSemantics: 'unified-plan' };
        pc = new RTCPeerConnection(config);
        pc.addTransceiver('video', {direction: 'recvonly'});
        pc.addEventListener('track', function(evt) {
            if (evt.track.kind == 'video') {
                if (document.getElementById('stream')) { document.getElementById('stream').srcObject = evt.streams[0]; }
            }
        });
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        fetch("http://"+window.location.hostname+":8080/webrtc", {
          body: JSON.stringify({ type: 'request', res: params.res }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST'
        }).then(function(response) {
          return response.json();
        }).then(function(answer) {
          pc.remote_pc_id = answer.id;
          return pc.setRemoteDescription(answer);
        }).then(function() {
          return pc.createAnswer();
        }).then(function(answer) {
          return pc.setLocalDescription(answer);
        }).then(function() {
            // wait for ICE gathering to complete
            return new Promise(function(resolve) {
                if (pc.iceGatheringState === 'complete') {
                    resolve();
                } else {
                    function checkState() {
                        if (pc.iceGatheringState === 'complete') {
                            pc.removeEventListener('icegatheringstatechange', checkState);
                            resolve();
                        }
                    }
                    pc.addEventListener('icegatheringstatechange', checkState);
                }
            });
        }).then(function(answer) {
          var offer = pc.localDescription;
          return fetch("http://"+window.location.hostname+":8080/webrtc", {
            body: JSON.stringify({ type: offer.type, id: pc.remote_pc_id, sdp: offer.sdp }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
          })
        }).then(function(response) {
            return response.json();
        }).catch(function(e) {
	    pc.close();
        });
    }

	function check_webrtc() {
		if(pc.iceConnectionState=="disconnected" || pc.iceConnectionState=="new") {
				pc.close();
				setTimeout(function() {
						console.log("reconnecting");
						startWebRTC();
					 }, 1000);
		}
	}

