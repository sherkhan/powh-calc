<template>
  <div id="app">
    <div>
      <el-form label-position="left"  >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Your POW amoun">
          <el-input v-model.number="account.pow" disabled></el-input>
        </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="DAPP POW amount">
          <el-input v-model.number="contract.currentSupply.number" disabled></el-input>
        </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="contract EOS amount">
          <el-input v-model.number="contract.eos" disabled></el-input>
        </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>


  <el-row :gutter="20">
      <el-col :span="6"> <el-button @click.stop.prevent="recalculateAmounts(1000)">Add 1,000 EOS</el-button></el-col>
      <el-col :span="6"><el-button @click.stop.prevent="recalculateAmounts(10000)">Add 10,000 EOS</el-button></el-col>
      <el-col :span="6"><el-button @click.stop.prevent="recalculateAmounts(100000)">Add 100,000 EOS</el-button></el-col>
      <el-col :span="6"><el-input v-model.number="extra.eos" @blur="recalculateAmounts(extra.eos)" placeholder="on blur recalculation"></el-input></el-col>
  </el-row>
   <br>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Contract Info</span>
        </div>
        <div class="text item">
          Current supply <br> {{contract.currentSupply.number}}
        </div>
        <div class="text item">
          Current Eos <br> {{contract.eos}}
        </div>
        <div class="text item">
          Max supply <br> {{contract.maxSupply}}
        </div>
      </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>POW Price</span>
        </div>
        <div  class="text item">
          medium price (sync)<br>
          {{currentPrice}}
        </div>
        <div  class="text item">
          medium price (async)<br>
          {{price.medium}}
        </div>
        <div  class="text item">
          buy price<br>
          {{price.buy}}
        </div>
        <div  class="text item">
          sell price<br>
          {{price.sell}}
        </div>
        
      </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Your Persentage</span>
        </div>
        <div  class="text item">
          {{yourPowPersentage}} %
        </div>
      </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Your Dividends</span>
        </div>
        <div  class="text item">
          {{extra.dividends }}
        </div>
      </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>

import _get from 'lodash/get'
import _head from 'lodash/head'
import _sum from 'lodash/sum'

const URL = 'https://public.eosinfra.io/v1/chain/get_table_rows'

const requester = {
  contract: JSON.stringify({json: true, code:'powhcontract', table: 'stat', scope:'POW'}),
  account: JSON.stringify({json: true, code:'powhcontract', table: 'accounts', scope:'vladendark35'}),
  token: JSON.stringify({json: true, code:'eosio.token', table: 'accounts', scope:'powhcontract'})
}


export default {
  name: 'app',
  data (){
    return {
      price: {
        buy: null,
        sell: null,
        medium: null
      },
      contract: {
        maxSupply: null,
        currentSupply: {
          text: null,
          number: null
        },
        eos: null
      },
      account: {
        pow: null
      },
      extra: {
        eos: null,
        pow: null,
        dividends: 0
      }
    }
  },
  computed: {
    yourPowPersentage () {
        return ((this.account.pow / this.contract.currentSupply.number) * 100).toFixed(2)
    },
    currentTokenSupply () {
        return this.contractEos * this.currentPrice
    },
    currentPrice () {
      let allCoins = this.contract && this.contract.maxSupply ? parseFloat(_head(this.contract.maxSupply.split(' '))) : 0
      let supply = this.contract.currentSupply.number
     
      return (((0.001 * allCoins) / Math.pow(10,8)) + (0.0001 * (supply / (allCoins/10000)))).toFixed(8)
    },
  },
  methods: {
    calculatePrice (supply, maxSupply) {
      let allCoins = _head(maxSupply.split(' '))
      let initialPrice = (((0.001 * allCoins) / Math.pow(10,8)) + (0.0001 * (supply / (allCoins/10000)))).toFixed(8)
      initialPrice = parseFloat(initialPrice)
      return {
        buy: initialPrice + (initialPrice / 10),
        sell: initialPrice - (initialPrice / 10),
        medium: initialPrice
      }
    },
    recalculateAmounts (extra) {
      this.addDividends(extra)
      let extraPow = extra / this.price.buy
      this.contract.currentSupply.number = this.contract.currentSupply.number + extraPow
      this.contract.eos = this.contract.eos + extra
      this.price = this.calculatePrice(this.contract.currentSupply.number, this.contract.maxSupply)
      
      return 
    },
    addDividends (amount) {
        this.extra.dividends = this.extra.dividends + (((amount / 10) * this.yourPowPersentage) / 100)
    },
    async requestBlockData (params) {
      return await this.axios.post(URL, params)
    },
    async getBlockData (item, param) {
      let request = await this.requestBlockData(param)
      const res = await _get(request, 'data.rows[0]')
      
      if (item === 'contract') {
        this.contract.maxSupply = res.max_supply
        this.contract.currentSupply.text = res.supply
        this.contract.currentSupply.number = parseFloat(_head(res.supply.split(' ')))
      } else if (item === 'account') {
         this.account.pow = parseFloat(_head(res.balance.split(' ')))
      } else if (item === 'token') {
        this.contract.eos = parseFloat(_head(res.balance.split(' ')))
      }
    }
  },
  async mounted () {
    for (let item in requester) {
      await this.getBlockData(item, requester[item])
    }
    this.price = Object.assign({}, this.price, await this.calculatePrice(this.contract.currentSupply.number, this.contract.maxSupply))
    
  }
}
</script>

<style lang="css">
  body {
    padding: 40px
  }
  #app {
    display: block;
    max-width: 900px;
    margin: auto
  }
  .text.item {
    margin-bottom: 5px;
  }
  button {
    display: block;
    width: 100%;
  }
</style>