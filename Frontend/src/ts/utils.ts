export function cloneTemplateContent(template: HTMLTemplateElement): HTMLElement {
    return template.content?.firstElementChild?.cloneNode(true) as HTMLElement;
}

export function loadValueToElementBySelector(parent: HTMLElement, selector: string, value: string) {
    let element = parent.querySelector(selector) as HTMLElement;
    element.innerText = value;
}