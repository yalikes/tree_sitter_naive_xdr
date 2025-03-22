/**
 * @file Naive XDR tree-sitter implementation
 * @author algebnaly <mail@algebnaly.com>
 * @license MIT
 */
/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "naive_xdr",
  extras: $ => [
    $.block_comment,
    /\s/
  ],

  rules: {
    source_file: $ => repeat($.statement),
    statement: $ => choice(
      $.block_comment,
      $.enum,
      $.struct,
      $.const_statement,
      $.union
    ),
    block_comment: $ => token(
      seq(
        "/*",
        /[^*]*\*+([^/*][^*]*\*+)*/,
        "/"
      )
    ),
    enum: $ => seq(
      $.keyword_enum,
      $.enum_name,
      "{",
      $._enum_variant_dec,
      "}",
      ";"
    ),
    keyword_enum: $ => "enum",
    enum_name: $ => $.identifier,
    _enum_variant_dec: $ => seq(
      $.identifier,
      "=",
      $.number,
      optional(repeat(seq(
        ",",
        $.identifier,
        "=",
        $.number,
      )))
    ),
    struct: $ => seq(
      $.keyword_struct,
      $.struct_name,
      "{",
      repeat($.struct_member),
      "}",
      ";"
    ),
    keyword_struct: $ => "struct",
    struct_name: $ => $.identifier,
    struct_member: $ => seq(
      $.type_specifier,
      $.identifier,
      ";"
    ),
    type_specifier: $ => $.identifier,
    const_statement: $ => seq(
      $.keyword_const,
      $.type_specifier,
      "=",
      $.identifier,
      ";"
    ),
    keyword_const: $ => "const",
    union: $ => seq(
      $.keyword_union,
      $.union_name,
      $.keyword_switch,
      "(",
      $.discriminant_declaration,
      ")",
      "{",
      repeat($.case_arm),
      optional($.default_arm),
      "}",
      ";"
    ),
    keyword_union: $ => "union",
    keyword_switch: $ => "switch",
    union_name: $ => $.identifier,
    discriminant_declaration: $ => seq(
      $.type_specifier,
      $.identifier
    ),
    case_arm: $ => seq(
      $.keyword_case,
      $.discriminant_declaration,
      ":",
      $.arm_declaration,
      ";"
    ),
    default_arm: $ => seq(
      $.keyword_default,
      ":",
      $.arm_declaration,
      ";"
    ),
    discriminant_value: $ => choice(
      $.number,
      $.identifier
    ),
    arm_declaration: $ => $.type_specifier,
    keyword_case: $ => "case",
    keyword_default: $ => "default",
    identifier: $ => /[A-Za-z]+[_A-Za-z]*/,
    number: $ => choice("0", /[1-9]+[0-9]*/),
  },
});
