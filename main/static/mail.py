import smtplib
from datetime import datetime
from email.mime.text import MIMEText

url = 'https://9a25-46-63-140-169.ngrok-free.app'
current_time = str(datetime.now())[0:16]

email_address = '000postoffice@gmail.com'
google_password = 'lmkdkfzjllpcaqwu'
email_password = '1A2b3c40.'
sender = 'coval2003@yandex.ru'

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login(email_address, google_password)
letter = MIMEText(f'({current_time}) Здравствуйте. Вам пришла заявка на новое бронирование \n Проверьте: {url}/manager/')
letter['Subject'] = 'New booking'
server.sendmail(email_address, sender, letter.as_string())
print('email has been sent')
