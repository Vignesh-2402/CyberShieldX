# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateAlert, useListUserAlerts, useMarkAlertAsRead, useDeleteAlert } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateAlert(createAlertVars);

const { data, isPending, isSuccess, isError, error } = useListUserAlerts();

const { data, isPending, isSuccess, isError, error } = useMarkAlertAsRead(markAlertAsReadVars);

const { data, isPending, isSuccess, isError, error } = useDeleteAlert(deleteAlertVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createAlert, listUserAlerts, markAlertAsRead, deleteAlert } from '@dataconnect/generated';


// Operation CreateAlert:  For variables, look at type CreateAlertVars in ../index.d.ts
const { data } = await CreateAlert(dataConnect, createAlertVars);

// Operation ListUserAlerts: 
const { data } = await ListUserAlerts(dataConnect);

// Operation MarkAlertAsRead:  For variables, look at type MarkAlertAsReadVars in ../index.d.ts
const { data } = await MarkAlertAsRead(dataConnect, markAlertAsReadVars);

// Operation DeleteAlert:  For variables, look at type DeleteAlertVars in ../index.d.ts
const { data } = await DeleteAlert(dataConnect, deleteAlertVars);


```