// MODAL
const modalTriggers = document.querySelectorAll('.popup-trigger');
const modalCloseTrigger = document.querySelectorAll('.popup-modal__close');
const modalButton = document.querySelectorAll('.popup-modal__finished');
const typedInput = document.getElementById("typedUtterance");
const skillPickerButton = document.querySelector('.btn--primary')
// const bodyBlackout = document.querySelector('.overlay')
const stepBody = document.querySelector('body')
const modalInput = document.querySelector('.modal-input');
const modalInterval = 400;
let micButton = document.querySelector('.mic--button');
let slider = document.querySelector('.swiper-wrapper')
let timerID;
let counter = 0;

let pressHoldEvent = new CustomEvent("pressHold");
let pressHoldDuration = 30;


function respondWithValue(value='yes'){
    postMessageHandler(message)
    return value
}

function wifiIsSet(message){
    var message = {"wifiSet":"yes"}
//    let message = {
//        "action_type": "event",
//        "module": "NewUser",
//        "method": "wifiSet",
//        "handler": ""
//    };
    postMessageHandler(message)
}

function startRecording() {
    var message = {
        "action_type": "event",
        "module": "SpeechRecognizer",
        "method": "",
        "name" : "recording",
        "handler": "",
        "args" : "yes"
    };
    postMessageHandler(message)
}

function stopRecording(){
    var message = {
        "action_type": "event",
        "module": "SpeechRecognizer",
        "method": "",
        "name" : "recording",
        "handler": "",
        "args" : "no"
    };
    postMessageHandler(message)
}

function skillButtonPicked(message){
    let val = document.querySelector('input[type="radio"]:checked').value;
    var message = {"skillpickerValue":val}
//    let message = {
//        "action_type": "event",
//        "module": "NewUser",
//        "method": "updateSkillLevel",
//        "handler": "",
//        "args": val
//    };
//    postMessageHandler(message)
    postMessageHandler(message)
}

var mySwiper = null;

if(typeof Swiper !== 'undefined'){
  mySwiper = new Swiper('.swiper-container', {
     // Optional parameters
     direction: 'vertical',
     loop: true,
     simulateTouch: false,
     noSwiping: true,
     allowTouchMove: false,
     spaceBetween: 10,
     slidesPerView: 3,
     centeredSlides: false,
     speed: 2000,
     preventInteractionOnTransition: true,
     watchSlidesVisibility: true,
     loopPreventsSlide: false,
     autoplay: {
         delay: 3000
     }

   });
}

typedInput && typedInput.addEventListener('keydown', function(event) {
    // ignore IME input
    if (event.isComposing || event.keyCode === 229) {
        return;
    }

    if (event.key === 'Enter') {
        event.preventDefault();
        submitUtterance();
    }
    return false;
});

typedInput && typedInput.addEventListener('compositionend', function(event) {
    if (event.data.endsWith('\n') || /\r|\n/.exec(typedInput.value)) {
        event.preventDefault();
        submitUtterance();
    }
});

function submitUtterance() {
      var textInput = document.getElementById('typedUtterance');
      var text = textInput.value.replace(/\n/g, " ").trim();
      textInput.blur();
      if (text != "") {
          setTimeout(() => {
            var message = { inputMessage: text };
            postMessageHandler(message);
          }, 100);
      }
}

if(modalTriggers){
  //Find and loop each button/trigger for a modal
  modalTriggers.forEach(function (trigger, i) {

      //Set the data-attribute for modals
      let popupModals = document.querySelectorAll('.popup-modal');

      //Loop each modal and set data attribute to equal that of its trigger
      popupModals.forEach(function (popupModal, i) {
          popupModal.setAttribute("data-popup-modal", `${i}`);
      });

      //When clicked show modal and add class to body
      trigger.addEventListener('click', () => {
          // const { popupTrigger } = trigger.dataset

          const popupModal = document.querySelector(`[data-popup-modal="${i}"]`);
          stepBody.classList.add('modal-active');

          popupModal.classList.add('is--visible');

          modalCloseTrigger.forEach((modalCloseTriggerItem) => {
              modalCloseTriggerItem.addEventListener('click', () => {
                  stepBody.classList.remove('modal-active');
                  popupModal.classList.remove('is--visible')
              })
          })


          //Add finished class to corresponding checklist item and increase width of progress element
          modalButton.forEach((modalButtonItem, i) => {
              modalButtonItem.addEventListener('click', () => {
                  let checklistItem = document.querySelector(`.list--checklist__item--${i}`),
                      checklistInput = checklistItem.querySelector('.input--checklist__input');

                  checklistItem.classList.add('finished');

                  if (checklistInput.checked == false) {
                      checklistInput.checked = true;
                      width += checklistProgressInterval;
                      checklistProgressBar.style.transform = `scaleX(${width})`;
                  }
              })
          })

          if (modalInput) {
             setTimeout(() => {
                 modalInput.focus()
             }, modalInterval);
          }
      })
  })
}

