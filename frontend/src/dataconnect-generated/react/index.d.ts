import { CreateAlertData, CreateAlertVariables, ListUserAlertsData, MarkAlertAsReadData, MarkAlertAsReadVariables, DeleteAlertData, DeleteAlertVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateAlert(options?: useDataConnectMutationOptions<CreateAlertData, FirebaseError, CreateAlertVariables>): UseDataConnectMutationResult<CreateAlertData, CreateAlertVariables>;
export function useCreateAlert(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAlertData, FirebaseError, CreateAlertVariables>): UseDataConnectMutationResult<CreateAlertData, CreateAlertVariables>;

export function useListUserAlerts(options?: useDataConnectQueryOptions<ListUserAlertsData>): UseDataConnectQueryResult<ListUserAlertsData, undefined>;
export function useListUserAlerts(dc: DataConnect, options?: useDataConnectQueryOptions<ListUserAlertsData>): UseDataConnectQueryResult<ListUserAlertsData, undefined>;

export function useMarkAlertAsRead(options?: useDataConnectMutationOptions<MarkAlertAsReadData, FirebaseError, MarkAlertAsReadVariables>): UseDataConnectMutationResult<MarkAlertAsReadData, MarkAlertAsReadVariables>;
export function useMarkAlertAsRead(dc: DataConnect, options?: useDataConnectMutationOptions<MarkAlertAsReadData, FirebaseError, MarkAlertAsReadVariables>): UseDataConnectMutationResult<MarkAlertAsReadData, MarkAlertAsReadVariables>;

export function useDeleteAlert(options?: useDataConnectMutationOptions<DeleteAlertData, FirebaseError, DeleteAlertVariables>): UseDataConnectMutationResult<DeleteAlertData, DeleteAlertVariables>;
export function useDeleteAlert(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteAlertData, FirebaseError, DeleteAlertVariables>): UseDataConnectMutationResult<DeleteAlertData, DeleteAlertVariables>;
