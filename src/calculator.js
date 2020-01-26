module.exports = {
    //Convert negative number to positive
    getOrderSize: function (steps, size) {
        if (parseInt(steps) >= 1) {
            return size / steps
        }
        return 1;
    },
    getIncrementSize: function (bottom, top, steps) {
        if (top <= bottom) {
            throw Error('Top is smaller than bottom, cannot calculate increment');
        }
        return (top - bottom) / (steps - 1);
    },
    calculateExplanation: function (answers, markets) {
        let { percentage, maker, taker } = markets[answers.symbol];
        let avgPrice = (answers.top + answers.bottom) / 2;
        let subTotal = (avgPrice * answers.size);
        let fee = subTotal * maker;

        return {
            subTotal: subTotal,
            fee: fee,
            total: subTotal + fee,
            price: avgPrice
        }
    }
} 