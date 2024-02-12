const boxElement = document.querySelector(".box");
const selectElement = document.querySelector("#algos");
const rangeInput = document.querySelector("#numberOfBars");
const numberOfBarsValueOutput = document.querySelector("#numberOfBarsValue");

// ======= CONSTANTS =======
let arr = [];
let numberOfBars = parseInt(rangeInput.value);
const maxHeight = 400;
let speedValue = 10;
let selectedOption = localStorage.getItem("selectedOption") || "bubble";
selectElement.value = selectedOption;

const sortingAlgos = {
  bubble: () => bubbleSortAnimation(),
  insertion: () => insertionSortAnimation(),
  selection: () => selectionSortAnimation(),
  merge: () => mergeSortAnimation(),
};

// ======= MAIN FUNCTIONS =======
function init() {
  arr = [];
  randomBars(numberOfBars, maxHeight);
  populateBars();
}

init();

function play() {
  sortingAlgos[selectedOption]();
}

function changeOption(e) {
  selectedOption = e.target.value;
  localStorage.setItem("selectedOption", selectedOption);
}

function changeNumberOfBars(e) {
  numberOfBars = parseInt(e.target.value);
  numberOfBarsValueOutput.textContent = numberOfBars;
  init();
}

selectElement.addEventListener("change", changeOption);
rangeInput.addEventListener("input", changeNumberOfBars);

// ======= CREATING BARS =======
function randomBars(numberOfBars, maxHeight) {
  for (let i = 0; i < numberOfBars; i++) {
    arr[i] = Math.floor(Math.random() * maxHeight + 1);
  }
}

function createBarElement(height) {
  const barElement = document.createElement("div");
  barElement.classList.add("bar");
  barElement.style.height = `${height}px`;
  return barElement;
}

function populateBars() {
  boxElement.innerHTML = "";
  const fragment = document.createDocumentFragment();

  arr.forEach((item) => {
    const barElement = createBarElement(item);
    fragment.appendChild(barElement);
  });

  boxElement.appendChild(fragment);
}

// ========= SORTING RELATED FUNCTIONS =========
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function swap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

// Bubble Sort algorithm
async function bubbleSortAnimation() {
  const bars = document.querySelectorAll(".bar");
  const numberOfBars = bars.length;

  for (let i = 0; i < numberOfBars - 1; i++) {
    for (let j = 0; j < numberOfBars - i - 1; j++) {
      const bar1 = bars[j];
      const bar2 = bars[j + 1];

      // Highlight bars being compared
      bar1.style.backgroundColor = "#e74c3c";
      bar2.style.backgroundColor = "#e74c3c";

      // Delay for visualization
      await sleep(speedValue);

      // Swap bars if necessary
      if (parseInt(bar1.style.height) > parseInt(bar2.style.height)) {
        const tempHeight = bar1.style.height;
        bar1.style.height = bar2.style.height;
        bar2.style.height = tempHeight;
      }

      // Reset color after comparison
      bar1.style.backgroundColor = "#3498db";
      bar2.style.backgroundColor = "#3498db";
    }
    bars[numberOfBars - i - 1].style.backgroundColor = "#27ae60";
  }
  bars[0].style.backgroundColor = "#27ae60";
}

// Selection Sort algorithm
async function selectionSortAnimation() {
  const bars = document.querySelectorAll(".bar");
  const numberOfBars = bars.length;

  for (let i = 0; i < numberOfBars - 1; i++) {
    let minIndex = i;
    bars[i].style.backgroundColor = "#e74c3c";

    for (let j = i + 1; j < numberOfBars; j++) {
      bars[j].style.backgroundColor = "#e74c3c";
      await sleep(speedValue);

      // Find the minimum value in the remaining unsorted part of the array
      if (
        parseInt(bars[j].style.height) < parseInt(bars[minIndex].style.height)
      ) {
        bars[minIndex].style.backgroundColor = "#3498db";
        minIndex = j;
      } else {
        bars[j].style.backgroundColor = "#3498db";
      }
    }
    swap(arr, i, minIndex);

    // Update the heights of the bars
    bars[i].style.height = `${arr[i]}px`;
    bars[minIndex].style.height = `${arr[minIndex]}px`;
    bars[i].style.backgroundColor = "#27ae60";
    await sleep(speedValue);
  }
  bars[numberOfBars - 1].style.backgroundColor = "#27ae60";
}

