var should = require('chai').should(),
    expect = require('chai').expect,
    aamva = require('../index');

var data = '@ANSI 636022060002DL00410286ZK03270007DLDAQK03-76-9213DCSHAECHERLDDENDACJANADDFNDADBETHDDGNDCACDCBNONEDCDNONEDBD10152016DBB04081991DBA04082022DBC2DAU069 INDAYBRODAG16315 W 124TH STREETDAIOLATHEDAJKSDAK660620000  DCF92891022041HJ16289F2208DBDCGUSADAW140DAHUNAVLDCK16291K037692130101DDB06012012DDK1ZKZKA';

var res = aamva.parse(data);

describe('state', function() {
    it('should be parsed', function(){
        expect(res.state).to.equal("KS");
    });
});

describe('address', function() {
    it('should be parsed', function(){
        expect(res.address).to.equal("16315 W 124TH STREET");
    });
});

describe('gender', function() {
    it('should be parsed', function(){
        expect(res.sex).to.equal("FEMALE");
    });
});

describe('name', function() {
    it('first should be parsed', function(){
        expect(res.name.first).to.equal("JANA");
    });
    it('last should be parsed', function(){
        expect(res.name.last).to.equal("HAECHERL");
    });
});

describe('birthday', function() {
    it('year should be 19940101', function(){
        expect(res.birthday).to.equal('19910408');
    });
});

describe('exp', function() {
  it('should be 20220408', function() {
    expect(res.expiration_date).to.equal('20220408');
  });
});

describe('postal_code', function() {
    it('should be 66062', function(){
        expect(res.postal_code).to.equal("66062");
    });
});
