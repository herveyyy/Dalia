import { db } from "@repo/db";

export async function getEmployees(companyId: string) {
  try {
    const employeesList = await db.query.employee.findMany({
      where: (emp, { eq }) => eq(emp.companyId, companyId),
      with: {
        emergencyContacts: true,
        deductions: {
          with: {
            deductionType: true,
          },
        },
        allowances: {
          with: {
            allowanceType: true,
          },
        },
      },
    });

    return employeesList;
  } catch (error) {
    console.error("Failed to fetch employees list:", error);
    throw new Error("Failed to fetch employees list");
  }
}
