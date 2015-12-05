/*
 * biojs-io-snparser
 * https://github.com/jameshiew/biojs-io-snparser
 *
 * Copyright (c) 2015 James Hiew
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const csv = require('csv');

const CHROMOSOMES = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  'X',
  'Y',
  'MT'
];

const DIALECTS = {
  '23andMe-2015-07-22': {
    auto_parse: true,
    columns: [
      'rsid',
      'chromosome',
      'position',
      'genotype'
    ],
    comment: '#',
    delimiter: '\t',
    quote: ''
  }
};


/**
 * Encapsulates a SNP.
 *
 * @param {Object} args
 * @param {string} args.rsid
 * @param {string} args.chromosome
 * @param {int} args.position
 * @param {Array<string>} args.alleles
 * @constructor
 */
function SNP(args) {
  this.rsid = args.rsid;
  this.chromosome = args.chromosome;
  this.position = args.position;
  this.alleles = args.alleles;
}


/**
 * Parse raw data into SNP Javascript objects.
 *
 * @param {Object} options
 * @param {string} options.data - contents of the raw data set
 * @param {string} options.format - e.g. '23andMe-2015-07-22'
 * @return {Array<SNP>}
 */
module.exports.parse = function parse(options) {
  // validate arguments
  const dialect = DIALECTS[options.format];
  if (!dialect) {
    throw new Error('Unrecognised format specified: ' + options.format);
  }

  // parse to SNP objects sychronously
  let snps = [];
  csv.parse(options.data, dialect, function(error, output) {
    if (error) {
      throw error;
    }
    if (options.format === '23andMe-2015-07-22') {
      for (let rawSnp of output) {
        snps.push(new SNP({
          rsid: rawSnp.rsid.match(/rs\d*/)
            ? rawSnp.rsid
            : undefined,
          chromosome: rawSnp.chromosome,
          position: rawSnp.position,
          alleles: rawSnp.genotype.split('')
        }));
      }
    }
  });
  return snps;
};
