
// window.addEventListener('load', () => {
  // document.querySelector('body').style.display = 'block'    
// })

$(document).ready(() => {
  setTimeout(() => {
    document.querySelector('.preloading').style.display = 'none'
    document.querySelector('.wrapper').style.display = 'block'
  }, 2000);
})

// Создание полосок сверху
let roomStripes = document.querySelectorAll('.roomStripes')
for (let roomStripe of roomStripes){
  for (let element of roomStripe.parentElement.querySelectorAll('img')){
    element.parentElement.parentElement.querySelector('.roomStripes').append(document.createElement('div'))
  }
  roomStripe.firstChild.classList.add('selected')
}

// работа слайдера
let transitionDuration = getComputedStyle(document.querySelector('.room').children[0])['transitionDuration']
let testOfDuration = false // проверка на завершение анимации room
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
  if (currentRoom){
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

$('.slider').slick({
  infinite: false,
  dots: true,
})
