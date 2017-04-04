var should = require('chai').should(),
    expect = require('chai').expect,
    aamva = require('../index');

var data = '@ANSI 6360300102DL00390184ZM02230047DLDAQP039023005DAAENGLAND,ADAM,N,DAG200 MAIN ST #114DAIKANSAS CITYDAJMODAK64105      DARF   DASB         DATM    DAU510DAW180DAYBRODBA20180126DBB19820126DBCMDBD20111229ZMZMAJACKSONZMB111163630009ZMCA         ZMD';

var res = aamva.parse(data);

describe('state', function() {
    it('should be parsed', function(){
        expect(res.state).to.equal("MO");
    });
});

describe('address', function() {
    it('should be parsed', function(){
        expect(res.address).to.equal("200 MAIN ST #114");
    });
});

describe('gender', function() {
    it('should be parsed', function(){
        expect(res.sex).to.equal("MALE");
    });
});

describe('name', function() {
    it('first should be parsed', function(){
        expect(res.name.first).to.equal("ADAM");
    });
    it('last should be parsed', function(){
        expect(res.name.last).to.equal("ENGLAND");
    });
});

describe('birthday', function() {
    it('year should be parsed', function(){
        expect(res.birthday).to.equal('19820126');
    });
});

describe('exp', function() {
  it('should be parsed', function() {
    expect(res.expiration_date).to.equal('20180126');
  });
});

describe('postal_code', function() {
    it('should be parsed', function(){
        expect(res.postal_code).to.equal("64105");
    });
});
