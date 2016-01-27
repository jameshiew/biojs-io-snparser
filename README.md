# biojs-io-snparser

[![NPM version](http://img.shields.io/npm/v/biojs-io-snparser.svg)](https://www.npmjs.org/package/biojs-io-snparser)

Parse raw SNP data into Javascript objects.

The ultimate aim of this component is to be able to parse the raw data from various direct-to-consumer (DTC) SNP
genotyping services into a standardised Javascript representation. The API is currently unstable and will likely
change.

Currently, raw data from the following services are supported:
* 23andMe

## Getting Started
Install the module with: `npm install biojs-io-snparser`

All supported formats are listed in the `supportedFormats` array.
```javascript
> require('biojs-io-snparser').supportedFormats
[ '23andMe-2015-07-22' ]
```

All parsing is done asynchronously via the `parseAsync` method, which returns a Promise which holds the array of newly constructed SNP objects once parsing is done.
```javascript
> snparser = require('biojs-io-snparser')
{ SNP: { init: [Function: init] },
  formats:
   Map {
     '23andMe-2015-07-22' => { dialect: [Object], converter: [Function: convert] } },
  supportedFormats: [ '23andMe-2015-07-22' ],
  parseAsync: [Function: parseAsync] }
> rawData = fs.readFileSync('/home/xyz/raw_genotype_data.txt', 'UTF-8'); null
null
> snpsPromise = snparser.parseAsync({data: rawData, format: snparser.formats.get('23andMe-2015-07-22')})
Promise { <pending> }
> snpsPromise.then(snps => console.log(snps.length))
Promise { <pending> }
> 960614

> snpsPromise.then(snps => console.log(snps[42]))
Promise { <pending> }
> { alleles: [ 'G', 'G' ],
  chromosome: 1,
  referenceAssembly: 'GRCh37',
  rsid: 'rs3737728',
  position: 1021415,
  strand: '+' }

```

## Contributing

All contributions are welcome.

## Support

If you have any problem or suggestions, please open an issue [here](https://github.com/jameshiew/biojs-io-snparser/issues).

## License 

The MIT License

Copyright (c) 2015 James Hiew

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

## Disclaimers

This project is not associated with or endorsed in any way by 23andMe.

23andMe is a registered trademark of 23andMe, Inc — http://www.23andMe.com