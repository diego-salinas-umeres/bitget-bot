import { getAccountAssets, getAccountInfo } from "./api/account";
import { getSymbolInfo, openMarketPosition } from "./api/market";
import inquirer from 'inquirer';

let autoFetchInterval: NodeJS.Timeout | null = null;

async function mainMenu() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Seleccione una opción: ',
        choices: [
          { name: 'Ver información de la cuenta', value: 'getAccountInfo' },
          { name: 'Ver activos de la cuenta', value: 'getAccountAssets' },
          { name: 'Obtener información de un símbolo', value: 'getSymbolInfo' },
          { name: 'Abrir una posición de mercado', value: 'openMarketPosition' },
          { name: 'Activar actualización automática de activos (cada 10s)', value: 'startAutoFetch' },
          { name: 'Detener actualización automática', value: 'stopAutoFetch' },
          { name: 'Salir', value: 'exit' },
        ]
      }
    ]);

    if (action === 'exit') {
      console.log('Saliendo del programa...');
      if (autoFetchInterval) {
        clearInterval(autoFetchInterval);
      }
      break;
    }

    switch (action) {
      case 'getAccountInfo':
        await getAccountInfo();
        break;
      case 'getAccountAssets':
        await getAccountAssets();
        break;
      case 'getSymbolInfo':
        const { symbol } = await inquirer.prompt([
          {
            type: 'input',
            name: 'symbol',
            message: 'Ingrese el símbolo del activo',
            validate: input => input ? true : 'Debe ingresar un símbolo válido.'
          }
        ])
        await getSymbolInfo(symbol);
        break;
      case 'openMarketPosition':
        await openMarketPosition();
        break;
      case 'startAutoFetch':
        if (!autoFetchInterval) {
          console.log('⏳ Activando actualización automática de activos cada 10s...');
          autoFetchInterval = setInterval(getAccountAssets, 10000);
        } else {
          console.log('⚠️ La actualización automática ya está en ejecución.');
        }
        break;
      case 'stopAutoFetch':
        if (autoFetchInterval) {
          clearInterval(autoFetchInterval);
          autoFetchInterval = null;
          console.log('⏹️ Actualización automática detenida.');
        } else {
          console.log('⚠️ No hay actualización automática en ejecución.');
        }
        break;
      default:
        console.log('Opción no válida');
    }
  }
}

mainMenu();

//Ejecutar
//npx ts-node src/index.ts