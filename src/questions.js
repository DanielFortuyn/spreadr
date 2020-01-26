var fuzzy = require('fuzzy');
var inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

module.exports = {
    search: function (input, values, defaultValue) {
        input = input || '';
        return new Promise(function (resolve) {
            try {
                if (input == '') {
                    resolve([defaultValue]);
                } else {
                    var fuzzyResult = fuzzy.filter(input, values);
                    resolve(
                        fuzzyResult.map(function (el) {
                            return el.original;
                        })
                    );
                }
            } catch (e) {
                console.error(e);
            }
        });
    },
    askExchange: async function (availableExchanges) {
        let self = this;
        return await inquirer.prompt([
            {
                name: 'exchange',
                type: "autocomplete",
                default: 'coinbasepro',
                source: function (answers, input) {
                    return self.search(input, availableExchanges, 'coinbasepro');
                }
            },
        ]);
    },
    askOrder: async function (markets) {
        return await inquirer.prompt(this.getOrderQuestions(markets));
    },
    getOrderQuestions: function (markets) {
        let self = this;
        return [{
            name: "symbol",
            type: "autocomplete",
            default: "",
            source: function (answers, input) {
                return self.search(input, Object.keys(markets), 'BTC/EUR');
            }
        },
        {
            type: 'number',
            name: 'size',
            message: 'How much do you want to trade?',
            default: 0.25,
            float: true,
            validate: this.validateFloat
        },
        {
            type: 'number',
            name: 'steps',
            message: 'How many steps on the ladder?',
            default: 5,
            validate: this.validateInt
        },
        {
            type: 'number',
            name: 'top',
            message: 'Order Top?',
            default: 8100,
            float: true,
            validate: this.validateFloat
        },
        {
            type: 'number',
            name: 'bottom',
            message: 'Order Bottom?',
            default: 8000,
            float: true,
            validate: this.validateFloat
        },
        {
            type: 'list',
            name: 'side',
            message: 'Do you want to buy or sell?',
            default: 0,
            choices: [
                { title: 'buy', value: 'buy' },
                { title: 'sell', value: 'sell' }
            ],
        }]
    },
    validateInt: function (n) {
        const number = parseInt(n);
        if (isNaN(number)) {
            return "Please supply a valid integer";
        }
        if (number <= 0) {
            return "Please supply a positive integer";
        }
        return true;
    },
    validateFloat: function (n) {
        const number = parseFloat(n);
        if (isNaN(number)) {
            return "Please supply a valid float";
        }
        if (number <= 0) {
            return "Please supply a positive float";
        }
        return true;
    },
}