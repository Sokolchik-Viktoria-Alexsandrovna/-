
// Основной JavaScript файл для книжного магазина
// Здесь будет вся логика: работа с localStorage, cookies, анимации

// Жду пока весь HTML загрузится
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен! Начинаю работу...');
    
    // Вызываю основные функции инициализации
    initNavigation();
    initCookies();
    initUserName();
    initViewedBooks();
    initNewBooks();
    initModals();
    
    // Добавляю плавное появление элементов при скролле
    initScrollAnimations();
});

// Функция для работы с навигацией (меню на мобильных)
function initNavigation() {
    console.log('Настраиваю навигацию...');
    
    // Нахожу кнопку меню и список навигации
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navList');
    
    // Если элементы существуют на этой странице
    if (menuToggle && navList) {
        // Добавляю обработчик клика на кнопку меню
        menuToggle.addEventListener('click', function() {
            console.log('Кликнули по меню');
            // Переключаю класс 'show' у списка навигации
            navList.classList.toggle('show');
            
            // Меняю иконку в зависимости от состояния меню
            const icon = menuToggle.querySelector('i');
            if (navList.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Закрываю меню при клике на ссылку (на мобильных)
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('show');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            });
        });
    }
}

// Функция для работы с cookies
function initCookies() {
    console.log('Настраиваю cookies...');
    
    // Нахожу баннер cookies и кнопку принятия
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    
    // Если элементы существуют на этой странице
    if (cookieBanner && cookieAccept) {
        // Проверяю, не принимал ли уже пользователь cookies
        const cookiesAccepted = getCookie('cookiesAccepted');
        
        // Если cookies еще не приняты, показываю баннер
        if (!cookiesAccepted) {
            // Делаю небольшую задержку перед показом баннера
            setTimeout(() => {
                cookieBanner.classList.add('show');
                console.log('Показываю баннер cookies');
            }, 1000);
        }
        
        // Добавляю обработчик клика на кнопку принятия
        cookieAccept.addEventListener('click', function() {
            console.log('Пользователь принял cookies');
            
            // Устанавливаю cookie на 365 дней
            setCookie('cookiesAccepted', 'true', 365);
            
            // Скрываю баннер с анимацией
            cookieBanner.classList.remove('show');
            
            // Через полсекунды полностью убираю баннер
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 500);
        });
    }
}

// Функция для работы с именем пользователя
function initUserName() {
    console.log('Настраиваю имя пользователя...');
    
    // Нахожу блок для приветствия
    const userGreeting = document.getElementById('userGreeting');
    const nameModal = document.getElementById('nameModal');
    const saveNameBtn = document.getElementById('saveName');
    const userNameInput = document.getElementById('userNameInput');
    
    // Если элементы существуют на этой странице
    if (userGreeting) {
        // Проверяю, есть ли сохраненное имя в cookies
        const userName = getCookie('userName');
        
        if (userName) {
            // Если имя есть, показываю приветствие
            userGreeting.innerHTML = `<i class="fas fa-user"></i> Привет, ${userName}!`;
            console.log('Приветствую пользователя:', userName);
        } else if (nameModal && saveNameBtn && userNameInput) {
            // Если имени нет, показываю модальное окно для ввода имени
            // Но жду 2 секунды, чтобы пользователь увидел сайт
            setTimeout(() => {
                nameModal.classList.add('show');
                console.log('Показываю модалку для ввода имени');
            }, 2000);
            
            // Добавляю обработчик клика на кнопку сохранения
            saveNameBtn.addEventListener('click', function() {
                const name = userNameInput.value.trim();
                
                // Проверяю, что имя не пустое
                if (name) {
                    console.log('Сохраняю имя пользователя:', name);
                    
                    // Сохраняю имя в cookie на 30 дней
                    setCookie('userName', name, 30);
                    
                    // Показываю приветствие
                    userGreeting.innerHTML = `<i class="fas fa-user"></i> Привет, ${name}!`;
                    
                    // Скрываю модальное окно
                    nameModal.classList.remove('show');
                } else {
                    // Если имя пустое, показываю подсказку
                    alert('Пожалуйста, введите ваше имя');
                    userNameInput.focus();
                }
            });
            
            // Также сохраняю имя при нажатии Enter
            userNameInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    saveNameBtn.click();
                }
            });
        }
    }
}

