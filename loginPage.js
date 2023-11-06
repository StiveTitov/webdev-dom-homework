import { login, setToken, token, setUserName, userName } from "./api.js";
import { renderComments } from "./main.js";
import { apiGet } from "./main.js";
import { renderRegistration } from "./registratonPage.js"



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
        login({
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

    regisreationElement.addEventListener("click", () => {
        renderRegistration();
    });
};