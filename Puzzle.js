//puzzleArray
var arr = new Array();
var shuffleArr = new Array(),
    tempArr = new Array();
var sum = 0;
var puzzleImg = 1;

for (var i = 0; i < 16; i++)
  arr[i] = i;

$(function() {
  for (var i = 0; i < 15; i++) {
    var puzzlePart = document.createElement("div");
    puzzlePart.className = "puzzle";
    puzzlePart.id = i;
    puzzlePart.puzzleIndex = i;
    $("#game-position").append(puzzlePart);
    $("#" + i).addClass("puzzle" + (i + 1)).addClass("puzzle-image-" + puzzleImg);
  }
  var emptyPart = document.createElement("div");
  emptyPart.className = "empty-part";
  emptyPart.id = "15";
  emptyPart.puzzleIndex = 15;
  $("#game-position").append(emptyPart);

  $("#game-position").click(clickHandler);
  $("#reset").click(shuffleHandler);
  $("#select-area").click(selectHandler);
});

var targetIndex,
    emptyIndex;

function clickHandler(event) {
  targetIndex = arr.indexOf(event.target.puzzleIndex);
  emptyIndex = arr.indexOf(15);
  if (targetIndex - 1 === emptyIndex || targetIndex + 1 === emptyIndex ||
      targetIndex - 4 === emptyIndex || targetIndex + 4 === emptyIndex) {
    var targetX = targetIndex % 4,
        targetY = Math.floor(targetIndex / 4),
        emptyX  = emptyIndex % 4,
        emptyY  = Math.floor(emptyIndex / 4);
    var xOffset = "+=" + (emptyX - targetX) * 90 + "px",
        yOffset = "+=" + (emptyY - targetY) * 90 + "px";
    $("#" + arr[targetIndex]).animate({"left":xOffset, "top":yOffset}, 150, swap);
  }
}

function swap() {
  //DOM swap
  var puzzlePart = document.createElement("div");
  puzzlePart.className = "puzzle" + " puzzle" + (arr[targetIndex] + 1) + " puzzle-image-" + puzzleImg;
  puzzlePart.puzzleIndex = arr[targetIndex];
  $("#" + arr[targetIndex]).after(puzzlePart).remove();
  puzzlePart.id = arr[targetIndex];
  $("#" + arr[targetIndex]).before($("#" + arr[emptyIndex]));
  if (emptyIndex > 0) {
    $("#" + arr[emptyIndex - 1]).after(puzzlePart);
  } else {
    if (targetIndex === 1)
      $("#" + arr[emptyIndex]).before(puzzlePart);
    else
      $("#" + arr[emptyIndex + 1]).before(puzzlePart);
  }
  //arr swap
  var temp = arr[targetIndex];
  arr[targetIndex] = 15;
  arr[emptyIndex] = temp;
  //check Win or not
  var win = true;
  for (var i = 0; i < 16; i++) {
    if (i !== arr[i]) {
      win = false;
      break;
    }
  }
  console.log(win);
  if (win) document.getElementById("result").className = "displayed";
  else document.getElementById("result").className = "hidden";
}

function shuffleHandler() {
  document.getElementById("result").className = "hidden";
  shuffleTheArr();
  for (var i = 0; i < 15; i++) {
    var targetIndex = shuffleArr.indexOf(i),
        selfIndex = arr.indexOf(i);
    var targetX = targetIndex % 4,
        targetY = Math.floor(targetIndex / 4),
        selfX = selfIndex % 4,
        selfY = Math.floor(selfIndex / 4);
    var xOffset = "+=" + (targetX - selfX) * 90 + "px",
        yOffset = "+=" + (targetY - selfY) * 90 + "px";
    $("#" + i).animate({"left":xOffset, "top":yOffset}, 300);
  }
  setTimeout(resetDOM, 300);
  for (var i = 0; i < 16; i++)
    arr[i] = shuffleArr[i];
}

function shuffleTheArr() {
  shuffleArr = new Array();
  tempArr = new Array();
  sum = 0;
  shuffleArr[15] = 15;
  for (var i = 0; i < 15; i++) {
    var index = Math.floor((Math.random()*15));
    while(shuffleArr[index] !== undefined)
      index = Math.floor((Math.random()*15));
    shuffleArr[index] = i;
    tempArr[index] = i;
  }
  countTheInversionNum(0, 14);
  if (sum % 2 === 1) {
    var temp = shuffleArr[13];
    shuffleArr[13] = shuffleArr[14];
    shuffleArr[14] = temp;
  }
}

function resetDOM() {
  $("#game-position").empty();
  for (var i = 0; i < 15; i++) {
    var puzzlePart = document.createElement("div");
    puzzlePart.className = "puzzle";
    puzzlePart.id = shuffleArr[i];
    puzzlePart.puzzleIndex = shuffleArr[i];
    $("#game-position").append(puzzlePart);
    $("#" + shuffleArr[i]).addClass("puzzle" + (shuffleArr[i] + 1)).addClass("puzzle-image-" + puzzleImg);
  }
  var emptyPart = document.createElement("div");
  emptyPart.className = "empty-part";
  emptyPart.id = "15";
  emptyPart.puzzleIndex = 15;
  $("#game-position").append(emptyPart);
}

function selectHandler(event) {
  if (event.target.className === "sbtn") {
    for (var i = 0; i < 15; i++) {
      var newClass = "puzzle" + " puzzle" + (i + 1) + " puzzle-image-" + event.target.value;
      document.getElementById(i.toString()).className = newClass;
      puzzleImg = event.target.value;
    }
    for (var i = 0; i < 15; i++) {
      var targetIndex = i,
          selfIndex = arr.indexOf(i);
      var targetX = targetIndex % 4,
          targetY = Math.floor(targetIndex / 4),
          selfX = selfIndex % 4,
          selfY = Math.floor(selfIndex / 4);
      var xOffset = "+=" + (targetX - selfX) * 90 + "px",
          yOffset = "+=" + (targetY - selfY) * 90 + "px";
      $("#" + i).animate({"left":xOffset, "top":yOffset}, 300);
    }
    for (var i = 0; i < 16; i++) {
      arr[i] = i;
      shuffleArr[i] = i;
    }
    setTimeout(resetDOM, 300);
  }
}

//逆序数归并算法
function countTheInversionNum(start, end) {
  if (start < end) {
    var mid = Math.floor((start + end) / 2);
    countTheInversionNum(start, mid);
    countTheInversionNum(mid + 1, end);
    var i = start,
        j = mid + 1;
    while (i <= mid && j <= end) {
      if (tempArr[i] <= tempArr[j])
        j++;
      else {
        sum += (end - j + 1);
        i++;
      }
    }
    Merge(start, end);
  }
}

function Merge(start, end) {
  if (start >= end) return;
  var mid = Math.floor((start + end) / 2);
  var temp = new Array();
  var i = start,
      j = mid + 1,
      k = 0;
  while (i <= mid && j <= end) {
    if (tempArr[i] > tempArr[j]) {
      temp[k] = tempArr[i];
      k++; i++;
    } else {
      temp[k] = tempArr[j];
      k++; j++;
    }
  }
  while (i <= mid) {
    temp[k] = tempArr[i];
    k++; i++;
  }
  while (j <= end) {
    temp[k] = tempArr[j];
    k++; j++;
  }
  for (var m = start, n = 0; m <= end; m++, n++)
    tempArr[m] = temp[n];
}
