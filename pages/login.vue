<template>
  <div class="d-flex justify-content-center pt-4">
    <div>
      <p>
        <b-input v-model="formData.email" type="email" placeholder="E-mail"></b-input>
      </p>
      <p>
        <b-input v-model="formData.password" type="password" placeholder="password"></b-input>
      </p>
      <hr />
      <div class="text-right">
        <b-btn variant="success" @click="logIn()">Log In</b-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  layout: 'public',
  auth: 'guest',
  data() {
    return {
      formData: {
        email: '',
        password: '',
        device_name: 'web',
      },
    }
  },
  methods: {
    logIn() {
      this.$axios.get('/sanctum/csrf-cookie').then(() => {
        this.$auth.loginWith('local', {
          data: this.formData,
        })
      })
    },
  },
}
</script>
