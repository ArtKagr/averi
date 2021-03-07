export const state = () => ({
  status: null,
  currentPurchase: { purchase_custom: {} },
  purchaseComments: [],
  currentPurchaseObject: {},
  purchaseObjects: [{}],
  purchaseObjectsPrice: [],
  blockHeight: 20,
  blockHeightSearchPurchase: 20,
  activeAdditionalFields: [],
  emptyPurchaseObject: {
    npp: null,
    mnn: null,
    form_name: null,
    dosage_grls_value: null,
    drug_quantity: null,
    okei_code: null,
    price_per_unit: null,
    price_objects: [],
    _showDetails: true,
    position_price: null,
    is_znvlp: null,
    remove: true,
  },
  fetchedPurchaseObject: {},
  locality: [],
  kladrFilter: {
    kladr_name: null,
    kladr_obl: null,
  },
  currentLocality: {},
  delivery: null,
  deliveryAuto: null,
  docsDelivery: 1000,
  preferences: false,
  endDate: null,
  biddingDate: null,
  purchaseStatus: { title: 'Все папки', status: null },
  numberOfDeliveries: 1,
  costOfOneDelivery: 1000,
  updeatedPurchase: {
    purchase_objects: [],
    custom: {},
  },
  ruRules: { text: null, select: null },
  st1Rules: { text: null, select: null },
  currentTradingPlace: { etp_code: 0, name: 'Не указана' },
  currentRegion: { region_name: 'Калининградская обл', surcharge_id: 792 },
  purchaseNumberManual: null,
  maxPrice: null,
  contractGuaranteeAmount: null,
  applicationGuaranteeAmount: null,
  porogPrice: null,
  currentFcsType: { title: 'Ручные закупки 44-ФЗ', fcs_type: 'fcsNone' },
  purchaseTypes: [
    { title: 'Аукционы 44-ФЗ', fcs_type: 'fcsNotificationEF' },
    { title: 'Котировка 44-ФЗ', fcs_type: 'epNotificationEZK' },
    { title: 'Запрос в эл. форме 44-ФЗ', fcs_type: 'epNotificationEZP' },
    { title: 'Ручные закупки 44-ФЗ', fcs_type: 'fcsNone' },
    { title: 'Остальные закупки 44-ФЗ', fcs_type: 'fcsOther' },
    // { title: 'Закупки 223-ФЗ', fcs_type: 'ea223' },
    { title: 'Закрытые аукционы 44-ФЗ (A)', fcs_type: 'fcsNotificationZakA' },
    { title: 'Закрытые аукционы 44-ФЗ (Р)', fcs_type: 'fcsNotification111' },
    { title: 'Прочие 223-ФЗ', fcs_type: 'purchaseNotice' },
    { title: 'Запрос предложений 223-ФЗ', fcs_type: 'purchaseNoticeZPESMBO' },
    { title: 'Запрос котировок 223-ФЗ', fcs_type: 'purchaseNoticeZKESMBO' },
    { title: 'Конкурс 223-ФЗ', fcs_type: 'purchaseNoticeKESMBO' },
    { title: 'Аукцион 223-ФЗ', fcs_type: 'purchaseNoticeAESMBO' },
  ],
  purchaseStatusDictionary: [
    { title: 'Все папки', status: null },

    { title: 'Новые', status: 'new' },

    { title: 'Обработаны', status: 'processed' },
    { title: 'В проверку', status: 'check' },
    { title: 'Проверены', status: 'verified' },
    { title: 'Оформлены', status: 'formalized' },
    { title: 'Готовы к подаче', status: 'ready' },

    { title: 'Поданы', status: 'sent' },
    { title: 'Отклонены', status: 'rejected' },
    { title: 'Допущены', status: 'admitted' },

    { title: 'Единственный', status: 'sole' },
    { title: 'Выиграны', status: 'won' },
    { title: 'Проиграны', status: 'lost' },

    { title: 'Архив', status: 'archive' },
  ],
  activeShelfField: null,
  inputShelfGroups: {
    date: null,
    interval: [{ min: null, max: null, required: null }],
    months: null,
  },
  purchaseUserId: null,
  purchase_custom: {
    status_slug: null,
  },
  multiplyDelivery: false,
  deliveryObjects: [],
  kladrIds: [],
  kladrIdsSellers: [],
  kladrObjectsSellers: [],
  errorMessage: null,
  currentPurchaseProfitability: false,
  netProfitException: false,
  imgUrl: null,
  seller_counter: 3,
  autoSelectionObjectPrices: [],
})

