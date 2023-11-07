import { login, setToken, token, setUserName, userName } from "./api.js";
import { renderComments } from "./main.js";
import { apiGet } from "./main.js";
import { renderRegistration } from "./registratonPage.js"
import { sanitizeHtml } from "./sanitizeHtml.js"



export const renderLogin = () => {
    const appElement = document.getElementById("app");
    const loginHtml = `
    <div class="container">
        <ul class="comments" id="list">

            <div class="add-form">
                <p>Форма входа</p>
                <div class="input-data">
                <input type="text" class="add-form-login" id="login-input" placeholder="Введите логин" />
                <input type="text" class="add-form-login" id="password-input" placeholder="Введите пароль" />
                </div>
                <div class="add-form-row">
                    <button class="add-form-button" id="login-button">Войти</button>
                </div>
                <div>
                <p class="sign__autorization" id="registration-page">Зарегистрироваться</p>
                </div>
            </div>
    </div>
    `;
    appElement.innerHTML = loginHtml;

    const buttonElement = document.getElementById("login-button");
    const loginInputElement = document.getElementById("login-input");
    const passwordInputElement = document.getElementById("password-input");
    const regisreationElement = document.getElementById("registration-page");

    buttonElement.addEventListener("click", () => {
        if (loginInputElement.value === '' || loginInputElement.value === 'Введите логин') {//Проверка на корректность ввода данных в форму (валидация)
            loginInputElement.classList.add('error');// И подсветить флорму красным цветом
            return;
        }
        if (passwordInputElement.value === '' || passwordInputElement.value === 'Введите пароль') {//Проверка на корректность ввода данных в форму (валидация)
            passwordInputElement.classList.add('error');// И подсветить флорму красным цветом
            return;
        }
        login({
            login: sanitizeHtml(loginInputElement.value),
            password: passwordInputElement.value,
        }).then((response) => {

            setToken(response.user.token);
            console.log(token);
            setUserName(response.user.name);
            console.log(userName);
        }).then((response) => {

            if (response.status === 201) {

                return response.json();
            } else if (response.status === 400) {
                return Promise.reject("Неправильный логин или пароль");
            } else {
                // Код который обрабатывает ошибку
                throw new Error("Сервер упал");
                return Promise.reject("Сервер упал");

            }
        }).catch((error) => {// Обработчик ошибок
            console.warn(error);
            //error === "Неправильный логин или пароль" ? alert("Неправильный логин или пароль") : alert("Что-то пошло не так, попробуйте отправить коментарий позже");
            return;

        })
        apiGet();
        renderComments();
    });

    regisreationElement.addEventListener("click", () => {
        renderRegistration();
    });
};