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
    dob;
    password;
    passwordConfirm;
    constructor() {
        this.email = '';
        this.username = '';
        this.dob = null;
        this.password = '';
        this.passwordConfirm = '';
    }
}

export class LoginState {
    mode;
    login;
    register;
    error;
    constructor() {
        this.mode = 1;
        this.login = new ILogin();
        this.register = new IRegister();
        this.error = '';
    }
}