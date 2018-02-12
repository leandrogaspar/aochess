class SessionHandler {
    constructor() {
        this.sessions = {};
    }

    addSession(sessionId, webSocket) {
        this.sessions[sessionId] = webSocket;
        console.log(`SessionHandler: adding Session[${sessionId}]`);
    }

    removeSession(sessionId) {
        delete this.sessions[sessionId];
        console.log(`SessionHandler: removing Session[${sessionId}]`);
    }

    getSession(sessionId) {
        return this.sessions[sessionId];
    }
}

module.exports = SessionHandler;
