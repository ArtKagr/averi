import Vue from 'vue'

Vue.prototype.$access = (user) => {
  const role = user.roles[0].slag
  const match = user.is_confirming
  const email = user.email
  return { role, match, email }
}