if(modalInput){
  modalInput.addEventListener('focus', function(){
    window.scrollTo(0, 0);
      document.body.scrollTop = 0;
  })
}

if(micButton){
  micButton.addEventListener("mousedown", pressingDown, false);
  micButton.addEventListener("mouseup", notPressingDown, false);
  micButton.addEventListener("mouseleave", notPressingDown, false);

  micButton.addEventListener("touchstart", pressingDown, false);
  micButton.addEventListener("touchend", notPressingDown, false);

  // Listening for our custom pressHold event
  micButton.addEventListener("pressHold", doSomething, false);
}

function pressingDown(e) {
    // Start the timer
    requestAnimationFrame(timer);
    e.preventDefault();
    startRecording()
}

function notPressingDown(e) {
    // Stop the timer
    cancelAnimationFrame(timerID);
    counter = 0;
    stopRecording()
    notListening()
}

function notListening() {
    document.querySelector('.body-container').classList.remove('listening');
    setTimeout(() => {
        mySwiper.autoplay.start();
    }, 3500);
}

//
// Runs at 60fps when you are pressing down
//
function timer() {
    if (counter < pressHoldDuration) {
        timerID = requestAnimationFrame(timer);
        counter++;
    } else {
        let slide = mySwiper.realIndex + 1;
        micButton.dispatchEvent(pressHoldEvent);
        document.querySelector('.body-container').classList.add('listening');
        mySwiper.autoplay.stop();
    }
}

function doSomething(e) {
    //console.log("pressHold event fired!");
}

function closeInteractionPopup(){
    setTimeout(() => {
       document.getElementById('keyboardClose').click();
    },500);
}
var utteranceBack = document.querySelector('#utteranceBack');
if(utteranceBack){
  utteranceBack.addEventListener('click', function(){
      notListening();
  })
}


//Handle logging out
function logout(message){
    var message = {"dialog_response":"logout"}
    postMessageHandler(message)
}

//reload login webview when server down
function reload(){
    var message = {"dialog_response":"reload"}
    postMessageHandler(message)
}

function callScreenAction(actionName, url) {
  let message = {
    action_type: "event",
    module: "HostApp",
    name: actionName,
    args: url,
  };
  postMessageHandler(message);
}

//location permission html button press
function grantPermission() {
    var message = {"dialog_response":"location"}
    postMessageHandler(message)
}

if(typeof MicroModal !== 'undefined'){
  //Init popover for Utterance page
  MicroModal.init({
      awaitCloseAnimation: true,
  });
}

function postMessageHandler(message) {
    if (window.webkit && window.webkit.messageHandlers && typeof window.webkit.messageHandlers.SweeprNative !== 'undefined') {
        window.webkit.messageHandlers.SweeprNative.postMessage(message);
    }
    if (typeof JSInterface !== 'undefined') {
        JSInterface.postMessage(JSON.stringify(message));
    }
}

// Remote utterances
let remoteUtterances = [];

function registerForUtteranceUpdates() {
    console.log ('Registering for utterances events')

    let registration = {
        "action_type": "callback",
        "module": "utterances",
        "event": "changed",
        "handler": "setUtterances"
    };
    postMessageHandler(registration)
}

function setUtterances(remoteUtterances = '') {
    if (!remoteUtterances || typeof Swiper === 'undefined' || !document) return "";
    let remoteUtterancesContainer = document.querySelector('.utterance--carousel .swiper-wrapper');
    let remoteUtterancesElements = JSON.parse(remoteUtterances).map(utterance => `<div class='swiper-slide utterance--carousel__item'>${utterance}</div>`);

    if(!remoteUtterancesContainer) return "";

    remoteUtterancesContainer.innerHTML = "";
    remoteUtterancesElements.forEach(element => remoteUtterancesContainer.innerHTML += element)

    return new Swiper('.utterance--carousel', {
        loop: false,
        speed: 1000,
        slidesPerView: remoteUtterancesElements.length,
        centeredSlides: true,
        touchRatio: 0.1,
        iOSEdgeSwipeDetection: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        }
    });
}
registerForUtteranceUpdates();
getUISettings();

