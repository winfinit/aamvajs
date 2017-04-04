[![Build Status](https://drone.io/github.com/winfinit/aamvajs/status.png)](https://drone.io/github.com/winfinit/aamvajs/latest)

# aamva.js

small helper library that provides one an ability to parse AAMVA magnetic stripe.
regex was created based on 2012 spec

**NOTE:
To support this effort, please contribute swipe streams for unsupported types
and I would love to add support or fix things that are not working yet**

## Installation

```bash
  npm install aamva -g
```

## Usage

```javascript
  // Generate SSN from random state
  var aamva = require('aamva');

  var stripe_data = '%FLDELRAY BEACH^DOE$JOHN$^4818 S FEDERAL BLVD^           \?\
  ;6360100462172082009=2101198299090=?\
  #! 33435      I               1600                                   ECCECC00000?';

  var barcode_data = '@ANSI 6360100102DL00390190ZF02290063DLDAADOE,JOHNDAG5929 N \
  ROCK STDAIDELRAY SHOREDAJFLDAK44556-     DAQJ621625830080DARI   DAS          \
  DAT     DBA20210108DBB19770204DBC1DBD20120612DBHN         DAU600ZFZFAREPLACED\
  : 00000000ZFB ZFCP771206120090ZFD ZFE07-01-11
  ';

  var res = aamva.stripe(stripe_data);
  console.log("DMV ID:",res.id()); /* D621720820090 */
  console.log("First name:",res.name().first); /* JOHN */
  console.log("Last name:",res.name().last); /* DOE */
  console.log("Middle name:",res.name().middle); /* "" */
  console.log("Sex:",res.sex()); /* MALE, FEMALE, MISSING/INVALID */
  console.log("DOB:",res.birthday()); /* Thu Jan 08 1987 00:00:00 GMT-0500 (EST) */
  console.log("Entire object", res);

  var res2 = aamva.pdf417(barcode_data);
  console.log("DMV ID:",res2.id()); /* D621720820090 */
  console.log("First name:",res2.name().first); /* JOHN */
  console.log("Last name:",res2.name().last); /* DOE */
  console.log("Middle name:",res2.name().middle); /* "" */
  console.log("Sex:",res2.sex()); /* MALE, FEMALE, MISSING/INVALID */
  console.log("DOB:",res2.birthday()); /* Thu Jan 08 1987 00:00:00 GMT-0500 (EST) */
  console.log("Entire object", res2);

/*
  output:
        { state: 'FL',
          city: 'DELRAY BEACH',
          name: [Function],
          address: '4818 S FEDERAL BLVD',
          iso_iin: '636010',
          dl: '0462172082009',
          expiration_date: '2101',
          birthday: [Function],
          dl_overflow: '0',
          cds_version: '#',
          jurisdiction_version: '!',
          postal_code: '33435      ',
          class: 'I ',
          klass: 'I ', // same as 'class'
          restrictions: '          ',
          endorsments: '    ',
          sex: [Function],
          height: '600',
          weight: '   ',
          hair_color: '   ',
          eye_color: '   ',
          misc: '                          ECCECC00000',
          id: [Function] }
*/

```

## Tests

```bash
  npm test
```

## Contributing

If you find a bug or willing to add some enhancement, pull requests are very welcome

## Release History

* 0.0.1 Initial release
* 0.0.2 changed sex to a function
* 0.0.3 accounted for weird space characters
* 0.0.5 removed logging that was left by mistake
* 0.0.7 inflated birthday to a Date object, and fixed FL AAMVA spec, where expiration month is set to birthday month
* 0.0.8 removed debug statements
* 0.0.9 changed birthday to utc date
* 0.0.10 fixed typo
* 0.0.11 added TX support
* 0.0.12 fixed duplicate name key
* 0.0.13 added pdf417 support, added example page, and changed plugin to be compatible with browser
* 0.0.16 fixed version regex for pdf417, and added MD tests.


## Legal

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
