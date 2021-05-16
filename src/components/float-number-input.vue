<template>
  <label
    @keydown.up="incValue"
    @keydown.down="decValue"
    class="wrapper"
    :class="{ hasFocus: isFocus }"
  >
    <div class="input-wrapper">
      <span class="prefix">{{ prefix }}</span>
      <input
        @focus="isFocus = true"
        @focusout="isFocus = false"
        type="text"
        class="input"
        :value="inputValue"
        @input="_inputHandler"
        inputmode="numeric"
        v-bind="$attrs"
      />
      <span class="postfix">{{ postfix }}</span>
    </div>
    <div class="actions">
      <button
        tabindex="-1"
        @click="incValue"
        class="action-button"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 240.835 240.835"
          style="enable-background:new 0 0 240.835 240.835;"
          xml:space="preserve"
        >
          <path
            d="M129.007,57.819c-4.68-4.68-12.499-4.68-17.191,0L3.555,165.803c-4.74,4.74-4.74,12.427,0,17.155 c4.74,4.74,12.439,4.74,17.179,0l99.683-99.406l99.671,99.418c4.752,4.74,12.439,4.74,17.191,0c4.74-4.74,4.74-12.427,0-17.155 L129.007,57.819z"
          />
        </svg>
      </button>
      <button
        tabindex="-1"
        @click="decValue"
        class="action-button"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 240.811 240.811"
          style="enable-background:new 0 0 240.811 240.811;"
          xml:space="preserve"
        >
          <path
            d="M220.088,57.667l-99.671,99.695L20.746,57.655c-4.752-4.752-12.439-4.752-17.191,0 c-4.74,4.752-4.74,12.451,0,17.203l108.261,108.297l0,0l0 0c4.74,4.752,12.439,4.752,17.179,0L237.256,74.859 c4.74-4.752,4.74-12.463,0-17.215C232.528,52.915,224.828,52.915,220.088,57.667z"
          />
        </svg>
      </button>
    </div>
  </label>
</template>

