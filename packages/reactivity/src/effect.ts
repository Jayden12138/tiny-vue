
/**
 * effect(()=>{}) 接收一个函数，依赖发生变化则执行fn，
 * 当执行fn时，如果遇到reactive包装的变量，则会出发get 在get中出发track 收集依赖，这里就是把当前的effect中的fn，保存起来
 * 当reactive包装的变量发生变化时，会触发set 在set中触发trigger trigger中会查询到之前保存的相关effect函数fn，遍历执行
 */

import { extend } from "./shared";

let activeEffect: any;
class ReactiveEffect {
  active = true;
  deps = [];
  onStop?: () => void;
  constructor(public fn: any, public scheduler?: any) {}
  run() {
    activeEffect = this;
    const result = this.fn();
    activeEffect = undefined;
    return result;
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      if(this.onStop) {
        this.onStop()
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}


export function effect(fn: any, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  // _effect.onStop = options.onStop
  // Object.assign(_effect, options) // 挂载多个属性
  extend(_effect, options) // 抽离出去改个名字
  
  _effect.run()

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

const targetMap = new Map();
// 依赖收集
export function track(target: any, key: any) {
    // target -> key -> dep
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key);
    if(!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
  if (!activeEffect) return; // 只有在effect中 才有activeEffect 当只有reactive时，触发get是不存在deps的
  dep.add(activeEffect);
  (activeEffect as any).deps.push(dep);
}

// 触发依赖
export function trigger(target: any, key: any) {
    const depsMap = targetMap.get(target);
    const dep = depsMap.get(key);
    dep.forEach((effect: any) => {
      if (effect.scheduler) {
          effect.scheduler()
      } else {
        effect.run();
      }
    })
}


export function stop(runner: any) {
    runner.effect.stop()
}