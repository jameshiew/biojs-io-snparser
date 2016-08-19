# biojs-io-snparser

[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM version](http://img.shields.io/npm/v/biojs-io-snparser.svg)](https://www.npmjs.org/package/biojs-io-snparser)
[![Build Status](https://travis-ci.org/jameshiew/biojs-io-snparser.svg)](https://travis-ci.org/jameshiew/biojs-io-snparser)
[![dependencies Status](https://david-dm.org/jameshiew/biojs-io-snparser/status.svg)](https://david-dm.org/jameshiew/biojs-io-snparser)

Parse raw SNP data into Javascript objects.

The ultimate aim of this component is to be able to parse the raw data from various direct-to-consumer (DTC) SNP
genotyping services into a standardised Javascript representation. The API is currently unstable and will likely
change.

Currently, only raw data from 23andMe is supported.

## Getting Started
Install the module with: `npm install biojs-io-snparser`

All supported formats are listed in the `supportedFormats` array.
```javascript
> require('biojs-io-snparser').supportedFormats
[ '23andMe-2015-07-22' ]
```

All parsing is done asynchronously via the `parseAsync` method, which returns a `Promise` which holds the array of newly constructed `SNP` objects once parsing is done.
```javascript
> snparser = require('biojs-io-snparser')
{ SNP: { init: [Function: init] },
  formats:
   Map {
     '23andMe-2015-07-22' => { dialect: [Object], converter: [Function: convert] } },
  supportedFormats: [ '23andMe-2015-07-22' ],
  parseAsync: [Function: parseAsync] }
> rawData = fs.readFileSync('/home/xyz/raw_genotype_data.txt', 'UTF-8'); null  // null is used to suppress output to the console
null
> snpsPromise = snparser.parseAsync({data: rawData, format: '23andMe-2015-07-22'})
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

## Disclaimers

This project is not associated with or endorsed in any way by 23andMe.

23andMe is a registered trademark of 23andMe, Inc — https://www.23andMe.com