<script>
export default {
  props: {
    prefix: {
      type: String,
      default: '',
    },
    postfix: {
      type: String,
      default: '',
    },

    value: {
      type: [String, Number],
      default: '',
    },

    straigthValue: {
      type: [String, Number],
      default: '',
    },

    maxValue: {
      type: Number,
      default: 1e6,
    },

    minValue: {
      type: Number,
      default: 0,
    },

    readonly: {
      type: Boolean,
      default: false,
    },
  },

  model: {
    event: 'input',
    prop: 'value',
  },

  data() {
    return {
      isFocus: false,

      inputValue: '',
      digit: 0,
      integer: 0,
      step: 0,
    }
  },

  created() {
    this.initValue()
  },

  watch: {
    inputValue() {
      this.$emit('input', this.inputValue)
    },

    straigthValue(v) {
      this.inputValue = v
    },

    value(value) {
      if (
        this.inputValue === `${value}` ||
        this.inputValue === Number(value).toFixed(this.digit)
      )
        return void 0
      this._inputHandler({ target: { value: value } })
    },
  },

  methods: {
    initValue() {
      this._inputHandler({ target: { value: this.value } })
    },

    /*
      #Maybe it should be refactored
      For control user input
      Returns prepared to process string, like x.xxx
    */
    _processValue(value) {
      // Exculude all symbols except: numbers, dot and comma
      let processedString = value.replace(/[^0-9.,]/g, '')

      // Replace comma to dot
      processedString = processedString.replace(/,/g, '.')

      // Replace severals dots in a row to one
      processedString = processedString.replace(/([.])\1/g, '.')

      // Replace several dots in one
      processedString = processedString.replace(/(?<=\..*)\./g, '')

      return processedString
    },

    _processDigits(value) {
      // Disallow to put more than digit after dot
      let result = ''
      if (this.getDigit(value) >= 8 && value !== '') {
        // result = value.slice(0, this.integer + 1 + 8)
        if (this.getDigit(value) === 9) {
          result = value.slice(0, value.length - 2) + value[value.length - 1]
        } else {
          result = value.slice(0, this.integer + 1 + 8)
        }
      }

      const returned = result || value

      this.digit = this.getDigit(returned)
      this.integer = this.getInteger(returned)

      return returned
    },

    getDigit(text) {
      // https://stackoverflow.com/questions/27082377/get-number-of-decimal-places-with-javascript
      // verify if number 0.000005 is represented as "5e-6"
      if (text.toString().indexOf('e-') > -1) {
        let [, trail] = text.split('e-')
        let deg = parseInt(trail, 10)
        return deg
      }
      // count decimals for number in representation like "0.123456"
      if (Math.floor(+text) !== +text) {
        return +text.toString().split('.')[1]?.length || 0
      }
      return 0
    },

    getInteger(text) {
      return Math.trunc(+text).toString().length
    },

    calculateStep() {
      this.step = 1 * 10 ** -this.digit
    },

    _inputHandler(e) {
      const value = e.target.value.toString()

      let processedValue = this._processValue(value)

      processedValue = this._processDigits(processedValue)

      if (+processedValue > this.maxValue) {
        processedValue = this.maxValue
      }

      if (+processedValue < this.minValue) {
        processedValue = this.minValue
      }

      // Disalow zeros in a row in int part
      if (processedValue[0] === '0' && processedValue[1] === '0') {
        processedValue = processedValue.substr(1)
      }

      // disalow more than 10 symbols
      if (+this.inputValue === 0 && this.inputValue.length >= 10) {
        processedValue = processedValue.slice(0, 10)
      }

      this.inputValue = processedValue

      this.calculateStep()

      this.$forceUpdate()
    },

    cropZero(str) {
      let [intPart, digitsPart] = str.split('.')
      if (digitsPart && digitsPart[digitsPart.length - 1] === '0') {
        digitsPart = digitsPart.slice(0, -1)
      }

      return [intPart, digitsPart].join('.')
    },

    incValue() {
      if (this.readonly) return void 0

      let newValue = ''

      newValue = this.cropZero(
        parseFloat(+this.inputValue + this.step).toFixed(this.digit)
      )

      if (this.inputValue === '' || this.inputValue === '0') {
        newValue = (1e-8).toFixed(8)
      }

      this.inputValue = newValue > this.maxValue ? this.maxValue : newValue

      this.digit = this.getDigit(this.inputValue)
      this.integer = this.getInteger(this.inputValue)
      this.calculateStep()
    },

    decValue() {
      if (this.readonly) return void 0

      let newValue = ''

      newValue = this.cropZero(
        parseFloat(+this.inputValue - this.step).toFixed(this.digit)
      )

      if (this.inputValue === '') {
        newValue = (1e-8).toFixed(8)
      }

      this.inputValue = newValue < this.minValue ? this.minValue : newValue

      this.digit = this.getDigit(this.inputValue)
      this.integer = this.getInteger(this.inputValue)
      this.calculateStep()
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  border: 1px solid #aaa;
  border-radius: 8px;
  transition: border-color 0.3s;

  &.hasFocus {
    border-color: #5547ec;
  }
}

.input-wrapper {
  --placeholder-color: #a9a9a9;

  display: flex;
  flex: 0 1 100%;
  justify-content: space-between;
  padding: 4px 0;

  .prefix {
    align-self: center;
    padding-left: 12px;
    color: var(--placeholder-color);
    white-space: nowrap;
  }

  .postfix {
    align-self: center;
    padding-right: 4px;
    color: var(--placeholder-color);
    white-space: nowrap;
  }

  .input {
    flex: 0 1 100%;
    margin: 0 4px;
    color: #222;
    text-align: right;
    background-color: transparent;
    border: none;
  }
}

.actions {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgb(231, 228, 228);
  border-left: 1px solid #aaa;
  border-radius: 0 8px 8px 0;
}

.action-button {
  display: flex;
  flex: 0 0 50%;
  align-items: center;
  justify-content: center;
  width: 38px;
  padding: 1px;
  cursor: pointer;
  border: none;

  &:hover {
    svg {
      fill: #5547ec;
    }
  }

  &:last-of-type {
    border-top: 1px solid #aaa;
  }
  svg {
    width: 18px;
    height: 18px;
    fill: #222;
    transition: fill 0.3s;
  }
}

.input {
  outline: 0;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
}
</style>
