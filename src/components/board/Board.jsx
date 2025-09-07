import React, { useCallback, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import "./Board.css"
import { notification } from "antd";
import { useBoard } from "../../hooks";
import SimpleSpinner from "./SimpleSpinner";
import MemoizedColumn from "./MemoizedColumn";

// Stable functions moved to module level
const filterApplicationsByName = (applications, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
        return applications;
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    return applications.filter(application => {
        const firstName = application.card?.name?.toLowerCase() || '';
        const lastName = application.card?.last_name?.toLowerCase() || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        return fullName.includes(normalizedSearchTerm) || 
               firstName.includes(normalizedSearchTerm) || 
               lastName.includes(normalizedSearchTerm);
    });
};

const searchWorkerByFullname = (fullName, columnId) => {
    const trimmedName = fullName.trim();
    const nameParts = trimmedName.split(/\s+/);
    
    if (nameParts.length < 2) {
        notification.error({
            message: "Search Error",
            description: "You must enter first and last name. Example: John Smith",
            duration: 4
        });
        return;
    }
    
    const firstName = nameParts[0].toLowerCase();
    // Concatenate all words after the first name as last name
    const lastName = nameParts.slice(1).join(' ').toLowerCase();
    
    console.log(`Searching in column ${columnId}:`);
    console.log(`- First Name: ${firstName}`);
    console.log(`- Last Name: ${lastName}`);
};

export function Board({ jobId, admin, jobData }) {
    console.log('jobid in board', jobId);
    const { 
        columnsData,
        columns,
        loadingColumns,
        fetchData,
        handleDragEnd,
        loadMoreApplications
    } = useBoard({ jobId, admin });

    // State to handle searches by column
    const [searchValues, setSearchValues] = useState({});

    // Function to handle input search change
    const handleSearchChange = useCallback((columnId, value) => {
        setSearchValues(prev => ({
            ...prev,
            [columnId]: value
        }));
    }, []);

    // Function to handle search when pressing Enter
    const handleSearchKeyPress = useCallback((e, columnId) => {
        if (e.key === 'Enter') {
            const searchValue = searchValues[columnId] || '';
            searchWorkerByFullname(searchValue, columnId);
        }
    }, [searchValues]);

    // Function to get filtered applications - calculated during render
    const getFilteredApplications = (columnId) => {
        const originalApplications = columnsData[columnId]?.applications || [];
        const searchTerm = searchValues[columnId] || '';
        return filterApplicationsByName(originalApplications, searchTerm);
    };

    // Calculate titles directly in render
    const title = jobData?.job_company_name ? `Applicants for ${jobData.job_company_name}` : "";
    const subtitle = `${jobData?.job_name} - ${jobData?.job_branch_name}`;

    return (
        <div className="board-container">
            <div className="board-header">
                <h1 className="board-title">{title}</h1>
                <p className="board-subtitle">{subtitle}</p>
            </div>
            { 
            loadingColumns ? 
            (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "75vh" }}>
                <SimpleSpinner />
            </div>
            ) 
            : 
            (
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable 
                    droppableId="board" 
                    type="COLUMN" 
                    direction="horizontal"
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="columns-grid"
                            style={{ maxHeight: "75vh" }}
                        >
                            {columns.map((column, index) => (
                                <MemoizedColumn
                                    key={column.id}
                                    column={column}
                                    applications={getFilteredApplications(column.id)}
                                    onLoadMore={loadMoreApplications}
                                    hasMore={columnsData[column.id]?.hasMore}
                                    loading={columnsData[column.id]?.loading}
                                    jobData={jobData}
                                    admin={admin}
                                    fetchData={fetchData}
                                    index={index}
                                    searchValue={searchValues[column.id] || ''}
                                    onSearchChange={handleSearchChange}
                                    onSearchKeyPress={handleSearchKeyPress}
                                    totalApplications={columnsData[column.id]?.applications?.length || 0}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable> 
            </DragDropContext>
            )}
        </div>
    );
}