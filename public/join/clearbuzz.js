class Clearbuzz {
    constructor(socket, ) {
      this.io = socket;
      this.buzzDOM = buzzDOM;
      this.buzzList = buzzDOM.querySelector('#buzz_list');
      // this.buzzes = [];
    }
  
    init() {
      this.io.on(IoEvent.BUZZ.CLEARED, this.render());
    }

    clearBuzzListDom(){
        this.buzzList.innerHTML = '';
    }
  
    render() {      
      this.clearBuzzListDom();
    }
  }
  