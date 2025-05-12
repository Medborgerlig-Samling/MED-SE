<template>
  <v-form ref="formRef" v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="firstname"
            color="primary"
            variant="outlined"
            :rules="nameRules"
            label="Förnamn"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="lastname"
            color="primary"
            variant="outlined"
            :rules="nameRules"
            label="Efternamn"
            required
          />
        </v-col>

        <v-col cols="12" md="12">
          <v-text-field
            v-model="email"
            color="primary"
            variant="outlined"
            :rules="emailRules"
            label="E-postadress"
            required
          />
        </v-col>

        <v-col cols="12">
          <v-switch color="primary" label="Jag godkänner att MED skickar nyhetsbrev"/>
          <v-switch color="primary" label="Jag godkänner MEDs integritetspolicy"/>
        </v-col>
        
        <v-col cols="12">
          <v-btn color="primary" block @click="submitForm">
            Prenumerera
          </v-btn>
        </v-col>

      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components'

defineProps<{
  image?: string
}>()

const emit = defineEmits<{
  (e: 'submit', payload: { firstname: string; lastname: string; email: string }): void
}>()

const valid = ref(false)
const formRef = ref<InstanceType<typeof VForm> | null>(null)

const firstname = ref('')
const lastname = ref('')
const email = ref('')

const nameRules = [
  (value: string) => !!value || 'Du måste ange ett namn.'
]

const emailRules = [
  (value: string) => !!value || 'Du måste ange en e-postadress.',
  (value: string) => /.+@.+\..+/.test(value) || 'E-postadressen är ogiltig.',
]

const submitForm = async () => {
  const isValid = await formRef.value?.validate()

  if (isValid?.valid) {
    emit('submit', {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value
    })
  }
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
</style>
