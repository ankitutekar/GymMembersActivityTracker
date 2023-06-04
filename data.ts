import { Column } from "react-data-grid";

import { Row } from "./types";

const generateColumnsData = (): Column<Row>[] => {
	const columnsData: Column<Row>[] = [];

	//name column
	const column: Column<Row> = { key: "resourceName", name: "Name" };
	columnsData.push(column);

	//days of the month
	for (let i = 1; i <= 31; i++) {
		const column: Column<Row> = { key: i.toString(), name: i.toString() };
		columnsData.push(column);
	}

	return columnsData;
};

const generateMockRowsData = (): Row[] => {
	const mockData: Row[] = [];

	for (let i = 1; i <= 100; i++) {
		const row = {} as Row;
		row["resourceName"] = "Ankit Core";
		for (let j = 2; j <= 32; j++) {
			row[j.toString()] = Math.random() < 0.5 ? "NO" : "YES";
		}

		mockData.push(row);
	}

	return mockData;
};

const columnsData: Column<Row>[] = generateColumnsData();

const rowsData: Row[] = generateMockRowsData();

export { columnsData, rowsData };
