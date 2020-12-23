/*

  TODO
  * Pressing Enter should advance to the next field (same as pressing Tab)
  * Detect when all fields have been filled in correctly
  * 


// */
const DEFAULT_START = 1;
const DEFAULT_END = 12;

const shuffle = (a) => {
  let array = [...a];
  for (var i = array.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
};

const validateProduct = (event, hFactor, vFactor) => {
  const element = event.target;
  const answer = element.value;
  element.classList.remove("correct", "incorrect");

  if (String(answer).trim() === "") {
    return;
  }

  const answerIsCorrect = Number.parseInt(answer) === hFactor * vFactor;

  if (answerIsCorrect) {
    element.classList.add("correct");
    return true;
  } else {
    element.classList.add("incorrect");
    return false;
  }
};

const highlightFactors = (hFactor, vFactor) => {
  const HIGHLIGHT_CLASS = "highlighted";
  for (td of document.querySelectorAll("th.header")) {
    td.classList.remove(HIGHLIGHT_CLASS);
  }
  document.getElementById(`v${vFactor}`).classList.add(HIGHLIGHT_CLASS);
  document.getElementById(`h${hFactor}`).classList.add(HIGHLIGHT_CLASS);
};

const moveTo = (x, y) => {
  document.getElementById(`x${x}y${y}`).querySelector("input").focus();
};

const handleKeypress = (event, x, y, length) => {
  switch (event.key) {
    case "Enter":
      let newX, newY;

      if (x + 1 < length) {
        newX = x + 1;
        newY = y;
      } else if (y + 1 < length) {
        newX = 0;
        newY = y + 1;
      } else {
        newX = x;
        newY = y;
      }

      console.log("Enter", newX, newY, length);
      moveTo(newX, newY);
      break;
    default:
      break;
  }
};

const handleKeydown = (event, x, y, length) => {
  let newX = x;
  let newY = y;
  console.log(event);

  const fieldIsBlank = event.target.value.trim() === "";
  const arrowWasPressed =
    event.key === "ArrowUp" ||
    event.key === "ArrowRight" ||
    event.key === "ArrowDown" ||
    event.key === "ArrowLeft";

  console.log("field is blank? ", fieldIsBlank);
  console.log("arrow was pressed?", arrowWasPressed);

  if (arrowWasPressed && !fieldIsBlank) {
    return;
  }

  switch (event.key) {
    case "ArrowUp":
      newX = x;
      newY = y - 1 >= 0 ? y - 1 : y;
      console.log("ArrowUp", x, y);
      break;
    case "ArrowRight":
      newX = x + 1 <= length ? x + 1 : x;
      newY = y;
      console.log("ArrowRight", x, y, length);
      break;
    case "ArrowDown":
      newX = x;
      newY = y + 1 <= length ? y + 1 : y;
      console.log("ArrowDown", x, y);
      break;
    case "ArrowLeft":
      newX = x - 1 >= 0 ? x - 1 : x;
      newY = y;
      console.log("ArrowLeft", x, y);
      break;
    default:
      break;
  }

  moveTo(newX, newY);
};

const inputCell = (hFactor, vFactor, x, y, length) => {
  const location = `x${x}y${y}`;
  return `
    <td class="input" id="${location}">
      <input 
        type="text" 
        class="input"
        onblur="validateProduct(event, ${hFactor}, ${vFactor})"
        onfocus="highlightFactors(${hFactor}, ${vFactor})"
        onkeypress="handleKeypress(event, ${x}, ${y}, ${length})"
        onkeydown="handleKeydown(event, ${x}, ${y}, ${length})"
        />
    </td>
    `;
};

const blankCell = (value) => {
  return `<th class="blank">${value}</td>`;
};

const headerCell = (value, prefix = "") => {
  return `<th class="header" id="${prefix}${value}">${value}</td>`;
};

const headerRow = (list) => {
  let output = "<tr>";
  output += blankCell("×");

  for (let item of list) {
    output += headerCell(item, "v");
  }

  output += "</tr>";
  return output;
};

const gridRow = (item, hList, y) => {
  let output = "<tr>";

  output += headerCell(item, "h");
  for (const [index, value] of hList.entries()) {
    output += inputCell(item, hList[index], index, y, hList.length);
  }

  output += "</tr>";
  return output;
};

const table = (hList, vList) => {
  let output = '<table id="table" cellspacing="0">';
  output += headerRow(hList);

  for (const [index, item] of vList.entries()) {
    output += gridRow(item, hList, index);
  }

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
  let startValue = Number.parseInt(elements.startField.value);
  let endValue = Number.parseInt(elements.endField.value);

  let start = isNaN(startValue) ? DEFAULT_START : startValue;
  let end = isNaN(endValue) ? DEFAULT_END : endValue;

  const hList = shuffledList(start, end);
  const vList = shuffledList(start, end);

  elements.submitButton.addEventListener("click", renderGrid);
  elements.output.innerHTML = table(hList, vList);
  elements.startField.value = start;
  elements.endField.value = end;
};

window.addEventListener("DOMContentLoaded", renderGrid);