export const getters = {
  getAutoSelectionModalStatus: (state) => state.autoSelectionModalStatus,
  getAutoSelectionObjectPrices: (state) => state.autoSelectionObjectPrices,
  getFullnessPurchaseInfo: (state) =>
    state.purchaseObjectsPrice
      .filter((purchaseObject) => purchaseObject.purchase_uuid)
      .every((purchaseObject) =>
        purchaseObject.price_objects.every((priceObject) => priceObject.drug_quantity_require && priceObject.is_current)
      ),
  getPurchaseAutoSelectionObjectPrices(state, getters) {
    return JSON.parse(JSON.stringify(state.purchaseObjectsPrice)).map(function (purchaseObject) {
      console.warn('state.purchaseObjectsPrice', state.purchaseObjectsPrice)
      if (getters.getAutoSelectionObjectPrices && getters.getAutoSelectionObjectPrices.length) {
        JSON.parse(JSON.stringify(getters.getAutoSelectionObjectPrices)).map(function (priceObject) {
          if (Object.keys(priceObject).length === 1) purchaseObject.price_objects = []
          if (
            purchaseObject.id &&
            purchaseObject.id === priceObject.purchase_object_id &&
            Object.keys(priceObject).length > 1
          ) {
            const result = []
            result.push(priceObject)
            purchaseObject.price_objects = result
          }
          return priceObject
        })
      }
      return purchaseObject
    })
  },
  getAutoSelectionInfo(state) {
    return JSON.parse(JSON.stringify(state.purchaseObjectsPrice))
      .filter((purchaseObject) => purchaseObject.purchase_uuid)
      .map(function (purchaseObject) {
        const priceObjects = purchaseObject.price_objects.map(function (priceObject) {
          return priceObject.klp && priceObject.klp.prices ? priceObject.klp.prices : []
        })
        const qntRequire = purchaseObject.price_objects.map(function (priceObject) {
          return priceObject.drug_quantity_require
        })
        delete purchaseObject.price_objects
        return {
          purchase_object: purchaseObject,
          qnt_require: qntRequire.reduce(function (qnt, preVal) {
            return preVal + qnt
          }, 0),
          purchase_prices: priceObjects[0] || [],
        }
      })
  },
  getAvailableMainSellers(state, getters, rootState, rootGetters) {
    const mainSellers = rootGetters['dictionaries/getSellers'].filter((seller) => seller.is_main)
    const autoSelectionInfo = JSON.parse(JSON.stringify(getters.getAutoSelectionInfo))
    const allPrices = autoSelectionInfo
      .map(function (purchaseObject) {
        return purchaseObject.purchase_prices
      })
      .reduce(function (prices, preVal) {
        return preVal.concat(prices)
      }, [])
    return mainSellers.filter(function (mainSeller) {
      return allPrices.some((price) => price.seller_id === mainSeller.id)
    })
  },
  getAutoSelectionSets(state, getters) {
    return JSON.parse(JSON.stringify(getters.getAutoSelectionInfo)).map(function (purchaseObject) {
      const mainSellers = getters.getAvailableMainSellers.map((seller) => seller.id)
      return purchaseObject.purchase_prices.filter(function (price) {
        return mainSellers.includes(price.seller_id) && price.qnt >= purchaseObject.qnt_require
      })
    })
  },
  getOneSellerSets(state, getters) {
    const mainSellers = getters.getAvailableMainSellers.map((seller) => seller.id)
    let output = []
    for (let i = 0; i < mainSellers.length; i++) {
      output.push([mainSellers[i]])
    }
    output = output.map(function (sellersArray) {
      return sellersArray.sort(function (a, b) {
        return a - b
      })
    })
    // output = output
    //   .reduce(function (preVal, sellersArray) {
    //     if (!preVal.includes(JSON.stringify(sellersArray))) preVal.push(JSON.stringify(sellersArray))
    //     return preVal
    //   }, [])
    //   .map((sellersArray) => JSON.parse(sellersArray))
    //   .filter(function (sellersArray) {
    //     return getters.getAutoSelectionSets.every(function (prices) {
    //       return prices.some(function (price) {
    //         return sellersArray.includes(price.seller_id)
    //       })
    //     })
    //   })
    return output
  },
  getTwoSellerSets(state, getters) {
    const mainSellers = getters.getAvailableMainSellers.map((seller) => seller.id)
    let output = []
    for (let i = 0; i < mainSellers.length; i++) {
      for (let j = 0; j < mainSellers.filter((seller, index) => index !== 0).length; j++) {
        if (i !== j) output.push([mainSellers[i], mainSellers[j]])
        // for(let k = 0; k < mainSellers.filter((seller, index) => index !== 0 || index !== 1).length; k++) {
        //   if(i !== j && i !== k && j !== k) output.push([mainSellers[i], mainSellers[j], mainSellers[k]])
        // }
      }
    }
    output = output.map(function (sellersArray) {
      return sellersArray.sort(function (a, b) {
        return a - b
      })
    })
    output = output
      .reduce(function (preVal, sellersArray) {
        if (!preVal.includes(JSON.stringify(sellersArray))) preVal.push(JSON.stringify(sellersArray))
        return preVal
      }, [])
      .map((sellersArray) => JSON.parse(sellersArray))
      .filter(function (sellersArray) {
        return getters.getAutoSelectionSets.every(function (prices) {
          return prices.some(function (price) {
            return sellersArray.includes(price.seller_id)
          })
        })
      })
    return output
  },
  getThreeSellerSets(state, getters) {
    const mainSellers = getters.getAvailableMainSellers.map((seller) => seller.id)
    let output = []
    for (let i = 0; i < mainSellers.length; i++) {
      for (let j = 0; j < mainSellers.filter((seller, index) => index !== 0).length; j++) {
        for (let k = 0; k < mainSellers.filter((seller, index) => index !== 0 || index !== 1).length; k++) {
          if (i !== j && i !== k && j !== k) output.push([mainSellers[i], mainSellers[j], mainSellers[k]])
        }
      }
    }
    output = output.map(function (sellersArray) {
      return sellersArray.sort(function (a, b) {
        return a - b
      })
    })
    output = output
      .reduce(function (preVal, sellersArray) {
        if (!preVal.includes(JSON.stringify(sellersArray))) preVal.push(JSON.stringify(sellersArray))
        return preVal
      }, [])
      .map((sellersArray) => JSON.parse(sellersArray))
      .filter(function (sellersArray) {
        return getters.getAutoSelectionSets.every(function (prices) {
          return prices.some(function (price) {
            return sellersArray.includes(price.seller_id)
          })
        })
      })
    return output
  },
  getFourSellerSets(state, getters) {
    const mainSellers = getters.getAvailableMainSellers.map((seller) => seller.id)
    let output = []
    for (let i = 0; i < mainSellers.length; i++) {
      for (let j = 0; j < mainSellers.filter((seller, index) => index !== 0).length; j++) {
        for (let k = 0; k < mainSellers.filter((seller, index) => index !== 0 || index !== 1).length; k++) {
          for (
            let z = 0;
            z < mainSellers.filter((seller, index) => index !== 0 || index !== 1 || index !== 2).length;
            z++
          ) {
            if (i !== j && i !== k && i !== z && j !== k && j !== z)
              output.push([mainSellers[i], mainSellers[j], mainSellers[k], mainSellers[z]])
          }
        }
      }
    }
    output = output.map(function (sellersArray) {
      return sellersArray.sort(function (a, b) {
        return a - b
      })
    })
    output = output
      .reduce(function (preVal, sellersArray) {
        if (!preVal.includes(JSON.stringify(sellersArray))) preVal.push(JSON.stringify(sellersArray))
        return preVal
      }, [])
      .map((sellersArray) => JSON.parse(sellersArray))
      .filter(function (sellersArray) {
        return getters.getAutoSelectionSets.every(function (prices) {
          return prices.some(function (price) {
            return sellersArray.includes(price.seller_id)
          })
        })
      })
    return output
  },
  getFiveSellerSets(state, getters) {
    const mainSellers = getters.getAvailableMainSellers.map((seller) => seller.id)
    let output = []
    for (let i = 0; i < mainSellers.length; i++) {
      for (let j = 0; j < mainSellers.filter((seller, index) => index !== 0).length; j++) {
        for (let k = 0; k < mainSellers.filter((seller, index) => index !== 0 || index !== 1).length; k++) {
          for (
            let z = 0;
            z < mainSellers.filter((seller, index) => index !== 0 || index !== 1 || index !== 2).length;
            z++
          ) {
            for (
              let t = 0;
              t <
              mainSellers.filter((seller, index) => index !== 0 || index !== 1 || index !== 2 || index !== 3).length;
              t++
            ) {
              if (
                i !== j &&
                i !== k &&
                i !== z &&
                i !== t &&
                j !== k &&
                j !== z &&
                j !== t &&
                k !== z &&
                k !== t &&
                z !== t
              )
                output.push([mainSellers[i], mainSellers[j], mainSellers[k], mainSellers[z], mainSellers[t]])
            }
          }
        }
      }
    }
    output = output.map(function (sellersArray) {
      return sellersArray.sort(function (a, b) {
        return a - b
      })
    })
    output = output
      .reduce(function (preVal, sellersArray) {
        if (!preVal.includes(JSON.stringify(sellersArray))) preVal.push(JSON.stringify(sellersArray))
        return preVal
      }, [])
      .map((sellersArray) => JSON.parse(sellersArray))
      .filter(function (sellersArray) {
        return getters.getAutoSelectionSets.every(function (prices) {
          return prices.some(function (price) {
            return sellersArray.includes(price.seller_id)
          })
        })
      })
    return output
  },
  getImgUrl: (state) => state.imgUrl,
  getNetProfitException: (state) => state.netProfitException,
  getPurchaseObjectsStatus: (state) => state.status,
  getAaddonKlpPrice: (state, getters, rooState, rootGetters) => rootGetters['price/getAddonKlp'],
  getCurrentPurchaseNotifications(state, getters) {
    const notifications = []
    if (getters.getCurrentPurchase.bot_is_preferences)
      notifications.push(
        'К закупке могут быть применены преференции, т.к. одна из стран происхождения товаров отличается от Армении, России, Беларуси, Казахстана'
      )
    return notifications
  },
  getCurrentPurchaseProfitability: (state) => state.currentPurchaseProfitability,
  getErrorMessage: (state) => state.errorMessage,
  getKladrObjectsSellers: (state) => state.kladrObjectsSellers,
  getKladrIds: (state) => state.kladrIds || [],
  getDeliveryObjects: (state) => state.deliveryObjects,
  getMultiplyDelivery: (state) => state.multiplyDelivery,
  getPurchaseMessages: (state) => JSON.parse(JSON.stringify(state.purchaseComments)),
  getInputShelfGroups: (state) => JSON.parse(JSON.stringify(state.inputShelfGroups)),
  getActiveShelfField: (state) => JSON.parse(JSON.stringify(state.activeShelfField)),
  getRuRules: (state) => state.ruRules,
  getSt1Rules: (state) => state.st1Rules,
  getPurchaseType: (state) => (fcsType) =>
    state.purchaseTypes.find((purchaseType) => purchaseType.fcs_type === fcsType) || null,
  getCurrentCustomerPurchase: (state, getters, rootState) => rootState.dictionaries.currentCustomer,
  getContractGearanteeAmount: (state) => state.contractGuaranteeAmount,
  getApplicationGuaranteeAmount: (state) => state.applicationGuaranteeAmount,
  getMaxPrice: (state) => state.maxPrice,
  getPorogPrice: (state) => state.porogPrice,
  getPurchaseNumberManual: (state) => state.purchaseNumberManual,
  getCurrentTradingPlace: (state) => state.currentTradingPlace,
  getCurrentFcsType: (state) => state.currentFcsType,
  getCurrentRegion: (state) => state.currentRegion,
  getPurchaseUserId: (state) => state.purchaseUserId,
  getUpdatedPurchase(state, getters, rootState) {
    let currentPurchaseCustom = null
    // console.warn('1')
    currentPurchaseCustom = JSON.parse(JSON.stringify(state.currentPurchase.purchase_custom))
    // console.warn('2')
    currentPurchaseCustom.is_preferences = state.preferences
    // console.warn('3')
    currentPurchaseCustom.is_profitability = getters.getCurrentPurchaseProfitability
    // console.warn('4')
    currentPurchaseCustom.end_date = new Date(state.endDate)
    // console.warn('5')
    currentPurchaseCustom.bidding_date = new Date(state.biddingDate)
    // console.warn('6')
    currentPurchaseCustom.status_slug = state.purchaseStatus.status
    // console.warn('7')
    currentPurchaseCustom.delivery_place.kladr_id = state.currentLocality.id
    // console.warn('8')
    currentPurchaseCustom.delivery_place.kladr_ids = getters.getKladrIds
    // console.warn('9')
    currentPurchaseCustom.etp_code =
      state.currentTradingPlace && state.currentTradingPlace.etp_code ? state.currentTradingPlace.etp_code : null
    // console.warn('10')
    currentPurchaseCustom.surcharge_id = getters.getCurrentRegion.surcharge_id
    // console.warn('11')
    currentPurchaseCustom.fcs_type =
      state.currentFcsType && state.currentFcsType.fcs_type ? state.currentFcsType.fcs_type : null
    // console.warn('12')
    currentPurchaseCustom.purchase_number_manual = getters.getPurchaseNumberManual
    // console.warn('13')
    currentPurchaseCustom.max_price = getters.getMaxPrice
    // console.warn('14')
    currentPurchaseCustom.contract_guarantee_amount = getters.getContractGearanteeAmount
    // console.warn('15')
    currentPurchaseCustom.application_guarantee_amount = getters.getApplicationGuaranteeAmount
    // console.warn('16')
    currentPurchaseCustom.delivery_price.price_all_manual = getters.getDelivery
    // console.warn('17')
    currentPurchaseCustom.reg_number = rootState.dictionaries.currentCustomer.reg_number
    // console.warn('18')
    currentPurchaseCustom.delivery_ru2 = getters.getRuRules
    // console.warn('19')
    currentPurchaseCustom.delivery_st1 = getters.getSt1Rules
    // console.warn('20')
    currentPurchaseCustom.user_id = getters.getPurchaseUserId
    // console.warn('21')
    currentPurchaseCustom.shelf_life = getters.getInputShelfGroups
    // console.warn('22')
    return {
      purchase_objects: state.purchaseObjectsPrice.filter((purchaseObject) => purchaseObject.id),
      purchase_custom: currentPurchaseCustom,
      auto_delivery: false,
    }
  },
  getPurchaseCustomSlug: (state) => state.purchase_custom,
  getEndDate: (state) => state.endDate,
  getBiddingDate: (state) => state.biddingDate,
  getPurchaseStatus: (state) => state.purchaseStatus,
  getNumberOfDeliveries: (state) => state.numberOfDeliveries,
  getCostOfOneDelivery: (state) => state.costOfOneDelivery,
  getDelivery: (state) => state.delivery,
  getDeliveryAuto: (state) => state.deliveryAuto,
  getDocsDelivery: (state) => state.docsDelivery,
  getBlockHeight: (state) => state.blockHeight,
  getPreferences: (state) => state.preferences,
  getBlockHeightSearchPurchase: (state) => state.blockHeightSearchPurchase,
  getCurrentPurchase: (state) => JSON.parse(JSON.stringify(state.currentPurchase)),
  getFetchedPurchaseObject: (state) => JSON.parse(JSON.stringify(state.fetchedPurchaseObject)),
  getPurchaseObjects: (state) => JSON.parse(JSON.stringify(state.purchaseObjects)),
  getPurchaseObjectsPrice: (state) => JSON.parse(JSON.stringify(state.purchaseObjectsPrice)),
  getPurchaseObjectStatus: (state) => state.status,
  getLocality: (state) => JSON.parse(JSON.stringify(state.locality)),
  getKladrFilter: (state) => JSON.parse(JSON.stringify(state.kladrFilter)),
  getCurrentLocality: (state) => JSON.parse(JSON.stringify(state.currentLocality)),
  thermoMode: (state) => (min, max) => {
    if (min === null && max === null) return 'secondary'
    else if (!min && min !== 0 && max >= 25) return 'success'
    else if ((min === 0 && max >= 25) || (min === 0 && !max)) return 'info'
    else if ((min === 0 && max < 25) || (min > 0 && !max) || (min > 0 && max) || (!min && max < 25)) return 'danger'
  },
  thermoModeCheck: (state) => (min, max) => {
    if ((min === 0 && max < 25) || (min > 0 && !max) || (min > 0 && max) || (!min && max < 25)) return true
    else return false
  },
  getThermoMode: (state, getters) =>
    state.purchaseObjectsPrice
      .filter((purchaseObjectPrice) => purchaseObjectPrice.purchase_uuid)
      .map(function (purchaseObjectPrice) {
        if (!purchaseObjectPrice.price_objects.length) return ['secondary']
        else
          return purchaseObjectPrice.price_objects.map((priceObject) =>
            getters.thermoMode(
              priceObject.klp && priceObject.klp.temperature_min === 0
                ? 0
                : priceObject.klp
                ? priceObject.klp.temperature_min
                : null,
              priceObject.klp && priceObject.klp.temperature_max === 0
                ? 0
                : priceObject.klp
                ? priceObject.klp.temperature_max
                : null
            )
          )
      })
      .reduce(function (preVal, result) {
        return preVal.concat(result)
      }, []),
  getCustomersCounter: (state, getters) =>
    state.purchaseObjectsPrice
      .filter((purchaseObjectPrice) => purchaseObjectPrice.purchase_uuid)
      .map(function (purchaseObjectPrice) {
        if (!purchaseObjectPrice.price_objects.length) return null
        else
          return purchaseObjectPrice.price_objects.map(function (priceObject) {
            return priceObject.klp
              ? [
                  // Имя
                  priceObject.price.seller_original.seller_name,
                  // Кол-во коробок
                  (priceObject.drug_quantity_require / priceObject.klp.pre_packing).toFixed(2),
                  // в т.ч. термо
                  getters.thermoModeCheck(
                    priceObject.klp && priceObject.klp.temperature_min === 0
                      ? 0
                      : priceObject.klp
                      ? priceObject.klp.temperature_min
                      : false,
                    priceObject.klp && priceObject.klp.temperature_max === 0
                      ? 0
                      : priceObject.klp
                      ? priceObject.klp.temperature_max
                      : false
                  )
                    ? (priceObject.drug_quantity_require / priceObject.klp.pre_packing).toFixed(2)
                    : 0,
                  // в т.ч. без термо
                  getters.thermoModeCheck(
                    priceObject.klp && priceObject.klp.temperature_min === 0
                      ? 0
                      : priceObject.klp
                      ? priceObject.klp.temperature_min
                      : false,
                    priceObject.klp && priceObject.klp.temperature_max === 0
                      ? 0
                      : priceObject.klp
                      ? priceObject.klp.temperature_max
                      : false
                  )
                    ? 0
                    : (priceObject.drug_quantity_require / priceObject.klp.pre_packing).toFixed(2),
                  // Стоимость
                  (priceObject.drug_quantity_require * priceObject.price_price).toFixed(2),
                  // в т.ч. термо
                  getters.thermoModeCheck(
                    priceObject.klp && priceObject.klp.temperature_min === 0
                      ? 0
                      : priceObject.klp
                      ? priceObject.klp.temperature_min
                      : false,
                    priceObject.klp && priceObject.klp.temperature_max === 0
                      ? 0
                      : priceObject.klp
                      ? priceObject.klp.temperature_max
                      : false
                  )
                    ? (priceObject.drug_quantity_require * priceObject.price_price).toFixed(2)
                    : 0,
                  // в т.ч. без термо
                  getters.thermoModeCheck(
                    priceObject.klp && priceObject.klp.temperature_min === 0
                      ? 0
                      : priceObject.klp
                      ? priceObject.klp.temperature_min
                      : false,
                    priceObject.klp && priceObject.klp.temperature_max === 0
                      ? 0
                      : priceObject.klp
                      ? priceObject.klp.temperature_max
                      : false
                  )
                    ? 0
                    : (priceObject.drug_quantity_require * priceObject.price_price).toFixed(2),
                ]
              : [null, null, null, null, null, null]
          })
      })
      .reduce(function (preVal, result) {
        return preVal.concat(result)
      }, [])
      .reduce(function (preVal, customer) {
        if (preVal === undefined) preVal = []
        if (!customer) return preVal
        if (!preVal.find((item) => item[0] === customer[0])) preVal.push(customer)
        else {
          preVal[preVal.findIndex((item) => item[0] === customer[0])][1] = (
            Number(preVal[preVal.findIndex((item) => item[0] === customer[0])][1]) + Number(customer[1])
          ).toFixed(2)
          preVal[preVal.findIndex((item) => item[0] === customer[0])][2] = (
            Number(preVal[preVal.findIndex((item) => item[0] === customer[0])][2]) + Number(customer[2])
          ).toFixed(2)
          preVal[preVal.findIndex((item) => item[0] === customer[0])][3] = (
            Number(preVal[preVal.findIndex((item) => item[0] === customer[0])][3]) + Number(customer[3])
          ).toFixed(2)
          preVal[preVal.findIndex((item) => item[0] === customer[0])][4] = (
            Number(preVal[preVal.findIndex((item) => item[0] === customer[0])][4]) + Number(customer[4])
          ).toFixed(2)
          preVal[preVal.findIndex((item) => item[0] === customer[0])][5] = (
            Number(preVal[preVal.findIndex((item) => item[0] === customer[0])][5]) + Number(customer[5])
          ).toFixed(2)
          preVal[preVal.findIndex((item) => item[0] === customer[0])][6] = (
            Number(preVal[preVal.findIndex((item) => item[0] === customer[0])][6]) + Number(customer[6])
          ).toFixed(2)
        }
        return preVal
      }, []),
  getNarcoticMode: (state) =>
    state.purchaseObjectsPrice
      .filter((purchaseObjectPrice) => purchaseObjectPrice.purchase_uuid)
      .map(function (purchaseObjectPrice) {
        if (!purchaseObjectPrice.price_objects.length) return ['secondary']
        else
          return purchaseObjectPrice.price_objects.map(function (priceObject) {
            return priceObject.klp && priceObject.klp.is_narcotic
              ? 'danger'
              : priceObject.klp && !priceObject.klp.is_narcotic
              ? 'success'
              : 'secondary'
          })
      })
      .reduce(function (preVal, result) {
        return preVal.concat(result)
      }, []),
  getCopyRuState: (state) =>
    state.purchaseObjectsPrice
      .filter((purchaseObjectPrice) => purchaseObjectPrice.purchase_uuid)
      .map(function (purchaseObjectPrice) {
        if (!purchaseObjectPrice.price_objects.length) return false
        else
          return purchaseObjectPrice.price_objects.map(function (priceObject) {
            return !!(priceObject.klp && priceObject.klp.ru_file)
          })
      })
      .reduce(function (preVal, result) {
        return preVal.concat(result)
      }, []),
  getZnvlpPurchaseStatus: (state) =>
    state.purchaseObjectsPrice
      .filter((purchaseObjectPrice) => purchaseObjectPrice.purchase_uuid)
      .every(function (purchaseObjectPrice) {
        if (!purchaseObjectPrice.price_objects.length) return purchaseObjectPrice.is_znvlp
        else return purchaseObjectPrice.price_objects.every((priceObject) => priceObject.price.gnvls)
      }),
  getUniqueProviders: (state) =>
    state.purchaseObjectsPrice
      .filter((purchaseObjectPrice) => purchaseObjectPrice.purchase_uuid)
      .map(function (purchaseObjectPrice) {
        const result = []
        if (!purchaseObjectPrice.price_objects.length) return null
        else
          purchaseObjectPrice.price_objects.map(function (priceObject) {
            if (!result.includes(priceObject.price.seller)) result.push(priceObject.price.seller)
            return priceObject
          })
        return result
      }),
  getPurchaseValue: (state) =>
    state.purchaseObjectsPrice
      .filter((purchaseObjectPrice) => purchaseObjectPrice.purchase_uuid)
      .map(function (purchaseObjectPrice) {
        if (!purchaseObjectPrice.price_objects.length) return 0
        else
          return purchaseObjectPrice.price_objects.reduce(function (prevVal, priceObject) {
            return prevVal + priceObject.drug_quantity_require * priceObject.price_price
          }, 0)
      }),
  getReplacementValue(state, getters, rootState, rootGetters) {
    return state.purchaseObjectsPrice
      .filter((purchaseObjectPrice) => purchaseObjectPrice.purchase_uuid)
      .some(function (purchaseObject) {
        return rootGetters['replacements/getReplacements'].find(
          (replacement) =>
            replacement.mnn.includes(purchaseObject.mnn) && replacement.lf_name.includes(purchaseObject.form_name)
        )
      })
  },
  getOfferPositionValue: (state) =>
    state.purchaseObjectsPrice
      .filter((purchaseObjectPrice) => purchaseObjectPrice.purchase_uuid)
      .map(function (purchaseObjectPrice) {
        if (!purchaseObjectPrice.price_objects.length) return 0
        else
          return purchaseObjectPrice.price_objects.reduce(function (prevVal, priceObject) {
            return prevVal + priceObject.drug_quantity_require * priceObject.offer_price
          }, 0)
      }),
  getPriceRequireValue: (state) =>
    state.purchaseObjectsPrice
      .filter((purchaseObjectPrice) => purchaseObjectPrice.purchase_uuid)
      .map(function (purchaseObjectPrice) {
        if (!purchaseObjectPrice.price_objects.length) return null
        else return purchaseObjectPrice.price_objects.map((priceObject) => priceObject.drug_quantity_require)[0]
      }),
  getPurchaseValueZnvlp: (state) =>
    state.purchaseObjectsPrice
      .filter((purchaseObjectPrice) => purchaseObjectPrice.purchase_uuid)
      .map(function (purchaseObjectPrice) {
        if (!purchaseObjectPrice.price_objects.length) return 0
        else
          return purchaseObjectPrice.price_objects.reduce(function (prevVal, priceObject) {
            let surcharge = 1
            if (priceObject.price_price_znvlp <= 50) {
              surcharge = state.currentPurchase.surcharge.addition1 / 100 + 1.1
            } else if (priceObject.price_price_znvlp <= 500) {
              surcharge = state.currentPurchase.surcharge.addition2 / 100 + 1.1
            } else {
              surcharge = state.currentPurchase.surcharge.addition3 / 100 + 1.1
            }
            return (
              prevVal +
              priceObject.drug_quantity_require * (Math.trunc(priceObject.price_price_znvlp * surcharge * 100) / 100)
            )
          }, 0)
      }),
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SET_ERROR_MESSAGE(state, message) {
    state.errorMessage = message
  },
  SAVE_PURCHASE_INFO(state, currentPurchase) {
    state.deliveryObjects = []
    currentPurchase.purchase_custom.porog_price = currentPurchase.porog_price
    currentPurchase.purchase_custom.price_require = currentPurchase.price_require
    currentPurchase.purchase_custom.price_require_znvlp = currentPurchase.price_require_znvlp
    currentPurchase.purchase_custom.profitability = currentPurchase.profitability
    currentPurchase.purchase_custom.is_profitability = currentPurchase.is_profitability
    currentPurchase.purchase_custom.fcs_type = currentPurchase.fcs_type
    currentPurchase.purchase_custom.status = currentPurchase.status
    state.purchaseStatus = { title: currentPurchase.status.name, status: currentPurchase.status.slug }
    state.currentPurchase = currentPurchase
    state.preferences = currentPurchase.is_preferences
    state.endDate = currentPurchase.end_date
    state.biddingDate = currentPurchase.bidding_date
    state.delivery = currentPurchase.purchase_custom.delivery_price.price_all_manual
    state.deliveryAuto = currentPurchase.purchase_custom.delivery_price.price_all
    state.currentTradingPlace = currentPurchase.etp
    state.contractGuaranteeAmount = currentPurchase.contract_guarantee_amount
    state.inputShelfGroups = currentPurchase.purchase_custom.shelf_life
    if (currentPurchase.purchase_custom.shelf_life.date) state.activeShelfField = 'date'
    else if (currentPurchase.purchase_custom.shelf_life.months) state.activeShelfField = 'input'
    else if (currentPurchase.purchase_custom.shelf_life.koef) state.activeShelfField = 'koef'
    else state.activeShelfField = 'input-group'
    state.currentFcsType = state.purchaseTypes.find(
      (purchaseType) => purchaseType.fcs_type === currentPurchase.fcs_type
    )
    state.ruRules = currentPurchase.purchase_custom.delivery_ru2
    state.st1Rules = currentPurchase.purchase_custom.delivery_st1
    state.currentRegion = {
      region_name: currentPurchase.surcharge.region_name,
      surcharge_id: currentPurchase.surcharge.id,
    }
    state.numberOfDeliveries = currentPurchase.purchase_custom.delivery_count.manual
    state.kladrIds = currentPurchase.purchase_custom.delivery_place.kladr_ids
    state.maxPrice = currentPurchase.max_price
    state.purchaseNumberManual = currentPurchase.purchase_number_manual
    state.currentLocality = {
      id: currentPurchase.kladr.id,
      name: `${currentPurchase.kladr.socr ? currentPurchase.kladr.socr : ''} ${
        currentPurchase.kladr.name ? currentPurchase.kladr.name : ''
      }, ${currentPurchase.kladr.region.name ? currentPurchase.kladr.region.name : ''} ${
        currentPurchase.kladr.region.socr ? currentPurchase.kladr.region.socr : ''
      }`,
    } || { id: null, name: 'Укажите населённый пункт' }
    state.deliveryObjects.push(state.currentLocality)
    if (state.currentPurchase && state.currentPurchase.status) {
      state.purchaseStatus = {
        title: state.currentPurchase.status.name,
        status: state.currentPurchase.status.slug,
      }
    } else state.purchaseStatus = { title: 'Все папки', status: null }
  },
  SAVE_PURCHASE_OBJECTS(state, purchaseObjects) {
    state.purchaseObjects = purchaseObjects.map(function (purchaseObject) {
      purchaseObject._showDetails = true
      return purchaseObject
    })
  },
  SAVE_PURCHASE_COMMENTS(state, purchaseComments) {
    state.purchaseComments = purchaseComments
  },
  SAVE_CURRENT_PURCHASE_OBJECT(state, currentPurchaseObject) {
    currentPurchaseObject._showDetails = true
    state.fetchedPurchaseObject = currentPurchaseObject
    state.purchaseObjects.push(currentPurchaseObject)
  },
  ADD_PRICES_IN_PURCHASE_OBJECTS(state, priceObjects) {
    let priceObjectsCopy = JSON.parse(JSON.stringify(priceObjects))
    priceObjectsCopy = priceObjectsCopy.map(function (priceObject) {
      priceObject._showDetails = false
      return priceObject
    })
    priceObjectsCopy = priceObjectsCopy.map(function (currentPrice) {
      if (
        currentPrice.klp &&
        currentPrice.klp.dimensions_length &&
        currentPrice.klp.dimensions_width &&
        currentPrice.klp.dimensions_height
      )
        currentPrice.dimension = `${currentPrice.klp.dimensions_length}x${currentPrice.klp.dimensions_width}x${currentPrice.klp.dimensions_height}`
      else currentPrice.dimension = '—x—x—'

      if (!currentPrice.price_klp.is_active) currentPrice.price_status = 'secondary'
      else if (!currentPrice.price_klp.esklp_klp_uuid) currentPrice.price_status = 'danger'
      else if (!currentPrice.price_klp.author_id) currentPrice.price_status = 'dark'
      else if (!currentPrice.price_klp.is_confirmed) currentPrice.price_status = 'warning'
      else currentPrice.price_status = 'success'
      return currentPrice
    })
    if (state.purchaseObjects.length) {
      let purchaseObjectsCopy = JSON.parse(JSON.stringify(state.purchaseObjects))
      purchaseObjectsCopy = purchaseObjectsCopy.map(function (purchaseObject) {
        purchaseObject.price_objects = []
        let result = priceObjectsCopy.filter(function (priceObject) {
          priceObject.flag = 'custom_bg_purchase'
          if (
            priceObject.purchase_object_id === purchaseObject.id &&
            (priceObject.is_current || priceObject.is_current_bot)
          )
            return priceObject
        })
        if (result.length > 1) result = result.filter((priceObject) => priceObject.price_status !== 'dark')
        if (result.length > 1) result = result.filter((priceObject) => priceObject.is_current)
        if (result.length) purchaseObject.price_objects = result
        return purchaseObject
      })
      state.purchaseObjectsPrice = purchaseObjectsCopy
      state.purchaseObjectsPrice = state.purchaseObjectsPrice.map(function (purchaseObject) {
        purchaseObject.price_objects.map(function (priceObject) {
          state.activeAdditionalFields.map(function (detailsObject) {
            if (
              detailsObject.purchase_uuid === purchaseObject.purchase_uuid &&
              detailsObject.price_object_id === priceObject.id
            ) {
              priceObject._showDetails = detailsObject.details_flag
            }
          })
          return priceObject
        })
        return purchaseObject
      })
      state.purchaseObjectsPrice.unshift({ _showDetails: true, flag: 'hide-me' })
    } else state.purchaseObjectsPrice = [{ _showDetails: true, flag: 'hide-me' }]
  },
  EDIT_PRICE_OBJECTS(state, newPriceObject) {
    if (!newPriceObject.price_klp.is_active) newPriceObject.price_status = 'secondary'
    else if (!newPriceObject.price_klp.esklp_klp_uuid) newPriceObject.price_status = 'danger'
    else if (!newPriceObject.price_klp.author_id) newPriceObject.price_status = 'dark'
    else if (!newPriceObject.price_klp.is_confirmed) newPriceObject.price_status = 'warning'
    else newPriceObject.price_status = 'success'

    state.purchaseObjectsPrice = state.purchaseObjectsPrice.map(function (purchaseObject) {
      purchaseObject.price_objects = purchaseObject.price_objects.map(function (priceObject) {
        if (priceObject.id === newPriceObject.id) return newPriceObject
        else return priceObject
      })
      return purchaseObject
    })
  },
  UPDATE_PURCHASE_MODAL_BLOCK_HEIGHT(state, flag) {
    if (flag === 'down' && state.blockHeight <= 70) state.blockHeight = state.blockHeight + 10
    else if (flag === 'up' && state.blockHeight >= 20) state.blockHeight = state.blockHeight - 10
  },
  UPDATE_PURCHASE_SEARCH_MODAL_BLOCK_HEIGHT(state, flag) {
    if (flag === 'down' && state.blockHeightSearchPurchase <= 70)
      state.blockHeightSearchPurchase = state.blockHeightSearchPurchase + 10
    else if (flag === 'up' && state.blockHeightSearchPurchase >= 20)
      state.blockHeightSearchPurchase = state.blockHeightSearchPurchase - 10
  },
  REMOVE_PURCHASE_OBJECT(state, objectIndex) {
    state.purchaseObjects = state.purchaseObjects.filter((object, index) => index !== objectIndex)
  },
  SAVE_LOCALITY(state, locality) {
    state.locality = locality
  },
  UPDATE_KLADR_FILTER(state, kladrFilter) {
    const kladrFilterCopy = { ...kladrFilter }
    if (!kladrFilterCopy.kladr_name) kladrFilterCopy.kladr_name = null
    if (!kladrFilterCopy.kladr_obl) kladrFilterCopy.kladr_obl = null
    if (kladrFilterCopy.kladr_name || kladrFilterCopy.kladr_obl) state.kladrFilter = kladrFilterCopy
  },
  SAVE_CURRENT_LOCALITY(state, currentLocality) {
    state.deliveryObjects = []
    state.currentLocality = {
      id: currentLocality.id,
      name: `${currentLocality.socr ? currentLocality.socr : ''} ${currentLocality.name ? currentLocality.name : ''}, ${
        currentLocality.region.name ? currentLocality.region.name : ''
      } ${currentLocality.region.socr ? currentLocality.region.socr : ''}`,
      cdek: currentLocality.cdek,
    }
    state.deliveryObjects.push(state.currentLocality)
    state.kladrIds = state.deliveryObjects.map((object) => object.id)
    state.kladrIds = state.kladrIds.reduce(function (preVal, kladrId) {
      if (!preVal.includes(kladrId)) preVal.push(kladrId)
      return preVal
    }, [])
  },
  ADD_LOCALITY(state, currentLocality) {
    if (!state.deliveryObjects.find((object) => object.id === currentLocality.id))
      state.currentLocality = {
        id: currentLocality.id,
        name: `${currentLocality.socr ? currentLocality.socr : ''} ${
          currentLocality.name ? currentLocality.name : ''
        }, ${currentLocality.region.name ? currentLocality.region.name : ''} ${
          currentLocality.region.socr ? currentLocality.region.socr : ''
        }`,
        cdek: currentLocality.cdek,
      }
    state.deliveryObjects.push(state.currentLocality)
    state.kladrIds = state.deliveryObjects.map((object) => object.id)
    state.kladrIds = state.kladrIds.reduce(function (preVal, kladrId) {
      if (!preVal.includes(kladrId)) preVal.push(kladrId)
      return preVal
    }, [])
  },
  CLEAR_KLADR_FILTER(state, field) {
    state.kladrFilter = { kladr_name: null, kladr_obl: null }
  },
  UPDATE_DOCS_DELIVERY(state, newValue) {
    if (newValue) state.docsDelivery = newValue
    else state.docsDelivery = 0
  },
  UPDATE_DELIVERY(state, newValue) {
    if (newValue) state.delivery = newValue
    else state.delivery = 0
  },
  UPDATE_PREFERENCES(state) {
    state.preferences = !state.preferences
  },
  UPDATE_PRICE_OBJECT(state, query) {
    state.purchaseObjectsPrice = state.purchaseObjectsPrice.map(function (purchaseObject) {
      if (purchaseObject.id)
        purchaseObject.price_objects = purchaseObject.price_objects.map(function (priceObject) {
          if (priceObject.id === query.updatedPriceObject.id)
            priceObject[query.field] = query.updatedPriceObject[query.field]
          return priceObject
        })
      return purchaseObject
    })
  },
  UPDATE_PRICE_OBJECT_QUERY_OBJECT(state, query) {
    state.purchaseObjectsPrice = state.purchaseObjectsPrice.map(function (purchaseObject) {
      if (purchaseObject.id)
        purchaseObject.price_objects = purchaseObject.price_objects.map(function (priceObject) {
          if (priceObject.id === query.updatedPriceObject.id) priceObject[query.object.field] = query.object.value
          return priceObject
        })
      return purchaseObject
    })
  },
  UPDATE_PURCHASE_OBJECT(state, editedPurchaseObject) {
    state.purchaseObjectsPrice = state.purchaseObjectsPrice.map(function (purchaseObject) {
      if (purchaseObject.id && purchaseObject.id === editedPurchaseObject.id) {
        purchaseObject = editedPurchaseObject
      }
      return purchaseObject
    })
  },
  UPDATE_NUMBER_OF_DELIVERIES(state, newValue) {
    state.numberOfDeliveries = newValue
  },
  UPDATE_COST_OF_ON_DELIVERY(state, newValue) {
    state.costOfOneDelivery = newValue
  },
  UPDATE_PURCHASE_CUSTOM(state, query) {
    if (query.child) state.currentPurchase.purchase_custom[query.field][query.child] = query.value
    else state.currentPurchase.purchase_custom[query.field] = query.value
  },
  CONCAT_PURCHASE_COMMENT(state, reason) {
    state.currentPurchase.purchase_custom.comment = state.currentPurchase.purchase_custom.comment.concat(reason)
  },
  SAVE_PURCHASE_COMPUTED_DATA(state, query) {
    if (!Object.keys(state.currentPurchase.purchase_custom).includes(query.field))
      state.currentPurchase.purchase_custom[query.field] = null
    state.currentPurchase.purchase_custom[query.field] = query.value
  },
  SAVE_END_DATE(state, newValue) {
    state.endDate = newValue
  },
  SAVE_BIDDING_DATE(state, newValue) {
    state.biddingDate = newValue
  },
  SAVE_PURCHASE_STATUS(state, newValue) {
    if (newValue) state.purchaseStatus = newValue
    else state.purchaseStatus = { title: 'Все папки', status: null }
  },
  SAVE_PURCHASE_CUSTOM_STATUS(state, slag) {
    state.purchase_custom.status_slug = slag
  },
  UPDATE_CURRENT_TRADING_PLACE(state, newValue) {
    state.currentTradingPlace = newValue
  },
  ADD_PURCHASE_PRICE_OBJECT(state, savedPurchasePriceObjects) {
    savedPurchasePriceObjects.map(function (savedPurchasePriceObject) {
      state.purchaseObjectsPrice = state.purchaseObjectsPrice.map(function (purchaseObject) {
        if (
          savedPurchasePriceObject.klp.dimensions_length &&
          savedPurchasePriceObject.klp.dimensions_width &&
          savedPurchasePriceObject.klp.dimensions_height
        )
          savedPurchasePriceObject.dimension = `${savedPurchasePriceObject.klp.dimensions_length}x${savedPurchasePriceObject.klp.dimensions_width}x${savedPurchasePriceObject.klp.dimensions_height}`
        else savedPurchasePriceObject.dimension = '—x—x—'
        if (!savedPurchasePriceObject.price_klp.esklp_klp_uuid) savedPurchasePriceObject.price_status = 'danger'
        else if (!savedPurchasePriceObject.price_klp.author_id) savedPurchasePriceObject.price_status = 'dark'
        else if (!savedPurchasePriceObject.price_klp.is_confirmed) savedPurchasePriceObject.price_status = 'warning'
        else savedPurchasePriceObject.price_status = 'success'
        if (purchaseObject.id && purchaseObject.id === savedPurchasePriceObject.purchase_object_id)
          purchaseObject.price_objects.push(savedPurchasePriceObject)
        return purchaseObject
      })
    })
  },
  UPDATE_CURRENT_REGION(state, updatedRegion) {
    state.currentRegion = updatedRegion
  },
  UPDATE_PURCHASE_NUMBER_MANUAL(state, updatedValue) {
    state.purchaseNumberManual = updatedValue
  },
  UPDATE_PURCHASE_MAX_PRICE(state, updatedValue) {
    state.maxPrice = updatedValue
  },
  UPDATE_POROG_PRICE(state, newValue) {
    state.porogPrice = newValue
  },
  UPDATE_CONTRACT_GUARANTEE_AMOUNT(state, newValue) {
    state.contractGuaranteeAmount = newValue
  },
  UPDATE_APPLICATION_GUARANTEE_AMOUNT(state, newValue) {
    state.applicationGuaranteeAmount = newValue
  },
  UPDATE_FCS_TYPE(state, updatedType) {
    state.currentFcsType = updatedType
  },
  UPDATE_RU_RULES(state, query) {
    state.ruRules[query.field] = query.value
  },
  UPDATE_ST1_RULES(state, query) {
    state.st1Rules[query.field] = query.value
    if (query.value === 'Есть' || query.value === 'Не требуется') state.st1Rules.text = null
    else state.st1Rules.text = 'Если более 2 заявок, не выходим'
  },
  UPDATE_ACTIVE_SHELF_FIELD(state, value) {
    state.activeShelfField = value
    if (value === 'input') state.inputShelfGroups.date = null
    if (value === 'input-group') {
      state.inputShelfGroups.date = null
      state.inputShelfGroups.months = null
    }
  },
  UPDATE_INPUT_SHELF_GROUPS(state, value) {
    state.inputShelfGroups = value
  },
  CLEAR_PURCHASE_OBJECT(state) {
    state.purchaseObjectsPrice = []
    state.activeAdditionalFields = []
    state.currentLocality = { id: null, name: 'Укажите населённый пункт' }
    state.purchaseUserId = null
  },
  SAVE_PHRASES_IN_PURCHASE_PRICE_OBJECT(state, query) {
    state.purchaseObjectsPrice = state.purchaseObjectsPrice.map(function (purchaseObject) {
      if (purchaseObject.purchase_uuid === query.price_object.purchase_uuid) {
        purchaseObject.price_objects = purchaseObject.price_objects.map(function (priceObject) {
          if (priceObject.id === query.price_object.id) {
            priceObject._showDetails = false
            priceObject.phrase_ids = query.phrase_ids
          }
          return priceObject
        })
      }
      return purchaseObject
    })
  },
  SHOW_ADDITIONAL_ROW(state, query) {
    state.purchaseObjectsPrice = state.purchaseObjectsPrice.map(function (purchaseObject) {
      if (purchaseObject.purchase_uuid === query.price_object.purchase_uuid) {
        purchaseObject.price_objects = purchaseObject.price_objects.map(function (priceObject) {
          if (priceObject.id === query.price_object.id) {
            priceObject._showDetails = !priceObject._showDetails
          }
          return priceObject
        })
      }
      return purchaseObject
    })
  },
  SAVE_ACTIVE_ADDITIONAL_FIELDS(state) {
    state.activeAdditionalFields = []
    state.purchaseObjectsPrice.map(function (purchaseObject) {
      if (purchaseObject.price_objects)
        purchaseObject.price_objects.map(function (priceObject) {
          state.activeAdditionalFields.push({
            purchase_uuid: purchaseObject.purchase_uuid,
            price_object_id: priceObject.id,
            details_flag: priceObject._showDetails,
          })
          return priceObject
        })
      return purchaseObject
    })
  },
  SAVE_NEW_USER_ID_IN_PURCHASE(state, purchaseUserId) {
    state.purchaseUserId = purchaseUserId
  },
  UPDATE_MULTIPLY_DELIVERY(state, flag) {
    state.multiplyDelivery = flag
  },
  CLEAR_MULTIPLY_OBJECTS(state) {
    state.deliveryObjects = state.deliveryObjects.filter((object, index) => index === 0)
    state.currentLocality = state.deliveryObjects[0]
    state.kladrIds = state.deliveryObjects.map((object) => object.id)
  },
  REMOVE_CURRENT_DELIVERY_PLACE(state, placeId) {
    state.deliveryObjects = state.deliveryObjects.filter((object) => object.id !== placeId)
    if (state.deliveryObjects.length === 1) state.currentLocality = state.deliveryObjects[0]
    state.kladrIds = state.deliveryObjects.map((object) => object.id)
  },
  SAVE_KLADR_OBJECTS(state, currentLocalities) {
    state.deliveryObjects = currentLocalities.map(function (currentLocality) {
      return {
        id: currentLocality.id,
        name: `${currentLocality.socr ? currentLocality.socr : ''} ${
          currentLocality.name ? currentLocality.name : ''
        }, ${currentLocality.region.name ? currentLocality.region.name : ''} ${
          currentLocality.region.socr ? currentLocality.region.socr : ''
        }`,
        cdek: currentLocality.cdek,
      }
    })
    state.kladrIds = state.deliveryObjects.map((object) => object.id)
  },
  SAVE_KLADR_OBJECTS_SELLERS(state, kladrObjectsSellers) {
    state.kladrObjectsSellers = kladrObjectsSellers
  },
  SAVE_CURRENT_PURCHASE_PROFITABILITY(state, newValue) {
    state.currentPurchaseProfitability = newValue
  },
  SET_EXPANDED_RU_SELECTED_PURCHASE(state, payload) {
    state.purchaseObjectsPrice = state.purchaseObjectsPrice.map(function (purchaseObject) {
      if (purchaseObject.flag) return purchaseObject
      else if (purchaseObject.id === payload.purchase_object_id) {
        purchaseObject.price_objects = purchaseObject.price_objects.map(function (priceObject) {
          if (priceObject.id === payload.price_id) {
            priceObject.klp_uuid_links = payload.klp_uuid_links
            return priceObject
          } else return priceObject
        })
        return purchaseObject
      } else return purchaseObject
    })
  },
  SAVE_NET_PROFIT_VALUE(state, netProfitException) {
    state.netProfitException = netProfitException
  },
  SAVE_CANVAS_IMAGE(state, imgUrl) {
    state.imgUrl = imgUrl
  },
  SAVE_PRICES(state, purchaseObjects) {
    state.autoSelectionObjectPrices = purchaseObjects.map(function (purchaseObject) {
      return purchaseObject.prices[0]
    })
  },
  UPDATE_AUTO_SELECTION_OBJECT_PRICES(state, prices) {
    state.autoSelectionObjectPrices = JSON.parse(JSON.stringify(state.autoSelectionObjectPrices)).map(function (
      priceObject
    ) {
      prices.map(function (price) {
        if (priceObject.id === price.price_id) priceObject = price
        return price
      })
      return priceObject
    })
  },
  AUTO_SELECTION_MODAL_OPENED(state, flag) {
    state.autoSelectionModalStatus = flag
  },
}

