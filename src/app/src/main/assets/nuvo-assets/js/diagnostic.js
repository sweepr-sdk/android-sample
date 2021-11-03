//var meta = document.createElement('meta');
//                              meta.setAttribute('name', 'viewport');
//                              meta.setAttribute('content', 'width=device-width,shrink-to-fit=YES');
//                              meta.setAttribute('initial-scale', '1.0');
//                              document.getElementsByTagName('head')[0].appendChild(meta);

function primaryButtonClicked(message){
    var message = {"dialog_response":"yes"}
    postMessageHandler(message)
    return "yes"
}

function setBody(newValue) {
    var bodyDiv = document.getElementById("container");
    bodyDiv.innerHTML = newValue;
}

function respondWithValue(value){
    postMessageHandler(message)
    return value
}

function dialogResponseWithValue(value){
    var message = {"dialog_response":value}
    postMessageHandler(message)
    return value
}


function deviceRepondWithValue(value){
    var message = {"dialog_response":"yes"}
    message["device_response"] = value
    postMessageHandler(message)
    return value
}

function secondaryButtonClicked(message){
    var message = {"dialog_response":"no"}
    postMessageHandler(message)
    return "no"
}

function sendResultWithFeedback(buttonResponse) {

    if (feedbackValue > 0) {
        var score = feedbackValue * 20
        var message = { "dialog_response": buttonResponse, "FEEDBACK_SCORE": score.toString() }
        console.log("Feedback Value: " + feedbackValue)
        console.log("Score: " + score)
        postMessageHandler(message)
    } else {
        var message = {"dialog_response": buttonResponse}
        postMessageHandler(message)
    }
}

function cancelButtonClicked(message){
    sendResultWithFeedback("cancel")
    return "no"
}

function backButtonClicked(message){
    var message = {"dialog_response":"back"}
    postMessageHandler(message)
    return "back"
}

function postMessageHandler(message) {
    if (window.webkit && window.webkit.messageHandlers && typeof window.webkit.messageHandlers.SweeprNativeCallback !== 'undefined') {
        window.webkit.messageHandlers.SweeprNativeCallback.postMessage(message);
    }
    if (typeof JSInterface !== 'undefined') {
        JSInterface.postMessage(JSON.stringify(message));
    }
}

const FloatLabel = (() => {

    // add active class and placeholder
    const handleFocus = (e) => {
        const target = e.target;
        target.parentNode.classList.add('active');
        // target.setAttribute('placeholder', target.getAttribute('data-placeholder'));
    };

    // remove active class and placeholder
    const handleBlur = (e) => {
        const target = e.target;
        if (!target.value) {
            target.parentNode.classList.remove('active');
        }
        // target.removeAttribute('placeholder');
    };

    // register events
    const bindEvents = (element) => {
        const floatField = element.querySelector('input');
        floatField.addEventListener('focus', handleFocus);
        floatField.addEventListener('blur', handleBlur);
    };

    // get DOM elements
    const init = () => {
        const floatContainers = document.querySelectorAll('.input--text');

        floatContainers.forEach((element) => {
            if (element.querySelector('input').value) {
                element.classList.add('active');
            }

            bindEvents(element);
        });
    };

    return {
        init: init
    };
})();
FloatLabel.init();

//  COUNTDOWN TIMER
function fnCountdown() {
    //Assign countdown vars
    let countdownNumberEl = document.querySelector('.countdown__number'),
        countdownActive = document.querySelector(".countdown__timer--active"),
        btnCountdown = document.querySelector("#btn-countdown");

    // if step button has disabled attribute then disable button on the page
    if(btnCountdown) {
        if (btnCountdown.getAttribute('data-disabled') == 'true') {
            btnCountdown.setAttribute('disabled', true)
        }
    }

    //If element exists
    if (countdownNumberEl) {
        let initialTime = Number(countdownNumberEl.dataset.countdown);
        let countdown,
            countdownEndTime = new Date().getTime() + initialTime * 1000;

        countdownActive.style.animation = `countdown ${initialTime}s linear forwards`;
        //start coountdown
        setInterval(function () {
            if (countdownEndTime >= new Date().getTime()) countdown = Math.floor((countdownEndTime - new Date().getTime()) / 1000);
            if (countdown <= 0) {
                clearInterval(countdown);
                document.querySelector('.countdown').classList.add('finish');
                //remove disabled attribute from the button
                btnCountdown.removeAttribute('disabled', true)
            } else {
                countdownNumberEl.textContent = countdown;
            }

        }, 1000);
    }
}
fnCountdown();

// `appStateChange` method updates the boolean 'isBackgrounded' when
// sent the app is sent to baackground or restored.
function appStateChange(isBackgrounded) {
    console.log({ isBackgrounded })
}

let diagnosticItems = document.querySelectorAll('.diagnostic-item'),
    diagnosticIcon = document.querySelectorAll('.diagnostic-state'),
    avoidant1 = document.querySelector('.diagnostic-item--avoidant-1'),
    imageSrc = "images/icon-state-";


