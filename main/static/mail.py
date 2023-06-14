import smtplib
from datetime import datetime
from email.mime.text import MIMEText

url = 'hotel-alla.ru'
current_time = str(datetime.now())[5:16].replace('-', '.')

email_address = '000postoffice@gmail.com'
google_password = 'lmkdkfzjllpcaqwu'
email_password = '1A2b3c40.'
sender = 'coval2003@yandex.ru'

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login(email_address, google_password)
letter = MIMEText(f'{current_time}\nЗдравствуйте. Вам пришла заявка на новое бронирование\n{url}/manager/')
letter['Subject'] = 'Заявка на бронирование'
server.sendmail(email_address, sender, letter.as_string())
print('email has been sent')
