export const emailErrorTypes: ErrorTypes[] = [
    {
        param: 'emptyEmail',
        class: 'empty-email',
        message: 'Почта не может быть пустой',
    },
    {
        param: 'invalidEmail',
        class: 'invalid-email',
        message: 'Почта невалидна',
    },
    {
        param: 'occupiedEmail',
        class: 'occupied-email',
        message: 'Почта уже зарегистрирована',
    },
    {
        param: 'missdogEmail',
        class: 'missdog-email',
        message: 'Пропущен знак @',
    },
];

export const oldPasswordErrorTypes: ErrorTypes[] = [
    {
        param: 'incorrectOldPassword',
        class: 'incorrect-old-password',
        message: 'Введен неверный пароль',
    },
];

export const passwordErrorTypes: ErrorTypes[] = [
    {
        param: 'emptyPassword',
        class: 'empty-password',
        message: 'Пароль не может быть пустым',
    },
    {
        param: 'invalidPassword',
        class: 'invalid-password',
        message: 'Пароль должен быть длиннее 8 символов',
    },
    {
        param: 'incorrectPassword',
        class: 'incorrect-password',
        message: 'Введен неверный пароль',
    },
];

export const confirmPasswordErrorTypes: ErrorTypes[] = [
    {
        param: 'emptyConfirmPassword',
        class: 'empty-confirm-password',
        message: 'Подтверждение пароля не может быть пустым',
    },
    {
        param: 'invalidConfirmPassword',
        class: 'invalid-confirm-password',
        message: 'Неверное подтверждение пароля',
    },
];

export const newPasswordErrorTypes: ErrorTypes[] = [
    {
        param: 'emptyNewPassword',
        class: 'empty-new-password',
        message: 'Пароль не может быть пустым',
    },
    {
        param: 'invalidNewPassword',
        class: 'invalid-new-password',
        message: 'Пароль должен быть длиннее 8 символов',
    },
];

export const nicknameErrorTypes: ErrorTypes[] = [
    {
        param: 'emptyNickname',
        class: 'empty-nickname',
        message: 'Поле не может быть пустым',
    },
    {
        param: 'invalidNickname',
        class: 'invalid-nickname',
        message: 'Никнейм должен быть длиннее двух символов',
    },
    {
        param: 'invalidNicknameSymbols',
        class: 'invalid-nickname-symbols',
        message: 'Никнейм может содержать буквы и цифры',
    },
];

export const usernameErrorTypes: ErrorTypes[] = [
    {
        param: 'occupiedUsername',
        class: 'occupied-username',
        message: 'Имя пользователя уже занято',
    },
];

export const countingMembersErrorTypes: ErrorTypes[] = [
    {
        param: 'incorrectEmptyCountingMembers',
        class: 'incorrect-emptyCountingMembers',
        message: 'Для создания группы выберите хотя-бы одного участника',
    },
];

export const chatNameErrorTypes: ErrorTypes[] = [
    {
        param: 'emptyName',
        class: 'empty-name',
        message: 'Поле не может быть пустым',
    },
    {
        param: 'invalidName',
        class: 'invalid-name',
        message: 'Имя канала должно быть длиннее четырех символов',
    },
    {
        param: 'invalidNameSymbols',
        class: 'invalid-name-symbols',
        message: "Имя канала содержит только буквы, цифры и '_'",
    },
];

export const chatDescriptionErrorTypes: ErrorTypes[] = [
    {
        param: 'emptyDescription',
        class: 'empty-description',
        message: 'Поле не может быть пустым',
    },
    {
        param: 'invalidDescription',
        class: 'invalid-description',
        message: 'Описание канала должно быть длиннее двух символов',
    },
    {
        param: 'invalidDescriptionSymbols',
        class: 'invalid-description-symbols',
        message:
            'Описание канала может содержать буквы, цифры и некоторые спец. символы [-.,!?_]',
    },
];
