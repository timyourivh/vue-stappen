# Vue Stappen 🏎️

Vue 3 skeleton components to easily help you build the best stepper/wizzard you've ever made!

## TODO list

- [x] Update this README to someting useful, like documentation
    - https://strawpoll.com/XOgOVJpRrn3
      - [ ] It's bad
      - [ ] It's not **that** bad
      - [ ] It could be better
      - [x] It's ok
      - [ ] It's good
      - [ ] It's very good
      - [ ] It's the best documentation I've ever seen
- [x] Prepare components for production
- [x] Update NPM
- [ ] Add tests
- [ ] Better typing (help needed)

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

## Documentation / Setup guide

### Creating your own component

This library is designed to empower developers to create custom steppers with ease, providing a solid foundation for building intuitive and interactive user interfaces. In this guide, you will find comprehensive information on how to leverage our framework to craft your own unique stepper experiences. Let's dive in and start building!

Let's get started by creating a basic component and import the Stepper:

```vue
<!-- src/components/defaultStepper.vue -->

<script setup>
import { Stepper } from 'vue-stappen'
</script>

<template>
  <Stepper>
    <slot />
  </Stepper>
<template>
```

To style the header we can use a template for each item:

```vue
<template>
  <Stepper>
    <template #header-item="{ step }">
      <li @click="visit()">
        {{ step.id }}
      </li>
    </template>

    <slot />
  </Stepper>
<template>
```

I made sure to provide the header item with as much useful properties as possible aswell as the callbacks to allow for total controll. Keep in mind this template lives inside a loop which loops for each step the stepper can see.

As of now I made these props available:

| Prop | Type | What it does |
| - | - | - |
| index | Number | The index of the step |
| number | Number | Basically index of the step + 1. Usefull to automatically number the steps and makes it eastier to understand when reading the code. |
| active | Boolean | A flag usefull to determine if on the current flag |
| visited | Boolean | A flag for when a step has been visited (or it's id is present in the history) |
| processing | Boolean | A flag to determine if the stepper is processing. For individual steps use `step.processing` |
| step | Object | This is an object that contains all propeties you set on the step. For example if you need a title available, you can set it on the Step component and it will be available in this property. This assures the best reactivity in vue and the best flexibility when creating a stepper. |
| currentIndex | Number | The index of of the step that is currently active |
| delta | Number | The distance from the current step |
| total | Number | The total number of steps |

The current callbacks are as follows:

| Callback | The params it takes | What it does |
| - | - | - |
| visit() | - | Initiates an attempt to move to the current step |

These props and callbacks can be used to conditionally style your stepper. For example, if we want to highlight the current active step, we can do this:

```vue
<template #header-item="{ step, active, visited }">
  <li :class="{
    'text-red-500': active
  }" @click="visit()">
    {{ step.id }}
  </li>
</template>
```

If we want to highlight the visted steps:

```vue
<template #header-item="{ step, active, visited }">
  <li :class="{
    'text-red-500': active,
    'text-blue-500': visited,
  }" @click="visit()">
    {{ step.id }}
  </li>
</template>
```

If we want to take a "progressive" approach we can do this too. With "progressive" I mean highlighting all preceding steps and never subsequent steps even if they're visited to create a progressbar-like effect. Example:

```vue
<template #header-item="{ step, active, delta }">
  <li :class="{
    'text-red-500': active,
    'text-blue-500': delta <= 0, // Marks all preceding with blue
  }" @click="Math.abs(delta) === 1 ? visit() : null">
    {{ step.id }}
  </li>
</template>
```

### Using the stepper

Using the stepper is as easy as just importing the component and adding steps to it. The only mandatory prop for a step is it's `id`. The stepper will automatically detect these steps:

```vue
<script setup>
import Stepper from '@/components/progressiveStepper';
import { Step } from 'vue-stappen';
</script>

<template>
  <Stepper>
    <Step id="step1" custom-prop="You can use this value in the header by accesssing `step['custom-prop']`">
      Boddy of the step.
    </Step>
    <!-- Add as many as you want, as long as they have unique id's -->
  </Stepper>
</template>
```

### Guards

I've added a guard system that allows you to prevent access to a step. You can add a global guard to the stepper component or add a single guard to a specific step. When both defined the global guard will be processed first, then the step guard defined on the step. Here is an example:

```vue
<script setup>
// Async exmaple
const globalGuard = async () => {
  return await new Promise((resolve, reject) => {
    resolve(true) // Allow move
    resolve(false) // Deny move
    reject('error') // Throw error
  })
}

// Basic conditional example
const stepGuard = () => {
  // Explicitily returnt `true` to allow move
  return true

  // Any thing else to deny the move
  return
  return false
}
</script>

<template>
  <Stepper :on-move="globalGuard">
    <Step :on-move="stepGuard">
      <!-- ... -->
    </Step>
  </Stepper>
</template>
```

There are 3 guards that are executed in the listed order:

| Name | Description |
| - | - |
| onMove \| on-move | Guards any movement |
| onForward \| on-forward | Guards forward movement |
| onReverse \| on-reverse | Guards reverse movement |

These guards all receive the following parameters:

| Name | Type | Description |
| - | - | - | 
| direction | Number | This parameter indicates what direction the user wants to go to. For example if the user clicks "next" it will be `1`, if the user click "previous" it will be `-1`, If the user clicks a header item 2 steps away from the current step it will be `2` |
| currentStep | Object | An object containing the props set on the step the users is currently on. |
| targetStep | Object\|null | This will either be an object containing props of the target step or null depending on if the step exists.

## Contributing

I appreciate any contributions. I'm still learning how to properly package things and I'm struggling with defining the types accurately. If you have suggestions for improvement or ideas on how things could be done better, please share them with me. Thank you!

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
