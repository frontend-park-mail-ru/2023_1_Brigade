/**
 * Проверяет электронную почту на пустое значение, наличие символа @ и соответствие формату.
 *
 * @param {string} email - Электронная почта.
 * @returns {{isError: boolean, errorClass: string}} - Объект с параметрами isError и errorClass.
 */
export const checkEmail = (email: string) => {
    const isNotEmpty = email.length > 0;
    const hasDog = /@/.test(email);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isNotEmpty) {
        return {
            isError: true,
            errorClass: 'empty-email',
        };
    }

    if (!hasDog) {
        return {
            isError: true,
            errorClass: 'missdog-email',
        };
    }

    if (!isValid) {
        return {
            isError: true,
            errorClass: 'invalid-email',
        };
    }

    return {
        isError: false,
        errorClass: '',
    };
};

/**
 * Проверяет пароль на пустое значение и наличие не менее 8 символов
 *
 * @param {string} password - Пароль.
 * @returns {{isError: boolean, errorClass: string}} - Объект с параметрами isError и errorClass.
 */
export const checkPassword = (password: string) => {
    const isNotEmpty = password.length > 0;
    const hasValidLength = password.length >= 8;

    if (!isNotEmpty) {
        return {
            isError: true,
            errorClass: 'empty-password',
        };
    }

    if (!hasValidLength) {
        return {
            isError: true,
            errorClass: 'invalid-password',
        };
    }

    return {
        isError: false,
        errorClass: '',
    };
};

/**
 * Проверяет новый пароль на пустое значение и наличие не менее 8 символов
 *
 * @param {string} password - Пароль.
 * @returns {{isError: boolean, errorClass: string}} - Объект с параметрами isError и errorClass.
 */
export const checkNewPassword = (password: string) => {
    const isNotEmpty = password.length > 0;
    const hasValidLength = password.length >= 8;

    if (!isNotEmpty) {
        return {
            isError: true,
            errorClass: 'empty-new-password',
        };
    }

    if (!hasValidLength) {
        return {
            isError: true,
            errorClass: 'invalid-new-password',
        };
    }

    return {
        isError: false,
        errorClass: '',
    };
};

/**
 * Проверяет подтвержденный пароль на пустое значение и соответствие значению пароля.
 *
 * @param {string} password - Пароль.
 * @param {string} confirmPassword - Подтверждение пароля.
 * @returns {{isError: boolean, errorClass: string}} - Объект с параметрами isError и errorClass.
 */
export const checkConfirmPassword = (
    password: string,
    confirmPassword: string
) => {
    const isNotEmpty = confirmPassword.length > 0;
    const isEqualPassword = confirmPassword === password;

    if (!isNotEmpty) {
        return {
            isError: true,
            errorClass: 'empty-confirm-password',
        };
    }

    if (!isEqualPassword) {
        return {
            isError: true,
            errorClass: 'invalid-confirm-password',
        };
    }

    return {
        isError: false,
        errorClass: '',
    };
};

/**
 * Проверяет корректность никнейма.
 * @param {string} nickname - Никнейм, который будет проверен.
 * @returns {Object} - Объект с параметрами isError и errorClass.
 */
export const checkNickname = (nickname: string) => {
    const isNotEmpty = nickname.length > 0;
    const hasValidLength = nickname.length > 1;
    const isValid = /^[/^[a-zA-Zа-яА-Я0-9_-]{3,16}$/.test(nickname);

    if (!isNotEmpty) {
        return {
            isError: true,
            errorClass: 'empty-nickname',
        };
    }

    if (!hasValidLength) {
        return {
            isError: true,
            errorClass: 'invalid-nickname',
        };
    }

    if (!isValid) {
        return {
            isError: true,
            errorClass: 'invalid-nickname-symbols',
        };
    }

    return {
        isError: false,
        errorClass: '',
    };
};

/**
 * Функция добавляет классы invisible элементам из массива ErrorTypes и удаляет указанный класс у элемента по селектору
 * @param {string} classToRemoveInvisible - имя класса, который нужно удалить у элемента
 * @param {ErrorTypes[]} classesToAddInvisible - массив объектов типа ErrorTypes, содержащих имя класса элемента, которому нужно добавить класс 'invisible'
 */
export const addErrorToClass = (
    classToRemoveInvisible: string,
    classesToAddInvisible: ErrorTypes[]
) => {
    classesToAddInvisible.forEach((curClass) => {
        document
            .querySelector('.' + curClass.class)
            ?.classList.add('invisible');
    });

    if (classToRemoveInvisible)
        document
            .querySelector('.' + classToRemoveInvisible)
            ?.classList.remove('invisible');
};

// TODO: на будущее для проверки пароля
// const hasNumber = /\d/.test(password);
// const hasUpperCase = /[A-Z]/.test(password);
// const hasLowerCase = /[a-z]/.test(password);

// TODO: в будущем для мыла можно сделать такую мегауточняющую хрень
// function validateEmail(email) {
//     const errors = {};

//     if (!email) {
//       errors.missing = 'Email address is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       const parts = email.split('@');
//       if (parts.length !== 2) {
//         errors.invalid = 'Invalid email address format';
//       } else {
//         const localPart = parts[0];
//         const domainPart = parts[1];
//         if (!localPart) {
//           errors.invalid = 'Local part of email address is missing';
//         } else if (!domainPart) {
//           errors.invalid = 'Domain part of email address is missing';
//         } else if (localPart.length > 64) {
//           errors.invalid = 'Local part of email address is too long';
//         } else if (domainPart.length > 255) {
//           errors.invalid = 'Domain part of email address is too long';
//         } else if (!/^[a-zA-Z0-9!#$%&'*+/=?^_`~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)) {
//             errors.invalid = 'Invalid email address format';
//           }
//         }
//     }

//       return errors;
// }
