class Teams {
  constructor(socket, teamsDOM) {
    this.io = socket;
    this.teamsDOM = teamsDOM;
    this.teamsList = teamsDOM.querySelector('#team_list');
  }

  init() {
    this.io.on(IoEvent.PLAYER.CHANGE, (teams) => {
      // console.log('TEAM::teams');
      // console.log(teams);
      this.render(teams);
    });
    this.addEvent();
  }

  forgeList(teams) {
    return teams.map(team => this.createNode(team)).join('');
  }

  emptyList() {
    this.teamsList.innerHTML = '';
  }

  addEvent() {  
    const allUserinTeam = Array.from(this.teamsList.querySelectorAll('.kick-user'));
    console.log(allUserinTeam);
    allUserinTeam.map(user => {
      const div = user.closest('div');
      const team = div.title;
      const id = user.id;
      user.addEventListener('click', () => this.kickUser(id, team));
    })
  }

  kickUser(id, team) {
    console.log(id);
    console.log(team);

    class User {
      constructor(id, team){
        this.id = id;
        this.team = team;
      }
      toObject() {
        return { id: this.name, team: this.team}
      }
    }
    const user = new User(id, team)
    if(confirm('Do you really want to kick this user')){
      this.io.emit(IoEvent.PLAYER.KICK, user)
    }
  }

  createNode(team) {
    return `
      <div class="uk-heading-bullet uk-text-bold">${team.name}</div>
      <div title='${team.name}' class="uk-text-small uk-margin-left">
        ${team.members.map(member => `<span style="background: #35bf4c;" id="${member.id}" class="uk-badge kick-user">${member.name}</span>`).join('')}
      </div>
    `
  }

  render(teams) {
    const list = this.forgeList(teams);
    this.emptyList();
    this.teamsList.insertAdjacentHTML('afterbegin', list);
    this.addEvent();
  }
}
