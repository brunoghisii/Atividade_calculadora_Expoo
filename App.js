import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PaperProvider, Button, Text, Surface } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const BOTOES = [
  ['C', '⌫', '/', '*'],
  ['7', '8', '9', '-'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '='],
  ['0', '.'],
];

const OPERADORES = ['+', '-', '*', '/'];

export default function App() {
  const [display, setDisplay] = useState('0');
  const [valorAnterior, setValorAnterior] = useState(null);
  const [operador, setOperador] = useState(null);
  const [novoNumero, setNovoNumero] = useState(true);

  const calcular = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? null : a / b;
      default: return b;
    }
  };

  const formatar = (n) => String(Math.round(n * 1e10) / 1e10);

  const limpar = () => {
    setDisplay('0');
    setValorAnterior(null);
    setOperador(null);
    setNovoNumero(true);
  };

  const apagar = () => {
    if (novoNumero) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const digitar = (d) => {
    if (novoNumero) {
      setDisplay(d === '.' ? '0.' : d);
      setNovoNumero(false);
    } else {
      if (d === '.' && display.includes('.')) return;
      setDisplay(display === '0' && d !== '.' ? d : display + d);
    }
  };

  const escolherOperador = (op) => {
    const atual = parseFloat(display);
    if (valorAnterior !== null && operador && !novoNumero) {
      const resultado = calcular(valorAnterior, atual, operador);
      if (resultado === null) {
        limpar();
        setDisplay('Erro');
        return;
      }
      setValorAnterior(resultado);
      setDisplay(formatar(resultado));
    } else {
      setValorAnterior(atual);
    }
    setOperador(op);
    setNovoNumero(true);
  };

  const igual = () => {
    if (operador === null || valorAnterior === null) return;
    const resultado = calcular(valorAnterior, parseFloat(display), operador);
    if (resultado === null) {
      limpar();
      setDisplay('Erro');
      return;
    }
    setDisplay(formatar(resultado));
    setValorAnterior(null);
    setOperador(null);
    setNovoNumero(true);
  };

  const aoPressionar = (b) => {
    if (b === 'C') limpar();
    else if (b === '⌫') apagar();
    else if (b === '=') igual();
    else if (OPERADORES.includes(b)) escolherOperador(b);
    else digitar(b);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Surface style={styles.displayBox} elevation={4}>
          <Text variant="displayMedium" style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
            {display}
          </Text>
        </Surface>

        <View style={styles.teclado}>
          {BOTOES.map((linha, i) => (
            <View key={i} style={styles.linha}>
              {linha.map((b) => (
                <Button
                  key={b}
                  mode={OPERADORES.includes(b) || b === '=' ? 'contained' : 'contained-tonal'}
                  style={[styles.botao, b === '0' && styles.botaoZero]}
                  contentStyle={styles.botaoConteudo}
                  labelStyle={styles.botaoLabel}
                  onPress={() => aoPressionar(b)}
                >
                  {b}
                </Button>
              ))}
            </View>
          ))}
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16, justifyContent: 'flex-end' },
  displayBox: { padding: 24, marginBottom: 16, borderRadius: 16, alignItems: 'flex-end', justifyContent: 'center', minHeight: 120 },
  displayText: { textAlign: 'right' },
  teclado: { gap: 10 },
  linha: { flexDirection: 'row', gap: 10 },
  botao: { flex: 1, borderRadius: 16 },
  botaoZero: { flex: 2 },
  botaoConteudo: { height: 70 },
  botaoLabel: { fontSize: 24 },
});