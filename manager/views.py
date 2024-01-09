from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponse
import json
from datetime import date as d
# ---
from .models import *


login = False
password = '33330'

def create_initial_prices():
  if prices.objects.first():
    print('OK')
  else:
    print('CREATING ...')
    initial_price = 2000
    initial_json_data = {
      1: initial_price,
      2: initial_price,
      3: initial_price,
      4: initial_price,
      5: initial_price,
      6: initial_price,
      7: initial_price,
      8: initial_price,
    }
    prices.objects.create(prices = initial_json_data)

class managerView(View):
  def get(self, request):
    global login, password
    if (request.headers.get('PASSWORDCHECKING') == password):
      login = True
      return HttpResponse('OK')
    elif (request.headers.get('SELECTED-DATES')):
      try:
        # Проверка на уже прошедшие даты
        dates_from_base = json.loads(json.dumps(dates_of_rooms.objects.first().rooms))
        # print(f'input: {dates_from_base}')
        final_dates = {}
        for element in dates_from_base:
          final_dates[str(element)] = ''
          dates = dates_from_base[element].split(',')
          if (dates[0] != ''):
            current_final_dates = []
            for date in dates:
              numbers_of_date = date.split('-')
              if( d(int(numbers_of_date[0]), int(numbers_of_date[1]), int(numbers_of_date[2])) >= d.today()):
                current_final_dates.append(date)
            final_dates[str(element)] = ','.join(current_final_dates)
        # print(f'output: {final_dates}')
        # Сохранение отфильтрованных дат
        current_dates_from_base = dates_of_rooms.objects.first()
        current_dates_from_base.rooms = final_dates
        current_dates_from_base.save()
        return HttpResponse(json.dumps(final_dates))
      except:
        return HttpResponse('NO DATES')
    elif (login):
      login = False
      create_initial_prices()
      return render(request, 'manager/templates/manager.html', {
        'bookings': bookings.objects.order_by('date_of_booking')[::-1],
        'prices': prices.objects.first().prices
      })
    else:
      return render(request, 'manager/templates/password.html', {})
    
  def post(self, request):
    if (request.headers.get('SAVE-DATES')):
      # Добавление дат в базу данных
      try:
        date = dates_of_rooms.objects.first()
        date.rooms = json.loads(request.body)['dates']
        date.save()
      except:
        dates_of_rooms.objects.create(rooms = json.loads(request.body)['dates'])
      # Сохранение цен
      data_of_prices = prices.objects.first()
      data_of_prices.prices = json.loads(request.body)['prices']
      data_of_prices.save()  
      return HttpResponse('OK')
