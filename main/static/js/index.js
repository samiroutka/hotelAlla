
let url = document.location.href
let token = document.querySelector('[name=csrfmiddlewaretoken]').value

// Предзагрузка----------------------------------------
let test_element = document.querySelector('.title')
window.addEventListener('load', () => {
  document.querySelector('.preloading').style.display = 'none'
  document.querySelector('.wrapper').style.display = 'block'
})

// Swiper
new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination",
    type: "progressbar",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// Плавное появление номеров
let all_rooms = document.querySelectorAll('.room')
let i = 0
let observer = new IntersectionObserver((entries) => {
  for (entry of entries) {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1
      entry.target.style.transform = 'translateX(0)'
      observer.unobserve(entry.target)
    }
  }
}, {threshold: .6})

for (room of all_rooms) {
  observer.observe(room)
}

// Очищение полей формы
let bookingBtn = document.querySelector('.booking__submit')
function clearFields() { 
  document.querySelector('.booking__room select').value = ''
  document.querySelector('.booking__dates input').value = ''
  document.querySelector('.booking__dates input').setAttribute('disabled', 'true') // установление неактивности на даты
  document.querySelector('.booking__people select').value = ''
  document.querySelector('.booking__phone input').value = ''
}
clearFields()

// Календарь (main .booking)------------------------------------
async function mainCalendar(){
  // Получение дат из с сервера/базы данных
  async function getSelectedDates() {
    let response = await fetch(url, {
      headers: {
        'SELECTED-DATES': 'TRUE'
      }
    })
    try{
      return await response.json()
    } 
    catch{
      return false
    }
  }
  let disabledDates = await getSelectedDates()

  let current_date = new Date().toLocaleDateString().split('.').reverse().join('-')
  let next_date = String(parseInt(current_date.split('-')[0])+1)+current_date.slice(4,current_date.length)
  let calendar = new AirDatepicker('.calendar', {
    minDate: current_date,
    maxDate: next_date,
    isMobile: true,
    autoClose: false,
    range: true,
    multipleDatesSeparator: ' - ',
    // Установка заблокированных дат в календаре
    onRenderCell: ({date, cellType}) => {
      if (cellType == 'day') {
        if (document.querySelector('#room').value){
          if (disabledDates[parseInt(document.querySelector('#room').value)-1]
          .includes(date.toLocaleDateString().split('.').reverse().join('-'))){
            return {disabled: true}
          }
        }
      }
    },
    // Проверка входят ли заблокированные даты в диапазон дат
    onSelect: ({date}) => {
      if (date[0] && date[1]){
        let startDate = new Date(date[0].toLocaleDateString().split('.').reverse().join('-'))
        let endDate = new Date(date[1].toLocaleDateString().split('.').reverse().join('-'))
        endDate.setDate(endDate.getDate() - 1)
        let datesRange = []
        while (startDate.toLocaleDateString() != endDate.toLocaleDateString()){
          startDate.setDate(startDate.getDate() + 1)
          datesRange.push(startDate.toLocaleDateString().split('.').reverse().join('-'))
        }
        let currentDisabledDates = disabledDates[parseInt(document.querySelector('#room').value)-1].split(',')
        if (datesRange.concat(currentDisabledDates).length 
        != new Set(datesRange.concat(currentDisabledDates)).size){
          calendar.clear()
        }
      }
    }
  })

  // Очистка полей при смене/выборе номера
  let room = document.querySelector('.booking__room select')
  let roomBeds = {
    1: [1, 2, 3],
    2: [1, 2, 3],
    3: [1, 2],
    4: [1, 2],
    5: [1, 2],
    6: [1, 2, 3],
    7: [1, 2],
    8: [1, 2, 3],
  }
  room.addEventListener('change', () => {
    if (room.value){
      document.querySelector('.booking__dates input').removeAttribute('disabled')
      document.querySelector('.booking__dates input').value = ''
      // Изменение поля "количество человек"
      document.querySelector('.booking__people select').removeAttribute('disabled')
      document.querySelector('.booking__people select').value = ''
      for (let element of document.querySelectorAll('#people option')){
        element.setAttribute('hidden', '')
      }
      for (let element of roomBeds[document.querySelector('#room').value]){
        document.querySelector(`#people option[value="${element}"]`).removeAttribute('hidden')
      }
      calendar.clear()
    }
  })
}
mainCalendar()

// Запрашивание звонка
bookingBtn.addEventListener('click', () => {
  // Проверка на заполнение всех полей
  let room = document.querySelector('.booking__room select').value
  let date_of_residence = document.querySelector('.booking__dates input').value
  let amount_of_residents = document.querySelector('.booking__people select').value
  let phone_number = document.querySelector('.booking__phone input').value
  if (room && date_of_residence && amount_of_residents && phone_number){
    // Открытие диалогового окна (popUpMenu)
    let popUpMenu = document.querySelector('.popUpMenu')
    popUpMenu.classList.remove('hidden')
    setTimeout(() => {
      popUpMenu.classList.add('hidden')
    }, parseFloat(getComputedStyle(popUpMenu)['animationDuration'])*1000);
    // Отправка данных на сервер/к менеджеру
    async function postBooking(){
      let response = await fetch(url, {
        method: 'post',
        headers: {
          'X-CSRFToken': token,
          'POST-BOOKING': 'TRUE'
        },
        body: JSON.stringify({
          'room': room,
          'date_of_residence': date_of_residence,
          'amount_of_residents': amount_of_residents,
          'phone_number': phone_number,
        })
      })
      response = await response.text()
      if (response != 'OK'){
        console.log('Error: postBooking')
      }
    }
    postBooking()
    clearFields()
  } else{
    let fieldsMenu = document.querySelector('.fieldsMenu')
    fieldsMenu.classList.remove('hidden')
    setTimeout(() => {
      fieldsMenu.classList.add('hidden')
    }, parseFloat(getComputedStyle(fieldsMenu)['animationDuration'])*1000);
  }
})
