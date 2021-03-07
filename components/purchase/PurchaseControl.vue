<template>
  <div class="d-flex justify-content-between bg-gray-200 align-items-center px-3" :style="'height: 5vh;'">
    <div :class="['d-flex w-100', source === 'purchase_modal' ? 'justify-content-between' : 'justify-content-end']">
      <template v-if="source === 'purchase_modal'">
        <div class="d-flex align-items-center">
          <b-icon-arrow-clockwise
            class="h5 m-0 pointer mr-2"
            :class="purchaseMatchingStatus === 'fetching' ? '-loader' : ''"
            @click="updatePurchaseModal"
          ></b-icon-arrow-clockwise>
          <div class="d-flex align-items-center">
            <b-icon-person-fill class="text-align-center h5 mb-0 pointer"></b-icon-person-fill>
            <b-dropdown
              v-if="accessRight.role === 'administrators' || accessRight.role === 'general_operators' || false"
              size="md"
              variant="link"
              toggle-class="text-decoration-none p-0 custom_button"
              no-caret
            >
              <template v-slot:button-content>
                <span class="ml-2 mr-3" style="font-size: 13px">{{ selectedUser ? selectedUser : 'не выбран' }}</span>
              </template>
              <template v-for="(user, key) in userSet.users">
                <b-dd-item-btn
                  :key="key"
                  button-class="d-flex flex-row custom_dropdown_item"
                  @click="setCurrentUser(user)"
                >
                  <div class="flex-fill text-left mr-2">{{ user.title }}</div>
                </b-dd-item-btn>
              </template>
            </b-dropdown>
            <span v-else class="ml-2" style="font-size: 13px">{{
              currentPurchase && currentPurchase.user && currentPurchase.user.name
                ? currentPurchase.user.name
                : 'Не назначен'
            }}</span>
          </div>
          <div v-if="currentPurchase.is_manual || purchase223.includes(purchaseType)" class="d-flex text-center">
            <b-dd
              id="dropdown-purchase_status"
              :lazy="true"
              toggle-class="p-0 text-center mb-0 mr-4 custom_button"
              variant="link"
              boundary="viewport"
            >
              <template v-slot:button-content>
                <span style="font-size: 14px">{{ currentRegion.region_name }}</span>
              </template>
              <template v-for="(region, key) in regions">
                <b-dd-item-btn
                  :key="key"
                  button-class="d-flex flex-row custom_dropdown_item"
                  :active="currentRegion.surcharge_id === region.id"
                  @click="addRegion(region)"
                >
                  <div class="flex-fill text-left mr-2">
                    {{ region && region.region_name ? region.region_name : 'не указан' }}
                  </div>
                </b-dd-item-btn>
              </template>
            </b-dd>
          </div>
          <span v-else style="width: 200px; font-size: 14px" class="hide-text">{{ currentRegion.region_name }}</span>
        </div>
      </template>
      <div class="d-flex align-items-center">
        <div class="d-flex align-items-center mr-4">
          <div v-if="currentPurchase.is_manual || purchase223.includes(purchaseType)" class="d-flex align-items-center">
            <b-dropdown size="md" variant="link" toggle-class="text-decoration-none p-0 custom_button" no-caret>
              <template v-slot:button-content>
                <b-icon-shop-window class="text-align-center h4 mb-0 pointer"></b-icon-shop-window>
              </template>
              <template v-for="(tradingPlace, key) in tradingPlaces">
                <b-dd-item-btn
                  :key="key"
                  button-class="d-flex flex-row custom_dropdown_item"
                  @click="setTradingPlace(tradingPlace)"
                >
                  <div class="flex-fill text-left mr-2">
                    {{ tradingPlace && tradingPlace.name ? tradingPlace.name : 'не указана' }}
                  </div>
                </b-dd-item-btn>
              </template>
            </b-dropdown>
            <p id="editable_place" class="m-0 ml-2 hide-text pointer" style="font-size: 13px; width: 100px">
              {{ currentTradingPlace && currentTradingPlace.name ? currentTradingPlace.name : 'Укажите площадку' }}
            </p>
            <b-tooltip target="editable_place" placement="left">
              {{ currentTradingPlace && currentTradingPlace.name ? currentTradingPlace.name : 'Укажите площадку' }}
            </b-tooltip>
          </div>
          <div v-else class="d-flex align-items-center">
            <b-icon-shop-window class="h5 m-0 mr-2"></b-icon-shop-window>
            <p id="not_editable_place" class="m-0 ml-2 hide-text pointer" style="font-size: 13px; width: 100px">
              {{
                currentPurchase && currentPurchase.etp && currentPurchase.etp.name
                  ? currentPurchase.etp.name
                  : 'Укажите площадку'
              }}
            </p>
            <b-tooltip target="not_editable_place" placement="left">
              {{
                currentPurchase && currentPurchase.etp && currentPurchase.etp.name
                  ? currentPurchase.etp.name
                  : 'Укажите площадку'
              }}
            </b-tooltip>
          </div>
        </div>
        <div class="d-flex align-items-center mr-3">
          <div v-if="currentPurchase.is_manual" class="d-flex align-items-center mr-2">
            <a
              class="d-flex"
              :href="`http://zakupki.gov.ru/epz/order/notice/ea44/view/documents.html?regNumber=${currentPurchase.purchase_number_manual}`"
              target="_blank"
            >
              <b-icon-book
                id="purchase_system_info"
                class="h5 m-0 pointer custom_button"
                variant="secondary"
              ></b-icon-book>
              <b-tooltip target="purchase_system_info" placement="bottom">
                <div class="d-flex flex-column">
                  <div class="d-flex flex-column text-left mb-2">
                    <span class="text-left mb-1 h5">Объект закупки:</span>
                    <span class="text-left several_lines_purchase_info">{{
                      currentPurchase && currentPurchase.purchase_object_info
                        ? currentPurchase.purchase_object_info
                        : 'не указан'
                    }}</span>
                  </div>
                  <div class="d-flex flex-column text-left mb-2">
                    <span class="text-left mb-1 h5">Место поставки:</span>
                    <span class="text-left several_lines_purchase_info">{{
                      currentPurchase && currentPurchase.delivery_place ? currentPurchase.delivery_place : 'не указан'
                    }}</span>
                  </div>
                  <div class="d-flex flex-column text-left">
                    <span class="text-left mb-1 h5">Условия поставки:</span>
                    <span class="text-left several_lines_purchase_info">{{
                      currentPurchase && currentPurchase.delivery_term ? currentPurchase.delivery_term : 'не указан'
                    }}</span>
                  </div>
                </div>
              </b-tooltip>
            </a>
            <span v-if="purchaseNumberControl" class="d-flex align-items-center">
              <b-input-group class="mr-1 filter">
                <b-form-input
                  v-model="purchaseNumber"
                  placeholder="Сумма"
                  style="width: 80px"
                  @blur="changePurchaseNumberControl"
                ></b-form-input>
              </b-input-group>
            </span>
            <span v-else class="ml-2" @click="changePurchaseNumberControl">{{ purchaseNumber }}</span>
          </div>
          <div v-else class="d-flex align-items-center">
            <a
              class="d-flex"
              :href="
                purchase223.includes(purchaseType)
                  ? `https://zakupki.gov.ru/223/purchase/public/purchase/info/common-info.html?regNumber=${currentPurchase.registration_number}`
                  : `http://zakupki.gov.ru/epz/order/notice/ea44/view/documents.html?regNumber=${currentPurchase.purchase_number}`
              "
              target="_blank"
            >
              <b-icon-book
                id="purchase_system_info_2"
                class="h5 m-0 pointer custom_button"
                variant="secondary"
              ></b-icon-book>
              <b-tooltip target="purchase_system_info_2" placement="bottom">
                <div class="d-flex flex-column">
                  <div class="d-flex flex-column text-left mb-2">
                    <span class="text-left mb-1 h5">Объект закупки:</span>
                    <span class="text-left several_lines_purchase_info">{{
                      currentPurchase && currentPurchase.purchase_object_info
                        ? currentPurchase.purchase_object_info
                        : 'не указан'
                    }}</span>
                  </div>
                  <div class="d-flex flex-column text-left mb-2">
                    <span class="text-left mb-1 h5">Место поставки:</span>
                    <span class="text-left several_lines_purchase_info">{{
                      currentPurchase && currentPurchase.delivery_place ? currentPurchase.delivery_place : 'не указан'
                    }}</span>
                  </div>
                  <div class="d-flex flex-column text-left">
                    <span class="text-left mb-1 h5">Условия поставки:</span>
                    <span class="text-left several_lines_purchase_info">{{
                      currentPurchase && currentPurchase.delivery_term ? currentPurchase.delivery_term : 'не указан'
                    }}</span>
                  </div>
                </div>
              </b-tooltip>
            </a>
            <span class="ml-2">{{
              currentPurchase && currentPurchase.purchase_number !== '0000000000000000000'
                ? currentPurchase.purchase_number
                : currentPurchase.registration_number
                ? currentPurchase.registration_number
                : 'не указан'
            }}</span>
          </div>
        </div>
        <div v-if="kladrIds.length > 1" class="d-flex">
          <b-icon-building
            v-b-toggle="[`sidebar_multiply_delivery`]"
            class="h5 m-0 mr-1 pointer custom_button"
          ></b-icon-building>
          <p class="m-0 ml-2 pointer hide-text" style="font-size: 13px; width: 150px">В несколько пунктов</p>
        </div>
        <purchase-delivery-drop-down v-else source="purchase-control"></purchase-delivery-drop-down>
        <div v-if="currentPurchase.is_manual" class="d-flex align-items-center mr-2">
          <b-dropdown size="md" variant="link" toggle-class="text-decoration-none p-0 custom_button" no-caret>
            <template v-slot:button-content>
              <template v-if="currentCustomer.comment">
                <b-icon-house-door id="editable_customer_comment" class="h5 m-0" variant="indigo"></b-icon-house-door>
                <b-tooltip target="editable_customer_comment" placement="left">
                  {{ currentCustomer && currentCustomer.comment ? currentCustomer.comment : 'не указан' }}
                </b-tooltip>
              </template>
              <b-icon-house-door v-else class="h5 m-0" variant="secondary"></b-icon-house-door>
            </template>
            <div class="d-flex flex-column h-100 w-100 overflow-hidden">
              <div class="d-flex align-self-start w-100 px-3 pb-3">
                <b-input-group class="filter mr-3">
                  <b-form-input v-model="customersFilter.inn" placeholder="ИНН"></b-form-input>
                  <b-input-group-append>
                    <b-button
                      size="sm"
                      :variant="customersFilter.inn ? 'info' : 'secondary'"
                      @click="clearCustomersFilterField('inn')"
                      >X</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
                <b-input-group class="filter">
                  <b-form-input v-model="customersFilter.name" placeholder="Наименование"></b-form-input>
                  <b-input-group-append>
                    <b-button
                      size="sm"
                      :variant="customersFilter.name ? 'info' : 'secondary'"
                      @click="clearCustomersFilterField('name')"
                      >X</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </div>
              <div v-if="!customers.length" class="d-flex justify-content-center" style="width: 400px">
                <span>Результатов не найдено</span>
              </div>
              <div v-else class="d-flex align-self-end overflow-hidden flex-column">
                <div class="overflow-auto" style="max-height: 200px">
                  <b-dd-item-btn v-for="(customer, key) in customers" :key="key" @click="setCurrentCustomer(customer)">
                    <div class="d-flex justify-content-between mb-2" style="font-size: 11px; width: 400px">
                      {{ customer && customer.full_name ? customer.full_name : 'не указано' }}
                    </div>
                  </b-dd-item-btn>
                </div>
              </div>
            </div>
          </b-dropdown>
          <p id="editable_customer" class="m-0 ml-2 hide-text pointer" style="font-size: 13px; width: 200px">
            {{ currentCustomer && currentCustomer.full_name ? currentCustomer.full_name : 'Укажите заказчика' }}
          </p>
          <b-tooltip target="editable_customer" placement="left" custom-class="tooltip_class">
            <div class="d-flex flex-column">
              <div>
                {{ currentCustomer && currentCustomer.full_name ? currentCustomer.full_name : 'Укажите заказчика' }}
              </div>
              <div class="mt-2">
                <b-input-group class="filter">
                  <b-form-input v-model="currentCustomer.comment" placeholder="Комментарий"></b-form-input>
                  <b-button
                    v-if="currentCustomer.comment"
                    size="sm"
                    variant="info"
                    @click="setCustomerComment(currentCustomer)"
                  >
                    <b-icon-caret-right class="m-0 h5"></b-icon-caret-right>
                  </b-button>
                  <b-button v-else size="sm" variant="secondary" disabled>
                    <b-icon-caret-right class="m-0 h5"></b-icon-caret-right>
                  </b-button>
                </b-input-group>
              </div>
            </div>
          </b-tooltip>
        </div>
        <div v-else class="d-flex align-items-center mr-2">
          <template v-if="currentCustomer.comment">
            <b-icon-house-door id="not_editable_customer_comment" class="h5 m-0" variant="indigo"></b-icon-house-door>
            <b-tooltip target="not_editable_customer_comment" placement="left">
              {{ currentCustomer && currentCustomer.comment ? currentCustomer.comment : 'не указан' }}
            </b-tooltip>
          </template>
          <b-icon-house-door v-else class="h5 m-0" variant="secondary"></b-icon-house-door>
          <p id="not_editable_customer" class="m-0 ml-2 hide-text pointer" style="font-size: 13px; width: 200px">
            {{ currentCustomer && currentCustomer.full_name ? currentCustomer.full_name : 'Укажите заказчика' }}
          </p>
          <b-tooltip target="not_editable_customer" placement="left">
            <div class="d-flex flex-column">
              <div>
                {{ currentCustomer && currentCustomer.full_name ? currentCustomer.full_name : 'Укажите заказчика' }}
              </div>
              <div v-if="accessRight && accessRight.role === 'administrators'" class="mt-2">
                <b-input-group class="filter">
                  <b-form-input v-model="currentCustomer.comment" placeholder="Комментарий"></b-form-input>
                  <b-button
                    v-if="currentCustomer.comment"
                    size="sm"
                    variant="info"
                    @click="setCustomerComment(currentCustomer)"
                  >
                    <b-icon-caret-right class="m-0 h5"></b-icon-caret-right>
                  </b-button>
                  <b-button v-else size="sm" variant="secondary" disabled>
                    <b-icon-caret-right class="m-0 h5"></b-icon-caret-right>
                  </b-button>
                </b-input-group>
              </div>
            </div>
          </b-tooltip>
        </div>
        <div class="d-flex align-items-center mr-2" style="width: 140px">
          <div class="mr-2">
            <b-icon-calendar2-event
              class="h5 m-0"
              :variant="currentPurchase.has_date_refresh ? 'indigo' : ''"
            ></b-icon-calendar2-event>
          </div>
          <div>
            <datepicker
              v-model="endDate"
              :placeholder="
                currentPurchase && currentPurchase.end_date
                  ? $moment(currentPurchase.end_date).format('DD.MM.YYYY HH:mm')
                  : 'Не указана'
              "
              type="datetime"
              format="DD.MM.YYYY HH:mm"
              :clearable="false"
              value-type="timestamp"
              class="w-100 custom_datepicker"
            ></datepicker>
          </div>
        </div>
        <div class="d-flex align-items-center" style="width: 140px">
          <div class="mr-2">
            <b-icon-calendar-check
              class="h5 m-0 pointer"
              :variant="currentPurchase.has_date_refresh ? 'indigo' : ''"
              @click="updateBiddingDate"
            ></b-icon-calendar-check>
          </div>
          <div>
            <datepicker
              v-model="biddingDate"
              :placeholder="
                currentPurchase && currentPurchase.bidding_date
                  ? $moment(currentPurchase.bidding_date).format('DD.MM.YYYY HH:mm')
                  : 'Не указана'
              "
              type="datetime"
              format="DD.MM.YYYY HH:mm"
              :clearable="false"
              value-type="timestamp"
              class="w-100 custom_datepicker"
            ></datepicker>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center ml-2">
        <template>
          <div class="d-flex text-center mr-3">
            <b-dd
              id="dropdown-purchase_types"
              :lazy="true"
              toggle-class="p-0 text-center mb-0 mr-2 custom_button"
              variant="link"
              boundary="viewport"
              :disabled="!currentPurchase.is_manual"
            >
              <template v-slot:button-content>
                <span style="font-size: 14px">{{
                  currentFcsType && currentFcsType.title ? currentFcsType.title : 'Не выбрана'
                }}</span>
              </template>
              <template v-for="(filter, key) in filters.purchase_types">
                <b-dd-item-btn
                  v-if="filter && filter.fcs_type && currentFcsType && currentFcsType.fcs_type"
                  :key="key"
                  :active="filter.fcs_type === currentFcsType.fcs_type"
                  button-class="d-flex flex-row custom_dropdown_item"
                  @click="updateFcsType(filter)"
                >
                  <div class="flex-fill text-left mr-2">
                    {{ filter && filter.title ? filter.title : 'Не выбрана' }}
                  </div>
                </b-dd-item-btn>
                <b-dd-item-btn
                  v-else
                  :key="key"
                  button-class="d-flex flex-row custom_dropdown_item"
                  @click="updateFcsType(filter)"
                >
                  <div class="flex-fill text-left mr-2">
                    {{ filter && filter.title ? filter.title : 'Не выбрана' }}
                  </div>
                </b-dd-item-btn>
              </template>
            </b-dd>
          </div>
          <div class="d-flex align-items-center mr-3">
            <b-dd
              id="dropdown-purchase_status"
              :lazy="true"
              toggle-class="p-0 text-center mb-0 mr-4 custom_button"
              variant="link"
              boundary="viewport"
              :disabled="!purchaseValueZnvlp && isZnvlpPurchase"
            >
              <template v-slot:button-content>
                <span
                  style="font-size: 14px"
                  :class="currentPurchase.bot_status_slug === purchaseStatusFilter.status ? 'bot_purchase' : ''"
                  >{{
                    purchaseStatusFilter && purchaseStatusFilter.title ? purchaseStatusFilter.title : 'не указан'
                  }}</span
                >
              </template>
              <template v-for="(filter, key) in filters.purchase_status">
                <b-dd-item-btn
                  :key="key"
                  :active="filter.status === purchaseStatusFilter.status"
                  button-class="d-flex flex-row custom_dropdown_item"
                  @click="updatePurchaseStatus(filter)"
                >
                  <div class="flex-fill text-left mr-2">
                    {{ filter && filter.title ? filter.title : 'Не выбрана' }}
                  </div>
                </b-dd-item-btn>
              </template>
            </b-dd>
          </div>
          <b-icon-journal-plus class="h5 m-0 pointer mr-3" @click="addEmptyPurchaseObject"></b-icon-journal-plus>
          <b-icon-archive class="h5 m-0 pointer mr-3" @click="archivePurchase"> </b-icon-archive>
          <b-icon-folder
            v-if="!purchaseValueZnvlp && isZnvlpPurchase"
            variant="secondary"
            class="h5 m-0 mr-3"
          ></b-icon-folder>
          <b-icon-folder-check v-else variant="success" class="h5 m-0 mr-3 pointer" @click="updatePurchase">
          </b-icon-folder-check>
        </template>
        <b-icon-x
          v-if="accessRight.role === 'purchasing_operators'"
          class="h5 m-0 pointer"
          @click="showPurchaseCloseModal"
        >
        </b-icon-x>
        <b-icon-x v-else class="h5 m-0 pointer" @click="closePurchaseModal"> </b-icon-x>
      </div>
    </div>
    <b-sidebar id="edit-purchase" bg-variant="gray-200" backdrop-variant="secondary" backdrop right shadow>
      <purchase-add source="purchase_modal" />
    </b-sidebar>
    <b-modal
      ref="purchase-modal-archive-close"
      title="Закрытие и архивирование закупки"
      @ok="closeArchivePurchaseModal"
    >
      <p class="my-4 h5 font-weight-bold">
        Закрыть закупку и переместить в папку
        {{ accessRight.role === 'purchasing_operators' ? 'Не участвуем' : 'Проверка архива' }}?
      </p>
      <div class="d-flex flex-column px-2 mb-4">
        <span class="font-weight-bold mb-4">Причины архивирования:</span>
        <span class="pointer" @click="setArchiveReason(purchaseCustom.comment ? '. Нет товара' : 'Нет товара')"
          >1. Нет товара</span
        >
        <span class="pointer" @click="setArchiveReason(purchaseCustom.comment ? '. Мало товара' : 'Мало товара')"
          >2. Мало товара</span
        >
        <span class="pointer" @click="setArchiveReason(purchaseCustom.comment ? '. Нерентабельно' : 'Нерентабельно')"
          >3. Нерентабельно</span
        >
        <span class="pointer" @click="setArchiveReason(purchaseCustom.comment ? '. Не наш профиль' : 'Не наш профиль')"
          >4. Не наш профиль</span
        >
        <span
          class="pointer"
          @click="setArchiveReason(purchaseCustom.comment ? '. Нет цены производителя' : 'Нет цены производителя')"
          >5. Нет цены производителя</span
        >
        <span
          class="pointer"
          @click="setArchiveReason(purchaseCustom.comment ? '. Поставка по рецептам' : 'Поставка по рецептам')"
          >6. Поставка по рецептам</span
        >
        <span
          class="pointer"
          @click="
            setArchiveReason(
              purchaseCustom.comment ? '. В техзадании не указано количество' : 'В техзадании не указано количество'
            )
          "
          >7. В техзадании не указано количество</span
        >
        <span
          class="pointer"
          @click="
            setArchiveReason(
              purchaseCustom.comment ? '. Определение поставщика отменено' : 'Определение поставщика отменено'
            )
          "
          >8. Определение поставщика отменено</span
        >
        <span class="pointer" @click="setArchiveReason(purchaseCustom.comment ? '. Дубль закупки' : 'Дубль закупки')"
          >9. Дубль закупки</span
        >
        <span class="pointer" @click="setArchiveReason(purchaseCustom.comment ? '. Иная причина' : 'Иная причина')"
          >10. Иная причина</span
        >
      </div>
      <div class="d-flex align-items-center">
        <b-input-group class="filter">
          <b-textarea v-model="purchaseCustom.comment" placeholder="Комментарий"></b-textarea>
        </b-input-group>
      </div>
    </b-modal>
    <b-modal
      ref="purchase-modal-close"
      title="Закрытие закупки"
      :body-bg-variant="
        priceRequireValueWarning ? 'warning' : replacementStatus && replacementPurchaseStatus ? 'info' : 'light'
      "
      :centered="priceRequireValueWarning || (replacementStatus && replacementPurchaseStatus)"
      @ok="closePurchaseModal"
    >
      <p v-if="priceRequireValueWarning" class="my-4 font-weight-bold h4">
        У одной или нескольких позиций прайса потребность товара 0 или 1
      </p>
      <p v-else-if="replacementStatus && replacementPurchaseStatus" class="my-4 font-weight-bold h4">
        У одного или нескольких объектов закупки присутствует эквивалентная замена
      </p>
      <p v-else class="my-4">Закрыть закупку? Не сохраненные изменения будут утеряны</p>
    </b-modal>
    <b-modal
      ref="purchase-status-change"
      title="Предупреждение"
      body-bg-variant="warning"
      centered
      @ok="acceptPuschaseStatusChange"
    >
      <p class="my-4 h5 font-weight-bold">Закупка не выгодна. Переместить в выбранную папку?</p>
    </b-modal>
    <b-sidebar
      id="sidebar_multiply_delivery"
      no-header
      bg-variant="gray-200"
      width="30%"
      backdrop-variant="secondary"
      backdrop
      right
      shadow=""
      lazy
      @shown="multiplyDeliveryToggle"
      @hidden="multiplyDeliveryClose"
    >
      <template v-slot:footer="{ hide }">
        <div class="d-flex justify-content-end p-4">
          <b-icon-intersect
            id="once_delivery"
            class="m-0 h4 pointer custom_button"
            @click="onceDelivery(hide)"
          ></b-icon-intersect>
          <b-tooltip target="once_delivery" placement="left"> Доставка в один пункт </b-tooltip>
        </div>
      </template>
      <purchase-multiply-delivery></purchase-multiply-delivery>
    </b-sidebar>
  </div>