//This watches out for class changes to the diagnostic list items and then updates the icon image based on the class that is added e.g. if error class is added then it updates image src to icon-state-error.svg
diagnosticItems.forEach(function (diagnosticItem, i) {
    function callback(mutationsList) {
        mutationsList.forEach(mutation => {
            if (mutation.attributeName === 'class') {
                if (diagnosticItem.classList.contains('error')) {
                    diagnosticIcon[i].src = `${imageSrc}error.svg`
                } else if (diagnosticItem.classList.contains('warning')) {
                    diagnosticIcon[i].src = `${imageSrc}warning.svg`
                }
                else if (diagnosticItem.classList.contains('success')) {
                    diagnosticIcon[i].src = `${imageSrc}success.svg`
                }
            }
        })
    }
    const mutationObserver = new MutationObserver(callback)
    mutationObserver.observe(diagnosticItem, { attributes: true })
})


//Setting up the Confident Diagnostics carousel for interaction
let confidentList = document.querySelector('.list--diagnostic-confident');

if (confidentList) {
    var diagnosticSwiper = new Swiper(confidentList, {
        loop: false,
        speed: 650,
        slidesPerView: 1,
        centeredSlides: true,
    });
}

//dynamic list slide next

function slideNext() {
    if(diagnosticSwiper != null) {
        diagnosticSwiper.slideNext();
    }
}

//assign checklist vars. Get the required width that progress indicator needs to increase/decrease by finding total number of checklist items
let checklistItems = document.querySelectorAll('.list--checklist__item'),
    checklistProgressBar = document.querySelector('.progress-bar--checklist .progress-indicator'),
    checklistLen = checklistItems.length,
    checklistProgressInterval = 100 / checklistLen / 100,
    width = 0;
//Loop through each checklist item
checklistItems.forEach(function(checklistItem, i) {
    let checklistInput = checklistItem.querySelector('.input--checklist__input'),
        checklistContainer = checklistItem.querySelector('.input--checklist__container'),
        popupTrigger = checklistItem.querySelector('.popup-trigger');
    //Set data attribute and class for interacting with its modal
    checklistItem.classList.add(`list--checklist__item--${popupTrigger.getAttribute('data-popup-trigger')}`);

    //When checkbox checked add finished class to parent and increase/decrease progress bar
    checklistContainer.addEventListener('click', () => {
        if (checklistInput.checked == true) {
            checklistItem.classList.add('finished');
            width += checklistProgressInterval;
        } else {
            checklistItem.classList.remove('finished');
            width -= checklistProgressInterval;
        }
        checklistProgressBar.style.transform = `scaleX(${width})`;
    })
});

// add this
function onSubmit() {
    console.log("OnSubmit")
    var response = { 'dialog_resonse': 'yes' }
    const textInput = document.querySelectorAll('.input--text__input');
    var fullValid = true
    // for each star element, respond with value
    textInput.forEach((textInputItem) => {
        const value = textInputItem.value;
        const inputName = textInputItem.name;
        response[inputName] = value;

        //Check that inputs are valid based on html attributes on submit
        let isValid = textInputItem.checkValidity();
        fullValid = fullValid && isValid
        if (isValid) {
            textInputItem.parentNode.classList.remove('invalid')
        } else {
            textInputItem.parentNode.classList.add('invalid')
        }
    })
    
    respondWithValue(response)
    return response
}

let feedbackStar = document.querySelectorAll('.feedback--star__label'),
    feedbackModal = document.querySelector('.modal--feedback'),
    feedbackValue = 0;


// for each star element, respond with value
feedbackStar.forEach((feedbackStarItem) => {
    feedbackStarItem.addEventListener('click', function () {
        feedbackValue = feedbackStarItem.previousElementSibling.value;
        //Trigger feedback modal after delay
        setTimeout(function () {
            feedbackModal.classList.add('is--visible');
        }, 1000);
        console.log(feedbackValue)
    })
})


//FEEDBACK RATING
function respondWithFeedBack() {
    sendResultWithFeedback("end")
    return "end"
}


