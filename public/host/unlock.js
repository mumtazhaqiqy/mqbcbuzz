class Unlock {
    constructor(socket, lockDOM) {
        this.io = socket;
        this.unlockDOM = lockDOM;
        this.lockDOM = document.querySelector('#lock_buzz');
        this.togleLock = false;
    }

    init() {
        this.unlockDOM.addEventListener("click", (e) => this.click(e));
        this.io.on(IoEvent.BUZZ.UNLOCKED, () => this.onBuzzLocked());
    }

    click(e) {
        this.io.emit(IoEvent.BUZZ.UNLOCK);
    }

    onBuzzLocked() {
        this.unlockDOM.hidden = true;
        this.lockDOM.hidden = false;
        console.log('buzz unlocked');
    }

}

