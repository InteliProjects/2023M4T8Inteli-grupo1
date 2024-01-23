/*
 *
 * Código ESP32 para leitura de dados GPS e envio ao banco de dados através de protocolos MQTT
 * para uso em dashboards e relatórios sobre a localização de ativos.
 *
 *
 * Bibliotecas Utilizadas:
 * 
 * ArduinoJson v6.21.3
 * TinyGPS++ v1.0.3
 * WiFi v1.2.7 
 * time v1.6.1​
 * LiquidCrystal_I2C v1.1.2
 * PubSubClient v2.8
 */

#include <ArduinoJson.h> 
#include <TinyGPS++.h>
#include <WiFi.h>
#include <time.h>
#include <LiquidCrystal_I2C.h>
#include <PubSubClient.h>

//////////////////\\\\\\\\\\\\\\\\\
//////// VARIÁVEIS GLOBAIS \\\\\\\\
//////////////////\\\\\\\\\\\\\\\\\

// Inicializa o LCD 
LiquidCrystal_I2C LCD = LiquidCrystal_I2C(0x27, 16, 2);

#define GPS_BAUDRATE 9600  // Taxa de baud padrão do NEO-6M

// Credenciais da rede Wi-Fi
#define WIFI_SSID "Inteli-COLLEGE" //"rede"
#define WIFI_PASSWORD "Q*********" //"senha"

TinyGPSPlus gps;  // Objeto TinyGPS++

// Definindo os pinos para as cores do LED RGB
#define RED_PIN 4   // Pino conectado ao vermelho (R) do LED RGB no GPIO 4
#define GREEN_PIN 5 // Pino conectado ao verde (G) do LED RGB no GPIO 5
#define BLUE_PIN 18  // Pino conectado ao azul (B) do LED RGB no GPIO 18

// Definindo os pinos para o buzzer, botão de reset, botão on/off
#define BUZZER_PIN 2  // GPIO 2
#define RESET_BUTTON_PIN 27 // GPIO 27
#define POWER_BUTTON_PIN 33 // GPIO 33

// Variável global para controlar a exibição do spinner
bool showSpinner = false; 

// Configuração NTP (time)
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 0;  // Ajuste para o seu fuso horário em segundos
const int   daylightOffset_sec = 3600;  // Ajuste para o horário de verão, se necessário

// Configuração MQTT
const char* mqtt_broker = "broker.hivemq.com";
const char* mqtt_topic = "intel_m4_rnp_g1";
const int mqtt_port = 1883;
WiFiClient espClient;
PubSubClient mqttClient(espClient);

////////////\\\\\\\\\\\\\
//////// FUNÇÕES \\\\\\\\
////////////\\\\\\\\\\\\\


/**
 * @brief Inicializa o sistema.
 * 
 * Esta função configura a comunicação serial para depuração e com o módulo GPS, inicializa os pinos do LED RGB, 
 * o LCD, conecta-se à rede Wi-Fi, configura a sincronização de tempo e inicia a conexão com o broker MQTT.
 * 
 * @param void Não requer argumentos.
 * @return void Não retorna valores.
 */
void setup() {
  Serial.begin(9600);  // Inicia a comunicação serial para depuração
  Serial2.begin(GPS_BAUDRATE, SERIAL_8N1, 16, 17);  // Inicia a comunicação serial com o módulo GPS nos pinos 17 (RX) e 16 (TX)

  // Configura os pinos do LED RGB e o pino do buzzer como output e os pinos do reset button, on/off button como input.
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT); 
  pinMode(RESET_BUTTON_PIN, INPUT_PULLUP);
  pinMode(POWER_BUTTON_PIN, INPUT_PULLUP);

  // Inicializa o LCD
  // Inicializa a comunicação I2C nos novos pinos
  LCD.init();      
  LCD.backlight();
  LCD.setCursor(0, 0); 

  connectToWiFi();  // Conecta-se à rede Wi-Fi

  // Configura a sincronização de tempo
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  // Inicializa conexão MQTT com broker
  mqttClient.setServer(mqtt_broker, mqtt_port);
  mqttClient.setCallback(callback); // Se necessário lidar com mensagens de entrada
  connectToMQTT();

  Serial.println(F("ESP32 - SETUP COMPLETO"));
}

