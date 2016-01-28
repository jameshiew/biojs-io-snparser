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
   * @param {!Object} args
   * @param {!Array<!string>} args.alleles
   * @param {!string} args.chromosome
   * @param {!number} args.position
   * @param {!string} args.referenceAssembly
   * @param {!string} args.rsid
   * @param {!string} args.strand
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

const Format = {
  /**
   * Encapsulates a DTC raw data format.
   *
   * @param {!Object} args
   * @param {!Object} args.dialect
   * @param {!function(!Object):!SNP} args.converter
   */
  init: function init (args) {
    this.dialect = args.dialect
    this.converter = args.converter
    return this
  }
}

/** @type {Map<string, Format>} */
const formats = new Map([[
  '23andMe-2015-07-22',
  Object.create(Format).init({
    dialect: {
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
    },
    converter: function convert (rawSnp) {
      return Object.create(SNP).init({
        alleles: rawSnp.genotype.split(''),
        chromosome: rawSnp.chromosome,
        position: rawSnp.position,
        referenceAssembly: 'GRCh37',
        rsid: rawSnp.rsid.match(/rs\d*/)
          ? rawSnp.rsid
          : undefined,
        strand: '+'
      })
    }
  })
]])

module.exports = {
  SNP: SNP,
  formats: formats,
  supportedFormats: Array.from(formats.keys()),
  /**
   * Parse raw data into SNP Javascript objects.
   *
   * @param {!Object} args
   * @param {!string} args.data - contents of the raw data set
   * @param {(!Format|!string)} args.format - a Format object or a string from supportedFormats
   * @return {!Promise}
   */
  parseAsync: function parseAsync (args) {
    if (typeof args.format === 'string' && formats.has(args.format)) {
      args.format = formats.get(args.format)
    }
    return new Promise((resolve, reject) => {
      csv.parse(args.data, args.format.dialect, function onFinishedParsing (error, rawSnps) {
        if (error) {
          reject(error)
        }
        resolve(rawSnps.map(args.format.converter))
      })
    })
  }
}
