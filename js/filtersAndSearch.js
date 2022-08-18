// polyfill for the operation of the drop-down list in browsers that do not support forEach=========================================
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (let i = 0; i < this.length; i++) {
          callback.call(thisArg, this[i], i, this);
      }
  };
}

const buttonMoreFoкOnePageInFooter = document.querySelector('#button');
const moreInfoPage1 = document.querySelector('#content');

// dropDowns in tire2-1921.html===================================================================================================================
document.querySelectorAll('.dropdown').forEach(function (dropDownWrapper){
  const dropDownBtn = dropDownWrapper.querySelector('.textBox');
  dropDownBtn.addEventListener('click', function() {
  dropDownWrapper.classList.toggle('active');
  
  const dropDownList = dropDownWrapper.querySelector('.option__list');
  const dropDownListItems = dropDownList.querySelectorAll('.option');

  dropDownListItems.forEach(function (listItem){
    listItem.addEventListener('click', function (e){
      e.stopPropagation();
      listItem.innerHTML = this.innerHTML;
      dropDownBtn.focus();
      listItem.dropDownBtn.value = this.show.value;
    })
  })
  })
  function show(anything){
      document.querySelector('.textBox').value = anything;
    }
});