// Функция для отображения истории просмотров
function initViewedBooks() {
    console.log('Настраиваю историю просмотров...');
    
    // Нахожу контейнер для истории просмотров
    const viewedBooksContainer = document.getElementById('viewedBooks');
    const emptyMessage = document.getElementById('emptyViewedMessage');
    
    // Если контейнер существует на этой странице (главная страница)
    if (viewedBooksContainer) {
        // Получаю историю просмотров из localStorage
        let viewedBooks = JSON.parse(localStorage.getItem('viewedBooks')) || [];
        console.log('История просмотров:', viewedBooks);
        
        // Если история пустая, показываю сообщение
        if (viewedBooks.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            return;
        }
        
        // Скрываю сообщение "история пуста"
        if (emptyMessage) emptyMessage.style.display = 'none';
        
        // Преобразую ID книг в объекты книг
        const booksToShow = [];
        for (let i = viewedBooks.length - 1; i >= 0 && booksToShow.length < 4; i--) {
            const bookId = viewedBooks[i];
            const book = books.find(b => b.id === bookId);
            if (book) {
                booksToShow.push(book);
            }
        }
        
        // Очищаю контейнер
        viewedBooksContainer.innerHTML = '';
        
        // Добавляю каждую книгу в контейнер
        booksToShow.forEach(book => {
            const bookElement = createBookCard(book, true); // true - это компактный вид
            viewedBooksContainer.appendChild(bookElement);
            
            // Добавляю обработчик клика для перехода к книге в каталоге
            bookElement.addEventListener('click', function() {
                // Сохраняю ID книги для открытия в каталоге
                localStorage.setItem('bookToOpen', book.id);
                // Перехожу на страницу каталога
                window.location.href = 'catalog.html';
            });
        });
    }
}

// Функция для отображения новинок месяца
function initNewBooks() {
    console.log('Настраиваю новинки месяца...');
    
    // Нахожу контейнер для новинок
    const newBooksContainer = document.getElementById('newBooks');
    
    // Если контейнер существует на этой странице (главная страница)
    if (newBooksContainer) {
        // Выбираю 4 случайные книги для отображения как новинки
        const shuffledBooks = [...books].sort(() => 0.5 - Math.random());
        const selectedBooks = shuffledBooks.slice(0, 4);
        
        console.log('Выбраны новинки:', selectedBooks.map(b => b.title));
        
        // Очищаю контейнер
        newBooksContainer.innerHTML = '';
        
        // Добавляю каждую книгу в контейнер
        selectedBooks.forEach(book => {
            const bookElement = createBookCard(book, false); // false - это полный вид
            newBooksContainer.appendChild(bookElement);
        });
    }
}

// Функция для создания карточки книги
function createBookCard(book, isCompact = false) {
    // Создаю основной элемент карточки
    const card = document.createElement('div');
    card.className = isCompact ? 'viewed-book-card' : 'book-card';
    
    // Проверяю, есть ли картинка у книги
    const hasImage = book.image && book.image.trim() !== '';
    
    if (isCompact) {
        // Компактный вид для истории просмотров
        card.innerHTML = `
            <div class="book-cover" style="background-color: ${getGenreColor(book.genre[0])}; height: 120px; ${hasImage ? `background-image: url('${book.image}'); background-size: cover; background-position: center;` : ''}">
                ${!hasImage ? `
                <div style="padding: 10px; color: white; font-weight: bold; font-size: 14px;">
                    ${book.title.substring(0, 30)}${book.title.length > 30 ? '...' : ''}
                </div>
                ` : ''}
            </div>
            <div class="book-info">
                <h4 class="book-title">${book.title.substring(0, 20)}${book.title.length > 20 ? '...' : ''}</h4>
                <p class="book-author">${book.author}</p>
            </div>
        `;
    } else {
        // Полный вид для каталога и новинок
        card.innerHTML = `
            <div class="book-cover" style="background-color: ${getGenreColor(book.genre[0])}; ${hasImage ? `background-image: url('${book.image}'); background-size: cover; background-position: center;` : ''}">
                ${!hasImage ? `
                <div style="padding: 20px; color: white; font-weight: bold;">
                    ${book.title}
                </div>
                ` : ''}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-genre">${book.genre[0]}</div>
                <p class="book-price">${book.price.toLocaleString('ru-RU')} руб.</p>
                <button class="btn" data-book-id="${book.id}">Подробнее</button>
            </div>
        `;
        
        // Добавляю обработчик клика на кнопку "Подробнее"
        const button = card.querySelector('button');
        button.addEventListener('click', function() {
            const bookId = parseInt(this.getAttribute('data-book-id'));
            console.log('Открываю подробности книги ID:', bookId);
            
            // Сохраняю книгу в историю просмотров
            addToViewedBooks(bookId);
            
            // Показываю модальное окно с деталями книги
            showBookDetails(bookId);
        });
    }
    
    return card;
}

// Функция для определения цвета обложки по жанру
function getGenreColor(genre) {
    const colorMap = {
        'Художественная литература': '#3498db',
        'Фэнтези': '#9b59b6',
        'Детектив': '#e74c3c',
        'Классика': '#2ecc71',
        'Антиутопия': '#34495e',
        'Приключения': '#f39c12',
        'Философская сказка': '#1abc9c',
        'Исторический роман': '#d35400',
        'Политический роман': '#7f8c8d'
    };
    
    return colorMap[genre] || '#3498db'; // Синий по умолчанию
}

