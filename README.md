# Vue Stappen 🏎

Vue Stappen (Vue Steps) is a pre-built component that serves as a foundation for creating a stepper without the need to start from scratch (there's a package for that!).


<a href="https://www.npmjs.com/package/vue-stappen"><img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/></a>
<a href="https://github.com/timyourivh/vue-stappen"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/></a>

## TODOs ✅
- [x] Publish to npm
- [x] Test in project
- [x] Go public 
- [x] Document events
- [x] Add v-model support
- [x] Add more events :)
- [ ] Create proper dev environment
- [ ] Document dev environment
- [ ] Add typescript support

## Installation 🛠️

1. Add the package to your project.

    ```bash
    pnpm add vue-stappen
    # or
    yarn add vue-stappen
    # or
    npm install vue-stappen
    ```
2. Create a component in your project using this skeleton:

    ```vue
    <!-- Example: components/stepper.vue -->

    <script setup>
    import stepper from 'vue-stappen'
    </script>

    <template>
      <stepper v-bind="$props">
        <template v-for="(_, slot) of $slots" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </stepper>
    </template>
    ```


3. Style the component

    You have complete freedom to style the component according to your requirements. Just copy the boilerplate from step 2 and add your own templates. You are free to add your own custom props to steps which you can use in your own component.

    <details>
        <summary>PrimeVue example</summary>

    ```vue
    <script setup>
    import Stepper from 'vue-stappen'
    import Button from 'primevue/button'
    </script>

    <template>
      <Stepper v-bind="$props">
        <template #header-item="{ step, active }">
          <div class="p-3" :class="{ 'cursor-pointer': step.navigable, 'text-gray-500': !step.navigable }">
              <div class="text-2xl" :class="{ 'text-primary': active }" v-text="step.title" />
          </div>
          </template>

          <template v-for="(_, slot) of $slots" #[slot]="scope" :key="slot">
          <div class="p-3">
              <slot :name="slot" v-bind="scope" />
          </div>
          </template>

          <template #footer="{ previous, next, currentStep, previousStep }">
          <div class="flex justify-content-between">
              <Button label="Previous" :disabled="!previousStep" @click="previous" />
              <Button :label="currentStep?.id === 'final' ? 'Done' : 'Next'" @click="next" />
          </div>
        </template>
      </Stepper>
    </template>
    ```
    </details>


## Usage 🚀

### Steps

