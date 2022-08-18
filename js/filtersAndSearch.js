// polyfill for the operation of the drop-down list in browsers that do not support forEach
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (let i = 0; i < this.length; i++) {
          callback.call(thisArg, this[i], i, this);
      }
  };
}
const moreInfoPage1 = document.querySelector('#content');

document.querySelectorAll('.card').forEach(function (dropDownInCards) {
  const dropDownBtnInCard = dropDownInCards.querySelector('#checkPriceID');
  const dropDownlistInCard = dropDownInCards.querySelector('#dropdownInCardID');
  const dropDownSilver = dropDownInCards.querySelector('#button__checkP');


  dropDownBtnInCard.addEventListener('click', function () {
    dropDownlistInCard.classList.toggle('dropdownInCard--hidden');
    dropDownSilver.classList.toggle('silver__btn');
    
  })
  
});
