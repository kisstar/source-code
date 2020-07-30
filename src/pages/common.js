import { setUserTheme, createTab, createCard } from '@utils/app'

const app = {
  init() {
    setUserTheme()
    createTab()
    createCard()
  }
}

export default app
