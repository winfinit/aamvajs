var should = require('chai').should(),
    expect = require('chai').expect,
    aamva = require('../index');

    var data = '@ANSI 111111030001DL01111111DCA DCB DCD DBA11111112DCSSMITH DCTJOHN A DBD03016013DBB10071990DBC1DAYBRODAU11 in DAG111 SMITHS ST DAISMITHSTON DAJNHDAK333333333 DAQ44NST44444 DCGUSADCHNONE';

    var res = aamva.parse(data);

describe('PDF417, NH', function() {
  describe('state', function() {
      it('should be set to NH', function(){
          expect(res.state).to.equal("NH");
      });
  });

  describe('address', function() {
      it('should be set to 111 SMITHS ST', function(){
          expect(res.address).to.equal("111 SMITHS ST");
      });
  });

  describe('gender', function() {
      it('should be set to MALE', function(){
          expect(res.sex).to.equal("MALE");
      });
  });

  describe('name', function() {
      it('first should be set to JOHN A', function(){
          expect(res.name.first).to.equal("JOHN A");
      });
      it('last should be set to SMITH', function(){
          expect(res.name.last).to.equal("SMITH");
      });
  });

  describe('birthday', function() {
      it('year should be 19901007', function(){
          expect(res.birthday).to.equal('19901007');
      });
  });

  describe('postal_code', function() {
      it('should be 33333', function(){
          expect(res.postal_code).to.equal("33333");
      });
  });
});

