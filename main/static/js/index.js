
let url = document.location.href
let token = document.querySelector('[name=csrfmiddlewaretoken]').value

// Предзагрузка
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelector('.preloading').style.display = 'none'
    document.querySelector('.wrapper').style.display = 'block'
  }, 1000);
})

// Создание полосок сверху
let roomStripes = document.querySelectorAll('.roomStripes')
for (let roomStripe of roomStripes){
  for (let element of roomStripe.parentElement.querySelectorAll('img')){
    element.parentElement.parentElement.querySelector('.roomStripes').append(document.createElement('div'))
  }
  roomStripe.firstChild.classList.add('selected')
}

// работа слайдера (типо insta)
let transitionDuration = getComputedStyle(document.querySelector('.room').children[0])['transitionDuration']
let testOfDuration = false // проверка на завершение анимации room
let moveTest = true
document.addEventListener('click', (event) => {
  if (testOfDuration && event.target.closest('.enlarge') && event.target.closest('.roomImages')){
    let currentTransform = parseInt(event.target.closest('.roomImages').style.transform.slice(11, -1)) ?
    parseInt(event.target.closest('.roomImages').style.transform.slice(11, -1)) : 0 
    // лево
    if (event.clientX-Math.round(event.target.closest('.roomSlider').getBoundingClientRect()['x'])
    < event.target.closest('.roomSlider').offsetWidth/2){
      if (currentTransform != 0){
        currentTransform = currentTransform+event.target.closest('.roomImage').offsetWidth
        event.target.closest('.roomImages').style.transform = `translateX(${currentTransform}px)`
      }
    // право
    } else {
      if (currentTransform != -(event.target.closest('.roomImage').offsetWidth)*((event.target.closest('.roomImages').children).length-1)){
        currentTransform = currentTransform-event.target.closest('.roomImage').offsetWidth
        event.target.closest('.roomImages').style.transform = `translateX(${currentTransform}px)`
      }
    }
    // обработка полос сверху
    let currentImage = (-currentTransform / event.target.closest('.roomImage').offsetWidth)
    for (let element of event.target.closest('.roomSlider').querySelector('.roomStripes').children){
      element.classList.remove('selected')
    }
    event.target.closest('.roomSlider').querySelector('.roomStripes').children[currentImage].classList.add('selected')
  }
})
// перетаскивания номеров с помощью мыши (.rooms)
let roomsElement = document.querySelector('.rooms')
let startCoordinateX = 0
let scrollTest = false
let roomsElementCurrentScroll = 0
roomsElement.addEventListener('mousedown', (event) => {
  if (!event.target.closest('.room')){
    scrollTest = true
    startCoordinateX = event.clientX
  }
})
roomsElement.addEventListener('mousemove', (event) => {
  if (scrollTest){
    roomsElement.scrollLeft = roomsElementCurrentScroll + (startCoordinateX - event.clientX)
    moveTest = false
  }
})
roomsElement.addEventListener('mouseup', (event) => {
  scrollTest = false
  roomsElementCurrentScroll = roomsElement.scrollLeft
  setTimeout(() => {
    moveTest = true
  }, 10);
})



function resetRoom(node) {
  node.querySelector('.roomImages').style.transform = 'translateX(0)'
  for (let element of node.querySelector('.roomStripes').children){
    element.classList.remove('selected')
  }
  node.querySelector('.roomStripes').firstChild.classList.add('selected')
}
function enlargeRoom(node){
  testOfDuration = false
  node.classList.add('enlarge')
  setTimeout(() => {
    testOfDuration = true
    node.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
  }, parseFloat(transitionDuration)*1000);
}
// Открытие room
document.addEventListener('click', (event) => {
  let currentRoom = event.target.closest('.room')
  if (currentRoom && moveTest){
    if (!document.querySelector('.enlarge')){
      enlargeRoom(currentRoom)
    } else if (document.querySelector('.enlarge') && !currentRoom.classList.contains('enlarge')) {
      resetRoom(document.querySelector('.enlarge'))
      document.querySelector('.enlarge').classList.remove('enlarge')
      enlargeRoom(currentRoom)
    } else if (event.target.closest('.enlarge') && !event.target.closest('.roomSlider')){
      currentRoom.classList.remove('enlarge')
      resetRoom(currentRoom)
    }
  }
})

// Календарь (main .booking)
let calendar = new AirDatepicker('.calendar', {
  minDate: new Date('2023-03-27'),
  isMobile: true,
  autoClose: true,
  autoClose: false,
  range: true,
  multipleDatesSeparator: ' - ',
  onRenderCell({date, cellType}){
    if (cellType == 'day') { // проверяем тип ячейки
      if ( ((date.getMonth()+1) == 7) && ([3,7,8,9].indexOf(date.getDate()) != -1) ){
        return {disabled:true}
      }
    }
  }
})

// При resize окна
document.addEventListener('resize', () => {
  let enlargeRoomElement = document.querySelector('.enlarge')
  if (enlargeRoomElement) {
    resetRoom(enlargeRoomElement)
    setTimeout(() => {
      enlargeRoomElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
    }, parseFloat(transitionDuration)*1000);  }
})

// Запрашивание звонка
let bookingBtn = document.querySelector('.booking__submit')
bookingBtn.addEventListener('click', () => {
  let room = document.querySelector('.booking__room select').value
  let date_of_residence = document.querySelector('.booking__dates input').value
  let amount_of_residents = document.querySelector('.booking__people select').value
  let phone_number = document.querySelector('.booking__phone input').value
  if (room && date_of_residence && amount_of_residents && phone_number){
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
  } else{
    alert('заполните все поля')
  }
})

