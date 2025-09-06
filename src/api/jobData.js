const jobData = {
    job_company_name: "Global Innovations Inc",
    job_company_id: "9c23f456-d789-4a12-b567-8e9012d34f56",
    company_description: "Leading technology company specializing in AI and cloud solutions",
    job_branch_id: "3ef78901-c234-5d67-a890-12b345c67d89",
    job_branch_name: "Main Branch",
    user_email: "hr@globalinnovations.com",
    user_id: "1234abcd-5678-9ef0-ghij-klmnop123456",
    job_frequency: "permanent",
    job_permanent_data: {
        min_wage: 75000,
        max_wage: 120000,
        shift_hours: 8,
        shift_description: "Flexible schedule with remote work options"
    },
    job_recurrent_data: null,
    job_permanent_shift: "morning-afternoon",
    job_payment_methods: [
        "transfer",
        "direct_deposit"
    ],
    job_location_details: {
        lat: "40.712776",
        lng: "-74.005974",
        formatted_address: "100 Tech Plaza, New York, NY 10013",
        sublocality: "Manhattan",
        locality: "New York",
        place_id: "ChIJK7RN6x1awokRCR1_w8w9v4c",
        description: "Modern office space in downtown Manhattan"
    },
    job_locality: "New York",
    job_sublocality: "Manhattan",
    job_location_type: "office",
    job_details: {
        job_requirements: [
            "Python",
            "AWS",
            "Machine Learning",
            "Master's Degree"
        ],
        job_codedress: [
            "Smart Casual"
        ],
        job_description: "Looking for experienced AI Engineers to join our growing team. Work on cutting-edge projects using the latest technologies.",
        job_additional_info: "Benefits include health insurance, 401k matching, and annual performance bonus"
    },
    job_name: "Senior AI Engineer",
    job_kind: "Technology",
    quantity_workers: 3,
    job_contacts: [
        {
            name: "John Smith",
            position: "Technical Director",
            phone: "+1-212-555-0123",
            email: "j.smith@globalinnovations.com"
        }
    ],
    job_status: "PUBLISHED",
    job_candidates: 0,
    logo_data: {
        width: 400,
        height: 300,
        type: "png"
    },
    job_slug: "senior-ai-engineer-new-york",
    show_wage: true,
    workflow_template_id: "ai-recruitment-v1",
    job_id: "GI456ABC",
    createdOn: "1698765432.123456"
};

export const getJobData = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(jobData);
        }, 2000);
    });
};