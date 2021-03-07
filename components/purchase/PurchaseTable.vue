<template>
  <div>
    <b-table
      :stacked="source === 'purchase_modal'"
      :striped="source !== 'purchase_modal'"
      :outlined="source === 'purchase_modal_price'"
      :borderless="source === 'purchase_modal' || source === 'purchase_modal_search'"
      :fixed="source === 'purchase_modal_price' || source === 'purchase_modal_price_fields'"
      :table-variant="tableVariant"
      :small="source === 'purchase_modal_price'"
      :items="currentItems"
      :fields="currentFields"
      :tbody-tr-class="
        source === 'purchase_modal' || 'purchase_main'
          ? rowClass
          : source === 'purchase_modal_price'
          ? 'purchase_modal_price'
          : source === 'purchase_modal_price_expansion'
          ? 'purchase_modal_price_expansion'
          : ''
      "
      :style="
        source === 'purchase_modal_price' || source === 'purchase_modal_price_fields'
          ? 'font-size: 11px;'
          : source === 'purchase_manage'
          ? 'font-size: 11px;'
          : source === 'purchase_modal'
          ? 'font-size: 10px;'
          : ''
      "
      :thead-class="headClass"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :no-local-sorting="true"
      hover
      sticky-header="100%"
      class="w-100 m-0"
      @row-dblclicked="doubleClick"
    >
      <template v-slot:head(klp.mnn_norm_name)>
        <div id="mnn_norm_name">1</div>
        <b-tooltip target="mnn_norm_name" placement="left"> МНН </b-tooltip>
      </template>
      <template v-slot:cell(klp.mnn_norm_name)="row">
        <div v-if="row.item.mnn_name" :id="`mnn_norm_name_cell_${row.index}_${parentIndex}`">
          <b-form-textarea
            v-model="row.item.mnn_name"
            class="purchase_price_field align-middle"
            placeholder="МНН"
            rows="3"
            @change="updatePurchasePriceObjectField(row.item, { field: 'mnn_name', value: row.item.klp.mnn_norm_name })"
          ></b-form-textarea>
        </div>
        <div
          v-else-if="row.item.klp && row.item.klp.mnn_norm_name"
          :id="`mnn_norm_name_cell_${row.index}_${parentIndex}`"
        >
          <b-form-textarea
            v-model="row.item.klp.mnn_norm_name"
            class="purchase_price_field align-middle"
            placeholder="МНН"
            rows="3"
            @change="updatePurchasePriceObjectField(row.item, { field: 'mnn_name', value: row.item.klp.mnn_norm_name })"
          ></b-form-textarea>
        </div>
        <div v-else>{{ row.item.price.mnn }}</div>
        <b-tooltip :target="`mnn_norm_name_cell_${row.index}_${parentIndex}`" placement="left">
          <div class="d-flex flex-column">
            <span class="text-left mb-1">МНН по ЕСКЛП:</span>
            <span class="text-left mb-3">{{ row.item.klp ? row.item.klp.mnn : 'не сопоставлено' }}</span>
            <span class="text-left mb-1">Лек. форма и дозировка по ЕСКЛП:</span>
            <span class="text-left">{{
              row.item.klp ? `${row.item.klp.form}, ${row.item.klp.dosage.grls_value}` : 'не сопоставлено'
            }}</span>
          </div>
        </b-tooltip>
      </template>
      <template v-slot:head(klp.lf_norm_name)>
        <div id="lf_norm_name">2</div>
        <b-tooltip target="lf_norm_name" placement="left"> Лек. форма </b-tooltip>
      </template>
      <template v-slot:head(klp.trade_name)>
        <div id="trade_name">3</div>
        <b-tooltip target="trade_name" placement="left"> Торг. наименование </b-tooltip>
      </template>
      <template v-slot:cell(klp.trade_name)="row">
        <div
          v-if="row.item.klp && row.item.klp.trade_name"
          :id="`trade_name_cell_${row.index}_${parentIndex}`"
          class="font-weight-bold hide-text"
          style="font-size: 13px"
        >
          {{ row.item.klp && row.item.klp.trade_name ? row.item.klp.trade_name : '' }}
        </div>
        <div
          v-else
          :id="`trade_name_cell_${row.index}_${parentIndex}`"
          class="font-weight-bold hide-text"
          style="font-size: 13px"
        >
          {{ row.item.price.name_teh }}
        </div>
        <b-tooltip :target="`trade_name_cell_${row.index}_${parentIndex}`" placement="left">
          <div class="d-flex flex-column">
            <span class="mb-2">Торг. наименование:</span>
            <span v-if="row.item.klp && row.item.klp.trade_name">
              {{ row.item.klp && row.item.klp.trade_name ? row.item.klp.trade_name : '' }}
            </span>
            <span v-else>
              {{ row.item.price.name_teh }}
            </span>
          </div>
        </b-tooltip>
      </template>
      <template v-slot:head(temperature_mode)>
        <div id="temperature_mode">18</div>
        <b-tooltip target="temperature_mode" placement="left"> Терморежим </b-tooltip>
      </template>
      <template v-slot:cell(purchase_object_main_npp)="row">
        <div style="height: 140px">
          <b-icon-trophy-fill
            v-if="source === 'purchase_main' && row.item.is_price && !autoSelection"
            v-b-toggle="[`power_sidebar_${row.item.id}`]"
            class="h5 pointer custom_button"
            variant="success"
            style="margin-bottom: 36px"
          ></b-icon-trophy-fill>
          <b-icon-trophy
            v-else-if="source === 'purchase_main' && !row.item.is_price && !autoSelection"
            class="h5"
            variant="secondary"
            style="margin-bottom: 36px"
          ></b-icon-trophy>
          <b-sidebar
            v-if="source === 'purchase_main'"
            :id="`power_sidebar_${row.item.id}`"
            bg-variant="gray-200"
            backdrop-variant="secondary"
            width="100%"
            backdrop
            right
            shadow=""
            lazy
          >
            <purchase-best-prices :purchase-object="row.item"></purchase-best-prices>
          </b-sidebar>
          <span class="h5 font-weight-bold text-center" :style="row.item.is_match_mnn ? 'color: green;' : 'color: red;'"
            >{{ row.index }}
          </span>
          <b-icon-broadcast-pin
            v-if="source === 'purchase_main' && !autoSelection"
            class="h5 mb-0 pointer"
            style="margin-top: 36px"
            @click="getCurrentBestPrice(row.item)"
          ></b-icon-broadcast-pin>
        </div>
      </template>
      <template v-slot:cell(purchase_object_main)="row">
        <purchase-table
          v-if="autoSelection"
          source="purchase_modal"
          :main-id="row.index"
          class="custom_button"
          :auto-selection="autoSelection"
        />
        <purchase-table
          v-else
          v-b-toggle="[`info_sidebar_mnn_name_${row.item.id}`]"
          source="purchase_modal"
          :main-id="row.index"
          class="custom_button"
          :auto-selection="autoSelection"
        />
        <b-sidebar
          :id="`info_sidebar_mnn_name_${row.item.id}`"
          bg-variant="gray-200"
          backdrop-variant="secondary"
          backdrop
          width="35%"
          no-header-close
          no-close-on-backdrop
          shadow=""
          lazy
        >
          <template #default="{ hide }">
            <purchase-object-control :row="row" :hide="hide" />
          </template>
        </b-sidebar>
      </template>
      <template v-slot:cell(purchase_price_objects_main)="row">
        <div v-if="source === 'purchase_main'">
          <purchase-table
            v-if="row.item.price_objects && row.item.price_objects.length"
            source="purchase_modal_price"
            :price-objects="row.item.price_objects"
            :parent-index="row.item.id"
            :auto-selection="autoSelection"
          />
        </div>
      </template>
      <template v-slot:cell(temperature_mode)="row">
        <div
          :id="`temperature_mode_cell_${row.index}_${parentIndex}`"
          class="d-flex justify-content-end align-items-center"
        >
          <span>{{
            thermoMode(
              row.item.klp && row.item.klp.temperature_min === 0
                ? 0
                : row.item.klp
                ? row.item.klp.temperature_min
                : null,
              row.item.klp && row.item.klp.temperature_max === 0
                ? 0
                : row.item.klp
                ? row.item.klp.temperature_max
                : null
            ) === 'danger'
              ? row.item.klp
                ? `${
                    row.item.klp.temperature_min || row.item.klp.temperature_min === 0
                      ? row.item.klp.temperature_min
                      : "''"
                  } - ${
                    row.item.klp.temperature_max || row.item.klp.temperature_max === 0
                      ? row.item.klp.temperature_max
                      : "''"
                  }`
                : ''
              : ''
          }}</span>
          <span>
            <b-icon-thermometer
              class="h5 m-0"
              :variant="
                thermoMode(
                  row.item.klp && row.item.klp.temperature_min === 0
                    ? 0
                    : row.item.klp
                    ? row.item.klp.temperature_min
                    : null,
                  row.item.klp && row.item.klp.temperature_max === 0
                    ? 0
                    : row.item.klp
                    ? row.item.klp.temperature_max
                    : null
                )
              "
            ></b-icon-thermometer>
          </span>
        </div>
        <b-tooltip :target="`temperature_mode_cell_${row.index}_${parentIndex}`" placement="left">
          Терморежим
        </b-tooltip>
      </template>
      <template v-slot:head(drug_quantity_require)>
        <div id="drug_quantity_require">4</div>
        <b-tooltip target="drug_quantity_require" placement="left"> Требуется </b-tooltip>
      </template>
      <template v-slot:head(price.qnt)>
        <div id="price.qnt">5</div>
        <b-tooltip target="price.qnt" placement="left"> Остаток </b-tooltip>
      </template>
      <template v-slot:cell(price.qnt)="row">
        <div :id="`price.qnt_cell_${row.index}_${parentIndex}`">{{ $formatMoney(row.item.price.qnt, 0) }}</div>
        <b-tooltip :target="`price.qnt_cell_${row.index}_${parentIndex}`" placement="left"> Остаток </b-tooltip>
      </template>
      <template v-slot:head(price.seller)>
        <div id="price.seller">6</div>
        <b-tooltip target="price.seller" placement="left"> Поставщик </b-tooltip>
      </template>
      <template v-slot:cell(price.seller)="row">
        <div :id="`price.seller_cell_${row.index}_${parentIndex}`">{{ row.item.price.seller }}</div>
        <b-tooltip :target="`price.seller_cell_${row.index}_${parentIndex}`" placement="left"> Поставщик </b-tooltip>
      </template>
      <template v-slot:head(klp.manufacturer_name)>
        <div id="klp.manufacturer_name">7</div>
        <b-tooltip target="klp.manufacturer_name" placement="left"> Производитель </b-tooltip>
      </template>
      <template v-slot:cell(klp.manufacturer_name)="row">
        <div
          v-if="row.item.klp && row.item.klp.manufacturer_name"
          :id="`klp.manufacturer_name_cell_${row.index}_${parentIndex}`"
          class="d-flex flex-column"
          style="font-size: 10px"
        >
          <div class="mb-2">{{ row.item.klp ? row.item.klp.manufacturer_country_name : 'не определена' }}</div>
          <div>{{ row.item.klp ? row.item.klp.manufacturer_name : 'не определен' }}</div>
        </div>
        <div v-else :id="`klp.manufacturer_name_cell_${row.index}_${parentIndex}`" style="font-size: 10px">
          {{ row.item.price.firm }}
        </div>
        <b-tooltip :target="`klp.manufacturer_name_cell_${row.index}_${parentIndex}`" placement="left">
          Страна / Производитель
        </b-tooltip>
      </template>
      <template v-slot:head(klp.manufacturer_country_name)>
        <div id="klp.manufacturer_country_name">8</div>
        <b-tooltip target="klp.manufacturer_country_name" placement="left"> Страна происхождения </b-tooltip>
      </template>
      <template v-slot:cell(klp.manufacturer_country_name)="row">
        <div
          v-if="row.item.klp && row.item.klp.manufacturer_country_name"
          :id="`klp.manufacturer_country_name_cell_${row.index}_${parentIndex}`"
        >
          {{ row.item.klp && row.item.klp.manufacturer_country_name ? row.item.klp.manufacturer_country_name : '' }}
        </div>
        <div v-else :id="`klp.manufacturer_country_name_cell_${row.index}_${parentIndex}`">
          {{ row.item.price.cntr }}
        </div>
        <b-tooltip :target="`klp.manufacturer_country_name_cell_${row.index}_${parentIndex}`" placement="left">
          Страна происхождения
        </b-tooltip>
      </template>
      <template v-slot:head(price.gdate)>
        <div id="price.gdate">9</div>
        <b-tooltip target="price.gdate" placement="left"> Срок годности </b-tooltip>
      </template>
      <template v-slot:head(price_price)>
        <div id="price_price">10</div>
        <b-tooltip target="price_price" placement="left"> Закупочная цена </b-tooltip>
      </template>
      <template v-slot:head(price_require_current)>
        <div id="price_require_current">11</div>
        <b-tooltip target="price_require_current" placement="left"> Стоимость </b-tooltip>
      </template>
      <template v-slot:head(is_narcotic)>
        <div id="price_is_narcotic">16</div>
        <b-tooltip target="price_is_narcotic" placee.gment="left"> Сильнодействующий препарат / Наркотик </b-tooltip>
      </template>
      <template v-slot:cell(is_narcotic)="row">
        <div id="price_is_narcotic_2" class="mr-1">
          <b-icon-exclamation-triangle
            class="h5 m-0"
            :variant="
              row.item.klp && row.item.klp.is_narcotic
                ? 'danger'
                : row.item.klp && !row.item.klp.is_narcotic
                ? 'success'
                : 'secondary'
            "
          ></b-icon-exclamation-triangle>
        </div>
        <b-tooltip target="price_is_narcotic_2" placement="left"> Сильнодействующий препарат / Наркотик </b-tooltip>
      </template>
      <template v-slot:head(price.gnvls)>
        <div id="price.gnvls">17</div>
        <b-tooltip target="price.gnvls" placement="left"> ЖНВЛП </b-tooltip>
      </template>
      <template v-slot:head(price_price_znvlp)>
        <div id="price_price_znvlp">12</div>
        <b-tooltip target="price_price_znvlp" placement="left"> Цена производителя </b-tooltip>
      </template>
      <template v-slot:head(price.price_require_gnvlp)>
        <div id="price.price_require_gnvlp">13</div>
        <b-tooltip target="price.price_require_gnvlp" placement="left"> Наша цена контракта </b-tooltip>
      </template>
      <template v-slot:head(price_require_gnvlp_surcharge)>
        <div id="price_require_gnvlp_surcharge">Цена произв-ля ЖНВЛП</div>
        <b-tooltip target="price_require_gnvlp_surcharge" placement="left">
          Цена производителя с региональной надбавкой (если ЖНВЛП)
        </b-tooltip>
      </template>
      <template v-slot:head(klp.pre_packing)>
        <div id="klp.pre_packing">Трансп. уп.</div>
        <b-tooltip target="klp.pre_packing" placement="left"> Транспортная упаковка </b-tooltip>
      </template>
      <template v-slot:cell(klp.pre_packing)="row">
        <div v-if="row.item.klp && row.item.klp.pre_packing" :id="`klp.pre_packing_cell_${row.index}_${parentIndex}`">
          {{ row.item.klp && row.item.klp.pre_packing ? row.item.klp.pre_packing : '' }}
        </div>
        <div v-else :id="`klp.pre_packing_cell_${row.index}_${parentIndex}`">
          {{ row.item.price.packing }}
        </div>
        <b-tooltip :target="`klp.pre_packing_cell_${row.index}_${parentIndex}`" placement="left">
          Транспортная упаковка
        </b-tooltip>
      </template>
      <template v-slot:head(count_box)>
        <div id="count_box">14</div>
        <b-tooltip target="count_box" placement="left"> Количество коробок </b-tooltip>
      </template>
      <template v-slot:head(weight_box)>
        <div id="weight_box">Вес всех коробок</div>
        <b-tooltip target="weight_box" placement="left"> Вес всех коробок </b-tooltip>
      </template>
      <template v-slot:head(dimension)>
        <div id="dimension">Габариты</div>
        <b-tooltip target="dimension" placement="left"> Габариты </b-tooltip>
      </template>
      <template v-slot:cell(dimension)="row">
        <div :id="`dimension_cell_${row.index}_${parentIndex}`">{{ row.item.dimension }}</div>
        <b-tooltip :target="`dimension_cell_${row.index}_${parentIndex}`" placement="left"> Габариты </b-tooltip>
      </template>
      <template v-slot:head(klp.expiration_date)>
        <div id="klp.expiration_date">Срок годн. полн.</div>
        <b-tooltip target="klp.expiration_date" placement="left"> Срок годности полный </b-tooltip>
      </template>
      <template v-slot:head(comment)>
        <div id="comment">15</div>
        <b-tooltip target="comment" placement="left"> Комментарий </b-tooltip>
      </template>
      <template v-slot:head(klp.num_reg)>
        <div id="klp.num_reg">19</div>
        <b-tooltip target="klp.num_reg" placement="left"> № рег. удостоверения </b-tooltip>
      </template>
      <template v-slot:cell(klp.num_reg)="row">
        <div :id="`klp.num_reg_cell_${row.index}_${parentIndex}`">
          <div class="d-flex flex-column align-items-center">
            <!--            <span style="font-size: 8px;">{{ row.item.klp && row.item.klp.num_reg ? row.item.klp.num_reg : '' }}</span>-->
            <a
              v-if="row.item.klp && row.item.klp.ru_file"
              :href="`https://grls.rosminzdrav.ru/GRLS.aspx?RegNumber=${row.item.klp.num_reg}`"
              target="_blank"
            >
              <b-icon-file-earmark-check-fill
                v-if="row.item.klp_uuid_links && row.item.klp_uuid_links.length"
                class="h5 m-0"
                :variant="
                  shelfLifeRu(row.item.klp ? row.item.klp.date_ru_file : false)
                    ? 'danger'
                    : row.item.klp && row.item.klp.comment_ru
                    ? 'indigo'
                    : 'info'
                "
              ></b-icon-file-earmark-check-fill>
              <b-icon-file-earmark-check
                v-else
                class="h5 m-0"
                :variant="
                  shelfLifeRu(row.item.klp ? row.item.klp.date_ru_file : false)
                    ? 'danger'
                    : row.item.klp && row.item.klp.comment_ru
                    ? 'indigo'
                    : 'info'
                "
              ></b-icon-file-earmark-check>
            </a>
            <a
              v-else-if="row.item.klp && row.item.klp.num_reg"
              :href="`https://grls.rosminzdrav.ru/GRLS.aspx?RegNumber=${row.item.klp.num_reg}`"
              target="_blank"
            >
              <b-icon-file-earmark-break-fill
                v-if="row.item.klp_uuid_links && row.item.klp_uuid_links.length"
                class="h5 m-0"
                variant="secondary"
              ></b-icon-file-earmark-break-fill>
              <b-icon-file-earmark-break v-else class="h5 m-0" variant="secondary"></b-icon-file-earmark-break>
            </a>
            <a v-else target="_blank">
              <b-icon-file-earmark-break-fill
                v-if="row.item.klp_uuid_links && row.item.klp_uuid_links.length"
                class="h5 m-0"
                variant="secondary"
              ></b-icon-file-earmark-break-fill>
              <b-icon-file-earmark-break v-else class="h5 m-0" variant="secondary"></b-icon-file-earmark-break>
            </a>
          </div>
        </div>
        <b-tooltip :target="`klp.num_reg_cell_${row.index}_${parentIndex}`" placement="left">
          <div class="d-flex flex-column">
            <span
              v-if="ruFile === 'Копия РУ' || ruFile === 'Реквизиты РУ'"
              v-b-toggle="[`sidebar_expand_ru_${row.item.id}`]"
              class="pointer px-2 py-1 mb-2"
              style="border: 1px solid grey"
              @click="opendExpandRu(row.item)"
              >Расширить РУ</span
            >
            <div v-if="row.item.klp_uuid_links_info && row.item.klp_uuid_links_info.length" class="d-flex flex-column">
              <template v-for="(file, key) in row.item.klp_uuid_links_info">
                <span :key="key" class="mb-2 text-left">{{ key + 1 }}. {{ file.manufacturer_name.toLowerCase() }}</span>
              </template>
            </div>
            <div>
              {{ row.item.klp && row.item.klp.comment_ru ? `${row.item.klp.comment_ru}` : '' }}
            </div>
            <div>
              {{
                row.item.klp && row.item.klp.date_ru_file
                  ? `Дата окончания РУ: ${$moment(row.item.klp.date_ru_file).format('DD.MM.YYYY')}`
                  : ''
              }}
            </div>
          </div>
        </b-tooltip>
        <b-sidebar
          v-if="source === 'purchase_modal_price'"
          :id="`sidebar_expand_ru_${row.item.id}`"
          bg-variant="gray-200"
          backdrop-variant="secondary"
          width="100%"
          backdrop
          right
          shadow=""
          lazy
          @shown="openExpandedRu(row.item)"
        >
          <expand-ru :price-object="row.item"></expand-ru>
        </b-sidebar>
      </template>
      <template v-slot:cell(positions)="row">
        <div class="d-flex flex-column align-items-center">
          <div class="mb-1">{{ `${row.item.find_prices}/${row.item.count_objects}` }}</div>
          <template>
            <b-icon-circle v-if="row.item.find_prices === 0" variant="danger" class="h5 m-0"></b-icon-circle>
            <b-icon-circle-half
              v-else-if="row.item.find_prices > 0 && row.item.find_prices !== row.item.count_objects"
              variant="warning"
              class="h5 m-0"
            ></b-icon-circle-half>
            <b-icon-circle-fill
              v-else-if="row.item.find_prices === row.item.count_objects"
              variant="success"
              class="h5 m-0"
            ></b-icon-circle-fill>
          </template>
        </div>
      </template>
      <template v-slot:cell(npp)="row">
        <span class="h4">{{ row.index !== 0 ? row.index : '' }}</span>
      </template>
      <template v-slot:cell(end_date)="row">
        <div class="d-flex align-items-center">
          <div class="d-flex flex-column mr-1">
            <span>{{ $moment(row.item.end_date).format('DD.MM.YYYY') }}</span>
            <span>{{ $moment(row.item.end_date).format('HH:mm') }}</span>
          </div>
          <b-icon-exclamation-triangle-fill
            v-if="
              ((row.item.status && row.item.status.slug === 'processed') ||
                (row.item.status && row.item.status.slug === 'check')) &&
              numberWorkingDays($moment(), 3, row.item.end_date)
            "
            variant="danger"
            class="m-0 h5"
          ></b-icon-exclamation-triangle-fill>
          <b-icon-exclamation-triangle-fill
            v-else-if="
              ((row.item.status && row.item.status.slug === 'formalized') ||
                (row.item.status && row.item.status.slug === 'control')) &&
              numberWorkingDays($moment(), 2, row.item.end_date)
            "
            variant="danger"
            class="m-0 h5"
          ></b-icon-exclamation-triangle-fill>
          <b-icon-exclamation-triangle-fill
            v-else-if="
              row.item.status && row.item.status.slug === 'verified' && numberWorkingDaysVerified(row.item.end_date)
            "
            variant="danger"
            class="m-0 h5"
          ></b-icon-exclamation-triangle-fill>
        </div>
      </template>
      <template v-slot:cell(user)="row">
        <div>
          {{ row.item.user && row.item.user.name ? row.item.user.name : 'Не назначен' }}
        </div>
      </template>
      <template v-slot:cell(etp_code)="row">
        {{ currentTradingPlace(row.item.etp_code) }}
      </template>
      <template v-slot:cell(is_profitability)="row">
        <div class="d-flex justify-content-center">
          <b-icon-cash-stack v-if="row.item.is_profitability" variant="success" class="h5 m-0"></b-icon-cash-stack>
          <b-icon-cash-stack v-else variant="danger" class="h5 m-0"></b-icon-cash-stack>
        </div>
      </template>
      <template v-slot:cell(sp_flag)="row">
        <div class="d-flex justify-content-center">
          <b-icon-people-fill
            class="h5 m-0"
            :variant="row.item.responsible_role === 'OCU' || row.item.responsible_role === 'ORA' ? 'info' : 'light'"
          ></b-icon-people-fill>
        </div>
      </template>
      <template v-if="showMassiveArchived" v-slot:head(archive)>
        <div class="d-flex justify-content-center flex-column">
          <b-icon-archive
            v-if="archivedPurchase && archivedPurchase.length"
            class="h4 m-0 mb-2 pointer mr-1"
            variant="info"
            @click="archivePurchases"
          ></b-icon-archive>
          <b-icon-archive v-else class="h4 m-0 mb-2 mr-1" variant="secondary"></b-icon-archive>
          <span class="m-0 h5 text-center">{{
            archivedPurchase && archivedPurchase.length ? archivedPurchase.length : 0
          }}</span>
        </div>
      </template>
      <template v-slot:cell(archive)="row">
        <div class="d-flex justify-content-center">
          <b-icon-archive class="h5 m-0 pointer" @click="showArchiveModal(row.item)"></b-icon-archive>
        </div>
      </template>
      <template v-slot:cell(is_preferences)="row">
        <div class="d-flex justify-content-center">
          <b-icon-lightning-fill
            v-if="row.item.is_preferences"
            variant="success"
            class="h5 m-0 pointer"
          ></b-icon-lightning-fill>
          <b-icon-lightning-fill v-else variant="warning" class="h5 m-0 pointer"></b-icon-lightning-fill>
        </div>
      </template>
      <template v-slot:row-details="row" class="p-0">
        <template v-if="source === 'purchase_modal_price'">
          <purchase-table
            source="purchase_modal_price_expansion"
            :price-objects-expansion="getCurrentPriceObject(priceObjects, row.item.id)"
            :parent-index="row.item.id"
            :auto-selection="autoSelection"
          />
        </template>
      </template>
      <template v-if="source === 'purchase_modal_price'" v-slot:head(remove)>
        <div style="height: 47px"></div>
      </template>
      <template v-slot:cell(remove)="row">
        <div
          class="d-flex flex-wrap align-content-between flex_flow_row_wrap"
          :class="source === 'purchase_main' ? 'p-2' : ''"
        >
          <b-icon-file-earmark-plus
            v-if="source === 'purchase_main' && !autoSelection"
            class="h5 pointer mb-0 mr-2 mb-3"
            variant="info"
            @click="openPurchaseSearchModal(row.item)"
          ></b-icon-file-earmark-plus>
          <div v-if="row.index !== 0 && source === 'purchase_main'" class="d-flex align-items-center">
            <b-icon-heart-fill
              v-if="row.item.is_znvlp"
              variant="danger"
              class="h5 m-0 mr-2 mb-3"
              @click="togglePurchaseObjectZnvlp(row.item, false)"
            ></b-icon-heart-fill>
            <b-icon-heart
              v-else
              class="h5 m-0 mr-2 mb-3"
              @click="togglePurchaseObjectZnvlp(row.item, true)"
            ></b-icon-heart>
          </div>
          <b-icon-layers-fill
            v-if="source === 'purchase_main' && getCurrentReplacement(row.item) && row.index !== 0 && !autoSelection"
            v-b-toggle="[`info_sidebar_${row.item.id}`]"
            class="h5 mb-0 mr-2 custom_button mb-3"
            variant="info"
          ></b-icon-layers-fill>
          <b-icon-layers
            v-else-if="
              source === 'purchase_main' && !getCurrentReplacement(row.item) && row.index !== 0 && !autoSelection
            "
            class="h5 mb-0 mr-2 custom_button mb-3"
            variant="secondary"
          ></b-icon-layers>
          <b-sidebar
            v-if="source === 'purchase_main'"
            :id="`info_sidebar_${row.item.id}`"
            bg-variant="gray-200"
            backdrop-variant="secondary"
            width="40%"
            backdrop
            right
            shadow=""
            lazy
          >
            <purchase-eq-replacement :eq-replacement="getCurrentReplacement(row.item)"></purchase-eq-replacement>
          </b-sidebar>
          <b-icon-trash
            v-if="source === 'purchase_main' && row.item.is_manual && !autoSelection"
            class="h5 pointer mb-0"
            variant="info"
            @click="removePurchaseObject(row)"
          ></b-icon-trash>
          <b-icon-trash
            v-else-if="source === 'purchase_main' && !row.item.is_manual && !autoSelection"
            class="h5 mb-0"
            variant="secondary"
          ></b-icon-trash>
          <div
            v-else-if="source === 'purchase_modal_price' && !autoSelection"
            :style="priceObjects.length === 1 ? 'height: 138px;' : ''"
            class="d-flex flex-column"
          >
            <b-icon-x class="h5 pointer mb-0" variant="info" @click="removePurchasePriceObject(row)"></b-icon-x>
            <b-icon-arrow-up-short
              v-if="row.item._showDetails"
              class="h5 pointer m-0"
              :class="priceObjects.length === 1 ? 'margin_top_custom_first' : 'mt-4'"
              @click="row.toggleDetails"
            ></b-icon-arrow-up-short>
            <b-icon-arrow-down-short
              v-else
              class="h5 pointer m-0"
              :class="priceObjects.length === 1 ? 'margin_top_custom_first' : 'mt-4'"
              @click="toggleDetails(row)"
            ></b-icon-arrow-down-short>
          </div>
          <span v-else>{{ '' }}</span>
        </div>
      </template>
      <template v-slot:cell(price_control)="row">
        <b-icon-check-square-fill
          v-if="row.item.is_replace"
          class="h4 m-0 pointer"
          :variant="row.item.price_status"
          @click="togglePriceObjectReplace(row.item)"
        ></b-icon-check-square-fill>
        <b-icon-check-square
          v-else-if="row.item.is_current"
          class="h4 m-0 pointer"
          :variant="row.item.price_status"
          @click="togglePriceObject(row.item)"
        ></b-icon-check-square>
        <b-icon-square
          v-else
          class="h4 m-0 pointer"
          :variant="row.item.price_status"
          @click="togglePriceObject(row.item)"
        ></b-icon-square>
      </template>
      <template v-slot:cell(price.gdate)="row">
        <div
          :id="`price.gdate_cell_${row.index}_${parentIndex}`"
          :style="
            isGdateExpire(
              row.item.price.gdate,
              row.item.klp && row.item.klp.expiration_date ? row.item.klp.expiration_date : null
            ) === null
              ? 'color: black'
              : isGdateExpire(
                  row.item.price.gdate,
                  row.item.klp && row.item.klp.expiration_date ? row.item.klp.expiration_date : null
                )
              ? 'color: green'
              : 'color: red'
          "
        >
          {{ $moment(row.item.price.gdate).format('DD.MM.YYYY') }}
        </div>
        <b-tooltip :target="`price.gdate_cell_${row.index}_${parentIndex}`" placement="left">
          <div class="d-flex flex-column">
            <span class="text-left mb-2">Срок годности: {{ $moment(row.item.price.gdate).format('DD.MM.YYYY') }}</span>
            <span class="text-left"
              >Срок годности полный: {{ row.item.klp ? row.item.klp.expiration_date : 'не указан' }}</span
            >
          </div>
        </b-tooltip>
      </template>
      <template v-slot:cell(mnn)="row">
        <div :id="`purchase_object_mnn_${row.item.id}`" class="d-flex align-items-center">
          <span v-if="source === 'purchase_modal_search'" class="several_lines purchase_main_field w-100">{{
            row.item.mnn.toLowerCase()
          }}</span>
          <span v-else-if="row.index !== 0" class="several_lines purchase_main_field w-100">
            {{ row.item.mnn ? row.item.mnn.toLowerCase() : 'Выберите значение' }}
          </span>
          <span v-else></span>
        </div>
        <b-tooltip :target="`purchase_object_mnn_${row.item.id}`" placement="right">
          <span v-if="source === 'purchase_modal_search'" class="purchase_main_field">{{ row.item.mnn }}</span>
          <span v-else-if="row.index !== 0" class="purchase_main_field">
            {{ row.item.mnn ? row.item.mnn : 'Выберите значение' }}
          </span>
          <span v-else></span>
        </b-tooltip>
      </template>
      <template v-slot:cell(form_name)="row">
        <div :id="`purchase_object_form_name_${row.item.id}`" class="d-flex align-items-center">
          <span v-if="source === 'purchase_modal_search'" class="several_lines purchase_main_field w-100">{{
            row.item.form_name.toLowerCase()
          }}</span>
          <span v-else-if="row.index !== 0" class="several_lines purchase_main_field w-100">
            {{ row.item.form_name ? row.item.form_name.toLowerCase() : 'Выберите значение' }}
          </span>
          <span v-else></span>
        </div>
        <b-tooltip :target="`purchase_object_form_name_${row.item.id}`" placement="right">
          <span v-if="source === 'purchase_modal_search'" class="purchase_main_field">{{ row.item.form_name }}</span>
          <span v-else-if="row.index !== 0" class="purchase_main_field">
            {{ row.item.form_name ? row.item.form_name : 'Выберите значение' }}
          </span>
          <span v-else></span>
        </b-tooltip>
      </template>
      <template v-slot:cell(dosage_grls_value)="row">
        <div class="d-flex align-items-center">
          <span v-if="source === 'purchase_modal_search'" class="hide-text purchase_main_field">{{
            row.item.dosage_grls_value
          }}</span>
          <span v-else-if="row.index !== 0" class="hide-text purchase_main_field">
            {{ row.item.dosage_grls_value }}
          </span>
          <span v-else></span>
        </div>
      </template>
      <template v-slot:cell(drug_quantity)="row">
        <div class="d-flex align-items-center">
          <span v-if="source === 'purchase_modal_search'" class="hide-text purchase_main_field">{{
            row.item.drug_quantity
          }}</span>
          <span v-else-if="row.index !== 0" class="hide-text purchase_main_field">
            {{ row.item.drug_quantity }}
          </span>
          <span v-else></span>
        </div>
      </template>
      <template v-slot:cell(okei_code)="row">
        <div class="d-flex align-items-center">
          <span v-if="source === 'purchase_modal_search'" class="hide-text purchase_main_field">{{
            row.item.okei_code && currentOkei(row.item.okei_code) && currentOkei(row.item.okei_code).local_name
              ? currentOkei(row.item.okei_code).local_name
              : 'Значение отсутствует'
          }}</span>
          <span v-else-if="row.index !== 0" class="hide-text purchase_main_field">
            {{
              row.item.okei_code && currentOkei(row.item.okei_code) && currentOkei(row.item.okei_code).local_name
                ? currentOkei(row.item.okei_code).local_name
                : 'Выберите значение'
            }}
          </span>
          <span v-else></span>
        </div>
      </template>
      <template v-slot:cell(price_per_unit)="row">
        <span v-if="source === 'purchase_modal_search'" class="hide-text purchase_main_field">{{
          row.item.price_per_unit
        }}</span>
        <span v-else-if="row.index !== 0" class="hide-text purchase_main_field">
          {{ row.item.price_per_unit }}
        </span>
        <span v-else></span>
      </template>
      <template v-slot:cell(position_price)="row">
        <span v-if="source === 'purchase_modal_search'" class="hide-text purchase_main_field">{{
          $formatMoney(row.item.position_price)
        }}</span>
        <span v-else-if="row.index !== 0" class="hide-text purchase_main_field">
          {{ row.item.position_price }}
        </span>
        <span v-else></span>
      </template>
      <template v-slot:cell(is_znvlp)="row">
        <div v-if="row.index !== 0 || source === 'purchase_modal_search'" class="d-flex align-items-center">
          <b-icon-heart-fill v-if="row.item.is_znvlp" variant="danger" class="h4 m-0"></b-icon-heart-fill>
          <b-icon-heart v-else class="h4 m-0"></b-icon-heart>
        </div>
        <span v-else></span>
      </template>
      <template v-slot:cell(price.gnvls)="row">
        <div :id="`price.gnvls_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">
          <b-icon-heart-fill
            v-if="row.item.price.gnvls"
            variant="danger"
            class="h5 m-0"
            @click="togglePriceObjectGnvls(row.item)"
          ></b-icon-heart-fill>
          <b-icon-heart v-else class="h5 m-0"></b-icon-heart>
        </div>
        <b-tooltip :target="`price.gnvls_cell_${row.index}_${parentIndex}`" placement="left"> ЖНВЛП </b-tooltip>
      </template>
      <template v-slot:cell(drug_quantity_require)="row">
        <div :id="`drug_quantity_require_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">
          <div v-if="row.item.klp" class="mr-1">
            <template v-if="quantityState(row.item, row.item.klp.prices) === 'first'">
              <b-icon-reception4
                :id="`quantity_state_first_${row.item.id}_${autoSelection}`"
                class="m-0 h5 custom_button"
                variant="success"
              ></b-icon-reception4>
              <b-tooltip :target="`quantity_state_first_${row.item.id}_${autoSelection}`" placement="left" lazy>
                <number-medicines :prices="row.item.klp.prices"></number-medicines>
              </b-tooltip>
            </template>
            <template v-else-if="quantityState(row.item, row.item.klp.prices) === 'second'">
              <b-icon-reception3
                :id="`quantity_state_second_${row.item.id}_${autoSelection}`"
                class="m-0 h5 custom_button"
                variant="success"
              ></b-icon-reception3>
              <b-tooltip :target="`quantity_state_second_${row.item.id}_${autoSelection}`" placement="left" lazy>
                <number-medicines :prices="row.item.klp.prices"></number-medicines>
              </b-tooltip>
            </template>
            <template v-else-if="quantityState(row.item, row.item.klp.prices) === 'third'">
              <b-icon-reception2
                :id="`quantity_state_third_${row.item.id}_${autoSelection}`"
                class="m-0 h5 custom_button"
                variant="warning"
              ></b-icon-reception2>
              <b-tooltip :target="`quantity_state_third_${row.item.id}_${autoSelection}`" placement="left" lazy>
                <number-medicines :prices="row.item.klp.prices"></number-medicines>
              </b-tooltip>
            </template>
            <template v-else-if="quantityState(row.item, row.item.klp.prices) === 'forth'">
              <b-icon-reception1
                :id="`quantity_state_forth_${row.item.id}_${autoSelection}`"
                class="m-0 h5 custom_button"
                variant="danger"
              ></b-icon-reception1>
              <b-tooltip :target="`quantity_state_forth_${row.item.id}_${autoSelection}`" placement="left" lazy>
                <number-medicines :prices="row.item.klp.prices"></number-medicines>
              </b-tooltip>
            </template>
            <template v-else-if="quantityState(row.item, row.item.klp.prices) === 'fifth'">
              <b-icon-reception0
                :id="`quantity_state_fifth_${row.item.id}_${autoSelection}`"
                class="m-0 h5 custom_button"
                variant="danger"
              ></b-icon-reception0>
              <b-tooltip
                :target="`quantity_state_fifth_${row.item.id}_${autoSelectionModalStatus}`"
                placement="left"
                lazy
              >
                <number-medicines :prices="row.item.klp.prices"></number-medicines>
              </b-tooltip>
            </template>
          </div>
          <div>
            <b-form-input
              v-model.number="row.item.drug_quantity_require"
              type="number"
              class="w-100"
              :class="
                row.item.drug_quantity_require > row.item.price.qnt
                  ? 'purchase_price_field_error'
                  : 'purchase_price_field'
              "
              placeholder="Кол-во"
              @change="updatePurchasePriceObject(row.item, 'drug_quantity_require')"
            ></b-form-input>
          </div>
        </div>
        <b-tooltip :target="`drug_quantity_require_cell_${row.index}_${parentIndex}`" placement="left">
          Требуется
        </b-tooltip>
      </template>
      <template v-slot:cell(price_price)="row">
        <div :id="`price_price_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">
          <b-form-input
            v-model.number="row.item.price_price"
            type="number"
            class="purchase_price_field"
            :class="
              priceIndexChange(row.item.price_price, row.item.price.price) === 'yellow'
                ? 'purchase_price_field_yellow'
                : priceIndexChange(row.item.price_price, row.item.price.price) === 'orange'
                ? 'purchase_price_field_orange'
                : priceIndexChange(row.item.price_price, row.item.price.price) === 'red'
                ? 'purchase_price_field_error'
                : 'purchase_price_field'
            "
            placeholder="Цена"
            @change="updatePurchasePriceObject(row.item, 'price_price')"
          ></b-form-input>
        </div>
        <b-tooltip :target="`price_price_cell_${row.index}_${parentIndex}`" placement="left">
          <div class="d-flex flex-column">
            <span class="text-left mb-2">Закупочная цена: {{ row.item.price_price }}</span>
            <span class="text-left">Закуп. цена ориг.: {{ row.item.price.price }}</span>
          </div>
        </b-tooltip>
      </template>
      <template v-slot:cell(price_price_znvlp)="row">
        <div :id="`price_price_znvlp_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">
          <b-form-input
            v-model.number="row.item.price_price_znvlp"
            type="number"
            class="purchase_price_field"
            placeholder="Цена"
            @change="updatePurchasePriceObject(row.item, 'price_price_znvlp')"
          ></b-form-input>
        </div>
        <b-tooltip :target="`price_price_znvlp_cell_${row.index}_${parentIndex}`" placement="left">
          Цена производителя
        </b-tooltip>
      </template>
      <template v-slot:cell(comment)="row">
        <div :id="`comment_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">
          <b-form-textarea
            v-model="row.item.comment"
            class="purchase_price_field"
            placeholder="Комментарий"
            rows="3"
            @change="updatePurchasePriceObject(row.item, 'comment')"
          ></b-form-textarea>
        </div>
        <b-tooltip :target="`comment_cell_${row.index}_${parentIndex}`" placement="left"> Комментарий </b-tooltip>
      </template>
      <template v-slot:cell(comments)="row">
        <div class="d-flex justify-content-center align-items-center">
          <b-icon-chat-right-dots
            v-if="row.item.phrase_ids && !row.item.phrase_ids.length"
            v-b-toggle="[`info_sidebar_comments_${row.item.id}`]"
            class="h5 m-0 pointer custom_button"
          ></b-icon-chat-right-dots>
          <div v-else v-b-toggle="[`info_sidebar_comments_${row.item.id}`]" class="custom_button">
            <div v-for="(phraseId, key) in row.item.phrase_ids" :key="key">
              <p class="m-0 purchase_price_field">{{ key + 1 }}. {{ currentPhrase(phraseId) }}</p>
            </div>
          </div>
        </div>
        <b-sidebar
          v-if="source === 'purchase_modal_price'"
          :id="`info_sidebar_comments_${row.item.id}`"
          bg-variant="gray-200"
          backdrop-variant="secondary"
          backdrop
          right
          shadow=""
          lazy
          @hidden="commentSideBarIsHidden"
        >
          <purchase-phrases v-if="source === 'purchase_modal_price'" :price-object="row.item"></purchase-phrases>
        </b-sidebar>
      </template>
      <template v-slot:cell(price_require_current)="row">
        <div :id="`price_require_current_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">
          {{ $formatMoney(row.item.drug_quantity_require * row.item.price_price) }}
        </div>
        <b-tooltip :target="`price_require_current_cell_${row.index}_${parentIndex}`" placement="left">
          Стоимость
        </b-tooltip>
      </template>
      <template v-slot:cell(price.price_require_gnvlp)="row">
        <div :id="`price.price_require_gnvlp_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">
          {{
            $formatMoney(
              (row.item.drug_quantity_require * Math.trunc(purchaseCostSurcharge(row.item.price_price_znvlp) * 100)) /
                100
            )
          }}
        </div>
        <b-tooltip :target="`price.price_require_gnvlp_cell_${row.index}_${parentIndex}`" placement="left">
          Наша цена контракта
        </b-tooltip>
      </template>
      <template v-slot:cell(price_require_gnvlp_surcharge)="row">
        <div :id="`price_require_gnvlp_surcharge_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">
          {{ Math.trunc(purchaseCostSurcharge(row.item.price_price_znvlp) * 100) / 100 }}
        </div>
        <b-tooltip :target="`price_require_gnvlp_surcharge_cell_${row.index}_${parentIndex}`" placement="left">
          Цена производителя с региональной надбавкой (если ЖНВЛП)
        </b-tooltip>
      </template>
      <template v-slot:cell(count_box)="row">
        <div :id="`count_box_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">
          {{
            row.item.klp
              ? (row.item.drug_quantity_require / row.item.klp.pre_packing).toFixed(2) !== 'Infinity'
                ? (row.item.drug_quantity_require / row.item.klp.pre_packing).toFixed(2)
                : 0
              : (row.item.drug_quantity_require / row.item.price.packing).toFixed(2) !== 'Infinity'
              ? (row.item.drug_quantity_require / row.item.price.packing).toFixed(2)
              : 0
          }}
        </div>
        <b-tooltip :target="`count_box_cell_${row.index}_${parentIndex}`" placement="left">
          <div class="d-flex flex-column">
            <span class="text-left mb-1">Количество коробок</span>
            <span class="text-left mb-3">
              {{
                row.item.klp
                  ? (row.item.drug_quantity_require / row.item.klp.pre_packing).toFixed(2) !== 'Infinity'
                    ? (row.item.drug_quantity_require / row.item.klp.pre_packing).toFixed(2)
                    : 0
                  : (row.item.drug_quantity_require / row.item.price.packing).toFixed(2) !== 'Infinity'
                  ? (row.item.drug_quantity_require / row.item.price.packing).toFixed(2)
                  : 0
              }}
            </span>
            <span class="text-left mb-1">Трасп. упаковка</span>
            <span v-if="row.item.klp && row.item.klp.pre_packing" class="text-left mb-3">
              {{ row.item.klp && row.item.klp.pre_packing ? row.item.klp.pre_packing : '' }}
            </span>
            <span v-else class="text-left mb-3">
              {{ row.item.price.packing }}
            </span>
            <span class="text-left mb-1">Вес всех коробок:</span>
            <span class="text-left">
              {{
                row.item.klp
                  ? ((row.item.drug_quantity_require / row.item.klp.pre_packing) * 7).toFixed(2) !== 'Infinity'
                    ? ((row.item.drug_quantity_require / row.item.klp.pre_packing) * 7).toFixed(2)
                    : 0
                  : ''
              }}
            </span>
          </div>
        </b-tooltip>
      </template>
      <template v-slot:cell(offer_price)="row">
        <b-form-input
          v-model.number="row.item.offer_price"
          type="number"
          class="purchase_price_field"
          placeholder="Цена"
          @change="updatePurchasePriceObject(row.item, 'offer_price')"
        ></b-form-input>
      </template>
      <template v-slot:cell(offer_position)="row">
        <div>
          {{ (row.item.offer_price * row.item.drug_quantity_require).toFixed(2) }}
        </div>
      </template>
      <template v-slot:cell(weight_box)="row">
        <div :id="`weight_box_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">
          {{
            row.item.klp
              ? ((row.item.drug_quantity_require / row.item.klp.pre_packing) * 7).toFixed(2) !== 'Infinity'
                ? ((row.item.drug_quantity_require / row.item.klp.pre_packing) * 7).toFixed(2)
                : 0
              : ''
          }}
        </div>
        <b-tooltip :target="`weight_box_cell_${row.index}_${parentIndex}`" placement="left">
          Вес всех коробок
        </b-tooltip>
      </template>
      <template v-slot:cell(klp.expiration_date)="row">
        <div :id="`klp.expiration_date_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">
          <p class="m-0">
            {{ row.item.klp ? row.item.klp.expiration_date : '' }}
          </p>
        </div>
        <!--        <div v-else :id="`klp.expiration_date_cell_${row.index}_${parentIndex}`" class="d-flex align-items-center">-->
        <!--          {{ $moment(row.item.price.gdate).format('DD.MM.YYYY') }}-->
        <!--        </div>-->
        <b-tooltip :target="`klp.expiration_date_cell_${row.index}_${parentIndex}`" placement="left">
          Срок годности полный
        </b-tooltip>
      </template>
      <template v-slot:cell(klp.lf_norm_name)="row">
        <div v-if="row.item.lf_name" :id="`lf_norm_name_cell_${row.index}_${parentIndex}`">
          <b-form-textarea
            v-model="row.item.lf_name"
            class="purchase_price_field"
            placeholder="Лек. форма"
            rows="3"
            @change="updatePurchasePriceObjectField(row.item, { field: 'lf_name', value: row.item.lf_name })"
          ></b-form-textarea>
        </div>
        <div v-else-if="row.item.klp && row.item.klp.name_teh" :id="`lf_norm_name_cell_${row.index}_${parentIndex}`">
          <b-form-textarea
            v-model="row.item.klp.name_teh"
            class="purchase_price_field"
            placeholder="Лек. форма"
            rows="3"
            @change="updatePurchasePriceObjectField(row.item, { field: 'lf_name', value: row.item.klp.name_teh })"
          ></b-form-textarea>
        </div>
        <div
          v-else-if="row.item.klp && row.item.klp.lf_norm_name"
          :id="`lf_norm_name_cell_${row.index}_${parentIndex}`"
        >
          <b-form-input
            v-model="row.item.klp.lf_norm_name"
            class="purchase_price_field"
            placeholder="Лек. форма"
            @change="updatePurchasePriceObjectField(row.item, { field: 'lf_name', value: row.item.klp.lf_norm_name })"
          ></b-form-input>
        </div>
        <div v-else>{{ row.item && row.item.price.name ? row.item.price.name : '' }}</div>
        <b-tooltip :target="`lf_norm_name_cell_${row.index}_${parentIndex}`" placement="left">
          <div class="d-flex flex-column">
            <span>Лек. форма</span>
            <span>{{
              row.item && row.item.klp && row.item.klp.matching_comment
                ? `Комментарий: ${row.item.klp.matching_comment}`
                : null
            }}</span>
          </div>
        </b-tooltip>
      </template>
      <template v-slot:cell(purchase_number)="row">
        <div class="d-flex align-items-center">
          {{
            row.item.is_manual
              ? row.item.purchase_number_manual
              : row.item.purchase_number === '0000000000000000000'
              ? row.item.registration_number
              : row.item.purchase_number
          }}
        </div>
      </template>
      <template v-slot:cell(updated_at)="row">
        <div class="d-flex flex-column">
          <span>{{ row.item.updated_at ? $moment(row.item.updated_at).format('DD.MM.YYYY') : 'не указана' }}</span>
          <span>{{ row.item.updated_at ? $moment(row.item.updated_at).format('HH:mm') : '' }}</span>
        </div>
      </template>
      <template v-slot:cell(start_date)="row">
        <div class="d-flex flex-column">
          <span>{{ row.item.start_date ? $moment(row.item.start_date).format('DD.MM.YYYY') : 'не указана' }}</span>
          <span>{{ row.item.start_date ? $moment(row.item.start_date).format('HH:mm') : '' }}</span>
        </div>
      </template>
      <template v-slot:cell(bidding_date)="row">
        <div class="d-flex flex-column">
          <span>{{ row.item.bidding_date ? $moment(row.item.bidding_date).format('DD.MM.YYYY') : 'не указана' }}</span>
          <span>{{ row.item.bidding_date ? $moment(row.item.bidding_date).format('HH:mm') : '' }}</span>
        </div>
      </template>
      <template v-slot:cell(lf_dosage_klp)="row">
        <div class="d-flex">
          {{ row.item.klp ? `${row.item.klp.form}, ${row.item.klp.dosage.grls_value}` : 'не сопоставлено' }}
        </div>
      </template>
      <template v-slot:cell(sellers_count)="row">
        <div class="d-flex align-items-center">
          {{ row.item.purchase_custom ? row.item.purchase_custom.delivery_price.sellers.length : '' }}
        </div>
      </template>
      <template v-slot:cell(delivery_count)="row">
        <div class="d-flex align-items-center">
          {{
            row.item.purchase_custom.delivery_count.manual
              ? row.item.purchase_custom.delivery_count.manual
              : row.item.purchase_custom.delivery_count.auto
          }}
        </div>
      </template>
      <template v-slot:cell(mnn_norm_name_field)="row">
        <div class="d-flex align-items-center">
          {{ row.item.klp ? row.item.klp.mnn : 'не сопоставлено' }}
        </div>
      </template>
      <template v-slot:cell(price_delivery_docs)="row">
        <div class="d-flex align-items-center">
          {{
            row.item.purchase_custom.delivery_price.price_all_manual
              ? row.item.purchase_custom.delivery_price.price_all_manual
              : row.item.purchase_custom.delivery_price.price_all
          }}
        </div>
      </template>
      <template v-slot:cell(delivery_price)="row">
        <div class="d-flex align-items-center">
          {{
            row.item.purchase_custom.delivery_count
              ? row.item.purchase_custom.delivery_count.manual
                ? row.item.purchase_custom.delivery_count.manual * 1000
                : row.item.purchase_custom.delivery_count.auto
                ? row.item.purchase_custom.delivery_count.auto * 1000
                : ''
              : ''
          }}
        </div>
      </template>
      <template v-slot:cell(porog_price)="row">
        <div class="d-flex align-items-center text-truncate">
          {{ $formatMoney(row.item.porog_price) }}
        </div>
      </template>
      <template v-slot:cell(max_price)="row">
        <div class="d-flex align-items-center text-truncate">
          {{ $formatMoney(row.item.max_price) }}
        </div>
      </template>
      <template v-slot:cell(profitability)="row">
        <div class="d-flex align-items-center text-truncate">
          {{ $formatMoney(row.item.profitability) }}
        </div>
      </template>
      <template v-slot:cell(price_require_znvlp)="row">
        <div class="d-flex align-items-center text-truncate">
          {{ $formatMoney(row.item.price_require_znvlp) }}
        </div>
      </template>
      <template v-slot:cell(price_require)="row">
        <div class="d-flex align-items-center text-truncate">
          {{ $formatMoney(row.item.price_require) }}
        </div>
      </template>
      <template v-slot:cell(type)="row">
        <div class="d-flex align-items-center">
          <span
            >{{
              `${
                purchaseCurrentType(row.item.fcs_type) && purchaseCurrentType(row.item.fcs_type).title
                  ? purchaseCurrentType(row.item.fcs_type).title
                  : 'Остальные закупки'
              }`
            }}
          </span>
        </div>
      </template>
      <template v-slot:cell(purchase_object_info)="row">
        <div class="d-flex align-items-center">
          <div v-if="showMassiveArchived" class="mr-1">
            <b-icon-check-square
              v-if="row.item.archive_flag"
              class="m-0 pointer"
              variant="info"
              style="font-size: 19px"
              @click="unsetArchivedPurchase(row.item)"
            />
            <b-icon-square v-else class="m-0 pointer" style="font-size: 19px" @click="setArchivedPurchase(row.item)" />
          </div>
          <div>
            <span class="m-0">{{ row.item.purchase_object_info }}</span>
          </div>
        </div>
      </template>
      <template v-slot:cell(status)="row">
        <div class="d-flex align-items-center">
          <b-dd
            id="dropdown-purchase_status"
            :lazy="true"
            toggle-class="d-flex p-0 text-center mb-0 mr-1 custom_button"
            variant="link"
            boundary="viewport"
            no-caret
          >
            <template v-slot:button-content>
              <span
                :class="currentPurchase.bot_status_slug === purchaseStatusFilter.status ? 'bot_purchase' : ''"
                style="font-size: 11px"
                >{{ row.item.status && row.item.status.name ? row.item.status.name : '' }}</span
              >
            </template>
            <template v-for="(filter, key) in statuses">
              <b-dd-item-btn
                :key="key"
                :active="filter.status === row.item.status.slug"
                button-class="d-flex flex-row custom_dropdown_item"
                @click="updatePurchaseStatus(row.item, filter)"
              >
                <div class="flex-fill text-left mr-2">
                  {{ filter && filter.title ? filter.title : 'Не выбрана' }}
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
          <span v-if="row.item.status.name === 'Проверка архива'">
            <b-icon-archive class="m-0" variant="danger"></b-icon-archive>
          </span>
        </div>
      </template>
    </b-table>
    <b-modal ref="purchase-modal-archive-close" title="Архивирование закупки" @ok="closeArchivePurchaseModal">
      <p class="my-4">
        Переместить в папку
        {{ accessRight.role === 'purchasing_operators' ? 'Не участвуем' : 'Проверка архива' }}?
      </p>
    </b-modal>
    <b-modal ref="purchase-object-removing" title="Удаление объекта закупки" @ok="removePurchaseObjectModal">
      <p class="my-4">Удалить объект закупки? Действие необратимо.</p>
    </b-modal>
    <b-modal ref="purchase-add-object-warning" title="Добавление объекта прайса" @ok="openSearchModal">
      <p class="my-4">Перед добавлением объекта прайса необходимо сохранить закупку. Продолжить без сохранения?</p>
    </b-modal>
  </div>
