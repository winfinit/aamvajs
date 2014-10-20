var should = require('chai').should(),
 	expect = require('chai').expect,
    aamva = require('../index');

    var data = '%FLLAKE WORTH^GUNTHER$WILLIAM$TALMADGE^7317 HEATHLEY DR^                        ?;6360100753693864066=2102196499260=?#! 334677730  E               1603                                   ECCECC00000?';
//     var data = '%FLDELRAY BEACH^DOE$JOHN$^4818 S FEDERAL BLVD^           \?\
// ;6360100462172082009=2101198299090=?\
// #! 33435      I               1600                                   ECCECC00000?';
    var stripe = aamva.stripe(data);
console.log(stripe);

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
