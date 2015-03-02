
module.exports = {
    stripe: function(data) {
        data = data.replace(/\n/, "");
        // replace spaces with regular space
        data = data.replace(/\s/g, " ");
        var track = data.match(/(.*?\?)(.*?\?)(.*?\?)/);
        var res1 = track[1].match(/(\%)([A-Z]{2})([^\^]{0,13})\^?([^\^]{0,35})\^?([^\^]{0,29})\^?\s*?\?/);
        var res2 = track[2].match(/(;)(\d{6})(\d{0,13})(\=)(\d{4})(\d{8})(\d{0,5})\=?\?/);
        var res3 = track[3].match(/(\#|\%)(\d|\!|\")(\d|\s)([0-9A-Z ]{11})([0-9A-Z ]{2})([0-9A-Z ]{10})([0-9A-Z ]{4})([12 ]{1})([0-9A-Z ]{3})([0-9A-Z ]{3})([0-9A-Z ]{3})([0-9A-Z ]{3})(.*?)\?/);

        var tracks = data;

        var lengthMap = {
            "track1": 82,
            "startSentinel": 1,
            "state": 2,
            "city": 13,
            "name": 35,
            "address": 29,
            "endSentinel": 1,
            "track2": 40,
            "iin": 6,
            "id": 13,
            "fieldSeparator": 1,
            "expirationDate": 4,
            "birthday": 8,
            "idOverflow": 5,
        };

 
        var track1 = {
            "startSentinel": undefined,
            "state": undefined,
            "city": undefined,
            "name": undefined,
            "address": undefined,
            "endSentinel": undefined
        };


        var index = 0;
        /*
            Start sentinel: This character must be encoded at the beginning 
            of the track.
        */
        track1.startSentinel = tracks.substring(index, lengthMap.startSentinel);
        index += lengthMap.startSentinel;
        /*
            State or province: Mailing or residential code.
        */
        track1.state = tracks.substring(index, index + lengthMap.state);
        index += lengthMap.state;
        /*
            City: This field shall be truncated with a field separator ^ 
            if less than 13 characters long. If the city is exactly 
            13 characters long then no field separator is used (see i).
            Richfield^
        */
        var city = tracks.substring(index, index + lengthMap.city);
        if ( /\^/.test(city) ) {
            track1.city = city.substring(0,city.indexOf('^'));
            index += ++track1.city.length;
        } else {
            track1.city = city;
            index += 13;
        }

        /*
            Name: Priority is as follows, spaces allowed; 
            familyname$givenname$suffix This field shall be truncated 
            with a field separator ^ if less than 35 characters long. 
            The “$” symbol is used as a delimiter between names (see i & iii).
        */
        var name = tracks.substring(index, index + lengthMap.name);
        if ( /\^/.test(name) ) {
            track1.name = name.substring(0, name.indexOf('^'));
            index += ++track1.name.length;
        } else {
            track1.name = name;
            index += lengthMap.name
        }

        /*
            The street number shall be as it would appear on mail. The $ is 
            used as a delimiter between address lines. This field shall be 
            truncated with a field separator (or padded with spaces) if less 
            than 29 characters long but can be longer (see i).
            28 Atol Av$Suite 2$^
            Hiawatha Park$Apt 2037^
            340 Brentwood Dr.$Fall Estate^
        */
        var addressMaxLength = (lengthMap.track1 - index - lengthMap.endSentinel);
        var address = tracks.substring(index, index + addressMaxLength);
        if ( /\^/.test(address) ) {
            track1.address = address.substring(0, address.indexOf('^'));
            if ( track1.address.length >= lengthMap.address ) {
                index += ++track1.address.length;
            } else {
                index += lengthMap.address + 2;
            }
        } else {
            track1.address = address;
            index += lengthMap.address;
        }

        /*
            This character shall be after the last data character of the track.
        */
        track1.endSentinel = tracks.substring(index, index + lengthMap.endSentinel);
        index += lengthMap.endSentinel;

        console.log(track1);
        var track2 = {
            "iin": undefined,
            "id": undefined,
            "fieldSeparator": undefined,
            "expirationDate": undefined,
            "birthday": undefined,
            "idOverflow": undefined,
            "endSentinel": undefined
        };

        /*
            skipping start sentinel of track2 
        */
        index += lengthMap.startSentinel;

        /*
            This is the assigned identification number from ISO. This number 
            shall always begin with a “6”.
            This number shall be obtained from the AAMVA Standards Assistant.
        */
        track2.iin = tracks.substring(index, index + lengthMap.iin);
        index += lengthMap.iin;

        /*
            This field is used to represent the DL/ID number assigned by each 
            jurisdiction.
            Overflow for DL/ID numbers longer than 13 characters is 
            accommodated in field number 7.
        */
        track2.id = tracks.substring(index, index + lengthMap.id);
        index += lengthMap.id;

        /*
            A field separator must be used after the DL/ID number 
            regardless of length.
        */
        track2.fieldSeparator = tracks.substring(index, index + lengthMap.fieldSeparator);
        index += lengthMap.fieldSeparator;

        /*
            This field is in the format: YYMM
            If MM=77 then license is “non- expiring”.
            If MM=88 the Expiration Date is after the last day of their 
            birth month One Year from the Month (MM) of Field 6 and the 
            Year (YY) of Field 5 (Expiration Date).
            If MM=99 then the Expiration Date is on the Month (MM) and 
            Day (DD) of Field 6 (Birthdate) and the Year (YY) of Field 5 
            (Expiration Date).
        */
        track2.expirationDate = tracks.substring(index, index + lengthMap.expirationDate);
        index += lengthMap.expirationDate;

        /*
            This field is in the format: CCYYMMDD
        */
        track2.birthday = tracks.substring(index, index + lengthMap.birthday);
        index += lengthMap.birthday;

        /*
            Overflow for numbers longer than 13 characters. If no 
            information is used then a field separator is used in this 
            field.
        */

        var idOverflow = tracks.substring(index, index + lengthMap.idOverflow);
        if ( (new RegExp(track2.fieldSeparator)).test(idOverflow) ) {
            track2.idOverflow = idOverflow.substring(0, idOverflow.indexOf(track2.fieldSeparator));
            index += ++track2.idOverflow.length;
        } else {
            track2.idOverflow = idOverflow;
            index += lengthMap.idOverflow;
        }

        index += lengthMap.idOverflow;



        console.log("track2", track2);


        return {
            "state": res1[2],
            "city": res1[3],
            "name": function() {
                var res = res1[4].match(/([^\$]{0,35})\$?([^\$]{0,35})?\$?([^\$]{0,35})?/);
                return {
                    last: res[1],
                    first: res[2],
                    middle: res[3]
                }
            },
            "address": res1[5],
            "iso_iin": res2[2],
            "dl": res2[3],
            "expiration_date": res2[5],
            "birthday": function() {
                var dob = res2[6].match(/(\d{4})(\d{2})(\d{2})/);
                dob[1] = parseInt(dob[1]);
                dob[2] = parseInt(dob[2]);
                dob[3] = parseInt(dob[3]);

                if (dob[2] === 99) {
                    /* FL decided to reverse 2012 aamva spec, 99 means here 
                        that dob month === to expiration month, it should be 
                        opposite
                        */
                    var exp_dt = res2[5].match(/(\d{2})(\d{2})/);
                    dob[2] = parseInt(exp_dt[2]);
                }
                dob[2]--;

                return (new Date(Date.UTC(dob[1], dob[2], dob[3])));
            },
            "dl_overflow": res2[7],
            "cds_version": res3[1],
            "jurisdiction_version": res3[2],
            "postal_code": res3[4],
            "class": res3[5],
            "restrictions": res3[6],
            "endorsments": res3[7],
            "sex": function() {
                switch(Number(res3[8])) {
                    case 1:
                        return "MALE";
                        break;
                    case 2:
                        return "FAMALE";
                        break;
                    default:
                        return "MISSING/INVALID";
                        break;
                }
            },
            "height": res3[9],
            "weight": res3[10],
            "hair_color": res3[11],
            "eye_color": res3[12],
            "misc": res3[13],
            "id": function(){
                var id;
                switch(this.state) {
                    case "FL":
                        var res = res2[3].match(/(\d{2})(.*)/);
                        id = (String.fromCharCode(Number(res[1]) + 64)  + res[2] + res2[7]);   
                        break;                 
                    default:
                        id = res2[3];
                        break;
                }
                return id;
            }
        };
    }
}
