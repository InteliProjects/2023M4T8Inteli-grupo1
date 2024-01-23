//Inclui a biblioteca do Arduino
#include <Arduino.h>

//Definição da classe "Monitoramento de caminho"
class PathMonitor {
//Definindo os argumentos da classe, que são os pinos dos componentes.
public:
  PathMonitor(int ledStatusPin, int rAlertPin, int gAlertPin, int bAlertPin,
              int statusButtonPin, int dataButtonPin, int rightWayButtonPin, int wrongWayButtonPin)
      : ledStatusPin(ledStatusPin),
        rAlertPin(rAlertPin),
        gAlertPin(gAlertPin),
        bAlertPin(bAlertPin),
        statusButtonPin(statusButtonPin),
        dataButtonPin(dataButtonPin),
        rightWayButtonPin(rightWayButtonPin),
        wrongWayButtonPin(wrongWayButtonPin) {
    //Configurando a pinagem diferenciando os inputs e outputs.
    pinMode(ledStatusPin, OUTPUT);
    pinMode(rAlertPin, OUTPUT);
    pinMode(gAlertPin, OUTPUT);
    pinMode(bAlertPin, OUTPUT);
    pinMode(statusButtonPin, INPUT_PULLUP);
    pinMode(dataButtonPin, INPUT_PULLUP);
    pinMode(rightWayButtonPin, INPUT_PULLUP);
    pinMode(wrongWayButtonPin, INPUT_PULLUP);
  }

  //Iniciando a biblioteca Serial
  void initialize() {
    Serial.begin(115200);
  }
  
  /* De modo geral, nosso protótipo tem uma missão: monitorar se o 
  ativo está seguindo o caminho certo ou se está sendo extraviado. Para 
  simular o funcionamento desse protótipo, foi defininda essa função que
  cria uma maquina de estado, mudando de acordo com as entradas. 

  Antes de qualquer coisa, as coordenadas precisam ser informadas a fim
  de que o monitoramento se torne possível. No circuito, o que simula
  o envio desses dados é o botão cinza. Caso ele não seja apertado, não é
  possível ligar o monitoramento.

  Após o botão cinza ser apertado e as coordenadas serem salvas, o monito-
  ramento ganha a possibilidade de ser habilitado. Para ligá-lo, é só apertar
  o botão amarelo, que acenderá o LED vermelho indicando que a vigilância está ativada.
  Durante esse período, a cada 10 segundos, aparecerá a seguinte pergunta
  no terminal: "O caminho está correto?"

  Para responder essa pergunta, é possível clicar no botão verde sinalizando
  que está tudo certo, ou no botão vermelho, indicando que o ativo está seguindo 
  por um caminho estranho. Isso é para simular a chegada dos dados de localização
  do ativo e a checagem. Caso o botão verde seja apertado, o monitoramento conti-
  nua e segue conferindo o caminho a cada 10 segundos. Todavia, se o botão verme-
  lho for apertado, o monitoramento é interrompido imediatamente (desligando o LED
  vermelho), ligando o LED RGB em forma de sirene - alternando entre as luzes verme-
  lha e azul - e printando no terminal "O ativo foi extraviado!!!"

  Caso não haja problemas no caminho, é possível desativar o monitoramento só
  clicando novamente no botão amarelo.

  Para isso, primeiramente, configuro que as entradas
  partirão dos botões: */

