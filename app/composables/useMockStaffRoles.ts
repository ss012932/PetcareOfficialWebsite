import { computed } from "vue";

export type PermissionKey =
  | "Dashboard"
  | "BrandManagement"
  | "StoreManagement"
  | "CustomerManagement"
  | "PetManagement"
  | "AppointmentManagement"
  | "VisitManagement"
  | "MedicalRecordManagement"
  | "BillingManagement"
  | "StaffManagement"
  | "RolePermissionManagement"
  | "ShiftManagement"
  | "HospitalizationManagement"
  | "InpatientCareManagement"
  | "PurchaseManagement"
  | "GeneralInventoryManagement"
  | "DrugInventoryManagement"
  | "PharmacyManagement"
  | "BatchExpireManagement"
  | "MultiStoreManagement"
  | "CrossStoreInventory"
  | "BasicReport"
  | "AdvancedReport";

export interface StaffRolePermissions {
  Dashboard: boolean;
  BrandManagement: boolean;
  StoreManagement: boolean;
  CustomerManagement: boolean;
  PetManagement: boolean;
  AppointmentManagement: boolean;
  VisitManagement: boolean;
  MedicalRecordManagement: boolean;
  BillingManagement: boolean;
  StaffManagement: boolean;
  RolePermissionManagement: boolean;
  ShiftManagement: boolean;
  HospitalizationManagement: boolean;
  InpatientCareManagement: boolean;
  PurchaseManagement: boolean;
  GeneralInventoryManagement: boolean;
  DrugInventoryManagement: boolean;
  PharmacyManagement: boolean;
  BatchExpireManagement: boolean;
  MultiStoreManagement: boolean;
  CrossStoreInventory: boolean;
  BasicReport: boolean;
  AdvancedReport: boolean;
}

export interface StaffRole extends StaffRolePermissions {
  Id: number;
  BrandId: number | null;
  RoleName: string;
  Description: string;
  Delete: boolean;
}

export interface PermissionGroup {
  title: string;
  items: Array<{ key: PermissionKey; label: string }>;
}

const permissionKeys: PermissionKey[] = [
  "Dashboard",
  "BrandManagement",
  "StoreManagement",
  "CustomerManagement",
  "PetManagement",
  "AppointmentManagement",
  "VisitManagement",
  "MedicalRecordManagement",
  "BillingManagement",
  "StaffManagement",
  "RolePermissionManagement",
  "ShiftManagement",
  "HospitalizationManagement",
  "InpatientCareManagement",
  "PurchaseManagement",
  "GeneralInventoryManagement",
  "DrugInventoryManagement",
  "PharmacyManagement",
  "BatchExpireManagement",
  "MultiStoreManagement",
  "CrossStoreInventory",
  "BasicReport",
  "AdvancedReport",
];

const emptyPermissions = (): StaffRolePermissions => ({
  Dashboard: false,
  BrandManagement: false,
  StoreManagement: false,
  CustomerManagement: false,
  PetManagement: false,
  AppointmentManagement: false,
  VisitManagement: false,
  MedicalRecordManagement: false,
  BillingManagement: false,
  StaffManagement: false,
  RolePermissionManagement: false,
  ShiftManagement: false,
  HospitalizationManagement: false,
  InpatientCareManagement: false,
  PurchaseManagement: false,
  GeneralInventoryManagement: false,
  DrugInventoryManagement: false,
  PharmacyManagement: false,
  BatchExpireManagement: false,
  MultiStoreManagement: false,
  CrossStoreInventory: false,
  BasicReport: false,
  AdvancedReport: false,
});

const defaultRoles: StaffRole[] = [
  {
    Id: 1,
    BrandId: 1,
    RoleName: "櫃台人員",
    Description: "系統預設角色（假資料）",
    ...emptyPermissions(),
    Dashboard: true,
    CustomerManagement: true,
    PetManagement: true,
    AppointmentManagement: true,
    BillingManagement: true,
    BasicReport: true,
    Delete: false,
  },
  {
    Id: 2,
    BrandId: 1,
    RoleName: "醫師",
    Description: "系統預設角色（假資料）",
    ...emptyPermissions(),
    Dashboard: true,
    CustomerManagement: true,
    PetManagement: true,
    AppointmentManagement: true,
    VisitManagement: true,
    MedicalRecordManagement: true,
    HospitalizationManagement: true,
    InpatientCareManagement: true,
    PharmacyManagement: true,
    BasicReport: true,
    Delete: false,
  },
  {
    Id: 3,
    BrandId: 1,
    RoleName: "助理",
    Description: "系統預設角色（假資料）",
    ...emptyPermissions(),
    Dashboard: true,
    CustomerManagement: true,
    PetManagement: true,
    AppointmentManagement: true,
    VisitManagement: true,
    ShiftManagement: true,
    PurchaseManagement: true,
    GeneralInventoryManagement: true,
    DrugInventoryManagement: true,
    BatchExpireManagement: true,
    Delete: false,
  },
  {
    Id: 4,
    BrandId: 1,
    RoleName: "護理人員",
    Description: "系統預設角色（假資料）",
    ...emptyPermissions(),
    Dashboard: true,
    CustomerManagement: true,
    PetManagement: true,
    AppointmentManagement: true,
    VisitManagement: true,
    ShiftManagement: true,
    HospitalizationManagement: true,
    InpatientCareManagement: true,
    GeneralInventoryManagement: true,
    DrugInventoryManagement: true,
    PharmacyManagement: true,
    BatchExpireManagement: true,
    BasicReport: true,
    Delete: false,
  },
  {
    Id: 5,
    BrandId: 1,
    RoleName: "店長",
    Description: "系統預設角色（假資料）",
    ...emptyPermissions(),
    Dashboard: true,
    BrandManagement: true,
    StoreManagement: true,
    CustomerManagement: true,
    PetManagement: true,
    AppointmentManagement: true,
    VisitManagement: true,
    MedicalRecordManagement: true,
    BillingManagement: true,
    StaffManagement: true,
    RolePermissionManagement: true,
    ShiftManagement: true,
    HospitalizationManagement: true,
    InpatientCareManagement: true,
    PurchaseManagement: true,
    GeneralInventoryManagement: true,
    DrugInventoryManagement: true,
    PharmacyManagement: true,
    BatchExpireManagement: true,
    MultiStoreManagement: true,
    CrossStoreInventory: true,
    BasicReport: true,
    AdvancedReport: true,
    Delete: false,
  },
];

