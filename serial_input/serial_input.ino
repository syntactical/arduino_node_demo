// digital pin 2 has a pushbutton attached to it. Give it a name:
int pushButton = 2;
int previousButtonState;

void setup() {
  Serial.begin(9600);
  
  pinMode(pushButton, INPUT);
  int previousButtonState = digitalRead(pushButton);
}

void loop() {
  int buttonState = digitalRead(pushButton);
  
  if (previousButtonState != buttonState) {
    previousButtonState = buttonState;
    Serial.println(buttonState);
  }
  
  delay(1);
}