/**
 * @brief Verifica o estado do botão de energia e entra em modo de deep sleep se pressionado.
 * 
 * Esta função é responsável por verificar o estado do botão de energia conectado ao ESP32. Se o botão for pressionado
 * (indicado pelo estado LOW), a função configura o ESP32 para entrar em modo de deep sleep. O modo deep sleep é um estado
 * de baixo consumo de energia onde a execução do programa é interrompida, e o ESP32 permanece nesse estado até ser 
 * acordado novamente.
 * 
 * A função utiliza `esp_sleep_enable_ext0_wakeup` para configurar o ESP32 para acordar do deep sleep quando o mesmo
 * botão é pressionado novamente. Isso é feito configurando o pino do botão como uma fonte de wakeup externa (EXT0).
 * 
 * @param void Não requer argumentos.
 * @return void Não retorna valores.
 */
void checkPowerButton() {
  if (digitalRead(POWER_BUTTON_PIN) == LOW) {
    // Mensagem no LCD antes de desligar
    LCD.clear();
    LCD.setCursor(0, 0);
    LCD.print("DESLIGANDO...");

    delay(1000); // Pequena pausa para visualizar a mensagem

    // Desliga o backlight do LCD
    LCD.noBacklight();

    // Entra em deep sleep e só acorda com o botão de energia
    esp_sleep_enable_ext0_wakeup(GPIO_NUM_33, LOW); // Acorda quando o botão é pressionado
    esp_deep_sleep_start();
  }
}

/**
 * @brief Função de callback para mensagens MQTT.
 * 
 * É chamada automaticamente quando uma nova mensagem MQTT é recebida no tópico subscrito. Facilita
 * 
 * @param topic Tópico MQTT no qual a mensagem foi recebida.
 * @param payload Corpo da mensagem recebida.
 * @param length Tamanho da mensagem.
 * @return void Não retorna valores.
 */
void callback(char* topic, byte* payload, unsigned int length) {
}

/**
 * @brief Conecta-se ao servidor MQTT.
 * 
 * Esta função tenta estabelecer uma conexão com o servidor MQTT especificado pelas configurações globais. 
 * Ela faz várias tentativas de conexão, se necessário, e imprime mensagens de status na comunicação serial.
 * 
 * A função utiliza um loop para tentar a conexão repetidamente até que seja bem-sucedida. Se a conexão falhar,
 * uma mensagem de erro é exibida e a função aguarda 2 segundos antes de tentar novamente.
 * 
 * Esta abordagem garante que o dispositivo continuará tentando se conectar ao broker MQTT mesmo em casos de falha 
 * temporária de rede ou problemas no servidor.
 * 
 * @param void Não requer argumentos.
 * @return void Não retorna valores.
 */
void connectToMQTT() {
  showSpinner = true;
  while (!mqttClient.connected()) {
    resetButtonCheck(); // Tambem verifica aqui se o botao reset foi pressionado
    spinner();

    Serial.print("Conectando MQTT Broker...");
    LCD.clear();
    LCD.setCursor(0, 0);
    LCD.print("CONECTANDO AO");
    LCD.setCursor(0, 1);
    LCD.print("BROKER MQTT");
    
    if (mqttClient.connect("ESP32Client")) {
      Serial.println("MQTT Conectado");
    } else {
      Serial.print("ERRO CONEXAO MQTT");
      Serial.print(mqttClient.state());
      delay(1000);
    }
  }
  showSpinner = false;
}


/**
 * @brief Obtém a hora atual formatada.
 * 
 * Retorna a data e a hora atuais no formato ISO 8601.
 * 
 * @param void Não requer argumentos.
 * @return String Retorna uma string com a data e hora formatadas.
 */
String getFormattedTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Falha ao obter a hora");
    return "";
  }

  char dateTime[64];
  strftime(dateTime, sizeof(dateTime), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(dateTime);
}


/**
 * @brief Toca o buzzer.
 * 
 * Toca o buzzer por 0.2 segundos. Essa função será chamada caso o sistema não consiga transmitir os dados ao broker MQTT.
 * 
 * @param void Não requer argumentos.
 * @return void Não retorna valores.
 */
void playBuzzer() {
  digitalWrite(BUZZER_PIN, HIGH); 
  delay(200); 
  digitalWrite(BUZZER_PIN, LOW); 
}