export const permissionGroups: PermissionGroup[] = [
  {
    title: "營運主檔",
    items: [
      { key: "Dashboard", label: "主控台" },
      { key: "BrandManagement", label: "品牌管理" },
      { key: "StoreManagement", label: "院所管理" },
    ],
  },
  {
    title: "客戶資料",
    items: [
      { key: "CustomerManagement", label: "飼主管理" },
      { key: "PetManagement", label: "寵物管理" },
    ],
  },
  {
    title: "門診流程",
    items: [
      { key: "AppointmentManagement", label: "預約管理" },
      { key: "VisitManagement", label: "門診管理" },
      { key: "MedicalRecordManagement", label: "病歷管理" },
      { key: "BillingManagement", label: "批價收費管理" },
    ],
  },
  {
    title: "人事權限",
    items: [
      { key: "StaffManagement", label: "人事管理" },
      { key: "RolePermissionManagement", label: "角色權限管理" },
      { key: "ShiftManagement", label: "排班管理" },
    ],
  },
  {
    title: "住院流程",
    items: [
      { key: "HospitalizationManagement", label: "住院管理" },
      { key: "InpatientCareManagement", label: "住院照護管理" },
    ],
  },
  {
    title: "採購庫存",
    items: [
      { key: "PurchaseManagement", label: "採購管理" },
      { key: "GeneralInventoryManagement", label: "一般庫存管理" },
      { key: "DrugInventoryManagement", label: "藥品庫存管理" },
      { key: "PharmacyManagement", label: "藥局管理" },
      { key: "BatchExpireManagement", label: "批號效期管理" },
    ],
  },
  {
    title: "多店與報表",
    items: [
      { key: "MultiStoreManagement", label: "多分店管理" },
      { key: "CrossStoreInventory", label: "跨店庫存管理" },
      { key: "BasicReport", label: "基本報表" },
      { key: "AdvancedReport", label: "進階報表" },
    ],
  },
];

export function useMockStaffRoles() {
  const roles = useState<StaffRole[]>("mock-staff-roles", () =>
    defaultRoles.map((role) => ({ ...role })),
  );

  const roleOptions = computed(() =>
    roles.value.map((role) => ({ id: role.Id, name: role.RoleName })),
  );

  const countEnabledPermissions = (role: StaffRole) =>
    permissionKeys.filter((key) => role[key]).length;

  const setPermission = (roleId: number, key: PermissionKey, value: boolean) => {
    const role = roles.value.find((item) => item.Id === roleId);
    if (!role) return;
    role[key] = value;
  };

  const addRole = (roleName: string, description: string) => {
    const normalizedRoleName = roleName.trim();
    const normalizedDescription = description.trim();

    if (!normalizedRoleName) throw new Error("請輸入角色名稱。");
    if (!normalizedDescription) throw new Error("請輸入角色簡介。");
    if (normalizedDescription.length > 30) throw new Error("角色簡介最多 30 字。");

    const duplicated = roles.value.some(
      (role) => role.RoleName.toLowerCase() === normalizedRoleName.toLowerCase(),
    );
    if (duplicated) throw new Error("角色名稱不可重複。");

    const nextId = Math.max(...roles.value.map((role) => role.Id), 0) + 1;
    const newRole: StaffRole = {
      Id: nextId,
      BrandId: 1,
      RoleName: normalizedRoleName,
      Description: normalizedDescription,
      ...emptyPermissions(),
      Delete: false,
    };

    roles.value.push(newRole);
    return newRole;
  };

  return {
    roles,
    roleOptions,
    permissionGroups,
    countEnabledPermissions,
    setPermission,
    addRole,
  };
}
