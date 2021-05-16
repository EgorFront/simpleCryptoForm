<template>
  <form class="form" @submit.prevent="makeOperation">
    <float-number-input
      class="form-input"
      prefix="Price"
      postfix="ETH"
      v-model.number="price"
      :maxValue="1e5"
      required
    />
    <float-number-input
      class="form-input"
      prefix="Amount"
      postfix="KICK"
      v-model.number="amount"
      :maxValue="1e5"
      required
    />
    <float-number-input
      readonly
      tabindex="-1"
      class="form-input"
      prefix="Total ~"
      postfix="ETH"
      :straigthValue="total"
    />

    <div class="actions">
      <button
        type="submit"
        name="action"
        value="buy"
        class="buy-btn button button--green"
      >
        BUY
      </button>
      <button
        type="submit"
        name="action"
        value="sell"
        class="sell-btn button button--red"
      >
        SELL
      </button>
    </div>
  </form>
</template>

<script>
import floatNumberInput from '@/components/float-number-input.vue'

export default {
  components: {
    floatNumberInput,
  },

  data() {
    return {
      price: '',
      amount: '',
    }
  },

  methods: {
    async makeOperation(e) {
      const type = e.submitter.value

      this.$store.dispatch('dealForm/makeOperation', {
        price: this.price,
        amount: this.amount,
        total: this.total,
        type,
      })
    },
  },

  computed: {
    total() {
      const value = (this.price * this.amount).toFixed(8)

      if (+value === 0 && this.price && this.amount) return 0
      if (+value === 0) return ''

      return value.replace(/0+$/, '')
    },
  },
}
</script>

<style lang="scss" scoped>
.form {
  .form-input {
    &:not(:first-of-type) {
      margin-top: 1rem;
    }
  }
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75em 1rem;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s, box-shadow 0.3s, color 0.3s, border 0.3s;

  &--green {
    color: #fff;
    background-color: #42b983;
    border: 1px solid #42b983;

    &:hover {
      color: #42b983;
      background-color: transparent;
    }
  }

  &--red {
    color: #f66;
    background-color: transparent;
    border: 1px solid #f66;

    &:hover {
      color: #fff;
      background-color: #f66;
    }
  }
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  .buy-btn {
    flex: 0 1 65%;
    margin-right: 8px;
  }

  .sell-btn {
    flex: 0 1 35%;
  }
}
</style>