</template>

<script>
import NumberMedicines from '../NumberMedicines'
import ExpandRu from '../ExpandRu'
import PurchaseEqReplacement from './PurchaseEqReplacement'
import PurchasePhrases from './PurchasePhrases'
import PurchaseBestPrices from './PurchaseBestPrices'
import PurchaseObjectControl from './PurchaseObjectControl'
export default {
  name: 'PurchaseTable',
  components: {
    PurchaseObjectControl,
    PurchaseBestPrices,
    ExpandRu,
    NumberMedicines,
    PurchasePhrases,
    PurchaseEqReplacement,
  },
  props: {
    source: {
      type: String,
      default: null,
    },
    priceObjects: {
      type: Array,
      default: null,
    },
    priceObjectsExpansion: {
      type: Array,
      default: null,
    },
    parentIndex: {
      type: Number,
      default: null,
    },
    priceHeadRow: {
      type: Boolean,
      default: false,
    },
    mainId: {
      type: Number,
      default: null,
    },
    autoSelection: {
      type: Boolean,
      default: false,
    },
    reception: {
      type: String,
      default: 'basic',
    },
  },
  data() {
    return {
      sortBy: null,
      sortDesc: false,
      nameTech: '',
      addingPurchaseObject: {},
      removingPurchaseObject: {},
      currentRow: { uuid: null },
      archivingPurchase: {},
      fields: {
        purchase_manage: [
          {
            key: 'positions',
            label: 'Поз',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'start_date',
            label: 'Дата начала подачи',
            class: 'align-middle pl-1 pr-2',
            sortable: true,
          },
          {
            key: 'updated_at',
            label: 'Дата обработки',
            class: 'align-middle pl-1 pr-2',
            sortable: true,
          },
          {
            key: 'end_date',
            label: 'Окончание подачи заявки',
            class: 'align-middle pl-1 pr-2',
            sortable: true,
          },
          {
            key: 'bidding_date',
            label: 'Дата провед. торгов',
            class: 'align-middle pl-1 pr-2',
            sortable: true,
          },
          {
            key: 'type',
            label: 'Тип',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'status',
            label: 'Статус',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'purchase_number',
            label: '№ извещения',
            class: 'align-middle pl-1 pr-4',
          },
          {
            key: 'purchase_object_info',
            label: 'Наименование закупки',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'delivery_count',
            label: 'Кол-во пост-к',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'sellers_count',
            label: 'Кол-во пост-в',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'user',
            label: 'Отв. сотрудник',
            class: 'align-middle pl-1 pr-2',
          },

          {
            key: 'etp_code',
            label: 'Торговая площадка',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'application_guarantee_amount',
            label: 'Обесп. заявки',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'purchase_custom.comment',
            label: 'Комментарий',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'price_require_znvlp',
            label: 'Рент. МЦК',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'max_price',
            label: 'Нач. МЦК',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'price_require',
            label: 'Закуп. цена',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'price_delivery_docs',
            label: 'Трасп. расх.',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'delivery_price',
            label: 'Дост. док-в',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'porog_price',
            label: 'Порог. цена',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'profitability',
            label: '% RoS',
            class: 'align-middle pl-1 pr-2',
            sortable: true,
          },
          {
            key: 'is_preferences',
            label: 'Преф.',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'is_profitability',
            label: 'RoS',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'sp_flag',
            label: 'СП',
            class: 'align-middle pl-1 pr-2',
          },
          {
            key: 'archive',
            label: '',
            class: 'align-middle pl-1 pr-2',
          },
        ],
        purchase_main: [
          {
            key: 'purchase_object_main_npp',
            label: '№ п/п',
            class: 'w-1 p-0 pl-2 align-middle custom_table_background',
          },
          {
            key: 'purchase_object_main',
            label: 'Объект закупки',
            class: 'w-15 p-0 custom_table_background',
          },
          {
            key: 'purchase_price_objects_main',
            label: 'Объекты прайса',
            class: 'w-84 p-0 bg-green-100',
          },
          {
            key: 'remove',
            label: '',
            class: 'd-flex p-0 pl-1 pb-1 justify-content-between custom_table_background',
          },
        ],
        purchase_modal: [
          // {
          //   key: 'npp',
          //   label: '№',
          //   class: 'align-middle',
          // },
          {
            key: 'mnn',
            label: 'МНН',
            class: 'align-middle p-0 pl-1',
          },
          {
            key: 'form_name',
            label: 'Лек. форма',
            class: 'align-middle p-0 pl-1',
          },
          {
            key: 'dosage_grls_value',
            label: 'Дозировка',
            class: 'align-middle p-0 pl-1',
          },
          {
            key: 'drug_quantity',
            label: 'Кол-во',
            class: 'align-middle p-0 pl-1',
          },
          {
            key: 'okei_code',
            label: 'Ед. изм',
            class: 'align-middle p-0 pl-1',
          },
          // {
          //   key: 'price_per_unit',
          //   label: 'Цена за ед.',
          //   class: 'align-middle',
          // },
          {
            key: 'position_price',
            label: 'НМЦ объекта',
            class: 'align-middle p-0 pl-1',
          },
          {
            key: 'remove',
            label: '',
            class: 'd-flex p-0 pl-1 justify-content-between',
          },
          // {
          //   key: 'is_znvlp',
          //   label: 'ЖНВЛП',
          //   class: 'align-middle',
          // },
        ],
        purchase_modal_price: [
          {
            key: 'price_control',
            label: '',
            class: 'align-middle w-2',
          },
          {
            key: 'klp.mnn_norm_name',
            label: '',
            class: 'align-middle w-10',
          },
          {
            key: 'klp.lf_norm_name',
            label: 'Лек. форма',
            class: 'align-middle w-15',
          },
          {
            key: 'klp.trade_name',
            label: 'Торг. наим.',
            class: 'align-middle w-8',
          },
          {
            key: 'drug_quantity_require',
            label: 'Требуется',
            class: 'align-middle w-5',
          },
          {
            key: 'price.qnt',
            label: 'Остаток',
            class: 'align-middle w-3',
          },
          {
            key: 'price.seller',
            label: 'Поставщик',
            class: 'align-middle w-5',
          },
          {
            key: 'klp.manufacturer_name',
            label: 'Страна / Производитель',
            class: 'align-middle w-7',
          },
          // {
          //   key: 'klp.manufacturer_country_name',
          //   label: 'Страна происх.',
          //   class: 'align-middle w-5',
          // },
          {
            key: 'price.gdate',
            label: 'Срок годности',
            class: 'align-middle w-4',
          },
          {
            key: 'price_price',
            label: 'Закуп. цена',
            class: 'align-middle w-3',
          },
          {
            key: 'price_require_current',
            label: 'Стоимость',
            class: 'align-middle w-4',
          },
          {
            key: 'price_price_znvlp',
            label: 'Цена произв.',
            class: 'align-middle w-3',
          },
          {
            key: 'price.price_require_gnvlp',
            label: 'Наша ц. контр.',
            class: 'align-middle w-4',
          },
          {
            key: 'count_box',
            label: 'Кол-во коробок',
            class: 'align-middle w-2',
          },
          {
            key: 'comment',
            label: 'Комментарий',
            class: 'align-middle w-10',
          },
          {
            key: 'comments',
            label: 'Комментарии',
            class: 'align-middle w-10',
          },
          {
            key: 'is_narcotic',
            label: 'Сильнодействующий препарат / Наркотик',
            class: 'align-middle w-2',
          },
          {
            key: 'price.gnvls',
            label: 'ЖНВЛП',
            class: 'align-middle w-2',
          },
          {
            key: 'temperature_mode',
            label: 'Терморежим',
            class: 'align-middle w-4',
          },
          {
            key: 'klp.num_reg',
            label: '№ РУ',
            class: 'align-middle w-1',
          },
          {
            key: 'remove',
            label: '',
            class: 'align-middle field_width_30',
          },
        ],
        purchase_modal_price_expansion: [
          {
            key: 'mnn_norm_name_field',
            label: 'МНН по ЕСКЛП',
            class: 'align-middle',
          },
          {
            key: 'lf_dosage_klp',
            label: 'Лек. форма и дозировка по ЕСКЛП',
            class: 'align-middle',
          },
          {
            key: 'price_require_gnvlp_surcharge',
            label: 'Цена произв. надб.',
            class: 'align-middle w-20',
          },
          {
            key: 'klp.pre_packing',
            label: 'Трансп. уп.',
            class: 'align-middle',
          },
          {
            key: 'price.price',
            label: 'Ориг прайс закуп. цена',
            class: 'align-middle',
          },
          {
            key: 'offer_price',
            label: 'Цена предл-я за ед.',
            class: 'align-middle',
          },
          {
            key: 'offer_position',
            label: 'Цена предл-я за поз.',
            class: 'align-middle',
          },
          {
            key: 'weight_box',
            label: 'Вес всех коробок',
            class: 'align-middle',
          },
          {
            key: 'dimension',
            label: 'Габариты',
            class: 'align-middle',
          },
          {
            key: 'klp.expiration_date',
            label: 'Срок годн. полн.',
            class: 'align-middle',
          },
        ],
        purchase_modal_price_fields: [
          {
            key: 'price_control',
            label: '',
            class: 'align-middle w-2 custom_second_head',
          },
          {
            key: 'klp.mnn_norm_name',
            label: '',
            class: 'align-middle w-10 custom_second_head',
          },
          {
            key: 'klp.lf_norm_name',
            label: 'Лек. форма',
            class: 'align-middle w-12 custom_second_head',
          },
          {
            key: 'klp.trade_name',
            label: 'Торг. наим.',
            class: 'align-middle w-8 custom_second_head',
          },
          {
            key: 'drug_quantity_require',
            label: 'Требуется',
            class: 'align-middle custom_second_head w-4',
          },
          {
            key: 'price.qnt',
            label: 'Остаток',
            class: 'align-middle custom_second_head w-3',
          },
          {
            key: 'price.seller',
            label: 'Поставщик',
            class: 'align-middle custom_second_head w-5',
          },
          {
            key: 'klp.manufacturer_name',
            label: 'Производитель',
            class: 'align-middle custom_second_head w-7',
          },
          {
            key: 'klp.manufacturer_country_name',
            label: 'Страна происх.',
            class: 'align-middle custom_second_head w-5',
          },
          {
            key: 'price.gdate',
            label: 'Срок годности',
            class: 'align-middle w-3 custom_second_head',
          },
          {
            key: 'price_price',
            label: 'Закуп. цена',
            class: 'align-middle custom_second_head w-3',
          },
          {
            key: 'price_require_current',
            label: 'Стоимость',
            class: 'align-middle custom_second_head w-4',
          },
          {
            key: 'price_price_znvlp',
            label: 'Цена произв.',
            class: 'align-middle custom_second_head w-3',
          },
          // {
          //   key: 'price_require_gnvlp_surcharge',
          //   label: 'Цена произв. надб.',
          //   class: 'align-middle custom_second_head w-4',
          // },
          {
            key: 'price.price_require_gnvlp',
            label: 'Наша ц. контр.',
            class: 'align-middle custom_second_head w-4',
          },
          // {
          //   key: 'klp.pre_packing',
          //   label: 'Трансп. уп.',
          //   class: 'align-middle w-2 custom_second_head',
          // },
          {
            key: 'count_box',
            label: 'Кол-во коробок',
            class: 'align-middle custom_second_head w-2',
          },
          // {
          //   key: 'weight_box',
          //   label: 'Вес всех коробок',
          //   class: 'align-middle custom_second_head w-2',
          // },
          // {
          //   key: 'dimension',
          //   label: 'Габариты',
          //   class: 'align-middle custom_second_head w-4',
          // },
          // {
          //   key: 'klp.expiration_date',
          //   label: 'Срок годн. полн.',
          //   class: 'align-middle w-1 custom_second_head',
          // },
          {
            key: 'comment',
            label: 'Комментарий',
            class: 'align-middle custom_second_head w-10',
          },
          {
            key: 'is_narcotic',
            label: 'Сильнодействующий препарат / Наркотик',
            class: 'align-middle custom_second_head w-2',
          },
          {
            key: 'price.gnvls',
            label: 'ЖНВЛП',
            class: 'align-middle custom_second_head w-2',
          },
          {
            key: 'temperature_mode',
            label: 'Терморежим',
            class: 'align-middle custom_second_head w-3',
          },
          {
            key: 'klp.num_reg',
            label: '№ РУ',
            class: 'align-middle custom_second_head w-1',
          },
          {
            key: 'remove',
            label: '',
            class: 'custom_second_head field_width_30',
          },
        ],
        purchase_modal_info: [
          {
            key: 'positions',
            label: 'Позиций',
            class: 'align-middle',
          },
        ],
        purchase_modal_search: [
          {
            key: 'npp',
            label: '№',
            class: 'align-middle',
          },
          {
            key: 'mnn',
            label: 'МНН',
            class: 'align-middle',
          },
          {
            key: 'form_name',
            label: 'Лек. форма',
            class: 'align-middle',
          },
          {
            key: 'dosage_grls_value',
            label: 'Дозировка',
            class: 'align-middle',
          },
          {
            key: 'drug_quantity',
            label: 'Кол-во',
            class: 'align-middle',
          },
          {
            key: 'okei_code',
            label: 'Ед. изм',
            class: 'align-middle',
          },
          {
            key: 'price_per_unit',
            label: 'Цена за ед.',
            class: 'align-middle',
          },
          {
            key: 'position_price',
            label: 'НМЦ объекта',
            class: 'align-middle',
          },
          {
            key: 'is_znvlp',
            label: 'ЖНВЛП',
            class: 'align-middle',
          },
          {
            key: 'remove',
            label: '',
            class: 'd-flex justify-content-end',
          },
        ],
      },
    }
  },
  computed: {
    showMassiveArchived() {
      return this.accessRight.role === 'general_operators' || this.accessRight.role === 'administrators'
    },
    archivedPurchase() {
      return this.$store.getters['purchase/getArchivePurchaseArray']
    },
    statuses() {
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
        return purchaseStatus
      } else return this.$store.getters['purchase/getFilters'].purchase_status
    },
    purchaseStatusFilter() {
      return this.$store.getters['purchaseObject/getPurchaseStatus']
    },
    purchaseObjectErrorMessage() {
      return this.$store.getters['purchaseObject/getErrorMessage']
    },
    purchaseFilterStatus() {
      return this.$store.getters['purchase/getPurchaseFilter'].status
    },
    headClass() {
      let headClass = ''
      switch (this.source) {
        case 'purchase_manage':
          headClass = 'purchase_manage_head'
          break
        case 'purchase_main':
          headClass = 'purchase_main_head'
          break
        case 'purchase_modal':
          headClass = 'purchase_modal_head'
          break
        case 'purchase_modal_price':
          headClass = 'purchase_modal_price_head'
          break
        case 'purchase_modal_search':
          headClass = 'purchase_modal_search_head'
          break
      }
      return headClass
    },
    currentFields() {
      if (this.source === 'purchase_manage' && !this.purchaseFilterStatus) {
        return this.fields[this.source]
      } else if (this.source === 'purchase_manage' && this.purchaseFilterStatus === 'new') {
        return this.fields[this.source].filter(function (field) {
          return !(field.key === 'updated_at' || field.key === 'bidding_date')
        })
      } else if (
        this.source === 'purchase_manage' &&
        (this.purchaseFilterStatus === 'processed' ||
          this.purchaseFilterStatus === 'check' ||
          this.purchaseFilterStatus === 'verified' ||
          this.purchaseFilterStatus === 'formalized' ||
          this.purchaseFilterStatus === 'ready' ||
          this.purchaseFilterStatus === 'archive')
      ) {
        return this.fields[this.source].filter(function (field) {
          return !(field.key === 'start_date' || field.key === 'bidding_date')
        })
      } else if (
        this.source === 'purchase_manage' &&
        (this.purchaseFilterStatus === 'sent' ||
          this.purchaseFilterStatus === 'rejected' ||
          this.purchaseFilterStatus === 'admitted' ||
          this.purchaseFilterStatus === 'sole' ||
          this.purchaseFilterStatus === 'won' ||
          this.purchaseFilterStatus === 'lost')
      ) {
        return this.fields[this.source].filter(function (field) {
          return !(field.key === 'start_date' || field.key === 'updated_at')
        })
      } else return this.fields[this.source]
    },
    tableVariant() {
      if (
        (this.source === 'purchase_modal_price' && this.priceObjects.length) ||
        this.source === 'purchase_modal_price_fields'
      )
        return 'table-color'
      else if (this.source === 'purchase_modal_price' && !this.priceObjects.length) return 'warning-100'
      else return ''
    },
    currentItems() {
      let items = []
      const mainId = this.mainId
      const priceObjects = this.priceObjects
      const priceObjectsExpansion = this.priceObjectsExpansion
      const result = JSON.parse(JSON.stringify(this.$store.getters['purchaseObject/getPurchaseObjectsPrice']))
      const array = []
      const resultFirst = result[0]
      const resultId = result[mainId]
      const autoSelection = this.autoSelection
      array.push(resultFirst, resultId)
      switch (this.source) {
        case 'purchase_manage':
          items = JSON.parse(JSON.stringify(this.$store.getters['purchase/getPurchase']))
          break
        case 'purchase_main':
          items = autoSelection
            ? JSON.parse(
                JSON.stringify(this.$store.getters['purchaseObject/getPurchaseAutoSelectionObjectPrices'])
              ).map(function (item, index) {
                if (index === 0) item.flag = 'first_row_custom'
                else item.flag = 'purchase_main_custom'
                return item
              })
            : JSON.parse(JSON.stringify(this.$store.getters['purchaseObject/getPurchaseObjectsPrice'])).map(function (
                item,
                index
              ) {
                if (index === 0) item.flag = 'first_row_custom'
                else item.flag = 'purchase_main_custom'
                return item
              })
          break
        case 'purchase_modal':
          items = array
          break
        case 'purchase_modal_price':
          items = priceObjects
          break
        case 'purchase_modal_price_expansion':
          items = priceObjectsExpansion
          break
        case 'purchase_modal_price_fields':
          items = []
          break
        case 'purchase_modal_search':
          items = JSON.parse(JSON.stringify(this.$store.getters['priceObject/getSelectedPurchaseObject']))
          break
      }
      return items
    },
    purchase() {
      return this.$store.state.purchase.purchase
    },
    tradingPlaces() {
      return this.$store.state.purchase.tradingPlaces
    },
    purchaseObjects() {
      return this.$store.getters['purchaseObject/getPurchaseObjects']
    },
    purchaseObjectsPrice() {
      return this.$store.getters['purchaseObject/getPurchaseObjectsPrice']
    },
    priceObjectStatus() {
      return this.$store.getters['priceObject/getPriceObjectStatus']
    },
    currentPurchase() {
      return this.$store.state.purchaseObject.currentPurchase
    },
    priceStatus() {
      return this.$store.state.price.status
    },
    activeShelfField() {
      return this.$store.getters['purchaseObject/getActiveShelfField']
    },
    currentLocality() {
      return this.$store.getters['purchaseObject/getCurrentLocality']
    },
    accessRight() {
      return this.$access(this.$store.getters['dictionaries/getAuthUser'])
    },
    expandedPriceFilter() {
      return this.$store.getters['price/getExpandedPriceFilter']
    },
    ruFile() {
      return this.$store.getters['purchaseObject/getRuRules'].select
    },
    purchaseObjectStatus() {
      return this.$store.getters['purchaseObject/getPurchaseObjectsStatus']
    },
  },
  watch: {
    purchaseObjectErrorMessage(newValue) {
      if (this.source === 'purchase_manage') this.addSuccessNotification('Ошибка', newValue, 'danger')
    },
    purchaseFilterStatus(newValue) {
      if (
        newValue === 'new' ||
        newValue === 'processed' ||
        newValue === 'check' ||
        newValue === 'verified' ||
        newValue === 'formalized' ||
        newValue === 'ready' ||
        newValue === 'archive'
      ) {
        this.$store.commit('purchase/UPDATE_SORTING', { order_by: 'end_date', asc_desc: 'asc' })
      } else if (
        newValue === 'sent' ||
        newValue === 'rejected' ||
        newValue === 'admitted' ||
        newValue === 'sole' ||
        newValue === 'won' ||
        newValue === 'lost'
      ) {
        this.$store.commit('purchase/UPDATE_SORTING', { order_by: 'bidding_date', asc_desc: 'asc' })
      }
    },
    sortDesc(newValue) {
      this.$store.commit('purchase/UPDATE_SORTING', { order_by: this.sortBy, asc_desc: newValue ? 'asc' : 'desc' })
    },
    sortBy(newValue) {
      this.$store.commit('purchase/UPDATE_SORTING', { order_by: newValue, asc_desc: this.sortDesc ? 'asc' : 'desc' })
    },
    purchaseObjects() {
      if (this.source === 'purchase_manage' && this.currentRow.uuid)
        this.$store.dispatch('priceObject/fetchPriceObjects', this.currentRow.uuid)
    },
    // priceStatus(newValue) {
    //   if (newValue === 'matching-success') {
    //     this.addSuccessNotification('Сопоставление', 'Позиции успешно сопоставлены', 'success')
    //   }
    // },
    priceObjectStatus(newValue) {
      if (newValue === 'replaced_price-is-added') {
        if (this.currentPurchase.uuid) this.$store.dispatch('priceObject/fetchPriceObjects', this.currentPurchase.uuid)
      }
      if (newValue === 'price_objects-is-removed') {
        if (this.currentPurchase.uuid) this.$store.dispatch('priceObject/fetchPriceObjects', this.currentPurchase.uuid)
      }
    },
    ruFile(newValue) {
      this.$store.commit('price/UPDATE_HAS_RU_FILE_FIELD', newValue)
    },
  },
  methods: {
    numberWorkingDays(receivedDate, days, endDate) {
      let date = receivedDate
      while (days > 0) {
        date = date.add(1, 'days')
        if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
          days -= 1
        }
      }
      return new Date(date) >= new Date(endDate)
    },
    numberWorkingDaysVerified(endDate) {
      const date = this.$moment().add(2, 'days')
      return new Date(endDate) >= new Date(date)
    },
    opendExpandRu(priceObject) {
      if (this.source === 'purchase_modal_price') this.$store.commit('price/SET_KLP_ITEM', priceObject)
    },
    currentTradingPlace(tradingPlaceCode) {
      const result = this.tradingPlaces.find((tradingPlace) => tradingPlace.etp_code === tradingPlaceCode) || {}
      return result.name ? result.name : 'Нет информации'
    },
    doubleClick(row) {
      this.currentRow = row
      switch (this.source) {
        case 'purchase_manage':
          this.$store.dispatch('purchaseObject/fetchPurchaseInfo', row.uuid)
          this.$store.dispatch('purchaseObject/fetchPurchaseObjects', row.uuid)
          this.$bvModal.show('purchaseModal')
          // Promise.all([purchase, purchaseObjects, PriceObjects]).then(() => {
          //   this.$bvModal.show('purchaseModal')
          // }, () => {
          //   this.addSuccessNotification('Ошибка', 'Ошибка загрузки данных', 'danger')
          // })
          break
        case 'purchase_modal_price':
          this.$store.commit(
            'priceObject/SAVE_SELECTED_PURCHASE_OBJECT',
            this.purchaseObjectsPrice.filter(function (purchaseObject) {
              return purchaseObject.id === row.purchase_object_id
            })[0]
          )
          this.$store.commit('priceObject/SAVE_SELECTED_PRICE_OBJECT', row)
          if (row.klp && row.klp.uuid) this.$store.dispatch('price/fetchCurrentKlp', row.klp.uuid)
          this.$store.commit('priceObject/UPDATE_MATCHING_MODAL_SOURCE', 'purchase_modal')
          this.$store.dispatch('price/getMatchedPrices', row.price.id)
          this.$bvModal.show('esklpPriceMatchingModal')
          break
      }
    },
    openPurchaseSearchModal(purchaseObject) {
      if (this.currentLocality.id) this.$store.dispatch('dictionaries/fetchRegionalSellers', this.currentLocality.id)
      // this.$refs['purchase-add-object-warning'].show()
      const purchaseObjectCopy = JSON.parse(JSON.stringify(purchaseObject))
      purchaseObjectCopy._showDetails = false
      this.$store.commit('priceObject/SAVE_SELECTED_PURCHASE_OBJECT', purchaseObjectCopy)
      this.updatePurchase()
      this.$store.commit('price/UPDATE_PRICE_FILTER', {
        field_name: 'seller_ids',
        new_value: this.$store.getters['dictionaries/getMainSellers'],
      })
      // this.$store.dispatch('price/fetchPrice')
      this.$bvModal.show('purchaseSearchModal')
    },
    openSearchModal() {
      const purchaseObjectCopy = JSON.parse(JSON.stringify(this.addingPurchaseObject))
      purchaseObjectCopy._showDetails = false
      this.$store.commit('priceObject/SAVE_SELECTED_PURCHASE_OBJECT', purchaseObjectCopy)
      this.$bvModal.show('purchaseSearchModal')
    },
    openPurchaseSearchModalHead(parentIndex) {
      this.$store.dispatch('purchaseObject/getCurrentPurchaseObject', parentIndex)
      this.$bvModal.show('purchaseSearchModal')
    },
    removePurchaseObject(row) {
      this.removingPurchaseObject = row.item
      this.$refs['purchase-object-removing'].show()
    },
    removePurchasePriceObject(row) {
      this.$store.dispatch('priceObject/removePriceObject', row.item.id)
    },
    removePurchaseObjectModal() {
      this.$store.dispatch('purchaseObject/removeCurrentPurchaseObject', this.removingPurchaseObject)
    },
    togglePriceObjectReplace(priceObject) {
      this.$store.dispatch('priceObject/editPriceObjectsReplace', {
        id: priceObject.id,
        is_replace: priceObject.is_replace,
      })
    },
    togglePriceObject(priceObject) {
      this.$store.dispatch('priceObject/editPriceObjects', { id: priceObject.id, is_current: priceObject.is_current })
      // this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
    },
    togglePriceObjectGnvls(priceObject) {
      this.$store.dispatch('priceObject/editPriceObjectsZnvlp', {
        id: priceObject.id,
        is_znvlp: priceObject.price.gnvls,
      })
    },
    addSuccessNotification(title, message, variant) {
      this.$bvToast.toast(message, {
        title,
        autoHideDelay: 5000,
        toaster: 'b-toaster-bottom-right',
        variant,
        appendToast: false,
      })
    },
    rowClass(item) {
      if (item.flag === 'purchase_main_custom') return 'purchase_main_custom'
      if (item.flag === 'hide-me') return 'hiding-row'
      if (item.flag === 'first_row_custom') return 'first_row_custom'
      if (item.flag === 'purchase_modal_price_expansion') return 'purchase_modal_price_expansion_row'
    },
    updatePurchasePriceObject(updatedPriceObject, field) {
      this.$store.commit('purchaseObject/UPDATE_PRICE_OBJECT', { updatedPriceObject, field })
      this.$store.commit('purchaseObject/SAVE_ACTIVE_ADDITIONAL_FIELDS')
      this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
    },
    updatePurchasePriceObjectField(updatedPriceObject, object) {
      this.$store.commit('purchaseObject/UPDATE_PRICE_OBJECT_QUERY_OBJECT', { updatedPriceObject, object })
      this.$store.commit('purchaseObject/SAVE_ACTIVE_ADDITIONAL_FIELDS')
      this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
    },
    purchaseCostSurcharge(price) {
      let surcharge = 1
      if (this.currentPurchase) {
        if (price <= 50) {
          surcharge = this.currentPurchase.surcharge.addition1 / 100 + 1.1
        } else if (price <= 500) {
          surcharge = this.currentPurchase.surcharge.addition2 / 100 + 1.1
        } else {
          surcharge = this.currentPurchase.surcharge.addition3 / 100 + 1.1
        }
        return price * surcharge
      } else return price
    },
    updatePurchase() {
      this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
    },
    purchaseCurrentType(fcsType) {
      return this.$store.getters['purchaseObject/getPurchaseType'](fcsType)
    },
    currentOkei(okeiCode) {
      return this.$store.getters['dictionaries/getCurrentOkei'](okeiCode)
    },
    thermoMode(min, max) {
      if (min === null && max === null) return 'secondary'
      else if (!min && min !== 0 && max >= 25) return 'success'
      else if ((min === 0 && max >= 25) || (min === 0 && !max)) return 'info'
      else if ((min === 0 && max < 25) || (min > 0 && !max) || (min > 0 && max) || (!min && max < 25)) return 'danger'
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
    getCurrentPriceObject(objects, parentId) {
      return objects.filter((priceObject) => priceObject.id === parentId)
    },
    getCurrentReplacement(item) {
      return this.$store.getters['replacements/getReplacements'].find(
        (replacement) => replacement.mnn.includes(item.mnn) && replacement.lf_name.includes(item.form_name)
      )
    },
    priceIndexChange(price1, price2) {
      const result = (price2 * 100) / price1 - 100
      if (result >= 3 && result < 5) return 'yellow'
      else if (result >= 5 && result < 7) return 'orange'
      else if (result >= 7) return 'red'
      else return 'green'
    },
    currentPhrase(phraseId) {
      return this.$store.getters['dictionaries/getCurrentPhrase'](phraseId)
    },
    toggleDetails(row) {
      this.$store.commit('purchaseObject/SHOW_ADDITIONAL_ROW', { price_object: row.item })
    },
    commentSideBarIsHidden() {
      this.$store.commit('purchaseObject/SAVE_ACTIVE_ADDITIONAL_FIELDS')
      this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
    },
    showArchiveModal(purchase) {
      if (this.accessRight.role === 'general_operators' || this.accessRight.role === 'administrators') {
        this.$store.commit('purchaseObject/SAVE_PURCHASE_CUSTOM_STATUS', 'check_archive')
        this.$store.dispatch('purchaseObject/updatePurchaseList', purchase.uuid)
      } else {
        this.$refs['purchase-modal-archive-close'].show()
        this.archivingPurchase = purchase
      }
    },
    closeArchivePurchaseModal() {
      if (this.accessRight.role === 'purchasing_operators') {
        this.$store.commit('purchaseObject/SAVE_PURCHASE_CUSTOM_STATUS', 'not_play')
      } else this.$store.commit('purchaseObject/SAVE_PURCHASE_CUSTOM_STATUS', 'check_archive')
      this.$store.dispatch('purchaseObject/updatePurchaseList', this.archivingPurchase.uuid)
    },
    shelfLifeRu(date) {
      if (!date) return false
      else if (new Date(date) < new Date()) return true
      else return false
    },
    quantityState(item, prices) {
      const currentQnt = item.drug_quantity_require
      const currentRequire = item.price.qnt
      const bestAnotherSeller =
        prices.filter((price) => price.id !== item.price.id).find((price) => price.qnt >= currentQnt) || false
      let sellersWithoutBestAnotherSeller = bestAnotherSeller
        ? prices.filter((price) => price.id !== bestAnotherSeller.id)
        : false
      sellersWithoutBestAnotherSeller =
        sellersWithoutBestAnotherSeller && sellersWithoutBestAnotherSeller.length
          ? sellersWithoutBestAnotherSeller.reduce(function (preVal, seller) {
              return preVal + seller.qnt
            }, 0)
          : 0
      const qnts = prices.filter((price) => price.id !== item.price.id).map((price) => price.qnt)
      if (currentQnt < currentRequire && qnts.some((qnt) => qnt >= currentQnt)) return 'first'
      else if (currentQnt > currentRequire && qnts.filter((qnt) => qnt >= currentQnt).length >= 2) return 'first'
      else if (
        currentQnt < currentRequire &&
        currentQnt <=
          qnts.reduce(function (preVal, qnt) {
            return preVal + qnt
          }, 0)
      )
        return 'second'
      else if (currentQnt > currentRequire && bestAnotherSeller && sellersWithoutBestAnotherSeller > currentQnt)
        return 'second'
      else if (
        currentQnt < currentRequire &&
        currentQnt >
          qnts.reduce(function (preVal, qnt) {
            return preVal + qnt
          }, 0)
      )
        return 'third'
      else if (currentQnt > currentRequire && bestAnotherSeller && sellersWithoutBestAnotherSeller < currentQnt)
        return 'third'
      else if (
        currentQnt > currentRequire &&
        currentQnt <
          qnts.reduce(function (preVal, qnt) {
            return preVal + qnt
          }, 0) +
            currentRequire
      )
        return 'forth'
      else return 'fifth'
    },
    openExpandedRu(priceObject) {
      this.$store.commit('price/SET_ADDON_KLP', priceObject)
    },
    getCurrentBestPrice(purchaseObject) {
      this.$store.dispatch('purchaseObject/updatePurchase', {
        uuid: this.currentPurchase.uuid,
        auto_price_individual: purchaseObject.id,
      })
    },
    updatePurchaseStatus(purchase, filter) {
      this.$store.commit('purchaseObject/SAVE_PURCHASE_CUSTOM_STATUS', filter.status)
      this.$store.dispatch('purchaseObject/updatePurchaseList', purchase.uuid)
    },
    togglePurchaseObjectZnvlp(purchaseObject, flag) {
      this.$store.dispatch('purchaseObject/updatePurchaseObjectZnvlp', {
        id: purchaseObject.id,
        is_znvlp: flag,
        purchase_uuid: purchaseObject.purchase_uuid,
      })
    },
    setArchivedPurchase(purchase) {
      this.$store.commit('purchase/SET_ARCHIVED_PURCHASES', purchase.uuid)
    },
    unsetArchivedPurchase(purchase) {
      this.$store.commit('purchase/UNSET_ARCHIVED_PURCHASES', purchase.uuid)
    },
    archivePurchases() {
      this.$store.dispatch('purchase/archivePurchaseArray')
    },
  },
}
</script>
