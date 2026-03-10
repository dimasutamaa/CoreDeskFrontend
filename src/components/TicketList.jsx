import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import { useEffect, useState } from 'react';
import "../styles/Datatable.css";
import api from '../api/api';
import Swal from 'sweetalert2';
import TicketFilter from './TicketFilter';

DataTable.use(DT);

const STATUS_STYLES = {
    OPEN:        { label: "Open",        color: "#2d7a4f", bg: "#edf7f1", border: "#b6dfc8" },
    IN_PROGRESS: { label: "In Progress", color: "#7a5c2d", bg: "#fdf6ed", border: "#dfd0b6" },
    RESOLVED:    { label: "Resolved",    color: "#2d4f7a", bg: "#edf2f7", border: "#b6c8df" },
    CLOSED:      { label: "Closed",      color: "#8a8880", bg: "#f8f8f6", border: "#e2e2de" },
};

const PRIORITY_STYLES = {
    LOW:    { label: "Low",    color: "#8a8880", bg: "#f8f8f6", border: "#e2e2de" },
    MEDIUM: { label: "Medium", color: "#7a5c2d", bg: "#fdf6ed", border: "#dfd0b6" },
    HIGH:   { label: "High",   color: "#d04f2a", bg: "#fdf0ed", border: "#f0c4b6" },
};

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
    const [tickets, setTickets] = useState(null);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [loading, setLoading] = useState(false);

    const fetchTickets = async (activeFilters) => {
        setLoading(true);
        try {
            const params = buildParams(activeFilters);
            const response = await api.get("/tickets", { params });
            setTickets(response.data.data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Failed to load tickets. Please try again later.",
                confirmButtonColor: "#111",
                confirmButtonText: "OK",
            });
            console.error("Error fetching ticket data:", error);
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
            width: "18%",
            render: (data) => `<span style="font-weight: 500; color: #111; font-size: 16px;">${data}</span>`,
        },
        {
            data: "status",
            render: (data) => badge(STATUS_STYLES[data] ?? { label: data, color: "#8a8880", bg: "#f8f8f6", border: "#e2e2de" }),
        },
        {
            data: "priority",
            render: (data) => badge(PRIORITY_STYLES[data] ?? { label: data, color: "#8a8880", bg: "#f8f8f6", border: "#e2e2de" }),
        },
        {
            data: "createdBy.displayName",
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
            data: "assignedTo.displayName",
            defaultContent: `<span style="color: #c8c4be; font-size: 16px;">Unassigned</span>`,
            render: (data) => data
                ? `<span style="color: #8a8880; font-size: 16px;">${data}</span>`
                : `<span style="color: #c8c4be; font-size: 16px;">Unassigned</span>`,
        },
        {
            data: "id",
            className: "text-center",
            sortable: false,
            render: (data) => `
                <a href="/dashboard/tickets/${data}" 
                    style="
                        border-radius: 3px; 
                        font-size: 13px; 
                        letter-spacing: .06em; 
                        text-transform: uppercase; 
                        color: #f8f8f6;
                        background: #111; 
                        border: 1px solid #111; 
                        padding: 6px 12px;
                        text-decoration: none;">
                    Process
                </a>
            `
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
