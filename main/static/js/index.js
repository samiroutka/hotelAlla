
// Открытие room

document.addEventListener('click', (event) => {
  if (event.target.closest('.room') && !document.querySelector('.enlarge')){
    event.target.closest('.room').classList.add('enlarge')
  } else if (event.target.closest('.enlarge')){
    event.target.closest('.room').classList.remove('enlarge')
  }
})

//
