document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM Content Loaded');

  //consts
  const sliderNodeWidth = 100; //px
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  //variables
  let slider = document.getElementById('slider');

  let sliderWidth = slider.getBoundingClientRect().width;
  let numLettersShown = sliderWidth / sliderNodeWidth;
  console.log(numLettersShown + " letters shown");
  let numSpacers = (numLettersShown - 1) / 2;

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
  var onSliderScrollDone = function() {
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
    if(selectedNode === undefined) {return;} //exit callback if no node is in middle
    console.log(selectedNode.textContent + " is selected.");
    
    //calculate shift
    let shift = alphabet.indexOf(selectedNode.textContent);
    //display shift
    let shiftDisplay = document.getElementById('shift-display');
    shiftDisplay.textContent = '+' + shift;
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

}); //End DOMContentLoaded Listener

/*-- Global Helper functions --*/
function addEmptyNodes(parent, childClass, childQuantity) {
  for(let i=0; i<childQuantity; i++) {
    let node = document.createElement('div');
    node.className = childClass;
    parent.appendChild(node); //not added to slidernodes
  }
}