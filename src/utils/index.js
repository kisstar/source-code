export default new (class {
  /* ===================================== Type ===================================== */

  /**
   * @public
   * @method
   * @name isFunction
   * @description 判断传入的值是否是一个函数
   * @param {*} value 需要检测的值
   * @returns {boolean}
   */
  isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]'
  }

  /**
   * @public
   * @method
   * @name isPromise
   * @description 判断传入的值是否是一个 Promise
   * @param {*} val 需要检测的值
   * @returns {boolean}
   */
  isPromise(val) {
    return val && typeof val.then === 'function'
  }

  /**
   * @public
   * @method
   * @name isObject
   * @description 判断传入的值是否是一个对象
   * @param {*} obj 需要检测的值
   * @returns {boolean}
   */
  isObject(obj) {
    return obj !== null && typeof obj === 'object'
  }

  /* ===================================== DOM ===================================== */

  /**
   * @public
   * @method
   * @name $
   * @description 获取指定元素/文档中与指定选择器或选择器组匹配的第一个 HTML 元素
   * @param {string} selectors 包含一个或多个要匹配的选择器的 DOM 字符串
   * @param {Element} baseElement 可选的，指定的基础元素
   * @returns {Element | null} 如果找不到匹配项，则返回 null，否则返回对应的 Element
   */
  $(selectors, baseElement = document) {
    return baseElement.querySelector(selectors)
  }

  /**
   * @public
   * @method
   * @name $$
   * @description 获取返回与指定的选择器组匹配的指定元素/文档中的元素列表
   * @param {string} selectors 包含一个或多个要匹配的选择器的 DOM 字符串
   * @param {Element} baseElement 可选的，指定的基础元素
   * @returns {NodeList} 在没有匹配的情况下依然返回空 NodeList
   */
  $$(selectors, baseElement = document) {
    return baseElement.querySelectorAll(selectors)
  }

  /**
   * @public
   * @method
   * @name _h
   * @description 创建由 tagName 指定的 HTML 元素
   * @param {string} tagName 指定要创建元素类型的字符串
   * @param {object} propMap 可选的，包含 class 等额外配置项
   * @param {string} text 可选的文字节点
   * @returns {Element | HTMLUnknownElement} 如果 tagName 不被识别，则创建一个 HTMLUnknownElement
   */
  h(tagName, propMap = {}, text) {
    const ele = document.createElement(tagName)
    Object.keys(propMap).forEach(prop => ele.setAttribute(prop, propMap[prop]))
    if (text) {
      ele.appendChild(document.createTextNode(text))
    }
    return ele
  }

  /* ===================================== EVENT ===================================== */

  /**
   * @public
   * @method
   * @name bindEvents
   * @param {string} events 一个以空格分开的字符串，指定了要绑定的事件
   * @param {function} handler 事件监听器
   * @param {Element | Element[] | undefined} elements 可选的，绑定事件的元素
   * @returns {void}
   */
  bindEvents(events, handler, elements = this.$('body')) {
    let oElements = elements
    events.split(' ').forEach(event => {
      if (!oElements.length) {
        oElements = [oElements]
      }
      oElements.forEach(element => {
        element.addEventListener(event, handler, false)
      })
    })
  }

  /**
   * @public
   * @method
   * @name unbindEvents
   * @param {string} events 一个以空格分开的字符串，指定了要取消的事件
   * @param {function} handler 事件监听器
   * @param {Element | undefined} element 可选的，取消事件的元素
   * @returns {void}
   */
  unbindEvents(events, handler, element = this.$('body')) {
    events.split(' ').forEach(event => {
      element.removeEventListener(event, handler, false)
    })
  }

  /* ===================================== Perf ===================================== */

  /**
   * @public
   * @method
   * @name throttle
   * @description 对函数进行包装，避免高频率执行损耗性能
   * @param {function} method 需要执行函数
   * @param {object} context 函数执行时的上下文环境
   * @param {number} delay 时间，以毫秒计
   * @returns {function} 包装后的函数
   */
  throttle(method, context = {}, delay = 4, ...outParams) {
    function withThtottle(...innerParams) {
      clearTimeout(context.$$tId)
      function throttleCore() {
        method.apply(context, [...outParams, ...innerParams])
      }
      throttleCore.displayName = `throttleCore(${method.name})`
      // eslint-disable-next-line no-param-reassign
      context.$$tId = setTimeout(throttleCore, delay)
    }
    withThtottle.displayName = `withThtottle(${method.name})`
    return withThtottle
  }

  /* ===================================== PROJECT ===================================== */

  /**
   * @public
   * @method
   * @name createTab
   * @description 根据固定 HTML 结构创建 Tab 切换的功能
   * @returns {void}
   */
  createTab() {
    const ele = this.$('[data-toggle="tab"]')
    if (!ele) {
      return
    }

    // 高亮当前按钮
    const setActive = (index = 0) => {
      const buttons = this.$$('button[value]', ele)
      const len = buttons.length

      for (let i = 0; i < len; i++) {
        buttons[i].classList.remove('active')
      }
      buttons[index].classList.add('active')
    }

    this.bindEvents(
      'click',
      e => {
        if (e.target === e.currentTarget) {
          return
        }
        if (!e.target.hasAttribute('value')) {
          return
        }

        const tabPanes = this.$$('.tab-pane')
        tabPanes.forEach((oEle, index) => {
          oEle.classList.remove('show', 'fade')
          if (index === +e.target.value) {
            oEle.classList.add('show')
            setTimeout(() => oEle.classList.add('fade'), 100) // 异步避开渲染优化（合并渲染）
            setActive(index)
          }
        })
      },
      ele
    )
    setActive()
  }

  /**
   * @public
   * @method
   * @name createCard
   * @description 根据固定 HTML 结构创建 Card 伸缩的功能
   * @returns {void}
   */
  createCard() {
    const eles = this.$$('[data-toggle="card"]')
    if (!eles.length) {
      return
    }
    this.bindEvents(
      'click',
      e => {
        const ele = e.target.nextElementSibling
        const { height } = ele.style
        if (!height || height === '0px') {
          if (!ele.oriHeight) {
            ele.oriHeight = `${ele.getBoundingClientRect().height}px`
            ele.style.height = ele.oriHeight
            // 触发第一次点击时的动画
            if (!height) {
              setTimeout(() => {
                ele.style.cssText = 'height: 0px;'
              }, 100)
            }
          } else {
            ele.style.cssText = `height: ${ele.oriHeight};`
          }
        } else {
          ele.style.cssText = 'height: 0px;'
        }
      },
      eles
    )
  }

  /* ===================================== OTHERS ===================================== */

  /**
   * @public
   * @method
   * @name forEachValue
   * @description 遍历对象
   * @param {*} obj 对象
   * @param {*} fn 遍历时的处理函数，接受对象的值、键为参数
   * @returns {void}
   */
  forEachValue(obj, fn) {
    Object.keys(obj).forEach(key => fn(obj[key], key))
  }

  /**
   * @public
   * @method
   * @name partial
   * @description 利用闭包保留函数执行时需要的参数
   * @param {Function} fn 被包装的函数
   * @param {*} arg 需要保留的参数
   * @returns {Function} 包装后的函数
   */
  partial(fn, arg) {
    return function partialedFn() {
      return fn(arg)
    }
  }
})()
