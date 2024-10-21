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
          <div className="grid font-display grid-cols-2 gap-2 lg:grid-cols-4 my-3 text-sm">
            <div>
              <label htmlFor="productName">ASSET NAME:</label>
              <input
                type="text"
                id="productName"
                value={record?.product_name}
                className="mt-1 font-display bg-custom-400 rounded-lg font-semibold"
                disabled
              />
            </div>
            <div>
              <label htmlFor="assetType">ASSET TYPE:</label>
              <input
                type="text"
                id="assetType"
                value={record?.asset_type}
                className="mt-1 font-display bg-custom-400 rounded-lg font-semibold"
                disabled
              />
            </div>
            <div>
              <label htmlFor="configuration">CONFIGURATION:</label>
              <input
                type="text"
                id="configuration"
                value={record?.configuration}
                className="mt-1 font-display bg-custom-400 rounded-lg font-semibold"
                disabled
              />
            </div>
            <div>
              <label htmlFor="location">LOCATION:</label>
              <input
                type="text"
                id="location"
                value={record?.location}
                className="mt-1 font-display bg-custom-400 rounded-lg font-semibold"
                disabled
              />
            </div>
            <div>
              <label htmlFor="serialNumber">ASSET SERIAL NUMBER:</label>
              <input
                type="text"
                id="serialNumber"
                value={record?.serial_number}
                className="mt-1 font-display bg-custom-400 rounded-lg font-semibold"
                disabled
              />
            </div>
            <div>
              <label htmlFor="modelNumber">ASSET MODEL NUMBER:</label>
              <input
                type="text"
                id="modelNumber"
                value={record?.model_number}
                className="mt-1 font-display bg-custom-400 rounded-lg font-semibold"
                disabled
              />
            </div>
            <div>
              <label htmlFor="version">VERSION:</label>
              <input
                type="text"
                id="version"
                value={record?.version}
                className="mt-1 font-display bg-custom-400 rounded-lg font-semibold"
                disabled
              />
            </div>
            <div>
              <label htmlFor="version">PROCESSOR:</label>
              <input
                type="text"
                id="version"
                value={record?.processor}
                className="mt-1 font-display bg-custom-400 rounded-lg font-semibold"
                disabled
              />
            </div>
            <div>
              <label htmlFor="version">MEMORY:</label>
              <input
                type="text"
                id="version"
                value={record?.memory}
                className="mt-1 font-display bg-custom-400 rounded-lg font-semibold"
                disabled
              />
            </div>
            <div>
              <label htmlFor="version">STORAGE:</label>
              <input
                type="text"
                id="version"
                value={record?.storage}
                className="mt-1 font-display bg-custom-400 rounded-lg font-semibold"
                disabled
              />
            </div>
          </div>
        </form>
      </div>
      <div className="grid font-display grid-cols-3 items-center justify-center gap-2 mt-20 lg:grid-cols-3 my-3 text-sm">
        <div className="text-xl  text-right">
          <span>
            Search for employee:
          </span>
        </div>
        <div>
          <input
            type="text"
            name={"employee"}
            className="rounded-lg bg-custom-400 font-display w-full"
            placeholder="Enter employee name"
            onChange={handleInputChange}
            value={value}
          />
        </div>

        <div>
          <button className={styles["assign-button"]} onClick={handleAssign}>
            Assign
          </button>
        </div>
      </div>
      <div className={divVisible ? styles[""] : styles["result"]}>
        <div className={value && data ? styles[""] : styles["result"]}>
          <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-gray-800 rounded-lg my-10">
            {data?.data.length ? (
              data.data.map((employee: EmployeeDetails) => (
                <div
                  className='text-lg my-10 shadow-lg bg-custom-400 border border-gray-300 rounded-lg p-4 w-80 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer'
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
                    ? (
                      <div>
                        <h2 className='text-xl font-semibold'>{employee.employee_name}</h2>
                        <p>{employee.employee_department}</p>
                        <p>{employee.employee_designation}</p>
                      </div>
                    )
                    : "sorry no employee not found"}
                </div>
              ))
            ) : (
              <div className="text-center text-lg text-red-500 p-5 my-10"> {"No employee available"}</div>
            )}
          </div>
        </div>
      </div>
      <div className="flexbox items-center justify-center">
        <div
          className={
            employeeName == value && value
              ? 'mt-20 bg-gradient-to-r from-gray-800 to-teal-900 hover:from-gray-800 hover:to-teal-700 p-10 w-full text-lg font-display font-semibold rounded-xl text-white inline-block'
              : styles["result"]
          }
        >
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <span>Employee Name:</span>
              <span className="items-start">{employeeName}</span>
            </div>
            <div className="flex justify-between">
              <span>Employee ID:</span>
              <span>{employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span>Employee Designation:</span>
              <span>{employeeDesignation}</span>
            </div>
            <div className="flex justify-between">
              <span>Employee Department:</span>
              <span>{employeeDepartment}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
