
let url = document.location.href
let token = document.querySelector('[name=csrfmiddlewaretoken]').value

// Клик по навигации
document.addEventListener('click', (event) => {
  if (event.target.closest('.nav__bookings')){
    document.querySelector('.bookings').classList.remove('hidden')
    document.querySelector('.base').classList.add('hidden')
  } else if (event.target.closest('.nav__base')){
    document.querySelector('.bookings').classList.add('hidden')
    document.querySelector('.base').classList.remove('hidden')
  }
})

// Календари
async function mainCalendar() { 
  // Загрузка дат из базы
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
  let djangoSelectedDates = await getSelectedDates()
  
  // Установление дат для всех календарей 
  let calendarElements = document.querySelectorAll('.calendar')
  let calendars = []
  let current_date = new Date().toLocaleDateString().split('.').reverse().join('-')
  let next_date = String(parseInt(current_date.split('-')[0])+1)+current_date.slice(4,current_date.length) // плюс год к current_date
  for (let element of calendarElements){
    let calendarSelectedDates = []
    if (djangoSelectedDates){
      for (let element of djangoSelectedDates[calendars.length].split(',')){
        calendarSelectedDates.push(new Date(element))
      }
    }
    let calendar = new AirDatepicker(element, {
      multipleDates: true,
      inline: true,
      selectedDates: calendarSelectedDates,
      minDate: current_date,
      maxDate: next_date,
    })
    calendars.push(calendar)
  }

  // Сохранение дат
  function getDates(element) {
    raw_result = element.$el.value.replaceAll(' ', '').split(',')
    result = []
    for (let element of raw_result){
      result.push(element.split('.').reverse().join('-'))
    }
    return result.join(',')
  }
  let save_button = document.querySelector('.save')
  save_button.addEventListener('click', () => {
    let dates = {}
    for (let calendar of calendars){
      dates[String(calendars.indexOf(calendar))] = getDates(calendar)
    }
    
    async function saveDates(){
      let response = await fetch(url, {
        method: 'post',
        headers: {
          'X-CSRFToken': token,
          'SAVE-DATES': 'TRUE'
        },
        body: JSON.stringify(dates) 
      })
      response = await response.text()
      if (response != 'OK'){
        console.log('ERROR: Save dates')
      }
    }
    saveDates()
    // Показ менюшки
    let saveMenu = document.querySelector('.saveMenu')
    saveMenu.classList.remove('hidden')
    setTimeout(() => {
      saveMenu.classList.add('hidden')
    }, 2000);
  })
  
}
mainCalendar()
