socket.onmessage = (e) => { process(JSON.parse(e.data)); };
