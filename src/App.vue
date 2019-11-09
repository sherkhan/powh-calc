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


  <div>
    <el-row :gutter="20">
      <el-col :span="6"> <el-button @click.stop.prevent="recalculateAmounts(1000)">Add 1,000 EOS</el-button></el-col>
      <el-col :span="6"><el-button @click.stop.prevent="recalculateAmounts(10000)">Add 10,000 EOS</el-button></el-col>
      <el-col :span="6"><el-button @click.stop.prevent="recalculateAmounts(100000)">Add 100,000 EOS</el-button></el-col>
      <el-col :span="6"><el-button @click.stop.prevent="recalculateAmounts(1000000)">Add 1,000,000 EOS</el-button></el-col>
      
  </el-row>

  </div>
  <br>
  <el-row :gutter="20">
      <el-col :span="6"><el-input v-model.number="extra.eos" placeholder="Enter Amount"></el-input></el-col>
      <el-col :span="6"><el-button @click.stop.prevent="autoRecalculation(extra.eos)">Auto untill {{extra.eos ? extra.eos : 'input amount'}}</el-button></el-col>
      <el-col :span="6"><el-button @click.stop.prevent="autoRecalculation(5000000)">Auto untill 5kk</el-button></el-col>
      <el-col :span="6"><el-button @click.stop.prevent="autoRecalculation(8000000)">Auto untill 8kk</el-button></el-col>
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
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Your EOS amount after sell</span>
        </div>
        <div  class="text item">
          {{(price.sell * account.pow).toFixed(5)}}
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
        <el-card>
        <div slot="header" class="clearfix">
          <span>Your Referal Bonus</span>
        </div>
        <div  class="text item">
          {{extra.refs }}
        </div>
      </el-card>
      </el-col>
    </el-row>
  <br>
  <el-row :gutter="20">
    <el-form>
    <el-col :span="6">
      <el-form-item label="Enter Friends Amount">
      <el-input-number v-model.number="alice.friends" placeholder="Enter Friends Amount" :min="1" :max="100"></el-input-number>
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item label="Enter Friend min Deposit">
      <el-input-number v-model.number="alice.min" placeholder="Enter Friend min Deposit" :min="100" :max="1000"></el-input-number>
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item label="Enter Friend max Depost">
      <el-input-number v-model.number="alice.max" placeholder="Enter Friend max Depost" :min="1000" :max="10000"></el-input-number>
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item label="Alice Amount">
       <el-input-number v-model.number="alice.amount" placeholder="Alice Amount"></el-input-number>
      </el-form-item>
    </el-col>
    </el-form>
  </el-row>
  <br>
  <el-row>
    <el-col>
      <el-button @click="linkFriends(alice)" :disabled="!alice.friends && !alice.min && !alice.max && !alice.amount">Let's Alice buy on {{alice.amount}}EOS and link Her Friends</el-button>
    </el-col>
  </el-row>
  <br>
  <el-row>
    <el-col>
      <el-card>
        <div slot="header" class="clearfix">
          Alice
        </div>
        <h4 v-if="alice.pow">Alice bought <strong>{{alice.pow.toFixed(0)}}</strong>POW for <strong>{{alice.amount}}</strong>EOS and the price was <strong>{{alice.price}}</strong></h4>
        <p v-if="alice.persantage">Alice participation is {{alice.persantage}}%</p>
        <p v-if="alice.refs">Alice referals bonus is {{alice.refs.toFixed(0)}}EOS</p>
        <p v-if="alice.dividends">Alice dividends is {{alice.dividends.toFixed(0)}}EOS</p>
        <p v-if="alice.pow">Alice can sell her <strong>{{alice.pow.toFixed(0)}}</strong>POW for {{this.price.sell}} price and get  {{alice.pow * this.price.sell}}EOS</p>
        <p v-if="alice.pow">At the end Alice will own {{(alice.pow * this.price.sell) + alice.refs + alice.dividends}}EOS</p>

      </el-card>
    </el-col>
  </el-row>
  <el-row v-if="showFriendsDep">
    <el-col>
       <el-table
      :data="friends"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="Name"
        width="180">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="Amount (EOS)"
        width="180">
      </el-table-column>
    </el-table>
    </el-col>
  </el-row>
   

  </div>
