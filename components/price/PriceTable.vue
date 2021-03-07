<template>
  <b-table
    striped
    hover
    sticky-header="100%"
    :items="currentItems"
    :fields="currentFields"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    class="h-100 m-0"
    :style="priceTableStyle"
    @row-clicked="singleClick"
    @row-dblclicked="doubleClick"
  >
    <template v-slot:head(is_select)>
      <div v-if="!offers">
        <div v-if="source === 'price-manage'">
          <b-icon-check-square
            v-if="globalSwitcher && !globalSwitcherIndeterminate"
            class="m-0 h4"
            @click="selectAllPrices(false)"
          ></b-icon-check-square>
          <b-icon-square
            v-else-if="!globalSwitcher && !globalSwitcherIndeterminate"
            class="m-0 h4"
            @click="selectAllPrices(true)"
          ></b-icon-square>
          <b-icon-dash-square
            v-else-if="globalSwitcherIndeterminate"
            class="m-0 h4"
            @click="selectAllPrices(true)"
          ></b-icon-dash-square>
        </div>
        <div v-else-if="source === 'matching-modal'">
          <b-icon-check-square
            v-if="!allMatchedPriceIsSelected"
            class="pointer h4 m-0"
            @click="multipleChoiceMatchedPrices"
          >
          </b-icon-check-square>
          <b-icon-square v-else class="pointer h4 m-0" @click="multipleChoiceMatchedPrices"> </b-icon-square>
        </div>
      </div>
    </template>
    <template v-slot:cell(is_select)="row">
      <div v-if="!offers">
        <template v-if="source === 'expanded-ru'">
          <b-icon-check-square v-if="row.item.klp.is_select" class="h5 m-0" @click="clearAdditionalRuFile(row.item)">
          </b-icon-check-square>
          <b-icon-square v-else class="h5 m-0" @click="setAdditionalRuFile(row.item)"> </b-icon-square>
        </template>
        <div v-else class="d-flex align-items-center">
          <div>
            <b-icon-check-square
              v-if="row.item.is_select"
              :variant="row.item.price_status || row.item.variant ? row.item.price_status || row.item.variant : 'info'"
              class="h4 m-0"
            >
            </b-icon-check-square>
            <b-icon-square v-else :variant="row.item.price_status" class="h4 m-0"> </b-icon-square>
          </div>
          <div v-if="qntFlag" style="width: 60px">
            <!--            v-if="row.item.price_status === 'warning' || row.item.price_status === 'success'"-->
            <b-input-group class="filter ml-2">
              <b-form-input
                v-model="row.item.drug_quantity_require"
                type="number"
                placeholder="Кол-во"
                :disabled="row.item.is_select"
              ></b-form-input>
            </b-input-group>
          </div>
        </div>
      </div>
      <div v-else>
        <b-icon-x-circle
          v-if="row.item.price_status === 'danger'"
          class="h4 m-0"
          :variant="row.item.price_status"
        ></b-icon-x-circle>
        <b-icon-check-circle
          v-else-if="row.item._rowVariant"
          class="h4 m-0"
          :variant="row.item.price_status"
          @click="addOfferPrice(row.item)"
        ></b-icon-check-circle>
        <b-icon-circle
          v-else
          class="h4 m-0 pointer"
          :variant="row.item.price_status"
          @click="addOfferPrice(row.item)"
        ></b-icon-circle>
      </div>
    </template>
    <template v-slot:cell(mnn)="row">
      <div v-if="source === 'price-manage'">
        <div>
          {{ row.item.klp.custom_mnn || '---' }}
        </div>
        <div v-if="row.item.klp.mnn" class="d-flex flex-column flex-fill text-lowercase text-wrap font-weight-bold">
          {{ row.item.klp.mnn }}
        </div>
        <div v-else-if="row.item.mnn">
          {{ row.item.mnn }}
        </div>
        <div v-else>---</div>
      </div>
      <div v-else class="d-flex flex-column flex-fill text-wrap" @click="choiceMatchingFilter('mnn', row.item.mnn)">
        <div v-if="source === 'expanded-ru'">{{ row.item.mnn }}</div>
        <div v-else-if="source !== 'matching-modal' && row.item.mnn" class="d-flex align-items-center">
          <b-icon-eye v-if="row.item.is_active" variant="info" class="h4 m-0 mr-3"></b-icon-eye>
          <b-icon-eye-slash v-else variant="secondary" class="h4 m-0 mr-3"> </b-icon-eye-slash>
          <span>{{ row.item.mnn }}</span>
        </div>
        <span v-else-if="source !== 'matching-modal' && !row.item.mnn">
          <b-icon-eye v-if="row.item.is_active" variant="info" class="h4 m-0 mr-3"></b-icon-eye>
          <b-icon-eye-slash v-else variant="secondary" class="h4 m-0 mr-3"> </b-icon-eye-slash>
          <span>---</span>
        </span>
        <div v-else>{{ row.item.mnn }}</div>
      </div>
    </template>
    <template v-slot:cell(form)="row">
      <div @click="choiceMatchingFilter('lf_name', row.item.form)">
        {{ row.item.form }}
      </div>
    </template>
    <template v-slot:head(mnn)>
      <div v-if="source === 'matching-modal-klp_full'">МНН по ЕСКЛП</div>
    </template>
    <template v-slot:head(form)>
      <div v-if="source === 'matching-modal-klp_full'">Лек. форма по ЕСКЛП</div>
    </template>
    <template v-slot:head(dosage_grls_value)>
      <div v-if="source === 'matching-modal-klp_full'">Дозировка по ЕСКЛП</div>
    </template>
    <template v-slot:cell(dosage_grls_value)="row">
      <div @click="choiceMatchingFilter('dosage_name', row.item.dosage_grls_value)">
        {{ row.item.dosage_grls_value }}
      </div>
    </template>
    <template v-slot:cell(trade_name_field)="row">
      <div>
        <div
          v-if="row.item.klp.name_teh && source !== 'matching-modal'"
          class="d-flex flex-column flex-fill text-lowercase text-wrap"
          style="width: 300px"
          :class="row.item.klp.mnn && source !== 'matching-modal' ? 'font-weight-bold' : ''"
        >
          {{ row.item.klp.trade_name }}
        </div>
        <div v-else-if="row.item.name" class="d-flex flex-column flex-fill text-lowercase text-wrap">
          {{ getFirstWord(row.item.name) }}
        </div>
        <div v-else>---</div>
      </div>
    </template>
    <template v-slot:cell(name_teh)="row">
      <div>
        <div
          v-if="row.item.klp.name_teh && source !== 'matching-modal'"
          class="d-flex flex-column flex-fill text-lowercase text-wrap"
          style="width: 300px"
          :class="row.item.klp.mnn && source !== 'matching-modal' ? 'font-weight-bold' : ''"
        >
          {{ row.item.klp.name_teh }}
        </div>
        <div v-else-if="row.item.name" class="d-flex flex-column flex-fill text-lowercase text-wrap">
          {{ getShortPhrase(row.item.name) }}
        </div>
        <div v-else>---</div>
      </div>
    </template>
    <template v-slot:cell(seller)="row">
      <div
        class="d-flex flex-column flex-fill text-lowercase text-wrap"
        style="width: 150px"
        :class="row.item.klp.mnn && source !== 'matching-modal' ? 'font-weight-bold' : ''"
      >
        {{ row.item.seller }}
      </div>
    </template>
    <template v-slot:cell(firm)="row">
      <div>
        <div
          v-if="row.item.klp.manufacturer_name && source !== 'matching-modal'"
          class="d-flex flex-column flex-fill text-lowercase text-wrap"
          style="width: 200px"
          :class="row.item.klp.mnn && source !== 'matching-modal' ? 'font-weight-bold' : ''"
        >
          {{ row.item.klp.manufacturer_name }}
        </div>
        <div v-else-if="row.item.firm" class="d-flex flex-column flex-fill text-lowercase text-wrap">
          {{ row.item.firm }}
        </div>
        <div v-else>---</div>
      </div>
    </template>
    <template v-slot:cell(cntr)="row">
      <div>
        <div
          v-if="row.item.klp.manufacturer_country_name && source !== 'matching-modal'"
          class="d-flex flex-column flex-fill text-lowercase text-wrap"
          :class="row.item.klp.mnn && source !== 'matching-modal' ? 'font-weight-bold' : ''"
        >
          {{ row.item.klp.manufacturer_country_name }}
        </div>
        <div v-else-if="row.item.cntr" class="d-flex flex-column flex-fill text-lowercase text-wrap">
          {{ row.item.cntr }}
        </div>
        <div v-else>---</div>
      </div>
    </template>
    <template v-slot:cell(gdate)="row">
      <div
        v-if="qntFlag"
        class="d-flex flex-column flex-fill text-lowercase text-wrap"
        :class="row.item.klp.mnn && source !== 'matching-modal' ? 'font-weight-bold' : ''"
        :style="
          isGdateExpire(
            row.item.gdate,
            row.item.klp && row.item.klp.expiration_date ? row.item.klp.expiration_date : null
          ) === null
            ? 'color: black'
            : isGdateExpire(
                row.item.gdate,
                row.item.klp && row.item.klp.expiration_date ? row.item.klp.expiration_date : null
              )
            ? 'color: green'
            : 'color: red'
        "
      >
        {{ $moment(row.item.gdate).format('DD.MM.YYYY') }}
      </div>
      <div
        v-else
        class="d-flex flex-column flex-fill text-lowercase text-wrap"
        :class="row.item.klp.mnn && source !== 'matching-modal' ? 'font-weight-bold' : ''"
      >
        {{ $moment(row.item.gdate).format('DD.MM.YYYY') }}
      </div>
    </template>
    <template v-slot:cell(qnt)="row">
      <div
        class="d-flex flex-column flex-fill text-lowercase text-wrap"
        :class="row.item.klp.mnn && source !== 'matching-modal' ? 'font-weight-bold' : ''"
      >
        {{ row.item.qnt }}
      </div>
    </template>
    <template v-slot:cell(price)="row">
      <div
        class="d-flex flex-column flex-fill text-lowercase text-wrap"
        :class="row.item.klp.mnn && source !== 'matching-modal' ? 'font-weight-bold' : ''"
      >
        {{ row.item.price }}
      </div>
    </template>
    <template v-slot:cell(full_price)="row">
      <div>
        {{ (row.item.drug_quantity_require * row.item.price).toFixed(2) || null }}
      </div>
    </template>
    <template v-slot:cell(price_gnvls)="row">
      <div
        class="d-flex flex-column flex-fill text-lowercase text-wrap"
        :class="row.item.klp.mnn && source !== 'matching-modal' ? 'font-weight-bold' : ''"
      >
        {{ row.item.price_gnvls }}
      </div>
    </template>
    <!--    <template v-slot:cell(packing)="row">-->
    <!--      {{ row.item.packing }}-->
    <!--    </template>-->
    <template v-slot:cell(num_reg)="row">
      <div v-if="source === 'matching-modal-klp_full' || source === 'expanded-ru'">
        <div class="d-flex flex-row justify-content-between align-items-center">
          <span class="mr-3">{{ row.item.num_reg }}</span>
          <a
            v-if="row.item.ru_file"
            :href="`https://grls.rosminzdrav.ru/GRLS.aspx?RegNumber=${row.item.num_reg}`"
            target="_blank"
          >
            <b-icon-file-earmark-check class="h4 m-0" variant="info"></b-icon-file-earmark-check>
          </a>
          <a v-else :href="`https://grls.rosminzdrav.ru/GRLS.aspx?RegNumber=${row.item.num_reg}`" target="_blank">
            <b-icon-file-earmark-break class="h4 m-0" variant="secondary"></b-icon-file-earmark-break>
          </a>
        </div>
      </div>
      <div v-else>
        {{ row.item.num_reg }}
      </div>
    </template>
    <template v-slot:cell(dimension)="row">
      {{ row.item.dimension }}
      <div class="d-flex flex-column flex-fill text-lowercase text-wrap" style="width: 100px">
        {{ $moment(row.item.update_ver, 'YYMMDDhhmm').fromNow() }}
      </div>
    </template>
    <template v-slot:cell(packing)="row">
      <div>
        <div v-if="row.item.packing" :class="row.item.klp.mnn && source !== 'matching-modal' ? 'font-weight-bold' : ''">
          {{ row.item.packing }}
        </div>
        <div
          v-else-if="row.item.klp.pre_packing"
          class="d-flex flex-column flex-fill text-lowercase text-wrap font-weight-bold"
        >
          {{ row.item.klp.pre_packing }}
        </div>
        <div v-else>---</div>
      </div>
    </template>
    <template v-slot:cell(trade_name)="row">
      {{ row.item.trade_name }}
    </template>
    <template v-slot:cell(date_reg)="row">
      {{ $moment(row.item.date_reg).format('DD.MM.YYYY') }}
    </template>
    <template v-slot:cell(lf_dosage_norm_name)="row">
      {{ `${row.item.lf_norm_name} ${row.item.dosage_norm_name}` }}
    </template>
    <template v-slot:cell(gnvls)="row">
      <div class="d-flex align-items-center">
        <b-icon-heart-fill v-if="row.item.gnvls" variant="danger" class="h5 m-0"></b-icon-heart-fill>
        <b-icon-heart v-else class="h5 m-0"></b-icon-heart>
      </div>
    </template>
    <template v-slot:cell(ru_file)="row">
      <div class="d-flex align-items-center">
        <b-icon-file-earmark-check
          v-if="row.item.klp && row.item.klp.ru_file"
          class="h4 m-0"
          :variant="
            shelfLifeRu(row.item.klp ? row.item.klp.date_ru_file : false)
              ? 'danger'
              : row.item.klp && row.item.klp.comment_ru
              ? 'indigo'
              : 'info'
          "
        ></b-icon-file-earmark-check>
        <b-icon-file-earmark-break v-else class="h4 m-0" variant="secondary"></b-icon-file-earmark-break>
      </div>
    </template>
    <template v-slot:cell(author_info)="row">
      <div class="d-flex flex-column">
        <span style="font-size: 13px">{{
          row.item && row.item.price_klp && row.item.price_klp.author ? row.item.price_klp.author.name : ''
        }}</span>
        <span style="font-size: 12px">{{
          row.item && row.item.price_klp && row.item.price_klp.created_at
            ? $moment(row.item.price_klp.created_at).format('DD.MM.YYYY HH:mm')
            : ''
        }}</span>
      </div>
    </template>
    <template v-slot:cell(user_info)="row">
      <div class="d-flex flex-column">
        <span style="font-size: 13px">{{
          row.item && row.item.price_klp && row.item.price_klp.user ? row.item.price_klp.user.name : ''
        }}</span>
        <span style="font-size: 12px">{{
          row.item && row.item.price_klp && row.item.price_klp.updated_at
            ? $moment(row.item.price_klp.updated_at).format('DD.MM.YYYY HH:mm')
            : ''
        }}</span>
      </div>
    </template>
    <template v-slot:cell(temperature_mode)="row">
      <div class="d-flex">
        <span>{{
          row.item &&
          row.item.klp &&
          temperatureMode(row.item.klp.temperature_min, row.item.klp.temperature_max) === 'danger'
            ? `${
                row.item.klp.temperature_min || row.item.klp.temperature_min === 0 ? row.item.klp.temperature_min : "''"
              } - ${
                row.item.klp.temperature_max || row.item.klp.temperature_max === 0 ? row.item.klp.temperature_max : "''"
              }`
            : ''
        }}</span>
        <div
          v-if="row.item.klp && (row.item.klp.temperature_min || row.item.klp.temperature_max)"
          :id="`temperature_mode_cell_${row.item.id}`"
          class="d-flex align-items-center"
        >
          <b-icon-thermometer
            class="h3 m-0"
            :variant="temperatureMode(row.item.klp.temperature_min, row.item.klp.temperature_max)"
          ></b-icon-thermometer>
        </div>
        <div v-else class="d-flex align-items-center">
          <b-icon-thermometer class="h3 m-0" variant="secondary"></b-icon-thermometer>
        </div>
      </div>
    </template>
    <template v-slot:cell(replacement)="row">
      <b-icon-box-arrow-right
        :id="`price_replacement_${row.index}`"
        class="m-0 h4 pointer custom_button"
        @click="replacePriceObject(row.item)"
      ></b-icon-box-arrow-right>
      <b-tooltip :target="`price_replacement_${row.index}`" placement="left"
        >Заменить прайс на данную позицию</b-tooltip
      >
    </template>
    <template v-slot:cell(match_author)="row">
      <span>{{
        row.item && row.item.price_klp && row.item.price_klp.author ? row.item.price_klp.author.name : null
      }}</span>
    </template>
    <template v-slot:cell(match_date)="row">
      <span>
        {{
          row.item && row.item.price_klp && row.item.price_klp.author
            ? $moment(row.item.price_klp.created_at).format('DD.MM.YYYY HH:mm')
            : null
        }}
      </span>
    </template>
  </b-table>
