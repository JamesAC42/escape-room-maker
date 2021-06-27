export class ILogin {
    email;
    password;
    constructor() {
        this.email = '';
        this.password = '';
    }
}

export class IRegister {
    email;
    username;
    password;
    passwordConfirm;
    constructor() {
        this.email = '';
        this.username = '';
        this.password = '';
        this.passwordConfirm = '';
    }
}

export class LoginState {
    mode;
    login;
    register;
    constructor() {
        this.mode = 1;
        this.login = new ILogin();
        this.register = new IRegister();
    }
}