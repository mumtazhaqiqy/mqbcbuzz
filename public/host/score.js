class Score {
  constructor(socket, scoreDOM) {
    this.io = socket;
    this.scoreDOM = scoreDOM;
    this.scoreList = scoreDOM.querySelector('#score_list');
    this.scoreBody = this.scoreList.querySelector('tbody');
  }

  init() {
    this.io.on(IoEvent.SCORE.CHANGE, (teams) => this.render(teams));
    this.addEvent();
  }

  decrementPoint(team_name) {
    // console.log(team_name);
    this.io.emit(IoEvent.SCORE.DEC, team_name);
  }

  incrementPoint(team_name) {
    // console.log(team_name);
    this.io.emit(IoEvent.SCORE.INC, team_name);
  }

  decrement50Point(team_name) {
    // console.log(team_name);
    this.io.emit(IoEvent.SCORE.DEC50, team_name);
  }

  increment50Point(team_name) {
    // console.log(team_name);
    this.io.emit(IoEvent.SCORE.INC50, team_name);
  }


  addEvent() {
    const allDec50Action = Array.from(this.scoreBody.querySelectorAll('.dec_50point'));
    const allInc50Action = Array.from(this.scoreBody.querySelectorAll('.inc_50point'))

    const allDecAction = Array.from(this.scoreBody.querySelectorAll('.dec_point'));
    const allIncAction = Array.from(this.scoreBody.querySelectorAll('.inc_point'));

    allDec50Action.map(minus => {
      const tr = minus.closest('tr');
      const id = tr.id;
      // console.log({ id });
      minus.addEventListener('click', () => this.decrement50Point(id));
    });
    allInc50Action.map(plus => {
      const tr = plus.closest('tr');
      const id = tr.id;
      // console.log({ id });
      plus.addEventListener('click', () => this.increment50Point(id));
    });


    allDecAction.map(minus => {
      const tr = minus.closest('tr');
      const id = tr.id;
      // console.log({ id });
      minus.addEventListener('click', () => this.decrementPoint(id));
    });
    allIncAction.map(plus => {
      const tr = plus.closest('tr');
      const id = tr.id;
      // console.log({ id });
      plus.addEventListener('click', () => this.incrementPoint(id));
    });
  }

  forgeList(teams) {
    // console.log(teams)
    return teams
      // .sort((prev, curr) => curr.point - prev.point)
      .map(team => this.createNode(team)).join('');
  }

  emptyList() {
    this.scoreBody.innerHTML = '';
  }

  createNode(team) {
    return `
       <tr id="${team.name}">
        <td>${team.name}</td>
        <td style="text-align: right;cursor: pointer;">
          <span style="background: #ea4141;" class="uk-badge dec_50point">- 50</span>
          <span style="background: #ea4141;" class="uk-badge dec_point" >-100</span>
          <span style="background: #35bf4c;" class="uk-badge inc_50point">+ 50</span>
          <span style="background: #35bf4c;" class="uk-badge inc_point" >+100</span>
        </td>
      </tr>
    `
  }

  render(teams) {
    const scoreList = this.forgeList(teams);
    this.emptyList();
    this.scoreBody.insertAdjacentHTML('afterbegin', scoreList);
    this.addEvent();
  }
}
