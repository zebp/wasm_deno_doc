# wasm_deno_doc
Bindings to Deno's documentation generator built in Rust using WebAssembly.

## Example

```typescript
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


const parser = new Parser(testFileLoader, false);
const docNodes = await parser.parse("example.ts");

console.log(docNodes);
```