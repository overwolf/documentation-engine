Display Json terminology (for easier reading):

A valid Display JSON's content with commented terminology:
```js
// Example Comment
const // Record.type
ExampleRecord1 = // Record.name
  TypeName[ // Record.value (array type)
    TypeValue1{ // Value (object type)
      FieldName1: // Field.name
        ArbitraryType..., // Field.value (type)
      FieldName2: // Field.name
        (
          ParamFieldName1: // Field.name
            ParamFieldType1..., // Field.value (type)
          ...
        ) => // Field.value (function.params)
          FunctionReturnType1, // Value (function.return)
      ...
    },
    TypeValue2[ // Value (array type)
      InnerTypeValue1..., // Value (type)
      InnerTypeValue2..., // Value (type)
      ...
    ],
    number // Value (type)
  ]

...

const // Record.type
ExampleRecord2 = // Record.name
  number // Record.value (type)

```