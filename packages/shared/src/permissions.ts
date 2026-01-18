export const Roles = {
  Anonymous: "anonymous",
  User: "user",
  RegionalManager: "regional_manager",
  NordicManager: "nordic_manager",
  EuropeanManager: "european_manager",
  GlobalManager: "global_manager",
  TagSpecialist: "tag_specialist",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export const Permissions = {
  ViewApproved: "reports.view.approved",
  SubmitReport: "reports.submit",
  ModerateRegional: "reports.moderate.regional",
  ModerateNordic: "reports.moderate.nordic",
  ModerateEuropean: "reports.moderate.european",
  ModerateGlobal: "reports.moderate.global",
  ManageTags: "tags.manage",
  ReviewTagged: "tags.review",
  ManageCuratedFlows: "flows.manage",
  ViewAuditLogs: "audit.view",
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

export const RolePermissions: Record<Role, Permission[]> = {
  [Roles.Anonymous]: [Permissions.ViewApproved, Permissions.SubmitReport],
  [Roles.User]: [Permissions.ViewApproved, Permissions.SubmitReport],
  [Roles.RegionalManager]: [
    Permissions.ViewApproved,
    Permissions.SubmitReport,
    Permissions.ModerateRegional,
    Permissions.ManageTags,
    Permissions.ViewAuditLogs,
  ],
  [Roles.NordicManager]: [
    Permissions.ViewApproved,
    Permissions.SubmitReport,
    Permissions.ModerateNordic,
    Permissions.ManageTags,
    Permissions.ViewAuditLogs,
  ],
  [Roles.EuropeanManager]: [
    Permissions.ViewApproved,
    Permissions.SubmitReport,
    Permissions.ModerateEuropean,
    Permissions.ManageTags,
    Permissions.ManageCuratedFlows,
    Permissions.ViewAuditLogs,
  ],
  [Roles.GlobalManager]: [
    Permissions.ViewApproved,
    Permissions.SubmitReport,
    Permissions.ModerateGlobal,
    Permissions.ManageTags,
    Permissions.ManageCuratedFlows,
    Permissions.ViewAuditLogs,
  ],
  [Roles.TagSpecialist]: [
    Permissions.ViewApproved,
    Permissions.ReviewTagged,
  ],
};
