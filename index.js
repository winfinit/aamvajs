
(function(global) {

    var parse = function(data) {
        data = data.replace(/\n/, "");
        // replace spaces with regular space
        data = data.replace(/\s/g, " ");

        if ( /^@/.test(data) === true ) {
            return pdf417(data);
        } else if ( /^%/.test(data) === true  ) {
            return stripe(data);
        } else {
            console.log('couldnt identify format');
        }
    };

    var parseDate = function(date) {
      var start = parseInt(date[0] + date[1]);
      if (start < 13) {
        return date[4] + date[5] + date[6] + date[7] + date[0] + date[1] + date[2] + date[3];
      }
      return date;
    };

    var stripe = function(data) {
        data = data.replace(/\n/, "");
        // replace spaces with regular space
        data = data.replace(/\s/g, " ");
        var track = data.match(/(.*?\?)(.*?\?)(.*?\?)/);
        var res1 = track[1].match(/(\%)([A-Z]{2})([^\^]{0,13})\^?([^\^]{0,35})\^?([^\^]{0,29})\^?\s*?\?/);
        var res2 = track[2].match(/(;)(\d{6})(\d{0,13})(\=)(\d{4})(\d{8})(\d{0,5})\=?\?/);
        var res3 = track[3].match(/(\#|\%|\+)(\d|\!|\")(\d|\s)([0-9A-Z ]{11})([0-9A-Z ]{2})([0-9A-Z ]{10})([0-9A-Z ]{4})([12 ]{1})([0-9A-Z ]{3})([0-9A-Z ]{3})([0-9A-Z ]{3})([0-9A-Z ]{3})(.*?)\?/);
        var state = res1[2];
        return {
            "state": state,
            "city": res1[3],
            "name": function() {
                var res = res1[4].match(/([^\$]{0,35})\$?([^\$]{0,35})?\$?([^\$]{0,35})?/);
                if (!res) return;
                return {
                    last: res[1],
                    first: res[2],
                    middle: res[3]
                }
            }(),
            "address": res1[5],
            "iso_iin": res2[2],
            "dl": res2[3],
            "expiration_date": parseDate(res2[5]),
            "birthday": function() {
              var dob = res2[6].match(/(\d{4})(\d{2})(\d{2})/);
              if (!dob) return;

              if (dob[2] === '99') {
                  /* FL decided to reverse 2012 aamva spec, 99 means here
                      that dob month === to expiration month, it should be
                      opposite
                      */
                  var exp_dt = res2[5].match(/(\d{2})(\d{2})/);
                  dob[2] = exp_dt[2];
              }
              //dob[2]--; what was this for?
              return dob[1] + dob[2] + dob[3];
            }(),
            "dl_overflow": res2[7],
            "cds_version": res3[1],
            "jurisdiction_version": res3[2],
            "postal_code": res3[4],
            "klass": res3[5],
            "class": res3[5],
            "restrictions": res3[6],
            "endorsments": res3[7],
            "sex": function() {
                switch(Number(res3[8])) {
                    case 1:
                        return "MALE";
                        break;
                    case 2:
                        return "FEMALE";
                        break;
                    default:
                        return "MISSING/INVALID";
                        break;
                }
            }(),
            "height": res3[9],
            "weight": res3[10],
            "hair_color": res3[11],
            "eye_color": res3[12],
            "misc": res3[13],
            "id": function(){
                var id;
                switch(state) {
                    case "FL":
                        var res = res2[3].match(/(\d{2})(.*)/);
                        if (!res) return;
                        id = (String.fromCharCode(Number(res[1]) + 64)  + res[2] + res2[7]);
                        break;
                    default:
                        id = res2[3];
                        break;
                }
                return id;
            }()
        };
    };

    var pdf417 = function(data) {
        if (data.indexOf('\n') > -1) {
            data = data.split('\n')[1];
            data = data.replace(/\n/, "");
        }
        // replace spaces with regular space
        data = data.replace(/\s/g, " ");

        // get version of aamva (before 2000 or after)
        var version = data.match(/[A-Z ]{5}\d{6}(\d{2})/);

        var parseRegex;

        /* version 01 year 2000 */
        switch (Number(version[1])) {
          case 1: {
              parseRegex = new RegExp(
                  '(DAQ.*?)?' + // Drivers license number
                  '(DAA.*?)?' + // Driver License Name
                  '(DAG.*?)?' + // Driver Mailing Street Address
                  '(DAI.*?)?' + // Driver Mailing City
                  '(DAJ.*?)?' + // Driver Mailing Jurisdiction Code
                  '(DAK.*?)?' + // Driver Mailing Postal Code
                  '(DAQ.*?)?' + // Driver License/ID Number
                  '(DAR.*?)?' + // Driver License Classification Code
                  '(DAS.*?)?' + // Driver License Restriction Code
                  '(DAT.*?)?' + // Driver License Endorsements Code
                  '(DBA.*?)?' + // Driver License Expiration Date
                  '(DBB.*?)?' + // Date of Birth
                  '(DBC.*?)?' + // Driver Sex
                  '(DBD.*?)?' + // Driver License or ID Document Issue Date
                  /* optional
                  '(DAU.*?)?' + // Height (FT/IN)
                  '(DAW.*?)?' + // Weight (LBS)
                  '(DAY.*?)?' + // Eye Color
                  '(DAZ.*?)?' + // Hair Color
                  '(DBK.*?)?' + // Social Security Number
                  '(PAA.*?)?' + // Driver Permit Classification Code
                  '(PAB.*?)?' + // Driver Permit Expiration Date
                  '(PAC.*?)?' + // Permit Identifier
                  '(PAD.*?)?' + // Driver Permit Issue Date
                  '(PAE.*?)?' + // Driver Permit Restriction Code
                  '(PAF.*?)?' + // Driver Permit Endorsement Code
                  '(DAB.*?)?' + // Driver Last Name
                  '(DAC.*?)?' + // Driver First Name
                  '(DAD.*?)?' + // Driver Middle Name or Initial
                  '(DAE.*?)?' + // Driver Name Suffix
                  '(DAF.*?)?' + // Driver Name Prefix
                  '(DAH.*?)?' + // Driver Mailing Street Address 2
                  '(DAL.*?)?' + // Driver Residence Street Address 1
                  '(DAM.*?)?' + // Driver Residence Street Address 2
                  '(DAN.*?)?' + // Driver Residence City
                  '(DAO.*?)?' + // Driver Residence Jurisdiction Code
                  '(DAP.*?)?' + // Driver Residence Postal Code
                  '(DAV.*?)?' + // Height (CM)
                  '(DAX.*?)?' + // Weight (KG)
                  '(DBE.*?)?' + // Issue Timestamp
                  '(DBF.*?)?' + // Number of Duplicates
                  '(DBG.*?)?' + // Medical Indicator/Codes
                  '(DBH.*?)?' + // Organ Donor
                  '(DBI.*?)?' + // Non-Resident Indicator
                  '(DBJ.*?)?' + // Unique Customer Identifier
                  '(DBL.*?)?' + // Driver "AKA" Date Of Birth
                  '(DBM.*?)?' + // Driver "AKA" Social Security Number
                  '(DBN.*?)?' + // Driver "AKA" Name
                  '(DBO.*?)?' + // Driver "AKA" Last Name
                  '(DBP.*?)?' + // Driver "AKA" First Name
                  '(DBQ.*?)?' + // Driver "AKA" Middle Name
                  '(DBR.*?)?' + // Driver "AKA" Suffix
                  '(DBS.*?)?'   // Driver "AKA" Prefix
                  */
                  '$'
              );
            break;
          }
          /* version 02 year 2003 */
          case 2: {
              parseRegex = new RegExp(
                  '(DCA.*?)?' + // Jurisdiction-specific vehicle class
                  '(DCB.*?)?' + // Jurisdiction-specific restriction codes
                  '(DCD.*?)?' + // Jurisdiction-specific endorsement codes
                  '(DBA.*?)?' + // Document Expiration Date
                  '(DCS.*?)?' + // Customer Family Name

                  '(DCT.*?)?' + // Customer Given Names

                  '(DCU.*?)?' + // Name Suffix
                  '(DBD.*?)?' + // Document Issue Date
                  '(DBB.*?)?' + // Date of Birth

                  '(DBC.*?)?' + // Physical Description – Sex
                  '(DAY.*?)?' + // Physical Description – Eye Color
                  '(DAU.*?)?' + // Physical Description – Height
                  '(DCE.*?)?' + // Physical Description – Weight Range

                  '(DAG.*?)?' + // Address – Street 1
                  '(DAI.*?)?' + // Address – City
                  '(DAJ.*?)?' + // Address – Jurisdiction Code
                  '(DAK.*?)?' + // Address – Postal Code
                  '(DAQ.*?)?' + // Customer ID Number
                  '(DCF.*?)?' + // Document Discriminator
                  '(DCG.*?)?' + // Country Identification
                  '(DCH.*?)?' + // Federal Commercial Vehicle Codes

                  /* optional elements
                  '(DAH.*?)?' + // Address – Street 2
                  '(DAZ.*?)?' + // Hair color
                  '(DCI.*?)?' + // Place of birth
                  '(DCJ.*?)?' + // Audit information
                  '(DCK.*?)?' + // Inventory control number
                  '(DBN.*?)?' + // Alias / AKA Family Name
                  '(DCL.*?)?' + // Race / ethnicity

                  '(DCM.*?)?' + // Standard vehicle classification
                  '(DCN.*?)?' + // Standard endorsement code
                  '(DCO.*?)?' + // Standard restriction code
                  '(DCP.*?)?' + // Jurisdiction- specific vehicle classification description
                  '(DCQ.*?)?' + // Jurisdiction- specific endorsement code description
                  '(DCR.*?)?'  // Jurisdiction- specific restriction code description
                  */
                  '$'
              );
              break;
          }
          /* version 03 year 2005 */
          case 3: {
              parseRegex = new RegExp(
                  '(DCA.*?)?' + // Jurisdiction-specific vehicle class
                  '(DCB.*?)?' + // Jurisdiction-specific restriction codes
                  '(DCD.*?)?' + // Jurisdiction-specific endorsement codes
                  '(DBA.*?)?' + // Document Expiration Date
                  '(DCS.*?)?' + // Customer Family Name
                  '(DCT.*?)?' + // Customer Given Names
                  '(DBD.*?)?' + // Document Issue Date
                  '(DBB.*?)?' + // Date of Birth
                  '(DBC.*?)?' + // Physical Description – Sex
                  '(DAY.*?)?' + // Physical Description – Eye Color
                  '(DAU.*?)?' + // Physical Description – Height
                  '(DAG.*?)?' + // Address – Street 1
                  '(DAI.*?)?' + // Address – City
                  '(DAJ.*?)?' + // Address – Jurisdiction Code
                  '(DAK.*?)?' + // Address – Postal Code
                  '(DAQ.*?)?' + // Customer ID Number
                  '(DCF.*?)?' + // Document Discriminator
                  '(DCG.*?)?' + // Country Identification
                  '(DCH.*?)?' + // Federal Commercial Vehicle Codes
                  /* optional elements
                  + '(DAH.*?)?' + // Address – Street 2
                  '(DAZ.*?)?' + // Hair color
                  '(DCI.*?)?' + // Place of birth
                  '(DCJ.*?)?' + // Audit information
                  '(DCK.*?)?' + // Inventory control number
                  '(DBN.*?)?' + // Alias / AKA Family Name
                  '(DBG.*?)?' + // Alias / AKA Given Name
                  '(DBS.*?)?' + // Alias / AKA Suffix Name
                  '(DCU.*?)?' + // Name Suffix
                  '(DCE.*?)?' + // Physical Description – Weight Range
                  '(DCL.*?)?' + // Race / ethnicity
                  '(DCM.*?)?' + // Standard vehicle classification
                  '(DCN.*?)?' + // Standard endorsement code
                  '(DCO.*?)?' + // Standard restriction code
                  '(DCP.*?)?' + // Jurisdiction- specific vehicle classification description
                  '(DCQ.*?)?' + // Jurisdiction- specific endorsement code description
                  '(DCR.*?)?'  // Jurisdiction- specific restriction code description
                  */
                  '$'
              );
              break;
          }
          case 6: {
            parseRegex = new RegExp(
              '(DAQ.*?)?' +
              '(DCS.*?)?' +
              '(DDE.*?)?' +
              '(DAC.*?)?' +
              '(DDF.*?)?' +
              '(DAD.*?)?' +
              '(DDG.*?)?' +
              '(DCA.*?)?' +
              '(DCB.*?)?' +
              '(DCD.*?)?' +
              '(DBD.*?)?' +
              '(DBB.*?)?' +
              '(DBA.*?)?' +
              '(DBC.*?)?' +
              '(DAU.*?)?' +
              '(DAY.*?)?' +
              '(DAG.*?)?' +
              '(DAI.*?)?' +
              '(DAJ.*?)?' +
              '(DAK.*?)?' +
              '(DCF.*?)?' +
              /* optional */
              '$'
            );
            break;
          }
          /* version 07 year 2012 */
          case 7: {
              parseRegex = new RegExp(
                  '(DCA.*?)?' + // Jurisdiction-specific vehicle class
                  '(DCB.*?)?' + // Jurisdiction-specific restriction codes
                  '(DCD.*?)?' + // Jurisdiction-specific endorsement codes
                  '(DBA.*?)?' + // Document Expiration Date
                  '(DCS.*?)?' + // Customer Family Name
                  '(DAC.*?)?' + // Customer First Name
                  '(DAD.*?)?' + // Customer Middle Name(s)
                  '(DBD.*?)?' + // Document Issue Date
                  '(DBB.*?)?' + // Date of Birth
                  '(DBC.*?)?' + // Physical Description – Sex
                  '(DAY.*?)?' + // Physical Description – Eye Color
                  '(DAU.*?)?' + // Physical Description – Height
                  '(DAG.*?)?' + // Address – Street 1
                  '(DAI.*?)?' + // Address – City
                  '(DAJ.*?)?' + // Address – Jurisdiction Code
                  '(DAK.*?)?' + // Address – Postal Code
                  '(DAQ.*?)?' + // Customer ID Number
                  '(DCF.*?)?' + // Document Discriminator
                  '(DCG.*?)?' + // Country Identification
                  '(DDE.*?)?' + // Family name truncation
                  '(DDF.*?)?' + // First name truncation
                  '(DDG.*?)?' + // Middle name truncation
                  /* optional elements
                  '(DAH.*?)?' + // Address – Street 2
                  '(DAZ.*?)?' + // Hair color
                  '(DCI.*?)?' + // Place of birth
                  '(DCJ.*?)?' + // Audit information
                  '(DCK.*?)?' + // Inventory control number
                  '(DBN.*?)?' + // Alias / AKA Family Name
                  '(DBG.*?)?' + // Alias / AKA Given Name
                  '(DBS.*?)?' + // Alias / AKA Suffix Name
                  '(DCU.*?)?' + // Name Suffix
                  '(DCE.*?)?' + // Physical Description – Weight Range
                  '(DCL.*?)?' + // Race / ethnicity
                  '(DCM.*?)?' + // Standard vehicle classification
                  '(DCN.*?)?' + // Standard endorsement code
                  '(DCO.*?)?' + // Standard restriction code
                  '(DCP.*?)?' + // Jurisdiction- specific vehicle classification description
                  '(DCQ.*?)?' + // Jurisdiction- specific endorsement code description
                  '(DCR.*?)?' + // Jurisdiction- specific restriction code description
                  '(DDA.*?)?' + // Compliance Type
                  '(DDB.*?)?' + // Card Revision Date
                  '(DDC.*?)?' + // HAZMAT Endorsement Expiration Date
                  '(DDD.*?)?' + // Limited Duration Document Indicator
                  '(DAW.*?)?' + // Weight (pounds)
                  '(DAX.*?)?' + // Weight (kilograms)
                  '(DDH.*?)?' + // Under 18 Until
                  '(DDI.*?)?' + // Under 19 Until
                  '(DDJ.*?)?' + // Under 21 Until
                  '(DDK.*?)?' + // Organ Donor Indicator
                  '(DDL.*?)?'   // Veteran Indicator
                  */
                  '$'
              );
              break;
          }
          case 4:
          case 8:
          case 9: {
            var prefixes = [
                'DCA', // jurisdiction vehicle class
                'DCB', // jurisdiction restriction codes
                'DCD', // jurisdiction endorsement codes
                'DBA', // doc. expiration date
                'DCS', // customer family name
                'DAC', // first name
                'DAD', // middle names (comma seperated)
                'DBD', // doc. issue date
                'DBB', // date of birth (MMDDCCYY for U.S., CCYYMMDD for Canada)
                'DBC', // gender (1-name, 2-female, 9-not specified)
                'DAY', // eye color (ansi d-20 codes)
                'DAU', // height
                'DAG', // street 1
                'DAI', // city
                'DAJ', // state
                'DAK', // zip
                'DAQ', // customer id number
                'DCF', // doc. distriminator
                'DCG', // country identification (USA/CAN)
                'DDE', // last name truncated (T-trucated, N-not, U-unknown)
                'DDF', // first name truncated (T-trucated, N-not, U-unknown)
                'DDG', // middle name truncated (T-trucated, N-not, U-unknown)
                // optionals
                'DAH', // street address line 2
                'DAZ', // hair color
                'DCI', // place of birth
                'DCJ', // audit info
                'DCK', // inventory control number
                'DBN', // alias last name
                'DBG', // alias first name
                'DBS', // aliast suffix name
                'DCU', // name suffix . (JR, SR, 1ST, 2ND...)
                'DCE', // weight range
                'DCL', // race / ethnicity (AAMVA D20 code)
                'DCM', // vehicle classification
                'DCN', // standard endorsement code
                'DCO', // standard restriction code
                'DCP', // vehicle classification description
                'DCQ', // endorsement code description
                'DCR', // restriction code description
                'DDA', // compliance type
                'DDB', // card revision date
                'DDC', // hazmat endorsement exp. date
                'DDD', // limited duration doc. indicator
                'DAW', // weight lbs
                'DAX', // weight kg
                'DDH', // under 18 until, date turns 18 (MMDDCCYY for U.S., CCYYMMDD for Canada)
                'DDI', // under 19 until, date turns 19 (MMDDCCYY for U.S., CCYYMMDD for Canada)
                'DDJ', // under 21 until, date turns 21 (MMDDCCYY for U.S., CCYYMMDD for Canada)
                'DDK', // organ donor (1-yes)
                'DDL' // veteran indicator (1-yes)
            ];
            var regExStr = '';
            var prefixIdxs = [];
            for (var i = 0; i < prefixes.length; i++) {
                var idx = data.indexOf(prefixes[i]);
                if (idx !== -1) {
                    prefixIdxs.push({
                        prefix: prefixes[i],
                        index: idx
                    });
                }
            }
            // if prefixes are not in order as found in the string, the regex will not perform as expected
            prefixIdxs.sort((a,b) => (a.index > b.index) ? 1 : -1);
            prefixIdxs.forEach(obj => regExStr += `(${obj.prefix}.*?)?`);
            regExStr += '$';

            parseRegex = new RegExp(regExStr);
            break;
          }
          default: {
              console.log('unable to get version', version);
              // probably not a right parse...
          }
        }

        var parsedData = {};
        var res = data.match(parseRegex);

        for ( var i = 1; i < res.length; i++ ) {
            if ( res[i] !== undefined ) {
                var str = res[i].substring(3).trim();
                if (str[str.length-1] === ".")
                    str = str.substring(0,str.length-1);
                parsedData[ String(res[i]).substring(0,3) ] = str;
            }
        }

        switch( Number(version[1]) ) {
            case 1: {
                // version one joining all of the names in one string
                var name = parsedData.DAA.split(',');
                parsedData.DCS = name[0];
                parsedData.DAC = name[1];
                parsedData.DAD = name[2];

                // drivers license class
                parsedData.DCA = parsedData.DAR;

                // date on 01 is CCYYMMDD while on 07 MMDDCCYY
                parsedData.DBB = (
                    parsedData.DBB.substring(4,6) +  // month
                    parsedData.DBB.substring(6,8) +  // day
                    parsedData.DBB.substring(0,4)    // year
                );
                break;
            }
            case 3: {
                // version 3 putting middle and first names in the same field
                var name = parsedData.DCT.split(',');
                parsedData.DAC = name[0]; // first name
                parsedData.DAD = name[1]; // middle name
                break;
            }
            default: {
                console.log("no version matched");
                break;
            }
        };

        console.log(parsedData);

        var rawData = {
            "state": parsedData.DAJ,
            "city": parsedData.DAI,
            "name": function() {
                return {
                    last: parsedData.DCS,
                    first: parsedData.DAC,
                    middle: parsedData.DAD
                }
            }(),
            "address": parsedData.DAG,
            "iso_iin": undefined,
            "dl": parsedData.DAQ,
            "expiration_date": parseDate(parsedData.DBA),
            "birthday": function() {
              if (!parsedData.DBB) return;
              var match = parsedData.DBB.match(/(\d{2})(\d{2})(\d{4})/);
              if (!match) return;
              return match[3] + match[1] + match[2];
            }(),
            "dl_overflow": undefined,
            "cds_version": undefined,
            "jurisdiction_version": undefined,
            "postal_code": parsedData.DAK ? (parsedData.DAK.match(/\d{-}\d+/) ? parsedData.DAK : parsedData.DAK.substring(0,5)) : undefined,
            "klass": parsedData.DCA,
            "class": parsedData.DCA,
            "restrictions": undefined,
            "endorsments": undefined,
            "sex": function() {
                switch( Number(parsedData.DBC) ) {
                    case 1:
                        return "MALE";
                        break;
                    case 2:
                        return "FEMALE";
                        break;
                    default:
                        if (parsedData.DBC[0] === 'M') {
                          return 'MALE';
                        } else if (parsedData.DBC[0] === 'F') {
                          return 'FEMALE';
                        }
                        return "MISSING/INVALID";
                        break;
                }
            }(),
            "height": undefined,
            "weight": undefined,
            "hair_color": undefined,
            "eye_color": undefined,
            "misc": undefined,
            "id": function(){
                if (!parsedData.DAQ) return;
                return parsedData.DAQ.replace(/[^A-ZA-Z0-9]/g, "");
            }()
        };

        return rawData;
    };



  global.parse = parse;
  global.stripe = stripe;
  global.pdf417 = pdf417;

}(this));
