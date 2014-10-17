var should = require('chai').should(),
    aamva = require('../index');

describe('parse stripe', function() {
    var data = '%FLDELRAY BEACH^JOHN$DOE$^4818 S FEDERAL BLVD^           ?;6360101062172082009=2101198299090=?#! 33435      I               1600                                   ECCECC00000?';
    var stripe = aamva.stripe(data);
    console.log(stripe);
    it('should do stuff', function() {
        true;
    });
});
