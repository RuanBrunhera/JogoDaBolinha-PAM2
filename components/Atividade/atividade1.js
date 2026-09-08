import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';

const { width, height } = Dimensions.get('window');

const TAMANHO_BOLA = 40;
const VELOCIDADE = 5;

// Barreiras do mapa
const barreiras = [
  {
    x: 40,
    y: 180,
    width: 180,
    height: 25,
  },
  {
    x: 220,
    y: 300,
    width: 25,
    height: 180,
  },
  {
    x: 40,
    y: 500,
    width: 160,
    height: 25,
  },
  {
    x: 100,
    y: 350,
    width: 25,
    height: 150,
  },
];

// Posição do buraco
const buraco = {
  x: width - 80,
  y: 100,
  tamanho: 45,
};

export default function App() {
  const [bola, setBola] = useState({
    x: 30,
    y: height - 100,
  });

  const [venceu, setVenceu] = useState(false);

  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y }) => {
      if (venceu) {
        return;
      }

      setBola((posicao) => {
        let novoX = posicao.x + x * VELOCIDADE;
        let novoY = posicao.y - y * VELOCIDADE;

        // Limites da tela
        novoX = Math.max(
          0,
          Math.min(width - TAMANHO_BOLA, novoX)
        );

        novoY = Math.max(
          0,
          Math.min(height - TAMANHO_BOLA, novoY)
        );

        // Verifica colisão com as barreiras
        for (const barreira of barreiras) {
          const colidiu =
            novoX < barreira.x + barreira.width &&
            novoX + TAMANHO_BOLA > barreira.x &&
            novoY < barreira.y + barreira.height &&
            novoY + TAMANHO_BOLA > barreira.y;

          if (colidiu) {
            // Se bater, mantém a posição anterior
            novoX = posicao.x;
            novoY = posicao.y;
            break;
          }
        }

        // Verifica se chegou no buraco
        const centroBolaX = novoX + TAMANHO_BOLA / 2;
        const centroBolaY = novoY + TAMANHO_BOLA / 2;

        const distanciaX = centroBolaX - (
          buraco.x + buraco.tamanho / 2
        );

        const distanciaY = centroBolaY - (
          buraco.y + buraco.tamanho / 2
        );

        const distancia = Math.sqrt(
          distanciaX * distanciaX +
          distanciaY * distanciaY
        );

        if (distancia < buraco.tamanho / 2) {
          setVenceu(true);
        }

        return {
          x: novoX,
          y: novoY,
        };
      });
    });

    Accelerometer.setUpdateInterval(100);

    return () => {
      subscription.remove();
    };
  }, [venceu]);

  function reiniciar() {
    setBola({
      x: 30,
      y: height - 100,
    });

    setVenceu(false);
  }

  return (
    <View style={styles.container}>

      {/* Título */}
      <Text style={styles.titulo}>
        ⛳ MINI GOLF
      </Text>

      {/* Buraco */}
      <View
        style={[
          styles.buraco,
          {
            left: buraco.x,
            top: buraco.y,
          },
        ]}
      />

      {/* Barreiras */}
      {barreiras.map((barreira, index) => (
        <View
          key={index}
          style={[
            styles.barreira,
            {
              left: barreira.x,
              top: barreira.y,
              width: barreira.width,
              height: barreira.height,
            },
          ]}
        />
      ))}

      {/* Bola */}
      <View
        style={[
          styles.bola,
          {
            left: bola.x,
            top: bola.y,
          },
        ]}
      />

      {/* Mensagem de vitória */}
      {venceu && (
        <View style={styles.vitoria}>
          <Text style={styles.textoVitoria}>
            🎉 BOA TACADA!
          </Text>

          <TouchableOpacity
            style={styles.botao}
            onPress={reiniciar}
          >
            <Text style={styles.textoBotao}>
              Jogar novamente
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!venceu && (
        <Text style={styles.instrucao}>
          Incline o celular para controlar a bola
        </Text>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    overflow: 'hidden',
  },

  titulo: {
    position: 'absolute',
    top: 45,
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 10,
  },

  bola: {
    position: 'absolute',
    width: TAMANHO_BOLA,
    height: TAMANHO_BOLA,
    borderRadius: TAMANHO_BOLA / 2,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#222',
    zIndex: 5,
  },

  barreira: {
    position: 'absolute',
    backgroundColor: '#795548',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#4E342E',
  },

  buraco: {
    position: 'absolute',
    width: buraco.tamanho,
    height: buraco.tamanho,
    borderRadius: buraco.tamanho / 2,
    backgroundColor: '#222',
    borderWidth: 4,
    borderColor: '#333',
  },

  instrucao: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

  vitoria: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 25,
    borderRadius: 15,
    zIndex: 20,
  },

  textoVitoria: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  botao: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
