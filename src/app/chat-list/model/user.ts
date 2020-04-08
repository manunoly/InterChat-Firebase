import { iUser } from './user.model';

export class User {
    user: iUser;

    constructor(user: iUser) {
        this.user = user;
    }

    getUser() {
        return this.user;
    }

    getId() {
        return this.user.idUser;
    }

    getName() {
        return this.user.userName;
    }

    getAvatar() {
        return this.user.avatar;
    }

    getType() {
        return this.user.type;
    }

    getImage() {
        return this.user.image;
    }

}
