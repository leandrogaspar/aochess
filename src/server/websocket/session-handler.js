class SessionHandler {
    constructor() {
        this.sessions = {};
    }

    addSession(sessionId, webSocket) {
        this.sessions[sessionId] = webSocket;
        console.log("After addSession", this.sessions);
    }

    removeSession(sessionId) {
        delete this.sessions[sessionId];
        console.log("After removeSession", this.sessions);
    }

    getSession(sessionId) {
        return this.sessions[sessionId];
    }
}

module.exports = SessionHandler;
