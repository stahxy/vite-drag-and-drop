import React, { memo } from "react";
import ApplicationCard from "./ApplicationCard";

const ApplicationsList = memo(({ applications, jobData, admin, fetchData }) => {
    return (
        <div className="workers-list">
            {applications.map((application, appIndex) => (
                <ApplicationCard
                    key={application.application_id}
                    application={application}
                    index={appIndex}
                    jobData={jobData}
                    admin={admin}
                    fetchData={fetchData}
                />
            ))}
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.applications.length === nextProps.applications.length &&
        prevProps.applications.every((app, idx) => 
            app.application_id === nextProps.applications[idx]?.application_id
        ) &&
        prevProps.admin === nextProps.admin &&
        prevProps.jobData === nextProps.jobData &&
        prevProps.fetchData === nextProps.fetchData
    );
});

export default ApplicationsList;
