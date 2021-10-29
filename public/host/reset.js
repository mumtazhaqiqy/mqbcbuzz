class Reset {
  constructor(socket, resetDOM) {
    this.io = socket;
    this.resetDOM = resetDOM;
    this.teamListDOM = document.querySelector('#team_list');
    this.scoreListDOM = document.querySelector('#score_list');
    this.scoreonlyListDOM = document.querySelector('#scoreonly_list');
    this.buzzListDOM = document.querySelector('#buzz_list');

  }

  init() {
    this.resetDOM.addEventListener("click", (e) => this.click(e));
    this.io.on(IoEvent.BUZZ.RESETED, () => this.clearListDOM());
  }

  click(e) {
    this.io.emit(IoEvent.BUZZ.RESET);
  }

  clearListDOM() {
    this.teamListDOM.innerHTML = '';
    this.scoreListDOM.querySelector('#score_list_tbody').innerHTML = '';
    this.scoreonlyListDOM.querySelector('#scoreonly_list_tbody').innerHTML = '';
    this.buzzListDOM.innerHTML = '';
    console.log('data reseted');
  }

}