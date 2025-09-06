const workflowData = {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true"
    },
    body: {
        workflow_id: "template_1757006601662",
        name: "Admin",
        columns: [
            {
                id: "test3_status",
                name: "test3",
                order: 0,
                visible: true,
                color: "#f3f4f6",
                font_color: "#6b7280",
                is_required: false
            },
            {
                id: "slow_down",
                name: "everlong foo",
                order: 1,
                visible: true,
                color: "#f3f4f6",
                font_color: "#6b7280",
                is_required: false
            },
            {
                id: "admin_dismiss",
                name: "Rejected Admin",
                order: 2,
                visible: false,
                color: "#eb96a2",
                font_color: "#7f1835",
                is_required: false
            },
            {
                id: "dismiss",
                name: "Rejected",
                order: 3,
                visible: true,
                color: "#e0dbe0",
                font_color: "#1c0d02",
                is_required: true
            },
            {
                id: "admin_selected",
                name: "Selected Admin",
                order: 4,
                visible: false,
                color: "#d3e5ef",
                font_color: "#183347",
                is_required: false
            },
            {
                id: "selected",
                name: "Selected",
                order: 5,
                visible: true,
                color: "#9bd4d5",
                font_color: "#345b5c",
                is_required: true
            },
            {
                id: "interview",
                name: "Interview",
                order: 6,
                visible: false,
                color: "#badfd7",
                font_color: "#3c4644",
                is_required: true
            },
            {
                id: "applicant",
                name: "Applicant",
                order: 7,
                visible: false,
                color: "#d3e5ef",
                font_color: "#183347",
                is_required: true
            },
            {
                id: "no_status",
                name: "No Status",
                order: 8,
                visible: false,
                color: "#f3f4f6",
                font_color: "#6b7280",
                is_required: false
            },

        ],
        default_status: "applicant",
        created_by: "system",
        created_at: "1757006601",
        is_active: true,
        template_id: "80ce6448-84c2-4c7c-80b9-8707dd00d0a0"
    }
};

export const getWorkflow = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(workflowData);
        }, 2000);
    });
};