// Insertion Sort algorithm
async function insertionSortAnimation() {
  const bars = document.querySelectorAll(".bar");
  const numberOfBars = bars.length;

  for (let i = 1; i < numberOfBars; i++) {
    const key = parseInt(bars[i].style.height);
    let j = i - 1;

    // Highlight the current bar being inserted
    bars[i].style.backgroundColor = "#e74c3c";

    await sleep(speedValue);

    // Move elements of arr[0..i-1] that are greater than key to one position ahead of their current position
    while (j >= 0 && parseInt(bars[j].style.height) > key) {
      const bar1 = bars[j];
      const bar2 = bars[j + 1];

      // Highlight bars being compared
      bar2.style.backgroundColor = "#e74c3c";

      await sleep(speedValue);
      bar2.style.height = bar1.style.height;

      // Reset color after comparison
      bar2.style.backgroundColor = "#27ae60";

      j--;
    }

    // Insert the key into its correct position
    bars[j + 1].style.height = `${key}px`;
    bars[j + 1].style.backgroundColor = "#27ae60";
  }
  bars[numberOfBars - 1].style.backgroundColor = "#27ae60";
}

// Merge Sort algorithm
async function mergeSortAnimation() {
  const bars = document.querySelectorAll(".bar");
  const numberOfBars = bars.length;

  await mergeSort(0, numberOfBars - 1);

  // Reset colors after sorting is complete
  for (let i = 0; i < numberOfBars; i++) {
    bars[i].style.backgroundColor = "#27ae60";
    await sleep(speedValue);
  }

  async function mergeSort(start, end) {
    if (start >= end) {
      return;
    }

    const mid = Math.floor((start + end) / 2);

    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
  }

  async function merge(start, mid, end) {
    const leftSize = mid - start + 1;
    const rightSize = end - mid;

    const leftArray = new Array(leftSize);
    const rightArray = new Array(rightSize);

    // Copy data to temporary arrays
    for (let i = 0; i < leftSize; i++) {
      leftArray[i] = parseInt(bars[start + i].style.height);
      bars[start + i].style.backgroundColor = "#e74c3c"; // Highlight bars being compared
    }

    for (let j = 0; j < rightSize; j++) {
      rightArray[j] = parseInt(bars[mid + 1 + j].style.height);
      bars[mid + 1 + j].style.backgroundColor = "#3498db"; // Highlight bars being compared
    }

    await sleep(speedValue);

    let i = 0;
    let j = 0;
    let k = start;

    while (i < leftSize && j < rightSize) {
      if (leftArray[i] <= rightArray[j]) {
        bars[k].style.height = `${leftArray[i]}px`;
        i++;
      } else {
        bars[k].style.height = `${rightArray[j]}px`;
        j++;
      }
      k++;

      await sleep(speedValue);
    }

    // Copy remaining elements of leftArray
    while (i < leftSize) {
      bars[k].style.height = `${leftArray[i]}px`;
      i++;
      k++;

      await sleep(speedValue);
    }

    // Copy remaining elements of rightArray
    while (j < rightSize) {
      bars[k].style.height = `${rightArray[j]}px`;
      j++;
      k++;

      await sleep(speedValue);
    }

    // Reset colors after merging
    for (let x = start; x <= end; x++) {
      bars[x].style.backgroundColor = "#27ae60";
      await sleep(speedValue);
    }
  }
}
