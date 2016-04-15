var should = require('chai').should(),
 	expect = require('chai').expect,
    aamva = require('../index');

    var data = '%TXAUSTIN^DOE$JOHN^12345 SHERBOURNE ST^?;63601538774194=150819810101?#" 78729      C               1505130BLKBLK?\
    ';

    var stripe = aamva.parse(data);


describe('state', function() {
    it('should be set to TX', function(){
    	expect(stripe.state).to.equal("TX");
    });
});

describe('city', function() {
    it('should be set to AUSTIN', function(){
    	expect(stripe.city).to.equal("AUSTIN");
    });
});

describe('DMV ID', function() {
    it('should be set to 38774194', function(){
    	expect(stripe.id).to.equal("38774194");
    });
});

describe('First name', function() {
    it('should be set to JOHN', function(){
    	expect(stripe.name.first).to.equal("JOHN");
    });
});

describe('Last name', function() {
    it('should be set to DOE', function(){
    	expect(stripe.name.last).to.equal("DOE");
    });
});

describe('Address', function() {
    it('should be set to 12345 SHERBOURNE ST', function(){
    	expect(stripe.address).to.equal("12345 SHERBOURNE ST");
    });
});

describe('Sex', function() {
    it('should be set to MALE', function(){
    	expect(stripe.sex).to.equal("MALE");
    });
});

describe('DOB', function() {
    it('should be 1981010', function() {
      expect(stripe.birthday).to.equal('19810101');
    });
});
