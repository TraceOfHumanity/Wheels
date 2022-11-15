function clearSelect(list, label) {
  list.empty()
  let wrap = list.closest('.dropdown')
  wrap.find('.dropdown__input-hidden').val('')
  wrap.find('.dropdown__button').text(label)
}


function onSelectYear(year) {
  let list = $('.js-list-make')
  clearSelect(list, 'Select Make')
  clearSelect($('.js-list-model'), 'Select Model')
  $('input[name="year"]').val(year)
  toggleClearCarFiltersBtn()

  if (year == '') {
      sendFilterRequest()
      return;
  }

  $.get('/wheels/catalog/get-makes-by-year/?year=' + year , function(response) {
      $.each(response.items, function(value, item){
          list.append(`<li class="dropdown__list-item" data-value="${item.alias}" onclick="onSelectMake('${item.alias}')">${item.title}</li>`);
      });

  }, 'json');
}

function onSelectMake(make_alias) {
  let year = $('[name="year"]').val()
  let list = $('.js-list-model')
  clearSelect(list, 'Select  Model')

  $.get('/wheels/catalog/get-models-by-year-and-make-alias/?year=' + year + '&make_alias=' +make_alias, function(response) {
      $.each(response.items, function(value, item){
          list.append(`<li class="dropdown__list-item" data-value="${item.alias}" onclick="onSelectModel('${item.alias}')">${item.title}</li>`);
      });

  }, 'json');
}

function onSelectModel(val) {
  $('[name="model"]').val(val)
  sendFilterRequest()
}

function onSelectSortBy(val) {
  $('[name="sort"]').val(val)
  sendFilterRequest()
}

function sendFilterRequest() {
  let year = $('[name="year"]').val()
  let make = $('[name="make"]').val()
  let model = $('[name="model"]').val()

  if (model === '') {
      make = ''
      year = ''
  }

  let filter = {
      year,
      make,
      model,
      'sort': $('[name="sort"]').val(),
      'rim-diameter': [],
      'rim-width': [],
      'rim-offset-range': [],
      'brand': [],
  }

  $('#form-catalog-filter input[type="checkbox"]:checked').each(function () {
      filter[$(this).attr('data-attribute')].push($(this).val())
  })


  if (filter['rim-diameter'].length === 0) {
      filter['rim-width'] = []
      filter['offset-range'] = []
  }

  sendFilterRequestToServer(filter, true)
}

function sendFilterRequestToServer(data, isPushState) {
  let url = '/wheels/catalog/';

  ['year', 'make', 'model'].forEach(function (attribute, i) {
      if (typeof data[attribute] !== undefined && data[attribute] !== '') {
          url += attribute + '=' + data[attribute] + '/'
      }
  })

  if (typeof data['rim-diameter'] === 'object' && data['rim-diameter'].length) {
      url += 'rim-diameter' + '=' + data['rim-diameter'].join(',') + '/'
  }

  if (typeof data['rim-width'] === 'object' && data['rim-width'].length) {
      url += 'rim-width' + '=' + data['rim-width'].join(',') + '/'
  }

  if (typeof data['rim-offset-range'] === 'object' && data['rim-offset-range'].length) {
      url += 'rim-offset-range' + '=' + data['rim-offset-range'].join(',') + '/'
  }

  if (typeof data['brand'] === 'object' && data['brand'].length) {
      url += 'brand' + '=' + data['brand'].join(',') + '/'
  }

  if (typeof data['sort'] !== 'undefined' && data['sort'] !== '') {
      url += 'sort' + '=' + data['sort'] + '/'
  }

  $.ajax({
      url,
      type: 'GET',
      dataType: 'json',
      beforeSend: function() {
      },
      success: function (response) {
          handleFilterResponse(response);
          if (isPushState) {
              window.history.pushState({type: 'catalog', data}, 'aaaaa', url);
          }
      }
  })
}

function handleFilterResponse(response) {
  $('title').text(response.meta.title)
  $('.js-wrap-items').html(response.html.items)
  $('.js-showing').html(response.html.showing)
  $('.pagination').html(response.html.pagination)
  $('.js-list-rim-diameter').html(response.filter.rim_diameter)
  $('.js-list-rim-width').html(response.filter.rim_width)
  $('.js-list-rim-offset-range').html(response.filter.rim_offset_range)
  $('.js-list-brand').html(response.filter.brand)

  toggleClearAllActiveFiltersBtn()
  activeFiltersToggleMoreOptions()
}

