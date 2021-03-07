<template>
  <b-table :fields="fields" :items="replacements" striped sticky-header="100%" class="w-100 m-0">
    <template v-slot:cell(npp)="row"> {{ row.index + 1 }}</template>
    <template v-slot:cell(mnn)="row">
      <div class="d-flex flex-column">
        <div v-for="(item, key) in row.item.mnn" :key="key">
          <span class="mr-1">{{ key + 1 }}.</span>
          <span>{{ item }}</span>
        </div>
      </div>
    </template>
    <template v-slot:cell(lf_name)="row">
      <div class="d-flex flex-column">
        <div v-for="(item, key) in row.item.lf_name" :key="key">
          <span class="mr-1">{{ key + 1 }}.</span>
          <span>{{ item }}</span>
        </div>
      </div>
    </template>
    <template v-slot:cell(edit)="row">
      <div class="d-flex">
        <b-icon-pencil
          v-b-toggle="[`sidebar-edit-replacement_${row.item.id}`]"
          class="m-0 h4 custom_button mr-3"
          @click="editCurrentReplacement(row.item)"
        ></b-icon-pencil>
        <b-sidebar
          :id="`sidebar-edit-replacement_${row.item.id}`"
          bg-variant="gray-200"
          backdrop-variant="secondary"
          width="30%"
          backdrop
          right
          shadow=""
          lazy
          @hidden="clearCurrentReplacement"
        >
          <repl-adding source="edit"></repl-adding>
        </b-sidebar>
        <b-icon-trash class="m-0 h4 custom_button" @click="removeReplacement"></b-icon-trash>
        <b-modal ref="remove-replacement" title="Удаление записи" @ok="removeReplacementAccess(row.item.id)">
          Удалить запись?
        </b-modal>
      </div>
    </template>
  </b-table>
</template>
<script>
import ReplAdding from './ReplAdding'
export default {
  name: 'ReplTable',
  components: { ReplAdding },
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
          key: 'mnn',
          label: 'МНН',
          class: 'align-middle w-15',
        },
        {
          key: 'lf_name',
          label: 'Лек. формы',
          class: 'align-middle w-15',
        },
        {
          key: 'our_offer',
          label: 'Наше возможное предложение',
          class: 'align-middle w-20',
        },
        {
          key: 'how_recalculate',
          label: 'Как пересчитать',
          class: 'align-middle w-10',
        },
        {
          key: 'short_comment',
          label: 'Краткий комментарий',
          class: 'align-middle w-10',
        },
        {
          key: 'full_comment',
          label: 'Полный комментарий',
          class: 'align-middle w-20',
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
    replacementsCopy() {
      return this.$store.getters['replacements/getReplacements']
    },
  },
  watch: {
    replacementsCopy(newValue) {
      this.replacements = newValue
    },
  },
  created() {
    this.replacements = this.$store.getters['replacements/getReplacements']
  },
  methods: {
    editCurrentReplacement(replacement) {
      this.$store.commit('replacements/SAVE_CURRENT_REPLACEMENT', replacement)
    },
    clearCurrentReplacement() {
      this.currentReplacement = {}
    },
    removeReplacement() {
      this.$refs['remove-replacement'].show()
    },
    removeReplacementAccess(replacementId) {
      this.$store.dispatch('replacements/removeCurrentReplacement', replacementId)
    },
  },
}
</script>
