const socket = io();
const buzz = new Buzz(socket, document.querySelector('#buzz'));
const team = new Teams(socket, document.querySelector('#teams'));
const score = new Score(socket, document.querySelector('#score'));
const scoreonly = new Scoreonly(socket, document.querySelector('#scoreonly'));
const reset = new Reset(socket, document.querySelector('#reset_buzz'));
const lock = new Lock(socket, document.querySelector('#lock_buzz'));
const unlock = new Unlock(socket, document.querySelector('#unlock_buzz'));
const content = document.querySelector('#buzz');

// buzzdom
const buzzDOM = document.querySelector('#buzz');
const addTeamForm = buzzDOM.querySelector('#new_team_form');

function passwordPrompt() {
  const password = prompt("Enter in the password");
    if (password=="secure-mqbcpass") {
      // console.log('Oke')
    }
    else 
    {
      window.location.replace('/');
    }
}

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
  passwordPrompt();
  buzz.init();
  team.init();
  score.init();
  scoreonly.init();
  reset.init();
  lock.init();
  unlock.init();
});


