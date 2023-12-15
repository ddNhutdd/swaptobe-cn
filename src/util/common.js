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
  if (!str) return NaN;
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
//
export const zoomImage = function (e) {
  console.log("image click", e.target.src);
  const body = document.body;
  let angel = 0,
    size = 1.2;
  //img
  var imgElement = document.createElement("img");
  imgElement.src = e.target.src;
  imgElement.style.transition = "transform 0.4s ease-in-out";
  imgElement.style.width = "300px";
  imgElement.style.objectFit = "cover";
  imgElement.style.position = "fixed";
  imgElement.style.top = "50%";
  imgElement.style.left = "50%";
  imgElement.style.transform = `translate(-50%, -50%) scale(0.1) rotate(${angel}deg)`;
  imgElement.style.zIndex = 10000;
  document.body.appendChild(imgElement);
  setTimeout(function () {
    imgElement.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${angel}deg)`;
  }, 100);
  // control
  const sizeUp = function () {
    size += 0.1;
    imgElement.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${angel}deg)`;
  };
  const sizeDown = function () {
    size -= 0.1;
    if (size <= 0) size = 0;
    imgElement.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${angel}deg)`;
  };
  const rotateRight = function () {
    angel += 18;
    imgElement.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${angel}deg)`;
  };
  const rotateLeft = function () {
    angel -= 18;
    imgElement.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${angel}deg)`;
  };
  const gl_header = document.createElement("div");
  gl_header.style.position = "fixed";
  gl_header.style.top = 0;
  gl_header.style.left = 0;
  gl_header.style.right = 0;
  gl_header.style.height = 80;
  gl_header.style.zIndex = 10001;
  gl_header.style.display = "flex";
  gl_header.style.justifyContent = "flex-end";
  gl_header.style.alignContent = "center";
  const icons = ["↶", "↷", "+", "-"];
  for (let icon of icons) {
    const gl_span = document.createElement("div");
    gl_span.innerHTML = icon;
    gl_span.style.fontSize = "26px";
    gl_span.style.color = "#fff";
    gl_span.style.fontWeight = "bold";
    gl_span.style.marginLeft = "10px";
    gl_span.style.marginRight = "10px";
    gl_span.style.cursor = "pointer";
    gl_span.style.userSelect = "none";
    if (icon === icons[2]) {
      gl_span.addEventListener("click", sizeUp);
    } else if (icon === icons[3]) {
      gl_span.addEventListener("click", sizeDown);
    } else if (icon === icons[1]) {
      gl_span.addEventListener("click", rotateRight);
    } else if (icon === icons[0]) {
      gl_span.addEventListener("click", rotateLeft);
    }
    gl_header.appendChild(gl_span);
  }
  body.appendChild(gl_header);
  //overlay
  const gl_overlay = document.createElement("div");
  gl_overlay.style.position = "fixed";
  gl_overlay.style.top = 0;
  gl_overlay.style.bottom = 0;
  gl_overlay.style.left = 0;
  gl_overlay.style.right = 0;
  gl_overlay.style.zIndex = 9999;
  gl_overlay.style.backgroundColor = "#000000b3";
  gl_overlay.addEventListener("click", (e) => {
    setTimeout(function () {
      imgElement.style.transition = "transform 0.2s ease-in-out";
      imgElement.style.transform = `translate(-50%, -50%) scale(0.1) rotate(${angel}deg)`;
    }, 100);
    setTimeout(function () {
      e.target.remove();
      imgElement.remove();
      gl_header.remove();
    }, 301);
  });
  body.appendChild(gl_overlay);
};
export const generateNewURL = function (
  baseUrl,
  username,
  coin,
  amountCoin,
  note
) {
  // Kiểm tra xem baseUrl có chứa dấu "?" hay không
  const separator = baseUrl.includes("?") ? "&" : "?";
  // Tạo URL mới bằng cách kết hợp baseUrl với các tham số
  const newURL = `${baseUrl}${separator}username=${username}&coin=${coin}&amountCoin=${amountCoin}&note=${encodeURIComponent(
    note
  )}`;
  return newURL;
};
export const parseURLParameters = function (url) {
  const queryString = url.split("?")[1];
  if (!queryString) {
    return {};
  }
  const queryParams = queryString.split("&");
  const result = {};
  queryParams.forEach((param) => {
    const [key, value] = param.split("=");
    result[key] = decodeURIComponent(value);
  });
  return result;
};
//
export const getClassListFromElementById = function (id) {
  const element = document.getElementById(id);
  if (element) return element.classList;
};
export const getElementById = function (id) {
  return document.getElementById(id);
};
export const querySelector = function (cssSelector) {
  return document.querySelector(cssSelector);
};
export const addClassToElementById = function (id, classname) {
  let element = document.getElementById(id);
  if (!element.classList.contains(classname)) {
    element.classList.add(classname);
  }
};
//
export const debounce = (func, ms) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), ms);
  };
};
