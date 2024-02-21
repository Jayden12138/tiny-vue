
import { createRenderer } from '../runtime-core/index'
import { isOn } from '../shared/src/index';

function createElement(type: string) {
    return document.createElement(type)
}

function patchProp(el, key, prevVal, nextVal) {
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, nextVal);
    } else {
        if (nextVal === undefined || nextVal === null) {
            el.removeAttribute(key);
        } else {
            el.setAttribute(key, nextVal);
        }
    }
}
function insert(child, container, anchor) {
    // container.appendChild(el);
    container.insertBefore(child, anchor || null);
}

function remove(el) {
    const parent = el.parentNode;
    if (parent) {
        parent.removeChild(el);
    }
}

function setElementText(container, text) {
    container.textContent = text;
}

const renderer = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
});

export function createApp(...args) {
    return renderer.createApp(...args)
}


export * from '../runtime-core/index';