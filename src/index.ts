import { type App, type Plugin } from 'vue'

import { Step, Stepper } from './components/stepper'

export default {
    install(Vue: App) {
        Vue.component(Step.name, Step)
        Vue.component(Stepper.name, Stepper)
    }
} as Plugin

export {
    Stepper,
    Step,
}