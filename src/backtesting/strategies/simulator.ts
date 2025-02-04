import fs from 'fs';
import path from 'path';

// Interfaz para los datos de velas
interface Candle {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume_base: number;
    volume_quote: number;
}

// Leer el archivo CSV
function loadCsv(filePath: string): Candle[] {
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const rows = csvContent.trim().split('\n');
    const candles: Candle[] = rows.slice(1).map(row => {
        const [timestamp, open, high, low, close, volume_base, volume_quote] = row.split(',').map(Number);
        return { timestamp, open, high, low, close, volume_base, volume_quote };
    });
    return candles;
}

// Simulador de trading
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBacktest(candles: Candle[], initialBalance: number) {
    let balance = initialBalance;
    let position = 0; // Cantidad de BTC comprada
    const trades: { type: string; price: number; timestamp: number }[] = [];

    // Estrategia simple: compra si el cierre actual es mayor al anterior, vende si es menor
    for (let i = 1; i < candles.length; i++) {
        const prevCandle = candles[i - 1];
        const currentCandle = candles[i];

        if (currentCandle.close > prevCandle.close) {
            // Comprar
            if (balance > 0) {
                const btcBought = balance / currentCandle.close;
                position += btcBought;
                balance = 0;
                trades.push({ type: 'BUY', price: currentCandle.close, timestamp: currentCandle.timestamp });
                console.log(`Compra realizada: ${btcBought.toFixed(8)} BTC a $${currentCandle.close}. Balance: $${balance}`);
            }
        } else if (currentCandle.close < prevCandle.close) {
            // Vender
            if (position > 0) {
                balance += position * currentCandle.close;
                trades.push({ type: 'SELL', price: currentCandle.close, timestamp: currentCandle.timestamp });
                console.log(`Venta realizada: ${position.toFixed(8)} BTC a $${currentCandle.close}. Balance: $${balance}`);
                position = 0;
            }
        }

        // Esperar 0.5 segundos antes de continuar
        await delay(500);
    }

    // Resultado final
    const finalBalance = balance + position * candles[candles.length - 1].close;
    console.log(`\nBalance inicial: $${initialBalance}`);
    console.log(`Balance final: $${finalBalance}`);
    console.log(`Trades realizados: ${trades.length}`);
    return { finalBalance, trades };
}

// Cargar datos y ejecutar simulación
const dataPath = path.join(__dirname, '../../../BTCUSDT_5m_2023-2024.csv');
const candles = loadCsv(dataPath);
const initialBalance = 1000; // Capital inicial en USD
const result = runBacktest(candles, initialBalance);

console.log('Resultado de la simulación:', result);