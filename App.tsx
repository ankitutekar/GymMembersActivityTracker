import React from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";

import { columnsData, rowsData } from "./data";

const App: React.FC = () => {
	return <DataGrid columns={columnsData} rows={rowsData} />;
};

export default App;
