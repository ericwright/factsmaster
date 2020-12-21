const DEFAULT_START = 1;
const DEFAULT_END = 12;

const shuffle = (a) => {
  let array = [...a];
  for (var i = array.length - 1; i > 0; i--) {
    var randomItem = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[randomItem];
    array[randomItem] = temp;
  }
  return array;
};

const validateProduct = (event, hFactor, vFactor) => {
  let element = event.target;
  let value = element.value;
  if (String(value).trim() === "") {
    return;
  }

  element.classList.remove("correct", "incorrect");

  if (Number.parseInt(value) === hFactor * vFactor) {
    element.classList.add("correct");
    return true;
  } else {
    element.classList.add("incorrect");
    return false;
  }
};

const inputCell = (hFactor, vFactor) => {
  return `
    <td class="input">
      <input 
        type="text" 
        step="1" 
        min="1" 
        max="100" 
        pattern="[0-9]+" 
        class="input"
        onblur="validateProduct(event, ${hFactor}, ${vFactor})"
        />
    </td>
    `;
};

const blankCell = () => {
  return '<td class="blank"></td>';
};

const headerCell = (value) => {
  return `<td class="header">${value}</td>`;
};

const headerRow = (list) => {
  let output = "<tr>";

  output += blankCell();

  for (let item of list) {
    output += headerCell(item);
  }

  output += "</tr>";
  return output;
};

const gridRow = (item, hList) => {
  let output = "<tr>";

  output += headerCell(item);
  for (let i = 0; i < hList.length; i++) {
    output += inputCell(item, hList[i]);
  }

  output += "</tr>";
  return output;
};

const gridRows = (hList, vList) => {
  let output = "";
  for (item of vList) {
    output += gridRow(item, hList);
  }
  return output;
};

const renderTable = (hList, vList) => {
  let output = "<table cellspacing='0'>";

  output += headerRow(hList);
  output += gridRows(hList, vList);

  output += "</table>";

  return output;
};

const shuffledList = (start, end) => {
  if (start > end) {
    [start, end] = [end, start];
  }

  let list = [];
  let length = end - start + 1;

  for (let i = 0; i < length; i++) {
    list[i] = start + i;
  }

  return shuffle([...list]);
};

let elements = {
  output: document.getElementById("output"),
  startField: document.getElementById("start"),
  endField: document.getElementById("end"),
  form: document.getElementById("form"),
  submitButton: document.getElementById("submit"),
};

const renderGrid = () => {
  console.log("start field", elements.startField);

  let startValue = Number.parseInt(elements.startField.value);
  let endValue = Number.parseInt(elements.endField.value);

  let start = isNaN(startValue) ? DEFAULT_START : startValue;
  let end = isNaN(endValue) ? DEFAULT_END : endValue;

  console.log("start", start);

  const hList = shuffledList(start, end);
  const vList = shuffledList(start, end);
  let output = renderTable(hList, vList);

  elements.submitButton.addEventListener("click", renderGrid);
  elements.output.innerHTML = output;
  elements.startField.value = start;
  elements.endField.value = end;
};

window.addEventListener("DOMContentLoaded", renderGrid);
