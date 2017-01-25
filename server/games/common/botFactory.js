exports.Create = function (botSource) {
  return { main: parseBotSource(botSource) };
}

function parseBotSource(str) {
  return new Function(`
    var window, document, navigator, XMLHttpRequest;
    ${str}
    ; return main;`)();
}