export const actions = {
  async fetchPurchaseInfo({ commit }, uuid) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/purchase/${uuid}`)
      commit('dictionaries/SET_CURRENT_CUSTOMER', data.responsible, { root: true })
      commit('SAVE_PURCHASE_INFO', data)
      commit('SET_STATUS', 'purchase_info-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchKladrObjects({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/kladr`, { params: { kladr_ids: getters.getKladrIds } })
      commit('SAVE_KLADR_OBJECTS', data)
      commit('SET_STATUS', 'kladr_objects-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchKladrObjectsSellers({ commit }, kladrIdsSellers) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/kladr`, { params: { kladr_ids: kladrIdsSellers } })
      commit('SAVE_KLADR_OBJECTS_SELLERS', data)
      commit('SET_STATUS', 'kladr_objects_sellers-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async createPurchaseMessage({ commit, dispatch, getters }, message) {
    const uploadingData = new FormData()
    uploadingData.set('purchase_uuid', getters.getCurrentPurchase.uuid)
    uploadingData.set('message', message)
    if (getters.getImgUrl) uploadingData.set('imgurl', getters.getImgUrl)
    commit('SET_STATUS', 'fetching')
    try {
      await this.$axios.$post(`/api/purchase/comment`, uploadingData)
      dispatch('fetchPurchaseMessages', getters.getCurrentPurchase.uuid)
      commit('SET_STATUS', 'purchase-message-created')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async removePurchaseMessage({ commit, dispatch, getters }, commentId) {
    commit('SET_STATUS', 'fetching')
    try {
      await this.$axios.$delete(`/api/purchase/comment/${commentId}`)
      dispatch('fetchPurchaseMessages', getters.getCurrentPurchase.uuid)
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async updatePurchaseMessage({ commit, dispatch }, query) {
    commit('SET_STATUS', 'update')
    try {
      await this.$axios.$put(`/api/purchase/comment/${query.comment.id}`, { complete: query.flag })
      dispatch('fetchPurchaseMessages', query.comment.purchase_uuid)
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchPurchaseMessages({ commit }, purchaseUuid) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/purchase/comment`, { params: { purchase_uuid: purchaseUuid } })
      commit('SAVE_PURCHASE_COMMENTS', data)
      commit('SET_STATUS', 'purchase_comments-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchPurchaseObjects({ commit, getters }, uuid) {
    let uuidCopy = uuid
    if (!uuid) uuidCopy = getters.getCurrentPurchase.uuid
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/purchase/object`, {
        params: { purchase_uuid: uuidCopy },
      })
      commit('SAVE_PURCHASE_OBJECTS', data)
      commit('SET_STATUS', 'purchase_objects-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async createPurchaseObject({ commit, getters }) {
    commit('SET_STATUS', 'creating')
    try {
      const { data } = await this.$axios.$post(`/api/purchase/object`, {
        purchase_uuid: getters.getCurrentPurchase.uuid,
      })
      commit('SAVE_CURRENT_PURCHASE_OBJECT', data)
      commit('SET_STATUS', 'current_purchase_object-is-created')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async removeCurrentPurchaseObject({ commit, dispatch, getters }, purchaseObject) {
    commit('SET_STATUS', 'removing')
    try {
      await this.$axios.$delete(`/api/purchase/object/${purchaseObject.id}`)
      dispatch('fetchPurchaseObjects', purchaseObject.purchase_uuid)
      commit('SET_STATUS', 'current_purchase_object-is-removed')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  getCurrentPurchaseObject({ commit, state }, id) {
    commit(
      'priceObject/SAVE_SELECTED_PURCHASE_OBJECT_HEAD',
      state.purchaseObjects.filter((purchaseObject) => purchaseObject.id === id),
      { root: true }
    )
  },
  async getLocality({ commit, getters }) {
    commit('SET_STATUS', 'removing')
    try {
      const { data } = await this.$axios.$get(`/api/kladr`, { params: getters.getKladrFilter })
      commit('SAVE_LOCALITY', data)
      commit('SET_STATUS', 'locality-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async updatePurchase({ commit, getters, dispatch }, query) {
    if (query === null) query = getters.getCurrentPurchase.uuid
    let autoPriceIndividual = null
    let autoPrice = false
    let queryUuid = null
    let autoDelivery = false
    let autoBidding = false
    if (!query.flag) queryUuid = query
    else {
      queryUuid = query.uuid
      autoDelivery = query.flag
    }
    if (query.auto_bidding) {
      autoBidding = query.auto_bidding
      queryUuid = query.uuid
      autoDelivery = query.flag
    }
    if (query.best_offer) {
      queryUuid = query.uuid
      autoPrice = query.best_offer
    }
    if (query.auto_price_individual) {
      queryUuid = query.uuid
      autoPriceIndividual = query.auto_price_individual
    }

    commit('SET_STATUS', 'update')
    commit('SET_ERROR_MESSAGE', null)
    try {
      await this.$axios.$put(`/api/purchase/${queryUuid}`, {
        ...getters.getUpdatedPurchase,
        auto_delivery: autoDelivery,
        auto_bidding: autoBidding,
        auto_price: autoPrice,
        auto_price_individual: autoPriceIndividual,
      })
      commit('SET_STATUS', 'purchase-is-updated')
      dispatch('fetchPurchaseInfo', queryUuid)
      dispatch('fetchPurchaseObjects', queryUuid)
      if (getters.getKladrIds.length) dispatch('fetchKladrObjects')
    } catch (e) {
      if (e && e.response && e.response.status === 400) commit('SET_ERROR_MESSAGE', e.response.data.errMessage)
      commit('SET_STATUS', 'error')
    }
  },
  async updatePurchaseObjectZnvlp({ commit, dispatch }, query) {
    commit('SET_STATUS', 'update')
    try {
      await this.$axios.$put(`/api/purchase/object/${query.id}`, {
        is_znvlp: query.is_znvlp,
      })
      commit('SET_STATUS', 'current_purchase_object-is-updated')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async updatePurchaseList({ commit, getters, dispatch }, uuid) {
    commit('SET_STATUS', 'update')
    try {
      await this.$axios.$put(`/api/purchase/${uuid}`, { purchase_custom: getters.getPurchaseCustomSlug })
      commit('SET_STATUS', 'purchase-is-updated')
      dispatch('purchase/fetchPurchase', null, { root: true })
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async editCurrentCustomer({ commit, dispatch }, customer) {
    commit('SET_STATUS', 'editing')
    try {
      await this.$axios.$put(`/api/responsible/${customer.reg_number}`, { comment: customer.comment })
      commit('SET_STATUS', 'customer-is-edited')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchAutoSelectionPrices({ commit, dispatch }, prices) {
    commit('SAVE_PRICES', prices)
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$post(`/api/purchase/object/price/get_replace`, { objects: prices })
      commit('UPDATE_AUTO_SELECTION_OBJECT_PRICES', data)
      commit('SET_STATUS', 'auto-selection-price-list-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async addAutoSelectionPrices({ commit, dispatch, getters }) {
    const purchaseUuid = getters.getCurrentPurchase.uuid
    const objects = getters.getPurchaseAutoSelectionObjectPrices.map(function (purchaseObject) {
      const id = purchaseObject.id
      const prices = purchaseObject.price_objects
      return { id, prices }
    })

    // objects = objects.map(function(object) {
    //   object.prices = object.prices.map(function(priceObject) {
    //     console.warn('priceObject', priceObject)
    //     return { id: priceObject.id }
    //   })
    //   return object
    // })

    try {
      await this.$axios.$post(`/api/purchase/object/price/set_replace`, { purchase_uuid: purchaseUuid, objects })
      dispatch('fetchPurchaseObjects')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
