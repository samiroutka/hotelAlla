from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponse
import json
from datetime import date as d
# ---
from .models import *


login = False
password = 'allaroma'

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
      return render(request, 'manager/templates/manager.html', {
        'bookings': bookings.objects.order_by('date_of_booking')[::-1]
      })
    else:
      return render(request, 'manager/templates/password.html', {})
    
  def post(self, request):
    if (request.headers.get('SAVE-DATES')):
      # Добавление дат в базу данных
      try:
        date = dates_of_rooms.objects.first()
        date.rooms = json.loads(request.body)
        date.save()
      except:
        dates_of_rooms.objects.create(rooms = json.loads(request.body))
      return HttpResponse('OK')
