<template>
  <div class="w-100 d-flex align-items-center py-2 px-3 bg-gray-200 justify-content-between">
    <div class="d-flex justify-content-between w-100">
      <div class="d-flex align-items-center">
        <b-icon-arrow-clockwise class="text-align-center h4 mb-0 mr-4 pointer"></b-icon-arrow-clockwise>
        <b-icon-plus-circle
          v-b-toggle.sidebar-add-replacement
          class="text-align-center h5 mb-0 custom_button"
          @click="editCurrentReplacement"
        ></b-icon-plus-circle>
        <b-sidebar
          id="sidebar-add-replacement"
          bg-variant="gray-200"
          backdrop-variant="secondary"
          width="30%"
          backdrop
          right
          shadow=""
          lazy
        >
          <repl-adding source="add"></repl-adding>
        </b-sidebar>
      </div>
    </div>
  </div>
</template>

<script>
import ReplAdding from './ReplAdding'
export default {
  name: 'ReplFilter',
  components: { ReplAdding },
  methods: {
    editCurrentReplacement() {
      this.$store.commit('replacements/SAVE_CURRENT_REPLACEMENT', {
        mnn: [],
        lf_name: [],
        our_offer: null,
        how_recalculate: null,
        short_comment: null,
        full_comment: null,
      })
    },
  },
}
</script>
