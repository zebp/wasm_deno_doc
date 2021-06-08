// @deno-types="./mod.d.ts"
export * from "./pkg/bridge.js";

export enum DocNodeKind {
  Function = "function",
  Variable = "variable",
  Class = "class",
  Enum = "enum",
  Interface = "interface",
  TypeAlias = "typeAlias",
  Namespace = "namespace",
  Import = "import",
}

export enum LiteralDefKind {
  Number = "number",
  String = "string",
  Boolean = "boolean",
}

export enum TsTypeDefKind {
  Keyword = "keyword",
  Literal = "literal",
  TypeRef = "typeRef",
  Union = "union",
  Intersection = "intersection",
  Array = "array",
  Tuple = "tuple",
  TypeOperator = "typeOperator",
  Parenthesized = "parenthesized",
  Rest = "rest",
  Optional = "optional",
  TypeQuery = "typeQuery",
  This = "this",
  FnOrConstructor = "fnOrConstructor",
  Conditional = "conditional",
  IndexedAccess = "indexedAccess",
  TypeLiteral = "typeLiteral",
}
