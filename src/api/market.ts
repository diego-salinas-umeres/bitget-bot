import axios from "axios";
import { generateHeaders } from "./auth";

const BASE_URL = 'https://api.bitget.com';

export async function getSymbolInfo(symbol: string) {

    const endpoint = '/api/v2/spot/public/symbols?symbol=';
    const url = BASE_URL + endpoint + symbol;

    try {
        const headers = generateHeaders('GET', endpoint);
        const response = await axios.get(url, { headers });
        console.log('Conexión exitosa:', response.data);
    } catch (error: any) {
        console.error('Error en la conexión: ', error.response?.data || error.message);
    }
}

export async function openMarketPosition() {
    const endpoint = '/api/v2/spot/trade/place-order';
    const url = BASE_URL + endpoint;

    const body = JSON.stringify({
        symbol: "USDCUSDT",
        side: "buy",
        orderType: "limit",
        force: "gtc",
        price: "0.998",
        size: "5",
        tradeSide: "open",
    });

    try {
        const headers = generateHeaders('POST', endpoint, body);
        const response = await axios.post(url, body, { headers });
        console.log('Orden abierta con éxito:', response.data);
    } catch (error: any) {
        console.error('Error al abrir la posición:', error.response?.data || error.message);
    }
}