"use strict";
import { getData, postData } from "./api.js";
import { render } from "./render.js";
//import { fullDate } from "./fullDate.js";
import { renderLogin } from "./loginPage.js";
import { token, userName } from "./api.js";
import { sanitizeHtml } from "./sanitizeHtml.js"
import {format} from 'date-fns';


// Код писать здесь

const startAt = Date.now();
const commentContainer = {};





// Функция apiGet  дполучаетанные с сервера по API
export const apiGet = () => {

    getData().then((responseData) => {
        const fromApp = responseData.comments.map((comment) => {

            return {

                userName: comment.author.name,
                checkLike: comment.isLiked,
                textComment: comment.text,
                countLikes: comment.likes,
                // длинная строка ниже- это преобразование даты, полученной с сервера для нормального отображения
                //fullDate: new Date(comment.date).toLocaleDateString() + " " + (new Date(comment.date).getHours() < 10 ? '0' + new Date(comment.date).getHours() : new Date(comment.date).getHours()) + ":" + (new Date(comment.date).getMinutes() < 10 ? '0' + new Date(comment.date).getMinutes() : new Date(comment.date).getMinutes()) + ":" + (new Date(comment.date).getSeconds() < 10 ? '0' + new Date(comment.date).getSeconds() : new Date(comment.date).getSeconds()),
                
                fullDate: format(new Date(comment.date), 'yyyy-MM-dd hh.mm.ss')
            };
        });
        comments = fromApp;

        renderComments();// Вызываем функцию рендеринга страницы
        likeButtons();//Вызываем функцию обработки клика по лайкам

        //buttonElement.disabled = false;// Включаем кнопку добавления комментария
        // buttonElement.textContent = 'Написать';// Меняем название кнопки добавления коментария
    });

};

apiGet();// Вызываем функцию получения данных с сервера по API

let comments = []; // Массив где будут хранится данные коментариев.




export const renderComments = () => { // Функция рендеринга страницы
    const appElement = document.getElementById("app");

    const renderHtml = render(comments); // получаем разметку из модуля render.js





    if (token == undefined) {
        appElement.innerHTML = `
    ${renderHtml}
    <div><p>Чтобы добавить коментарий, <span class="sign__autorization">авторизуйтесь</span></p>
    </div>`} else {
        appElement.innerHTML = `
    ${renderHtml}
    <div class="add-form">
      <input type="text" class="add-form-name" id="name-input" placeholder=${userName} readonly>
      <textarea type="textarea" class="add-form-text" id="comment-input" placeholder="Введите ваш коментарий"
        rows="4"></textarea>
      <div class="add-form-row">
        <button class="add-form-button" id="add-button">Написать</button>
       </div>
     </div>
         `;
        const buttonElement = document.getElementById("add-button");
        const listElement = document.getElementById("list");
        const nameInputElement = document.getElementById("name-input");
        const commentInputElement = document.getElementById("comment-input");


        buttonElement.addEventListener('click', () => {

            nameInputElement.classList.remove('error');
            commentInputElement.classList.remove('error');
            // 6. Чтение значения атрибутов HTML элементов;

            if (commentInputElement.value === '' || commentInputElement.value === 'Введите ваш коментарий') {//Проверка на корректность ввода данных в форму (валидация)
                commentInputElement.classList.add('error');// И подсветить флорму красным цветом
                return;
            }




            const startAt = Date.now();
            console.log("Начинаю делать запрос");

            commentContainer.name = nameInputElement.value;//сохраняем имя коментатора на случай ошибки 
            //commentContainer.text = commentInputElement.value;//сохраняем коментарий на случай ошибки

            let commentContainerText = commentInputElement.value;

            buttonElement.disabled = true;// Выключаем кнопку добавления комментария
            buttonElement.textContent = 'Коментарий добавляется...';// Меняем надпись кнопки





            postData({

                text: sanitizeHtml(commentInputElement.value),

            })
                .then((response) => {
                    console.log("Время:" + (Date.now() - startAt));
                    return response;
                })

                .then(() => {
                    return apiGet();// Вызываем функцию получения данных с сервера по API
                })
                .then(() => {
                    buttonElement.disabled = false;// Включаем кнопку добавления комментария
                    buttonElement.textContent = 'Написать';// И меняем надпись обратно
                })
                .catch((error) => {// Обработчик ошибок
                    console.warn(error);
                    error == "Error: Текст коментария короче трех символов"
                        ? alert("Текст коментария должн содержать хотя бы три символа")
                        : alert("Что-то пошло не так, попробуйте отправить коментарий позже");
                    console.log(error);
                    return renderError(commentContainerText);// вызываем функцию обработки ошибок связанных с работой API

                })


            nameInputElement.value = '';// Очиска формы имени после ввода данных
            commentInputElement.value = '';// Очиска формы коментария после ввода данных

        });

        const commentsElements = document.querySelectorAll(".comment");
        for (const comment of commentsElements) {
            comment.addEventListener('click', () => {
                event.stopPropagation();//Отключение дочерних событий
                const dataComment = comment.dataset.text;
                const dataName = comment.dataset.name;



                commentInputElement.value = `> ${dataComment}\n\n${dataName}`;
                console.log(`> ${dataComment}\n\n${dataName}`);
            });

        };





    };
    const loginElements = document.querySelectorAll(".sign__autorization");

    for (const comment of loginElements) {
        comment.addEventListener("click", () => {
            renderLogin();
        });
    };

};
renderComments(); // Вызываем функцию рендеринга страницы





const likeButtons = () => { //Функция обработки клика по лайкам

    const buttonLikes = document.querySelectorAll(".like-button");
    for (const buttonLike of buttonLikes) {
        buttonLike.addEventListener("click", () => {

            event.stopPropagation();//Отключение дочерних событий
            if (token !== undefined) {// Отключение лайка если нет авторизации
                if (comments[buttonLike.dataset.index].checkLike === true) {
                    comments[buttonLike.dataset.index].checkLike = false;
                    comments[buttonLike.dataset.index].countLikes--;
                } else {
                    comments[buttonLike.dataset.index].checkLike = true;
                    comments[buttonLike.dataset.index].countLikes++;
                }

                renderComments(); // Вызываем функцию рендеринга страницы
                likeButtons(); //Вызываем функцию обработки клика по лайкам
            } else return;
        });
    }
};

const renderError = (commentContainerText) => {// Функция обработки ошибок запрса
    const buttonElement = document.getElementById("add-button");
    const nameInputElement = document.getElementById("name-input");
    const commentInputElement = document.getElementById("comment-input");
    buttonElement.disabled = false;// Включаем кнопку добавления комментария
    buttonElement.textContent = 'Написать';// И меняем надпись обратно
    nameInputElement.value = `${commentContainer.name}`;
    commentInputElement.value = commentContainerText;
    //renderComments(); // Вызываем функцию рендеринга страницы
    //likeButtons(); //Вызываем функцию обработки клика по лайкам
};


renderComments(); // Вызываем функцию рендеринга страницы
likeButtons(); //Вызываем функцию обработки клика по лайкам








console.log("Время:" + (Date.now() - startAt));
renderComments();// Вызываем функцию рендеринга страницы
likeButtons();//Вызываем функцию обработки клика по лайкам





console.log("It works!");