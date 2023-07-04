# Vue Stappen 🏎

Vue Stappen (Vue Steps) is a pre-built component that serves as a foundation for creating a stepper without the need to start from scratch (there's a package for that!).

## Todos ✅
- [x] Publish to npm
- [x] Test in project
- [x] Go public 
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
    import Stepper from 'vue-stappen'
    </script>

    <template>
      <Stepper v-bind="$props">
        <template v-for="(_, slot) of $slots" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </Stepper>
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

I've made it very easy to add steps to the stepper, just create an object and add entries to it that will represent the config of the steps:

```vue
<script setup>
import stepper from 'components/stepper.vue'
import { reactive } from 'vue'

const steps = reactive({
  personal: { }, // Each one of these entries represent a step and it's config.
  seat: { 
    id: 'select-seat'
  },
  payment: { },
  confirmation: { },
})
</script>
```

Once the script is set up, you can create templates in the stepper with names matching the content of each step:

```vue
<template>
  <stepper :steps="steps">
    <!-- The template name is matched with the key of the step. -->
    <template #personal>
      <div>
        <h3>Personal details</h3>
        <h5>Fill in your details.</h5>

        <div>
            <input type="text" placeholder="First Name" v-model="form.first_name">
        </div>
        <div>
            <input type="text" placeholder="Last Name" v-model="form.last_name">
        </div>
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

|Name|key|type|default|description|
|-|-|-|-|-|
|ID|id|string|Key of the step|This option serves a an overwrite for the key which will be used as ID if this option is not set. I've added this to allow you to add multi word options without having to quote the step key if you prefer that in your coding style.|
|Show|show|boolean|`true`|This option serves as a toggle for showing/hiding the step. If false the step can't be accessed and won't be visisble.|
|Disabled|disabled|boolean|`false`|This option serves as a toggle for disabling/enabling the step. If true the step is still visible but inaccessible.|
|Navigable|navigable|boolean|`true`|This option serves as a toggle for allowing navigation to the step from the top navigation. If false the step can't be accesssed by clicking it's top navigation entry.|
|Title|title|string|The ID converted to start case|This option will use a start case version of the ID by default, which can be useful to get 2 birds with 1 stone. If set it will be overwritten of course.|
|-|-|-|-|You are not limited to these options and are free to add any custom props that you could use in the template, header-items or footer as these will be presen on the `currentStep`, `previousStep`* and `nextStep`*. <hr /> * = if present|

## API reference 📖
### Templates

The package provides flexibility through customizable templates.

|Template|Template name|Propeties|Description
|-|-|-|-|
|Header Item|`header-item`|`step`, `active`|This template exixts within a loop whith the purpose of displaying the header items.|
|Step|(Variable)|`currentStep`, `next()`, `previous()`, `navigateToId(stepId)`, `nextStep`, `previousStep`|This template is used to define the content for the steps.|
|Footer|`footer`|`currentStep`, `next()`, `previous()`, `navigateToId(stepId)`, `nextStep`, `previousStep`|This template is used to dress up the bottom naviagtion of the stepper. For example this is where you would put the "previous" and "next" buttons.|

### Propeties reference

|Name|Key|Type|Args|Description|
|-|-|-|-|-|
|Step|step|object|-|This prop is passed to the header item template and contains the step that's being iterated|
|Active|active|boolean|-|This prop is passed to the header item template, this is a reactive boolean which defaults to `false` but becomes `true` if the iterated step is active|
|Current Step|currentStep|object|-|This prop contains the current step|
|Next Step|nextStep|object|-|This prop contains the next step or null if there is no next step|
|Previous Step|previousStep|object|-|This prop contains the previous step or null if there is no previous step|
|Next|next|method|-|Can be used to progress though the stepper by navigation to the fist next step.| 
|Previous|previous|method|-|Can be used to return to the previous step by navigation to te first previous step.|
|Navigate to ID|navigateToId|method|stepId|Can be used to navigate the stepper to the step with the given id (stepId).|

### Exposed methods

I've exposed some methods to manipulate the stepper externally. Here's an example how it can be used:

```vue
<script setup>
const stepper = ref()

const steps = {
  step1: {},
  step2: {},
  step3: {},
}

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

### Component props

Additional options will be added in future updates.

|Name|Key|Description|
|-|-|-|
|Steps|steps|A defentition for the steps that exist in the stepper. Each key represents a step and it's value the options/configuration for the step.|
|Header Class|header-class|Overwrite the parent of the header class to style the header to your needs.|