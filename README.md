# Vue Stappen 🏎

Vue Stappen (Vue Steps) is a pre-built component that serves as a foundation for creating a stepper without the need to start from scratch (there's a package for that!).


<a href="https://www.npmjs.com/package/vue-stappen"><img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/></a>
<a href="https://github.com/timyourivh/vue-stappen"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/></a>

## Todos ✅
- [x] Publish to npm
- [x] Test in project
- [x] Go public 
- [x] Document events
- [ ] Document dev env
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
        <template #header="{ step, active }">
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

I've made it very easy to add steps to the stepper. Just create an object and add entries to it that will represent the config of the steps:

```vue
<script setup>
import stepper from 'components/stepper.vue'
import { reactive } from 'vue'

const steps = reactive({
  // Each one of these entries represent a step and it's config.
  personal: { }, // This is the bare minimum you need to define a step.
  seat: {
    id: 'select-seat',
  },
  payment: { 
    customProp: 'You can add custom props to use in your skeleton',
  }, 
  confirmation: {
    onLeave: () => { /* Submit, Validation, etc... */ },
  },
})
</script>
```

Once the script is set up, you can create templates in the stepper with names matching the key or ID of each step:

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

#### These are the options for a step:

|Key|Type|Default|Description|
|-|-|-|-|
|id|string|Key of the step|Override for the key, which will be used as ID if this option is not set.|
|show|boolean|`true`|A toggle for showing/hiding the step. If false, the step can't be accessed and won't be visible.|
|disabled|boolean|`false`|A toggle for disabling/enabling the step. If true, the step is still visible but inaccessible.|
|navigable|boolean|`true`|A toggle for allowing navigation to the step from the top navigation. If false, the step can't be accessed by clicking its top navigation entry.|
|title|string|The ID converted to start case|This option will use a start case version of the ID by default, which can be useful to get 2 birds with 1 stone. If set, it will be overwritten, of course.|
|visited|boolean|false|A flag that can be useful to toggle steps as "visited". It will automatically be set to `true` when successfully leaving a step.|
|-|-|-|You are not limited to these options and are free to add any custom props that you could use in the template, header items, or footer, as these will be present on the  `currentStep`, `previousStep`* and `nextStep`*. <hr /> * = Only if present! Use `?.` to access props to prevent errors.|

#### These are properties that can't be set but are accessible on the step:

|Key|Type|Description|
|-|-|-|
|number|number|This is the number of the step and will always be +1 of the previous step, even if there are hidden steps.|
|processing|boolean|This flag will be true during an event to indicate that it's busy. Useful for disabling buttons or navigation and such.|

#### Events:

|Key|Params|Description
|-|-|-|
|onEnter|step|This event is triggered when trying to enter a step. Return true or false to decide if you can continue or not.|
|onLeave|step|This event is triggered when trying to leave a step. Return true or false to decide if you can leave the step or not.|

## API reference 📖
### Templates

The package provides flexibility through customizable templates.

|Template|Template name|Propeties|Description
|-|-|-|-|
|Header Item|`header-item`|`step`, `active`|This template exists within a loop with the purpose of displaying the header items.|
|Step|(Variable)|`currentStep`, `next()`, `previous()`, `navigateToId(stepId)`, `nextStep`, `previousStep`|This template is used to define the content for the steps.|
|Footer|`footer`|`currentStep`, `next()`, `previous()`, `navigateToId(stepId)`, `nextStep`, `previousStep`|This template is used to dress up the bottom naviagtion of the stepper. For example, this is where you would put the "previous" and "next" buttons.|

### Propeties reference

|Prop|Type|Args|Description|
|-|-|-|-|
|step|object|-|This prop is passed to the header item template and contains the step that's being iterated.|
|active|boolean|-|This prop is passed to the header item template. It is a reactive boolean that defaults to `false`, but becomes `true` if the iterated step is active.|
|currentStep|object|-|This prop contains the current step.|
|nextStep|object|-|This prop contains the next step or null if there is no next step.|
|previousStep|object|-|This prop contains the previous step or null if there is no previous step.|
|next|method|-|Can be used to progress though the stepper by navigation to the fist next step.| 
|previous|method|-|Can be used to return to the previous step by navigation to te first previous step.|
|navigateToId|method|stepId|Can be used to navigate the stepper to the step with the given id (`stepId`).|

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

If you need to call these on you own component you should expose them yourself. Note that you can't call these from an 
event since that will cause an infinite loop due to the event being triggered when trying to navigate.

### Component props

|Prop|Type|Description|
|-|-|-|
|steps|object|A defentition for the steps that exist in the stepper. Each key represents a step and it's value the options/configuration for the step.|
|header-class|string|Overwrite the parent of the header class to style the header to your needs.|
|restricted|boolean\|string|Disable navigation to all steps from header (can still be overwritten by step itself by setting naviageble explicitly true). Set to "allow-visited" to allow only visited steps to be navigable.|

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