# aamva.js

small helper library that provides one an ability to parse AAMVA magnetic stripe.
regex was created based on 2012 spec

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

  var res = aamva.stripe(stripe_data);
  console.log("DMV ID:",res.id());
  console.log("First name:",res.name().first);
  console.log("Last name:",res.name().last);
  console.log("Middle name:",res.name().middle);
  console.log("Entire object", res);

/* 
  output: 
  {
    state: 'FL',
    city: 'DELRAYBEACH',
    name: [
        Function
    ],
    address: '4818SFEDERALBLVD',
    iso_iin: '636010',
    dl: '0462172082009',
    expiration_date: '2101',
    birthday: '19829909',
    dl_overflow: '0',
    cds_version: '#',
    jurisdiction_version: '!',
    postal_code: '33435',
    class: 'I',
    restrictions: '',
    endorsments: '',
    sex: '1',
    height: '600',
    weight: '',
    hair_color: '',
    eye_color: '',
    misc: 'ECCECC00000',
    id: [
        Function
    ]
}
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
