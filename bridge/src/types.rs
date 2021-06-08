use wasm_bindgen::prelude::*;

#[wasm_bindgen(typescript_custom_section)]
const _TYPESCRIPT_TYPES: &'static str = r#"
interface FileLoader {
    resolve(specifier: string, referrer: string): String;
    loadSourceCode(specifier: string): Promise<[Syntax, String]>;
}

interface EsConfig {
    jsx: boolean;
    numericSeparator: boolean;
    classPrivateProperty: boolean;
    privateMethod: boolean;
    classProperty: boolean;
    functionBind: boolean;
    decorators: boolean;
    decoratorsBeforeExport: boolean;
    exportDefaultFrom: boolean;
    exportNamespaceFrom: boolean;
    dynamicImport: boolean;
    nullishCoalescing: boolean;
    optionalChaining: boolean;
    importMeta: boolean;
    topLevelAwait: boolean;
    importAssertions: boolean;
}

interface TsConfig {
    tsx: boolean,
    decorators: boolean,
    dynamicImport: boolean;
    importAssertions: boolean;
}

type Syntax = ({ syntax: "es" } & EsConfig) | ({ syntax: "typescript" } & TsConfig);
"#;
