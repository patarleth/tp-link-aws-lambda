# tp-link-aws-lambda
toggle tp link switch on/off using aws lamba

buy and setup one of these

  https://aws.amazon.com/iot/

Clone this repo, npm install, then zip up the folder with node_modules, 
upload over the default lambda function created when you setup the button.
set two environment variables for your lambda funcction

  TP_DEVICE_ID=8006EF4......
  TP_TOKEN=d2db23.....

(you are on your own to figure out how to get your deviceId and token, Google is your friend)
Finally, click the button and watch the light turn on and off
