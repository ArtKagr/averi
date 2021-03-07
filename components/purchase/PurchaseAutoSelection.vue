<template>
  <div class="d-flex vh-100 vw-100 flex-column overflow-hidden">
    <div class="d-flex w-100 justify-content-end px-3 py-2 bg-green-100">
      <b-icon-folder-check class="m-0 h4 mr-4 pointer" variant="success" @click="saveCloseModalAutoSelection" />
      <b-icon-x class="m-0 h4 pointer" @click="closeModalAutoSelection" />
    </div>
    <div class="d-flex h-100 w-100 overflow-hidden">
      <div class="d-flex flex-column h-100 w-25 bg-green-100 px-2">
        <div class="d-flex flex-column overflow-auto w-100 bg-green-100 mb-2 h-28">
          <!--          -->
          <div
            class="d-flex justify-content-between w-100 px-3 py-2 pointer bg-gray-200 my-1"
            style="border-radius: 5px"
            @click="setActiveSets(1)"
          >
            <div class="d-flex w-67 align-items-center">
              <b-icon-truck class="m-0 h5 mr-2" :variant="activeSet === 1 ? 'info' : ''"></b-icon-truck>
              <b-icon-x class="m-0 mr-2" :variant="activeSet === 1 ? 'info' : ''"></b-icon-x>
              <span class="m-0" style="font-size: 16px" :style="activeSet === 1 ? 'color: #17a2b8;' : ''">1</span>
            </div>
            <div class="d-flex w-33 align-items-center">
              <b-icon-trophy class="m-0 h5 mr-2" :variant="activeSet === 1 ? 'info' : ''"></b-icon-trophy>
              <span class="m-0" style="font-size: 13px" :style="activeSet === 1 ? 'color: #17a2b8;' : ''">
                {{
                  oneSetSeller && oneSetSeller[0]
                    ? `${$formatMoney(getTopSetPrice(oneSetSeller[0], 0))} ₽`
                    : 'Нет данных'
                }}
              </span>
            </div>
          </div>
          <!--          -->
          <div
            class="d-flex justify-content-between w-100 px-3 py-2 pointer bg-gray-200 my-1"
            style="border-radius: 5px"
            @click="setActiveSets(2)"
          >
            <div class="d-flex w-67 align-items-center">
              <b-icon-truck class="m-0 h5 mr-2" :variant="activeSet === 2 ? 'info' : ''"></b-icon-truck>
              <b-icon-x class="m-0 mr-2" :variant="activeSet === 2 ? 'info' : ''"></b-icon-x>
              <span class="m-0" style="font-size: 16px" :style="activeSet === 2 ? 'color: #17a2b8;' : ''">2</span>
            </div>
            <div class="d-flex w-33 align-items-center">
              <b-icon-trophy class="m-0 h5 mr-2" :variant="activeSet === 2 ? 'info' : ''"></b-icon-trophy>
              <span class="m-0" style="font-size: 13px" :style="activeSet === 2 ? 'color: #17a2b8;' : ''">
                {{
                  twoSetSellers && twoSetSellers[0]
                    ? `${$formatMoney(getTopSetPrice(twoSetSellers[0], 0))} ₽`
                    : 'Нет данных'
                }}
              </span>
            </div>
          </div>
          <!--          -->
          <div
            class="d-flex justify-content-between w-100 px-3 py-2 pointer bg-gray-200 my-1"
            style="border-radius: 5px"
            @click="setActiveSets(3)"
          >
            <div class="d-flex w-67 align-items-center">
              <b-icon-truck class="m-0 h5 mr-2" :variant="activeSet === 3 ? 'info' : ''"></b-icon-truck>
              <b-icon-x class="m-0 mr-2" :variant="activeSet === 3 ? 'info' : ''"></b-icon-x>
              <span class="m-0" style="font-size: 16px" :style="activeSet === 3 ? 'color: #17a2b8;' : ''">3</span>
            </div>
            <div class="d-flex w-33 align-items-center">
              <b-icon-trophy class="m-0 h5 mr-2" :variant="activeSet === 3 ? 'info' : ''"></b-icon-trophy>
              <span class="m-0" style="font-size: 13px" :style="activeSet === 3 ? 'color: #17a2b8;' : ''">
                {{
                  threeSetSellers && threeSetSellers[0]
                    ? `${$formatMoney(getTopSetPrice(threeSetSellers[0]))} ₽`
                    : 'Нет данных'
                }}
              </span>
            </div>
          </div>
          <!--          -->
          <div
            class="d-flex justify-content-between w-100 px-3 py-2 pointer bg-gray-200 my-1"
            style="border-radius: 5px"
            @click="setActiveSets(4)"
          >
            <div class="d-flex w-67 align-items-center">
              <b-icon-truck class="m-0 h5 mr-2" :variant="activeSet === 4 ? 'info' : ''"></b-icon-truck>
              <b-icon-x class="m-0 mr-2" :variant="activeSet === 4 ? 'info' : ''"></b-icon-x>
              <span class="m-0" style="font-size: 16px" :style="activeSet === 4 ? 'color: #17a2b8;' : ''">4</span>
            </div>
            <div class="d-flex w-33 align-items-center">
              <b-icon-trophy class="m-0 h5 mr-2" :variant="activeSet === 4 ? 'info' : ''"></b-icon-trophy>
              <span class="m-0" style="font-size: 13px" :style="activeSet === 4 ? 'color: #17a2b8;' : ''">
                {{
                  fourSetSellers && fourSetSellers[0]
                    ? `${$formatMoney(getTopSetPrice(fourSetSellers[0], 0))} ₽`
                    : 'Нет данных'
                }}
              </span>
            </div>
          </div>
          <!--          -->
          <div
            class="d-flex justify-content-between w-100 px-3 py-2 pointer bg-gray-200 my-1"
            style="border-radius: 5px"
            @click="setActiveSets(5)"
          >
            <div class="d-flex w-67 align-items-center">
              <b-icon-truck class="m-0 h5 mr-2" :variant="activeSet === 5 ? 'info' : ''"></b-icon-truck>
              <b-icon-x class="m-0 mr-2" :variant="activeSet === 5 ? 'info' : ''"></b-icon-x>
              <span class="m-0" style="font-size: 16px" :style="activeSet === 5 ? 'color: #17a2b8;' : ''">5</span>
            </div>
            <div class="d-flex w-33 align-items-center">
              <b-icon-trophy class="m-0 h5 mr-2" :variant="activeSet === 5 ? 'info' : ''"></b-icon-trophy>
              <span class="m-0" style="font-size: 13px" :style="activeSet === 5 ? 'color: #17a2b8;' : ''">
                {{
                  fiveSetSellers && fiveSetSellers[0]
                    ? `${$formatMoney(getTopSetPrice(fiveSetSellers[0], 0))} ₽`
                    : 'Нет данных'
                }}
              </span>
            </div>
          </div>
          <!--          -->
        </div>
        <div class="d-flex flex-column overflow-auto h-72">
          <div
            v-for="(set, key) in activeSets"
            :key="key"
            class="d-flex flex-column w-100 bg-gray-200 px-3 py-1 pointer mb-2"
            style="border-radius: 5px"
            @click="setActiveSet(set)"
          >
            <div class="d-flex align-items-center mb-1 w-100">
              <div class="d-flex flex-column w-80">
                <div v-for="(seller, index) in set" :key="index" class="d-flex align-items-center">
                  <span class="m-0 w-80" style="font-size: 12px">{{ seller.seller_name }}</span>
                  <span class="m-0 w-20" style="font-size: 12px">{{ $formatMoney(seller.price_count, 0) }} ₽</span>
                </div>
              </div>
              <span class="d-flex align-items-center mb-1 w-20" style="font-size: 12px"
                >{{ $formatMoney(getSetPrice(set), 0) }} ₽</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column h-100 w-75 m-1">
        <div class="d-flex flex-column h-100 w-100">
          <div class="d-flex align-self-end flex-column w-100 overflow-hidden" :class="`h-100`">
            <b-overlay :show="false" opacity="0.5" class="h-100 overflow-auto">
              <purchase-table source="purchase_main" :auto-selection="true" />
            </b-overlay>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PurchaseTable from './PurchaseTable'

