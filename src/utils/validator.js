const forbiddenCharacters = {
    email: ' ;\\":/?!\'',
    nickname: '',
    password: '',
};

export default class ValidationError {
    #email;

    #password;

    #confirmPassword;

    #username;

    #validStatus;

    #addError(erorrClass, deletedClasses) {
        deletedClasses.forEach((curClass) => {
            document.querySelector(curClass).classList.add('invisible');
        });
        if (erorrClass) document.querySelector(erorrClass).classList.remove('invisible');
    }

    constructor(...props) {
        this.name = 'ValidationError';
        [this.#email, this.#password, this.#confirmPassword, this.#username] = props;
    }

    getMail() {
        return this.#email;
    }

    getUsername() {
        return this.#username;
    }

    getPassword() {
        return this.#password;
    }

    getConfirmPassword() {
        return this.#confirmPassword;
    }

    validate() {
        this.#validateEmail();
        this.#validatePassword();
        this.#validateConfirmPassword();
        this.#validateNick();
    }

    isValid() {
        return this.#validStatus;
    }

    /**
     * implementation email validation
     * @param {string} email - the email
     */
    #validateEmail() {
        const errorTypes = ['.empty-email', '.missdog-email', '.invalid-email', '.occupied-email'];

        this.#email.addEventListener('input', () => {
            this.#email.classList.remove('login-reg__input_error');
            this.#addError('', errorTypes);

            this.#validStatus = (this.#email.value !== '');

            if (!this.#validStatus) {
                this.#addError('.empty-email', errorTypes);
                this.#email.classList.add('login-reg__input_error');
                return;
            }

            const inputValue = String(this.#email.value);

            if (!(inputValue.includes('@mail.ru') || inputValue.includes('@yandex.ru') || inputValue.includes('@gmail.com'))) {
                this.#addError('.missdog-email', errorTypes);
                this.#email.classList.add('login-reg__input_error');
                this.#validStatus = false;
                return;
            }

            this.#validStatus = String(this.#email.value).split('').every((curSymbol) => !forbiddenCharacters.email.split('').includes(curSymbol));

            if (!this.#validStatus) {
                this.#addError('.invalid-email', errorTypes);
                this.#email.classList.add('login-reg__input_error');
                return;
            }

            this.#validStatus = true;
        });
    }

    /**
     * implementation email validation
     * @param {Object} password - the password html element
     */
    #validatePassword() {
        const errorTypes = ['.empty-password', '.invalid-password'];

        this.#password.addEventListener('input', () => {
            this.#password.classList.remove('login-reg__input_error');
            this.#addError('', errorTypes);

            this.#validStatus = (this.#password.value !== '');

            if (!this.#validStatus) {
                this.#addError('.empty-password', errorTypes);
                this.#password.classList.add('login-reg__input_error');
                return;
            }

            this.#validStatus = (this.#password.value.length > 8);

            if (!this.#validStatus) {
                this.#addError('.invalid-password', errorTypes);
                this.#password.classList.add('login-reg__input_error');
                return;
            }

            this.#validStatus = true;
        });
    }

    /**
     * implementation email validation
     * @param {Object} password - the password
     * @param {Object} confirmPassword - the confirm password
     */
    #validateConfirmPassword() {
        const errorTypes = ['.empty-confirm-password', '.invalid-confirm-password'];

        this.confirmPassword?.addEventListener('input', () => {
            this.#confirmPassword.classList.remove('login-reg__input_error');
            this.#addError('', errorTypes);

            this.#validStatus = (this.#confirmPassword.value !== '');

            if (!this.#validStatus) {
                this.#addError('.empty-confirm-password', errorTypes);
                this.#confirmPassword.classList.add('login-reg__input_error');
                return;
            }

            this.#validStatus = (
                String(this.password.value) === String(this.#confirmPassword.value)
            );

            if (!this.#validStatus) {
                this.#addError('.invalid-confirm-password', errorTypes);
                this.#confirmPassword.classList.add('login-reg__input_error');
                return;
            }

            this.#validStatus = true;
        });
    }

    /**
     * implementation email validation
     * @param {Object} nick - the nickname
     */
    #validateNick() {
        const errorTypes = ['.empty-nick', '.invalid-nick'];

        this.#username?.addEventListener('input', () => {
            this.#username.classList.remove('login-reg__input_error');
            this.#addError('', errorTypes);

            this.#validStatus = (this.#username.value !== '');

            if (!this.#validStatus) {
                this.#addError('.empty-nick', errorTypes);
                this.#username.classList.add('login-reg__input_error');
                return;
            }

            this.#validStatus = (this.#username.value.length > 1);

            if (!this.#validStatus) {
                this.#addError('.invalid-nick', errorTypes);
                this.#username.classList.add('login-reg__input_error');
                return;
            }

            this.#validStatus = true;
        });
    }
}
