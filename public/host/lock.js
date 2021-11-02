class Lock {
    constructor(socket, lockDOM) {
        this.io = socket;
        this.lockDOM = lockDOM;
        this.unlockDOM = document.querySelector('#unlock_buzz');
        this.togleLock = false;
    }

    init() {
        this.lockDOM.addEventListener("click", (e) => this.click(e));
        this.io.on(IoEvent.BUZZ.LOCKED, () => this.onBuzzLocked());
    }

    click(e) {
        this.io.emit(IoEvent.BUZZ.LOCK);
    }

    onBuzzLocked() {
        this.lockDOM.hidden = true;
        this.unlockDOM.hidden = false;
        console.log('buzz locked');
    }

}

