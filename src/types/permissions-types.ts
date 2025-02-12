import type { AuthorizationModel, GenericMessage } from './message-types.js';
import type { DwnInterfaceName, DwnMethodName } from '../index.js';

export type PermissionScope = {
  interface: DwnInterfaceName;
  method: DwnMethodName;
} | RecordsPermissionScope;

// Method-specific scopes
export type RecordsPermissionScope = {
  interface: DwnInterfaceName.Records;
  method: DwnMethodName.Read | DwnMethodName.Write;
  /** May only be present when `schema` is undefined */
  protocol?: string;
  /** May only be present when `protocol` is defined and `protocolPath` is undefined */
  contextId?: string;
  /** May only be present when `protocol` is defined and `contextId` is undefined */
  protocolPath?: string;
  /** May only be present when `protocol` is undefined */
  schema?: string;
};

export enum PermissionsConditionPublication {
  Required = 'Required',
  Prohibited = 'Prohibited',
}

export type PermissionConditions = {
  /**
   * indicates whether a message written with the invocation of a permission must, may, or must not
   * be marked as public.
   * If `undefined`, it is optional to make the message public.
   */
  publication?: PermissionsConditionPublication;
};

export type PermissionsRequestDescriptor = {
  interface: DwnInterfaceName.Permissions;
  method: DwnMethodName.Request;
  messageTimestamp: string;
  // The DID of the DWN which the grantee will be given access
  grantedFor: string;
  // The recipient of the grant. Usually this is the author of the PermissionsRequest message
  grantedTo: string;
  // The granter, who will be either the DWN owner or an entity who the DWN owner has delegated permission to.
  grantedBy: string;
  // Optional string that communicates what the grant would be used for
  description?: string;
  scope: PermissionScope;
  conditions?: PermissionConditions;
};

export type PermissionsRequestMessage = GenericMessage & {
  authorization: AuthorizationModel; // overriding `GenericMessage` with `authorization` being required
  descriptor: PermissionsRequestDescriptor;
};

export type PermissionsGrantDescriptor = {
  interface: DwnInterfaceName.Permissions;
  method: DwnMethodName.Grant;
  messageTimestamp: string;

  /**
   * Optional CID of a PermissionsRequest message. This is optional because grants may be given without being officially requested
   * */
  permissionsRequestId?: string;

  /**
   * optional timestamp at which this grant will no longer be active.
   */
  dateExpires: string;

  /**
   * The DID of the DWN which the grantee will be given access
   */
  grantedFor: string;

  /**
   * The recipient of the grant. Usually this is the author of the PermissionsRequest message
   */
  grantedTo: string;

  /**
   * The granter, who will be either the DWN owner or an entity who the DWN owner has delegated permission to.
   */
  grantedBy: string;

  /**
   * Optional string that communicates what the grant would be used for
   */
  description?: string;

  scope: PermissionScope;
  conditions?: PermissionConditions
};

export type PermissionsGrantMessage = GenericMessage & {
  authorization: AuthorizationModel; // overriding `GenericMessage` with `authorization` being required
  descriptor: PermissionsGrantDescriptor;
};

export type PermissionsRevokeDescriptor = {
  interface: DwnInterfaceName.Permissions;
  method: DwnMethodName.Revoke;
  messageTimestamp: string;
  // The CID of the `PermissionsGrant` message being revoked.
  permissionsGrantId: string;
};

export type PermissionsRevokeMessage = GenericMessage & {
  authorization: AuthorizationModel; // overriding `GenericMessage` with `authorization` being required
  descriptor: PermissionsRevokeDescriptor;
};