# Graph Report - Dalia  (2026-08-22)

## Corpus Check
- 295 files · ~155,499 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1475 nodes · 2872 edges · 73 communities (63 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 57
- Community 58
- Community 59
- Community 60
- Community 62
- Community 63
- Community 64
- Community 66
- Community 67
- Community 70

## God Nodes (most connected - your core abstractions)
1. `cn()` - 59 edges
2. `getSafeSession()` - 35 edges
3. `Button()` - 34 edges
4. `Db` - 33 edges
5. `logActivity()` - 28 edges
6. `Input()` - 22 edges
7. `Label()` - 21 edges
8. `auth` - 20 edges
9. `user` - 19 edges
10. `resolveTenantCompanyId()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `UserLayout()` --calls--> `getSafeSession()`  [EXTRACTED]
  apps/user/app/user/layout.tsx → packages/auth/src/index.ts
- `HrisActivityLogsPage()` --calls--> `getSafeSession()`  [EXTRACTED]
  apps/hris/app/hris/activity-logs/page.tsx → packages/auth/src/index.ts
- `EmployeeProfilePage()` --calls--> `getSafeSession()`  [EXTRACTED]
  apps/hris/app/hris/employee/[employeeId]/profile/page.tsx → packages/auth/src/index.ts
- `Page()` --calls--> `getSafeSession()`  [EXTRACTED]
  apps/hris/app/hris/jobs/[jobId]/applicants/page.tsx → packages/auth/src/index.ts
- `Page()` --calls--> `getSafeSession()`  [EXTRACTED]
  apps/hris/app/hris/jobs/page.tsx → packages/auth/src/index.ts

## Import Cycles
- None detected.

## Communities (73 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (56): HrisActivityLogsPage(), HrisBranchesPage(), HrisDepartmentsPage(), HrisLayout(), HrisRolesPage(), GetActivityLogsParams, getCompanyRecord(), getCompanyWorkspaces() (+48 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (70): deleteEmployee(), getSessionUser(), saveEmployee(), AllowanceRecord, DeductionRecord, useEmployeeProfileEditor(), Step4Props, Step5Props (+62 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (59): POST(), dynamic, maxDuration, POST(), ApplicationsPage(), JobPostingItem, JobSearchClient(), JobSearchClientProps (+51 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (39): BranchProfilePage(), Props, DepartmentProfilePage(), Props, EmployeeProfilePage(), Page(), Page(), Page() (+31 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (35): __dirname, __filename, nextConfig, nextConfig, nextConfig, __dirname, __filename, nextConfig (+27 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (35): BirFilingPage(), mockFilings, statusColors, ClientsPage(), WorkspacePage(), mockContributions, SssHdmfPage(), statusColors (+27 more)

### Community 6 - "Community 6"
Cohesion: 0.04
Nodes (46): dependencies, better-auth, next, react, react-dom, react-icons, @repo/auth, @repo/db (+38 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (27): geistMono, geistSans, metadata, metadata, nunito, quicksand, metadata, nunito (+19 more)

### Community 8 - "Community 8"
Cohesion: 0.04
Nodes (44): dependencies, next, react, react-dom, react-icons, @repo/auth, @repo/db, @repo/ui (+36 more)

### Community 9 - "Community 9"
Cohesion: 0.04
Nodes (44): dependencies, next, react, react-dom, react-icons, @repo/auth, @repo/db, @repo/ui (+36 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (43): accountRelations, activityLogRelations, allowanceTypeRelations, appFeatureRelations, appModuleRelations, branchRelations, companyRelations, deductionTypeRelations (+35 more)

### Community 11 - "Community 11"
Cohesion: 0.05
Nodes (39): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, dotenv, drizzle-kit, drizzle-orm, @neondatabase/serverless, dependencies, @aws-sdk/client-s3 (+31 more)

### Community 12 - "Community 12"
Cohesion: 0.05
Nodes (38): dependencies, next, react, react-dom, @repo/ui, devDependencies, eslint, @repo/eslint-config (+30 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (23): EmployeeDirectoryProps, DialogMode, OrgBranchesPanelProps, OrgDepartmentsPanelProps, BranchWithEmployees, DepartmentWithEmployees, Button(), Dialog (+15 more)

### Community 14 - "Community 14"
Cohesion: 0.06
Nodes (34): @better-auth/drizzle-adapter, dependencies, better-auth, @better-auth/drizzle-adapter, react, react-dom, @repo/db, devDependencies (+26 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (33): APA, ARN, AWS_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, AWS_SECRET_KEY, BETTER_AUTH_SECRET (+25 more)

### Community 16 - "Community 16"
Cohesion: 0.06
Nodes (31): eslint-config-prettier, @eslint/js, eslint-plugin-only-warn, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-turbo, globals, @next/eslint-plugin-next (+23 more)

### Community 17 - "Community 17"
Cohesion: 0.06
Nodes (31): devDependencies, prettier, turbo, typescript, devEngines, packageManager, engines, node (+23 more)

### Community 18 - "Community 18"
Cohesion: 0.10
Nodes (15): PermissionGuard(), RBACContext, RBACContextType, usePermissions(), assertPermission(), enforcePermission(), getTenantPermissions, AppModuleKey (+7 more)

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (16): mockFilings, statusColors, mockContributions, statusColors, buildListHref(), DataPagination(), DataPaginationProps, syncListParams() (+8 more)

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (18): DialogFooter(), DialogHeader(), SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator (+10 more)

### Community 21 - "Community 21"
Cohesion: 0.13
Nodes (13): HrisShell(), HrisShellProps, SidebarItem(), SidebarItemProps, Workspace, WorkspaceSelector(), WorkspaceSelectorProps, AppShell() (+5 more)

### Community 22 - "Community 22"
Cohesion: 0.13
Nodes (12): HrisHeaderProps, UserLayout(), UserShell(), UserShellProps, AppsPage(), AppsGrid(), getAppsPageData(), AppCardItem (+4 more)

### Community 23 - "Community 23"
Cohesion: 0.09
Nodes (21): compilerOptions, baseUrl, module, moduleResolution, outDir, paths, rootDir, strictNullChecks (+13 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (19): compilerOptions, declaration, declarationMap, esModuleInterop, incremental, isolatedModules, lib, module (+11 more)

### Community 25 - "Community 25"
Cohesion: 0.13
Nodes (10): Props, EmployeeProfileEditorProps, ProfileStep1(), Step1Props, ProfileStep2(), Step2Props, ProfileStep3(), Step3Props (+2 more)

### Community 26 - "Community 26"
Cohesion: 0.16
Nodes (14): erpModulesList, tiers, erpModules, HeroBackdrop(), HeroErpPanel(), ScrollReveal(), ScrollRevealProps, Card() (+6 more)

### Community 27 - "Community 27"
Cohesion: 0.31
Nodes (17): assertCompanyAccess(), assignEmployeeAction(), deleteBranchAction(), deleteDepartmentAction(), deleteEmployeeAction(), deleteRoleAction(), revalidateOrg(), saveBranchAction() (+9 more)

### Community 28 - "Community 28"
Cohesion: 0.11
Nodes (19): @base-ui/react, class-variance-authority, clsx, lucide-react, dependencies, @base-ui/react, class-variance-authority, clsx (+11 more)

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+8 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+8 more)

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+8 more)

### Community 32 - "Community 32"
Cohesion: 0.12
Nodes (16): compilerOptions, baseUrl, jsx, paths, plugins, strictNullChecks, exclude, extends (+8 more)

### Community 33 - "Community 33"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+8 more)

### Community 34 - "Community 34"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+8 more)

### Community 35 - "Community 35"
Cohesion: 0.12
Nodes (15): compilerOptions, baseUrl, paths, plugins, strictNullChecks, exclude, extends, include (+7 more)

### Community 36 - "Community 36"
Cohesion: 0.12
Nodes (15): compilerOptions, baseUrl, paths, plugins, strictNullChecks, exclude, extends, include (+7 more)

### Community 37 - "Community 37"
Cohesion: 0.12
Nodes (15): compilerOptions, baseUrl, paths, plugins, strictNullChecks, exclude, extends, include (+7 more)

### Community 38 - "Community 38"
Cohesion: 0.31
Nodes (12): deleteJobPosting(), getJobApplicationsAction(), getSessionUser(), parseSalaryNumber(), saveJobPosting(), updateApplicationStatusAction(), BranchRecord, DepartmentRecord (+4 more)

### Community 39 - "Community 39"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, @repo/eslint-config, @repo/typescript-config, @types/node, @types/react, @types/react-dom, typescript (+7 more)

### Community 40 - "Community 40"
Cohesion: 0.14
Nodes (13): compilerOptions, module, moduleResolution, noEmit, rootDir, exclude, extends, include (+5 more)

### Community 41 - "Community 41"
Cohesion: 0.15
Nodes (12): compilerOptions, jsx, module, moduleResolution, noEmit, rootDir, exclude, extends (+4 more)

### Community 42 - "Community 42"
Cohesion: 0.25
Nodes (10): FirmUsersPanelProps, LoginMode, OrgEmployeesPanelProps, OrgRolesPanelProps, FirmUser, AppAccessCatalog, WorkspaceBranch, WorkspaceDepartment (+2 more)

### Community 43 - "Community 43"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, jsx, module, moduleResolution, noEmit, plugins, extends (+2 more)

### Community 44 - "Community 44"
Cohesion: 0.18
Nodes (10): exports, ./base.json, ./nextjs.json, ./react-library.json, license, name, private, publishConfig (+2 more)

### Community 45 - "Community 45"
Cohesion: 0.36
Nodes (7): ApplicantRecord, FileRecordWithActiveUrl, useJobApplicants(), JobApplicantsClient(), JobApplicantsClientProps, JobPostingRecord, parseClientSalary()

### Community 46 - "Community 46"
Cohesion: 0.46
Nodes (6): deleteTaxType(), getSessionUser(), saveTaxType(), TaxList(), TaxListProps, TaxTypeRecord

### Community 47 - "Community 47"
Cohesion: 0.36
Nodes (5): ActivityLogTableProps, ActivityLogItem, DiffViewerModal(), DiffViewerModalProps, EntityHistoryTabProps

### Community 48 - "Community 48"
Cohesion: 0.32
Nodes (3): Home(), SiteHeader(), buttonVariants

### Community 49 - "Community 49"
Cohesion: 0.25
Nodes (7): name, private, scripts, check-types, lint, type, version

### Community 50 - "Community 50"
Cohesion: 0.29
Nodes (5): db, __dirname, __filename, migrationsFolder, sql

### Community 51 - "Community 51"
Cohesion: 0.29
Nodes (7): exports, ./components/atoms/*, ./components/molecules/*, ./components/organisms/*, ./globals.css, ./hooks/*, ./lib/*

### Community 52 - "Community 52"
Cohesion: 0.33
Nodes (5): compilerOptions, jsx, extends, ./base.json, $schema

### Community 53 - "Community 53"
Cohesion: 0.33
Nodes (6): imports, #components/atoms/*, #components/molecules/*, #components/organisms/*, #hooks/*, #lib/*

### Community 54 - "Community 54"
Cohesion: 0.33
Nodes (3): SearchableSelect(), SearchableSelectOption, SearchableSelectProps

### Community 55 - "Community 55"
Cohesion: 0.50
Nodes (3): Badge(), BadgeProps, badgeVariants

## Knowledge Gaps
- **599 isolated node(s):** `Props`, `geistSans`, `geistMono`, `metadata`, `$schema` (+594 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `outputs` connect `Community 7` to `Community 0`, `Community 15`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `!.next/cache/**` connect `Community 0` to `Community 1`, `Community 2`, `Community 38`, `Community 7`, `Community 46`, `Community 27`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 20` to `Community 13`, `Community 48`, `Community 19`, `Community 21`, `Community 54`, `Community 55`, `Community 26`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `Props`, `geistSans`, `geistMono` to the rest of the system?**
  _599 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06466916354556804 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05158324821246169 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07263157894736842 - nodes in this community are weakly interconnected._