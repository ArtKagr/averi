<template>
  <div class="p-3">
    <div class="d-flex align-items-center mb-4">
      <b-icon-toggle-on
        v-if="activeField === 'date'"
        class="h4 m-0 mr-3 pointer"
        @click="setActiveField(null)"
      ></b-icon-toggle-on>
      <b-icon-toggle-off v-else class="h4 m-0 mr-3 pointer" @click="setActiveField('date')"></b-icon-toggle-off>
      <datepicker
        v-model="inputGroups.date"
        placeholder="Дата"
        type="date"
        value-type="timestamp"
        format="DD.MM.YYYY"
        class="w-100"
        :disabled="activeField !== 'date'"
      ></datepicker>
    </div>
    <div class="d-flex align-items-center mb-4">
      <b-icon-toggle-on
        v-if="activeField === 'input'"
        class="h4 m-0 mr-3 pointer"
        @click="setActiveField(null)"
      ></b-icon-toggle-on>
      <b-icon-toggle-off v-else class="h4 m-0 mr-3 pointer" @click="setActiveField('input')"></b-icon-toggle-off>
      <b-input-group class="d-flex align-items-center w-100 filter">
        <b-form-input
          v-model="inputGroups.months"
          placeholder="Количество месяцев"
          :disabled="activeField !== 'input'"
        ></b-form-input>
      </b-input-group>
    </div>
    <div class="d-flex align-items-center flex-column">
      <div class="d-flex align-items-center mb-3">
        <span>
          <b-icon-toggle-on
            v-if="activeField === 'input-group'"
            class="h5 m-0 mr-3 pointer"
            @click="setActiveField(null)"
          ></b-icon-toggle-on>
          <b-icon-toggle-off
            v-else
            class="h5 m-0 mr-3 pointer"
            @click="setActiveField('input-group')"
          ></b-icon-toggle-off>
        </span>
        <div class="d-flex flex-column">
          <b-input-group
            v-for="(group, key) in inputGroups.interval"
            :key="key"
            class="d-flex align-items-center w-100 filter mb-2"
          >
            <b-form-input v-model="group.min" placeholder="От" :disabled="activeField !== 'input-group'"></b-form-input>
            <b-form-input v-model="group.max" placeholder="До" :disabled="activeField !== 'input-group'"></b-form-input>
            <b-form-input
              v-model="group.required"
              placeholder="Итог"
              :disabled="activeField !== 'input-group'"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="d-flex align-items-center mb-4 w-100">
        <b-icon-toggle-on
          v-if="activeField === 'koef'"
          class="h4 m-0 mr-3 pointer"
          @click="setActiveField(null)"
        ></b-icon-toggle-on>
        <b-icon-toggle-off v-else class="h4 m-0 mr-3 pointer" @click="setActiveField('koef')"></b-icon-toggle-off>
        <b-input-group class="d-flex align-items-center w-100 filter">
          <b-form-input
            v-model.number="inputGroups.koef"
            placeholder="Процент"
            :disabled="activeField !== 'koef'"
          ></b-form-input>
        </b-input-group>
      </div>
      <div class="d-flex align-items-center w-100">
        <div class="d-flex justify-content-end w-100 mt-2">
          <b-icon-patch-minus
            v-if="activeField !== 'input-group'"
            class="h5 m-0 mr-2 pointer"
            variant="secondary"
          ></b-icon-patch-minus>
          <b-icon-patch-minus
            v-else
            class="h5 m-0 mr-2 pointer"
            :disabled="activeField !== 'input-group'"
            @click="removeInputForm"
          ></b-icon-patch-minus>
          <b-icon-patch-plus
            v-if="activeField !== 'input-group'"
            class="h5 m-0 mr-2 pointer"
            :disabled="activeField !== 'input-group'"
            variant="secondary"
          ></b-icon-patch-plus>
          <b-icon-patch-plus
            v-else
            class="h5 m-0 mr-2 pointer"
            :disabled="activeField !== 'input-group'"
            @click="addInputForm"
          ></b-icon-patch-plus>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseShelfLife',
  data() {
    return {
      activeField: 'date',
      inputGroups: {},
    }
  },
  computed: {
    activeFieldCopy() {
      return this.$store.getters['purchaseObject/getActiveShelfField']
    },
    inputGroupsCopy() {
      return this.$store.getters['purchaseObject/getInputShelfGroups']
    },
  },
  watch: {
    activeFieldCopy(newValue) {
      this.activeField = newValue
    },
    inputGroups: {
      handler(newValue) {
        this.$store.commit('purchaseObject/UPDATE_INPUT_SHELF_GROUPS', JSON.parse(JSON.stringify(newValue)))
      },
      deep: true,
    },
  },
  created() {
    this.activeField = this.$store.getters['purchaseObject/getActiveShelfField']
    this.inputGroups = this.$store.getters['purchaseObject/getInputShelfGroups']
  },
  methods: {
    setActiveField(value) {
      if (value === 'input') this.inputGroups.date = null
      if (value === 'input-group') {
        this.inputGroups.date = null
        this.inputGroups.months = null
      }
      if (value === 'koef') {
        this.inputGroups.date = null
        this.inputGroups.months = null
        this.inputGroups.interval = [{ min: null, max: null, required: null }]
      }
      this.$store.commit('purchaseObject/UPDATE_ACTIVE_SHELF_FIELD', value)
    },
    addInputForm() {
      this.inputGroups.interval.push({ min: null, max: null, required: null })
    },
    removeInputForm() {
      if (this.inputGroups.interval.length > 1) this.inputGroups.interval.pop()
    },
  },
}
</script>
