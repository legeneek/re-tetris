export const flatArray = function (arr) {
  let res = []

  if (Array.isArray(arr)) {
    for (let i = 0, len = arr.length; i < len; ++i) {
      res = res.concat(flatArray(arr[i]))
    }
  } else {
    res = res.concat(arr)
  }

  return res
}