// Функция для добавления книги в историю просмотров
function addToViewedBooks(bookId) {
    console.log('Добавляю книгу в историю просмотров:', bookId);
    
    // Получаю текущую историю из localStorage
    let viewedBooks = JSON.parse(localStorage.getItem('viewedBooks')) || [];
    
    // Удаляю книгу из истории, если она уже там есть (чтобы не было дублей)
    viewedBooks = viewedBooks.filter(id => id !== bookId);
    
    // Добавляю книгу в начало истории
    viewedBooks.push(bookId);
    
    // Ограничиваю историю 6 последними книгами
    if (viewedBooks.length > 6) {
        viewedBooks = viewedBooks.slice(-6);
    }
    
    // Сохраняю обновленную историю в localStorage
    localStorage.setItem('viewedBooks', JSON.stringify(viewedBooks));
    console.log('Обновленная история:', viewedBooks);
}

// Функция для показа деталей книги (модальное окно)
function showBookDetails(bookId) {
    // Нахожу книгу по ID
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        console.error('Книга не найдена:', bookId);
        return;
    }
    
    // Проверяю, есть ли картинка у книги
    const hasImage = book.image && book.image.trim() !== '';
    
    // Создаю модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'bookDetailsModal';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
                <div class="book-cover-large" style="background-color: ${getGenreColor(book.genre[0])}; ${hasImage ? `background-image: url('${book.image}'); background-size: cover; background-position: center;` : ''} width: 150px; height: 220px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; padding: 15px; text-align: center; flex-shrink: 0;">
                    ${!hasImage ? book.title : ''}
                </div>
                <div style="flex: 1; min-width: 250px;">
                    <h2 style="margin-bottom: 10px;">${book.title}</h2>
                    <h3 style="color: #7f8c8d; margin-bottom: 15px;">${book.author}</h3>
                    <div style="margin-bottom: 15px;">
                        ${book.genre.map(g => `<span class="book-genre" style="margin-right: 5px;">${g}</span>`).join('')}
                    </div>
                    <p><strong>Год издания:</strong> ${book.year}</p>
                    <p><strong>Количество страниц:</strong> ${book.pages}</p>
                    <p style="font-size: 1.5rem; color: #e74c3c; margin-top: 15px;"><strong>Цена: ${book.price.toLocaleString('ru-RU')} руб.</strong></p>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <h3>Описание</h3>
                <p>${book.description}</p>
            </div>
            <div class="modal-buttons" style="margin-top: 30px;">
                <button id="closeModal" class="btn">Закрыть</button>
            </div>
        </div>
    `;
    
    // Добавляю модальное окно на страницу
    document.body.appendChild(modal);
    
    // Добавляю обработчик клика на кнопку закрытия
    const closeBtn = document.getElementById('closeModal');
    closeBtn.addEventListener('click', function() {
        closeModal(modal);
    });
    
    // Закрываю модальное окно при клике вне его
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

// Функция для закрытия модального окна
function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Функция для инициализации модальных окон
function initModals() {
    // Закрываю модальные окна при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                closeModal(modal);
            });
        }
    });
}

// Функция для добавления плавных анимаций при скролле
function initScrollAnimations() {
    console.log('Настраиваю анимации при скролле...');
    
    // Нахожу все элементы, которые нужно анимировать
    const animatedElements = document.querySelectorAll('.category-card, .book-card, .about-content');
    
    // Создаю наблюдатель для отслеживания появления элементов
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляю класс с анимацией
                entry.target.classList.add('animate');
                // Перестаю наблюдать за элементом после анимации
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Срабатывает когда видно 10% элемента
        rootMargin: '0px 0px -50px 0px' // Небольшой отступ снизу
    });
    
    // Начинаю наблюдать за каждым элементом
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Добавляю CSS для анимации
    const style = document.createElement('style');
    style.textContent = `
        .category-card, .book-card, .about-content {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .category-card.animate, .book-card.animate, .about-content.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Задержки для последовательного появления */
        .category-card:nth-child(1) { transition-delay: 0.1s; }
        .category-card:nth-child(2) { transition-delay: 0.2s; }
        .category-card:nth-child(3) { transition-delay: 0.3s; }
        
        .book-card:nth-child(1) { transition-delay: 0.1s; }
        .book-card:nth-child(2) { transition-delay: 0.2s; }
        .book-card:nth-child(3) { transition-delay: 0.3s; }
        .book-card:nth-child(4) { transition-delay: 0.4s; }
    `;
    document.head.appendChild(style);
}

// Вспомогательная функция для установки cookie
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
    console.log('Установлен cookie:', name, '=', value);
}

// Вспомогательная функция для получения cookie
function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
