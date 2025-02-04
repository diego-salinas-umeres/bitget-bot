import axios from "axios";
import { generateHeaders } from "./auth";

const BASE_URL = 'https://api.bitget.com';

export async function getAccountInfo(){
    const endpoint = '/api/v2/spot/account/info';
    const url = BASE_URL + endpoint;

    try{
        const headers = generateHeaders('GET', endpoint);
        const response = await axios.get(url, {headers});
        console.log ('Conexión exitosa:', response.data);
    } catch (error: any){
        console.error('Error en la conexión: ', error.response?.data || error.message);
    }
}

export async function getAccountAssets(){
    const endpoint = '/api/v2/spot/account/assets';
    const url = BASE_URL + endpoint;
  
    try{
        const headers = generateHeaders('GET', endpoint);
        const response = await axios.get(url, {headers});
        console.log ('Conexión exitosa:', response.data);
    } catch (error: any){
        console.error('Error en la conexión: ', error.response?.data || error.message);
    }
  };