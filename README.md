# tree-sitter-ion-schema

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for [Ion Schema Language (ISL)](https://amzn.github.io/ion-schema/).

## About Ion Schema

Ion Schema is a language for constraining and validating the structure and content of Ion data. It provides a way to define schemas that describe the expected shape, types, and constraints of Ion documents.

## Features

This grammar supports all Ion Schema Language constructs:

- **Schema Headers**: Define schema metadata and imports
- **Import Statements**: Import types from other schema files
- **Type Definitions**: Define custom types with constraints
- **All Ion Data Types**: Full support for Ion values within schema definitions
- **Annotations**: Type annotations using `::` syntax
- **Comments**: Both line comments (`//`) and block comments (`/* */`)

## Installation

### For Tree-sitter CLI

```bash
npm install tree-sitter-ion-schema
```

### For Neovim with nvim-treesitter

Add to your Neovim configuration:

```lua
require'nvim-treesitter.configs'.setup {
  ensure_installed = { "ion_schema" },
  -- ... other config
}
```

## Usage

### With Tree-sitter CLI

```bash
# Parse an Ion Schema file
tree-sitter parse example.isl

# Test the grammar
tree-sitter test
```

### Example Ion Schema Code

```isl
// Schema header with imports
schema_header::{
  imports: [
    { id: "isl/ion.isl", type: ion }
  ]
}

// Define a custom email type
type::{
  name: email,
  type: string,
  regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
}

// Define a user type with constraints
type::{
  name: user,
  type: struct,
  fields: {
    id: { type: int, valid_values: range::[1, max] },
    email: email,
    name: { type: string, codepoint_length: range::[1, 100] },
    age: { type: int, valid_values: range::[0, 150] },
    active: bool,
    tags: { type: list, element: string, container_length: range::[0, 10] }
  }
}

// Define an address type
type::{
  name: address,
  type: struct,
  fields: {
    street: string,
    city: string,
    state: { type: string, codepoint_length: 2 },
    zip: { type: string, regex: "^[0-9]{5}(-[0-9]{4})?$" }
  }
}
```

## Grammar Development

### Building

```bash
# Generate the parser
tree-sitter generate

# Run tests
tree-sitter test

# Test with a specific file
tree-sitter parse path/to/file.isl
```

### Testing

The grammar includes comprehensive tests covering schema headers, imports, type definitions, and complex nested structures. Tests are located in `test/corpus/`.

## Resources

- [Ion Schema Specification](https://amzn.github.io/ion-schema/)
- [Ion Schema 2.0 BNF Grammar](https://amazon-ion.github.io/ion-schema/docs/isl-2-0/bnf-grammar)
- [Ion Specification](https://amzn.github.io/ion-docs/docs/spec.html)
- [Tree-sitter Documentation](https://tree-sitter.github.io/tree-sitter/)

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
