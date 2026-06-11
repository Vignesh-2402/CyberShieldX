# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListUserAlerts*](#listuseralerts)
- [**Mutations**](#mutations)
  - [*CreateAlert*](#createalert)
  - [*MarkAlertAsRead*](#markalertasread)
  - [*DeleteAlert*](#deletealert)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListUserAlerts
You can execute the `ListUserAlerts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserAlerts(options?: ExecuteQueryOptions): QueryPromise<ListUserAlertsData, undefined>;

interface ListUserAlertsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserAlertsData, undefined>;
}
export const listUserAlertsRef: ListUserAlertsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserAlerts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserAlertsData, undefined>;

interface ListUserAlertsRef {
  ...
  (dc: DataConnect): QueryRef<ListUserAlertsData, undefined>;
}
export const listUserAlertsRef: ListUserAlertsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserAlertsRef:
```typescript
const name = listUserAlertsRef.operationName;
console.log(name);
```

### Variables
The `ListUserAlerts` query has no variables.
### Return Type
Recall that executing the `ListUserAlerts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserAlertsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserAlertsData {
  alerts: ({
    id: UUIDString;
    message: string;
    isRead: boolean;
    createdAt: TimestampString;
    threat: {
      type: string;
      severity: string;
    };
  } & Alert_Key)[];
}
```
### Using `ListUserAlerts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserAlerts } from '@dataconnect/generated';


// Call the `listUserAlerts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserAlerts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserAlerts(dataConnect);

console.log(data.alerts);

// Or, you can use the `Promise` API.
listUserAlerts().then((response) => {
  const data = response.data;
  console.log(data.alerts);
});
```

### Using `ListUserAlerts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserAlertsRef } from '@dataconnect/generated';


// Call the `listUserAlertsRef()` function to get a reference to the query.
const ref = listUserAlertsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserAlertsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.alerts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.alerts);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateAlert
You can execute the `CreateAlert` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAlert(vars: CreateAlertVariables): MutationPromise<CreateAlertData, CreateAlertVariables>;

interface CreateAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAlertVariables): MutationRef<CreateAlertData, CreateAlertVariables>;
}
export const createAlertRef: CreateAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAlert(dc: DataConnect, vars: CreateAlertVariables): MutationPromise<CreateAlertData, CreateAlertVariables>;

interface CreateAlertRef {
  ...
  (dc: DataConnect, vars: CreateAlertVariables): MutationRef<CreateAlertData, CreateAlertVariables>;
}
export const createAlertRef: CreateAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAlertRef:
```typescript
const name = createAlertRef.operationName;
console.log(name);
```

### Variables
The `CreateAlert` mutation requires an argument of type `CreateAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAlertVariables {
  message: string;
  threatId: UUIDString;
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateAlert` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAlertData {
  alert_insert: Alert_Key;
}
```
### Using `CreateAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAlert, CreateAlertVariables } from '@dataconnect/generated';

// The `CreateAlert` mutation requires an argument of type `CreateAlertVariables`:
const createAlertVars: CreateAlertVariables = {
  message: ..., 
  threatId: ..., 
  userId: ..., 
};