//EDUCATION STEP SLIDER
//function fnEduSlider() {
//    let eduContainer = document.querySelector('#step-body--education'),
//        headerTitle = document.querySelector('.step-header--title'),
//        eduProgressBar = document.querySelector('.progress-bar--education .progress-indicator'),
//        eduSlide = document.querySelectorAll('.step-body--education__item'),
//        eduSlideNumber = 0,
//        eduSlideTotal = eduSlide.length,
//        eduProgressInterval = 100 / eduSlideTotal / 100,
//        btnNext = document.querySelector('.btn--next-step'),
//        btnBack = document.querySelectorAll('.btn--back-step'),
//        eduProgressWidth = eduProgressInterval;
//
//    //Set progress bar width
//    eduProgressBar.style.transform = `scaleX(${eduProgressWidth})`;
//
//    //Set a unique id for each of the education slides
//    eduSlide.forEach((eduSlideItem, i) => {
//        eduSlideId = `step-education-${i}`;
//        eduSlideItem.id = eduSlideId;
//    });
//
//    //When Next button tapped, move slider + increase progress bar
//    btnNext.addEventListener('click', function () {
//        if (eduSlideNumber != eduSlideTotal - 1) {
//            eduSlideNumber += 1;
//            eduContainer.style.transform = `translateX(-${eduSlideNumber}00%)`;
//            eduProgressWidth += eduProgressInterval;
//            eduProgressBar.style.transform = `scaleX(${eduProgressWidth})`;
//            headerTitle.innerHTML = `Step ${eduSlideNumber + 1}`;
//        }
//    });
//
//    //When Back button tapped, move slider + decrease progress bar
//    btnBack.forEach((btnBackItem) => {
//        btnBackItem.addEventListener('click', function () {
//            if (eduSlideNumber != 0) {
//                headerTitle.innerHTML = `Step ${eduSlideNumber}`;
//                eduSlideNumber -= 1;
//                eduContainer.style.transform = `translateX(-${eduSlideNumber}00%)`;
//                eduProgressWidth -= eduProgressInterval;
//                eduProgressBar.style.transform = `scaleX(${eduProgressWidth})`;
//            }
//        });
//    });
//}
//fnEduSlider();


//Activate lottie for diagnostic step


//var diagnosticAnimation = bodymovin.loadAnimation({
//    container: container,
//    renderer: 'svg',
//    loop: loop(),
//    autoplay: true,
//    path: `/animations/${jsonFile}`
//})

function playDiagnosticAnimation() {
    const container = document.querySelector('.diagnostic-animation'),
          data = true,
          jsonFile = container.dataset.json;
    function loop() {
        let dataLoop = container.dataset.loop;
        if (dataLoop == 'true') {
            return true;
        } else {
            return false;
        }
    }


    var diagnosticAnimation = bodymovin.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: loop(),
        autoplay: false,
        path: `./animations/${jsonFile}`,
        rendererSettings: {
            preserveAspectRatio: 'xMaxYMid slice'
        }
    });

    diagnosticAnimation.play()
}

function stopItem(boxElementNumber, actionNumber, status, userType, isFinished) {
    var boxElement = `.${userType}-diagnostic-box--${boxElementNumber}`;
    var lastDiagnosticItem = `.diagnostic-item--${userType}-${actionNumber-1}`;
    var box = document.querySelector(boxElement);


    var lastItem = (box) ? box.querySelector(lastDiagnosticItem) : document.querySelector(lastDiagnosticItem);

    if (lastItem) {
        lastItem.classList.add('finish');
        if (status != 'none') {
            lastItem.classList.add(status);
        }
    }
}

function startNextAnimation(boxNumber, boxItemNumber, status, userType, isFinished) {
    var boxElement = `.${userType}-diagnostic-box--${boxNumber}`;
    var diagnosticItem = `.diagnostic-item--${userType}-${boxItemNumber}`;
    var prevDiagnosticItem = `.diagnostic-item--${userType}-${boxItemNumber-1}`;
    var box = document.querySelector(boxElement);

    var thisItem = (box) ? box.querySelector(diagnosticItem) : document.querySelector(diagnosticItem);
    var prevItem = (box) ? box.querySelector(prevDiagnosticItem) : document.querySelector(prevDiagnosticItem);

    if (thisItem) {
        thisItem.classList.add('start');
        if (status != 'none') {
            thisItem.classList.add(status);
        }
    }

    if (prevItem) {
        prevItem.classList.add('finish');
    }
}

function updateData(boxNumber, boxItemNumber, content, userType){

    var boxID = `.${userType}-diagnostic-box--${boxNumber}`;
    var diagnosticItem = `.diagnostic-item--${userType}-${boxItemNumber}`;
    var contentItem = `#diagnostic-${userType}-${boxItemNumber}`;
    var box = document.querySelector(boxID);

    var ele = (box) ? box.querySelector(contentItem) : document.querySelector(contentItem);
    if (ele) {
        ele.innerHTML = content;
    }
    var thisItem = (box) ? box.querySelector(diagnosticItem) : document.querySelector(diagnosticItem);
    if (thisItem) {
        thisItem.classList.add('finish');
    }
}

function startAllItems(
 boxElementNumber,
 actionNumber,
 status,
 userType,
 isFinished ){
    var actionNumberInt = parseInt(actionNumber)
    for (let i = 0; i <= actionNumber; i++) {
            var boxElement = `.${userType}-diagnostic-box--${boxElementNumber}`;
            var box = document.querySelector(boxElement);
            var diagnosticItem = `.diagnostic-item--${userType}-${i+1}`;

            var thisItem = (box) ? box.querySelector(diagnosticItem) : document.querySelector(diagnosticItem);
            if (thisItem) {
                thisItem.classList.add('start');
                if (status != 'none') {
                    thisItem.classList.add(status);
                }
            }
        }
}

