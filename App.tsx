import React, { useState } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";

import { Row } from "./types";
import "./grid-styles.css";

import { columnsData, rowsData } from "./data";

const App: React.FC = () => {
	const [rows, setRows] = useState(rowsData);

	function rowKeyGetter(row: Row) {
		return row.resourceName;
	}

	return (
		<div className="rootContainer">
			<DataGrid
				columns={columnsData}
				rows={rows}
				rowKeyGetter={rowKeyGetter}
				onRowsChange={setRows}
				headerRowHeight={45}
				className="rdg-light fill-grid"
			/>
		</div>
	);
};

export default App;
