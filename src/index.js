require('dotenv').config();

var exchangeManager = require('./exchangeManager');
var calculator = require('./calculator');
var questions = require('./questions');

async function main() {
    const { exchange } = await questions.askExchange(exchangeManager.availableExchanges);
    const { markets } = await exchangeManager.registerInstance(exchange);
    const answers = await questions.askOrder(markets);

    let { fee, subTotal, total } = calculator.calculateExplanation(answers, markets);
    console.log("Expected costs for these order at current fee " + fee + " for " + subTotal + " makes " + total);

    exchangeManager.executeOrders(exchange, calculator, answers, true);
}

try {
    main();
} catch (e) {
    console.error(e);
}