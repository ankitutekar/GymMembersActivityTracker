import React, { useState, useMemo, createContext, useContext } from "react";
import DataGrid, { SortColumn, Column } from "react-data-grid";

import { Row, Filter } from "./types";
import "./grid-styles.css";
import "./styles.css";

//import { columnsData, rowsData, filters } from "./grid-builder";
import { exportToCsv, exportToPdf } from "./exportUtils";

//type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
const FilterContext = createContext<Filter | undefined>({ name: "" });
function ExportButton({
	onExport,
	children,
}: {
	onExport: () => Promise<unknown>;
	children: React.ReactChild;
}) {
	const [exporting, setExporting] = useState(false);
	return (
		<button
			type="button"
			disabled={exporting}
			onClick={async () => {
				setExporting(true);
				await onExport();
				setExporting(false);
			}}
		>
			{exporting ? "Exporting" : children}
		</button>
	);
}

const App: React.FC = () => {
	function FilterRenderer<R, SR>({
		column,
		children,
	}: any & {
		children: (filters: Filter) => React.ReactElement;
	}) {
		const filters = useContext(FilterContext)!;
		return (
			<>
				<div>{column.name}</div>
				{<div>{children(filters)}</div>}
			</>
		);
	}

	const generateColumnsData = (): Column<Row>[] => {
		const columnsData: Column<Row>[] = [];
		const leavePossibleValues = ["ON LEAVE", "TENTATIVE", "NO"];
		//name column
		const column: Column<Row> = {
			key: "resourceName",
			name: "Name",
			editable: true,
			resizable: true,
			sortable: true,
			width: "15%",
			frozen: true,
			renderSummaryCell() {
				return <strong>Total</strong>;
			},
			headerCellClass: "filter-cell",
			renderHeaderCell: (p) => (
				<FilterRenderer column={p.column}>
					{(filters: any) => (
						<input
							className="filter-cell left-mergin"
							value={filters.name}
							onChange={(e) =>
								setFilters({
									...filters,
									name: e.target.value,
								})
							}
						/>
					)}
				</FilterRenderer>
			),
		};
		columnsData.push(column);

		//days of the month
		for (let i = 1; i <= 31; i++) {
			const column: Column<Row> = {
				key: i.toString(),
				name: i.toString(),
				editable: true,
				sortable: true,
				renderCell: (p) => (
					<div className="square-container">
						<span
							className={
								p.row[i] == "ON LEAVE"
									? "square-red"
									: p.row[i] == "TENTATIVE"
									? "square-yellow"
									: ""
							}
						/>
					</div>
				),
				renderEditCell: (p) => (
					<select
						autoFocus
						value={p.row[i]}
						onChange={(e) => {
							let newRow = { ...p.row };
							newRow[i] = e.target.value;
							p.onRowChange(newRow, true);
						}}
					>
						{leavePossibleValues.map((val) => (
							<option key={val} value={val}>
								{val}
							</option>
						))}
					</select>
				),
				renderSummaryCell({ row }) {
					const rowData = row as any;
					return `${rowData.totalCount} records`;
				},
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
					decider <= 0.2
						? "ON LEAVE"
						: decider < 0.35
						? "TENTATIVE"
						: "NO";
			}

			mockData.push(row);
		}

		return mockData;
	};
	const columnsData: Column<Row>[] = generateColumnsData();

	const rowsData: Row[] = generateMockRowsData();
	const [rows, setRows] = useState(rowsData);
	const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

	const [filters, setFilters] = useState<Filter>({
		name: "",
	});

	function rowKeyGetter(row: Row) {
		return row.resourceName;
	}

	type Comparator = (a: Row, b: Row) => number;

	function getComparator(sortColumn: string): Comparator {
		switch (sortColumn) {
			case "resourceName":
				return (a: Row, b: Row) =>
					a.resourceName.localeCompare(b.resourceName);
			default:
				return (a, b) => {
					return leavesComparator(a[sortColumn], b[sortColumn]);
				};
		}
	}

	function leavesComparator(a: string, b: string) {
		const order = ["ON LEAVE", "TENTATIVE", "NO"];
		const indexA = order.indexOf(a);
		const indexB = order.indexOf(b);

		if (indexA < indexB) {
			return -1; // a should come before b
		} else if (indexA > indexB) {
			return 1; // b should come before a
		} else {
			return 0; // a and b are equal in terms of sorting
		}
	}

	const sortedRows = useMemo((): readonly Row[] => {
		if (sortColumns.length === 0) return rows;

		return [...rows].sort((a, b) => {
			for (const sort of sortColumns) {
				const comparator = getComparator(sort.columnKey);
				const compResult = comparator(a, b);
				if (compResult !== 0) {
					return sort.direction === "ASC" ? compResult : -compResult;
				}
			}
			return 0;
		});
	}, [rows, sortColumns]);

	const filteredRows = useMemo(() => {
		if (!filters.name) return sortedRows;
		return sortedRows.filter((r) => {
			return filters.name ? r.resourceName.includes(filters.name) : true;
		});
	}, [sortedRows, filters]);

	const gridElement = (
		<DataGrid
			columns={columnsData}
			rows={filteredRows}
			rowKeyGetter={rowKeyGetter}
			onRowsChange={setRows}
			headerRowHeight={95}
			sortColumns={sortColumns}
			onSortColumnsChange={setSortColumns}
			className="rdg-light fill-grid"
		/>
	);

	return (
		<div>
			<div className="toolbar">
				<ExportButton
					onExport={() => exportToCsv(gridElement, "data.csv")}
				>
					Export to CSV
				</ExportButton>
				<ExportButton
					onExport={() => exportToPdf(gridElement, "data.pdf")}
				>
					Export to PDF
				</ExportButton>
			</div>
			{gridElement}
		</div>
	);
};

export default App;
