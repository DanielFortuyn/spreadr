const ccxt = require('ccxt');
const e = process.env;

module.exports = {
    availableExchanges: ccxt.exchanges,
    exchanges: {},
    createInstance: async function (exchange) {
        const upperExchange = exchange.toUpperCase();
        return await new ccxt[exchange]({
            password: e[upperExchange + "_PASSWORD"],
            apiKey: e[upperExchange + "_KEY"],
            secret: e[upperExchange + "_SECRET"],
            enableRateLimit: true,
        });
    },
    registerInstance: async function (exchange) {
        let instance = await this.createInstance(exchange);
        return this.exchanges[exchange] = {
            instance: instance,
            markets: await instance.loadMarkets()
        };
    },
    getInstance: async function (exchange) {
        if (!this.exchanges[exchange]) {
            return await this.registerInstance(exchange);
        }
        return this.exchanges[exchange];
    },
    executeOrders: async function (exchange, calculator, answers, execute) {
        const orderSize = calculator.getOrderSize(answers.steps, answers.size);
        let incrementSize = calculator.getIncrementSize(answers.bottom, answers.top, answers.steps);
        let i = 1;
        let responses = [];


        while (answers.bottom <= answers.top) {
            let price = Math.floor(answers.bottom * 1000) / 1000;
            if (execute) {
                let e = await this.getInstance(exchange);
                await e.instance.createOrder(answers.symbol, 'limit', answers.side, orderSize, answers.bottom);
                console.log(i++, answers.symbol, answers.side, orderSize, price);
            }
            answers.bottom += incrementSize;
        }
        return responses;
    }
}