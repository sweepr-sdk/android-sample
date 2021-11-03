var meta = document.createElement('meta');
                                  meta.setAttribute('name', 'viewport');
                                  meta.setAttribute('content', 'width=device-width,shrink-to-fit=YES');
                                  meta.setAttribute('initial-scale', '1.0');
                                  document.getElementsByTagName('head')[0].appendChild(meta);
    
function yesButtonClicked(message){
    var message = {"dialog_response":"yes"}
    postMessageHandler(message)
    return "yes"
}

function noButtonClicked(message){
    var message = {"dialog_response":"no"}
    postMessageHandler(message)
    return "no"
}

function cancelButtonClicked(message){
    var message = {"dialog_response":"cancel"}
    postMessageHandler(message)
    return "no"
}

function postMessageHandler(message) {
    if (window.webkit && window.webkit.messageHandlers && typeof window.webkit.messageHandlers.SweeprNativeCallback !== 'undefined') {
        window.webkit.messageHandlers.SweeprNativeCallback.postMessage(message);
    }
    if (typeof JSInterface !== 'undefined') {
        JSInterface.postMessage(JSON.stringify(message));
    }
}
