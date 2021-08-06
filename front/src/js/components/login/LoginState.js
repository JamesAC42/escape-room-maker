// State class for login information
export class ILogin {
  email;
  password;
  constructor() {
    this.email = "";
    this.password = "";
  }
}

// State class for register information
export class IRegister {
  email;
  username;
  dob;
  password;
  passwordConfirm;
  constructor() {
    this.email = "";
    this.username = "";
    this.dob = null;
    this.password = "";
    this.passwordConfirm = "";
  }
}

// State class for login and registration information
export class LoginState {
  mode;
  login;
  register;
  error;
  constructor() {
    this.mode = 1;
    this.login = new ILogin();
    this.register = new IRegister();
    this.error = "";
  }
}
