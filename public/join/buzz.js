class Buzz {
    constructor(socket, buzzDOM) {
      this.io = socket;
      this.buzzDOM = buzzDOM;
      this.buzzList = buzzDOM.querySelector('#buzz_list');
      // this.buzzes = [];
    }
  
    init() {
      this.io.on(IoEvent.PLAYER.BUZZED, (user) => this.render(user));
    }

    clearBuzzListDom(){
        this.buzzList.innerHTML = '';
    }

    render(buzzes) {
      const toRender = buzzes.map(cur_buzz => `<li><span>[${cur_buzz.team}] ${cur_buzz.name}</span> <span class="float-rt">${cur_buzz.now} ms</span></li>`).join('');
      this.clearBuzzListDom();
      return this.buzzList.insertAdjacentHTML('beforeend', toRender)
    }
  }
  