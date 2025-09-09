// import React, { useState, useRef } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import axios from "axios";
// import {
//   Button,
//   Modal,
//   Form,
//   Input,
//   Space,
//   Typography,
//   Card,
//   message,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

// import {
//   AllCommunityModule,
//   ModuleRegistry,
//   ClientSideRowModelModule,
//   RowApiModule,
//   ValidationModule,
// } from "ag-grid-community";
// import {
//   RangeSelectionModule,
//   CellSelectionModule,
//   ClipboardModule,
//   ColumnMenuModule,
//   ContextMenuModule,
//   ExcelExportModule,
//   IntegratedChartsModule,
//   MenuModule,
//   CsvExportModule,
//   SideBarModule,
//   ColumnsToolPanelModule,
//   MasterDetailModule,
//   ServerSideRowModelModule,
//   ServerSideRowModelApiModule,
// } from "ag-grid-enterprise";

// ModuleRegistry.registerModules([
//   RangeSelectionModule,
//   ClipboardModule,
//   ExcelExportModule,
//   ColumnMenuModule,
//   ContextMenuModule,
//   CellSelectionModule,
//   AllCommunityModule,
//   MenuModule,
//   CsvExportModule,
//   IntegratedChartsModule,
//   SideBarModule,
//   RowApiModule,
//   ClientSideRowModelModule,
//   ColumnsToolPanelModule,
//   MasterDetailModule,
//   ValidationModule,
//   ServerSideRowModelModule,
//   ServerSideRowModelApiModule,
// ]);

// const { Title } = Typography;

// const App = () => {
//   const [form] = Form.useForm();
//   const gridRef = useRef();
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState(null);

//   const columnDefs = [
//     { headerName: "Emp ID", field: "empId", filter: "agTextColumnFilter" },
//     { headerName: "Name", field: "name", filter: "agTextColumnFilter" },
//     { headerName: "Age", field: "age", filter: "agNumberColumnFilter" },
//     { headerName: "Role", field: "role", filter: "agTextColumnFilter" },
//     {
//       headerName: "Actions",
//       cellRenderer: (params) => (
//         <Space>
//           <Button
//             type="text"
//             icon={<EditOutlined style={{ fontSize: 16 }} />}
//             onClick={() => handleEdit(params.data)}
//             style={{ padding: 0 }}
//           />
//           <Button
//             type="text"
//             danger
//             icon={<DeleteOutlined style={{ fontSize: 16 }} />}
//             onClick={() => handleDelete(params.data._id)}
//             style={{ padding: 0 }}
//           />
//         </Space>
//       ),
//       sortable: false,
//       filter: false,
//     },
//   ];

//   const defaultColDef = {
//     flex: 1,
//     sortable: true,
//     filter: true,
//     resizable: true,
//   };

//   const createServerSideDatasource = () => ({
//     getRows: async (params) => {
//       try {
//         const res = await axios.post("http://localhost:5000/api/employees", {
//           startRow: params.request.startRow,endRow: params.request.endRow,sortModel: params.request.sortModel,
//           filterModel: params.request.filterModel,});
//         const { rows, totalCount } = res.data;
//         params.success({ rowData: rows, rowCount: totalCount });
//       } catch (err) {
//         params.fail();
//       }
//     },
//   });

//   const onGridReady = (params) => {
//     gridRef.current = params.api;

//     params.api.setGridOption("serverSideDatasource", createServerSideDatasource());
//   };
//   const handleAdd = () => {
//     setEditingEmployee(null);
//     form.resetFields();
//     setIsModalVisible(true);
//   };
//   const handleEdit = (employee) => {
//     setEditingEmployee(employee);
//     form.setFieldsValue({ ...employee });
//     setIsModalVisible(true);
//   };

//  const handleDelete = async (id) => {
//   try {
//     await axios.delete(`http://localhost:5000/api/employees/${id}`);
//     message.success("Employee deleted successfully");

//     if (gridRef.current?.applyServerSideTransaction) {
//       gridRef.current.applyServerSideTransaction({
//         remove: [{ _id: id }],
//       });
//     }

//     if (gridRef.current?.refreshServerSide) {
//       gridRef.current.refreshServerSide({ purge: false });
//     }

//   } catch {
//     message.error("Error deleting employee");
//   }
// };


//   const handleSubmit = async () => {
//   try {
//     const values = await form.validateFields();

//     if (editingEmployee) {
//       const res = await axios.put(
//         `http://localhost:5000/api/employees/${editingEmployee._id}`,
//         values
//       );
//       message.success("Employee updated successfully");

//       if (gridRef.current?.applyServerSideTransaction) {
//         gridRef.current.applyServerSideTransaction({
//           update: [{ ...editingEmployee, ...res.data }],
//         });
//       }
//     } else {
//       const res = await axios.post(
//         "http://localhost:5000/api/employees/add",
//         values
//       );
//       message.success("Employee added successfully");

//       if (gridRef.current?.applyServerSideTransaction) {
//         gridRef.current.applyServerSideTransaction({
//           add: [res.data],
//         });
//       }
//     }

//     if (gridRef.current?.refreshServerSide) {
//       gridRef.current.refreshServerSide({ purge: false });
//     }

//     setIsModalVisible(false);
//   } catch {
//     message.error("Error saving employee");
//   }
// };