// Call the `createAlert()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAlert(createAlertVars);
// Variables can be defined inline as well.
const { data } = await createAlert({ message: ..., threatId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAlert(dataConnect, createAlertVars);

console.log(data.alert_insert);

// Or, you can use the `Promise` API.
createAlert(createAlertVars).then((response) => {
  const data = response.data;
  console.log(data.alert_insert);
});
```

### Using `CreateAlert`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAlertRef, CreateAlertVariables } from '@dataconnect/generated';

// The `CreateAlert` mutation requires an argument of type `CreateAlertVariables`:
const createAlertVars: CreateAlertVariables = {
  message: ..., 
  threatId: ..., 
  userId: ..., 
};

// Call the `createAlertRef()` function to get a reference to the mutation.
const ref = createAlertRef(createAlertVars);
// Variables can be defined inline as well.
const ref = createAlertRef({ message: ..., threatId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAlertRef(dataConnect, createAlertVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alert_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alert_insert);
});
```

## MarkAlertAsRead
You can execute the `MarkAlertAsRead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
markAlertAsRead(vars: MarkAlertAsReadVariables): MutationPromise<MarkAlertAsReadData, MarkAlertAsReadVariables>;

interface MarkAlertAsReadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkAlertAsReadVariables): MutationRef<MarkAlertAsReadData, MarkAlertAsReadVariables>;
}
export const markAlertAsReadRef: MarkAlertAsReadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markAlertAsRead(dc: DataConnect, vars: MarkAlertAsReadVariables): MutationPromise<MarkAlertAsReadData, MarkAlertAsReadVariables>;

interface MarkAlertAsReadRef {
  ...
  (dc: DataConnect, vars: MarkAlertAsReadVariables): MutationRef<MarkAlertAsReadData, MarkAlertAsReadVariables>;
}
export const markAlertAsReadRef: MarkAlertAsReadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markAlertAsReadRef:
```typescript
const name = markAlertAsReadRef.operationName;
console.log(name);
```

### Variables
The `MarkAlertAsRead` mutation requires an argument of type `MarkAlertAsReadVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkAlertAsReadVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `MarkAlertAsRead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkAlertAsReadData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkAlertAsReadData {
  alert_update?: Alert_Key | null;
}
```
### Using `MarkAlertAsRead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markAlertAsRead, MarkAlertAsReadVariables } from '@dataconnect/generated';

// The `MarkAlertAsRead` mutation requires an argument of type `MarkAlertAsReadVariables`:
const markAlertAsReadVars: MarkAlertAsReadVariables = {
  id: ..., 
};

// Call the `markAlertAsRead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markAlertAsRead(markAlertAsReadVars);
// Variables can be defined inline as well.
const { data } = await markAlertAsRead({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markAlertAsRead(dataConnect, markAlertAsReadVars);

console.log(data.alert_update);

// Or, you can use the `Promise` API.
markAlertAsRead(markAlertAsReadVars).then((response) => {
  const data = response.data;
  console.log(data.alert_update);
});
```

### Using `MarkAlertAsRead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markAlertAsReadRef, MarkAlertAsReadVariables } from '@dataconnect/generated';

// The `MarkAlertAsRead` mutation requires an argument of type `MarkAlertAsReadVariables`:
const markAlertAsReadVars: MarkAlertAsReadVariables = {
  id: ..., 
};

// Call the `markAlertAsReadRef()` function to get a reference to the mutation.
const ref = markAlertAsReadRef(markAlertAsReadVars);
// Variables can be defined inline as well.
const ref = markAlertAsReadRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markAlertAsReadRef(dataConnect, markAlertAsReadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alert_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alert_update);
});
```

## DeleteAlert
You can execute the `DeleteAlert` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteAlert(vars: DeleteAlertVariables): MutationPromise<DeleteAlertData, DeleteAlertVariables>;

interface DeleteAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAlertVariables): MutationRef<DeleteAlertData, DeleteAlertVariables>;
}
export const deleteAlertRef: DeleteAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAlert(dc: DataConnect, vars: DeleteAlertVariables): MutationPromise<DeleteAlertData, DeleteAlertVariables>;

interface DeleteAlertRef {
  ...
  (dc: DataConnect, vars: DeleteAlertVariables): MutationRef<DeleteAlertData, DeleteAlertVariables>;
}
export const deleteAlertRef: DeleteAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAlertRef:
```typescript
const name = deleteAlertRef.operationName;
console.log(name);
```

### Variables
The `DeleteAlert` mutation requires an argument of type `DeleteAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAlertVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteAlert` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAlertData {
  alert_delete?: Alert_Key | null;
}
```
### Using `DeleteAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAlert, DeleteAlertVariables } from '@dataconnect/generated';

// The `DeleteAlert` mutation requires an argument of type `DeleteAlertVariables`:
const deleteAlertVars: DeleteAlertVariables = {
  id: ..., 
};

// Call the `deleteAlert()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAlert(deleteAlertVars);
// Variables can be defined inline as well.
const { data } = await deleteAlert({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAlert(dataConnect, deleteAlertVars);

console.log(data.alert_delete);

// Or, you can use the `Promise` API.
deleteAlert(deleteAlertVars).then((response) => {
  const data = response.data;
  console.log(data.alert_delete);
});
```

### Using `DeleteAlert`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAlertRef, DeleteAlertVariables } from '@dataconnect/generated';

// The `DeleteAlert` mutation requires an argument of type `DeleteAlertVariables`:
const deleteAlertVars: DeleteAlertVariables = {
  id: ..., 
};

// Call the `deleteAlertRef()` function to get a reference to the mutation.
const ref = deleteAlertRef(deleteAlertVars);
// Variables can be defined inline as well.
const ref = deleteAlertRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAlertRef(dataConnect, deleteAlertVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alert_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alert_delete);
});
```

