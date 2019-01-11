const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {


    it('generate a SHA-256 hashed output', () =>{
        expect(cryptoHash('ORRAIT'))
        .toEqual('ebb51ca8da149a09826c302ad03a58aa22872e3133a4a2ff6efdd07086455f86')
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three'))
        .toEqual(cryptoHash('three', 'one', 'two'));
    });
});