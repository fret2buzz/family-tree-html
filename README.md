# family-tree-html

> Generates HTML family trees from CSV files using JavaScript.

[Example](https://fret2buzz.github.io/family-tree-html/dist/simpsons.html)

It's just a simple unordered list thus only one branch of ancestors can be shown on a page.

## Installation

```sh
npm install
```

This installs all dependencies.

## Getting started

A family tree is a [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) file. To get started, edit CSV files from `src/csv/` folder using Google Spreadsheet or Libre Office.

Use `CONCATENATE` function to concatenate data.

```
=CONCATENATE(J5," & ", K5)
```

Then run the script
```sh
node index.js
```

## Thanks

Inspired by these repos

> [@rstacruz](https://github.com/rstacruz/kingraph) &nbsp;&middot;&nbsp;
> [@AlexanderWillner](https://github.com/AlexanderWillner/kingraph) &nbsp;&middot;&nbsp;
> [@ptariche](https://github.com/ptariche/family-tree-generator) &nbsp;&middot;&nbsp;
> [@leejordan](https://github.com/leejordan/flow) &nbsp;&middot;&nbsp;

