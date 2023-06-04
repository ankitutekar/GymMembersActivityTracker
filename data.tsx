import React from "react";
import { Column } from "react-data-grid";

import { Row } from "./types";

const generateColumnsData = (): Column<Row>[] => {
	const columnsData: Column<Row>[] = [];

	//name column
	const column: Column<Row> = {
		key: "resourceName",
		name: "Name",
		editable: false,
		resizable: true,
		sortable: true,
		width: "15%",
		frozen: true,
	};
	columnsData.push(column);

	//days of the month
	for (let i = 1; i <= 31; i++) {
		const column: Column<Row> = {
			key: i.toString(),
			name: i.toString(),
			editable: true,
			renderCell: (p) => (
				<div className="square-container">
					<span
						className={
							p.row[i] == "YES"
								? "square-red"
								: p.row[i] == "MAYBE"
								? "square-yellow"
								: ""
						}
					/>
				</div>
			),
		};
		columnsData.push(column);
	}

	return columnsData;
};

const generateMockRowsData = (): Row[] => {
	const mockData: Row[] = [];

	for (let i = 1; i <= 100; i++) {
		const row = {} as Row;
		row["resourceName"] = "Ankit Core #" + i.toString();
		for (let j = 1; j <= 31; j++) {
			const decider = Math.random();
			row[j.toString()] =
				decider <= 0.2 ? "YES" : decider < 0.4 ? "MAYBE" : "NO";
		}

		mockData.push(row);
	}

	return mockData;
};

const columnsData: Column<Row>[] = generateColumnsData();

const rowsData: Row[] = generateMockRowsData();

export { columnsData, rowsData };
