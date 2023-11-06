import { regisreation, setToken, token, setUserName, userName } from "./api.js";
import { login } from "./api.js";
import { renderComments } from "./main.js";
import { apiGet } from "./main.js";
import { renderLogin } from "./loginPage.js"





export const renderRegistration = () => {
    const appElement = document.getElementById("app");
    const RegistrationHtml = `
    <div class="container">
        <ul class="comments" id="list">

            <div class="add-form">
                <p>Форма регистрации</p>
                <div class="input-data">
                <input type="text" class="add-form-login" id="name-input" placeholder="Введите имя" />
                <input type="text" class="add-form-login" id="login-input" placeholder="Введите логин" />
                <input type="text" class="add-form-login" id="password-input" placeholder="Введите пароль" />
                </div>
                <div class="add-form-row">
                    <button class="add-form-button" id="registration-button">Зарегистрироваться</button>
                </div>
                <div>
                <p class="sign__autorization" id="login-page">Войти</p>
                </div>
            </div>
    </div>
    `;
    appElement.innerHTML = RegistrationHtml;

    const buttonElement = document.getElementById("registration-button");
    const nameInputElement = document.getElementById("name-input");
    const loginInputElement = document.getElementById("login-input");
    const passwordInputElement = document.getElementById("password-input");
    const loginPageElement = document.getElementById("login-page");

    buttonElement.addEventListener("click", () => {
        regisreation({
            name: nameInputElement.value,
            login: loginInputElement.value,
            password: passwordInputElement.value,
        }).then((responseData) => {

            setToken(responseData.user.token);
            console.log(token);
            setUserName(responseData.user.name);
            console.log(userName);
        });
        apiGet();
        renderComments();
    });


    loginPageElement.addEventListener("click", () => {
        renderLogin();
    });
};