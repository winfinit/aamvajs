# fake-ssn-node

This is a clone of [**fng-ssn-tools**](https://github.com/corbanworks/fng-ssn-tools) just in node.js

A small library providing one an ability to validate a social security number, 
find a state where SSN was issued, and generate a fake social security numbers
for testing your application.

## Installation

```bash
  npm install ssn -g
```

## Usage

```javascript
  // Generate SSN from random state
  var ssn = require('ssn');
  console.log(ssn.generate());

  // Generate SSN from state of FL
  console.log(ssn.generate('FL'));

  // Validate social security
  if ( ssn.validate('420-19-4933') ) {
        console.log('valid');
  } else {
        console.log('invalid');
  }

  // Get a state where SSN was issued
  var state = ssn.validate('420-19-4933');
  console.log('420-19-4933 was issued in', state);
```

## Tests

```bash
  npm test
```

## Contributing

If you find a bug or willing to add some enhancement, pull requests are very welcome

## Release History

* 0.0,1 Initial release
* 0.0.2 Bug fixes
* 0.0.3 Bug fixes
* 0.0.4 Added validation
* 0.5.0 Added tests and documentation
* 0.5.1 Corrected type in the doc
* 0.5.2 Updated markdown
* 0.5.3 fixed bug with random states selection

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
