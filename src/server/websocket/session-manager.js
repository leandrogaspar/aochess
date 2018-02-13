class SessionManager {
    constructor() {
        this.sessions = {};
    }

    addSession(sessionId, webSocket) {
        this.sessions[sessionId] = webSocket;
        console.log(`SessionManager: adding Session[${sessionId}]`);
    }

    removeSession(sessionId) {
        delete this.sessions[sessionId];
        console.log(`SessionManager: removing Session[${sessionId}]`);
    }

    getSession(sessionId) {
        return this.sessions[sessionId];
    }
}

module.exports = SessionManager;
