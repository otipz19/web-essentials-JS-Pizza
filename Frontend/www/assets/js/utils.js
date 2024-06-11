"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadValueToElementBySelector = exports.cloneTemplateContent = void 0;
function cloneTemplateContent(template) {
    var _a, _b;
    return (_b = (_a = template.content) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
}
exports.cloneTemplateContent = cloneTemplateContent;
function loadValueToElementBySelector(parent, selector, value) {
    var element = parent.querySelector(selector);
    element.innerText = value;
}
exports.loadValueToElementBySelector = loadValueToElementBySelector;
//# sourceMappingURL=utils.js.map