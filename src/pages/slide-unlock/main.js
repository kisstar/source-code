import { $, bindEvents } from '@utils'
import app from '../common'
import SlideUnlock from './js/core'
import './styles/index.less'

const slider = new SlideUnlock('#slide-wrapper')

app.init()
slider.init()
bindEvents('click', slider.reset.bind(slider), $('button.reset'))
