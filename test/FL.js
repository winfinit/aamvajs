var should = require('chai').should(),
 	expect = require('chai').expect,
    aamva = require('../index');

    var data = '%FLDELRAY BEACH^DOE$JOHN$^4818 S FEDERAL BLVD^           \?\
;6360100462172082009=2101198799080=?\
#! 33435      I               1600                                   ECCECC00000?';

    var stripe = aamva.parse(data);


describe('state', function() {
    it('should be set to FL', function(){
    	expect(stripe.state).to.equal("FL");
    });
});

describe('city', function() {
    it('should be set to DELRAY BEACH', function(){
    	expect(stripe.city).to.equal("DELRAY BEACH");
    });
});

describe('DMV ID', function() {
    it('should be set to D621720820090', function(){
    	expect(stripe.id()).to.equal("D621720820090");
    });
});

describe('First name', function() {
    it('should be set to JOHN', function(){
    	expect(stripe.name().first).to.equal("JOHN");
    });
});

describe('Last name', function() {
    it('should be set to DOE', function(){
    	expect(stripe.name().last).to.equal("DOE");
    });
});

describe('Address', function() {
    it('should be set to 4818 S FEDERAL BLVD', function(){
    	expect(stripe.address).to.equal("4818 S FEDERAL BLVD");
    });
});

describe('Sex', function() {
    it('should be set to MALE', function(){
    	expect(stripe.sex()).to.equal("MALE");
    });
});

describe('DOB', function() {
    it('should be set to 19870108', function(){
        var date = new Date(Date.UTC(1987,0,8));
        expect(stripe.birthday().toDateString()).to.equal(date.toDateString());
    });
});
