var should = require('chai').should(),
 	expect = require('chai').expect,
    aamva = require('../index');

    var data = '%FLDELRAY BEACH^DOE$JOHN$^4818 S FEDERAL BLVD^           \?\
;6360100462172082009=2101198299090=?\
#! 33435      I               1600                                   ECCECC00000?';
    var stripe = aamva.stripe(data);
console.log(stripe);
describe('state', function() {
    it('should be set to FL', function(){
    	expect(stripe.state).to.equal("FL");
    });
});

describe('city', function() {
    it('should be set to FL', function(){
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
    it('should be set to ', function(){
    	expect(stripe.name().last).to.equal("DOE");
    });
});