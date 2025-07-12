/**
 * @file Tree-sitter grammar for Ion Schema Language (ISL)
 * @author tartarughina
 * @license Apache-2.0
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'ion_schema',

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  conflicts: $ => [
    [$.annotated_value, $._ion_value]
  ],

  rules: {
    source_file: $ => seq(
      optional($.schema_header),
      repeat(choice($.import_statement, $.type_definition))
    ),

    // Schema header
    schema_header: $ => seq(
      'schema_header',
      '::',
      $.struct
    ),

    // Import statements
    import_statement: $ => seq(
      'import',
      '::',
      $.struct
    ),

    // Type definitions
    type_definition: $ => seq(
      'type',
      '::',
      $.struct
    ),

    // Ion values (reused from Ion grammar)
    _ion_value: $ => choice(
      $.annotated_value,
      $._scalar_value,
      $._container_value
    ),

    _scalar_value: $ => choice(
      $.null,
      $.bool,
      $.int,
      $.float,
      $.decimal,
      $.timestamp,
      $.string,
      $.symbol,
      $.blob,
      $.clob
    ),

    _container_value: $ => choice(
      $.list,
      $.sexp,
      $.struct
    ),

    // Null values
    null: _ => choice('null', 'null.null'),

    // Boolean values
    bool: _ => choice('true', 'false', 'null.bool'),

    // Integer values
    int: _ => choice(
      /null\.int/,
      /-?[0-9]+/,
      /-?0[xX][0-9a-fA-F]+/,
      /-?0[bB][01]+/
    ),

    // Float values
    float: _ => choice(
      /null\.float/,
      /-?[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?/,
      /-?[0-9]+[eE][+-]?[0-9]+/,
      /[+-]?inf/,
      /nan/
    ),

    // Decimal values
    decimal: _ => choice(
      /null\.decimal/,
      /-?[0-9]+\.[0-9]*[dD]/,
      /-?[0-9]+[dD]/
    ),

    // Timestamp values
    timestamp: _ => choice(
      /null\.timestamp/,
      /[0-9]{4}T/,
      /[0-9]{4}-[0-9]{2}T/,
      /[0-9]{4}-[0-9]{2}-[0-9]{2}T/,
      /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]+)?)?([+-][0-9]{2}:[0-9]{2}|Z)?/
    ),

    // String values
    string: $ => choice(
      'null.string',
      $._quoted_string,
      $._long_quoted_string
    ),

    _quoted_string: _ => seq(
      '"',
      repeat(choice(
        /[^"\\]/,
        /\\./
      )),
      '"'
    ),

    _long_quoted_string: _ => seq(
      "'''",
      repeat(choice(
        /[^']/,
        /'[^']/,
        /''[^']/
      )),
      "'''"
    ),

    // Symbol values
    symbol: $ => choice(
      'null.symbol',
      $._quoted_symbol,
      $._identifier_symbol
    ),

    _quoted_symbol: _ => seq(
      "'",
      repeat(choice(
        /[^'\\]/,
        /\\./
      )),
      "'"
    ),

    _identifier_symbol: _ => /[a-zA-Z_$][a-zA-Z0-9_$]*/,

    // Blob values
    blob: $ => choice(
      'null.blob',
      seq('{{', repeat(/[a-zA-Z0-9+/=\s]/), '}}')
    ),

    // Clob values
    clob: $ => choice(
      'null.clob',
      seq('{{', '"', repeat(choice(/[^"\\]/, /\\./)), '"', '}}'),
      seq("{{'''", repeat(choice(/[^']/, /'[^']/, /''[^']/)), "'''}}")
    ),

    // List values
    list: $ => choice(
      'null.list',
      seq('[', repeat(seq($._ion_value, optional(','))), ']')
    ),

    // S-expression values
    sexp: $ => choice(
      'null.sexp',
      seq('(', repeat($._ion_value), ')')
    ),

    // Struct values
    struct: $ => choice(
      'null.struct',
      seq('{', repeat(seq($.field, optional(','))), '}')
    ),

    field: $ => seq(
      choice($.symbol, $.string),
      ':',
      $._ion_value
    ),

    // Annotated values
    annotated_value: $ => prec.right(seq(
      repeat1(seq($.annotation, '::')),
      choice($._scalar_value, $._container_value)
    )),

    annotation: $ => choice(
      $.symbol,
      $.string
    ),

    // Comments
    line_comment: _ => seq('//', /.*/),
    block_comment: _ => seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
  }
});