let btnShowMore = `<p class="sHow js-btn-show-more">
                    <span class="plus">+</span>
                    <span class="showPlus">Show {nb} More</span>
                  </p>`

let btnShowLess = `<p class="sHow js-btn-show-less">
                    <span class="plus">-</span>
                    <span class="showPlus">Show Less</span>
                  </p>`

function activeFiltersToggleMoreOptions() {
  $('.js-active-filter').each(function () {
      let list = $(this)

      if ($(this).attr('data-hide') == '1' && $('li', $(this)).length > $(this).data('limit')) {
          $('.js-btn-show-more', list).remove()
          list.append(btnShowMore.replace('{nb}', $('li', list).length - list.data('limit')))

          $('li', $(this)).each(function (i) {
              if (i+1 <= list.attr('data-limit')) {
                  $(this).removeClass('hidden')
              } else {
                  $(this).addClass('hidden')
              }
          })
      } else if ($(this).attr('data-hide') == '0' && $('li', $(this)).length > $(this).data('limit')) {
          $('.js-btn-show-more', list).remove()
          $('.js-btn-show-less', list).remove()
          list.append(btnShowLess.replace('{nb}', $('li', list).length - list.data('limit')))
      }
  })
}

function toggleClearAllActiveFiltersBtn() {
  if ($('.js-active-filter input:checked').length) {
      $('.js-clear-active-filters').removeClass('hidden')
  } else {
      $('.js-clear-active-filters').addClass('hidden')
  }
}

function toggleClearCarFiltersBtn() {
  if ($('input[name="year"]').val() !== '') {
      $('.js-clear-car-filters').removeClass('hidden')
  } else {
      $('.js-clear-car-filters').addClass('hidden')
  }
}

