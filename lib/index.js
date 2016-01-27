/*
 * biojs-io-snparser
 * https://github.com/jameshiew/biojs-io-snparser
 *
 * Copyright (c) 2015 James Hiew
 * Licensed under the MIT license.
 */

'use strict'

const csv = {
  parse: require('csv-parse')
}

const SNP = {
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
   */
  init: function init (args) {
    this.alleles = args.alleles
    this.chromosome = args.chromosome
    this.referenceAssembly = args.referenceAssembly
    this.rsid = args.rsid
    this.position = args.position
    this.strand = args.strand
    return this
  }
}

/** @type {Map<string, !Object>} */
const dialects = new Map()
/** @type {Map<string, !function(Object):SNP>} */
const converters = new Map()

dialects.set('23andMe-2015-07-22', {
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
})
converters.set('23andMe-2015-07-22', (rawSnp) => Object.create(SNP).init({
    alleles: rawSnp.genotype.split(''),
    chromosome: rawSnp.chromosome,
    position: rawSnp.position,
    referenceAssembly: 'GRCh37',
    rsid: rawSnp.rsid.match(/rs\d*/)
      ? rawSnp.rsid
      : undefined,
    strand: '+'
  })
)

module.exports = {
  /**
   * Parse raw data into SNP Javascript objects.
   *
   * @param {Object} options
   * @param {string} options.data - contents of the raw data set
   * @param {string} options.format - e.g. '23andMe-2015-07-22'
   * @return {Promise}
   */
  parseAsync: function parseAsync (options) {
    options = options || {}
    // validate arguments
    const dialect = dialects.get(options.format)
    if (!dialect) {
      throw new Error(`Unrecognised format specified: ${options.format}`)
    }

    // parse to SNP objects sychronously
    const parser = new csv.parse.Parser(dialect)
    // set up parser
    parser.write(options.data)
    parser.end()

    return new Promise((resolve, reject) => {
      csv.parse(options.data, dialect, function onFinishedParsing (error, rawSnps) {
        if (error) {
          reject(error)
        }
        if (options.format === '23andMe-2015-07-22') {
          resolve(rawSnps.map(converters.get('23andMe-2015-07-22')))
        } else {
          reject(new Error('Could not recognise the specified format'))
        }
      })
    })
  }
}
