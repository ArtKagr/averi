<template>
  <div class="d-flex flex-column overflow-hidden h-100 py-2 px-4">
    <div class="d-flex flex-column overflow-auto h-100">
      <div v-for="(message, key) in messages" :key="key">
        <div class="d-flex justify-content-between purchase_comment_class align-items-center w-100">
          <div class="mr-4">
            <b-icon-check-square
              v-if="message.complete"
              class="m-0 h4 pointer"
              variant="success"
              @click="toggleMessage(false, message)"
            ></b-icon-check-square>
            <b-icon-square v-else class="m-0 h4 pointer" @click="toggleMessage(true, message)"></b-icon-square>
          </div>
          <div class="d-flex flex-column pt-1 pb-2 pr-3 w-95">
            <div class="d-flex justify-content-end align-items-center mb-1">
              <p class="m-0 mr-1 font-weight-bold" style="font-size: 16px">{{ message.user.name }},</p>
              <p class="m-0 mr-4" style="font-size: 16px">{{ message.user.email }}</p>
              <p class="m-0" style="font-size: 16px">{{ $moment(message.created_at).format('DD.MM.YYYY HH:mm') }}</p>
            </div>
            <div class="mb-1">
              <p class="m-0" style="font-size: 14px">{{ message.message }}</p>
            </div>
            <img
              v-if="message.imgurl"
              class="comment-image pointer"
              :src="'https://app.eu39.ru/' + message.imgurl"
              :alt="`img${key}`"
              @click="openPurchaseMessage('https://app.eu39.ru/' + message.imgurl)"
            />
          </div>
          <b-icon-trash
            v-if="
              accessRight.role === 'administrators' ||
              accessRight.role === 'general_operators' ||
              accessRight.email === message.user.email
            "
            class="m-0 h4 pointer"
            @click="removeComment(message.id)"
          ></b-icon-trash>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center mt-4 w-100 mb-3">
      <div>
        <b-icon-eye-slash v-if="!showCanvas" class="m-0 h3 pointer mr-4" @click="toggleCanvasShowing(true)" />
      </div>
      <div class="d-flex flex-column w-100 mr-4">
        <div class="mr-3 w-100" :class="showCanvas ? 'mb-4' : ''">
          <b-form-textarea v-model="newComment" placeholder="Комментарий"></b-form-textarea>
        </div>
        <div
          class="d-flex w-100"
          :class="showCanvas ? '' : 'displayNone'"
          style="border: 1px solid #ced4da; border-radius: 5px; background: white"
        >
          <canvas id="mycanvas" style="width: 100%" />
          <div class="d-flex" style="position: absolute">
            <b-icon-eye class="m-0 h4 m-1 mt-2 ml-2 pointer" variant="indigo" @click="toggleCanvasShowing(false)" />
            <b-icon-trash
              v-if="pastedImage"
              class="m-0 h4 m-1 mt-2 ml-2 pointer"
              variant="indigo"
              @click="removeScreenshot"
            />
          </div>
          <div v-if="!pastedImage" class="d-flex flex-column canvas_title">
            <span class="m-auto w-100 h5">CTRL+C TO COPY LIGHTSHOT IMAGE</span>
            <span class="m-auto w-100 h5">CTRL+V TO PASTE IMAGE</span>
          </div>
        </div>
      </div>
      <b-icon-plus-circle
        v-if="newComment"
        class="m-0 h2 pointer"
        variant="info"
        @click="createComment"
      ></b-icon-plus-circle>
      <b-icon-plus-circle v-else class="m-0 h2" variant="secondary"></b-icon-plus-circle>
    </div>
    <b-modal
      id="purchaseMessage"
      size="xl"
      hide-header
      hide-footer
      body-class="p-0 h-100 overflow-hidden"
      content-class="h-100 custom_modal_purchase_message"
      footer-bg-variant="info"
    >
      <div class="d-flex justify-content-center">
        <img :src="purchaseMessage" alt="purchaseMessage" />
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'PurchaseMessages',
  data() {
    return {
      newComment: null,
      showCanvas: false,
      purchaseMessage: null,
    }
  },
  computed: {
    purchaseStatus() {
      return this.$store.getters['purchaseObject/getPurchaseStatus']
    },
    messages() {
      return this.$store.getters['purchaseObject/getPurchaseMessages']
    },
    accessRight() {
      return this.$access(this.$store.getters['dictionaries/getAuthUser'])
    },
    pastedImage() {
      return this.$store.getters['purchaseObject/getImgUrl']
    },
    purchaseObjectStatus() {
      return this.$store.getters['purchaseObject/getPurchaseObjectsStatus']
    },
  },
  watch: {
    purchaseObjectStatus(newValue) {
      if (newValue === 'purchase-message-created') {
        this.removeScreenshot()
        this.showCanvas = false
      }
    },
  },
  mounted() {
    const storeCommit = this.$store.commit
    function retrieveImageFromClipboardAsBlob(pasteEvent, callback) {
      if (pasteEvent.clipboardData === false) {
        if (typeof callback === 'function') {
          callback(undefined)
        }
      }
      const items = pasteEvent.clipboardData.items
      if (items === undefined) {
        if (typeof callback === 'function') {
          callback(undefined)
        }
      }
      for (let i = 0; i < items.length; i++) {
        if (!items[i].type.includes('image')) continue
        const blob = items[i].getAsFile()
        if (typeof callback === 'function') {
          callback(blob)
        }
      }
    }

    window.addEventListener(
      'paste',
      function (e) {
        retrieveImageFromClipboardAsBlob(e, function (imageBlob) {
          if (imageBlob) {
            const canvas = document.getElementById('mycanvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()
            img.onload = function () {
              canvas.width = this.width
              canvas.height = this.height
              ctx.drawImage(img, 0, 0)
            }
            const URLObj = window.URL || window.webkitURL
            img.src = URLObj.createObjectURL(imageBlob)
            storeCommit('purchaseObject/SAVE_CANVAS_IMAGE', imageBlob)
          }
        })
      },
      false
    )
  },
  destroyed() {
    this.$store.commit('purchaseObject/SAVE_CANVAS_IMAGE', null)
  },
  methods: {
    createComment() {
      this.$store.dispatch('purchaseObject/createPurchaseMessage', this.newComment)
      this.newComment = null
    },
    removeComment(commentId) {
      this.$store.dispatch('purchaseObject/removePurchaseMessage', commentId)
    },
    toggleMessage(flag, comment) {
      this.$store.dispatch('purchaseObject/updatePurchaseMessage', { flag, comment })
    },
    removeScreenshot() {
      const canvas = document.getElementById('mycanvas')
      const context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
      this.$store.commit('purchaseObject/SAVE_CANVAS_IMAGE', null)
    },
    toggleCanvasShowing(flag) {
      this.showCanvas = flag
    },
    openPurchaseMessage(imgString) {
      this.purchaseMessage = imgString
      this.$bvModal.show('purchaseMessage')
    },
  },
}
</script>
