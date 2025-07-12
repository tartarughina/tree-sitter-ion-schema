{
  "targets": [
    {
      "target_name": "tree_sitter_ion_schema_binding",
      "include_dirs": [
        "<!(node -e \"console.log(require('node-addon-api').include)\")",
        "src"
      ],
      "dependencies": [
        "<!(node -e \"console.log(require('node-addon-api').gyp)\")"
      ],
      "cflags_c": [
        "-std=c99",
      ],
      "sources": [
        "bindings/node/binding.cc",
        "src/parser.c",
        # NOTE: if your language has an external scanner, add it here.
      ]
    }
  ]
}
