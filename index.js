/* based on 2012 aamva dl/id card design standard v1.0 */

module.exports = {
    stripe: function(data) {
        // remove new line characters for easier parsing
        data = data.replace(/\n/, "");
        // replace spaces with regular space
        data = data.replace(/\s/g, " ");

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
            "track3": 82,
            "cdsVersion": 1,
            "jurisdictionVersion": 1,
            "postalCode": 11,
            "class": 2,
            "restrictions": 10,
            "endorsements": 4,
            "sex": 1,
            "height": 3,
            "weight": 3,
            "hairColor": 3,
            "eyeColor": 3,
            "jurisdictionId": 10,
            "reservedSpace": 22,
            "security": 5
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
            console.log(address);
            track1.address = address.substring(0, address.indexOf('^'));
            if ( /\?/.test(address) ) {
                index += (address.substring(0, address.indexOf('?')).length);
            }
            else if ( track1.address.length >= lengthMap.address ) {
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

        var track2 = {
            "startSentinel": undefined,
            "iin": undefined,
            "id": undefined,
            "fieldSeparator": undefined,
            "expirationDate": undefined,
            "birthday": undefined,
            "idOverflow": undefined,
            "endSentinel": undefined
        };

        /*
            start sentinel of track2 
        */
        track2.startSentinel = tracks.substring(index, index + lengthMap.startSentinel);
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
        if ( /\=/.test(track2.id) ) {
            track2.id = track2.id.substring(0, track2.id.indexOf('='));
            index += track2.id.length;
        } else {
            index += lengthMap.id;
        }


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
            index += track2.idOverflow.length + 1;
        }  else if ( /\?/.test(idOverflow) ) {
            track2.idOverflow = idOverflow.substring(0, idOverflow.indexOf('?'));
            index += track2.idOverflow.length;
        }else {
            track2.idOverflow = idOverflow;
            index += lengthMap.idOverflow;
        }

        /* 
            End sentinel: This character shall be after the last 
            data character of the track.
        */

        track2.endSentinel = tracks.substring(index, index + lengthMap.endSentinel);
        index += lengthMap.endSentinel;

        var track3 = {
            "startSentinel": undefined,
            "cdsVersion": undefined,
            "jurisdictionVersion": undefined,
            "postalCode": undefined,
            "class": undefined,
            "restrictions": undefined,
            "endorsements": undefined,
            "sex": undefined,
            "height": undefined,
            "weight": undefined,
            "hairColor": undefined,
            "eyeColor": undefined,
            "jurisdictionId": undefined,
            "reservedSpace": undefined,
            "security": undefined,
            "endSentinel": undefined
        };

        /*
            Start sentinel:
            This character shall be encoded at the beginning of the track.
        */
        track3.startSentinel = tracks.substring(index, index + lengthMap.startSentinel);
        index += lengthMap.startSentinel;

        /*
            CDS Version #:
            This is a decimal value between 0 and 9 that specifies the 
            version level of the mag stripe format. All mag stripes 
            compliant with this current AAMVA standard shall be designated 
            “0”. Should a need arise requiring major revision to the format, 
            this field provides the means to accommodate additional revision.
        */
        track3.cdsVersion = tracks.substring(index, index + lengthMap.cdsVersion);
        index += lengthMap.cdsVersion;

        /*
            Jurisdiction Version #:
            This is a decimal value between 0 and 9 that specifies the 
            jurisdiction version level of the mag stripe format. 
            Notwithstanding iterations of this standard, jurisdictions 
            may implement incremental changes to their mag stripes.
        */
        track3.jurisdictionVersion = tracks.substring(index, index + lengthMap.jurisdictionVersion);
        index += lengthMap.jurisdictionVersion;

        /*
            Postal code:
            For an 11 digit postal or zip code. (left justify fill 
            with spaces, no hyphen)
        */
        track3.postalCode = tracks.substring(index, index + lengthMap.postalCode);
        index += lengthMap.postalCode;

        /*
            Class:
            Represents the type of DL (ANSI codes modified for 
            CDLIS).See I
        */
        track3.class = tracks.substring(index, index + lengthMap.class);
        index += lengthMap.class;

        /*
            Restrictions:
            See i, iii
        */
        track3.restrictions = tracks.substring(index, index + lengthMap.restrictions);
        index += lengthMap.restrictions;

        /*
            Endorsements:
            See i, iii
        */
        track3.endorsements = tracks.substring(index, index + lengthMap.endorsements);
        index += lengthMap.endorsements;

        /*
            Sex:
            1 for male, 2 for female.
        */
        track3.sex = tracks.substring(index, index + lengthMap.sex);
        index += lengthMap.sex;

        /*
            Height:
            See i, iii
        */
        track3.height = tracks.substring(index, index + lengthMap.height);
        index += lengthMap.height;

        /*
            Weight:
            See i, iii
        */
        track3.weight = tracks.substring(index, index + lengthMap.weight);
        index += lengthMap.weight;

        /*
            Hair Color:
            See i, iii
        */
        track3.hairColor = tracks.substring(index, index + lengthMap.hairColor);
        index += lengthMap.hairColor;

        /*
            Eye Color:
            See i, iii
        */
        track3.eyeColor = tracks.substring(index, index + lengthMap.eyeColor);
        index += lengthMap.eyeColor;

        /*
            ID #:
            Discretionary data for use by each jurisdiction.
        */
        track3.jurisdictionId = tracks.substring(index, index + lengthMap.jurisdictionId);
        index += lengthMap.jurisdictionId;

        /*
            Reserved space:
            Discretionary data for use by each jurisdiction.
        */
        track3.reservedSpace = tracks.substring(index, index + lengthMap.reservedSpace);
        index += lengthMap.reservedSpace;

        /*
            Security:
            Discretionary data for use by each jurisdiction.
        */
        track3.security = tracks.substring(index, index + lengthMap.security);
        index += lengthMap.security;

        /*
            End sentinel:
            This character shall be after the last data 
            character of the track.
        */
        track3.endSentinel = tracks.substring(index, index + lengthMap.endSentinel);
        index += lengthMap.endSentinel;

        console.log("tracks", tracks);
        console.log("track1", track1);
        console.log("track2", track2);
        console.log("track3", track3);

        return {
            "state": track1.state,
            "city": track1.city,
            "name": function() {
                var res = track1.name.match(/([^\$]{0,35})\$?([^\$]{0,35})?\$?([^\$]{0,35})?/);
                return {
                    last: res[1],
                    first: res[2],
                    middle: res[3]
                }
            },
            "address": track1.address,
            "iso_iin": track2.iin,
            "dl": track2.id,
            "expiration_date": track2.expirationDate,
            "birthday": function() {
                var dob = track2.birthday.match(/(\d{4})(\d{2})(\d{2})/);
                dob[1] = parseInt(dob[1]);
                dob[2] = parseInt(dob[2]);
                dob[3] = parseInt(dob[3]);

                if (dob[2] === 99) {
                    /* FL decided to reverse 2012 aamva spec, 99 means here 
                        that dob month === to expiration month, it should be 
                        opposite
                        */
                    var exp_dt = track2.expirationDate.match(/(\d{2})(\d{2})/);
                    dob[2] = parseInt(exp_dt[2]);
                }
                dob[2]--;

                return (new Date(Date.UTC(dob[1], dob[2], dob[3])));
            },
            "dl_overflow": track2.idOverflow,
            "cds_version": track3.cdsVersion,
            "jurisdiction_version": track3.jurisdictionVersion,
            "postal_code": track3.postalCode,
            "class": track3.class,
            "restrictions": track3.restrictions,
            "endorsments": track3.endorsments,
            "sex": function() {
                switch(Number(track3.sex)) {
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
            "height": track3.height,
            "weight": track3.weight,
            "hair_color": track3.hairColor,
            "eye_color": track3.eyeColor,
            "reserved_space": track3.reservedSpace,
            "security": track3.security,
            "jurisdictionId": track3.jurisdictionId,
            "id": function(){
                var id;
                switch(this.state) {
                    case "FL":
                        var res = track2.id.match(/(\d{2})(.*)/);
                        id = (String.fromCharCode(Number(res[1]) + 64)  + res[2] + track2.idOverflow);   
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
