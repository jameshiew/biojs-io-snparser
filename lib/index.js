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
 * @param {Array<string>} args.alleles
 * @param {string} args.chromosome
 * @param {int} args.position
 * @param {string} args.referenceAssembly
 * @param {string} args.rsid
 * @param {string} args.strand
 * @constructor
 */
function SNP(args) {
  this.alleles = args.alleles;
  this.chromosome = args.chromosome;
  this.referenceAssembly = args.referenceAssembly;
  this.rsid = args.rsid;
  this.position = args.position;
  this.strand = args.strand;
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
          alleles: rawSnp.genotype.split(''),
          chromosome: rawSnp.chromosome,
          position: rawSnp.position,
          referenceAssembly: 'GRCh37',
          rsid: rawSnp.rsid.match(/rs\d*/)
            ? rawSnp.rsid
            : undefined,
          strand: '+'
        }));
      }
    }
  });
  return snps;
};
