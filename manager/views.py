from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponse
import json
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
        print(dates_of_rooms.objects.first().rooms)
        return HttpResponse(json.dumps(dates_of_rooms.objects.first().rooms))
      except:
        print('NO DATES')
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
      try:
        date = dates_of_rooms.objects.first()
        date.rooms = json.loads(request.body)
        date.save()
      except:
        dates_of_rooms.objects.create(rooms = json.loads(request.body))
      return HttpResponse('OK')
