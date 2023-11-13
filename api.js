

const apiURL = "https://wedev-api.sky.pro/api/v2/stepan-titov3/comments";
const apiLogin = "https://wedev-api.sky.pro/api/user/login";
const apiRegistration = "https://wedev-api.sky.pro/api/user";

export let token;
export let idCommit;
export let userName;
console.log(token);

export const setToken = (newToken) => {
    token = newToken;
};

export const setIDCommit = (newIDCommit) => {
    idCommit = newIDCommit;
};

export const setUserName = (newUserName) => {
    userName = newUserName;
};

export function getData() {

    return fetch(apiURL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        .then((response) => {

            return response.json();
        })
};

export function postData({ text }) {
    return fetch(apiURL, {
        method: "POST",
        body: JSON.stringify({
            text: text,
            //name: name,
            //forceError: true //Согласно документации POST-запрос будет в половине случаев отвечать 500-й ошибкой
            //добавлено для домашки 2.14.
        }),
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        .then((response) => {
            console.log(response);
            // Код который обрабатывает ошибку
            //throw new Error("Сервер упал");- был в уроке
            if (response.status === 400) {
                throw new Error("Текст коментария короче трех символов");

            } else if (response.status === 500) {
                throw new Error("Сервер упал");
            } else {

                return response.json();
            }
        })
};

export function login({ login, password }) {
    return fetch(apiLogin, {
        method: "POST",
        body: JSON.stringify({
            login: login,
            password: password
        }),
    })
        .then((response) => {
            console.log(response);
            if (response.status === 400) {
                throw new Error("Неправильный логин или пароль");
            } else {
                console.log(response);
                return response.json();
            }


        })

};

export function regisreation({ login, name, password }) {
    return fetch(apiRegistration, {
        method: "POST",
        body: JSON.stringify({
            login: login,
            name: name,
            password: password,
        }),
    })
        .then((response) => {
            console.log(response);
            if (response.status === 400) {
                throw new Error("Пользователь с таким логином уже сущетсвует");
            } else {
                console.log(response);
                return response.json();
            }
        })
};