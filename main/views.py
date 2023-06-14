from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponse
from manager.models import *
import json
import os

class mainView(View):
  def get(self, request):
    if (request.headers.get('SELECTED-DATES')):
      try:
        return HttpResponse(json.dumps(dates_of_rooms.objects.first().rooms))
      except:
        return HttpResponse('NO DATES')
    return render(request, 'main/templates/index.html', {})
  
  def post(self, requset):
    if (requset.headers.get('POST-BOOKING')):
      descriptions_of_booking = json.loads(requset.body)
      bookings.objects.create(
        room = descriptions_of_booking['room'],
        date_of_residence = descriptions_of_booking['date_of_residence'],
        amount_of_residents = descriptions_of_booking['amount_of_residents'],
        phone_number = descriptions_of_booking['phone_number'],
      )
      
      os.system(f'python {os.getcwd()}/main/static/mail.py') # на ubuntu-сервере вместо \ пишется /
      return HttpResponse('OK')