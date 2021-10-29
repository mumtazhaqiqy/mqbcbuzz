class Teams {
  constructor(socket, teamsDOM) {
    this.io = socket;
    this.teamsDOM = teamsDOM;
    this.teamsList = teamsDOM.querySelector('#team_list');
  }

  init() {
    this.io.on(IoEvent.PLAYER.CHANGE, (teams) => {
      console.log('TEAM::teams');
      console.log(teams);
      this.render(teams);
    });
  }

  forgeList(teams) {
    return teams.map(team => this.createNode(team)).join('');
  }

  emptyList() {
    this.teamsList.innerHTML = '';
  }

  createNode(team) {
    return `
      <div class="uk-heading-bullet uk-text-bold">${team.name}</div>
      <div class="uk-text-small uk-margin-left">
        ${team.members.map(member => `[${member.name}]`).join('')}
      </div>
    `
  }

  render(teams) {
    const list = this.forgeList(teams);
    this.emptyList();
    this.teamsList.insertAdjacentHTML('afterbegin', list);
  }
}
