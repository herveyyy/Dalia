export interface BranchStat {
  id: string;
  name: string;
  code: string | null;
  address: string | null;
  employeeCount: number;
}

export interface CompanyStats {
  totalEmployees: number;
  activeEmployees: number;
  totalBranches: number;
  totalDepartments: number;
  branchBreakdown: BranchStat[];
  unassignedBranchCount: number;
}

export interface FirmClientStat {
  id: string;
  name: string;
  businessType?: string | null;
  adminEmail?: string | null;
  employeeCount: number;
  branchCount: number;
}

export interface FirmStats {
  totalClients: number;
  totalEmployees: number;
  clientStats: FirmClientStat[];
}
