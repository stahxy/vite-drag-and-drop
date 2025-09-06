import React, { memo, useMemo, useCallback } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Mail, MapPin, Calendar, User, Copy } from "lucide-react";
import { calculatedAge } from "../../utils/calculatedAge";
import { formatLocation, copyToClipboard } from "./utils";

const ApplicationCard = memo(({ application, index, jobData }) => {

    const handleCopyId = useCallback((e) => {
        e.stopPropagation();
        copyToClipboard(application.application_id);
    }, [application.application_id]);

    const cardData = useMemo(() => {
        const millisecondTimestamp = application.created_on * 1000;

    // Create a Date object
        const dateObject = new Date(millisecondTimestamp);
        const dateApplied = dateObject;
        const age = calculatedAge(application.card?.birth_date);
        const location = formatLocation(application.card?.worker_sublocality);
        const job_coordinates = jobData?.job_location_details?.lat && jobData?.job_location_details?.lng 
            ? {lat: jobData.job_location_details.lat, long: jobData.job_location_details.lng}
            : null;
        
        return { age, location, job_coordinates, dateApplied };
    }, [application.card?.birth_date, application.card?.worker_sublocality, jobData?.job_location_details, application.created_on]);

    return (
        <Draggable
            key={application.application_id}
            draggableId={application.application_id}
            index={index}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`worker-card ${snapshot.isDragging ? "dragging" : ""}`}
                >
                    <div className="worker-header">
                        <div className="worker-name-section">
                            <div className="worker-name-row">
                                <User className="info-icon" />
                                <h3 className="worker-name">
                                    {application.card?.name} {application.card?.last_name}
                                </h3>
                            </div>
                        </div>
                    </div>
                    
                    <div className="worker-info">
                        {cardData.age && (
                            <div className="worker-age-section">
                                <Calendar className="info-icon" />
                                <span className="worker-age">
                                    {cardData.age} years old
                                </span>
                            </div>
                        )}
                        
                        <div className="worker-email-section">
                            <Mail className="info-icon" />
                            <span className="worker-email">
                                {application.card?.email}
                            </span>
                        </div>
                        
                        <div className="worker-location-section">
                            <MapPin className="info-icon" />
                            <span className="worker-location">
                                {cardData.location}
                            </span>
                        </div>
                    </div>
                    
                    <div className="worker-footer">
                        <div className="worker-date-applied-section">
                        <span className="worker-date-applied"> Application Date:</span>
                            <span className="worker-date-applied">
                                {cardData.dateApplied?.toLocaleDateString()}
                            </span>
                        </div>  
                        <div 
                            className="worker-id-copy"
                            onClick={handleCopyId}
                            title="Copy full ID"
                        >
                            <Copy className="copy-icon" />
                            <span className="worker-id">
                                ID: {application.application_id.slice(0, 8)}...
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.application.application_id === nextProps.application.application_id &&
        prevProps.index === nextProps.index &&
        prevProps.admin === nextProps.admin &&
        prevProps.jobData === nextProps.jobData &&
        prevProps.fetchData === nextProps.fetchData
    );
});

export default ApplicationCard;
