
import { regisreation, setToken, token, setUserName, userName } from "./api.js";
import { renderComments } from "./main.js";
import { apiGet } from "./main.js";
import { renderLogin } from "./loginPage.js"
import { sanitizeHtml } from "./sanitizeHtml.js"
import _ from 'lodash';




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

        if (nameInputElement.value === '' || nameInputElement.value === 'Введите имя') {//Проверка на корректность ввода данных в форму (валидация)
            nameInputElement.classList.add('error');// И подсветить флорму красным цветом
            return;
        }
        if (loginInputElement.value === '' || loginInputElement.value === 'Введите логин') {//Проверка на корректность ввода данных в форму (валидация)
            loginInputElement.classList.add('error');// И подсветить флорму красным цветом
            return;
        }
        if (passwordInputElement.value === '' || passwordInputElement.value === 'Введите пароль') {//Проверка на корректность ввода данных в форму (валидация)
            passwordInputElement.classList.add('error');// И подсветить флорму красным цветом
            return;
        }

        regisreation({
            name: _.capitalize(nameInputElement.value),
            //name: sanitizeHtml(nameInputElement.value),
            login: sanitizeHtml(loginInputElement.value),
            password: passwordInputElement.value,



        })
            .then((responseData) => {

                setToken(responseData.user.token);
                console.log(token);
                setUserName(responseData.user.name);
                console.log(userName);
                apiGet();
                renderComments();

            })

            .catch((error) => {// Обработчик ошибок
                console.warn(error);
                alert("Пользователь с таким логином уже сущетсвует");
                renderRegistration();
            });

    });


    loginPageElement.addEventListener("click", () => {
        renderLogin();
    });
};