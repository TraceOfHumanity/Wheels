// поліфіл для роботи випадаючого списку в браузерах що не підтримують forEach
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


// Кнопка показати більше у футері
buttonMoreFoкOnePageInFooter.addEventListener('click', function () {
  moreInfoPage1.classList.toggle('content__hidden');
  if (moreInfoPage1.classList.contains('content__hidden')) {
    buttonMoreFoкOnePageInFooter.textContent = 'More'
  } else {
    buttonMoreFoкOnePageInFooter.textContent = 'Less';
  }
})


document.querySelectorAll('.dropdown').forEach(function (dropDownWrapper){
  const dropDownBtn = dropDownWrapper.querySelector('.textBox');
  dropDownBtn.addEventListener('click', function() {
  dropDownWrapper.classList.toggle('active');
  
  const dropDownList = dropDownWrapper.querySelector('.option__list');
  const dropDownListItems = dropDownList.querySelectorAll('.option');

  dropDownListItems.forEach(function (listItem){
    listItem.addEventListener('click', function (e){
      e.stopPropagation();
      dropDownBtn.innerHTML = this.innerHTML;
      dropDownBtn.focus();
      dropDownWrapper.dropDownBtn.value = this.show.value;
    })
  })
  })
  function show(anything){
      document.querySelector('.textBox').value = anything;
    }
});

document.querySelectorAll('.card').forEach(function (dropDownInCards) {
  const dropDownBtnInCard = dropDownInCards.querySelector('#checkPriceID');
  const dropDownlistInCard = dropDownInCards.querySelector('#dropdownInCardID');
  const dropDownSilver = dropDownInCards.querySelector('#button__checkP');


  dropDownBtnInCard.addEventListener('click', function () {
    dropDownlistInCard.classList.toggle('dropdownInCard--hidden');
    dropDownSilver.classList.toggle('silver__btn');
    
  })
  
});
