import React from 'react';
import { useRequest } from 'ahooks';
import { useGetIdentity } from './auth';
import { getMyCasbin } from 'domain/profile';

type CanParams = { resource: string; action: string };

const AccessControlContext = React.createContext<Partial<{ can: typeof getMyCasbin }>>({});

export const AccessControlProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AccessControlContext.Provider value={{ can: getMyCasbin }}>
      {children}
    </AccessControlContext.Provider>
  );
};

export const CanAccess = ({
  children,
  fallback,
  ...canParams
}: CanParams & {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  return useCan(canParams) ? children : fallback ? fallback : null;
};

export const useCan = (params: CanParams) => {
  const { can } = React.useContext(AccessControlContext);
  const identity = useGetIdentity();
  const { data } = useRequest(can!, { cacheKey: `${identity?.role}_my-permission`, staleTime: -1 });
  let res = false;
  if (data && data.rules) {
    const rules = data.rules.split('\n').filter((r) => r.length > 0);
    const permissions: CanParams[] = [];
    rules.forEach((r) => {
      const [, , resource, action] = r.split(',');
      if (resource && action) {
        permissions.push({ resource, action });
      }
    });
    res = !!permissions.find(
      (p) => p.action === params.action && new RegExp(p.resource).test(params.resource)
    );
  }
  return res;
};

export const Permission = {
  ProjectAdd: { resource: 'projects', action: 'POST' },
  ProjectList: { resource: 'projects', action: 'GET' },
  ProjectAllocUser: { resource: 'projects/:id/users', action: 'PATCH' },
  ProjectAllocUserGet: { resource: 'projects/:id/users', action: 'GET' },
  ProjectEdit: { resource: 'projects/:id', action: 'PUT' },
  ProjectDelete: { resource: 'projects/:id', action: 'DELETE' },
  DeviceCommand: { resource: 'devices/:id/commands/:cmd', action: 'POST' },
  DeviceUpgrade: { resource: 'devices/:id/upgrade', action: 'POST' },
  DeviceAdd: { resource: 'devices', action: 'POST' },
  DeviceReplace: { resource: 'devices/:id/mac/:mac', action: 'PATCH' },
  DeviceEdit: { resource: 'devices/:id', action: 'PUT' },
  DeviceSettingsGet: { resource: 'devices/:id/settings', action: 'GET' },
  DeviceSettingsEdit: { resource: 'devices/:id/settings', action: 'PATCH' },
  DeviceDelete: { resource: 'devices/:id', action: 'DELETE' },
  DeviceDetail: { resource: 'devices/:id', action: 'GET' },
  DeviceDataDelete: { resource: 'devices/:id/data', action: 'DELETE' },
  DeviceDataDownload: { resource: 'devices/:id/download/data', action: 'GET' },
  DeviceRawDataDownload: { resource: 'devices/:id/download/data/:timestamp', action: 'GET' },
  DeviceFirmwares: { resource: 'devices/:id/firmwares', action: 'GET' },
  DeviceData: { resource: 'devices/:id/data', action: 'GET' },
  DeviceEventList: { resource: 'devices/:id/events', action: 'GET' },
  DeviceEventDelete: { resource: 'devices/:id/events', action: 'DELETE' },
  DeviceRuntimeDataGet: { resource: 'devices/:id/runtime', action: 'GET' },
  NetworkSettingEdit: { resource: 'networks/setting', action: 'PUT' },
  NetworkRemoveDevices: { resource: 'networks/:id/devices', action: 'DELETE' },
  NetworkAddDevices: { resource: 'networks/:id/devices', action: 'PATCH' },
  NetworkAdd: { resource: 'networks', action: 'POST' },
  NetworkExport: { resource: 'networks/:id/export', action: 'GET' },
  NetworkEdit: { resource: 'networks/:id', action: 'PUT' },
  NetworkDelete: { resource: 'networks/:id', action: 'DELETE' },
  NetworkDetail: { resource: 'networks/:id', action: 'GET' },
  NetworkSync: { resource: 'networks/:id/sync', action: 'PUT' },
  NetworkProvision: { resource: 'networks/:id/provision', action: 'PUT' },
  AlarmRuleAdd: { resource: 'alarmRules', action: 'POST' },
  AlarmRuleEdit: { resource: 'alarmRules/:id', action: 'PUT' },
  AlarmRuleStatusEdit: { resource: 'alarmRules/:id/status/:status', action: 'PUT' },
  AlarmSourceAdd: { resource: 'alarmRules/:id/sources', action: 'POST' },
  AlarmRuleDelete: { resource: 'alarmRules/:id', action: 'DELETE' },
  AlarmRuleTemplateAdd: { resource: 'alarmRuleTemplates', action: 'POST' },
  AlarmRuleTemplateEdit: { resource: 'alarmRuleTemplates/:id', action: 'PUT' },
  AlarmRuleTemplateDelete: { resource: 'alarmRuleTemplates/:id', action: 'DELETE' },
  AlarmRecordDelete: { resource: 'alarmRecords/:id', action: 'DELETE' },
  AlarmRecordAcknowledge: { resource: 'alarmRecords/:id/acknowledge', action: 'POST' },
  AlarmRecordAcknowledgeGet: { resource: 'alarmRecords/:id/acknowledge', action: 'GET' },
  AlarmRecordGet: { resource: 'alarmRecords/:id', action: 'GET' },
  UserAdd: { resource: 'users', action: 'POST' },
  UserEdit: { resource: 'users/:id', action: 'PUT' },
  UserDelete: { resource: 'users/:id', action: 'DELETE' },
  FirmwareAdd: { resource: 'firmwares', action: 'POST' },
  FirmwareDelete: { resource: 'firmwares/:id', action: 'DELETE' },
  RoleGet: { resource: 'roles/:id', action: 'GET' },
  RoleList: { resource: 'roles', action: 'GET' },
  RoleAdd: { resource: 'roles', action: 'POST' },
  RoleEdit: { resource: 'roles/:id', action: 'PUT' },
  RoleDelete: { resource: 'roles/:id', action: 'DELETE' },
  RoleAllocMenus: { resource: 'roles/:id/menus', action: 'PATCH' },
  RoleAllocPermissions: { resource: 'roles/:id/permissions', action: 'PATCH' },
  MenusTree: { resource: 'menus/tree', action: 'GET' },
  PermissionsWithGroup: { resource: 'permissions/withGroup', action: 'GET' },
  AssetAdd: { resource: 'assets', action: 'POST' },
  AssetList: { resource: 'assets', action: 'GET' },
  AssetDetail: { resource: 'assets/:id', action: 'GET' },
  AssetEdit: { resource: 'assets/:id', action: 'PUT' },
  AssetDelete: { resource: 'assets/:id', action: 'DELETE' },
  AssetExport: { resource: 'my/projects/:id/exportFile', action: 'GET' },
  AssetImport: { resource: 'my/projects/:id/import', action: 'POST' },
  AssetDataDownload: { resource: 'assets/:id/download/data', action: 'GET' },
  MeasurementAdd: { resource: 'monitoringPoints', action: 'POST' },
  MeasurementList: { resource: 'monitoringPoints', action: 'GET' },
  MeasurementDetail: { resource: 'monitoringPoints/:id', action: 'GET' },
  MeasurementEdit: { resource: 'monitoringPoints/:id', action: 'PUT' },
  MeasurementDelete: { resource: 'monitoringPoints/:id', action: 'DELETE' },
  MeasurementDataDownload: { resource: 'monitoringPoints/:id/download/data', action: 'GET' },
  MeasurementDataDelete: { resource: 'monitoringPoints/:id/data', action: 'DELETE' },
  AlarmRuleGroupAdd: { resource: 'alarmRuleGroups', action: 'POST' },
  AlarmRuleGroupEdit: { resource: 'alarmRuleGroups/:id', action: 'PUT' },
  AlarmRuleGroupDelete: { resource: 'alarmRuleGroups/:id', action: 'DELETE' },
  AlarmRuleGroupBind: { resource: 'alarmRuleGroups/:id/bindings', action: 'PUT' },
  AlarmRuleGroupExport: { resource: 'alarmRuleGroups/exportFile', action: 'GET' },
  AlarmRuleGroupImport: { resource: 'alarmRuleGroups/import', action: 'POST' }
};