export default {
  name: 'PurchaseAutoSelection',
  components: {
    PurchaseTable,
  },
  props: {
    hide: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      activeSet: 1,
    }
  },
  computed: {
    purchaseInfo() {
      return this.$store.getters['purchaseObject/getAutoSelectionInfo']
    },
    oneSellerSets() {
      const mainSellers = this.$store.getters['purchaseObject/getAvailableMainSellers']
      return this.$store.getters['purchaseObject/getOneSellerSets'].map(function (set) {
        return set.map(function (sellerId) {
          return mainSellers.find((seller) => Number(seller.id) === Number(sellerId))
        })
      })
    },
    twoSellersSets() {
      const mainSellers = this.$store.getters['purchaseObject/getAvailableMainSellers']
      return this.$store.getters['purchaseObject/getTwoSellerSets'].map(function (set) {
        return set.map(function (sellerId) {
          return mainSellers.find((seller) => Number(seller.id) === Number(sellerId))
        })
      })
    },
    threeSellersSets() {
      const mainSellers = this.$store.getters['purchaseObject/getAvailableMainSellers']
      return this.$store.getters['purchaseObject/getThreeSellerSets'].map(function (set) {
        return set.map(function (sellerId) {
          return mainSellers.find((seller) => Number(seller.id) === Number(sellerId))
        })
      })
    },
    fourSellersSets() {
      const mainSellers = this.$store.getters['purchaseObject/getAvailableMainSellers']
      return this.$store.getters['purchaseObject/getFourSellerSets'].map(function (set) {
        return set.map(function (sellerId) {
          return mainSellers.find((seller) => Number(seller.id) === Number(sellerId))
        })
      })
    },
    fiveSellersSets() {
      const mainSellers = this.$store.getters['purchaseObject/getAvailableMainSellers']
      return this.$store.getters['purchaseObject/getFiveSellerSets'].map(function (set) {
        return set.map(function (sellerId) {
          return mainSellers.find((seller) => Number(seller.id) === Number(sellerId))
        })
      })
    },
    oneSetSeller() {
      const purchaseInfo = this.purchaseInfo
      let activeSets = JSON.parse(JSON.stringify(this.oneSellerSets)).map(function (set) {
        return set.map(function (seller) {
          seller.price_count = purchaseInfo
            .map(function (purchaseObject, index) {
              return purchaseObject.purchase_prices
                .filter(function (price) {
                  return price.seller_id === seller.id && price.qnt >= purchaseObject.qnt_require
                })
                .map(function (price) {
                  return {
                    purchase_object_key: index,
                    seller: price.seller_id,
                    price: price.price * purchaseObject.qnt_require,
                    purchase_object_id: purchaseObject.purchase_object.id,
                    price_id: price.id,
                  }
                })
            })
            .map(function (purchaseObject) {
              if (purchaseObject.length === 2) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if (preVal[0].price >= priceObject.price) preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 3) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if ((index === 1 || index === 2) && preVal[0].price >= priceObject.price) preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 4) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if ((index === 1 || index === 2 || index === 3) && preVal[0].price >= priceObject.price)
                    preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 5) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if (
                    (index === 1 || index === 2 || index === 3 || index === 4) &&
                    preVal[0].price >= priceObject.price
                  )
                    preVal[0] = priceObject
                  return preVal
                }, [])
              }
              return purchaseObject
            })
            .reduce(function (preVal, price) {
              return preVal.concat(price)
            }, [])
          seller.price_info = seller.price_count
          seller.price_count_length = seller.price_count.length
          seller.price_count = seller.price_count.reduce(function (preVal, price) {
            return preVal + price.price
          }, 0)
          return seller
        })
      })
      activeSets = activeSets
        .filter((set) => set.every((seller) => seller.price_count_length === purchaseInfo.length))
        .sort(function (a, b) {
          return (
            a.reduce(function (preVal, seller) {
              return preVal + seller.price_count
            }, 0) -
            b.reduce(function (preVal, seller) {
              return preVal + seller.price_count
            }, 0)
          )
        })
      return activeSets
    },
    twoSetSellers() {
      const purchaseInfo = this.purchaseInfo
      let activeSets = JSON.parse(JSON.stringify(this.twoSellersSets)).map(function (set) {
        return set.map(function (seller) {
          seller.price_count = purchaseInfo
            .map(function (purchaseObject, index) {
              return purchaseObject.purchase_prices
                .filter(function (price) {
                  return price.seller_id === seller.id && price.qnt >= purchaseObject.qnt_require
                })
                .map(function (price) {
                  return {
                    purchase_object_key: index,
                    seller: price.seller_id,
                    price: price.price * purchaseObject.qnt_require,
                    purchase_object_id: purchaseObject.purchase_object.id,
                    price_id: price.id,
                  }
                })
            })
            .map(function (purchaseObject) {
              if (purchaseObject.length === 2) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if (preVal[0].price >= priceObject.price) preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 3) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if ((index === 1 || index === 2) && preVal[0].price >= priceObject.price) preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 4) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if ((index === 1 || index === 2 || index === 3) && preVal[0].price >= priceObject.price)
                    preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 5) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if (
                    (index === 1 || index === 2 || index === 3 || index === 4) &&
                    preVal[0].price >= priceObject.price
                  )
                    preVal[0] = priceObject
                  return preVal
                }, [])
              }
              return purchaseObject
            })
            .reduce(function (preVal, price) {
              return preVal.concat(price)
            }, [])
          return seller
        })
      })
      activeSets = activeSets.map(function (set) {
        return set.reduce(function (preVal, seller, index, sellers) {
          if (index === 0) {
            const firstSeller = sellers[0]
            const secondSeller = sellers[1]

            secondSeller.price_count.map(function (secondSellerPriceCount) {
              firstSeller.price_count = firstSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            firstSeller.price_count.map(function (secondSellerPriceCount) {
              secondSeller.price_count = secondSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })

            firstSeller.price_info = firstSeller.price_count
            firstSeller.price_count = Math.trunc(
              firstSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )
            secondSeller.price_info = secondSeller.price_count
            secondSeller.price_count = Math.trunc(
              secondSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            preVal.push(firstSeller)
            preVal.push(secondSeller)
          }
          return preVal
        }, [])
      })
      activeSets = activeSets
        .filter((set) => set.every((seller) => seller.price_count))
        .sort(function (a, b) {
          return (
            a.reduce(function (preVal, seller) {
              return preVal + seller.price_count
            }, 0) -
            b.reduce(function (preVal, seller) {
              return preVal + seller.price_count
            }, 0)
          )
        })
      return activeSets
    },
    threeSetSellers() {
      const purchaseInfo = JSON.parse(JSON.stringify(this.purchaseInfo))
      let activeSets = JSON.parse(JSON.stringify(this.threeSellersSets)).map(function (set) {
        return set.map(function (seller) {
          seller.price_count = purchaseInfo
            .map(function (purchaseObject, index) {
              return purchaseObject.purchase_prices
                .filter(function (price) {
                  return price.seller_id === seller.id && price.qnt >= purchaseObject.qnt_require
                })
                .map(function (price) {
                  return {
                    purchase_object_key: index,
                    seller: price.seller_id,
                    price: price.price * purchaseObject.qnt_require,
                    purchase_object_id: purchaseObject.purchase_object.id,
                    price_id: price.id,
                  }
                })
            })
            .map(function (purchaseObject) {
              if (purchaseObject.length === 2) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if (preVal[0].price >= priceObject.price) preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 3) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if ((index === 1 || index === 2) && preVal[0].price >= priceObject.price) preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 4) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if ((index === 1 || index === 2 || index === 3) && preVal[0].price >= priceObject.price)
                    preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 5) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if (
                    (index === 1 || index === 2 || index === 3 || index === 4) &&
                    preVal[0].price >= priceObject.price
                  )
                    preVal[0] = priceObject
                  return preVal
                }, [])
              }
              return purchaseObject
            })
            .reduce(function (preVal, price) {
              return preVal.concat(price)
            }, [])
          return seller
        })
      })
      activeSets = activeSets.map(function (set) {
        return set.reduce(function (preVal, seller, index, sellers) {
          if (index === 0) {
            const firstSeller = sellers[0]
            const secondSeller = sellers[1]
            const thirdSeller = sellers[2]

            firstSeller.price_count = firstSeller.price_count.map(function (firstSellerCount) {
              secondSeller.price_count = secondSeller.price_count.filter(function (secondSellerCount) {
                if (secondSellerCount.purchase_object_key !== firstSellerCount.purchase_object_key) return true
                else if (
                  secondSellerCount.purchase_object_key === firstSellerCount.purchase_object_key &&
                  secondSellerCount.price < firstSellerCount.price
                )
                  return true
                else if (
                  secondSellerCount.purchase_object_key === firstSellerCount.purchase_object_key &&
                  secondSellerCount.price > firstSellerCount.price
                )
                  return false
                else return false
              })
              firstSellerCount.price = Math.trunc(firstSellerCount.price)
              return firstSellerCount
            })
            secondSeller.price_count = secondSeller.price_count.map(function (secondSellerPriceCount) {
              firstSeller.price_count = firstSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              secondSellerPriceCount.price = Math.trunc(secondSellerPriceCount.price)
              return secondSellerPriceCount
            })
            thirdSeller.price_count = thirdSeller.price_count.map(function (thirdSellerCount) {
              secondSeller.price_count = secondSeller.price_count.filter(function (secondSellerCount) {
                if (secondSellerCount.purchase_object_key !== thirdSellerCount.purchase_object_key) return true
                else if (
                  secondSellerCount.purchase_object_key === thirdSellerCount.purchase_object_key &&
                  secondSellerCount.price < thirdSellerCount.price
                )
                  return true
                else if (
                  secondSellerCount.purchase_object_key === thirdSellerCount.purchase_object_key &&
                  secondSellerCount.price > thirdSellerCount.price
                )
                  return false
                else return false
              })
              thirdSellerCount.price = Math.trunc(thirdSellerCount.price)
              return thirdSellerCount
            })
            firstSeller.price_count.map(function (firstSellerCount) {
              thirdSeller.price_count = thirdSeller.price_count.filter(function (thirdSellerCount) {
                if (thirdSellerCount.purchase_object_key !== firstSellerCount.purchase_object_key) return true
                else if (
                  thirdSellerCount.purchase_object_key === firstSellerCount.purchase_object_key &&
                  thirdSellerCount.price < firstSellerCount.price
                )
                  return true
                else if (
                  thirdSellerCount.purchase_object_key === firstSellerCount.purchase_object_key &&
                  thirdSellerCount.price > firstSellerCount.price
                )
                  return false
                else return false
              })
              return Math.trunc(firstSellerCount)
            })
            thirdSeller.price_count.map(function (thirdSellerCount) {
              firstSeller.price_count = firstSeller.price_count.filter(function (firstSellerCount) {
                if (firstSellerCount.purchase_object_key !== thirdSellerCount.purchase_object_key) return true
                else if (
                  firstSellerCount.purchase_object_key === thirdSellerCount.purchase_object_key &&
                  firstSellerCount.price < thirdSellerCount.price
                )
                  return true
                else if (
                  firstSellerCount.purchase_object_key === thirdSellerCount.purchase_object_key &&
                  firstSellerCount.price > thirdSellerCount.price
                )
                  return false
                else return false
              })
              return Math.trunc(thirdSellerCount)
            })
            secondSeller.price_count.map(function (secondSellerCount) {
              thirdSeller.price_count = thirdSeller.price_count.filter(function (thirdSellerCount) {
                if (thirdSellerCount.purchase_object_key !== secondSellerCount.purchase_object_key) return true
                else if (
                  thirdSellerCount.purchase_object_key === secondSellerCount.purchase_object_key &&
                  thirdSellerCount.price < secondSellerCount.price
                )
                  return true
                else if (
                  thirdSellerCount.purchase_object_key === secondSellerCount.purchase_object_key &&
                  thirdSellerCount.price > secondSellerCount.price
                )
                  return false
                else return false
              })
              return Math.trunc(secondSellerCount)
            })

            firstSeller.price_info = firstSeller.price_count
            firstSeller.price_count = Math.trunc(
              firstSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            secondSeller.price_info = secondSeller.price_count
            secondSeller.price_count = Math.trunc(
              secondSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            thirdSeller.price_info = thirdSeller.price_count
            thirdSeller.price_count = Math.trunc(
              thirdSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            preVal.push(firstSeller)
            preVal.push(secondSeller)
            preVal.push(thirdSeller)
          }
          return preVal
        }, [])
      })
      activeSets = activeSets
        .filter((set) => set.every((seller) => seller.price_count))
        .sort(function (a, b) {
          return (
            a.reduce(function (preVal, seller) {
              return preVal + seller.price_count
            }, 0) -
            b.reduce(function (preVal, seller) {
              return preVal + seller.price_count
            }, 0)
          )
        })
      return activeSets
    },
    fourSetSellers() {
      const purchaseInfo = this.purchaseInfo
      let activeSets = JSON.parse(JSON.stringify(this.fourSellersSets)).map(function (set) {
        return set.map(function (seller) {
          seller.price_count = purchaseInfo
            .map(function (purchaseObject, index) {
              return purchaseObject.purchase_prices
                .filter(function (price) {
                  return price.seller_id === seller.id && price.qnt >= purchaseObject.qnt_require
                })
                .map(function (price) {
                  return {
                    purchase_object_key: index,
                    seller: price.seller_id,
                    price: price.price * purchaseObject.qnt_require,
                    purchase_object_id: purchaseObject.purchase_object.id,
                    price_id: price.id,
                  }
                })
            })
            .map(function (purchaseObject) {
              if (purchaseObject.length === 2) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if (preVal[0].price >= priceObject.price) preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 3) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if ((index === 1 || index === 2) && preVal[0].price >= priceObject.price) preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 4) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if ((index === 1 || index === 2 || index === 3) && preVal[0].price >= priceObject.price)
                    preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 5) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if (
                    (index === 1 || index === 2 || index === 3 || index === 4) &&
                    preVal[0].price >= priceObject.price
                  )
                    preVal[0] = priceObject
                  return preVal
                }, [])
              }
              return purchaseObject
            })
            .reduce(function (preVal, price) {
              return preVal.concat(price)
            }, [])
          return seller
        })
      })
      activeSets = activeSets.map(function (set) {
        return set.reduce(function (preVal, seller, index, sellers) {
          if (index === 0) {
            const firstSeller = sellers[0]
            const secondSeller = sellers[1]
            const thirdSeller = sellers[2]
            const forthSeller = sellers[3]

            firstSeller.price_count.map(function (secondSellerPriceCount) {
              secondSeller.price_count = secondSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            secondSeller.price_count.map(function (secondSellerPriceCount) {
              firstSeller.price_count = firstSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            firstSeller.price_count.map(function (secondSellerPriceCount) {
              thirdSeller.price_count = thirdSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            thirdSeller.price_count.map(function (secondSellerPriceCount) {
              firstSeller.price_count = firstSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            firstSeller.price_count.map(function (secondSellerPriceCount) {
              forthSeller.price_count = forthSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            forthSeller.price_count.map(function (secondSellerPriceCount) {
              firstSeller.price_count = firstSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })

            secondSeller.price_count.map(function (secondSellerPriceCount) {
              thirdSeller.price_count = thirdSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            thirdSeller.price_count.map(function (secondSellerPriceCount) {
              secondSeller.price_count = secondSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            secondSeller.price_count.map(function (secondSellerPriceCount) {
              forthSeller.price_count = forthSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            forthSeller.price_count.map(function (secondSellerPriceCount) {
              secondSeller.price_count = secondSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })

            thirdSeller.price_count.map(function (secondSellerPriceCount) {
              forthSeller.price_count = forthSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            forthSeller.price_count.map(function (secondSellerPriceCount) {
              thirdSeller.price_count = thirdSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })

            firstSeller.price_info = firstSeller.price_count
            firstSeller.price_count = Math.trunc(
              firstSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            secondSeller.price_info = secondSeller.price_count
            secondSeller.price_count = Math.trunc(
              secondSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            thirdSeller.price_info = thirdSeller.price_count
            thirdSeller.price_count = Math.trunc(
              thirdSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            forthSeller.price_info = forthSeller.price_count
            forthSeller.price_count = Math.trunc(
              forthSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            preVal.push(firstSeller)
            preVal.push(secondSeller)
            preVal.push(thirdSeller)
            preVal.push(forthSeller)
          }
          return preVal
        }, [])
      })
      return activeSets
        .filter((set) => set.every((seller) => seller.price_count))
        .sort(function (a, b) {
          return (
            a.reduce(function (preVal, seller) {
              return preVal + seller.price_count
            }, 0) -
            b.reduce(function (preVal, seller) {
              return preVal + seller.price_count
            }, 0)
          )
        })
    },
    fiveSetSellers() {
      const purchaseInfo = this.purchaseInfo
      let activeSets = JSON.parse(JSON.stringify(this.fiveSellersSets)).map(function (set) {
        return set.map(function (seller) {
          seller.price_count = purchaseInfo
            .map(function (purchaseObject, index) {
              return purchaseObject.purchase_prices
                .filter(function (price) {
                  return price.seller_id === seller.id && price.qnt >= purchaseObject.qnt_require
                })
                .map(function (price) {
                  return {
                    purchase_object_key: index,
                    seller: price.seller_id,
                    price: price.price * purchaseObject.qnt_require,
                    purchase_object_id: purchaseObject.purchase_object.id,
                    price_id: price.id,
                  }
                })
            })
            .map(function (purchaseObject) {
              if (purchaseObject.length === 2) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if (preVal[0].price >= priceObject.price) preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 3) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if ((index === 1 || index === 2) && preVal[0].price >= priceObject.price) preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 4) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if ((index === 1 || index === 2 || index === 3) && preVal[0].price >= priceObject.price)
                    preVal[0] = priceObject
                  return preVal
                }, [])
              }
              if (purchaseObject.length === 5) {
                purchaseObject = purchaseObject.reduce(function (preVal, priceObject, index) {
                  if (index === 0) preVal.push(priceObject)
                  else if (
                    (index === 1 || index === 2 || index === 3 || index === 4) &&
                    preVal[0].price >= priceObject.price
                  )
                    preVal[0] = priceObject
                  return preVal
                }, [])
              }
              return purchaseObject
            })
            .reduce(function (preVal, price) {
              return preVal.concat(price)
            }, [])
          return seller
        })
      })
      activeSets = activeSets.map(function (set) {
        return set.reduce(function (preVal, seller, index, sellers) {
          if (index === 0) {
            const firstSeller = sellers[0]
            const secondSeller = sellers[1]
            const thirdSeller = sellers[2]
            const forthSeller = sellers[3]
            const fifthSeller = sellers[4]

            firstSeller.price_count.map(function (secondSellerPriceCount) {
              secondSeller.price_count = secondSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            secondSeller.price_count.map(function (secondSellerPriceCount) {
              firstSeller.price_count = firstSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            firstSeller.price_count.map(function (secondSellerPriceCount) {
              thirdSeller.price_count = thirdSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            thirdSeller.price_count.map(function (secondSellerPriceCount) {
              firstSeller.price_count = firstSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            firstSeller.price_count.map(function (secondSellerPriceCount) {
              forthSeller.price_count = forthSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            forthSeller.price_count.map(function (secondSellerPriceCount) {
              firstSeller.price_count = firstSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            firstSeller.price_count.map(function (secondSellerPriceCount) {
              fifthSeller.price_count = fifthSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            fifthSeller.price_count.map(function (secondSellerPriceCount) {
              firstSeller.price_count = firstSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })

            secondSeller.price_count.map(function (secondSellerPriceCount) {
              thirdSeller.price_count = thirdSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            thirdSeller.price_count.map(function (secondSellerPriceCount) {
              secondSeller.price_count = secondSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            secondSeller.price_count.map(function (secondSellerPriceCount) {
              forthSeller.price_count = forthSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            forthSeller.price_count.map(function (secondSellerPriceCount) {
              secondSeller.price_count = secondSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            secondSeller.price_count.map(function (secondSellerPriceCount) {
              fifthSeller.price_count = fifthSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            fifthSeller.price_count.map(function (secondSellerPriceCount) {
              secondSeller.price_count = secondSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })

            thirdSeller.price_count.map(function (secondSellerPriceCount) {
              forthSeller.price_count = forthSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            forthSeller.price_count.map(function (secondSellerPriceCount) {
              thirdSeller.price_count = thirdSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            thirdSeller.price_count.map(function (secondSellerPriceCount) {
              fifthSeller.price_count = fifthSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            fifthSeller.price_count.map(function (secondSellerPriceCount) {
              thirdSeller.price_count = thirdSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })

            forthSeller.price_count.map(function (secondSellerPriceCount) {
              fifthSeller.price_count = fifthSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })
            fifthSeller.price_count.map(function (secondSellerPriceCount) {
              forthSeller.price_count = forthSeller.price_count.filter(function (firstSellerPriceCount) {
                if (firstSellerPriceCount.purchase_object_key !== secondSellerPriceCount.purchase_object_key)
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price < secondSellerPriceCount.price
                )
                  return true
                else if (
                  firstSellerPriceCount.purchase_object_key === secondSellerPriceCount.purchase_object_key &&
                  firstSellerPriceCount.price > secondSellerPriceCount.price
                )
                  return false
                else return false
              })
              return secondSellerPriceCount
            })

            firstSeller.price_info = firstSeller.price_count
            firstSeller.price_count = Math.trunc(
              firstSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            secondSeller.price_info = secondSeller.price_count
            secondSeller.price_count = Math.trunc(
              secondSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            thirdSeller.price_info = thirdSeller.price_count
            thirdSeller.price_count = Math.trunc(
              thirdSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            forthSeller.price_info = forthSeller.price_count
            forthSeller.price_count = Math.trunc(
              forthSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            fifthSeller.price_info = fifthSeller.price_count
            fifthSeller.price_count = Math.trunc(
              fifthSeller.price_count
                .map((priceCount) => Number(priceCount.price))
                .reduce(function (preVal, value) {
                  return preVal + Number(value)
                }, 0)
            )

            preVal.push(firstSeller)
            preVal.push(secondSeller)
            preVal.push(thirdSeller)
            preVal.push(forthSeller)
            preVal.push(fifthSeller)
          }
          return preVal
        }, [])
      })
      return activeSets
        .filter((set) => set.every((seller) => seller.price_count))
        .sort(function (a, b) {
          return (
            a.reduce(function (preVal, seller) {
              return preVal + seller.price_count
            }, 0) -
            b.reduce(function (preVal, seller) {
              return preVal + seller.price_count
            }, 0)
          )
        })
    },
    activeSets() {
      if (this.activeSet === 1) return this.oneSetSeller
      else if (this.activeSet === 2) return this.twoSetSellers
      else if (this.activeSet === 3) return this.threeSetSellers
      else if (this.activeSet === 4) return this.fourSetSellers
      else if (this.activeSet === 5) return this.fiveSetSellers
      else return []
    },
  },
  methods: {
    closeModalAutoSelection() {
      this.hide()
    },
    saveCloseModalAutoSelection() {
      this.$store.dispatch('purchaseObject/addAutoSelectionPrices')
      this.closeModalAutoSelection()
    },
    setActiveSets(count) {
      if (count <= this.purchaseInfo.length) this.activeSet = count
    },
    getSellerSetPrice(sellerId) {
      return sellerId
    },
    getSetPrice(set) {
      return set
        .map(function (seller) {
          return seller.price_count
        })
        .reduce(function (preVal, value) {
          return preVal + value
        }, 0)
    },
    getTopSetPrice(bestSet) {
      return bestSet.reduce(function (preVal, seller) {
        return preVal + seller.price_count
      }, 0)
    },
    setActiveSet(set) {
      const result = set
        .map(function (seller) {
          return seller.price_info.map(function (info) {
            return { id: info.purchase_object_id, prices: [{ id: info.price_id }] }
          })
        })
        .reduce(function (preVal, info) {
          return preVal.concat(info)
        }, [])
      this.$store.dispatch('purchaseObject/fetchAutoSelectionPrices', result)
    },
  },
}
</script>