/**
 * @brief Verifica o estado do botão de reset.
 * 
 * Esta função verifica continuamente o estado do botão de reset. Utiliza a técnica de debounce 
 * para garantir uma leitura estável do estado do botão. Se o botão de reset for mantido pressionado 
 * por mais de 3 segundos, a função `initiateReboot` será chamada para reiniciar o sistema.
 * 
 * O debounce é importante para evitar leituras erráticas devido a pequenas flutuações na entrada do botão.
 * A função rastreia o tempo de pressionamento do botão e só considera um comando de reboot se o botão for 
 * mantido pressionado continuamente por mais de 3 segundos.
 * 
 * @param void Não requer argumentos.
 * @return void Não retorna valores.
 */
void resetButtonCheck() {
  static unsigned long lastDebounceTime = 0;
  static bool lastButtonState = HIGH;
  const unsigned long debounceDelay = 50;

  bool reading = digitalRead(RESET_BUTTON_PIN);

  // Se o estado do botão mudou
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  // Se passaram mais de 50ms desde a última mudança de estado
  if ((millis() - lastDebounceTime) > debounceDelay) {
    // Se o botão está pressionado (estado LOW)
    if (reading == LOW) {
      initiateReboot(); // Reinicia o sistema
    }
  }

  lastButtonState = reading;
}



/**
 * @brief Inicia o procedimento de reboot.
 * 
 * Esta função é responsável por iniciar o processo de reboot do sistema. Ela pode ser chamada
 * quando o botão de reset for mantido pressionado por mais de 3 segundos.
 * 
 * @param void Não requer argumentos.
 * @return void Não retorna valores.
 */
void initiateReboot() {
  Serial.println("REBOOT");
  LCD.clear();
  LCD.setCursor(0, 0);
  LCD.print("REBOOT");
  // Pisca o LED vermelho 3 vezes. Sinal de reboot
  for (int i = 0; i < 3; i++) {
    analogWrite(RED_PIN, 255); // Acende o LED (Vermelho)
    analogWrite(GREEN_PIN, 0);   
    analogWrite(BLUE_PIN, 0);    
    delay(150);                  // Mantém acesso por 0.15 segundos
    analogWrite(RED_PIN, 0);     // Desliga o LED
    analogWrite(GREEN_PIN, 0);   
    analogWrite(BLUE_PIN, 0);  
    delay(150);             
  }
  ESP.restart(); // Reinicia o ESP32
}
  

/**
 * @brief Conecta ao Wi-Fi.
 * 
 * Utiliza as credenciais definidas para conectar-se à rede Wi-Fi e exibe informações no display LCD.
 * 
 * @param void Não requer argumentos.
 * @return void Não retorna valores.
 */
void connectToWiFi() {
  Serial.print("Conectando a ");
  Serial.println(WIFI_SSID);
  
  // Mostrar nome de rede no I2C Display
  LCD.clear();
  LCD.setCursor(0, 0);
  LCD.print("CONECTANDO A ");
  LCD.setCursor(0, 1);
  LCD.print(WIFI_SSID);
  
  // Conectar a rede com SSID e SENHA declarados no início
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    analogWrite(RED_PIN, 255); // Acende o LED (Laranja)
    analogWrite(GREEN_PIN, 102);   
    analogWrite(BLUE_PIN, 0);

    delay(250);
    spinner();
    // Tambem incluir o check dentro do while, caso o usuário queira resetar 
    // ou desligar o sistema enquanto o dispositivo não conecta em nenhuma rede
    resetButtonCheck();
    checkPowerButton(); 
  }

  Serial.println("\nConectado com sucesso!");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
  
}


/**
 * @brief Processa e publica dados de GPS válidos.
 * 
 * Esta função é chamada quando os dados do GPS são válidos. Ela formata e mostra a latitude e longitude no LCD, 
 * configura o LED para a cor azul e publica os dados no tópico MQTT especificado.
 * 
 * @param void Não requer argumentos.
 * @return void Não retorna valores.
 */
void gpsDataValid() {
  String dateTime = getFormattedTime();

  // Mostrar dados no display
  LCD.clear();
  LCD.setCursor(0, 0);
  LCD.print("Lat: ");
  LCD.print(gps.location.lat(), 6);
  LCD.setCursor(0, 1);
  LCD.print("Lon: ");
  LCD.print(gps.location.lng(), 6);

  // LED Azul
  analogWrite(RED_PIN, 0);   
  analogWrite(GREEN_PIN, 0);   
  analogWrite(BLUE_PIN, 255);    

  // Preparo de dados em formato JSON
  String jsonData = "{\"sn_bar_code\":" + "001" + 
                    ", \"latitude\":" + String(gps.location.lat(), 6) + 
                    ", \"longitude\":" + String(gps.location.lng(), 6) + 
                    ", \"dateTime\":\"" + dateTime + "\"}";

  // Publish de dados no topico especificado usando MQTT
  mqttClient.publish(mqtt_topic, jsonData.c_str());

}


