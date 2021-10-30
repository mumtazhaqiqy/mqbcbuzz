const socket = io();

var toggleBuzz = true

var teams = ['Malang','Surabaya','Jakarta']

socket.on(IoEvent.BUZZ.CLEARED, (user) => {
    toggleBuzz = true;
    console.log(toggleBuzz);
})

socket.on(IoEvent.PLAYER.BUZZED, (user) => {
    if(toggleBuzz){
        try{
            const getTeam = user[0].team
            console.log(getTeam)
            console.log(teams.indexOf(getTeam)); 
    
            toggleBuzz = false
            console.log(toggleBuzz)   
        } catch(err) {
            console.log('no user')
        }
    } else {
        console.log(toggleBuzz)
    }
})