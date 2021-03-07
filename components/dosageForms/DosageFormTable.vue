<template>
  <b-table :fields="fields" :items="dosageForms" striped sticky-header="100%" class="w-100 m-0">
    <template v-slot:cell(npp)="row"> {{ row.index + 1 }}</template>
    <template v-slot:cell(synonym_map)="row">
      <div class="d-flex flex-column">
        <div v-for="(item, key) in row.item.synonym_map" :key="key">
          <span class="mr-1">{{ key + 1 }}.</span>
          <span>{{ item }}</span>
        </div>
      </div>
    </template>
    <template v-slot:cell(edit)="row">
      <div class="d-flex">
        <b-icon-pencil
          v-b-toggle="[`sidebar-edit-dosage_form_${row.item.id}`]"
          class="m-0 h4 custom_button mr-3"
          @click="editCurrentDosageForm(row.item)"
        ></b-icon-pencil>
        <b-sidebar
          :id="`sidebar-edit-dosage_form_${row.item.id}`"
          bg-variant="gray-200"
          backdrop-variant="secondary"
          width="30%"
          backdrop
          right
          shadow=""
          lazy
          @hidden="clearCurrentDosageForm"
        >
          <dosage-form-adding source="edit"></dosage-form-adding>
        </b-sidebar>
        <b-icon-trash class="m-0 h4 custom_button" @click="removeDosageForm"></b-icon-trash>
        <b-modal ref="remove-dosage_from" title="Удаление записи" @ok="removeDosageFormAccess(row.item.id)">
          Удалить запись?
        </b-modal>
      </div>
    </template>
  </b-table>
</template>
<script>
import DosageFormAdding from './DosageFormAdding'
export default {
  name: 'DosageFormTable',
  components: { DosageFormAdding },
  data() {
    return {
      replacements: [],
      fields: [
        {
          key: 'npp',
          label: '№ п/п',
          class: 'align-middle w-5',
        },
        {
          key: 'lf_name',
          label: 'Таблетки',
          class: 'align-middle w-30',
        },
        {
          key: 'synonym_map',
          label: 'Эквивалентная лек. форма',
          class: 'align-middle w-60',
        },
        {
          key: 'edit',
          label: '',
          class: 'align-middle w-5',
        },
      ],
    }
  },
  computed: {
    dosageForms() {
      return this.$store.getters['dosageForm/getDosageForms']
    },
  },
  methods: {
    editCurrentDosageForm(dosageForm) {
      this.$store.commit('dosageForm/SAVE_CURRENT_DOSAGE_FORM', dosageForm)
    },
    clearCurrentDosageForm() {
      this.$store.commit('dosageForm/SAVE_CURRENT_DOSAGE_FORM', {})
    },
    removeDosageForm() {
      this.$refs['remove-dosage_from'].show()
    },
    removeDosageFormAccess(dosageFormId) {
      this.$store.dispatch('dosageForm/removeCurrentDosageForm', dosageFormId)
    },
  },
}
</script>
