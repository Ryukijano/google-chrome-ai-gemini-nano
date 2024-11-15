// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize",
    title: "Summarize Selected Text",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "translate",
    title: "Translate Selected Text",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "enhance",
    title: "Enhance Selected Text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize") {
    chrome.tabs.sendMessage(tab.id, { action: "summarize", text: info.selectionText });
  } else if (info.menuItemId === "translate") {
    chrome.tabs.sendMessage(tab.id, { action: "translate", text: info.selectionText });
  } else if (info.menuItemId === "enhance") {
    chrome.tabs.sendMessage(tab.id, { action: "enhance", text: info.selectionText });
  }
});