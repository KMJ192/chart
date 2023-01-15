use wasm_bindgen::prelude::*;
use web_sys::console;

// pub mod trie;
// use trie::trie::build_trie;

#[wasm_bindgen]
pub fn console() {
  console::log_1(&"test1".into());
}