</template>

<script>
export default {
  name: 'PriceTable',
  props: {
    source: {
      type: String,
      default: 'test',
    },
    qntFlag: {
      type: Boolean,
      default: false,
    },
    expandedRu: {
      type: Object,
      default: null,
    },
    offers: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sortBy: null,
      sortDesc: null,
      fields: [
        {
          key: 'is_select',
          label: '',
          class: 'align-middle price-table-is_select pl-1 pr-1',
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping'],
        },
        {
          key: 'mnn',
          label: 'МНН',
          class: 'align-middle pl-1 pr-1',
          hide: [],
        },
        {
          key: 'trade_name_field',
          label: 'Торг. наим-е',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'name_teh',
          label: 'Тех. характеристики',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'seller',
          label: 'Поставщики',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'firm',
          label: 'Произв-ль',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'cntr',
          label: 'Страна',
          class: 'align-middle  pl-1 pr-1',
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'gdate',
          label: 'Годен до',
          class: 'align-middle pl-1 pr-3',
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'qnt',
          label: 'Кол-во',
          class: 'align-middle pl-1 pr-2',
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'price',
          label: 'Цена',
          class: 'align-middle pl-1 pr-1',
          sortable: true,
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'full_price',
          label: 'Закуп. ст-ть',
          class: 'align-middle pl-1 pr-1',
          hide: [
            'matching-modal',
            'matching-modal-smnn',
            'matching-modal-klp_grouping',
            'matching-modal-klp_full',
            'expanded-ru',
          ],
          variant: 'info-100',
        },
        {
          key: 'packing',
          label: 'Трансп. упак.',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full', 'expanded-ru'],
        },
        {
          key: 'dimension',
          label: 'Габариты',
          class: 'align-middle pl-1 pr-1',
          hide: [
            'price-manage',
            'matching-modal',
            'matching-modal-smnn',
            'matching-modal-klp_grouping',
            'matching-modal-klp_full',
            'expanded-ru',
          ],
        },
        {
          key: 'trade_name',
          label: 'Торг. наим.',
          class: 'align-middle pl-1 pr-1',
          hide: ['price-manage', 'matching-modal', 'matching-modal-smnn', 'expanded-ru'],
        },
        {
          key: 'form',
          label: 'Лекарственная форма',
          class: 'align-middle pl-1 pr-1',
          hide: ['price-manage', 'matching-modal', 'expanded-ru'],
        },
        {
          key: 'dosage_grls_value',
          label: 'Дозировка',
          class: 'align-middle pl-1 pr-1',
          hide: [
            'price-manage',
            'matching-modal',
            'matching-modal-klp_grouping',
            'matching-modal-klp_full',
            'expanded-ru',
          ],
        },
        {
          key: 'dosage_grls_value',
          label: 'Дозировка',
          class: 'align-middle pl-1 pr-1',
          hide: ['price-manage', 'matching-modal', 'matching-modal-smnn', 'expanded-ru'],
        },
        {
          key: 'mnn_norm_name',
          label: 'МНН по ГРЛС',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal', 'price-manage', 'matching-modal-smnn', 'matching-modal-klp_grouping', 'expanded-ru'],
        },
        {
          key: 'lf_dosage_norm_name',
          label: 'Лек.форма и дозировка по ГРЛС',
          class: 'align-middle pl-1 pr-2',
          hide: ['matching-modal', 'price-manage', 'matching-modal-smnn', 'matching-modal-klp_grouping', 'expanded-ru'],
        },
        {
          key: 'pack_1_num',
          label: 'Объем перв. упак.',
          class: 'align-middle pl-1 pr-1',
          sortable: true,
          hide: ['matching-modal', 'price-manage', 'matching-modal-smnn', 'matching-modal-klp_grouping', 'expanded-ru'],
        },
        {
          key: 'pack_2_num',
          label: 'Кол-во в упак.',
          class: 'align-middle pl-1 pr-1',
          sortable: true,
          hide: ['matching-modal', 'price-manage', 'matching-modal-smnn', 'matching-modal-klp_grouping', 'expanded-ru'],
        },
        {
          key: 'pack_sum',
          label: 'Общее кол-во',
          class: 'align-middle pl-1 pr-1',
          sortable: true,
          hide: ['matching-modal', 'price-manage', 'matching-modal-smnn', 'matching-modal-klp_grouping', 'expanded-ru'],
        },
        {
          key: 'dosage_user_okei_name',
          label: 'Ед. изм.',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal', 'price-manage', 'matching-modal-smnn', 'matching-modal-klp_grouping', 'expanded-ru'],
        },
        {
          key: 'num_reg',
          label: 'Номер РУ',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal', 'price-manage', 'matching-modal-smnn', 'expanded-ru'],
        },
        {
          key: 'date_reg',
          label: 'Дата рег-ции РУ',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal', 'price-manage', 'matching-modal-smnn', 'matching-modal-klp_grouping', 'expanded-ru'],
        },
        {
          key: 'owner_name',
          label: 'Держатель РУ',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal', 'price-manage', 'matching-modal-smnn', 'expanded-ru'],
        },
        {
          key: 'manufacturer_name',
          label: 'Производитель',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal', 'price-manage', 'matching-modal-smnn', 'expanded-ru'],
        },
        {
          key: 'manufacturer_country_name',
          label: 'Страна происх.',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal', 'price-manage', 'matching-modal-smnn', 'expanded-ru'],
        },
        {
          key: 'price_gnvls',
          label: 'Цена произв.',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'gnvls',
          label: 'ЖНВЛС',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal', 'matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'temperature_mode',
          label: 'Термо',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal', 'matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'ru_file',
          label: 'Рег. уд.',
          class: 'align-middle pl-1 pr-1',
          hide: ['matching-modal', 'matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full'],
        },
        {
          key: 'author_info',
          label: 'Сопоставил',
          class: 'align-middle pl-1 pr-1',
          hide: [
            'price-manage',
            'matching-modal-smnn',
            'matching-modal-klp_grouping',
            'matching-modal-klp_full',
            'expanded-ru',
          ],
        },
        {
          key: 'user_info',
          label: 'Подтвердил',
          class: 'align-middle pl-1 pr-1',
          hide: [
            'price-manage',
            'matching-modal-smnn',
            'matching-modal-klp_grouping',
            'matching-modal-klp_full',
            'expanded-ru',
          ],
        },
        {
          key: 'replacement',
          label: '',
          class: 'align-middle pl-1 pr-1',
          hide: [
            'price-manage',
            'matching-modal-smnn',
            'matching-modal-klp_grouping',
            'matching-modal-klp_full',
            'expanded-ru',
          ],
        },
      ],
    }
  },
  computed: {
    activeShelfField() {
      return this.$store.getters['purchaseObject/getActiveShelfField']
    },
    priceTableStyle() {
      let style = []
      switch (this.source) {
        case 'price-manage':
          if (this.priceFilter.assign_status === 'moderation') style = 'font-size: 10px;'
          else style = 'font-size: 12px;'
          break
        case 'matching-modal-klp_full':
          style = 'font-size: 13px;'
          break
      }
      return style
    },
    priceFilter() {
      return this.$store.getters['price/getPriceFilter']
    },
    priceKlpUuid() {
      return this.$store.getters['price/getAddonKlp'].price_klp_uuid
    },
    expandedPrice() {
      return this.$store.getters['price/getExpandedPrice']
    },
    selectedPriceObject() {
      return this.$store.getters['priceObject/getSelectedPriceObject']
    },
    matchingModalSource() {
      return this.$store.getters['priceObject/getMatchingModalSource']
    },
    globalSwitcher() {
      return this.$store.getters['price/getGlobalSwitcher']
    },
    globalSwitcherIndeterminate() {
      return this.$store.getters['price/getGlobalSwitcherIndeterminate']
    },
    favoritePricesShowing() {
      return this.$store.state.price.favoritePricesShowing
    },
    allMatchedPriceIsSelected() {
      return this.$store.state.price.allMatchedPriceIsSelected
    },
    matchedPrices() {
      return this.$store.state.price.matchedPrices
    },
    selectedRows() {
      return this.$store.state.price.selectedRows
    },
    currentKlp() {
      return this.$store.getters['price/getCurrentKlp']
    },
    currentFields() {
      const fieldsCopy = JSON.parse(JSON.stringify(this.fields))
      if (this.matchingModalSource === 'price_table') {
        fieldsCopy.filter((field) => field.key !== 'replacement')
      }
      if (!this.qntFlag) {
        fieldsCopy.filter((field) => !field.hide.includes(this.source)).filter((field) => field.key !== 'full_price')
      }
      if (this.priceFilter.assign_status === 'moderation' && !this.offers && this.source !== 'matching-modal') {
        // fieldsCopy.push({
        //   key: 'match_author',
        //   label: 'Сопоставил',
        //   class: 'align-middle pl-1 pr-1',
        //   hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full', 'expanded-ru'],
        // })
        fieldsCopy.push({
          key: 'match_date',
          label: 'Дата сопост',
          class: 'align-middle pl-1 pr-1',
          sortable: true,
          hide: ['matching-modal-smnn', 'matching-modal-klp_grouping', 'matching-modal-klp_full', 'expanded-ru'],
        })
      }
      return fieldsCopy.filter((field) => !field.hide.includes(this.source))
    },
    ruFile() {
      return this.$store.state.price.ruFile
    },
    currentItems() {
      const sortDesc = this.sortDesc
      if (this.sortBy === 'match_date' && this.priceFilter.assign_status === 'moderation' && !this.offers) {
        return JSON.parse(JSON.stringify(this.$store.getters['price/getPrice'])).sort(function (a, b) {
          return sortDesc
            ? new Date(b.price_klp && b.price_klp.author && b.price_klp.created_at ? b.price_klp.created_at : null) -
                new Date(a.price_klp && a.price_klp.author && a.price_klp.created_at ? a.price_klp.created_at : null)
            : new Date(a.price_klp && a.price_klp.author && a.price_klp.created_at ? a.price_klp.created_at : null) -
                new Date(b.price_klp && b.price_klp.author && b.price_klp.created_at ? b.price_klp.created_at : null)
        })
      }
      if (this.offers) {
        return JSON.parse(JSON.stringify(this.$store.getters['price/getPriceOffers']))
      } else {
        let items = []
        switch (this.source) {
          case 'price-manage':
            items = JSON.parse(JSON.stringify(this.$store.getters['price/getPrice']))
            break
          case 'matching-modal':
            items = JSON.parse(JSON.stringify(this.$store.getters['price/getMatchedPricesData']))
            break
          case 'matching-modal-smnn':
            items = JSON.parse(JSON.stringify(this.$store.getters['price/getMatchedSmnnTable']))
            break
          case 'matching-modal-klp_grouping':
            items = JSON.parse(JSON.stringify(this.$store.getters['price/getMatchedKlpTable']))
            break
          case 'matching-modal-klp_full':
            items = JSON.parse(JSON.stringify(this.$store.getters['price/getMatchedTableWithCurrentKlp']))
            break
          case 'expanded-ru':
            items = JSON.parse(JSON.stringify(this.$store.getters['price/getExpandedPrice'])).filter(
              (price) => price.klp.uuid !== this.priceKlpUuid
            )
            break
        }
        return items
      }
    },
  },
  watch: {
    expandedPrice: {
      handler() {
        this.$store.dispatch('price/addAddonKlp')
      },
      deep: true,
    },
    selectedRows(newSelectedRows) {
      if (!newSelectedRows.length && this.favoritePricesShowing) this.$store.commit('price/TOGGLE_FAVORITE_PRICES')
    },
    // sortBy(newValue) {
    //   this.$store.commit('price/UPDATE_SORTING', { order_by: newValue, asc_desc: this.sortDesc ? 'asc' : 'desc' })
    // },
    // sortDesc(newValue) {
    //   this.$store.commit('price/UPDATE_SORTING', { order_by: this.sortBy, asc_desc: newValue ? 'asc' : 'desc' })
    // },
  },
  methods: {
    temperatureMode(min, max) {
      if (min === null && max === null) return 'secondary'
      else if (!min && min !== 0 && max >= 25) return 'success'
      else if ((min === 0 && max >= 25) || (min === 0 && !max)) return 'info'
      else if ((min === 0 && max < 25) || (min > 0 && !max) || (min > 0 && max) || (!min && max < 25)) return 'danger'
    },
    singleClick(price) {
      if (!this.offers) {
        switch (this.source) {
          case 'price-manage':
            this.$store.commit('price/ROW_IS_SELECTED', price)
            break
          case 'matching-modal':
            this.$store.commit('price/UPDATE_ROW_IN_MATCHED_PRICE', price.id)
            break
          case 'matching-modal-klp_full':
            this.$store.commit('price/UPDATE_MATCHED_KLP_TABLE', price)
            this.$store.dispatch('price/fetchSelectedKlp', price.uuid)
            break
        }
      }
    },
    doubleClick(price) {
      switch (this.source) {
        case 'price-manage':
          if (!this.selectedRows.length) {
            this.$store.commit('priceObject/UPDATE_MATCHING_MODAL_SOURCE', 'price_table')
            this.$bvModal.show('esklpPriceMatchingModal')
            if (price.esklp_klp_uuid) this.$store.dispatch('price/fetchCurrentKlp', price.esklp_klp_uuid)
            this.$store.dispatch('price/getMatchedPrices', price.id)
          }
          break
        case 'matching-modal-smnn':
          this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER_MULTIPLE', [
            { lf_name: price.form },
            { dosage_name: price.dosage_grls_value },
          ])
          break
        case 'matching-modal-klp_grouping':
          this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER', {
            field_name: 'num_reg',
            new_value: price.num_reg,
          })
          break
      }
    },
    multipleChoiceMatchedPrices() {
      this.$store.commit('price/UPDATE_MATCHED_PRICE')
    },
    choiceMatchingFilter(field, value) {
      this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER_MULTIPLE', [{ [field]: value }])
    },
    getFirstWord(phrase) {
      const phraseArray = phrase.split(' ')
      return phraseArray[0]
    },
    getShortPhrase(phrase) {
      const phraseArray = phrase.split(' ')
      return phraseArray.filter((word, index) => index !== 0).join(' ')
    },
    selectAllPrices(flag) {
      this.$store.commit('price/ALL_PRICES_SELECTED', flag)
    },
    replacePriceObject(priceObject) {
      this.$store.commit('priceObject/UPDATE_MATCHING_BUTTON', 'replace_button')
      this.$store.commit('priceObject/SAVE_REPLACED_PRICE_OBJECT', priceObject)
      // this.$store.dispatch('priceObject/removePriceObject', this.selectedPriceObject.id)
      this.$store.dispatch('priceObject/addPriceObjects')
      this.$bvModal.hide('esklpPriceMatchingModal')
      this.$store.commit('priceObject/SAVE_SELECTED_PRICE_OBJECT', null)
    },
    setAdditionalRuFile(priceObject) {
      this.$store.commit('price/KLP_ITEM_SELECTED', priceObject)
    },
    clearAdditionalRuFile(priceObject) {
      this.$store.commit('price/KLP_ITEM_NOT_SELECTED', priceObject)
    },
    thermoMode(min, max) {
      if (min === null && max === null) return 'secondary'
      else if (!min && min !== 0 && max >= 25) return 'success'
      else if ((min === 0 && max >= 25) || (min === 0 && !max)) return 'info'
      else if ((min === 0 && max < 25) || (min > 0 && !max) || (min > 0 && max) || (!min && max < 25)) return 'danger'
    },
    addOfferPrice(price) {
      this.$store.commit('price/ADD_SELECTED_OFFER_PRICE', price.id)
    },
    shelfLifeRu(date) {
      if (!date) return false
      else if (new Date(date) < new Date()) return true
      else return false
    },
    isGdateExpire(gdate, expirationDate = null) {
      const shelfLife = this.$store.getters['purchaseObject/getInputShelfGroups']
      if (this.activeShelfField === 'date' && shelfLife.date) {
        return new Date(shelfLife.date) < new Date(gdate)
      } else if (this.activeShelfField === 'input' && shelfLife.months) {
        return this.$moment().add(shelfLife.months, 'months').add(1, 'months').isBefore(gdate)
      } else if (this.activeShelfField === 'koef' && shelfLife.koef) {
        return this.$moment()
          .add(expirationDate * (shelfLife.koef / 100) * 31, 'days')
          .isBefore(gdate)
      } else if (this.activeShelfField === 'input-group' && shelfLife.interval[0] && shelfLife.interval[0].required) {
        for (const shelfLifeInt of shelfLife.interval) {
          let detect = false
          if (!shelfLifeInt.min) {
            if (expirationDate <= shelfLifeInt.max) detect = true
          } else if (!shelfLifeInt.max) {
            if (expirationDate >= shelfLifeInt.min) detect = true
          } else if (expirationDate >= shelfLifeInt.min && expirationDate <= shelfLifeInt.max) {
            detect = true
          }
          if (detect) {
            return this.$moment().add(shelfLifeInt.required, 'months').add(1, 'months').isBefore(gdate)
          }
        }
      }
      return null
    },
  },
}
</script>
