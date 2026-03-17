import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import { createRoot } from "react-dom/client";
import "../styles/Datatable.css";
import { STATUS_STYLES } from '../utils/CommonUtil';
import Badge from './Badge';

DataTable.use(DT);

const thStyle = {
    fontSize: 13,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: "#8a8880",
    fontWeight: 400,
    borderBottom: "1px solid #e2e2de",
    paddingBottom: 12,
};

const StatusBadge = ({ status }) => (
    <Badge value={status} stylesMap={STATUS_STYLES} />
);

export default function LogHistory({ logs }) {
    const options = {
        ordering: false,
        layout: {
            topStart: null,
            topEnd: null,
            bottomStart: null,
            bottomEnd: null
        },
        language: {
            emptyTable: "No logs yet."
        }
    };

    const columns = [
        {
            data: null,
            className: "text-center",
            sortable: false,
            render: (data, type, row, meta) =>
                `<span style="color: #8a8880; font-size: 16px;">${meta.row + meta.settings._iDisplayStart + 1}</span>`,
        },
        {
            data: "createdAt",
            width: "20%",
            render: (data) => {
                const date = new Date(data);
                return `<span style="color: #8a8880; font-size: 16px;">${date.toLocaleString("en-GB")}</span>`;
            }
        },
        {
            data: "createdBy",
            render: (data) => `<span style="font-weight: 500; color: #111; font-size: 16px;">${data}</span>`,
        },
        {
            data: "status",
            createdCell: (td, cellData) => {
                const root = createRoot(td);
                root.render(<StatusBadge status={cellData} />);
            }
        },
        {
            data: "description",
            render: (data) => `<span style="font-weight: 500; color: #111; font-size: 16px;">${data}</span>`,
        }
    ];
    
    return (
        <div className="card p-4">
            <p style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#8a8880", margin: 0 }}>
                Log history
            </p>

            <DataTable className="table" style={{ fontSize: 14 }} data={logs} options={options} columns={columns}>
                <thead>
                    <tr>
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>Timestamp</th>
                        <th style={thStyle}>User</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Description</th>
                    </tr>
                </thead>
                <tbody className="align-middle"></tbody>
            </DataTable>
        </div>
    )
};
