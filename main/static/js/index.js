
// Открытие room

document.addEventListener('click', (event) => {
  let currentRoom = event.target.closest('.room')
  if (currentRoom && !document.querySelector('.enlarge')){
    currentRoom.classList.add('enlarge')
  } else if (event.target.closest('.enlarge') && !event.target.closest('.roomSlider')){
    currentRoom.classList.remove('enlarge')
    currentRoom.querySelector('.roomImages').style.transform = 'translateX(0)'
  }
})

// работа слайдера
document.addEventListener('click', (event) => {
  if (event.target.tagName == 'BUTTON'){
    // -----------
    let currentRoomImages = event.target.parentNode.querySelector('.roomImages')
    let currentTransform = getComputedStyle(currentRoomImages).transform
    if (currentTransform == 'none'){
      currentTransform = 0
    } else {
      currentTransform = parseInt(currentTransform.split(',')[4])
    }
    // -----------
    if (event.target.classList.contains('sliderLeft')){
      if ((-currentRoomImages.children[0].width)*((currentRoomImages.children).length-1)
      == currentTransform){
        currentRoomImages.style.transform = `translateX(0)`
      } else {
        currentRoomImages.style.transform = `translateX(${currentTransform-currentRoomImages.children[0].width}px)`
      }
    } else if (event.target.classList.contains('sliderRight')){
      currentRoomImages.style.transform = `translateX(${currentTransform+currentRoomImages.children[0].width}px)`
    }
  }
})