function processBuy({ amount, total }, state) {
  const currentEth = state.currentEth
  const currentKick = state.currentKick

  const newKick = currentKick + amount
  const newEth = currentEth - total

  if (newEth < 0) {
    throw new Error('Balance limit reached')
  }

  return {
    eth: newEth,
    kick: newKick,
  }
}
function processSell({ amount, total }, state) {
  const currentEth = state.currentEth
  const currentKick = state.currentKick

  const newKick = currentKick - amount
  const newEth = currentEth + total

  if (newKick < 0) {
    throw new Error('Balance limit reached')
  }

  return {
    eth: newEth,
    kick: newKick,
  }
}

export function processOperation(data, state) {
  if (data.type === 'sell') {
    return Promise.resolve(processSell(data, state))
  }

  if (data.type === 'buy') {
    return Promise.resolve(processBuy(data, state))
  }

  Promise.reject(new Error('unknow type'))
}
