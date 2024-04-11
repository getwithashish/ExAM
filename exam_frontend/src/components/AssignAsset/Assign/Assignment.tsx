import styles from "./Assignment.module.css";
import { ApiResponse, EmployeeDetails } from "./types";
import { DataType } from "../../AssetTable/types";

interface AssignmentProps {
  value: string;
  employeeId: number | undefined;
  divVisible: boolean;
  employeeDepartment: string;
  employeeDesignation: string;
  employeeName: string;
  data: ApiResponse | undefined;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNameClick: (
    name: string,
    id: number,
    department: string,
    designation: string
  ) => void;
  handleAssign: () => void;
  record: DataType | null;
}

export const Assignment: React.FC<AssignmentProps> = ({
  value,
  employeeId,
  divVisible,
  employeeDepartment,
  employeeDesignation,
  employeeName,
  data,
  handleInputChange,
  handleNameClick,
  handleAssign,
  record,
}) => {
  return (
    <div>
      <div>
        <form>
          <div className="grid font-display grid-cols-2 gap-3 lg:grid-cols-5 my-3 text-sm">
            <div>
              <label htmlFor="productName">ASSET NAME:</label>
              <input
                type="text"
                id="productName"
                value={record?.product_name}
                className="mt-1 font-display rounded-lg"
                disabled
              />
            </div>
            <div>
              <label htmlFor="assetType">ASSET TYPE:</label>
              <input
                type="text"
                id="assetType"
                value={record?.asset_type}
                className="mt-1 font-display rounded-lg"
                disabled
              />
            </div>
            <div>
              <label htmlFor="configuration">CONFIGURATION:</label>
              <input
                type="text"
                id="configuration"
                value={record?.configuration}
                className="mt-1 font-display rounded-lg"
                disabled
              />
            </div>
            <div>
              <label htmlFor="location">LOCATION:</label>
              <input
                type="text"
                id="location"
                value={record?.location}
                className="mt-1 font-display rounded-lg"
                disabled
              />
            </div>
            <div>
              <label htmlFor="serialNumber">ASSET SERIAL NUMBER:</label>
              <input
                type="text"
                id="serialNumber"
                value={record?.serial_number}
                className="mt-1 font-display rounded-lg"
                disabled
              />
            </div>
            <div>
              <label htmlFor="modelNumber">ASSET MODEL NUMBER:</label>
              <input
                type="text"
                id="modelNumber"
                value={record?.model_number}
                className="mt-1 font-display rounded-lg"
                disabled
              />
            </div>
            <div>
              <label htmlFor="version">VERSION:</label>
              <input
                type="text"
                id="version"
                value={record?.version}
                className="mt-1 font-display rounded-lg"
                disabled
              />
            </div>
            <div>
              <label htmlFor="version">PROCESSOR:</label>
              <input
                type="text"
                id="version"
                value={record?.processor}
                className="mt-1 font-display rounded-lg"
                disabled
              />
            </div>
            <div>
              <label htmlFor="version">MEMORY:</label>
              <input
                type="text"
                id="version"
                value={record?.memory}
                className="mt-1 font-display rounded-lg"
                disabled
              />
            </div>
            <div>
              <label htmlFor="version">STORAGE:</label>
              <input
                type="text"
                id="version"
                value={record?.storage}
                className="mt-1 font-display rounded-lg"
                disabled
              />
            </div>
          </div>
        </form>
      </div>

      <input
        type="text"
        name={"employee"}
        className={styles["search-input"]}
        placeholder="employee name"
        onChange={handleInputChange}
        value={value}
      />
      <div className={divVisible ? styles[""] : styles["result"]}>
        <div className={value && data ? styles[""] : styles["result"]}>
          {data?.data.length ? (
            data.data.map((employee: EmployeeDetails) => (
              <div
                className={styles["resultBox"]}
                key={employee.id}
                onClick={() =>
                  handleNameClick(
                    employee.employee_name,
                    employee.id,
                    employee.employee_department,
                    employee.employee_designation
                  )
                }
              >
                {employee
                  ? employee.employee_name
                  : "sorry no employee not found"}
              </div>
            ))
          ) : (
            <div>{"No employee available"}</div>
          )}
        </div>
      </div>
      <div>
        <button className={styles["assign-button"]} onClick={handleAssign}>
          Assign
        </button>
      </div>

      <div
        className={
          employeeName == value && value
            ? styles["employeeBox"]
            : styles["result"]
        }
      >
        {
          <div>
            <div>employee id :{employeeId}</div>
            <div>employee designation : {employeeDesignation}</div>
            <div>employee department : {employeeDepartment}</div>
          </div>
        }
      </div>
    </div>
  );
};
