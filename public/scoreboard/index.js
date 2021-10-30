const socket = io();

var toggleBuzz = true

var allteams = []

function doWhenScoreChange(teams) {
    allteams = teams;
    teams.forEach((element, index) => {
        const teamScoreDOM = document.querySelector('#score-'+index)
        teamScoreDOM.innerHTML = element.point
    });
}

socket.on(IoEvent.SCORE.CHANGE, (teams) => doWhenScoreChange(teams))

socket.on(IoEvent.BUZZ.CLEARED, (user) => {
    toggleBuzz = true;
    // console.log(toggleBuzz);
})

socket.on(IoEvent.PLAYER.BUZZED, (user) => {
    if(toggleBuzz){
        try{
            // get buzzing team name from first array
            const buzzedTeam = user[0].team
            // get the index // mapping allteams
            const teamIndex = allteams.map((el) => el.name).indexOf(buzzedTeam);

            console.log(teamIndex)
            // turn on the light bulb

            // console.log(allteams); 
    
            toggleBuzz = false
            // console.log(toggleBuzz)   
        } catch(err) {
            console.log('clear all buzzed')
        }
    } else {
        // console.log(toggleBuzz)
    }
})