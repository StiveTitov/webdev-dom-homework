import { login, setToken, token } from "./api.js";
import { renderComments } from "./main.js";
import { apiGet } from "./main.js";



export const renderLogin = () => {
    const appElement = document.getElementById("app");
    const loginHtml = `
    <div class="container">
        <ul class="comments" id="list">

            <div class="add-form">
                <p>Форма входа</p>
                <input type="text" class="add-form-login" id="login-input" placeholder="Введите логин" />
                <input type="text" class="add-form-login" id="password-input" placeholder="Введите пароль" />
                <div class="add-form-row">
                    <button class="add-form-button" id="login-button">Войти</button>
                </div>
                <div>
                <p class="sign__autorization">Зарегистрироваться</p>
                </div>
            </div>
    </div>
    `;
    appElement.innerHTML = loginHtml;

    const buttonElement = document.getElementById("login-button");
    const loginInputElement = document.getElementById("login-input");
    const passwordInputElement = document.getElementById("password-input");

    buttonElement.addEventListener("click", () => {
        login({
            login: loginInputElement.value,
            password: passwordInputElement.value,
        }).then((responseData) => {

            setToken(responseData.user.token);
            console.log(token);
        });
        apiGet();
        renderComments();
    });

};