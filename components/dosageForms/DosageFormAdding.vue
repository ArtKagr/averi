<template>
  <b-table class="w-100" :items="currentDosageForm" :fields="fields" stacked striped>
    <template v-slot:cell(lf_name)="row">
      <b-textarea
        v-model="row.item.lf_name"
        class="custom_input"
        placeholder="Не заполнено"
        @change="addCurrentLfName(row.item.lf_name)"
      />
    </template>
    <template v-slot:cell(synonym_map)="row">
      <div class="d-flex flex-column mb-4">
        <div v-for="(item, key) in row.item.synonym_map" :key="key" class="d-flex justify-content-between mb-2">
          <div class="d-flex hide-text">
            <span class="mr-2">{{ key + 1 }}.</span>
            <span class="hide-text">{{ item }}</span>
          </div>
          <div class="ml-2">
            <b-icon-trash class="m-0 h5 pointer" @click="removeSynonym(key)"></b-icon-trash>
          </div>
        </div>
        <div
          class="d-flex pointer mt-2"
          :class="lfNameInput ? 'justify-content-between align-items-center' : 'justify-content-end'"
        >
          <div class="w-100 mr-3">
            <b-input v-if="lfNameInput" v-model="lfNameValue" class="custom_input" placeholder="Введите наименование" />
          </div>
          <div>
            <b-icon-check-circle
              v-if="lfNameInput && lfNameValue"
              class="m-0 h4"
              @click="accessSynonym"
            ></b-icon-check-circle>
            <b-icon-x-circle
              v-else-if="lfNameInput && !lfNameValue"
              class="m-0 h4"
              @click="hideSynonymInput"
            ></b-icon-x-circle>
            <b-icon-plus-circle v-else-if="!lfNameInput" class="m-0 h4" @click="addSynonym"></b-icon-plus-circle>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:cell(edit)="row">
      <template v-if="source === 'add'">
        <b-icon-plus-circle
          v-if="addPossible"
          class="m-0 h4 pointer"
          variant="info"
          @click="createDosageForm(row.item)"
        ></b-icon-plus-circle>
        <b-icon-plus-circle v-else class="m-0 h4" variant="secondary"></b-icon-plus-circle>
      </template>
      <template v-else>
        <b-icon-pencil class="m-0 h4 pointer" variant="info" @click="editCurrentDosageForm(row.item)"></b-icon-pencil>
      </template>
    </template>
  </b-table>
</template>

<script>
export default {
  name: 'DosageFormAdding',
  props: {
    source: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      fields: [
        {
          key: 'lf_name',
          label: 'Лек. форма',
          class: 'align-middle',
        },
        {
          key: 'synonym_map',
          label: 'Экв. лек. форма',
          class: 'align-middle',
        },
        {
          key: 'edit',
          label: '',
          class: 'align-middle',
        },
      ],
      lfNameInput: false,
      lfNameValue: null,
    }
  },
  computed: {
    currentDosageForm() {
      return this.$store.getters['dosageForm/getCurrentDosageForm']
    },
    addPossible() {
      return this.currentDosageForm[0].lf_name && this.currentDosageForm[0].synonym_map.length
    },
  },
  methods: {
    addCurrentLfName(lfName) {
      this.$store.commit('dosageForm/ADD_CURRENT_LF_NAME', lfName)
    },
    createDosageForm(dosageForm) {
      this.$store.dispatch('dosageForm/createDosageForm', dosageForm)
    },
    editCurrentDosageForm(dosageForm) {
      this.$store.dispatch('dosageForm/editCurrentDosageForm', dosageForm)
    },
    removeSynonym(key) {
      this.$store.commit('dosageForm/REMOVE_CURRENT_SYNONYM', key)
    },
    accessSynonym() {
      this.$store.commit('dosageForm/ADD_CURRENT_SYNONYM', this.lfNameValue)
      this.lfNameInput = false
      this.lfNameValue = null
    },
    hideSynonymInput() {
      this.lfNameInput = false
    },
    addSynonym() {
      this.lfNameInput = true
    },
  },
}
</script>
