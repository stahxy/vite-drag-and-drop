// Function to generate unique IDs
const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Function to generate random timestamps
const generateTimestamp = () => {
    const now = Date.now();
    const randomOffset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
    return ((now - randomOffset) / 1000).toFixed(6);
};

// Fictional data for names and surnames
const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Ashley', 'James', 'Amanda', 'Christopher', 'Jennifer', 'Daniel', 'Lisa', 'Matthew', 'Michelle', 'Anthony', 'Kimberly', 'Mark', 'Donna', 'Donald', 'Carol', 'Steven', 'Sandra', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle', 'Kenneth', 'Laura', 'Kevin', 'Sarah', 'Brian', 'Kimberly', 'George', 'Deborah', 'Timothy', 'Dorothy'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'];
const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Mesa', 'Kansas City', 'Atlanta', 'Omaha', 'Raleigh'];
const preferences = ['Salesperson', 'Administrative', 'Cook', 'Waiter/Waitress', 'Delivery', 'Kitchen Assistant', 'Supervisor', 'Customer Service', 'Cashier', 'Stock Clerk', 'Lawyer', 'Litigation Lawyer', 'Labor Lawyer', 'Intellectual Property Lawyer', 'Assistant', 'Sushi Chef', 'Other'];

// Function to generate a random application
const generateRandomApplication = (status = "no_status") => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Generate random preferences (0-4 preferences)
    const numPreferences = Math.floor(Math.random() * 5);
    const prefs = numPreferences > 0 ? 
        Array.from({ length: numPreferences }, () => 
            preferences[Math.floor(Math.random() * preferences.length)]
        ) : null;
    
    // Generate random birth date (between 18 and 65 years old)
    const age = Math.floor(Math.random() * 47) + 18;
    const birthYear = new Date().getFullYear() - age;
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    
    // Generate random coordinates for United States
    const lat = (Math.random() * 25) + 25; // Between 25 and 50 (US latitude range)
    const lng = (Math.random() * 60) - 125; // Between -125 and -65 (US longitude range)
    
    return {
        application_id: generateId(),
        created_on: generateTimestamp(),
        worker_id: generateId(),
        status: status,
        card: {
            name: firstName,
            last_name: lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@${['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'][Math.floor(Math.random() * 4)]}`,
            phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            birth_date: `${day}/${month}/${birthYear}`,
            worker_sublocality: location,
            worker_lat: lat.toFixed(7),
            worker_long: Math.random() > 0.1 ? lng.toFixed(7) : null, // 90% has longitude
            account_status: "complete"
        }
    };
};

// Function to generate application data by status
const generateApplicationsData = (status, page = 1, pageSize = 20) => {
    // Generate a high number of applications to simulate real data with pagination
    const statusCounts = {
        "applicant": 100,
        "selected": 80,
        "admin_selected": 60,
        "interview": 90,
        "trial": 50,
        "hired": 70,
        "dismiss": 120,
        "admin_dismiss": 40,
        "no_status": 150,
        "test3_status": 30,
        "slow_down": 25
    };
    
    const totalItems = statusCounts[status] || 100;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const itemsForPage = Math.max(0, endIndex - startIndex);
    
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
        },
        body: {
            items: Array.from({ length: itemsForPage }, () => generateRandomApplication(status)),
            pagination: {
                page: page,
                page_size: pageSize,
                total_items: totalItems,
                has_more: endIndex < totalItems,
                last_evaluated_key: endIndex < totalItems ? 
                    `eyJzdGF0dXMiOiB7IlMiOiAi${status}"}, "application_id": {"S": "mock-key-${page}"}` : 
                    null
            }
        }
    };
};

export const getApplications = async (params = {}) => {
    const {
        job_id,
        application_status = "no_status",
        page = 1,
        page_size = 20,
        last_evaluated_key = null
    } = params;
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = generateApplicationsData(application_status, page, page_size);
            resolve(data);
        }, Math.random() * 1000 + 500); // Simulate variable latency between 500ms and 1500ms
    });
};