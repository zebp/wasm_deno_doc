import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import {
  defaultEsConfig,
  defaultTsConfig,
  DocNode,
  DocNodeKind,
  FileLoader,
  LiteralDefKind,
  Parser,
  ReexportKindAll,
  ReexportKindNamed,
  ReexportKindNamespace,
  Syntax,
  TsTypeDefKind,
} from "./mod.ts";

const esSyntax: Syntax = {
  syntax: "es",
  ...defaultEsConfig(),
};

const tsSyntax: Syntax = {
  syntax: "typescript",
  ...defaultTsConfig(),
};

const testFileLoader: FileLoader = {
  resolve: (specifier: string) => specifier,
  async loadSourceCode(specifier: string): Promise<[Syntax, string]> {
    const segments = specifier.split(".");
    const extension = segments[segments.length - 1];

    const syntax = extension === "ts" ? tsSyntax : esSyntax;
    const source = await Deno.readTextFile(specifier);

    return [syntax, source];
  },
};

Deno.test({
  name: "parse module reexports",
  async fn() {
    const parser = new Parser(testFileLoader, false);
    const module = parser.parseModule(
      "testdata/module.ts",
      tsSyntax,
      await Deno.readTextFile("./testdata/module.ts"),
    );

    const kindAll: ReexportKindAll = "all";
    const kindNamespace: ReexportKindNamespace = {
      namespace: "foo",
    };
    const kindNamedNoAlias: ReexportKindNamed = {
      named: ["foo", null],
    };
    const kindNamedAliased: ReexportKindNamed = {
      named: ["foo", "bar"],
    };

    assertEquals(module.reexports, [
      { kind: kindAll, src: "./foo.ts" },
      { kind: kindNamespace, src: "./foo.ts" },
      { kind: kindNamedNoAlias, src: "./foo.ts" },
      { kind: kindNamedAliased, src: "./foo.ts" },
    ]);
  },
});

Deno.test({
  name: "parse module reexports",
  async fn() {
    const parser = new Parser(testFileLoader, false);
    const docNodes = await parser.parse("testdata/with_doc_nodes.ts");

    const expectedNodes: DocNode[] = [
      {
        kind: DocNodeKind.Function,
        name: "example",
        location: { filename: "testdata/with_doc_nodes.ts", line: 1, col: 0 },
        jsDoc: null,
        functionDef: {
          params: [],
          returnType: {
            repr: "string",
            kind: TsTypeDefKind.Keyword,
            keyword: "string",
          },
          isAsync: false,
          isGenerator: false,
          typeParams: [],
        },
      },
      {
        kind: DocNodeKind.Variable,
        name: "test",
        location: { filename: "testdata/with_doc_nodes.ts", line: 5, col: 0 },
        jsDoc: null,
        variableDef: {
          tsType: {
            repr: "",
            kind: TsTypeDefKind.Literal,
            literal: {
              kind: LiteralDefKind.String,
              string: "",
            },
          },
          kind: "const",
        },
      },
    ];

    assertEquals(docNodes, expectedNodes);
  },
});
