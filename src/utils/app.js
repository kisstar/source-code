import { $, $$, bindEvents } from '.'

/* ===================================== PROJECT ===================================== */

/**
 * @public
 * @method
 * @name createTab
 * @description 根据固定 HTML 结构创建 Tab 切换的功能
 * @returns {void}
 */
export const createTab = () => {
  const ele = $('[data-toggle="tab"]')
  if (!ele) {
    return
  }

  // 高亮当前按钮
  const setActive = (index = 0) => {
    const buttons = $$('button[value]', ele)
    const len = buttons.length

    for (let i = 0; i < len; i++) {
      buttons[i].classList.remove('active')
    }
    buttons[index].classList.add('active')
  }

  bindEvents(
    'click',
    e => {
      if (e.target === e.currentTarget) {
        return
      }
      if (!e.target.hasAttribute('value')) {
        return
      }

      const tabPanes = $$('.tab-pane')
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
export const createCard = () => {
  const eles = $$('[data-toggle="card"]')
  if (!eles.length) {
    return
  }
  bindEvents(
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

export const setUserTheme = theme => {
  const defaultTheme = 'light'
  const userTheme =
    theme || localStorage.getItem('source-code-theme') || defaultTheme
  const themeClass = `theme-${userTheme}`
  const bodyClassList = document.body.classList

  Array.from(bodyClassList).forEach(className => {
    if (/^theme-/.test(className)) {
      bodyClassList.remove(className)
    }
  })

  bodyClassList.add(themeClass)
}
