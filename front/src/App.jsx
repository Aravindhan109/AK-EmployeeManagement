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










import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import {
  Button,
  Modal,
  Form,
  Input,
  Space,
  Typography,
  Card,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  AllCommunityModule,
  ModuleRegistry,
  ClientSideRowModelModule,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  RangeSelectionModule,
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  IntegratedChartsModule,
  MenuModule,
  CsvExportModule,
  SideBarModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  RangeSelectionModule,
  ClipboardModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  AllCommunityModule,
  MenuModule,
  CsvExportModule,
  IntegratedChartsModule,
  SideBarModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ValidationModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
]);

const { Title } = Typography;

const App = () => {
  const [form] = Form.useForm();
  const gridRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [quickSearch, setQuickSearch] = useState("");

  const columnDefs = [
    { headerName: "Emp ID", field: "empId", filter: "agTextColumnFilter" },
    { headerName: "Name", field: "name", filter: "agTextColumnFilter" },
    { headerName: "Age", field: "age", filter: "agNumberColumnFilter" },
    { headerName: "Role", field: "role", filter: "agTextColumnFilter" },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined style={{ fontSize: 16, color: "blue", cursor: "pointer" }} />}
            onClick={() => handleEdit(params.data)}
            style={{ padding: 0 }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined style={{ fontSize: 16, cursor: "pointer" }} />}
            onClick={() => handleDelete(params.data._id)}
            style={{ padding: 0 }}
          />
        </Space>
      ),
      sortable: false,
      filter: false,
    },
  ];

  const defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: { alignItems: "center" },
  };

  const createServerSideDatasource = (quickSearchValue) => ({
    getRows: async (params) => {
      try {
        const res = await axios.post("http://localhost:5000/api/employees", {
          startRow: params.request.startRow,
          endRow: params.request.endRow,
          sortModel: params.request.sortModel,
          filterModel: params.request.filterModel,
          quickSearch: quickSearchValue,
        });
        const { rows, totalCount } = res.data;
        params.success({ rowData: rows, rowCount: totalCount });
      } catch (err) {
        params.fail();
      }
    },
  });

  const onGridReady = (params) => {
    gridRef.current = params.api;
    params.api.setGridOption("serverSideDatasource", createServerSideDatasource());
  };

  const handleQuickSearch = (e) => {
  const value = e.target.value;
  setQuickSearch(value);
  if (gridRef.current) {
    const datasource = createServerSideDatasource(value);
    gridRef.current.setGridOption("serverSideDatasource", datasource);
    gridRef.current.refreshServerSide({ purge: true }); 
  }
};

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue({ ...employee });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      message.success("Employee deleted successfully");

      if (gridRef.current?.applyServerSideTransaction) {
        gridRef.current.applyServerSideTransaction({
          remove: [{ _id: id }],
        });
      }

      if (gridRef.current?.refreshServerSide) {
        gridRef.current.refreshServerSide({ purge: false });
      }
    } catch {
      message.error("Error deleting employee");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingEmployee) {
        const res = await axios.put(
          `http://localhost:5000/api/employees/${editingEmployee._id}`,
          values
        );
        message.success("Employee updated successfully");

        if (gridRef.current?.applyServerSideTransaction) {
          gridRef.current.applyServerSideTransaction({
            update: [{ ...editingEmployee, ...res.data }],
          });
        }
      } else {
        const res = await axios.post("http://localhost:5000/api/employees/add", values);
        message.success("Employee added successfully");

        if (gridRef.current?.applyServerSideTransaction) {
          gridRef.current.applyServerSideTransaction({
            add: [res.data],
          });
        }
      }

      if (gridRef.current?.refreshServerSide) {
        gridRef.current.refreshServerSide({ purge: false });
      }

      setIsModalVisible(false);
    } catch {
      message.error("Error saving employee");
    }
  };

  return (
    <div style={{ padding: 24, backgroundColor: "rgba(106, 192, 226, 0.4)", minHeight: "100vh" }}>
      <Card style={{ marginBottom: 20, borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Space
          align="center"
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Employee Management
          </Title>

          <Space>
            <Input.Search
              placeholder="Search..."
              allowClear
              onChange={handleQuickSearch}
              style={{ width: 200 }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="large"
            >
              Add Employee
            </Button>
          </Space>
        </Space>
      </Card>

      <Card style={{ borderRadius: 10 }}>
        <div className="ag-theme-quartz" style={{ height: "70vh", width: "100%" }}>
          <AgGridReact
            rowHeight={40}
            ref={gridRef}
            columnDefs={columnDefs.map((col) => ({
              ...col,
              cellStyle: {
                display: "flex",
                alignItems: "center",
              },
            }))}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            getRowId={(params) => params.data._id}
            rowModelType="serverSide"
            serverSideEnableTransaction={true}
            cacheBlockSize={50}
            animateRows
          />
        </div>
      </Card>

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
