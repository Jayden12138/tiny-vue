import { createRenderer } from '../runtime-core/index'
import { isOn } from '../shared/index'

function createElement(type) {
	return document.createElement(type)
}

function patchProp(el, key, prevVal, nextVal) {
	if (isOn(key)) {
		const event = key.slice(2).toLowerCase()
		el.addEventListener(event, nextVal)
	} else {
		if (nextVal == null) {
			el.removeAttribute(key)
		} else {
			el.setAttribute(key, nextVal)
		}
	}
}

function insert(el, container) {
	container.append(el)
}

const renderer: any = createRenderer({
	createElement,
	patchProp,
	insert,
})

export function createApp(...args) {
	return renderer.createApp(...args)
}

export * from '../runtime-core/index'