var should = require('chai').should(),
    expect = require('chai').expect,
    aamva = require('../index');

    var data = '@\n\u001e\rAAMVA6360030101DL00290192DLDAQK-134-123-145-103\nDAAJOHNSON,JACK,,3RD\nDAG1234 BARNEYS INN PL\nDAIBALTIMORE\nDAJMD\nDAK21230 \nDARC \nDAS \nDAT \nDAU505\nDAW135\nDBA20170209\nDBB19910209\nDBC1\nDBD20120210\nDBHN\r';

    var res = aamva.parse(data);

console.log(res);
describe('state', function() {
    it('should be set to MD', function(){
        expect(res.state).to.equal("MD");
    });
});

describe('address', function() {
    it('should be set to 1234 BARNEYS INN PL', function(){
        expect(res.address).to.equal("1234 BARNEYS INN PL");
    });
});

describe('gender', function() {
    it('should be set to MALE', function(){
        expect(res.sex).to.equal("MALE");
    });
});

describe('name', function() {
    it('first should be set to JACK', function(){
        expect(res.name.first).to.equal("JACK");
    });
    it('last should be set to JOHNSON', function(){
        expect(res.name.last).to.equal("JOHNSON");
    });
});

describe('birthday', function() {
    it('should be 19910209', function(){
        expect(res.birthday).to.equal('19910209');
    });
});

describe('postal_code', function() {
    it('should be 21230', function(){
        expect(res.postal_code).to.equal("21230");
    });
});

describe('id', function() {
    it('should be 21230', function(){
        expect(res.id).to.equal("K134123145103");
    });

});