</template>

<script>

import _get from 'lodash/get'
import _head from 'lodash/head'
import _sum from 'lodash/sum'
import { RANDOM_NAMES } from './names'

const URL = 'https://eosapi.blockmatrix.network/v1/chain/get_table_rows'

const ACCOUNT = 'vladendark35'

const REQUESTER = {
  contract: JSON.stringify({json: true, code:'powhcontract', table: 'stat', scope:'POW'}),
  account: JSON.stringify({json: true, code:'powhcontract', table: 'accounts', scope: ACCOUNT}),
  token: JSON.stringify({json: true, code:'eosio.token', table: 'accounts', scope:'powhcontract'})
}


export default {
  name: 'app',
  data (){
    return {
      alice: {
        friends: 10,
        min: 100,
        max: 1000,
        amout: 0,
        pow: 0,
        price: 0,
        refs: 0,
        dividends: 0,
        persantage: 0
      },
      friend: [],
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
        dividends: 0,
        refs: 0
      },
      showFriendsDep: false
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
     
      return (((0.001 * allCoins) / Math.pow(10,8)) + (0.0001 * (supply / (allCoins/10000))))
    },
  },
  methods: {
    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min) ) + min;
    },

    prepareAliceFriendsArray (alice) {
      let friendsArr = []
      let index = 0
      while (index < alice.friends) {
        friendsArr.push({
          isRef: true,
          name: RANDOM_NAMES[index],
          amount: this.getRndInteger(alice.min, alice.max)
        })
        index ++
      }
      return friendsArr
    },

    calculateAlicePercentage() {
      return ((this.alice.pow / this.contract.currentSupply.number) * 100).toFixed(2)
    },
    calculateAliceDicidends(amount) {
        return
    },
    calculateAlicesFriendsTransactions (friends) {
        friends.forEach((friend) => {
          this.recalculateAmounts(friend.amount, friend.isRef)
          this.alice.persantage = this.calculateAlicePercentage()
          this.alice.dividends = this.alice.dividends + ((((friend.amount / 100) * 7) * this.alice.persantage ) / 100)
        })
    },

    async linkFriends(alice) {
      this.friends = await this.prepareAliceFriendsArray(alice)
      /*alive bought*/
      this.alice.price = this.price.buy
      this.alice.pow = this.alice.amount / this.price.buy
      this.recalculateAmounts(alice.amount)
      this.calculateAlicesFriendsTransactions(this.friends)
      this.showFriendsDep = true
    },

    autoRecalculation (summ) {
      while(this.contract.eos < parseFloat(summ)){
        let invest = this.getRndInteger(10,500);
          this.recalculateAmounts(invest)
      }
    },
    calculatePrice (supply, maxSupply) {
      let allCoins = _head(maxSupply.split(' '))
      let initialPrice = (((0.001 * allCoins) / Math.pow(10,8)) + (0.0001 * (supply / (allCoins/10000))))
      initialPrice = parseFloat(initialPrice)
      return {
        buy: initialPrice + (initialPrice / 10),
        sell: initialPrice - (initialPrice / 10),
        medium: initialPrice
      }
    },
    recalculateAmounts (extra, ref) {
      this.addDividends(extra, ref)
      let extraPow = extra / this.price.buy
      this.contract.currentSupply.number = this.contract.currentSupply.number + extraPow
      this.contract.eos = this.contract.eos + extra
      this.price = this.calculatePrice(this.contract.currentSupply.number, this.contract.maxSupply)
      
      return 
    },
    addDividends (amount, ref) {
        this.extra.dividends = this.extra.dividends + ((((amount / 100) * 7) * this.yourPowPersentage) / 100)
       
       /*Alice calculation Only*/
        if (ref && this.alice.pow > 9999) {
          this.alice.refs = this.alice.refs + ((amount / 100) * 3)
        }
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
    
    this.alice.amount = this.getRndInteger(100,1000)
    
    setTimeout(async () => {
      for (let item in REQUESTER) {
      await this.getBlockData(item, REQUESTER[item])
    }
    this.price = Object.assign({}, this.price, await this.calculatePrice(this.contract.currentSupply.number, this.contract.maxSupply))
    }, 500)
    
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
  .red {
    color: red
  }
</style>