import { extend, isObject } from '@tiny-vue/shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
	return function getter(target, key) {
		const res = Reflect.get(target, key)

		if (key === ReactiveFlags.IS_REACTIVE) {
			return !isReadonly
		} else if (key == ReactiveFlags.IS_READONLY) {
			return isReadonly
		}

		if (shallow) {
			// 不进行 nested object 处理 ｜ 不进行依赖收集
			return res
		}

		if (isObject(res)) {
			return isReadonly ? readonly(res) : reactive(res)
		}

		if (!isReadonly) {
			// 收集依赖
			track(target, key)
		}

		return res
	}
}

function createSetter() {
	return function setter(target, key, value) {
		const res = Reflect.set(target, key, value)

		// 触发依赖
		trigger(target, key)

		return res
	}
}

export const mutableHandlers = {
	get,
	set,
}

export const readonlyHandlers = {
	get: readonlyGet,
	set(target, key, value) {
		console.warn(`key:${key} set 失败，因为 target 是 readonly！`, target)
		return true
	},
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
	get: shallowReadonlyGet,
})
