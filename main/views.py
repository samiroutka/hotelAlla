from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponse
from manager.models import *
import json
import os

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

class mainView(View):
  def get(self, request):
    create_initial_prices()
    if (request.headers.get('SELECTED-DATES')):
      try:
        return HttpResponse(json.dumps(dates_of_rooms.objects.first().rooms))
      except:
        return HttpResponse('NO DATES')
    return render(request, 'main/templates/index.html', {
      'prices': prices.objects.first().prices
    })
  
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