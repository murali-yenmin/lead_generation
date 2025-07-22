# UI Library

This is a lightweight and optimized UI component library built using [**Rollup.js**](https://rollupjs.org/). It provides reusable components for frontend development.

## 🚀 Features

- **Optimized Bundling**: Uses Rollup.js for efficient bundling and tree shaking.
- **ES Modules & CommonJS**: Supports multiple module formats for compatibility.
- **Lightweight & Fast**: Small bundle size with no unnecessary dependencies.
- **Customizable**: Easily extendable with Rollup plugins.

## 🛠 How to build the App

### Install Dependencies

Before building the library, install dependencies:

```sh
npm install
```

### UI Library Build Process

Ensure all components are properly exported in the main index.ts file:

```sh
// src/index.ts
export { Button } from './components/Button';
export { Card } from './components/Card';
export { Modal } from './components/Modal';
```

### Build the Library

Run the following command to bundle the UI library:

```sh
npm run build
```

This will generate the output files in the dist/ directory.

## 📦 Installation

You can install the package via npm after building the library:

```sh
npm install UI-Library
```

# Table Component

## Overview

The `Table` component is a reusable React component that provides a structured and flexible way to display tabular data. It includes sorting, pagination, and expandable row functionality.

## Features

- **Customizable Columns**: Define the structure of the table with dynamic column configurations.
- **Sorting**: Supports sorting by clicking on column headers.
- **Pagination**: Includes options to select the number of rows per page and navigate through pages.
- **Expandable Rows**: Allows additional details to be shown on row expansion.
- **Scrollable Table**: Enables horizontal scrolling when necessary.

### Importing the Component

```tsx
import { Table } from 'UI-Library';
```

### Example

```tsx
<Table
  columns={columns}
  data={data}
  tableName="Example Table"
  gridCol="4"
  sort={sort}
  setSort={setSort}
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  isPagination={true}
  totalCount={data.length}
  customPageSize={true}
  pageSize="10"
  setPageSize={setPageSize}
  isExpanded={true}
  rowSubComponent={(row) => <div>Details for {row.name}</div>}
  tableWidth="100%"
  enableScrollX={true}
/>
```

## Props

### TableProps

| Prop              | Type                               | Description                                                  |
| ----------------- | ---------------------------------- | ------------------------------------------------------------ |
| `columns`         | `Array<columns>`                   | Defines the table columns.                                   |
| `data`            | `Array<Record<string, any>>`       | The data to be displayed in the table.                       |
| `tableName`       | `string`                           | The name of the table, used as a key prefix.                 |
| `gridCol`         | `string`                           | Defines the grid column layout (e.g., '4' for four columns). |
| `sort`            | `{ value: string, field: string }` | Current sorting state.                                       |
| `setSort`         | `Function`                         | Function to update sorting state.                            |
| `currentPage`     | `number`                           | Current active page for pagination.                          |
| `setCurrentPage`  | `Function`                         | Function to update the current page.                         |
| `isPagination`    | `boolean`                          | Enables pagination if `true`.                                |
| `totalCount`      | `number`                           | Total number of records.                                     |
| `customPageSize`  | `boolean`                          | Allows selecting custom page sizes.                          |
| `pageSize`        | `string`                           | The number of records per page.                              |
| `setPageSize`     | `Function`                         | Function to update the page size.                            |
| `isExpanded`      | `boolean`                          | Enables row expansion if `true`.                             |
| `rowSubComponent` | `Function`                         | Component to render when a row is expanded.                  |
| `tableWidth`      | `string`                           | Width of the table.                                          |
| `enableScrollX`   | `boolean`                          | Enables horizontal scrolling.                                |

### Column Definition

Each column in the `columns` array should follow this structure:

```tsx
const columns = [
  {
    name: 'Name',
    accessField: 'name',
    isSort: true,
    colspan: '2',
  },
  {
    name: 'Age',
    accessField: 'age',
  },
];
```

## Components

### TableHead

Renders the table header with sortable columns.

### TableBody

Renders the table rows, handling expandable content.

### Pagination

Handles the pagination controls.

### DataPerPage

Dropdown for selecting the number of rows displayed per page.
