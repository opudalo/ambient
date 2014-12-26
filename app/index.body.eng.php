<div class="b-head">

  <div class="b-logo"><a href="/"><img src="img/logo.png" alt="Ambient Acoustics" /></a></div>
  <ol class="b-nav">
    <li class="b-nav-item"
    ng-repeat="m in ['MODEL','DESIGN','FACEPLATES','ARTWORK','CORD','OPTIONS','DELIVERY']"
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
          <div class="header">Welcome <br/>to Ambient Acoustics <br/> Custom IEM designer</div>
          <div class="description">
             Please select your custom IEM model   
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
              <span class="b-btn btn-select" ng-click="confirmModel($index)">Next</span>
              {{m.price}}$
            </div>
          </div>
        </div>
        <div class="model-description">
          <div class="col1" ng-bind-html="html(m.description)">{{m.description}}</div>
          <div class="col2">
            <div class="specs-title"> SPECS.:</div>
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
          <div ng-click="setSame(true)" ng-class="{active: same}">Same</div>
          <div ng-click="setSame(false)" ng-class="{active: !same}">Different</div>
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
                  + add picture
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

                    <label>Leave cord and plugs (free)</label> 
                  </div>
                  <div>
                    <input type="radio"
                    ng-model="steps.cordSelector.active"
                    ng-change="aaCordSelector()"
                    value="change"
                    />
                    <label>Plugs replacement(30$)</label>
                  </div>
                  <div>
                    <input type="radio" 
                    ng-model="steps.cordSelector.active"
                    ng-change="aaCordSelector()"
                    value="AA" />
                    <label>Plugs replacement + Ambient cord 60$)</label>
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
                  <div class="selector-title">Type of 3,5 plug</div>
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
                  <div class="selector-title">Cord length</div>
                  <div class="selector-radio">
                    <div>
                      <input type="radio" ng-model="steps.cordLength.active" value="small" />
                      <label for="l100">100 sm <img src="i/8-1.png"></label> 
                    </div>
                    <div>
                      <input type="radio" ng-model="steps.cordLength.active" value="medium" />
                      <label for="l130">130 sm <img src="i/8-2.png"></label>
                    </div>
                    <div>
                      <input type="radio" ng-model="steps.cordLength.active" value="large" />
                      <label for="l160">160 sm <img src="i/8-3.png"></label>
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
                <input type="checkbox" ng-model="steps.engraving.active">Case engraving (inside foam)
              </label>
              <div class="misc-desc" ng-show="steps.engraving.active">
                <input type="text" placeholder="Engraving text" ng-model="steps.engraving.text">
              </div>
            </div>
            <div class="misc-col2">
              <label>
                <input type="checkbox" ng-model="steps.ventilation.active">Ambient port
              </label>
              <div class="misc-desc">
                Ambient ports allows you to hear ambient sounds (will decrease low frequencies!)  
              </div>
            </div>
            <div class="misc-col3">
              <label>
                <input type="checkbox" ng-model="steps.filterSulfur.active">Waxguard filters
              </label>
              <div class="misc-desc">
                Prevent IEMs sound bores from durt and sulfur 
              </div>
            </div>
          </div>
          <div class="misc-row" ng-show="steps.model.active.custom">
            <div class="misc-col1">
              <label>
                <input type="checkbox" ng-model="steps.namedCase.active">Personalized waterproof case
              </label>
            </div>
            <div class="misc-col2">
              <label>
                <input type="checkbox" ng-model="steps.sulfurStick.active">IEM wax tool removal
              </label>
            </div>
            <div class="misc-col3">
              <label>
                <input type="checkbox" ng-model="steps.drierCapsule.active">Dehumidifier capsule 
              </label>
            </div>
          </div>
          <div class="misc-row" ng-show="steps.model.active.custom">
            <div class="misc-col1">
              <label>
                <input type="checkbox" ng-model="steps.fabricCase.active">Fabric cover
              </label>
            </div>
          </div>
        </div>
      </div>


      <div class="shipping" ng-show="step == 7">
        <div class="header">Delivery  </div>

        <form ng-submit="submit()">
          <div class="shipping-form">
            <label data-hint="Initials will be engrave on case faceplate">
              Initials
              <input type="text" ng-model="steps.customer.userName"/>
            </label>
            <label>
              Email
              <input type="text" ng-model="steps.customer.email"/>
            </label>
            <label>
              Surname
              <input type="text" ng-model="steps.customer.surname"/>
            </label>
            <label>
              Name
              <input type="text" ng-model="steps.customer.name"/>
            </label>
            <label>
            
            <label>
             Artist 
              <input type="text" ng-model="steps.customer.artist"/>
            </label>
            <label data-hint1="Street, house, appartment">
             Delivery address
              <input type="text" ng-model="steps.customer.address"/>
            </label>
            <label>
             City
              <input type="text" ng-model="steps.customer.city"/>
            </label>
            <label>
              Country
              <input type="text" ng-model="steps.customer.country"/>
            </label>
            <label>
              <span>Postal code</span>
              <input type="text" ng-model="steps.customer.zip"/>
            </label>
            <label>
              Phone numder
              <input type="text" ng-model="steps.customer.phone"/>
            </label>
            <label>
              Notes
              <textarea ng-model="steps.customer.misc"></textarea>
            </label>

            <div class="btn-submit">
              <button type="submit" class="submit b-btn">Print spec</button>
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
          back
        </span>
        <span class="b-btn btn-continue"
          ng-click="nextStep()"
          ng-show="step < 7"
          >
          next
        </span>
      </div>
      <div class="total">
        <div class="header">
          <div class="title">Total</div>
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
              Plugs replacement or installation new ones
            </div>
            <div class="value"
              ng-show="steps.cordSelector.active == 'AA'">
              Ambient Acoustics cord
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
              Type 3,5 plug
              <div class="hint">{{ steps.jack.active }}</div>
            </div>
          </div>

          <div class="details-row"
            ng-show="(maxStepComplete > 4) && (steps.cordSelector.active == 'AA')"
            >
            <div class="value">
              cord lenght
              <div class="hint">{{ steps.cordLength[steps.cordLength.active].name }}</div>
            </div>
            <div ng-if="steps.cordLength[steps.cordLength.active].price" class="price">{{ steps.cordLength[steps.cordLength.active].price }}$</div>
          </div>

          <div class="details-row"
            ng-show="steps.engraving.active && steps.engraving.text.length > 0">
            <div class="value">
              Case engraving (inside foam)
              <div class="hint">{{ steps.engraving.text }}</div>
            </div>
            <div ng-if="steps.engraving.text != ''" class="price">{{ steps.engraving.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.ventilation.active">
            <div class="value">
             Ambient port
            </div>
            <div class="price">{{ steps.ventilation.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.filterSulfur.active">
            <div class="value">
              Waxguards filters
            </div>
            <div class="price">{{ steps.filterSulfur.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.model.active.custom && steps.namedCase.active">
            <div class="value">
              Personalized waterproof case
            </div>
            <div class="price">{{ steps.namedCase.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.model.active.custom && steps.sulfurStick.active">
            <div class="value">
              IEM wax tool removal
            </div>
            <div class="price">{{ steps.sulfurStick.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.model.active.custom && steps.drierCapsule.active">
            <div class="value">
             Dehumidifier capsule
            </div>
            <div class="price">{{ steps.drierCapsule.price }}$</div>
          </div>

          <div class="details-row" ng-show="steps.model.active.custom && steps.fabricCase.active">
            <div class="value">
              Fabric cover
            </div>
            <div class="price">{{ steps.fabricCase.price }}$</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
