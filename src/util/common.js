export const setLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
};
export const getLocalStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(""));
  } catch (e) {
    return null;
  }
};
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};
/**
 * Hàm nhận vào một chuỗi số với định dạng theo kiểu US (dấu chấm phân tách phần thập phân)
 * Hàm định dạng lại chuỗi số bằng cách thêm dấu phẩy vào phần thập phân phía trước dấu chấm
 * Nếu truyền một chuỗi không đúng định dạng thì hàm lặp tức dừng thực thi và return undefine
 * @numberString {string} stringValue chuỗi số.
 * @returns {string} - chuỗi số sau khi đã thêm dấu phẩy.
 */
export const formatStringNumberCultureUS = (numberString) => {
  const regex = /^$|^[0-9]+(\.[0-9]*)?$/;
  if (!regex.test(numberString)) return;
  const parts = numberString.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};
export const convertStringToNumber = function (str) {
  var noCommas = str.replace(/,/g, "");
  var number = Number(noCommas);
  if (isNaN(number)) {
    return 0;
  } else {
    return number;
  }
};
/**
 * Chia một chuỗi thành hai phần bằng ký tự trắng cuối cùng.
 *
 * @param {string} string - Chuỗi cần chia.
 * @return {Array} Một mảng chứa hai phần của chuỗi. Nếu chuỗi không chứa ký tự trắng,
 *   chuỗi gốc sẽ được trả về là phần tử duy nhất của mảng.
 */
export const splitStringByWhitespaceFromEnd = function (string) {
  let index = -1;
  for (let i = string.length - 1; i >= 0; i--) {
    if (string[i] === " ") {
      index = i;
      break;
    }
  }
  if (index === -1) {
    return [string];
  }
  return [string.slice(0, index), string.slice(index + 1)];
};
/**
 * Chia một chuỗi thành phần số và phần chuỗi.
 *
 * @param {string} inputString - Chuỗi đầu vào để chia.
 * @return {object|null} Một object chứa phần số và phần chuỗi,
 * hoặc null nếu chuỗi đầu vào không khớp với mẫu mong đợi.
 */
export const splitStringAndNumber = function (inputString) {
  var match = inputString.match(/([0-9.]+)([a-zA-Z]+)/);
  if (match) {
    return {
      numberPart: parseFloat(match[1]),
      stringPart: match[2],
    };
  } else {
    return null;
  }
};
export const roundDecimalValues = function (value, coinValue) {
  let decimalPlaces;
  if (coinValue > 10000) {
    decimalPlaces = 8;
  } else if (coinValue >= 100 && coinValue <= 9999) {
    decimalPlaces = 6;
  } else {
    decimalPlaces = 2;
  }
  const roundedValue = parseFloat(value.toFixed(decimalPlaces));
  return roundedValue;
};
