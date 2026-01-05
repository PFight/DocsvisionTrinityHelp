export const VisitorGiftHtml = `
    <div id="controls" class="visitor-controls">
        <label>
            <div class="large-input-label">Номер телефона (последние 5 цифр):</div> 
            <input class="large-input" id="phoneCode" />
        </label>
        <label>
            <div class="large-input-label">Номер паспорта (последние 5 цифр):</div> 
            <input class="large-input" id="passportCode" />
        </label>
        <button class="large-button" id="viewHistory">Загрузить</button>
        <button class="large-button" id="printButton">Печать</button>
    </div>
    <div id="visitorPanel">
        <div id="result" class="visitor-panel-side">
            <div id="identity">
            </div>
            <div id="limits">
            </div>
            <div id="offender" class="hide">Нарушитель! Допуска в детский отдел и к дополнительной помощи нет!</div>
            <div id="currentMonth">
            </div>
            <template id="noVisitTemplate">
                <div class="visit__no-items">В этом сезоне посещений центра не найдено</div>
            </template>
            <div id="visitHistory">
            </div>
            <template id="visitTemplate">
                <div class="visit" >
                    <h3>
                        <span class="visit__date"></span>
                    </h3>
                    <h5><a class="visit__id"></a></h5>
                    <div class="visit__offender hide">Нарушение!!!</div>
                    <div class="visit__items">
                        <template id="visitPersonTemplate">
                            <span class="visit__person-name"></span>
                            <ul class="visit__person-things">
                                <template id="visitPersonThingTemplate">
                                    <li>
                                        <span class="visit__person-category-count"></span>
                                        <span class="visit__person-category"></span>
                                    </li>
                                </template>
                            </ul>
                        </template>
                    </div>
                </div>
            </template>
        </div>
        <div id="gift" class="visitor-panel-side">
            <table class="gift-fields">
                <tr class="gift-field">
                    <td class="gift-field__label">Последние 5 цифры номера телефона: </td>
                    <td class="gift-field__input-container">
                        <input id="phoneInput" class="gift-field__input" />
                    </td>
                </tr>
                <tr class="gift-field">
                    <td class="gift-field__label">Последние 5 цифры номера паспорта: </td>
                    <td class="gift-field__input-container">
                        <input id="passportInput" class="gift-field__input" />
                    </td>
                </tr>
                <tr class="gift-field">
                    <td class="gift-field__label">Фамилия И.О. (если нет номера): </td>
                    <td class="gift-field__input-container">
                        <input id="fioInput" class="gift-field__input" />
                    </td>
                </tr>
                <tr class="gift-field">
                    <td class="gift-field__label">Дата: </td>
                    <td class="gift-field__input-container">
                        <input id="dateInput" type="datetime-local" class="gift-field__input" />
                    </td>
                </tr>
                <tr class="gift-field">
                    <td class="gift-field__label">Нарушитель: </td>
                    <td class="gift-field__input-container">
                        <input id="offenderInput" type="checkbox" class="gift-field__input" />
                    </td>
                </tr>
                <tr class="gift-field gift-add-item">
                    <td class="gift-field__label">Имя: </td>
                    <td class="gift-field__input-container">
                        <button id="addItemPerson" readonly class="gift-add-item__button" >Добавить имя</button>
                        <button id="clearPersonButton" class="gift-add-item__button" >Удалить лишние</button>
                        <dialog id="nameSelectDialog">
                            <input class="name-select__input" id="nameSearch" tabindex="0" />
                            <button id="addNameButton" class="gift-add-item__button" >Добавить имя</button>
                            <button id="closeButton" class="gift-add-item__button" >Закрыть</button>
                            <div class="name-select__list" id="nameList">
                                
                            </div>
                            <template id="nameListItem">
                                <a class="name-select__list-item" tabindex="0"></a>
                            </template>
                        </dialog>
                        <div id="personList" class="gift-add-item__person-list">
                        </div>
                        <template id="personListItem">
                            <a class="gift-add-item__person-list-item" tabindex="0"></a>
                        </template>
                    </div>
                </td>
                <tr class="gift-field gift-add-item hide">
                    <td class="gift-field__label">Вещь (название или код): </td>
                    <td class="gift-field__input-container">
                        <input id="addItemName" class="gift-add-item__input" />
                        <button id="addItemButton" class="gift-add-item__button" >Добавить</button>
                        <button id="addItemButton2" class="gift-add-item__button" >+2</button>
                        <button id="addItemButton3" class="gift-add-item__button" >+3</button>
                        <button id="addItemButton4" class="gift-add-item__button" >+4</button>
                        <button id="addItemButton5" class="gift-add-item__button" >+5</button>
                        <button id="clearItemButton" class="gift-add-item__button" >Очистить</button>
                        <label for="">
                            <input id="autoClearInput" type="checkbox" checked />
                            Очищать автоматически
                        </label>
                    </td>
                </tr>
                <tr class="gift-add-item__table">
                    <td colspan="2">
                        <div class="gift-add-item__group" id="female">
                            <img src="Content/Modules/TrinityHelp/icons/woman.png" class="gift-add-item__group-icon" title="Женское" />
                            <div class="gift-add-item__card" data-code="9">
                                <img src="Content/Modules/TrinityHelp/icons/9.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Блузка</span>
                            </div>
                            <div class="gift-add-item__card" data-code="6">
                                <img src="Content/Modules/TrinityHelp/icons/6.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Свитер</span>
                            </div>
                            <div class="gift-add-item__card" data-code="1">
                                <img src="Content/Modules/TrinityHelp/icons/1.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Жилет/костюм</span>
                            </div>
                            <div class="gift-add-item__card" data-code="10">
                                <img src="Content/Modules/TrinityHelp/icons/10.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Юбка</span>
                            </div>
                            <div class="gift-add-item__card" data-code="3">
                                <img src="Content/Modules/TrinityHelp/icons/3.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Платье</span>
                            </div>
                            <div class="gift-add-item__card" data-code="2">
                                <img src="Content/Modules/TrinityHelp/icons/2.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Брюки</span>
                            </div>
                            <div class="gift-add-item__card" data-code="7">
                                <img src="Content/Modules/TrinityHelp/icons/7.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Шапка/шарф</span>
                            </div>
                            <div class="gift-add-item__card" data-code="8">
                                <img src="Content/Modules/TrinityHelp/icons/8.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Верхнее</span>
                            </div>
                            <div class="gift-add-item__card" data-code="4">
                                <img src="Content/Modules/TrinityHelp/icons/4.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Домашн.</span>
                            </div>
                            <div class="gift-add-item__card" data-code="62">
                                <img src="Content/Modules/TrinityHelp/icons/62.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Нижнее белье</span>
                            </div>
                            <div class="gift-add-item__card" data-code="5">
                                <img src="Content/Modules/TrinityHelp/icons/5.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Обувь</span>
                            </div>
                        </div>
                        <div class="gift-add-item__group" id="male">
                            <img src="Content/Modules/TrinityHelp/icons/man.png" class="gift-add-item__group-icon" title="Мужское" />
                            <div class="gift-add-item__card" data-code="18">
                                <img src="Content/Modules/TrinityHelp/icons/18.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Футболка</span>
                            </div>
                            <div class="gift-add-item__card" data-code="17">
                                <img src="Content/Modules/TrinityHelp/icons/17.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Рубашка</span>
                            </div>
                            <div class="gift-add-item__card" data-code="13">
                                <img src="Content/Modules/TrinityHelp/icons/13.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Свитер</span>
                            </div>
                            <div class="gift-add-item__card" data-code="16">
                                <img src="Content/Modules/TrinityHelp/icons/16.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Пиджак/костюм</span>
                            </div>
                            <div class="gift-add-item__card" data-code="14">
                                <img src="Content/Modules/TrinityHelp/icons/14.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Брюки</span>
                            </div>
                            <div class="gift-add-item__card" data-code="50">
                                <img src="Content/Modules/TrinityHelp/icons/50.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Ремни, пояса</span>
                            </div>
                            <div class="gift-add-item__card" data-code="11">
                                <img src="Content/Modules/TrinityHelp/icons/11.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Шапка, шарф</span>
                            </div>
                            <div class="gift-add-item__card" data-code="12">
                                <img src="Content/Modules/TrinityHelp/icons/12.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Верхнее</span>
                            </div>
                            <div class="gift-add-item__card" data-code="4">
                                <img src="Content/Modules/TrinityHelp/icons/4.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Домашняя</span>
                            </div>
                            <div class="gift-add-item__card" data-code="15">
                                <img src="Content/Modules/TrinityHelp/icons/15.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Обувь</span>
                            </div>
                            <div class="gift-add-item__card" data-code="64">
                                <img src="Content/Modules/TrinityHelp/icons/64.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Галстук</span>
                            </div>
                        </div>
                        <div class="gift-add-item__group" id="girl" title="Одежда девочки">
                            <img src="Content/Modules/TrinityHelp/icons/girl.png" class="gift-add-item__group-icon" />
                            <div class="gift-add-item__card" data-code="23">
                                <img src="Content/Modules/TrinityHelp/icons/23.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Блузка/ футболка</span>
                            </div>
                            <div class="gift-add-item__card" data-code="19">
                                <img src="Content/Modules/TrinityHelp/icons/19.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Свитер/ кофта</span>
                            </div>
                            <div class="gift-add-item__card" data-code="60">
                                <img src="Content/Modules/TrinityHelp/icons/60.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Жилет</span>
                            </div>
                            <div class="gift-add-item__card" data-code="26">
                                <img src="Content/Modules/TrinityHelp/icons/26.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Юбка</span>
                            </div>
                            <div class="gift-add-item__card" data-code="20">
                                <img src="Content/Modules/TrinityHelp/icons/20.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Платье</span>
                            </div>
                            <div class="gift-add-item__card" data-code="59">
                                <img src="Content/Modules/TrinityHelp/icons/59.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Костюм/комбинезон</span>
                            </div>
                            <div class="gift-add-item__card" data-code="41">
                                <img src="Content/Modules/TrinityHelp/icons/41.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Брюки</span>
                            </div>
                            <div class="gift-add-item__card" data-code="24">
                                <img src="Content/Modules/TrinityHelp/icons/24.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Шапка шарф</span>
                            </div>
                            <div class="gift-add-item__card" data-code="57">
                                <img src="Content/Modules/TrinityHelp/icons/57.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Колготки</span>
                            </div>
                            <div class="gift-add-item__card" data-code="25">
                                <img src="Content/Modules/TrinityHelp/icons/25.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Верхнее</span>
                            </div>
                            <div class="gift-add-item__card" data-code="21">
                                <img src="Content/Modules/TrinityHelp/icons/21.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Домашн.</span>
                            </div>
                            <div class="gift-add-item__card" data-code="61">
                                <img src="Content/Modules/TrinityHelp/icons/61.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Трусы/носки</span>
                            </div>
                            <div class="gift-add-item__card" data-code="22">
                                <img src="Content/Modules/TrinityHelp/icons/22.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Обувь</span>
                            </div>
                            <div class="gift-add-item__card" data-code="43">
                                <img src="Content/Modules/TrinityHelp/icons/43.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Игрушка</span>
                            </div>
                        </div>
                        <div class="gift-add-item__group" id="boy">
                            <img src="Content/Modules/TrinityHelp/icons/boy.png" class="gift-add-item__group-icon" title="Одежда мальчика"/>
                            <div class="gift-add-item__card" data-code="28">
                                <img src="Content/Modules/TrinityHelp/icons/28.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Майка </span>
                            </div>
                            <div class="gift-add-item__card" data-code="51">
                                <img src="Content/Modules/TrinityHelp/icons/51.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Рубашка</span>
                            </div>
                            <div class="gift-add-item__card" data-code="27">
                                <img src="Content/Modules/TrinityHelp/icons/27.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Свитер</span>
                            </div>
                            <div class="gift-add-item__card" data-code="52">
                                <img src="Content/Modules/TrinityHelp/icons/52.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Костюм жилет</span>
                            </div>
                            <div class="gift-add-item__card" data-code="55">
                                <img src="Content/Modules/TrinityHelp/icons/55.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Трусы, носки</span>
                            </div>
                            <div class="gift-add-item__card" data-code="56">
                                <img src="Content/Modules/TrinityHelp/icons/56.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Колготки</span>
                            </div>
                            <div class="gift-add-item__card" data-code="29">
                                <img src="Content/Modules/TrinityHelp/icons/29.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Брюки</span>
                            </div>
                            <div class="gift-add-item__card" data-code="31">
                                <img src="Content/Modules/TrinityHelp/icons/31.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Шапка шарф</span>
                            </div>
                            <div class="gift-add-item__card" data-code="32">
                                <img src="Content/Modules/TrinityHelp/icons/32.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Верхнее</span>
                            </div>
                            <div class="gift-add-item__card" data-code="30">
                                <img src="Content/Modules/TrinityHelp/icons/30.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Обувь</span>
                            </div>
                            <div class="gift-add-item__card" data-code="43">
                                <img src="Content/Modules/TrinityHelp/icons/43.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Игрушка</span>
                            </div>
                        </div>
                        <div class="gift-add-item__group" id="baby">
                            <img src="Content/Modules/TrinityHelp/icons/baby.png" class="gift-add-item__group-icon" title="Одежда младенца" />
                            <div class="gift-add-item__card" data-code="33">
                                <img src="Content/Modules/TrinityHelp/icons/33.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Боди</span>
                            </div>
                            <div class="gift-add-item__card" data-code="34">
                                <img src="Content/Modules/TrinityHelp/icons/34.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Футболка</span>
                            </div>
                            <div class="gift-add-item__card" data-code="53">
                                <img src="Content/Modules/TrinityHelp/icons/53.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Носочки/царапки</span>
                            </div>
                            <div class="gift-add-item__card" data-code="54">
                                <img src="Content/Modules/TrinityHelp/icons/54.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Колготки/ползунки</span>
                            </div>
                            <div class="gift-add-item__card" data-code="42">
                                <img src="Content/Modules/TrinityHelp/icons/42.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Свитер</span>
                            </div>
                            <div class="gift-add-item__card" data-code="38">
                                <img src="Content/Modules/TrinityHelp/icons/38.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Юбка</span>
                            </div>
                            <div class="gift-add-item__card" data-code="35">
                                <img src="Content/Modules/TrinityHelp/icons/35.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Брючки</span>
                            </div>
                            <div class="gift-add-item__card" data-code="37">
                                <img src="Content/Modules/TrinityHelp/icons/37.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Платье</span>
                            </div>
                            <div class="gift-add-item__card" data-code="39">
                                <img src="Content/Modules/TrinityHelp/icons/39.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Шапка шарф</span>
                            </div>
                            <div class="gift-add-item__card" data-code="40">
                                <img src="Content/Modules/TrinityHelp/icons/40.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Верхнее</span>
                            </div>
                            <div class="gift-add-item__card" data-code="36">
                                <img src="Content/Modules/TrinityHelp/icons/36.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Обувь</span>
                            </div>
                            <div class="gift-add-item__card" data-code="43">
                                <img src="Content/Modules/TrinityHelp/icons/43.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Игрушка</span>
                            </div>
                        </div>
                        <div class="gift-add-item__group" id="things">
                            <img src="Content/Modules/TrinityHelp/icons/things.png" class="gift-add-item__group-icon" title="Вещи" />
                            <div class="gift-add-item__card" data-code="45">
                                <img src="Content/Modules/TrinityHelp/icons/45.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Посуда</span>
                            </div>
                            <div class="gift-add-item__card" data-code="48">
                                <img src="Content/Modules/TrinityHelp/icons/48.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Быт. принадл.</span>
                            </div>
                            <div class="gift-add-item__card" data-code="44">
                                <img src="Content/Modules/TrinityHelp/icons/44.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Сумка/рюкзак</span>
                            </div>
                            <div class="gift-add-item__card" data-code="47">
                                <img src="Content/Modules/TrinityHelp/icons/47.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Аксессуары</span>
                            </div>
                            <div class="gift-add-item__card" data-code="58">
                                <img src="Content/Modules/TrinityHelp/icons/58.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Книга</span>
                            </div>
                            <div class="gift-add-item__card" data-code="65">
                                <img src="Content/Modules/TrinityHelp/icons/65.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Журнал/брошюра</span>
                            </div>
                            <div class="gift-add-item__card" data-code="63">
                                <img src="Content/Modules/TrinityHelp/icons/63.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Канцтов.</span>
                            </div>
                            <div class="gift-add-item__card" data-code="49">
                                <img src="Content/Modules/TrinityHelp/icons/49.png" class="gift-add-item__card-icon" />
                                <span class="gift-add-item__card-name">Другое</span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr class="gift-field">
                    <td class="gift-field-label"></td>
                    <td class="gift-field__input-container">
                        <button id="save" class="gift-save">Сохранить</button>
                    </td>
                </tr>
                <tr class="gift-field gift-number">
                    <td class="gift-field__label">Номер посещения: </td>
                    <td class="gift-field__input-container">
                        <input id="giftNumber" class="gift-add-item__input"></span>
                        <button id="loadGift" class="gift-add-item__button" >Загрузить</button>
                    </td>
                </tr>
            </div>
            <table class="gift-table">
                <tr class="gift-items-row">
                    <td colspan="4">
                        <ul id="giftItems" class="gift-items">
                            <template id="giftItemTemplate">
                                <li class="gift-item" >
                                    <span class="gift-item__id"></span>
                                    <span class="gift-item__person"></span>
                                    <span class="gift-item__name"></span>                
                                    <button class="gift-item__delete">x</button>
                                </li>
                            </template>
                        </ul>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <template id="addItemToast">
        <div class="add-item-toast">
            <div class="add-item-toast__person"></div>
            <img class="add-item-toast__image"></img>
            <span class="add-item-toast__text"></span>
            <a class="add-item-toast__cancel" >Отмена</a>
        </div>
    </template>
`