//   return (
//     <div style={{ padding: 24, background: "#f4f6f8", minHeight: "100vh" }}>
//       <Card
//         style={{ marginBottom: 20, borderRadius: 10 }}
//         bodyStyle={{ padding: 20 }}
//       >
//         <Space
//           align="center"
//           style={{
//             width: "100%",
//             justifyContent: "space-between",
//           }}
//         >
//           <Title level={3} style={{ margin: 0 }}>
//             Employee Management
//           </Title>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={handleAdd}
//             size="large"
//           >
//             Add Employee
//           </Button>
//         </Space>
//       </Card>

//       <Card style={{ borderRadius: 10 }}>
//         <div
//           className="ag-theme-alpine"
//           style={{ height: "70vh", width: "100%" }}
//         >
//           <AgGridReact
//             ref={gridRef}
//             columnDefs={columnDefs}
//             defaultColDef={defaultColDef}
//             onGridReady={onGridReady}
//             pagination
//             paginationPageSize={10}
//             getRowId={(params) => params.data._id}
//             rowModelType="serverSide"
//             serverSideEnableTransaction={true}
//             cacheBlockSize={10}
//             maxBlocksInCache={1}
//             animateRows
//           />
//         </div>
//       </Card>

//       <Modal
//         title={editingEmployee ? "Edit Employee" : "Add Employee"}
//         open={isModalVisible}
//         onOk={handleSubmit}
//         onCancel={() => setIsModalVisible(false)}
//         width={500}
//         okText="Save"
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="empId"
//             label="Employee ID"
//             rules={[{ required: true, message: "Please enter Employee ID!" }]}
//           >
//             <Input placeholder="Enter employee ID" />
//           </Form.Item>
//           <Form.Item
//             name="name"
//             label="Name"
//             rules={[{ required: true, message: "Please enter name!" }]}
//           >
//             <Input placeholder="Enter name" />
//           </Form.Item>
//           <Form.Item
//             name="age"
//             label="Age"
//             rules={[{ required: true, message: "Please enter age!" }]}
//           >
//             <Input type="number" placeholder="Enter age" />
//           </Form.Item>
//           <Form.Item
//             name="role"
//             label="Role"
//             rules={[{ required: true, message: "Please enter role!" }]}
//           >
//             <Input placeholder="Enter role" />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default App;








import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Typography,
  Card,
  message,
  Collapse,
  Spin,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { Panel } = Collapse;

const App = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://backak-1ayu.onrender.com/api/employees");
      setEmployees(res.data);
    } catch (err) {
      message.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue(employee);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backak-1ayu.onrender.com/api/employees/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
      message.success("Employee deleted successfully");
    } catch {
      message.error("Error deleting employee");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingEmployee) {
        const res = await axios.put(
          `https://backak-1ayu.onrender.com/api/employees/${editingEmployee._id}`,
          values
        );
        setEmployees(
          employees.map((emp) => (emp._id === editingEmployee._id ? res.data : emp))
        );
        message.success("Employee updated successfully");
      } else {
        const res = await axios.post(
          "https://backak-1ayu.onrender.com/api/employees/add",
          values
        );
        setEmployees([...employees, res.data]);
        message.success("Employee added successfully");
      }
      setIsModalVisible(false);
    } catch {
      message.error("Error saving employee");
    }
  };

  // Sort by Employee ID
  const sortedEmployees = [...employees].sort((a, b) =>
    a.empId.localeCompare(b.empId)
  );

  const filteredEmployees = sortedEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Emp ID",
      dataIndex: "empId",
      key: "empId",
      sorter: (a, b) => a.empId.localeCompare(b.empId),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "blue" }} />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 sm:p-8 md:p-12 lg:p-16 xl:p-24 min-h-screen bg-blue-100">
      {/* Header Card */}
      <Card className="mb-5 rounded-lg sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12" bodyStyle={{ padding: 20 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Title level={3} className="m-0 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            Employee Management
          </Title>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Input.Search
              placeholder="Search..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-48 md:w-60 lg:w-72 xl:w-96"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="large"
              className="mt-2 sm:mt-0"
            >
              Add Employee
            </Button>
          </div>
        </div>
      </Card>

      {/* Table or Loading */}
      <Card className="rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <Table
                columns={columns}
                dataSource={filteredEmployees}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 800 }}
              />
            </div>

            {/* Mobile Collapse */}
            <div className="sm:hidden">
              <Collapse accordion>
                {filteredEmployees.map((emp) => (
                  <Panel header={`${emp.empId} - ${emp.name}`} key={emp._id}>
                    <p><b>Employee ID:</b> {emp.empId}</p>
                    <p><b>Name:</b> {emp.name}</p>
                    <p><b>Age:</b> {emp.age}</p>
                    <p><b>Role:</b> {emp.role}</p>
                    <Space>
                      <Button
                        type="text"
                        icon={<EditOutlined style={{ color: "blue" }} />}
                        onClick={() => handleEdit(emp)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(emp._id)}
                      >
                        Delete
                      </Button>
                    </Space>
                  </Panel>
                ))}
              </Collapse>
            </div>
          </>
        )}
      </Card>

      {/* Modal */}
      <Modal
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={500}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="empId"
            label="Employee ID"
            rules={[{ required: true, message: "Please enter Employee ID!" }]}
          >
            <Input placeholder="Enter employee ID" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: "Please enter age!" }]}
          >
            <Input type="number" placeholder="Enter age" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please enter role!" }]}
          >
            <Input placeholder="Enter role" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;