/**
 * @brief Lida com dados de GPS inválidos.
 * 
 * Quando os dados do GPS são considerados inválidos, esta função é chamada para atualizar o display LCD,
 * configurar o LED para a cor vermelha, indicando um erro ou falta de dados, e tocar um pequeno beep.
 * 
 * @param void Não requer argumentos.
 * @return void Não retorna valores.
 */
void gpsDataInvalid() {
  static unsigned long lastBeepTime = 0; // Guarda a última vez que o beep foi tocado
  const unsigned long beepInterval = 5000; // Intervalo de 5 segundos entre cada beep

  LCD.clear();
  LCD.setCursor(0, 0);
  LCD.print("OBTENDO");
  LCD.setCursor(0, 1);
  LCD.print("LOCALIZACAO");

  // LED Vermelho
  analogWrite(RED_PIN, 255);  
  analogWrite(GREEN_PIN, 0);   
  analogWrite(BLUE_PIN, 0);

  // Toca o buzzer a cada 5 segundos
  if (millis() - lastBeepTime >= beepInterval) {
    playBuzzer();
    lastBeepTime = millis();
  }
}


/**
 * @brief Exibe um indicador de carregamento no LCD.
 * 
 * Esta função mostra um "spinner" no display LCD, utilizado para indicar que uma operação está em andamento, 
 * como a tentativa de conexão Wi-Fi.
 * 
 * @param void Não requer argumentos.
 * @return void Não retorna valores.
 */
void spinner() {
  static int8_t counter = 0;
  const char* glyphs = "\xa1\xa5\xdb";
  LCD.setCursor(15, 1);
  LCD.print(glyphs[counter++]);
  if (counter == strlen(glyphs)) {
    counter = 0;
  }
}


/**
 * @brief Função principal do programa que roda continuamente.
 * 
 * Esta função é o coração do programa. Ela verifica continuamente a conexão MQTT, lê e processa dados do GPS, 
 * e executa as funções `gpsDataValid()` ou `gpsDataInvalid()` com base na validade dos dados do GPS.
 * Também verifica se os dados do GPS estão sendo recebidos e gerencia o intervalo de tempo entre as leituras.
 * 
 * @param void Não requer argumentos.
 * @return void Não retorna valores.
 */
void loop() {
  static unsigned long lastUpdateTime = 0;     // Guarda a última vez que os dados do GPS foram atualizados
  static unsigned long lastSpinnerUpdate = 0;  // Guarda a última vez que o spinner foi atualizado
  const unsigned long updateInterval = 15000;  // Intervalo de 15 segundos entre cada atualização
  const unsigned long spinnerInterval = 250;   // Intervalo para atualizar o spinner

  // Verifica o estado do botão de energia a cada loop
  checkPowerButton();

  // Atualizar o spinner se necessário
  if (showSpinner && (millis() - lastSpinnerUpdate >= spinnerInterval)) {
    spinner();
    lastSpinnerUpdate = millis();
  }

  // Verifica se já passou o intervalo de tempo desde a última atualização
  if (millis() - lastUpdateTime >= updateInterval) {
    bool isDataRead = false;

    // Reconectar ao MQTT caso conexão falhou
    if (!mqttClient.connected()) {
      connectToMQTT();
    }
    mqttClient.loop();

    // Lê dados do GPS se disponíveis
    while (Serial2.available() > 0) {
      if (gps.encode(Serial2.read())) {
        isDataRead = true;
      }
    }

    // Condição para checar os dados lidos do gps
    if (isDataRead) {
      if (gps.location.isValid()) {
        showSpinner = false;
        gpsDataValid();
      } else {
        showSpinner = true;
        gpsDataInvalid();
      }
    }

    // Atualiza o último horário de atualização
    lastUpdateTime = millis();
  }

  // Verifica estado do botão de reset a cada loop
  resetButtonCheck();
  // Verifica o estado do botão de energia a cada loop
  checkPowerButton();

}
