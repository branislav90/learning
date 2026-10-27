from patchlib import apply
apply('17',[
("      this.armPongWatch(); // any traffic proves liveness\n","      this.clearPongWatch(); // any traffic proves liveness: cancel the outstanding ping deadline\n"),
("  private cleanupTimers() {\n    window.clearInterval(this.heartbeatTimer);","  private clearPongWatch() {\n    window.clearTimeout(this.pongTimer);\n  }\n  private cleanupTimers() {\n    window.clearInterval(this.heartbeatTimer);"),
("- **Heartbeat:** `armPongWatch` is armed on every ping and every message; if neither pong nor traffic arrives within the timeout, `ws.close()` is called,",
 "- **Heartbeat:** `armPongWatch` is armed only when a ping is sent, and *any* incoming message (a pong or ordinary traffic) cancels it with `clearPongWatch`; if neither pong nor traffic arrives within the timeout, `ws.close()` is called. (Correction found by running this class against a fake socket with fake timers: an earlier draft re-armed the watch on every message, including the pong, which closed a perfectly healthy connection 10 s after each pong. With the version shown, a server that answers pings stayed open for 100 s, and a silent server was closed and the client moved to `reconnecting`.) `ws.close()`"),
])
