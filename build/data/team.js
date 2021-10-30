"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Team {
    constructor(name) {
        this.name = name;
        this.members = [];
        this.point = 0;
    }
    addMember(user) {
        console.log(user);
        this.removeMember(user.id);
        this.members = [...this.members, user];
    }
    getUserById(user_id) {
        return this.members.find(member => member.id === user_id);
    }
    removeMember(user_id) {
        const members = this.members.filter(member => member.id !== user_id);
        this.members = members;
    }
}
exports.Team = Team;
//# sourceMappingURL=team.js.map