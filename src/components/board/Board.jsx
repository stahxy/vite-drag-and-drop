import React, { useMemo, useCallback, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import "./Board.css"
import { notification } from "antd";
import { useBoard } from "../../hooks";
import SimpleSpinner from "./SimpleSpinner";
import MemoizedColumn from "./MemoizedColumn";

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

    // Function to filter applications by full name
    const filterApplicationsByName = useCallback((applications, searchTerm) => {
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
    }, []);

    // Function to search worker by full name
    const searchWorkerByFullname = useCallback((fullName, columnId) => {
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
    }, []);

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
    }, [searchValues, searchWorkerByFullname]);

    // Get filtered applications for each column
    const filteredColumnsData = useMemo(() => {
        const filtered = {};
        
        columns.forEach(column => {
            const originalApplications = columnsData[column.id]?.applications || [];
            const searchTerm = searchValues[column.id] || '';
            const filteredApplications = filterApplicationsByName(originalApplications, searchTerm);
            
            filtered[column.id] = {
                ...columnsData[column.id],
                applications: filteredApplications
            };
        });
        
        return filtered;
    }, [columns, columnsData, searchValues, filterApplicationsByName]);

    const title = useMemo(() => 
        jobData?.job_company_name ? `Applicants for ${jobData.job_company_name}` : "", 
        [jobData?.job_company_name]
    );

    const subtitle = useMemo(() => 
        `${jobData?.job_name} - ${jobData?.job_branch_name}`, 
        [jobData?.job_name, jobData?.job_branch_name]
    );

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
                                    applications={filteredColumnsData[column.id]?.applications || []}
                                    onLoadMore={loadMoreApplications}
                                    hasMore={filteredColumnsData[column.id]?.hasMore}
                                    loading={filteredColumnsData[column.id]?.loading}
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
