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

function clearAllPodiumLight(teams) {
    teams.forEach((element, index) => {
        const podiumLightDOM = document.querySelector('#podium-'+index)
        const podiumBorderDOM = document.querySelectorAll('.border'+index)
        podiumLightDOM.classList.remove('active-podium')

        podiumBorderDOM.forEach(el => {
            el.classList.remove('glow'+index)
        })

    })
}

socket.on(IoEvent.SCORE.CHANGE, (teams) => doWhenScoreChange(teams))

socket.on(IoEvent.BUZZ.CLEARED, (user) => {
    toggleBuzz = true;
    clearAllPodiumLight(allteams)
})

socket.on(IoEvent.PLAYER.BUZZED, (user) => {
    if(toggleBuzz){
        try{
            // get buzzing team name from first array
            const buzzedTeam = user[0].team
            // get the index // mapping allteams
            const teamIndex = allteams.map((el) => el.name).indexOf(buzzedTeam);

            console.log(teamIndex)
            // clear all the podium light
            clearAllPodiumLight(allteams)

            // turn on the light bulb and glow 
            const podiumLightDOM = document.querySelector('#podium-'+teamIndex);
            const podiumBorderDOM = document.querySelectorAll('.border'+teamIndex);
            podiumLightDOM.classList.add('active-podium');

            podiumBorderDOM.forEach(el => {
                el.classList.add('glow'+teamIndex)
            })
    
            toggleBuzz = false

        } catch(err) {
            console.log('clear all buzzed')
        }
    } else {
        // console.log(toggleBuzz)
    }
})