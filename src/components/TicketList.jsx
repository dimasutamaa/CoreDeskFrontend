import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import { useEffect, useState } from 'react';
import "../styles/Datatable.css";
import api from '../api/api';
import Swal from 'sweetalert2';
import TicketFilter from './TicketFilter';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PRIORITY_STYLES, STATUS_STYLES } from '../utils/CommonUtil';
import { popupMessage } from './Alert';

DataTable.use(DT);

const badge = (styles) => `
    <span style="
        font-size: 12px;
        letter-spacing: .06em;
        text-transform: uppercase;
        color: ${styles.color};
        background: ${styles.bg};
        border: 1px solid ${styles.border};
        border-radius: 2px;
        padding: 3px 8px;
        font-family: 'Syne', sans-serif;
    ">${styles.label}</span>
`;

const EMPTY_FILTERS = {
    search: "",
    status: "",
    priority: "",
    createdBy: "",
    assignedTo: "",
    dateFrom: "",
    dateTo: "",
};

const thStyle = {
    fontSize: 13,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: "#8a8880",
    fontWeight: 400,
    borderBottom: "1px solid #e2e2de",
    paddingBottom: 12,
};

const buildParams = (filters) => {
    const params = {};

    if (filters.search) params.title = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.createdBy) params.createdBy = filters.createdBy;
    if (filters.assignedTo) params.assignedTo = filters.assignedTo;
    if (filters.dateFrom) params.from = filters.dateFrom;
    if (filters.dateTo) params.to = filters.dateTo;

    return params;
};

export default function TicketList() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState(null);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchTickets = async (activeFilters) => {
        setLoading(true);
        try {
            const params = buildParams(activeFilters);
            const response = await api.get("/tickets", { params });
            setTickets(response.data.data);
        } catch (error) {
            popupMessage("Error", "Failed to load tickets. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets(EMPTY_FILTERS);
    }, []);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        fetchTickets(newFilters);
    };

    const handleFilterReset = () => {
        setFilters(EMPTY_FILTERS);
        fetchTickets(EMPTY_FILTERS);
    };

    const options = {
        processing: true,
        ordering: false,
        layout: {
            topStart: null,
            topEnd: null,
            bottomStart: {
                info: {
                    text: "Showing _START_–_END_ of _TOTAL_ tickets"
                }
            },
            bottomEnd: {
                pageLength: {
                    text: "Per page &nbsp _MENU_"
                },
                paging: {
                    buttons: 3
                }
            }
        },
        lengthMenu: [10, 15, 20],
        language: {
            processing: "Loading tickets...",
            emptyTable: "No tickets found."
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
            data: "title",
            width: "16%",
            render: (data) => `<span style="font-weight: 500; color: #111; font-size: 16px;">${data}</span>`,
        },
        {
            data: "status",
            width: "12%",
            render: (data) => badge(STATUS_STYLES[data] ?? { label: data, color: "#8a8880", bg: "#f8f8f6", border: "#e2e2de" }),
        },
        {
            data: "priority",
            width: "12%",
            render: (data) => badge(PRIORITY_STYLES[data] ?? { label: data, color: "#8a8880", bg: "#f8f8f6", border: "#e2e2de" }),
        },
        {
            data: "slaDate",
            width: "13%",
            render: (data) => {
                const date = new Date(data);
                return `<span style="color: #8a8880; font-size: 16px;">${date.toLocaleString("en-GB")}</span>`;
            }
        },
        {
            data: "createdBy.username",
            width: "13%",
            render: (data) => `<span style="color: #8a8880; font-size: 16px;">${data ?? "-"}</span>`,
        },
        {
            data: "createdAt",
            render: (data) => {
                const date = new Date(data);
                return `<span style="color: #8a8880; font-size: 16px;">${date.toLocaleString("en-GB")}</span>`;
            }
        },
        {
            data: "assignedTo.username",
            defaultContent: `<span style="color: #c8c4be; font-size: 16px;">Unassigned</span>`,
            render: (data) => data
                ? `<span style="color: #8a8880; font-size: 16px;">${data}</span>`
                : `<span style="color: #c8c4be; font-size: 16px;">Unassigned</span>`,
        },
        {
            data: "id",
            className: "text-center",
            sortable: false,
            createdCell: (td, cellData) => {
                const button = document.createElement("button");
                button.className = "btn btn-dark btn-sm process-btn";
                button.textContent = "View";

                button.onclick = () => {
                    const basePath = user.role === "ADMIN"
                        ? "/admin/tickets" : user.role === "AGENT" 
                        ? "/agent/tickets" : "/dashboard/tickets";

                    navigate(`${basePath}/${cellData}`);
                }

                td.innerHTML = "";
                td.appendChild(button);
            }
        }
    ];

    return (
        <div>
            <p className="text-muted mb-1" style={{ fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase" }}>
                Support
            </p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 36, letterSpacing: "-.03em", color: "#111", marginBottom: 36 }}>
                Tickets<span style={{ color: "#d04f2a" }}>.</span>
            </h2>

            <TicketFilter filters={filters} onChange={handleFilterChange} onReset={handleFilterReset} />

            <div className="card p-4">
                <DataTable id="ticketTable" className="table" style={{ fontSize: 14 }} data={tickets} options={options} columns={columns}>
                    <thead>
                        <tr>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>Title</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Priority</th>
                            <th style={thStyle}>SLA</th>
                            <th style={thStyle}>Created by</th>
                            <th style={thStyle}>Created at</th>
                            <th style={thStyle}>Assigned to</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody className="align-middle"></tbody>
                </DataTable>
            </div>
        </div>
    );
}
