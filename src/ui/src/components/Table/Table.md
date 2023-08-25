### Table examples

Basic table example:

```jsx
const columns = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: 'Address',
    key: 'address',
    render: (text, record, index) => 'In a galaxy far far away...'
  }
];
const data = [
  {
    key: 0,
    name: 'Darth Vader'
  },
  {
    key: 1,
    name: 'Obi-Wan Kenobi'
  },
  {
    key: 2,
    name: 'Han Solo'
  },
  {
    key: 3,
    name: 'Yoda'
  },
  {
    key: 4,
    name: 'Luke Skywalker'
  },
  {
    key: 5,
    name: 'R2-D2'
  },
  {
    key: 6,
    name: 'Chewbacca'
  },
  {
    key: 7,
    name: 'Leia Organa'
  },
  {
    key: 8,
    name: 'Boba Fett'
  },
  {
    key: 9,
    name: 'Darth Maul'
  },
  {
    key: 10,
    name: 'Palpatine'
  },
  {
    key: 11,
    name: 'C-3PO'
  },
  {
    key: 12,
    name: 'Qui-Gon Jinn'
  },
  {
    key: 13,
    name: 'Lando Calrissian'
  },
  {
    key: 14,
    name: 'Mace Windu'
  },
  {
    key: 15,
    name: 'Padmé Amidala'
  },
  {
    key: 16,
    name: 'Admiral Ackbar'
  },
  {
    key: 17,
    name: 'Jabba the Hutt'
  },
  {
    key: 18,
    name: 'General Grievous'
  },
  {
    key: 19,
    name: 'Grand Moff Tarkin'
  },
  {
    key: 20,
    name: 'Count Dooku'
  },
  {
    key: 21,
    name: 'Jango Fett'
  },
  {
    key: 22,
    name: 'Kylo Ren'
  },
  {
    key: 23,
    name: 'BB-8'
  }
];
<Table
  columns={ columns }
  dataSource={ data }
  alwaysShowColumns={['name']}
  filterPlaceHolder="Search this table..." />
```

Table without pagination:

```jsx
const Link = require('../Link/Link').default;
const columns = [
  {
    title: 'Language',
    key: 'lang',
    dataIndex: 'name'
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record, index) => <Link>Run</Link>
  }
];
const data = [
  {
    key: 0,
    name: 'JavaScript'
  },
  {
    key: 1,
    name: 'Scala'
  },
  {
    key: 2,
    name: 'Erlang'
  },
  {
    key: 3,
    name: 'Clojure'
  }
];
<Table
  columns={ columns }
  dataSource={ data }
  showPagination={false} />
```

Table with row click handler:

```jsx
const Link = require('../Link/Link').default;
const columns = [
  {
    title: 'Language',
    key: 'lang',
    dataIndex: 'name'
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record, index) => <Link>Run</Link>
  }
];
const data = [
  {
    key: 0,
    id: '0',
    name: 'JavaScript'
  },
  {
    key: 1,
    id: '1',
    name: 'Scala'
  },
  {
    key: 2,
    id: '2',
    name: 'Erlang'
  },
  {
    key: 3,
    id: '3',
    name: 'Clojure'
  }
];
function onRowClick(rowData) {
  alert('You clicked on: ' + rowData.name);
}
<Table
  columns={ columns }
  dataSource={ data }
  showPagination={false}
  onRowClick={onRowClick} />
```

Table with a row pre-selected:

```jsx
const Link = require('../Link/Link').default;
const columns = [
  {
    title: 'Language',
    key: 'lang',
    dataIndex: 'name'
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record, index) => <Link>Run</Link>
  }
];
const data = [
  {
    key: 'a',
    id: 'a',
    name: 'JavaScript'
  },
  {
    key: 'b',
    id: 'b',
    name: 'Scala'
  },
  {
    key: 'c',
    id: 'c',
    name: 'Erlang'
  },
  {
    key: 'd',
    id: 'd',
    name: 'Clojure'
  }
];
<Table
  columns={ columns }
  dataSource={ data }
  showPagination={false}
  isRowClickable={true}
  defaultSelectedRowId="b" />
```

Sorting:

```jsx
const numberSorter = require('./Table').numberSorter;

const columns = [
  {
    title: 'Task',
    key: 'lang',
    dataIndex: 'name',
    sorter: true
  },
  {
    title: 'Started On',
    key: 'execTime',
    render: (text, record, index) => new Date(record.execTime.epochTime).toISOString(),
    // built-in numeric sorting function: useful for sorting numeric fields and timestamps
    sorter: numberSorter(['execTime', 'epochTime'])
  }
];
const data = [
  {
    key: 'a',
    id: 'a',
    name: 'Database Sync',
    execTime: {
      epochTime: 1560497490280
    }
  },
  {
    key: 'b',
    id: 'b',
    name: 'File Download',
    execTime: {
      epochTime: 1560497491285
    }
  },
  {
    key: 'c',
    id: 'c',
    name: 'Garbage Collection',
    execTime: {
      epochTime: 1560497563198
    }
  },
  {
    key: 'd',
    id: 'd',
    name: 'Create Entities',
    execTime: {
      epochTime: 1560497664092
    }
  }
];
<Table
  columns={ columns }
  dataSource={ data }
  showPagination={false} />
```
