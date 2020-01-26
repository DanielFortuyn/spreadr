var questions = require('../src/questions');
var calculator = require('../src/calculator');
var exchangeManager = require('../src/exchangeManager');

var should = require('chai').should() //actually call the function
var expect = require('chai').expect;

var testOrder = {
    top: 100,
    bottom: 0,
    symbol: 'BTC/EUR',
    size: 1,
    steps: 100
};

var testMarket = {
    'BTC/EUR': {
        percentage: 1,
        maker: 0.5,
        taker: 0.5
    }
}
describe('calculator', () => {
    it('should have working calculator', function () {
        calculator.calculateExplanation(testOrder, testMarket).should.eql({
            subTotal: 50,
            fee: 25,
            total: 75,
            price: 50
        });
    });

    it('should always calculate an exepected ordersize', function () {
        calculator.getOrderSize('m', 'p').should.equal(1);
        calculator.getOrderSize(199, 1.2).should.equal(0.006030150753768844);
    });

    it('should always calculate the right increment', function () {
        expect(function () {
            calculator.getIncrementSize(1, 0, 1);
        }).to.throw('calculate')

        calculator.getIncrementSize(1, 2, 2).should.equal(1);
        calculator.getIncrementSize(8900, 9000, 5).should.equal(25);
    });
});

describe('Instance manager', () => {
    it('should create an instance properly', async function () {
        exchangeManager.exchanges.should.be.an('Object');
        let instance = await exchangeManager.registerInstance('coinbasepro');
        instance.should.be.an('Object');
        let instance2 = await exchangeManager.createInstance('bitmex');
        instance2.should.be.an('Object');
        let instance3 = await exchangeManager.getInstance('coinbasepro');
        instance3.should.equal(instance);
        let instance4 = await exchangeManager.getInstance('coinbase');
        instance4.should.be.an('Object');

        let response = await exchangeManager.executeOrders('coinbasepro', calculator, { top: 1, bottom: 0, size: 0.00001, symbol: 'BTC/EUR', steps: 5, side: 'buy' }, false);
        response.should.eql([]);
    });
});

describe('validator', function () {
    it('should validate ints correctly', function () {
        questions.validateInt('p').should.equal('Please supply a valid integer');
        questions.validateInt('-100').should.equal('Please supply a positive integer');
        questions.validateInt(100).should.equal(true);
    });
    it('should validate floats correctly', function () {
        questions.validateFloat('x').should.equal('Please supply a valid float');
        questions.validateFloat(100.1).should.equal(true);
    });
});

describe('prompts', function () {
    it('should ask all the right questions', () => {
        questions.getOrderQuestions({ 'BTC/EUR': {} }).should.have.lengthOf(6);
    });
});

describe('search', function () {
    it('should perform fuzzy search on a list of items', () => {
        let result = questions.search(['a', 'b', 'aabbdd', 'abcabc', 'abcaaaabc', 'abc'], ['abc'], 'coinbasepro')
        console.log(result);
    });
});