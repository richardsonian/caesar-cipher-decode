//global consts
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM Content Loaded');

  //consts
  const sliderNodeWidth = 100; //px

  //dynamic viewport
  let numLettersShown;
  if (window.innerWidth >= 700) {
    numLettersShown = 5;
  } else {
    numLettersShown = 3;
  }

  //variables
  let slider = document.getElementById('slider');
  let numSpacers = (numLettersShown - 1) / 2;
  /*
  let sliderWidth = slider.getBoundingClientRect().width;
  let numLettersShown = sliderWidth / sliderNodeWidth;
  console.log(numLettersShown + " letters shown");
  */
  let sliderNodes = []; //not including spacer nodes

  /*-- Initialize Slider Nodes --*/
  addEmptyNodes(slider, 'slider-node', numSpacers);  //left spacer nodes
  for(let i=0; i<alphabet.length; i++) { //add alphabet
    //create node
    let node = document.createElement('div');
    node.className = 'slider-node';
    node.textContent = alphabet.charAt(i);

    //add node to DOM and list
    slider.appendChild(node);
    sliderNodes.push(node);
  }
  addEmptyNodes(slider, 'slider-node', numSpacers);  //right spacer nodes

  /*-- Slider Scroll Callback --*/
  var getShiftFromSlider = function() {
    //helper function to see if element is incenter
    let isInCenter = function(element) {
      let accuracy = 0;
      let winWidth = window.innerWidth;
      let winCenter = winWidth / 2;
      let elemRect = element.getBoundingClientRect();
      let elemCenter = elemRect.left + (elemRect.width/2);

      return Math.abs(winCenter - elemCenter) <= accuracy;
    }

    //find the selected node
    let selectedNode;
    sliderNodes.forEach(node => {if(isInCenter(node)) {selectedNode = node;}});
    if(selectedNode === undefined) {return -1;} //exit callback if no node is in middle
    console.log(selectedNode.textContent + " is selected.");

    //calculate shift
    let shift = alphabet.indexOf(selectedNode.textContent);
    return shift;
  }
  

  var onSliderScrollDone = function() {
    //calculate shift
    let currentShift = getShiftFromSlider();
    //display shift
    if(currentShift != -1) {
      let shiftDisplay = document.getElementById('shift-display');
      shiftDisplay.textContent = '+' + currentShift;
    }
  };
  //run callback on page init
  onSliderScrollDone();

  /*-- Add Listener for Scroll Stopping --*/
  var isScrolling;
  // Listen for scroll events
  slider.addEventListener('scroll', (event) => {

    // Clear our timeout throughout the scroll
    window.clearTimeout( isScrolling );

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function() {
      // Run the callback
      onSliderScrollDone();
    }, 66);

  }, false);

  /*-- Listeners for Scroll buttons --*/
  document.getElementById('scroll-left').onclick = function() {
    slider.scrollBy({top:0, left:-sliderNodeWidth, behavior:"smooth"});
  }
  document.getElementById('scroll-right').onclick = function() {
    slider.scrollBy({top:0, left:sliderNodeWidth, behavior:"smooth"});
  }

  /*-- Listeners for Encode/Decode buttons --*/
  let textbox = document.getElementById('input-box');
  let outbox = document.getElementById('output-container');
  document.getElementById('encode-button').onclick = function() {
    let plainText = textbox.value;
    let shift = getShiftFromSlider();
    let cypherText = shiftText(plainText, shift);
    outbox.innerHTML = replaceNewlineWithBreak(cypherText);
  }
  document.getElementById('decode-button').onclick = function() {
    let cypherText = textbox.value;
    let shift = getShiftFromSlider();
    let plainText = shiftText(cypherText, -shift);
    outbox.innerHTML = replaceNewlineWithBreak(plainText);
  }

}); //End DOMContentLoaded Listener

/*-- Global Helper functions --*/
function addEmptyNodes(parent, childClass, childQuantity) {
  for(let i=0; i<childQuantity; i++) {
    let node = document.createElement('div');
    node.className = childClass;
    parent.appendChild(node); //not added to slidernodes
  }
}

function shiftText(inputText, shift) {
  let outputText = "";
  for(let i = 0; i < inputText.length; i++) {
    let char = inputText.charAt(i);
    console.log("Reading char: " + char);
    let newChar = "";
    if(alphabet.includes(char.toUpperCase())) { //if is a letter
      let charIndex = alphabet.indexOf(char.toUpperCase());
      console.log("Char index: " + charIndex);
      let newCharIndex = (charIndex + shift) % alphabet.length;
      if(newCharIndex < 0) {newCharIndex = alphabet.length + newCharIndex}; //account for negative 
      console.log("Shifted index: " + newCharIndex);
      newChar = alphabet.charAt(newCharIndex);
      newChar = (char == char.toLowerCase()) ? newChar.toLowerCase() : newChar.toUpperCase(); //ensure is right case
      console.log("New char: " + newChar);
    }
    else { //if is not a letter
      newChar = char;
    }

    outputText += newChar;
    console.log("So far string is: " + outputText);
  }
  return outputText;
}

function replaceNewlineWithBreak(inputText) {
  return inputText.replace(/(?:\r\n|\r|\n)/g, '<br>');
}