$(function() {

  $(window).on('popstate', function(event) {
      const data = event.originalEvent.state;
      sendFilterRequestToServer(data, false)
  });

  $('body').on('click', '.js-check-price', function (e) {
      e.preventDefault()
      $(this).closest('.card__price').find('.dropdownInCard').removeClass('dropdownInCard--hidden')
  })

  $('body').on('mouseleave', '.card__price', function (e) {
      e.preventDefault()
      $(this).find('.dropdownInCard').addClass('dropdownInCard--hidden')
  })

  $('body').on('click', '.dropChecks .dropChecks__button', function (e) {
      e.preventDefault()
      $('.dropChecks__lists', $(this).closest('.dropChecks')).toggleClass('dropChecks__listsHidden')
  })

  $('body').on('click', '.js-clear-active-filters', function (e) {
      e.preventDefault()
      let wrap = $(this).closest('.active__filters')
      $('input[type="checkbox"]', wrap).prop('checked', false)
      $('.js-clear-active-filters').addClass('hidden')
      sendFilterRequest()
  })

  $('body').on('click', '.js-clear-car-filters', function (e) {
      e.preventDefault()
      onSelectYear('')
      $('input[name="year"]').val('')
      $('.js-select-year-title').text('Select Year')

      $('.js-clear-car-filters').addClass('hidden')
      sendFilterRequest()
  })

  $('body').on('click', '.js-btn-show-more', function () {
      let list = $(this).closest('.js-active-filter')
      list.attr('data-hide', 0)
      $('li', list).removeClass('hidden')

      list.append(btnShowLess)
      $(this).remove()
  })

  $('body').on('click', '.js-btn-show-less', function () {
      let btnShowMore = `<p class="sHow js-btn-show-more">
                    <span class="plus">+</span>
                    <span class="showPlus">Show {nb} More</span>
                  </p>`

      let list = $(this).closest('.js-active-filter')
      list.attr('data-hide', 1)

      $('.js-btn-show-more', list).remove()
      list.append(btnShowMore.replace('{nb}', $('li', list).length - list.data('limit')))

      $('li', list).each(function (i) {
          if (i+1 <= list.attr('data-limit')) {
              $(this).removeClass('hidden')
          } else {
              $(this).addClass('hidden')
          }
      })

      $(this).remove()
  })

  $('.dropdown__list-item.active').each(function () {
      $(this).closest('.dropdown').find('.dropdown__button').text($(this).text())
  })

  $('body').on('change', '.js-active-filter input', function () {
      toggleClearAllActiveFiltersBtn()
      sendFilterRequest()
  })

  toggleClearAllActiveFiltersBtn()
  toggleClearCarFiltersBtn()
  activeFiltersToggleMoreOptions()

  // open dropdown by clicking
  $('body').on('click', '.dropdown__button', function () {
      let list = $(this).closest('.form__group').find('.dropdown__list')
      let arrow = $(this).next('.dropdown__arrow')
      list.toggleClass('dropdown__list--visible')
      arrow.toggleClass('dropdown__arrow180')
      $(this).toggleClass('dropdown__button--active')
  })

  // click on item dropdown
  $('body').on('click', '.dropdown__list-item', function (e){
      e.preventDefault()
      let btn = $(this).closest('.dropdown').find('.dropdown__button')
      let input = $(this).closest('.dropdown').find('.dropdown__input-hidden')
      btn.text($(this).text())
      btn.focus()
      input.val($(this).attr('data-value'))
  })


  // maindropDowns =======================================================================================
  document.querySelectorAll('.dropdown').forEach(function (dropDownWrapper) {
      const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
      const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
      const dropDownArrow = dropDownWrapper.querySelector('.dropdown__arrow');

      const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
      const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');
      const dropDownBtnAside = document.querySelector('.filtersAside');
      const dropFilters = document.querySelector('.main__siteBar');
      const buttonMoreFoкOnePageInFooter = document.querySelector('#button');
      const moreInfoPage1 = document.querySelector('#content');


      // Show more button in the footer
      buttonMoreFoкOnePageInFooter.addEventListener('click', function () {
          moreInfoPage1.classList.toggle('content__hidden');
          if (moreInfoPage1.classList.contains('content__hidden')) {
              buttonMoreFoкOnePageInFooter.textContent = 'More'
          } else {
              buttonMoreFoкOnePageInFooter.textContent = 'Less';
          }
      })

      // clicking outside the list closes it
      document.addEventListener('click', function (e) {
          if (e.target !== dropDownBtn) {
              dropDownBtn.classList.remove('dropdown__button--active');
              dropDownList.classList.remove('dropdown__list--visible');
              dropDownArrow.classList.remove('dropdown__arrow180');
          }
      })

  });

  // button show more/less is footer==================================================================================
  document.querySelectorAll('.dropdown2').forEach(function (dropDownWrapper) {
      const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
      const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
      const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
      const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');
      const dropDownBtnAside = document.querySelector('.menuFilters');
      const dropFilters = document.querySelector('.main__siteBar');
      const buttonMoreFoкOnePageInFooter = document.querySelector('#button');
      const moreInfoPage1 = document.querySelector('#content');


      buttonMoreFoкOnePageInFooter.addEventListener('click', function () {
          moreInfoPage1.classList.toggle('content__hidden');
          if (moreInfoPage1.classList.contains('content__hidden')) {
              buttonMoreFoкOnePageInFooter.textContent = 'More'
          } else {
              buttonMoreFoкOnePageInFooter.textContent = 'Less';
          }
      })



      // open\close the drop-down list by clicking on it
      dropDownBtn.addEventListener('click', function () {
          dropDownList.classList.toggle('dropdown__list--visible');
          this.classList.add('.dropdown__button--active');
      });


      //opening\closing the sitebar for mobile devices
      dropDownBtnAside.addEventListener('click', function () {
          dropFilters.classList.toggle('main__siteBar--active');
          this.classList.add('.main__siteBar--active');
      });


      // selecting an element from the list and remembering the value + closing the list after selection
      dropDownListItems.forEach(function (listItem) {
          listItem.addEventListener('click', function (e) {
              e.stopPropagation();
              dropDownBtn.innerText = this.innerText;
              dropDownBtn.focus();
              dropDownInput.value = this.dataset.value;
              dropDownList.classList.remove('dropdown__list--visible');
          })
      });


      // clicking outside the list closes it
      document.addEventListener('click', function (e) {
          if (e.target !== dropDownBtn) {
              dropDownBtn.classList.remove('dropdown__button--active');
              dropDownList.classList.remove('dropdown__list--visible');

          }
      })

      // close the active list by clicking ESC and Tab
      document.addEventListener('keydown', function (e) {
          if (e.key === 'Tab' || e.key === 'Escape') {
              dropDownBtn.classList.remove('dropdown__button--active');
              dropDownList.classList.remove('dropdown__list--visible');
          }
      })
  });

  // dropdown lists with checkboxes
  document.querySelectorAll('.dropsWithCheck').forEach(function (dropDownWrapperCheck) {
      const dropDownBtnCheck = dropDownWrapperCheck.querySelector('.dropChecks__button');
      const dropChecksLists = dropDownWrapperCheck.querySelector('.dropChecks__lists');

      // open\close the drop-down list by clicking on it
      dropDownBtnCheck.addEventListener('click', function () {
          dropChecksLists.classList.toggle('');
      })
  })
});
