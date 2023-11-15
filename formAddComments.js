import { postData } from "./api.js";
import { renderComments } from "./main.js";
import { apiGet } from "./main.js";

export const formAddComments = () => {
    //const appElement = document.getElementById("app");
    const formAddCommentsHtml = `
    <div class="add-form">
      <input type="text" class="add-form-name" id="name-input" placeholder="Введите ваше имя" />
      <textarea type="textarea" class="add-form-text" id="comment-input" placeholder="Введите ваш коментарий"
        rows="4"></textarea>
      <div class="add-form-row">
        <button class="add-form-button" id="add-button">Написать</button>
       </div>
     </div>
    `;
    formAddCommentsHtml.innerHTML

    const buttonElement = document.getElementById("add-button");
    //const listElement = document.getElementById("list");
    const nameInputElement = document.getElementById("name-input");
    const commentInputElement = document.getElementById("comment-input");



    

    const renderError = () => {// Функция обработки ошибок запрса
        buttonElement.disabled = false;// Включаем кнопку добавления комментария
        buttonElement.textContent = 'Написать';// И меняем надпись обратно
        nameInputElement.value = `${commentContainer.name}`;
        commentInputElement.value = `${commentContainer.text}`;
        renderComments(); // Вызываем функцию рендеринга страницы
        //   likeButtons(); //Вызываем функцию обработки клика по лайкам
    };

    buttonElement.addEventListener('click', () => {

        nameInputElement.classList.remove('error');
        commentInputElement.classList.remove('error');
        // 6. Чтение значения атрибутов HTML элементов;
        if (nameInputElement.value === '' || nameInputElement.value === 'Введите ваше имя') {
            nameInputElement.classList.add('error');
            return;
        }
        if (commentInputElement.value === '' || commentInputElement.value === 'Введите ваш коментарий') {//Проверка на корректность ввода данных в форму (валидация)
            commentInputElement.classList.add('error');// И подсветить флорму красным цветом
            return;
        }



        const sanitizeHtml = (htmlString) => {
            return htmlString.replaceAll("&", "&amp;")// обязательно начинать обработку с "&", "&amp;"! иначе  при символе "<" будет выводиться "&lt;" и т.д.
                .replaceAll("<", "&lt;")// элементарная обработка пользовательского ввода на предмет
                .replaceAll(">", "&gt;") // всяких нехороших вещей в HTML-коде, в данном случае управляющие символы разметки "<" и ">"
                .replaceAll('"', "&quot;");// меняются; на их коды, а браузер всёравно выводит эти символы
        };

        const startAt = Date.now();
        console.log("Начинаю делать запрос");

        commentContainer.name = nameInputElement.value;//сохраняем имя коментатора на случай ошибки 
        commentContainer.text = commentInputElement.value;//сохраняем коментарий на случай ошибки

        buttonElement.disabled = true;// Выключаем кнопку добавления комментария
        buttonElement.textContent = 'Коментарий добавляется...';// Меняем надпись кнопки





        postData({
            text: sanitizeHtml(commentInputElement.value),
            name: sanitizeHtml(nameInputElement.value),
        }).then((response) => {
            console.log("Время:" + (Date.now() - startAt));
            return response;
        })
            .then((response) => {
                console.log(response);
                // Код который обрабатывает ошибку
                //throw new Error("Сервер упал");- был в уроке
                if (response.status === 201) {
                    return response.json();
                } else if (response.status === 400) {
                    return Promise.reject("Короткое имя");
                } else {
                    // Код который обрабатывает ошибку
                    //throw new Error("Сервер упал");
                    return Promise.reject("Сервер упал");

                }
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
                error === "Короткое имя" ? alert("Имя должно содержать хотя бы три символа") : alert("Что-то пошло не так, попробуйте отправить коментарий позже");
                return renderError();// вызываем функцию обработки ошибок связанных с работой API

            })


        nameInputElement.value = '';// Очиска формы имени после ввода данных
        commentInputElement.value = '';// Очиска формы коментария после ввода данных
        renderComments();
    });
    return;
};