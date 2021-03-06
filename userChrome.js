// Copyright (c) 2017 Haggai Nuchi
// Available for use under the MIT License:
// https://opensource.org/licenses/MIT

// Set "useLionFullScreen" in the same way that it's done in
// chrome://browser/content/browser-fullScreenAndPointerLock.js
// XPCOMUtils.defineLazyGetter(FullScreen, "useLionFullScreen", function() {
//     return false;
// });

// ==UserScript==
// @name           FloatingScrollbar.uc.js
// @namespace      nightson1988@gmail.com
// @include        main
// @version        0.0.3
// @note           Thanks to Griever(https://github.com/Griever/userChromeJS/blob/master/SmartScrollbar.uc.js) and Paul Rouget(https://gist.github.com/4003205)
// @note...........0.0.3 Fixed a problem of breaking hbox layout
// @note           0.0.2 Remove usage of E4X (https://bugzilla.mozilla.org/show_bug.cgi?id=788293)
// ==/UserScript==

(function () {
    var prefs = Services.prefs,
        enabled;
    if (prefs.prefHasUserValue('userChromeJS.floating_scrollbar.enabled')) {
        enabled = prefs.getBoolPref('userChromeJS.floating_scrollbar.enabled')
    } else {
        prefs.setBoolPref('userChromeJS.floating_scrollbar.enabled', true);
        enabled = true;
    }

    var css = '\
    @namespace url(http: //www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
    :not(select):not(hbox) > scrollbar {\
        -moz-appearance: none!important;\
        position: relative!important;\
        box-sizing: border-box!important;\
        background-color: transparent;\
        background-image: none;\
        z-index: 2147483647;\
        padding: 0px;\
        display: flex!important;\
        justify-content: flex-end;\
        pointer-events: auto;\
        width: auto!important;\
    }\
    :not(select):not(hbox) > scrollbar thumb {\
        -moz-appearance: none!important;\
        border-radius: 0px!important;\
        background-color: rgba(100, 100, 100, 0);\
        pointer-events: auto;\
    }\
    :not(select):not(hbox) > scrollbar[orient = "vertical"] {\
        width: 16px!important;\
        -moz-margin-start: -16px;/*margin to fill the whole render window with content and overlay the scrollbars*/\
    }\
    :not(select):not(hbox) > scrollbar[orient = "horizontal"] {\
        height: 16px!important;\
        margin-top: -16px;\
    }\
    :not(select):not(hbox) > scrollbar[orient = "vertical"] thumb {\
        border-left: 3px solid rgba(80, 80, 80, 0.75);\
        min-height: 16px;\
        transform: translate(11px, 0px);\
        transition: transform 0.1s linear;\
    }\
    :not(select):not(hbox) > scrollbar[orient = "horizontal"] thumb {\
        border-top: 3px solid rgba(80, 80, 80, 0.75);\
        min-width: 16px;\
        transform: translate(0px, 11px);\
        transition: transform 0.1s linear;\
    }\
    :not(select):not(hbox) > scrollbar:hover {\
        background-color: rgba(90, 90, 90, 0.15);\
    }\
    :not(select):not(hbox) > scrollbar:hover thumb {\
        background-color: rgba(100, 100, 100, 0.5)!important;\
        border-left: 0px;\
        border-top: 0px;\
        transform: translate(0px, 0px);\
        transition: transform 0.1s linear;\
    }\
    :not(select):not(hbox) > scrollbar thumb:hover {\
        background-color: rgba(100, 100, 100, 0.8)!important;\
    }\
    :not(select):not(hbox) > scrollbar thumb:active {\
        background-color: rgba(110, 110, 110, 1)!important;\
    }\
    :not(select):not(hbox) > scrollbar scrollbarbutton, :not(select):not(hbox) > scrollbar gripper {\
        display: none;\
    }';

    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));

    var p = document.getElementById('devToolsSeparator');
    var m = document.createElement('menuitem');
    m.setAttribute('label', "Schwebende Scrollbar");
    m.setAttribute('type', 'checkbox');
    m.setAttribute('autocheck', 'false');
    m.setAttribute('checked', enabled);
    p.parentNode.insertBefore(m, p);
    m.addEventListener('command', command, false);

    if (enabled) {
        sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
    }

    function command() {
        if (sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
            prefs.setBoolPref('userChromeJS.floating_scrollbar.enabled', false);
            sss.unregisterSheet(uri, sss.AGENT_SHEET);
            m.setAttribute('checked', false);
        } else {
            prefs.setBoolPref('userChromeJS.floating_scrollbar.enabled', true);
            sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
            m.setAttribute('checked', true);
        }

        let root = document.documentElement;
        let display = root.style.display;
        root.style.display = 'none';
        window.getComputedStyle(root).display; // Flush
        root.style.display = display;
    }

})();
