# Vue Stappen 🏎️

Vue 3 skeleton components to easily help you build the best stepper/wizzard you've ever made!

## TODO list

- [x] Update this README to someting useful, like documentation
    - [ ] It's bad
    - [x] It's not **that** bad
    - [ ] It's ok
    - [ ] It's good
    - [ ] It's very good
    - [ ] It's the best documentation I've ever red
- [x] Prepare components for production
- [x] Update NPM

## Installation

```bash
pnpm add vue-stappen
# or
yarn install vue-stappen
# or
yarn add vue-stappen
```

## Example

Starting off you will be presented a default and very minimal "skeleton" stepper/wizzard:

![image](https://github.com/timyourivh/vue-stappen/assets/60601502/ce275c48-fc4b-40b4-9d15-bfeb2d8c01b1)

But with some styling magic you can create something like this for example:

![image](https://github.com/timyourivh/vue-stappen/assets/60601502/cbb8b74f-fde8-43ef-bcc7-bc8e3b4e080a)
*Example styled with [Tailwind](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/)*

The example above is created using this code:

<details>
    <summary>Click to expand</summary>

```vue
<script setup lang="ts">
import { Stepper } from 'vue-stappen'
</script>

<template>
  <Stepper header-class="steps" step-class="border p-3 rounded-lg my-4 border-gray-200 dark:border-gray-700" v-bind="$props">
    <template #header-item="{ visited, step, active, processing, visit }">
      <li
        class="step" 
        :class="{
          'step-primary': visited,
          'step-secondary': visited && processing || step.processing,
          'step-accent font-bold text-black dark:text-white': active && !step.processing,
          'step-secondary font-bold text-black dark:text-white': active && step.processing,
        }"
        @click="visit()">
        {{ step.id }}
      </li>
    </template>

    <slot />

    <template #navigation="{ next, previous, previousStep, nextStep }">
      <div class="flex">
        <button v-if="previousStep" class="btn btn-neutral" @click="previous">Previous</button>
        <div class="w-full"></div>
        <button class="btn" :class="{ 'btn-neutral': nextStep, 'btn-primary': !nextStep }" @click="next">
          {{ nextStep ? 'Next' : 'Finish' }}
        </button>
      </div>
    </template>
  </Stepper>
</template>
```
</details>

Vue Stappen allows you to focus on the style of your stepper without writing stepper logic yourself. When "extending" the component like in the example above the only thing left to do is create steppers:

```vue
<script setup lang="ts">
import MyCustomStyleStepper from '@/components/MyCustomStyleStepper.vue'
import { Step } from 'vue-stappen'
</script>

<template>
  <MyCustomStyleStepper>
    <Step id="step1">
      Body step 1
    </Step>
    <Step id="step2">
      Body step 2
    </Step>
    <Step id="step3">
      Body step 3
    </Step>
  </MyCustomStyleStepper>
</template>
``` 

## Documentation

### Coming soon!

## Contributing

<details>
  <summary>Click to expand</summary>

---

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
</details>
