"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const team_1 = require("./team");
class Data {
    constructor() {
        this.buzzes = new Set();
        this.teams = [];
        this.milis = new Set();
    }
    addUser(user, team_name) {
        const teams = this.teams.filter(team => team.name === team_name);
        if (teams.length > 0) {
            return teams[0].addMember(user);
        }
        const team = new team_1.Team(team_name);
        team.addMember(user);
        this.teams = [...this.teams, team];
    }
    addTeam(team_name) {
        const teams = this.teams.filter(team => team.name === team_name);
        // add new team
        const team = new team_1.Team(team_name);
        // add team in teams
        this.teams = [...this.teams, team];
    }
    removeUser(user_id, team_name) {
        const user_team = this.teams.find(team => team.name === team_name);
        if (user_team) {
            user_team.removeMember(user_id);
        }
    }
    getUsers() {
        const teams_members = this.teams.map(team => team.members.map(member => (Object.assign(Object.assign({}, member), { team: team.name }))));
        return teams_members.reduce(function (prev, curr) {
            return prev.concat(curr);
        }, []);
    }
    incrementPoint(team_name) {
        const team = this.teams.find(team => team.name === team_name);
        if (team) {
            team.point += 100;
        }
    }
    decrementPoint(team_name) {
        const team = this.teams.find(team => team.name === team_name);
        if (team) {
            team.point -= 100;
        }
    }
    increment50Point(team_name) {
        const team = this.teams.find(team => team.name === team_name);
        if (team) {
            team.point += 50;
        }
    }
    decrement50Point(team_name) {
        const team = this.teams.find(team => team.name === team_name);
        if (team) {
            team.point -= 50;
        }
    }
    getUserById(user_id) {
        const users = this.getUsers();
        return users.find(user => user.id === user_id);
    }
    getBuzzes() {
        return [...this.buzzes].map((user_id, index) => {
            const user = this.getUserById(user_id);
            if (index == 0) {
                var now = '00';
            }
            else {
                const lastTimeStamp = Array.from(this.milis)[index - 1];
                const currTimeStamp = Array.from(this.milis)[index];
                var between = Math.abs((currTimeStamp - lastTimeStamp) / 1);
                var now = between.toString();
            }
            const timeStamp = Array.from(this.milis)[index];
            return user ? { id: user.id, name: user.name, team: user.team, now: now, time: timeStamp } : null;
        }).filter(Boolean);
    }
    getTeams() {
        return this.teams;
    }
    getData() {
        return {
            users: this.getUsers(),
            buzzes: this.getBuzzes(),
            teams: this.getTeams(),
        };
    }
    resetBuzzes() {
        this.buzzes = new Set();
        this.milis = new Set();
    }
    resetTeams() {
        this.teams = [];
    }
    resetAll() {
        this.resetBuzzes();
        this.resetTeams();
    }
    removeEmptyTeams() {
        const nonEmptyTeams = this.teams.filter(team => team.members.length > 0);
        this.teams = nonEmptyTeams;
    }
}
exports.Data = Data;
//# sourceMappingURL=index.js.map