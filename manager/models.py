from django.db import models

class bookings(models.Model):
  date_of_booking = models.DateField(auto_now=True)
  room = models.IntegerField(default=0, blank=False)
  date_of_residence = models.CharField(max_length=30)
  amount_of_residents = models.IntegerField(default=0, blank=False)
  phone_number = models.IntegerField(default=0, blank=False)

class dates_of_rooms(models.Model):
  rooms = models.JSONField(default='{}')

class prices(models.Model):
  prices = models.JSONField(default='{}')