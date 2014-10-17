
module.exports = {
    stripe: function(data) {
        var tracks = data.match(/(.*?\?)(.*?\?)(.*?\?)/);
        var expr = new RegExp(
                '%',
                '([A-Z]{2})',
                '([^\^]{0,13})\^?',
                '([^\^]{0,35})\^?',
                '([^\^]{0,29})\^?\s*?',
                '\?' 
        );
        var info = tracks[0].match(expr);
        return info;
    }
}

