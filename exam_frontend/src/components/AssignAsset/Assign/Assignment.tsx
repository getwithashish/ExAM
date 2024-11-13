import styles from "./Assignment.module.css";
import { ApiResponse, EmployeeDetails } from "./types";
import { DataType } from "../../AssetTable/types";
import { Form } from "antd";
import AssetFieldAutoComplete from "../../AutocompleteBox/AssetFieldAutoComplete";
import { Button, TextField } from "@mui/material";

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
  businessUnit,
  setBusinessUnit,
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
      <div className="grid font-display grid-cols-3 items-center justify-center gap-2 mt-5 lg:grid-cols-3 my-3 text-sm text-white">
        <div>
          <Form.Item>
            <b>Search for employee:</b>
            <br></br>
            <br></br>
            <TextField
              type="text"
              name={"employee"}
              className="rounded-lg bg-custom-400 font-display w-full"
              placeholder="Enter employee name"
              onChange={handleInputChange}
              value={value}
            />
          </Form.Item>
        </div>

        <div>
          <Form.Item
            name="business_unit"
            style={{ boxShadow: "none", border: "none" }}
          >
            <b>Business Unit: </b>
            <br></br>
            <br></br>
            <AssetFieldAutoComplete
              assetField="business_unit"
              value={businessUnit}
              setValue={setBusinessUnit}
            />
          </Form.Item>
        </div>

        <div className="mt-6">
          <Form.Item>
          <Button
            className="rounded-lg"
            disabled={!employeeId || businessUnit === ""}
            onClick={handleAssign}
            size="large"
          >
            Assign
          </Button>
          </Form.Item>
        </div>
      </div>
      <div className={divVisible ? styles[""] : styles["result"]}>
        <div className={value && data ? styles[""] : styles["result"]}>
          <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-gray-800 rounded-lg my-10">
            {data?.data.length ? (
              data.data.map((employee: EmployeeDetails) => (
                <div
                  className="text-lg text-white shadow-lg bg-custom-400 border border-gray-300 rounded-lg p-2 w-64 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
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
                  {employee ? (
                    <div>
                      <h2 className="text-xl font-semibold">
                        {employee.employee_name}{" "}
                        <span className="text-sm">({employee.id})</span>
                      </h2>
                      {/* <p>{employee.employee_department}</p>
                        <p>{employee.employee_designation}</p> */}
                      <p className="text-sm font-semibold">Software Engineer</p>
                      <p className="text-sm font-semibold">DU6</p>
                    </div>
                  ) : (
                    "Sorry!!! Employee with this name does not exist"
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-lg text-red-500 p-5 my-10">
                {" "}
                {"Sorry!!! Employee with this name does not exist"}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flexbox items-center justify-center">
        <div
          className={
            employeeName == value && value
              ? "mt-20 bg-gradient-to-r from-gray-800 to-teal-900 hover:from-gray-800 hover:to-teal-700 p-10 w-full text-lg font-display font-semibold rounded-xl text-white inline-block"
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