// Invoke
function getUISettings() {
    let message = {
        "action_type": "call",
        "module": "settings",
        "method": "check_show_menu",
        "handler": "createNavigation"
    };
    postMessageHandler(message)
  }
  // App navigation
  function createNavigation(shouldShow) {
    if(shouldShow === "false") return;
    const appContainer = document.getElementById('application');
    if (!appContainer) return;
    const appHeader = document.getElementById('appHeader');
    const appContainerChildren = appContainer.children[0];
    const appHeaderChildren = appHeader.children[1];

    let appNavigation = document.createElement("nav");
    let appMenuButton = document.createElement('button')

    appNavigation.setAttribute('id', 'menu')
    appNavigation.innerHTML = `
        <nav id="menu">
            <ul class="list-nav">
                <li>
                    <button onclick="logout()" id="logoutButton" class="list-nav--item">
                        <svg class="mr-2" width="32" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".5" fill-rule="evenodd" clip-rule="evenodd" d="M20.019 1.972a.864.864 0 01.61-.234c.223 0 .436.074.638.209l.017.01 9.696 9.638.01.017c.135.202.21.415.21.638a.934.934 0 01-.058.353.756.756 0 01-.176.257l-9.668 9.668a.864.864 0 01-.61.235c-.264 0-.513-.067-.682-.306l-.384-.384a.682.682 0 01-.234-.256.804.804 0 01-.072-.368c0-.23.08-.456.293-.669l7.39-7.334h-15.92c-.266 0-.502-.066-.67-.234-.168-.168-.234-.404-.234-.669v-.586c0-.215.071-.447.234-.61a.942.942 0 01.67-.293h15.92l-7.377-7.321c-.24-.17-.306-.419-.306-.682 0-.215.072-.455.3-.62l.403-.46zm-18.34-.293A2.893 2.893 0 013.813.8h7.734c.255 0 .48.163.61.293.13.13.293.355.293.61v.469c0 .306-.154.53-.293.669a.864.864 0 01-.61.234H3.813a.77.77 0 00-.562.234c-.125.125-.176.3-.176.504v16.874c0 .27.054.44.176.562.122.122.293.176.562.176h7.734c.255 0 .48.163.61.293.13.13.293.355.293.61v.469c0 .306-.154.53-.293.669a.864.864 0 01-.61.234H3.813c-.862 0-1.563-.248-2.134-.879-.63-.57-.879-1.272-.879-2.134V3.814c0-.812.253-1.508.879-2.134z" fill="currentColor" /></svg>
                        Sign out
                    </button>
                </li>
                <li class="app-version">
                  <small id="appVersion"></small>
                  <small id="appInfo"></small>
                </li>
            </ul>
        </nav>`;

    appMenuButton.setAttribute('class', 'btn btn--toggle')
    appMenuButton.innerHTML = `
        <svg width="25" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M25 2H0V0h25v2zM17.386 11H0V9h17.386v2zM25 20H0v-2h25v2z"
                fill="#fff"></path>
        </svg>`;

    appContainerChildren.insertAdjacentElement("beforebegin", appNavigation);
    appHeaderChildren.insertAdjacentElement("beforebegin", appMenuButton);

    // JS for slideout menu on Utterance page
    let menuToggle = document.querySelector('.btn--toggle');

    if (menuToggle) {
        var slideout = new Slideout({
            'panel': document.getElementById('panel'),
            'menu': document.getElementById('menu'),
            'padding': 256,
            'tolerance': 70
        });

        // Toggle button
        menuToggle.addEventListener('click', function () {
            slideout.toggle()
        })
    }

    getVersion();
    subscribeForUserInfo();
  }

  function getVersion() {
    let message = {
        "action_type": "call",
        "module": "settings",
        "method": "get_app_version",
        "handler": "setVersion"
    };
    postMessageHandler(message);
  }

  function subscribeForUserInfo() {
    let message = {
        "action_type": "callback",
        "module": "session",
        "event": "get_user_info",
        "handler": "setAppInfo"
    };
    postMessageHandler(message);
  }

  function setVersion(version = 'n/a') {
    const appVersionContainer = document.getElementById('appVersion')
    if (appVersionContainer) {
        appVersionContainer.innerHTML = `${version}`;
    }
  }

  function setAppInfo(info = '') {
    const appVersionContainer = document.getElementById('appInfo')
    if (appVersionContainer) {
        appVersionContainer.innerHTML = `${info}`;
    }
  }

  function setSSID(ssid) {
    console.log("My ssid is ", ssid);
    var element = document.getElementById("networkName")
    if(element){
      element.innerHTML = ssid;
    }
  }

  function setSSIDMainScreen(ssid) {
    console.log("setSSID");
    var element = document.getElementById("networkSSID")
    if(element){
      element.innerHTML = ssid;
    }
  }
