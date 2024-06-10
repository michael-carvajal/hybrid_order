const storeScraping = () => {
  const storeMap = {};
  let items = document.querySelectorAll(".dropdown-menu.customerDropDown li a");
  for (let i = 0; i < items.length; i++) {
    const curr = items[i].innerHTML;
    if (!storeMap[curr]) {
      let storeCode = numberHelper(curr);
      let storeNumber = storeCode.split(" ")[0];
      storeMap[storeNumber] = storeCode;
    }
  }
};

function numberHelper(str) {
  let flag = false;
  let storeNumber = "";
  for (let i = 0; i < str.length; i++) {
    const letter = str[i];
    if (letter === "#") {
      flag = true;
    } else if (flag) {
      storeNumber += letter;
    } else if (letter === " ") {
      flag = false;
    }
  }

  return storeNumber;
}
const getStoreId = (storeNumber) => storeMap[storeNumber];
const storeMap = {
  12: "12 PR",
  17: "17 PR",
  19: "19 PR",
  24: "24 PR",
  25: "25 PR",
  28: "28 PR",
  29: "29 PR",
  44: "44 PR",
  49: "49 PR",
  50: "50 PR",
  52: "52 PR",
  57: "57 PR",
  60: "60 PR",
  61: "61 PR",
  62: "62 PR",
  64: "64 PR",
  66: "66 PR",
  67: "67 PR",
  69: "69 PR",
  70: "70 PR",
  71: "71 PR",
  72: "72 PR",
  73: "73 PR",
  74: "74 PR",
  75: "75 PR",
  76: "76 PR",
  77: "77 PR",
  78: "78 PR",
  79: "79 PR",
  81: "81",
  84: "84 PR",
  85: "85 PR",
  86: "86 PR",
  87: "87 PR",
  89: "89 PR",
  91: "91 PR",
  103: "103 PR",
  107: "107 PR",
  126: "126 PR",
  127: "127 PR",
  128: "128 PR",
  129: "129 PR",
  131: "131 PR",
  133: "133 PR",
  135: "135 PR",
  139: "139 PR",
  141: "141 PR",
  149: "149 PR",
  154: "154 PR",
  155: "155 PR",
  156: "156 PR",
  159: "159 PR",
  169: "169 PR",
  178: "178 PR",
  183: "183 PR",
  184: "184 PR",
  185: "185 PR",
  190: "190 PR",
  193: "193 PR",
  216: "216",
  225: "225 PR",
  401: "401 PR",
  402: "402 PR",
  403: "403 PR",
  514: "514 PR",
  524: "524 PR",
  530: "530 PR",
  701: "701 PR",
  708: "708 PR",
  783: "783 PR",
  870: "870 PR",
  871: "871 PR",
  872: "872 PR",
  874: "874 PR",
  875: "875 PR",
  876: "876 PR",
  877: "877 PR",
  878: "878 PR",
  879: "879 PR",
  880: "880 PR",
  882: "882 PR",
  914: "914 PR",
  915: "915 PR",
  916: "916 PR",
  917: "917 PR",
  918: "918 PR",
};
module.exports = getStoreId;