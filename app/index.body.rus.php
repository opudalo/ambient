<div class="b-head">

  <div class="b-logo"><a href="/"><img src="img/logo.png" alt="Ambient Acoustics" /></a></div>
  <ol class="b-nav">
    <li class="b-nav-item"
    ng-repeat="m in ['Модель','Цвет','Вставки','Рисунки','Провода','Другое','Доставка']"
    ng-class="{active : $index == step - 1}"
    ng-click="setStep($index + 1)"
    >{{m}}</li>
  </ol>
</div>
<div class="b-construct" data-current="s1">
  <div class="b-step s1" ng-show="step == 1">
    <div class="b-models-list">
      <div ng-repeat="m in steps.model.list"
        ng-click="setModel($index)" 
        ng-class="{active: steps.model.active.id == $index }">
        {{m.name}}
        <span class="sub">{{m.subname}}</span>
      </div>
    </div>

    <div class="b-models-description">
      <div class="model-intro" ng-show="steps.model.active.id == null">
        <div class="wrap">
          <div class="header">Добро пожаловать в помощник<br/>подбора ушных мониторов</div>
          <div class="description">
            Для начала выберите одну из моделей<br/>мониторов слева и нажмите<br/>кнопку "Выбрать"
          </div>
        </div>
      </div>
      <div class="model"
        ng-repeat="m in steps.model.list"
        ng-class="{active: steps.model.active.id == $index }">
        <div class="model-head">
          <div class="col1">
            <img ng-src="img/{{m.img}}" />
          </div>
          <div class="col2">
            <div class="header" ng-bind-html="html(m.title)">{{m.title}}</div>
            <div class="pricing">
              <span class="b-btn btn-select" ng-click="confirmModel($index)">Выбрать</span>
              {{m.price}}$
            </div>
          </div>
        </div>
        <div class="model-description">
          <div class="col1" ng-bind-html="html(m.description)">{{m.description}}</div>
          <div class="col2">
            <div class="specs-title">Характеристики:</div>
            <div class="specs" ng-repeat="s in m.specs">{{s}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="b-step s2" ng-show="step > 1">
    <div class="col1">
      <div class="switcher-wrap" ng-show="step < 7" ng-class="{hidden: step > 5 || ((step == 5) && steps.model.active.custom && steps.cordSelector.active == 'old')}">

        <div class="switcher">
          <div ng-click="setSame(true)" ng-class="{active: same}">одинаковые</div>
          <div ng-click="setSame(false)" ng-class="{active: !same}">разные</div>
        </div>
      </div>
      <div class="ears" ng-show="step < 7">
        <div class="ear {{orient}}" ng-repeat="orient in ['left', 'right']">

          <div class="ear-layer {{c.name}}"
            ng-repeat="c in [steps.base, steps.cover, steps.chanel]"
            >
            <img class="first"
            ng-src="i/{{c.list[c.active[orient].id].url}}"
            ng-show="maxStepComplete > 1"
            />
          </div>
          <div class="ear-layer {{c.name}}"
            ng-repeat="c in [steps.cap]"
            >
            <img class="first"
            ng-src="i/{{c.list[c.active[orient].id].url}}"
            ng-show="maxStepComplete > 2"
            />
          </div>
          <div ng-show="maxStepComplete > 3"
            class="canva-cont"
            ng-class="{active: step == 4}"
            >
              <canvas id="canvas{{orient}}" width="360" height="300" class="cnv"></canvas>
          </div>
          <div class="ear-layer {{c.name}}"
            ng-show="steps.cordSelector.active != 'old'"
            ng-repeat="c in [steps.pin]"
            >
            <img class="first"
            ng-src="i/{{c.list[c.active[orient].id].url}}"
            ng-show="maxStepComplete > 4"
            />
          </div>
          <div class="ear-layer {{c.name}}"
            ng-show="steps.cordSelector.active != 'old'"
            ng-repeat="c in [steps.cord]"
            >
            <img class="first"
            ng-src="i/{{c.list[c.active[orient].id].url}}"
            ng-show="maxStepComplete > 4"
            />
          </div>
        </div>
      </div>

      <script type="text/ng-template" id="selector">
          <div class="selector" ng-class="{same: same}" data-type="{{sel.name}}"> 
              <div class="selector-title">{{sel.title}}</div>
              <div class="selector-items {{orient}}" ng-repeat="orient in ['left', 'right']">
                  <div class="selector-item"
                      ng-repeat="i in sel.list"
                      ng-class="{active: sel.active[orient].id == $index}"
                      ng-click="select(orient, sel.name, $index)"
                      data-tooltip="{{i.name}}"
                      data-tooltip-position="top"
                      style="background-image: url({{'i/' + i.url}})"></div>
              </div>
          </div>
      </script>

      <script type="text/ng-template" id="graphics">
        <div class="selector" ng-class="{same: same}" data-type="{{sel.name}}"> 
          <div class="selector-title">{{sel.title}}
              <div class="add-own">
                  <input type="file"
                    file-input="cap.frontImg"
                    />
                  + добавить рисунок  
              </div>
          </div>
            <div class="selector-items {{orient}}" ng-repeat="orient in ['left', 'right']">
                <div class="selector-item"
                    ng-repeat="i in sel.list"
                    ng-class="{active: sel.active[orient].id == $index}"
                    ng-click="graphics(orient, sel.name, $index)"
                    data-tooltip="{{i.name}}"
                    data-tooltip-position="top"
                    style="background-image: url({{i.url}}); background-size: 48px;"></div>
            </div>
        </div>
      </script>

      <div class="controls" ng-show="step < 7">
        <div ng-repeat="sel in [steps.base, steps.cover, steps.chanel]"
          ng-show="step == 2"
          ng-include="'selector'">
        </div>

        <div ng-repeat="sel in [steps.cap]"
          ng-show="step == 3"
          ng-include="'selector'">
        </div>

        <div ng-repeat="sel in [steps.graphics]"
          ng-show="step == 4"
          ng-include="'graphics'">
        </div>

        <div ng-show="step == 5">
          <div class="misc misc__custom" ng-show="steps.model.active.custom">
            <div class="misc-row">
              <div class="misc-col1">
                <div class="selector-radio">
                  <div>
                    <input type="radio"
                    ng-model="steps.cordSelector.active"
                    ng-change="aaCordSelector()"
                    value="old" />

                    <label>Оставить старый провод и разъемы в мониторах (без доплат)</label> 
                  </div>
                  <div>
                    <input type="radio"
                    ng-model="steps.cordSelector.active"
                    ng-change="aaCordSelector()"
                    value="change"
                    />
                    <label>Замена разъемов в мониторах + установка новых на комплектный провод (30$)</label>
                  </div>
                  <div>
                    <input type="radio" 
                    ng-model="steps.cordSelector.active"
                    ng-change="aaCordSelector()"
                    value="AA" />
                    <label>Замена разъемов в мониторах + кастомный провод Аmbient Acoustics (60$)</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ng-repeat="sel in [steps.pin]"
            ng-show="steps.cordSelector.active != 'old'"
            ng-include="'selector'">
          </div>

          <div ng-show="steps.cordSelector.active == 'AA'">
            <div class="cord-table">
              <div class="cord-col1">
                <div class="selector jack-selector">
                  <div class="selector-title">Тип джека</div>
                  <div class="selector-radio">
                    <label for="angle"><img src="i/7-1.png"></label> 
                    <input type="radio" ng-model="steps.jack.active" ng-value="steps.jack.angle" />

                    <label for="straight"><img src="i/7-2.png"></label>
                    <input type="radio" ng-model="steps.jack.active" ng-value="steps.jack.straight" />
                  </div>
                </div>
              </div>
              <div class="cord-col2">
                <div ng-repeat="sel in [steps.cord]"
                  ng-include="'selector'">
                </div>
              </div>
              <div class="cord-col3">
                <div class="selector cord-selector">
                  <div class="selector-title">Длина провода</div>
                  <div class="selector-radio">
                    <div>
                      <input type="radio" ng-model="steps.cordLength.active" value="small" />
                      <label for="l100">100 см <img src="i/8-1.png"></label> 
                    </div>
                    <div>
                      <input type="radio" ng-model="steps.cordLength.active" value="medium" />
                      <label for="l130">130 см <img src="i/8-2.png"></label>
                    </div>
                    <div>
                      <input type="radio" ng-model="steps.cordLength.active" value="large" />
                      <label for="l160">160 см <img src="i/8-3.png"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div ng-show="step == 6">
        <div class="misc">
          <div class="misc-row">
            <div class="misc-col1">

              <label>
                <input type="checkbox" ng-model="steps.engraving.active">Гравировка кейса
              </label>
              <div class="misc-desc" ng-show="steps.engraving.active">
                <input type="text" placeholder="Введите текст гравировки" ng-model="steps.engraving.text">
              </div>
            </div>
            <div class="misc-col2">
              <label>
                <input type="checkbox" ng-model="steps.ventilation.active">Сквозная вентиляция
              </label>
              <div class="misc-desc">
                Уменьшаяет звукоизоляцию до такого уровня, что остается базовая коммуникация с залом.
              </div>
            </div>
            <div class="misc-col3">
              <label>
                <input type="checkbox" ng-model="steps.filterSulfur.active">Установка серных фильтров
              </label>
              <div class="misc-desc">
                Используют чтобы сера и влага не попадала внутрь мониторов.
              </div>
            </div>
          </div>
          <div class="misc-row" ng-show="steps.model.active.custom">
            <div class="misc-col1">
              <label>
                <input type="checkbox" ng-model="steps.namedCase.active">Именной влагозащитный кейс
              </label>
            </div>
            <div class="misc-col2">
              <label>
                <input type="checkbox" ng-model="steps.sulfurStick.active">Присбособление для извлечения серы и грязи
              </label>
            </div>
            <div class="misc-col3">
              <label>
                <input type="checkbox" ng-model="steps.drierCapsule.active">Осушающая капсула
              </label>
            </div>
          </div>
          <div class="misc-row" ng-show="steps.model.active.custom">
            <div class="misc-col1">
              <label>
                <input type="checkbox" ng-model="steps.fabricCase.active">Тканевый чехол
              </label>
            </div>
          </div>
        </div>
      </div>


      <div class="shipping" ng-show="step == 7">
        <div class="header">Адрес доставки</div>

        <form ng-submit="submit()">
          <div class="shipping-form">
            <label data-hint="Инициалы будут отпечатаны
              на крышке кейса">
              Инициалы
              <input type="text" ng-model="steps.customer.userName"/>
            </label>
            <label>
              Имейл
              <input type="text" ng-model="steps.customer.email"/>
            </label>
            <label>
              Фамилия
              <input type="text" ng-model="steps.customer.surname"/>
            </label>
            <label>
              Имя
              <input type="text" ng-model="steps.customer.name"/>
            </label>
            <label>
              Отчество
              <input type="text" ng-model="steps.customer.secondName"/>
            </label>
            <label>
              Артист/Группа
              <input type="text" ng-model="steps.customer.artist"/>
            </label>
            <label data-hint1="Улица, дом, квартира">
              Адрес
              <input type="text" ng-model="steps.customer.address"/>
            </label>
            <label>
              Город
              <input type="text" ng-model="steps.customer.city"/>
            </label>
            <label>
              Страна
              <input type="text" ng-model="steps.customer.country"/>
            </label>
            <label>
              <span>Почтовый индекс</span>
              <input type="text" ng-model="steps.customer.zip"/>
            </label>
            <label>
              Телефон
              <input type="text" ng-model="steps.customer.phone"/>
            </label>
            <label>
              Примечания
              <textarea ng-model="steps.customer.misc"></textarea>
            </label>

            <div class="btn-submit">
              <button type="submit" class="submit b-btn">Отправить заказ</button>
            </div>
          </div>
        </form>

      </div>




    </div>
    <div class="col2">
      <div class="continue">
        <span class="b-btn btn-back"
          ng-click="prevStep()"
          ng-class="{ one: step == 7}"
          >
          Назад
        </span>
        <span class="b-btn btn-continue"
          ng-click="nextStep()"
          ng-show="step < 7"
          >
          Продолжить
        </span>
      </div>
      <div class="total">
        <div class="header">
          <div class="title">Общая стоимость</div>
          <div class="price">{{ totalPrice() }}$</div>
        </div>
        <div class="details">
          <div class="details-row">
            <div class="value">{{ [steps.model.active.name, steps.model.active.subname].join(' ')}}</div>
            <div class="price">{{ steps.model.active.price }}$</div>
          </div>

          <script type="text/ng-template" id="summary-row">
<div class="value">
                                    {{ steps[i].title }}
                                    <div class="hint">{{ getSelItem(i) }}</div>
                                </div>
                                <div ng-if="steps[i].active.price" class="price">{{ steps[i].active.price }}$</div>
          </script>
          <div class="details-row" ng-repeat="i in ['base', 'cover', 'chanel']"
            ng-show="maxStepComplete > 1"
            ng-include="'summary-row'"
            ></div>

          <div class="details-row" ng-repeat="i in ['cap']"
            ng-show="maxStepComplete > 2"
            ng-include="'summary-row'"
            ></div>

          <div class="details-row" ng-repeat="i in ['graphics']"
            ng-show="maxStepComplete > 3"
            ng-include="'summary-row'"
            ></div>

          <div class="details-row" ng-show="steps.model.active.custom && steps.cordSelector.active != 'old'">
            <div class="value"
              ng-show="steps.cordSelector.active == 'change'">
              Замена разъемов либо установка новых
            </div>
            <div class="value"
              ng-show="steps.cordSelector.active == 'AA'">
              Провод Ambient Acoustics
            </div>
            <div class="price">{{ steps.cordSelector[steps.cordSelector.active].price }}$</div>
          </div>

          <div class="details-row" ng-repeat="i in ['pin']"
            ng-show="(maxStepComplete > 4) && steps.cordSelector.active != 'old'"
            ng-include="'summary-row'"
            ></div>

          <div class="details-row" ng-repeat="i in ['cord']"
            ng-show="(maxStepComplete > 4) && (steps.cordSelector.active == 'AA')"
            ng-include="'summary-row'"
            ></div>


          <div class="details-row"
            ng-show="(maxStepComplete > 4) && (steps.cordSelector.active == 'AA')"
            >
            <div class="value">
              Тип джека
              <div class="hint">{{ steps.jack.active }}</div>
            </div>
          </div>

          <div class="details-row"
            ng-show="(maxStepComplete > 4) && (steps.cordSelector.active == 'AA')"
            >
            <div class="value">
              Длина провода
              <div class="hint">{{ steps.cordLength[steps.cordLength.active].name }}</div>
            </div>
            <div ng-if="steps.cordLength[steps.cordLength.active].price" class="price">{{ steps.cordLength[steps.cordLength.active].price }}$</div>
          </div>

          <div class="details-row"
            ng-show="steps.engraving.active && steps.engraving.text.length > 0">
            <div class="value">
              Гравировка кейса
              <div class="hint">{{ steps.engraving.text }}</div>
            </div>
            <div ng-if="steps.engraving.text != ''" class="price">{{ steps.engraving.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.ventilation.active">
            <div class="value">
              Сквозная вентиляция
            </div>
            <div class="price">{{ steps.ventilation.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.filterSulfur.active">
            <div class="value">
              Установка серных фильтров
            </div>
            <div class="price">{{ steps.filterSulfur.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.model.active.custom && steps.namedCase.active">
            <div class="value">
              Именной влагозащитный кейс
            </div>
            <div class="price">{{ steps.namedCase.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.model.active.custom && steps.sulfurStick.active">
            <div class="value">
              Присбособление для извлечения серы и грязи
            </div>
            <div class="price">{{ steps.sulfurStick.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.model.active.custom && steps.drierCapsule.active">
            <div class="value">
              Осушающая капсула
            </div>
            <div class="price">{{ steps.drierCapsule.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.model.active.custom && steps.fabricCase.active">
            <div class="value">
              Тканевый чехол
            </div>
            <div class="price">{{ steps.fabricCase.price }}$</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
