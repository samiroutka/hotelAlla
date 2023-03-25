
// Создание полосок сверху
let roomStripes = document.querySelectorAll('.roomStripes')
for (let roomStripe of roomStripes){
  for (let element of roomStripe.parentElement.querySelectorAll('img')){
    element.parentElement.parentElement.querySelector('.roomStripes').append(document.createElement('div'))
  }
  roomStripe.firstChild.classList.add('selected')
}

// работа слайдера
document.addEventListener('click', (event) => {
  if (event.target.closest('.enlarge') && event.target.closest('.roomSlider')){
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

// Открытие room
document.addEventListener('click', (event) => {
  let currentRoom = event.target.closest('.room')
  if (currentRoom && !document.querySelector('.enlarge')){
    currentRoom.classList.add('enlarge')
  } else if (event.target.closest('.enlarge') && !event.target.closest('.roomSlider')){
    currentRoom.classList.remove('enlarge')
    currentRoom.querySelector('.roomImages').style.transform = 'translateX(0)'
    for (let roomStripe of document.querySelectorAll('.roomStripes')){
      for (let element of roomStripe.children){
        element.classList.remove('selected')
      }
      roomStripe.firstChild.classList.add('selected')
    }
  }
})