  void run() {
    int statusButtonState = digitalRead(statusButtonPin);
    int dataButtonState = digitalRead(dataButtonPin);
    int rightWayButtonState = digitalRead(rightWayButtonPin);
    int wrongWayButtonState = digitalRead(wrongWayButtonPin);

    //Depois, crio os diferentes estados.
    switch (currentState) {
      // Primeiro estado: Monitorando
      case MONITORING:
        //Se o botão verde foi apertado, ele volta para o estado de verificação
        if (rightWayButtonState == LOW) {
          currentState = WAIT_FOR_ANSWER;
        //Se o botão vermelho foi apertado, ele desliga o monitoramento e vai para
        //o estado de alerta.
        } else if (wrongWayButtonState == LOW) {
          monitoringActive = false;
          digitalWrite(ledStatusPin, LOW);
          wrongWayDetected = true;
          currentState = ALERT;
        //Se ainda não teve entrada de nenhum botão, ele realiza a contagem regressiva
        } else {
          // Contagem regressiva
          unsigned long currentTime = millis();
          unsigned long elapsedTime = currentTime - countdownStartTime;
          int secondsRemaining = (countdownDuration - elapsedTime) / 1000;
          //Se a contagem regrassiva acabou, perguntar se o carminho está certo e mudar o estado
          if (elapsedTime >= countdownDuration) {
            countingDown = false;
            Serial.println("O caminho está correto?");
            currentState = WAIT_FOR_ANSWER;
          } else {
            Serial.print("Aguardando: ");
            Serial.print(secondsRemaining);
            Serial.println(" segundos...");
          }
        }
        break;

      //Segundo estado: Esperando resposta
      /*Esse estado foi feito para realizar o ciclo que vai se repetir até o fim 
      do trajeto ou um caso de extravio */
      case WAIT_FOR_ANSWER:
        //Se o monitoramento está ativado e as coordenas foram recebidas, inicia a verificação
        if (monitoringEnabled && monitoringActive) {
          //Se o caminho está correto, o monitoramento continua e volta para o estado MONITORING,
          //realizando a contagem regressiva.
          if (rightWayButtonState == LOW) {
            countdownStartTime = millis();
            currentState = MONITORING;
          //Se o caminho está errado, ele desliga o monitoramento e liga o estado de ALERT, avisando o extravio.
          } else if (wrongWayButtonState == LOW) {
            monitoringActive = false;
            digitalWrite(ledStatusPin, LOW);
            wrongWayDetected = true;
            currentState = ALERT;
            Serial.println("O ativo foi extraviado!");
          }
        }
        break;

      //Terceiro estado: Alerta!! O Ativo foi extraviado!
      case ALERT:
        // Simula a sirene com um LED RGB alternando entre vermelho e azul
        digitalWrite(gAlertPin, LOW);
        digitalWrite(rAlertPin, HIGH); delay(1000);
        digitalWrite(rAlertPin, LOW);
        digitalWrite(bAlertPin, HIGH);delay(1000);
        digitalWrite(bAlertPin, LOW);

        Serial.println("O ativo foi extraviado!");
        break;

      default:
        break;
    }

    //Checa se o botão de dados das coordenadas foi pressionado. Se sim, habilita a
    //possibilidade do monitoramento.
    if (dataButtonState == LOW) {
      Serial.println("As coordenadas foram recebidas.");
      monitoringEnabled = true;
    }

    //Se o botão amarelo foi pressionado:
    if (statusButtonState == LOW) {
      //Se as coordenadas foram recebidas, liga o monitoramento e o LED.
      if (monitoringEnabled) {
        //liga/desliga o LED
        ledState = !ledState;
        digitalWrite(ledStatusPin, ledState);
        //Se o LED está ligado (o que significa que o monitoramento está ativado),
        //ele muda as variáveis e passa para o estado de MONITORING.
        if (ledState) {
          monitoringActive = true;
          wrongWayDetected = false;
          countingDown = true;
          countdownStartTime = millis();
          currentState = MONITORING;
        //Porém, se o LED foi desligado (e o monitoramento acabou), apagam-se os LEDs
        } else {
          monitoringActive = false;
          countingDown = false;
          digitalWrite(rAlertPin, LOW);
          digitalWrite(gAlertPin, LOW);
          digitalWrite(bAlertPin, LOW);
        }
      //Se as coordenadas não foram recebidas, não é possível ligar o monitoramento.
      } else {
        Serial.println("Não é possível iniciar o monitoramento sem as coordenadas.");
      }
    }
  }

private:
  //Pinagem dos componentes
  int ledStatusPin;
  int rAlertPin;
  int gAlertPin;
  int bAlertPin;
  int statusButtonPin;
  int dataButtonPin;
  int rightWayButtonPin;
  int wrongWayButtonPin;

  //Variáveis de monitoramento
  bool ledState = LOW;
  bool monitoringEnabled = false;
  bool monitoringActive = false;
  bool wrongWayDetected = false;
  bool countingDown = false;
  unsigned long countdownStartTime = 0;
  unsigned long lastMonitoringTime = 0;
  const unsigned long monitoringInterval = 10000;
  const unsigned long countdownDuration = 10000;

  //Estados que foram criados acima
  enum State {
    WAIT_FOR_ANSWER,
    MONITORING,
    ALERT
  };

  //Estado padrão
  State currentState = WAIT_FOR_ANSWER;
};

//Define a classe colocando os números dos respectivos pinos
PathMonitor pathMonitor(19, 16, 17, 5, 13, 12, 14, 27);

//Inicia a classe
void setup() {
  pathMonitor.initialize();
}

//Roda a função criada
void loop() {
  pathMonitor.run();
}
