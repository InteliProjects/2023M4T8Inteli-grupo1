#include <TinyGPS++.h>

#define GPS_BAUDRATE 9600  // Taxa de transmissão padrão do NEO-6M é 9600 bps

TinyGPSPlus gps;  // Objeto da biblioteca TinyGPS++

void setup() {
  Serial.begin(9600);
  Serial2.begin(GPS_BAUDRATE);
  Serial.println(F("ESP32 - Módulo GPS"));  // Inicialização da comunicação serial e mensagem de boas-vindas
}

void loop() {
  // Verifica se há dados disponíveis na porta serial do módulo GPS
  if (Serial2.available() > 0) {
    // Atualiza o objeto TinyGPS++ com os dados recebidos do módulo GPS
    if (gps.encode(Serial2.read())) {
      // Verifica se a leitura da localização é válida
      if (gps.location.isValid()) {
        // Imprime a latitude
        Serial.print(F("- Latitude: "));
        Serial.println(gps.location.lat());

        // Imprime a longitude
        Serial.print(F("- Longitude: "));
        Serial.println(gps.location.lng());

        // Imprime a altitude em metros, se disponível
        Serial.print(F("- Altitude: "));
        if (gps.altitude.isValid())
          Serial.println(gps.altitude.meters());
        else
          Serial.println(F("INVALID"));
      } else {
        // Mensagem indicando que a localização é inválida
        Serial.println(F("- Localização: INVÁLIDA"));
      }

      // Imprime a velocidade em km/h, se disponível
      Serial.print(F("- Velocidade: "));
      if (gps.speed.isValid()) {
        Serial.print(gps.speed.kmph());
        Serial.println(F(" km/h"));
      } else {
        Serial.println(F("INVALID"));
      }

      // Imprime a data e hora do GPS, se disponíveis
      Serial.print(F("- Data e Hora GPS: "));
      if (gps.date.isValid() && gps.time.isValid()) {
        Serial.print(gps.date.year());
        Serial.print(F("-"));
        Serial.print(gps.date.month());
        Serial.print(F("-"));
        Serial.print(gps.date.day());
        Serial.print(F(" "));
        Serial.print(gps.time.hour());
        Serial.print(F(":"));
        Serial.print(gps.time.minute());
        Serial.print(F(":"));
        Serial.println(gps.time.second());
      } else {
        Serial.println(F("INVALID"));
      }

      // Adiciona uma linha em branco para melhorar a legibilidade
      Serial.println();
    }
  }

  // Verifica se se passaram mais de 5 segundos e se o número de caracteres processados é baixo
  if (millis() > 5000 && gps.charsProcessed() < 10)
    // Mensagem indicando que não foram recebidos dados do GPS e sugerindo verificar a conexão física
    Serial.println(F("Nenhum dado do GPS recebido: verifique a conexão"));
}


// Código adaptado de esp32io.com, para mais informações, visite visit https://esp32io.com/tutorials/esp32-gps

