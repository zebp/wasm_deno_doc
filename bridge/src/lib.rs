mod types;

use std::rc::Rc;

use deno_doc::{parser::DocFileLoader, DocError, DocParser};
use futures::future::LocalBoxFuture;
use js_sys::{Array, Promise};
use swc_ecmascript::parser::{EsConfig, Syntax, TsConfig};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "FileLoader")]
    pub type FileLoader;
    #[wasm_bindgen(method, catch, js_name = "resolve")]
    pub fn resolve_js(
        this: &FileLoader,
        specifier: &str,
        referrer: &str,
    ) -> Result<String, JsValue>;
    #[wasm_bindgen(method, catch, js_name = "loadSourceCode")]
    pub async fn load_source_code_js(
        this: &FileLoader,
        specifier: &str,
    ) -> Result<JsValue, JsValue>;
}

impl DocFileLoader for FileLoader {
    fn resolve(&self, specifier: &str, referrer: &str) -> Result<String, deno_doc::DocError> {
        self.resolve_js(specifier, referrer).map_err(|e: JsValue| {
            let error = js_sys::Error::from(e);
            DocError::Resolve(error.message().into())
        })
    }

    fn load_source_code(
        &self,
        specifier: &str,
    ) -> LocalBoxFuture<Result<(Syntax, String), deno_doc::DocError>> {
        let specifier = specifier.to_string();
        Box::pin(async move {
            let tuple: JsValue =
                self.load_source_code_js(&specifier)
                    .await
                    .map_err(|e: JsValue| {
                        let error = js_sys::Error::from(e);
                        DocError::Resolve(error.message().into())
                    })?;
            let tuple = Array::from(&tuple);

            let syntax: JsValue = tuple.get(0);
            let syntax: Syntax = syntax.into_serde().unwrap();

            let code: JsValue = tuple.get(1);
            let code = code.as_string().unwrap();

            Ok((syntax, code))
        })
    }
}

#[wasm_bindgen]
pub struct Parser {
    inner: Rc<DocParser>,
}

#[wasm_bindgen]
impl Parser {
    #[wasm_bindgen(constructor)]
    pub fn new(file_loader: FileLoader, private_items: bool) -> Self {
        // TODO: Move
        console_error_panic_hook::set_once();
        Self {
            inner: Rc::new(DocParser::new(Box::new(file_loader), private_items)),
        }
    }

    #[wasm_bindgen(method, js_name = "parseModule")]
    pub fn parse_module(
        &self,
        file_name: String,
        syntax: JsValue,
        source_code: String,
    ) -> Result<JsValue, JsValue> {
        let syntax: Syntax = syntax.into_serde().expect("invalid syntax");
        self.inner
            .parse_module(&file_name, syntax, &source_code)
            .map(|module_doc| JsValue::from_serde(&module_doc).unwrap())
            .map_err(|e| JsValue::from(e.to_string()))
    }

    #[wasm_bindgen(method)]
    pub fn parse(&self, file_name: String) -> Promise {
        let parser = self.inner.clone();
        wasm_bindgen_futures::future_to_promise(async move {
            let doc_nodes = parser
                .parse(&file_name)
                .await
                .map_err(|e| JsValue::from(e.to_string()))?;
            JsValue::from_serde(&doc_nodes).map_err(|e| JsValue::from(e.to_string()))
        })
    }

    #[wasm_bindgen(method, js_name = "parseSource")]
    pub fn parse_source(
        &self,
        file_name: String,
        syntax: JsValue,
        source_code: String,
    ) -> Result<JsValue, JsValue> {
        let syntax: Syntax = syntax.into_serde().expect("invalid syntax");
        self.inner
            .parse_source(&file_name, syntax, &source_code)
            .map(|doc_nodes| JsValue::from_serde(&doc_nodes).unwrap())
            .map_err(|e| JsValue::from(e.to_string()))
    }

    #[wasm_bindgen(method, js_name = "parseWithReexports")]
    pub fn parse_with_reexports(&self, file_name: String) -> Promise {
        let parser = self.inner.clone();
        wasm_bindgen_futures::future_to_promise(async move {
            let doc_nodes = parser
                .parse_with_reexports(&file_name)
                .await
                .map_err(|e| JsValue::from(e.to_string()))?;
            JsValue::from_serde(&doc_nodes).map_err(|e| JsValue::from(e.to_string()))
        })
    }
}

#[wasm_bindgen(js_name = "defaultTsConfig")]
pub fn default_ts_config() -> JsValue {
    JsValue::from_serde(&TsConfig::default()).unwrap()
}

#[wasm_bindgen(js_name = "defaultEsConfig")]
pub fn default_es_config() -> JsValue {
    JsValue::from_serde(&EsConfig::default()).unwrap()
}