</template>

<script>
import PurchaseAdd from './PurchaseAdd'
import PurchaseMultiplyDelivery from './PurchaseMultiplyDelivery'
import PurchaseDeliveryDropDown from './PurchaseDeliveryDropDown'
export default {
  name: 'PurchaseControl',
  components: { PurchaseDeliveryDropDown, PurchaseMultiplyDelivery, PurchaseAdd },
  props: {
    source: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      selectedUser: 'Сотрудник не выбран',
      selectedUserId: null,
      kladrFilter: {},
      currentLocality: { id: null, name: 'Укажите населённый пункт' },
      filters: {},
      filterName: {},
      statusFilter: {},
      endDate: null,
      biddingDate: null,
      purchaseStatusFilter: { title: 'Все папки', status: null },
      selectedPurchaseStatus: { title: 'Все папки', status: null },
      currentTradingPlace: { etp_code: 0, name: 'Не указана' },
      currentRegion: {},
      currentFcsType: {},
      purchaseNumberControl: false,
      purchaseNumber: null,
      customersFilter: {},
      currentCustomer: {},
      purchaseCustom: {
        comment: '',
      },
    }
  },
  computed: {
    purchase223() {
      return this.$store.getters['purchase/getPurchase223'] || []
    },
    purchaseType() {
      return this.$store.getters['purchaseObject/getCurrentPurchase'].purchase_custom.fcs_type
    },
    replacementPurchaseStatus() {
      return (
        this.purchaseStatusFilter.status === 'new' ||
        this.purchaseStatusFilter.status === 'processed' ||
        this.purchaseStatusFilter.status === 'control' ||
        this.purchaseStatusFilter.status === 'check' ||
        this.purchaseStatusFilter.status === 'verified' ||
        this.purchaseStatusFilter.status === 'formalized' ||
        this.purchaseStatusFilter.status === 'ready' ||
        this.purchaseStatusFilter.status === 'not_play' ||
        this.purchaseStatusFilter.status === 'check_archive'
      )
    },
    replacementStatus() {
      return this.$store.getters['purchaseObject/getReplacementValue']
    },
    currentPurchaseProfitability() {
      return this.$store.getters['purchaseObject/getCurrentPurchaseProfitability']
    },
    netProfitException() {
      return this.$store.getters['purchaseObject/getNetProfitException']
    },
    purchaseValueZnvlp() {
      return this.isZnvlpPurchase
        ? this.$store.getters['purchaseObject/getPurchaseValueZnvlp'].reduce(function (preVal, value) {
            return preVal + value
          }, 0)
        : 0
    },
    isZnvlpPurchase() {
      return JSON.parse(JSON.stringify(this.$store.getters['purchaseObject/getZnvlpPurchaseStatus']))
    },
    priceRequireValue() {
      return this.$store.getters['purchaseObject/getPriceRequireValue']
    },
    priceRequireValueWarning() {
      return this.priceRequireValue.includes(0) || this.priceRequireValue.includes(1)
    },
    kladrIds() {
      return this.$store.getters['purchaseObject/getKladrIds']
    },
    multiplyDelivery() {
      return this.$store.getters['purchaseObject/getMultiplyDelivery']
    },
    deliveryObjects() {
      return this.$store.getters['purchaseObject/getDeliveryObjects']
    },
    currentCustomerCopy() {
      return this.$store.getters['dictionaries/getCurrentCustomer']
    },
    customersFilterCopy() {
      return this.$store.getters['dictionaries/getCustomersFilter']
    },
    currentLocalityCopy() {
      return this.$store.getters['purchaseObject/getCurrentLocality']
    },
    purchaseNumberCopy() {
      return this.$store.getters['purchaseObject/getPurchaseNumberManual']
    },
    currentFcsTypeCopy() {
      return this.$store.getters['purchaseObject/getCurrentFcsType']
    },
    currentRegionCopy() {
      return this.$store.getters['purchaseObject/getCurrentRegion']
    },
    priceStatus() {
      return this.$store.getters['price/getPriceStatus']
    },
    purchaseObjectStatus() {
      return this.$store.getters['purchaseObject/getPurchaseObjectStatus']
    },
    getPriceObjects() {
      return this.$store.getters['priceObject/getPriceObjects']
    },
    getFetchedPurchaseObject() {
      return this.$store.getters['purchaseObject/getFetchedPurchaseObject']
    },
    customers() {
      return this.$store.getters['dictionaries/getCustomers']
    },
    purchaseMatchingStatus() {
      return this.$store.state.priceObject.status
    },
    currentPurchase() {
      return this.$store.getters['purchaseObject/getCurrentPurchase']
    },
    locality() {
      return this.$store.getters['purchaseObject/getLocality']
    },
    getKladrFilter() {
      return this.$store.getters['purchaseObject/getKladrFilter']
    },
    staticFiltersData() {
      return this.$store.getters['purchase/getFilters']
    },
    filtersName() {
      return this.$store.getters['purchase/getFilterName']
    },
    purchaseStatusFilterCopy() {
      return this.$store.getters['purchaseObject/getPurchaseStatus']
    },
    endDateCopy() {
      return this.$store.getters['purchaseObject/getEndDate']
    },
    biddingDateCopy() {
      return this.$store.getters['purchaseObject/getBiddingDate']
    },
    tradingPlaces() {
      return this.$store.getters['purchase/getTradingPlaces']
    },
    currentTradingPlaceCopy() {
      return this.$store.getters['purchaseObject/getCurrentTradingPlace']
    },
    regions() {
      return this.$store.getters['surcharge/getRegions']
    },
    accessRight() {
      return this.$access(this.$store.getters['dictionaries/getAuthUser'])
    },
    userSet() {
      return this.$store.getters['purchase/getUserSet']
    },
    purchaseCustomCopy() {
      return this.$store.getters['purchaseObject/getCurrentPurchase'].purchase_custom
    },
  },
  watch: {
    'purchaseCustom.comment'(newValue) {
      this.$store.commit('purchaseObject/UPDATE_PURCHASE_CUSTOM', {
        field: 'comment',
        child: null,
        value: newValue,
      })
    },
    purchaseCustomCopy(newValue) {
      this.purchaseCustom.comment = newValue.comment
    },
    'customersFilter.inn'(newValue) {
      this.$store.commit('dictionaries/UPDATE_CUSTOMERS_FILTER', {
        field: 'inn',
        value: newValue,
      })
    },
    'customersFilter.name'(newValue) {
      this.$store.commit('dictionaries/UPDATE_CUSTOMERS_FILTER', {
        field: 'name',
        value: newValue,
      })
    },
    customersFilterCopy(newValue) {
      this.customersFilter = newValue
      this.$store.dispatch('dictionaries/fetchCustomers')
    },
    purchaseNumberCopy(newValue) {
      this.purchaseNumber = newValue
    },
    currentRegionCopy(newValue) {
      this.currentRegion = newValue
    },
    currentFcsTypeCopy(newValue) {
      this.currentFcsType = newValue
    },
    currentTradingPlaceCopy(newValue) {
      this.currentTradingPlace = newValue
    },
    purchaseObjectStatus(newStatus) {
      if (newStatus === 'purchase-is-updated') {
        this.$store.dispatch('purchaseObject/fetchPurchaseInfo', this.currentPurchase.uuid)
        this.$store.dispatch('purchaseObject/fetchPurchaseObjects', this.currentPurchase.uuid)
      }
      if (newStatus === 'current_purchase_object-is-updated') {
        this.$store.dispatch('purchaseObject/fetchPurchaseInfo', this.currentPurchase.uuid)
        this.$store.dispatch('purchaseObject/fetchPurchaseObjects', this.currentPurchase.uuid)
      }
    },
    purchaseStatusFilterCopy(newValue) {
      this.purchaseStatusFilter = newValue
    },
    purchaseStatusFilter(newValue) {
      if (newValue) this.$store.commit('purchaseObject/SAVE_PURCHASE_STATUS', newValue)
    },
    getFetchedPurchaseObject() {
      this.$store.commit('purchaseObject/ADD_PRICES_IN_PURCHASE_OBJECTS', this.getPriceObjects)
    },
    getPriceObjects() {
      this.$store.commit('purchaseObject/ADD_PRICES_IN_PURCHASE_OBJECTS', this.getPriceObjects)
    },
    getKladrFilter(newValue) {
      this.kladrFilter = newValue
      this.$store.dispatch('purchaseObject/getLocality')
    },
    currentLocalityCopy(newValue) {
      this.currentLocality = newValue
    },
    staticFiltersData(newFilters) {
      this.filters = JSON.parse(JSON.stringify(newFilters))
      if (this.accessRight.role === 'purchasing_operators') {
        let purchaseStatus = JSON.parse(JSON.stringify(newFilters.purchase_status))
        purchaseStatus = purchaseStatus.filter(function (statusItem) {
          if (
            statusItem.status === 'ready' ||
            statusItem.status === 'sent' ||
            statusItem.status === 'rejected' ||
            statusItem.status === 'admitted' ||
            statusItem.status === 'sole' ||
            statusItem.status === 'won' ||
            statusItem.status === 'verified' ||
            statusItem.status === 'check_archive' ||
            statusItem.status === 'lost' ||
            statusItem.status === 'archive'
          )
            return false
          else return true
        })
        this.filters.purchase_status = purchaseStatus
      }
    },
    filtersName(newFilters) {
      this.filterName = JSON.parse(JSON.stringify(newFilters))
    },
    currentPurchase(newValue) {
      this.purchaseNumber = newValue.purchase_number_manual
      this.selectedUser = newValue.user ? newValue.user.name : 'Не выбран'
      this.selectedUserId = newValue.user ? newValue.user.id : null
    },
    endDateCopy(newValue) {
      this.endDate = newValue
    },
    endDate(newValue) {
      this.$store.commit('purchaseObject/SAVE_END_DATE', newValue)
    },
    biddingDateCopy(newValue) {
      this.biddingDate = newValue
    },
    biddingDate(newValue) {
      this.$store.commit('purchaseObject/SAVE_BIDDING_DATE', newValue)
    },
    currentCustomerCopy(newValue) {
      this.currentCustomer = JSON.parse(JSON.stringify(newValue))
    },
    // priceStatus(newStatus) {
    //   if (newStatus === 'price-is-fetched')
    //     this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
    // },
  },
  created() {
    this.kladrFilter = this.$store.getters['purchaseObject/getKladrFilter']
    this.filterName = JSON.parse(JSON.stringify(this.$store.getters['purchase/getFilterName']))
    this.filters = JSON.parse(JSON.stringify(this.$store.getters['purchase/getFilters']))
    if (this.accessRight.role === 'purchasing_operators') {
      let purchaseStatus = JSON.parse(JSON.stringify(this.$store.getters['purchase/getFilters'].purchase_status))
      purchaseStatus = purchaseStatus.filter(function (statusItem) {
        if (
          statusItem.status === 'ready' ||
          statusItem.status === 'sent' ||
          statusItem.status === 'rejected' ||
          statusItem.status === 'admitted' ||
          statusItem.status === 'sole' ||
          statusItem.status === 'won' ||
          statusItem.status === 'verified' ||
          statusItem.status === 'check_archive' ||
          statusItem.status === 'lost' ||
          statusItem.status === 'archive'
        )
          return false
        else return true
      })
      this.filters.purchase_status = purchaseStatus
    }
    this.endDate = this.$store.getters['purchaseObject/getEndDate']
    this.biddingDate = this.$store.getters['purchaseObject/getBiddingDate']
    this.purchaseStatusFilter = this.$store.getters['purchaseObject/getPurchaseStatus']
    this.currentTradingPlace = this.$store.getters['purchaseObject/getCurrentTradingPlace']
    this.currentRegion = this.$store.getters['purchaseObject/getCurrentRegion']
    this.currentFcsType = this.$store.getters['purchaseObject/getCurrentFcsType']
    this.customersFilter = this.$store.getters['dictionaries/getCustomersFilter']
    this.currentCustomer = this.$store.getters['dictionaries/getCurrentCustomer']
  },
  destroyed() {
    if (this.source === 'purchase_modal') this.$store.dispatch('purchase/fetchPurchase')
  },
  methods: {
    setCurrentCustomer(newValue) {
      this.$store.commit('dictionaries/UPDATE_CURRENT_CUSTOMER', newValue)
    },
    changePurchaseNumberControl() {
      this.purchaseNumberControl = !this.purchaseNumberControl
      if (!this.purchaseNumberControl)
        this.$store.commit('purchaseObject/UPDATE_PURCHASE_NUMBER_MANUAL', this.purchaseNumber)
    },
    addRegion(region) {
      this.$store.commit('purchaseObject/UPDATE_CURRENT_REGION', {
        region_name: region.region_name,
        surcharge_id: region.id,
      })
    },
    closePurchaseModal() {
      switch (this.source) {
        case 'purchase_modal':
          this.$store.commit('purchaseObject/CLEAR_PURCHASE_OBJECT')
          this.$bvModal.hide('purchaseModal')
          break
        case 'purchase_search_modal':
          this.$bvModal.hide('purchaseSearchModal')
          break
      }
    },
    closeArchivePurchaseModal() {
      if (this.accessRight.role === 'purchasing_operators') {
        this.$store.commit('purchaseObject/SAVE_PURCHASE_STATUS', { title: 'Не участвуем', status: 'not_play' })
      } else
        this.$store.commit('purchaseObject/SAVE_PURCHASE_STATUS', { title: 'Проверка архива', status: 'check_archive' })
      this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
      this.$store.commit('purchaseObject/CLEAR_PURCHASE_OBJECT')
      this.$bvModal.hide('purchaseModal')
    },
    addEmptyPurchaseObject() {
      this.$store.dispatch('purchaseObject/createPurchaseObject')
    },
    updatePurchaseModal() {
      if (this.currentPurchase.uuid) this.$store.dispatch('priceObject/fetchPriceObjects', this.currentPurchase.uuid)
    },
    selectLocality(locality) {
      this.$store.commit('purchaseObject/SAVE_CURRENT_LOCALITY', locality)
    },
    clearKladrFilter(field) {
      this.$store.commit('purchaseObject/CLEAR_KLADR_FILTER', field)
    },
    updatePurchase() {
      if (this.purchaseStatusFilter.status === 'new') {
        this.purchaseStatusFilter = { title: 'Обработаны', status: 'processed' }
        this.$store.commit('purchaseObject/SAVE_PURCHASE_STATUS', { title: 'Обработаны', status: 'processed' })
        this.$store.commit('purchaseObject/SAVE_PURCHASE_COMPUTED_DATA', {
          field: 'status',
          value: { name: 'Обработаны', slug: 'processed' },
        })
      }
      this.$store.commit('purchaseObject/SAVE_NEW_USER_ID_IN_PURCHASE', this.selectedUserId)
      this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
    },
    acceptPuschaseStatusChange() {
      this.purchaseStatusFilter = this.selectedPurchaseStatus
      this.$store.commit('purchaseObject/SAVE_PURCHASE_STATUS', this.purchaseStatusFilter)
      this.$store.commit('purchaseObject/SAVE_PURCHASE_COMPUTED_DATA', {
        field: 'status',
        value: { name: this.purchaseStatusFilter.title, slug: this.purchaseStatusFilter.status },
      })
      this.updatePurchase()
    },
    updatePurchaseStatus(newValue) {
      this.selectedPurchaseStatus = newValue
      if (
        (newValue.status === 'check' ||
          newValue.status === 'verified' ||
          newValue.status === 'formalized' ||
          newValue.status === 'ready' ||
          newValue.status === 'sent') &&
        !this.currentPurchaseProfitability &&
        !this.netProfitException
      ) {
        this.$refs['purchase-status-change'].show()
      } else {
        this.acceptPuschaseStatusChange()
      }
    },
    showPurchaseCloseModal() {
      this.$refs['purchase-modal-close'].show()
    },
    setTradingPlace(newValue) {
      this.$store.commit('purchaseObject/UPDATE_CURRENT_TRADING_PLACE', newValue)
    },
    updateFcsType(newValue) {
      this.$store.commit('purchaseObject/UPDATE_FCS_TYPE', newValue)
    },
    updateBiddingDate() {
      this.$store.dispatch('purchaseObject/updatePurchase', {
        uuid: this.currentPurchase.uuid,
        flag: false,
        auto_bidding: true,
      })
    },
    clearCustomersFilterField(field) {
      this.$store.commit('dictionaries/UPDATE_CUSTOMERS_FILTER', {
        field,
        value: null,
      })
    },
    archivePurchase() {
      this.$refs['purchase-modal-archive-close'].show()
    },
    setCurrentUser(user) {
      this.selectedUser = user.title
      this.selectedUserId = user.user_id
      this.$store.commit('purchaseObject/SAVE_NEW_USER_ID_IN_PURCHASE', user.user_id)
    },
    multiplyDeliveryToggle() {
      if (this.kladrIds.length) this.$store.dispatch('purchaseObject/fetchKladrObjects')
    },
    multiplyDeliveryClose() {
      if (this.deliveryObjects.length === 0 || this.deliveryObjects.length === 1)
        this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
    },
    onceDelivery(hide) {
      this.$store.commit('purchaseObject/UPDATE_MULTIPLY_DELIVERY', false)
      this.$store.commit('purchaseObject/CLEAR_MULTIPLY_OBJECTS')
      hide()
    },
    setCustomerComment(customer) {
      this.$store.dispatch('purchaseObject/editCurrentCustomer', customer)
    },
    setArchiveReason(currentReason) {
      // this.$store.commit('purchaseObject/UPDATE_PURCHASE_CUSTOM', {
      //   field: 'comment',
      //   child: null,
      //   value: newValue,
      // })
      this.$store.commit('purchaseObject/CONCAT_PURCHASE_COMMENT', currentReason)
    },
  },
}
</script>
