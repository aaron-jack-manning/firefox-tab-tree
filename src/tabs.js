browser.menus.create({
    id:        'close-tab',
    title:     "Close Tab",
    type:      'normal',
    // Only apply with tab context, overwritten below
    contexts:  ['tab'], 
    // Only apply to right clicking on sidebar
    viewTypes: ['sidebar'], 
    // Only apply to extension
    documentUrlPatterns: [`moz-extension://${location.host}/*`]
});

browser.menus.create({
    id:        'new-tab-above',
    title:     "New Tab Above",
    type:      'normal',
    // Only apply with tab context, overwritten below
    contexts:  ['tab'], 
    // Only apply to right clicking on sidebar
    viewTypes: ['sidebar'], 
    // Only apply to extension
    documentUrlPatterns: [`moz-extension://${location.host}/*`]
});

browser.menus.create({
    id:        'new-tab-below',
    title:     "New Tab Below",
    type:      'normal',
    // Only apply with tab context, overwritten below
    contexts:  ['tab'], 
    // Only apply to right clicking on sidebar
    viewTypes: ['sidebar'], 
    // Only apply to extension
    documentUrlPatterns: [`moz-extension://${location.host}/*`]
});

browser.menus.create({
    id:        'copy-url',
    title:     "Copy URL",
    type:      'normal',
    // Only apply with tab context, overwritten below
    contexts:  ['tab'], 
    // Only apply to right clicking on sidebar
    viewTypes: ['sidebar'], 
    // Only apply to extension
    documentUrlPatterns: [`moz-extension://${location.host}/*`]
});

browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "new-tab-above") {
        browser.tabs.create({
            url: "about:blank",
            index: tab.index,
        });
    }
    else if (info.menuItemId === "new-tab-below") {
        browser.tabs.create({
            url: "about:blank",
            index: tab.index + 1,
        });
    }
    else if (info.menuItemId === "close-tab") {
        browser.tabs.remove(tab.id);
    }
    else if (info.menuItemId === "copy-url") {
        navigator.clipboard.writeText(tab.url);
    }
});

document.addEventListener(
  "contextmenu",
  (e) => {
    let uiTab = e.target.closest(".tab");
    if (uiTab) {
      browser.menus.overrideContext({
        context: "tab",
        tabId: parseInt(uiTab.dataset.tabId),
      });
    }
  },
  { capture: true }
);



function createUiTab(apiTab) {

    let div = document.createElement("div");

    let span = document.createElement("span");
    span.innerText = ' ' + apiTab.title;
    div.appendChild(span);

    //div.innerText = ' ' + apiTab.title;
    div.classList.add("tab");

    // So the full name displays upon hover
    div.setAttribute('title', apiTab.title);

    // Other metadata which is useful for later searches
    div.setAttribute('data-tab-id', apiTab.id);

    // Favicon before text
    let favIcon = document.createElement("img");
    favIcon.setAttribute("src", apiTab.favIconUrl);
    favIcon.classList.add("favicon");
    div.prepend(favIcon);

    div.onclick = function (e) {
        // Set the new tab as the active one
        browser.tabs.update(
            apiTab.id,
            { active: true }
        );
    };

    div.setAttribute("contextmenu", "supermenu");

    if (apiTab.active) {
        div.classList.add("active-tab");
    }

    return div;
}

async function loadTabs() {
    let apiTabs = await browser.tabs.query({ currentWindow: true });

    let tabBox = document.querySelector("#tab-box");

    let uiTabs = [];

    for (const apiTab of apiTabs) {
        let uiTab = createUiTab(apiTab);
        uiTabs.push(uiTab);
    }

    tabBox.replaceChildren(...uiTabs);

}

async function updateActive() {
    document.querySelectorAll('[class*="active-tab"]').forEach(element => {
        element.classList.remove("active-tab");
    });

    let activeId = (await browser.tabs.query({ currentWindow: true, active: true }))[0].id;
    document.querySelector('[data-tab-id="' + activeId + '"]').classList.add("active-tab");
}



browser.tabs.onActivated.addListener(updateActive);

browser.tabs.onCreated.addListener((apiTab) => {
    let uiTab = createUiTab(apiTab);

    insertTabInPlace(uiTab, apiTab.index);
});


function insertTabInPlace(uiTab, index) {
    // note that nth-child is 1 indexed but moveInfo is 0 indexed
    if (index === 0) {
        let tabBox = document.querySelector("#tab-box");
        tabBox.prepend(uiTab);
    }
    else {
        document.querySelector(`.tab:nth-child(${index})`).after(uiTab);
    }
}

// For some reason this is really slow to call, not sure why.
browser.tabs.onMoved.addListener((tabId, moveInfo) =>  {

    let uiTab = document.querySelector(`[data-tab-id="${tabId}"]`);

    uiTab.remove();

    insertTabInPlace(uiTab, moveInfo.toIndex);
});

browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
    document.querySelector(`[data-tab-id="${tabId}"]`).remove();
    updateActive();
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, apiTab) => {
    if (changeInfo.title) {
        let span = document.querySelector(`[data-tab-id="${tabId}"] > span`);
        span.innerText = ' ' + apiTab.title;
    }

    if (changeInfo.favIconUrl) {
        document.querySelector(`[data-tab-id="${tabId}"] > img`).src = changeInfo.favIconUrl;
    }
});


function setTheme(theme) {
    var root = document.querySelector(':root');
    var style = getComputedStyle(root);

    let dark1 = "#1a1a1a";
    let dark2 = "#292929";
    let dark3 = "#3d3d3d";
    let light1 = "white";
    let light2 = "#ecf0f1";
    let light3 = "#c7c7c7";

    if (theme === "light") {
        root.style.setProperty("--theme", "light");

        root.style.setProperty("--text-1", dark1);
        root.style.setProperty("--text-2", dark2);
        root.style.setProperty("--text-3", dark3);
        root.style.setProperty("--background-1", light1);
        root.style.setProperty("--background-2", light2);
        root.style.setProperty("--background-3", light3);

        let moon = document.createElement("i");
        moon.classList.add("bi-moon");
        moon.classList.add("bi");
        document.querySelector("#theme-button").replaceChildren(moon);
    }
    else if (theme === "dark") {
        root.style.setProperty("--theme", "dark");

        root.style.setProperty("--text-1", light1);
        root.style.setProperty("--text-2", light2);
        root.style.setProperty("--text-3", light3);
        root.style.setProperty("--background-1", dark1);
        root.style.setProperty("--background-2", dark2);
        root.style.setProperty("--background-3", dark3);

        let sun = document.createElement("i");
        sun.classList.add("bi-sun");
        sun.classList.add("bi");
        document.querySelector("#theme-button").replaceChildren(sun);
    }
    else {
        console.error("invaild theme");
    }
}


document.querySelector("#theme-button").onclick = function (e) {
    var root = document.querySelector(':root');
    var style = getComputedStyle(root);

    if (root.style.getPropertyValue("--theme") == "light") {
        setTheme("dark")
    }
    else if (root.style.getPropertyValue("--theme") == "dark") {
        setTheme("light");
    }
}



document.querySelector("#new-tab-button").onclick = function () {
    browser.tabs.create({
        url: "about:blank"
    });
};

async function startup() {
    let theme = await browser.theme.getCurrent();

    if (theme?.properties?.color_scheme === "light") {
        setTheme("light");
    }
    else {
        setTheme("dark");
    }

    loadTabs();
}

startup();
