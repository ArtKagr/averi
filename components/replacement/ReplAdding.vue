<template>
  <div class="d-flex w-100">
    <b-table class="w-100" :items="currentReplacement" :fields="fields" stacked striped>
      <template v-slot:cell(mnn)="row">
        <div class="d-flex flex-column mb-4">
          <div v-for="(item, key) in row.item.mnn" :key="key" class="d-flex justify-content-between mb-2">
            <div class="d-flex hide-text">
              <span class="mr-2">{{ key + 1 }}.</span>
              <span class="hide-text">{{ item }}</span>
            </div>
            <div class="ml-2">
              <b-icon-trash class="m-0 h5 pointer" @click="removeMnn(key)"></b-icon-trash>
            </div>
          </div>
          <div
            class="d-flex pointer mt-2"
            :class="mnnInput ? 'justify-content-between align-items-center' : 'justify-content-end'"
          >
            <div class="w-100 mr-3">
              <b-input v-if="mnnInput" v-model="mnnValue" class="custom_input" placeholder="Введите наименование" />
            </div>
            <div>
              <b-icon-check-circle v-if="mnnInput && mnnValue" class="m-0 h4" @click="accessMnn"></b-icon-check-circle>
              <b-icon-x-circle v-else-if="mnnInput && !mnnValue" class="m-0 h4" @click="hideMnnInput"></b-icon-x-circle>
              <b-icon-plus-circle v-else-if="!mnnInput" class="m-0 h4" @click="addMnn"></b-icon-plus-circle>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:cell(lf_name)="row">
        <div class="d-flex flex-column">
          <div v-for="(item, key) in row.item.lf_name" :key="key" class="d-flex justify-content-between mb-2">
            <div class="d-flex hide-text">
              <span class="mr-2">{{ key + 1 }}.</span>
              <span class="hide-text">{{ item }}</span>
            </div>
            <div class="ml-2">
              <b-icon-trash class="m-0 h5 pointer" @click="removeLfName(key)"></b-icon-trash>
            </div>
          </div>
          <div
            class="d-flex pointer mt-2"
            :class="lfInput ? 'justify-content-between align-items-center' : 'justify-content-end'"
          >
            <div class="w-100 mr-3">
              <b-input v-if="lfInput" v-model="lfValue" class="custom_input" placeholder="Введите наименование" />
            </div>
            <div>
              <b-icon-check-circle v-if="lfInput && lfValue" class="m-0 h4" @click="accessLfName"></b-icon-check-circle>
              <b-icon-x-circle v-else-if="lfInput && !lfValue" class="m-0 h4" @click="hideLfInput"></b-icon-x-circle>
              <b-icon-plus-circle v-else-if="!lfInput" class="m-0 h4" @click="addLfName"></b-icon-plus-circle>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:cell(our_offer)="row">
        <b-textarea v-model="row.item.our_offer" class="custom_input" placeholder="Не заполнено" />
      </template>
      <template v-slot:cell(how_recalculate)="row">
        <b-textarea v-model="row.item.how_recalculate" class="custom_input" placeholder="Не заполнено" />
      </template>
      <template v-slot:cell(short_comment)="row">
        <b-textarea v-model="row.item.short_comment" class="custom_input" placeholder="Не заполнено" />
      </template>
      <template v-slot:cell(full_comment)="row">
        <b-textarea v-model="row.item.full_comment" class="custom_input" placeholder="Не заполнено" />
      </template>
      <template v-slot:cell(edit)="row">
        <template v-if="source === 'add'">
          <b-icon-plus-circle
            v-if="addPossible"
            class="m-0 h4 pointer"
            variant="info"
            @click="createResponsible(row.item)"
          ></b-icon-plus-circle>
          <b-icon-plus-circle v-else class="m-0 h4" variant="secondary"></b-icon-plus-circle>
        </template>
        <template v-else>
          <b-icon-pencil
            class="m-0 h4 pointer"
            variant="info"
            @click="editCurrentResponsible(row.item)"
          ></b-icon-pencil>
        </template>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'ReplAdding',
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
          key: 'mnn',
          label: 'МНН',
          class: 'align-middle',
        },
        {
          key: 'lf_name',
          label: 'Лек. формы',
          class: 'align-middle',
        },
        {
          key: 'our_offer',
          label: 'Наше возможное предложение',
          class: 'align-middle',
        },
        {
          key: 'how_recalculate',
          label: 'Как пересчитать',
          class: 'align-middle',
        },
        {
          key: 'short_comment',
          label: 'Краткий комментарий',
          class: 'align-middle',
        },
        {
          key: 'full_comment',
          label: 'Полный комментарий',
          class: 'align-middle',
        },
        {
          key: 'edit',
          label: '',
          class: 'align-middle',
        },
      ],
      mnnInput: false,
      mnnValue: null,
      lfInput: false,
      lfValue: null,
    }
  },
  computed: {
    currentReplacement() {
      return this.$store.getters['replacements/getCurrentReplacement']
    },
    addPossible() {
      return (
        this.currentReplacement[0].mnn.length &&
        this.currentReplacement[0].lf_name.length &&
        this.currentReplacement[0].our_offer &&
        this.currentReplacement[0].how_recalculate &&
        this.currentReplacement[0].short_comment &&
        this.currentReplacement[0].full_comment
      )
    },
  },
  methods: {
    createResponsible(responsible) {
      this.$store.dispatch('replacements/createReplacement', responsible)
    },
    editCurrentResponsible(responsible) {
      this.$store.dispatch('replacements/editCurrentResponsible', responsible)
    },
    addMnn() {
      this.mnnInput = true
    },
    accessMnn() {
      this.$store.commit('replacements/ADD_CURRENT_MNN', this.mnnValue)
      this.mnnInput = false
      this.mnnValue = null
    },
    removeMnn(key) {
      this.$store.commit('replacements/REMOVE_CURRENT_MNN', key)
    },
    hideMnnInput() {
      this.mnnInput = false
    },
    addLfName() {
      this.lfInput = true
    },
    accessLfName() {
      this.$store.commit('replacements/ADD_CURRENT_LF_NAME', this.lfValue)
      this.lfInput = false
      this.lfValue = null
    },
    removeLfName(key) {
      this.$store.commit('replacements/REMOVE_CURRENT_LF_NAME', key)
    },
    hideLfInput() {
      this.lfInput = false
    },
  },
}
</script>
