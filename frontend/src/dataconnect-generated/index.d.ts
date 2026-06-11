import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Alert_Key {
  id: UUIDString;
  __typename?: 'Alert_Key';
}

export interface CreateAlertData {
  alert_insert: Alert_Key;
}

export interface CreateAlertVariables {
  message: string;
  threatId: UUIDString;
  userId: UUIDString;
}

export interface DeleteAlertData {
  alert_delete?: Alert_Key | null;
}

export interface DeleteAlertVariables {
  id: UUIDString;
}

export interface Device_Key {
  id: UUIDString;
  __typename?: 'Device_Key';
}

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

export interface MarkAlertAsReadData {
  alert_update?: Alert_Key | null;
}

export interface MarkAlertAsReadVariables {
  id: UUIDString;
}

export interface SecurityLog_Key {
  id: UUIDString;
  __typename?: 'SecurityLog_Key';
}

export interface ThreatIntel_Key {
  id: UUIDString;
  __typename?: 'ThreatIntel_Key';
}

export interface Threat_Key {
  id: UUIDString;
  __typename?: 'Threat_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateAlertRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAlertVariables): MutationRef<CreateAlertData, CreateAlertVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAlertVariables): MutationRef<CreateAlertData, CreateAlertVariables>;
  operationName: string;
}
export const createAlertRef: CreateAlertRef;

export function createAlert(vars: CreateAlertVariables): MutationPromise<CreateAlertData, CreateAlertVariables>;
export function createAlert(dc: DataConnect, vars: CreateAlertVariables): MutationPromise<CreateAlertData, CreateAlertVariables>;

interface ListUserAlertsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserAlertsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUserAlertsData, undefined>;
  operationName: string;
}
export const listUserAlertsRef: ListUserAlertsRef;

export function listUserAlerts(options?: ExecuteQueryOptions): QueryPromise<ListUserAlertsData, undefined>;
export function listUserAlerts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserAlertsData, undefined>;

interface MarkAlertAsReadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkAlertAsReadVariables): MutationRef<MarkAlertAsReadData, MarkAlertAsReadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkAlertAsReadVariables): MutationRef<MarkAlertAsReadData, MarkAlertAsReadVariables>;
  operationName: string;
}
export const markAlertAsReadRef: MarkAlertAsReadRef;

export function markAlertAsRead(vars: MarkAlertAsReadVariables): MutationPromise<MarkAlertAsReadData, MarkAlertAsReadVariables>;
export function markAlertAsRead(dc: DataConnect, vars: MarkAlertAsReadVariables): MutationPromise<MarkAlertAsReadData, MarkAlertAsReadVariables>;

interface DeleteAlertRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAlertVariables): MutationRef<DeleteAlertData, DeleteAlertVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAlertVariables): MutationRef<DeleteAlertData, DeleteAlertVariables>;
  operationName: string;
}
export const deleteAlertRef: DeleteAlertRef;

export function deleteAlert(vars: DeleteAlertVariables): MutationPromise<DeleteAlertData, DeleteAlertVariables>;
export function deleteAlert(dc: DataConnect, vars: DeleteAlertVariables): MutationPromise<DeleteAlertData, DeleteAlertVariables>;

