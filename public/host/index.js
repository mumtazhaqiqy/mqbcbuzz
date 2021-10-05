const socket = io();
const buzz = new Buzz(socket, document.querySelector('#buzz'));
const team = new Teams(socket, document.querySelector('#teams'));
const score = new Score(socket, document.querySelector('#score'));

// buzzdom
const buzzDOM = document.querySelector('#buzz');
const addTeamForm = buzzDOM.querySelector('#new_team_form');

function onAddTeamSubmit(e) {
  e.preventDefault();
  //get all nodes
  const teamNameNode = addTeamForm.querySelector('[name=team_name]');
  //get all values
  const teamName = teamNameNode.value;
   //store team 
  const newTeam = new Team(teamName);
  socket.emit(IoEvent.PLAYER.NEWTEAM, newTeam.toObject());
  //clear input value
  teamNameNode.value = '';
}

class Team {
  constructor(teamName) {
    this.teamName = teamName;
  }
  toObject() {
    return {teamName: this.teamName}
  }
}



addTeamForm.addEventListener('submit', onAddTeamSubmit);

document.addEventListener('DOMContentLoaded', () => {
  buzz.init();
  team.init();
  score.init();
});


