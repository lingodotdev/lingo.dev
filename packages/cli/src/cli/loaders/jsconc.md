# Examples

Given the following JSONC:

```jsonc
{
  "key1": "value1", // This is a comment for key1
  "key2": "value2" /* This is a comment for key2 */,
  // This is a comment for key3
  "key3": "value3",
  /* This is a block comment for key4 */
  "key4": "value4",
  /*
   This is a comment for key5
  */
  "key5": "value5",
  // This is a comment for key6
  "key6": {
    // This is a comment for key7
    "key7": "value7",
  },
}
```

Extracted value object:

```js
const obj = {
  key1: "value1",
  key2: "value2",
  key3: "value3",
  key4: "value4",
  key5: "value5",
  key6: {
    key7: "value7",
  },
};
```

Extracted comments object:

```js
const comments = {
  key1: { comment: "This is a comment for key1" },
  key2: { comment: "This is a comment for key2" },
  key3: { comment: "This is a comment for key3" },
  key4: { comment: "This is a comment for key4" },
  key5: { comment: "This is a comment for key5" },
  key6: {
    comment: "This is a comment for key6",
    key7: { comment: "This is a comment for key7" },
  },
};
```