Creating steps is very easy. Just create a (reactive) object and add entries to it. Each key defines a step and each value represents the config of that [step](#step):

```vue
<script setup>
import stepper from 'components/stepper.vue'
import { reactive, ref } from 'vue'

const steps = reactive({
  // Each one of these entries represent a step and it's config.
  personal: { }, // This is the bare minimum you need to define a step.
  seat: {
    id: 'select-seat',
  },
  payment: { 
    customProp: 'You can add custom props to use in your skeleton or step content.',
  }, 
  confirmation: {
    onNext: () => { /* Submit, Validation, etc... */ },
  },
})
</script>
```

Once the script is set up, you can create templates in the stepper with names that match the key or ID of each step:

```vue
<template>
  <stepper :steps="steps">
    <!-- The template name is matched with the key of the step. -->
    <template #personal="{ nextStep }">
      <div>
        <h3>Personal details</h3>
        <h5>Fill in your details.</h5>

        <div>
            <input type="text" placeholder="First Name" v-model="form.first_name">
        </div>
        <div>
            <input type="text" placeholder="Last Name" v-model="form.last_name">
        </div>

        <div>Next up: {{ nextStep.title }}</div>
      </div>
    </template>
    <!-- If set, you can use a custom ID that differs from the key if necessary. -->
    <template #select-seat>
      <div>
        <h3>Seat Information</h3>
        <h5>Choose your seat.</h5>

        <!-- etc... -->
      </div>
    </template>
    <!-- etc... -->
  </stepper>
</template>
```

### V-model:

The component allows you to use a "v-model" value to control the stepper. Initially, this value should be a Vue ref that can either be unset (`null`, `undefined`) or contain a step ID from which the stepper will then start.

```vue
<script setup>
import { reactive, ref } from 'vue'

const steps = reactive({
  step1: { },
  step2: { },
  step3: { 
    id: 'custom-step-id'
  },
  step4: { },
})

// Start at first step defined (step1).
const currentStep = ref(null)
const currentStep = ref() 

// Start from step 2.
const currentStep = ref('step2') 

// Manipulating the value will cause the stepper to navigate .
const navigateToStep = () => {
  currentStep.value = 'custom-step-id'
}
</script>

<template>
  <stepper v-model="currentStep" :steps="steps">
    <!-- ... -->
  </stepper>

  <!-- Example of directly manipulating the stepper from the template -->
  <button @click="currentStep = 'step2'">Take me to step 2</button>
</template>
```

## API reference 📖


### Component properties

|Prop|Type|Description|
|-|-|-|
|`steps`|object|A defentition for the steps that exist in the stepper. Each key defined represents a step and it's should contain a [step](#step).|
|`header-class`|string|Overwrite the parent of the header class to style the header to your needs.|
|`restricted`|boolean\|string|Disable navigation to all steps from header (can still be overwritten by step itself by setting navigable explicitly true). Set to "`allow-visited`" to allow only visited steps to be navigable.|
### Step

#### Options

Listed below are the available options for a step.

|Key|Type|Default|Description|
|-|-|-|-|
|`id`|string|Key of the step|Define an ID for the step which will reference the template name, if null the key of the step will be used instead.|
|`show`|boolean|`true`|A toggle for showing/hiding the step. If false, the step can't be accessed and won't be visible.|
|`disabled`|boolean|`false`|A toggle for disabling/enabling the step. If true, the step is still visible but inaccessible.|
|`navigable`|boolean|`true`|A toggle for allowing navigation to the step from the top navigation. If false, the step can't be accessed by clicking its top navigation entry.|
|`title`|string|The ID converted to start case|A title for the step, if undefined it will use a start case version of the ID.|
|`visited`|boolean|`false`|A flag that can be useful to mark steps as "visited". It will automatically be set to `true` when successfully entering a step.|


#### Default properties

Properies that are auto-set, these can't be overwritten!

|Key|Type|Description|
|-|-|-|
|number|number|This is the number of the step and will always be +1 of the previous step, even if there are hidden steps.|
|processing|boolean|This flag will be true during an event to indicate that it's busy. Useful for disabling buttons or navigation and such.|

#### Custom properties

You are free to add any custom properties if you need them inside your header, content or wherever a step is referenced. If your steps object is reactive, you can manipulate these props and their changes will update directly.

### Step callback middleware

Steps allow for optional callbacks to be configured, these callbacks also double as middleware. Explicitly returning `false` will stop continuation of navigation and events further down the line. Below you can find a list of events in **chronological order**. Every callback receives a [context object](#context-object) as parameter.

|Name|Description|
|-|-|
|`onLeave`|Triggers when leaving step.|
|`onNext`|Triggers when navigating to the very next step.|
|`onForward`|Triggers when navigating any steps forwards.|
|`onPrevious`|Triggers when navigating to the immediately preceding step.|
|`onBackward`|Triggers when navigating any steps backwards.|
|`onEnter`|Triggers when entering step.|

### Component templates

The package provides flexibility through customizable templates.

|Template|Template name|Propeties|Description
|-|-|-|-|
|Header Item|`header-item`|`step`, `active`|This template exists within a loop with the purpose of displaying the header items.|
|Step|(Variable)|`currentStep`, `next(amount)`, `previous(amount)`, `navigateToId(stepId)`, `nextStep`, `previousStep`|This template is used to define the content for the steps.|
|Footer|`footer`|`currentStep`, `next(amount)`, `previous(amount)`, `navigateToId(stepId)`, `nextStep`, `previousStep`|This template is used to dress up the bottom naviagtion of the stepper. For example, this is where you would put the "previous" and "next" buttons.|

### Component events

Every events receives a [context object](#context-object) as parameter.

|Event|Description|
|-|-|
|`next`|Fires when navigating to the very next step.|
|`forward`|Fires when navigating any steps forwards.|
|`backward`|Fires when navigating any steps backwards.|
|`previous`|Fires when navigating to the immediately preceding step.|
|`change`|Fires current step has changed.|
|`finish`|Fires on next at the last step.|
### Context object

A context object is an object that will be passed to both [component events](#component-events) and [step callbacks](#step-callback-middleware).

|Prop|Description|
|-|-|
|`currentStep`|The current step (or step you're leaving).|
|`sourceStep`|The step you're navigating from/to.|
|`direction`|A number representing the amount of steps and direction of the current event. For example: Moving 2 steps back equals -2, moving one step forward equals 1 and not moving at all equals 0.| 


### Exposed methods

I've exposed some methods to manipulate the stepper externally. Here's an example of how they can be used:

```vue
<script setup>
const stepper = ref()

const example1 = () => {
  stepper.value.next()
}
const example2 = () => {
  stepper.value.previous()
}
const example3 = () => {
  stepper.value.navigateToId('step2')
}
</script>

<template>
  <stepper ref="stepper">
    <!-- ... -->
  </stepper>
</template>
```

If you need to call these on you own component you should expose them yourself. Note that you can't call these from an event since that will cause an infinite loop due to the event being triggered when trying to navigate.


## Contributing 🤝

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License 📜

[MIT](https://choosealicense.com/licenses/mit/):

```
Copyright 2023 Tim Youri van Herwijnen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```