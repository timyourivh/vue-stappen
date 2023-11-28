<script setup lang="ts">
import { reactive, ref } from 'vue';
import Stepper from '../../components/custom-stepper.vue'
import Step from '@/components/stepper/step.vue'

const formFields = {
  id: 0,
  name: 'Test',
  body: 'Consequuntur quia fugiat eos quidem voluptas sit.',
}

type FormFields = typeof formFields;

const form = reactive({
  ...formFields,
  errors: {} as Partial<Record<keyof FormFields, string>>,
});

const steps = ref([
  {
    id: Date.now() + 1,
    name: 'Step 1',
    body: 'First step to ever exist',
  },
  {
    id: Date.now() + 2,
    name: 'Step 2',
    body: 'Second step to ever exist',
  },
  {
    id: Date.now() + 3,
    name: 'Step 3',
    body: 'Three times the charm',
  },
  {
    id: Date.now() + 4,
    name: 'Step 4',
    body: 'Last predefined step',
  },
])

const submitForm = () => {
  form.errors = {}

  form.id = Date.now()

  steps.value.push({
    id: form.id,
    name: form.name,
    body: form.body
  })
}

const removeStep = (id: number) => {
  if (steps.value.length > 1) {
    steps.value = steps.value.filter((step) => step.id !== id)
  }
}
</script>

<template>
  <div>
    <div class="flex justify-center w-full">
      <Stepper class="w-2/3">
        <Step
          v-for="(step, index) in steps"
          v-bind="step"
          :key="index"
        >
          <div v-text="step.body" />
          <div>
            <button
              class="button danger"
              @click="removeStep(step.id)"
            >
              Remove this step
            </button>
          </div>
        </Step>
      </Stepper>
    </div>

    <hr class="my-4">

    <div class="flex justify-center w-full">
      <div>
        <form
          class="flex flex-1 flex-col gap-2 w-96"
          @submit.prevent="submitForm"
        >
          <div>
            <label for="name" class="label">
              Name
            </label>
            <input
              id="name"
              v-model="form.name"
              class="input"
              type="text"
            >
            <small
              v-if="form.errors.name"
              class="error-message"
              v-text="form.errors.name"
            />
          </div>
          <div>
            <label for="body" class="label">
              Body
            </label>
            <textarea
              id="body"
              v-model="form.body"
              class="textarea"
              type="textarea"
            />
          </div>
          <button class="button" type="submit">
            Add step
          </button>
        </form>
      </div>
    </div>
  </div>
</template>