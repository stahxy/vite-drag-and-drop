import React, { memo } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Input } from "antd";
import { Search } from "lucide-react";
import ApplicationsList from "./ApplicationsList";
import LoadMoreButton from "./LoadMoreButton";

const MemoizedColumn = memo(({ 
    column, 
    applications, 
    onLoadMore, 
    hasMore, 
    loading, 
    jobData, 
    admin, 
    fetchData,
    index,
    searchValue,
    onSearchChange,
    onSearchKeyPress,
    totalApplications = 0
}) => {
    const isEmpty = applications.length === 0;
    const isFiltered = searchValue && searchValue.trim() !== '';
    const showCount = isFiltered && totalApplications > 0;

    return (
        <Draggable
            key={column.id}
            draggableId={column.id}
            index={index}
            isDragDisabled={false}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`column ${snapshot.isDragging ? "dragging" : ""}`}
                >
                    <div
                        {...provided.dragHandleProps}
                        className="column-header-dynamic"
                        style={{
                            backgroundColor: column.color,
                            color: column.font_color
                        }}
                    >
                        <div className="column-header-content">
                            <div className="drag-handle">⋮⋮</div>
                            <h2 
                                className="column-title"
                                style={{ color: column.font_color }}
                            >
                                {column.name}
                            </h2>
                        </div>
                        <div className="column-search-container">
                            <Input
                                placeholder="Search by first and last name..."
                                value={searchValue}
                                onChange={(e) => onSearchChange(column.id, e.target.value)}
                                onKeyPress={(e) => onSearchKeyPress(e, column.id)}
                                prefix={<Search />}
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    borderRadius: '6px'
                                }}
                            />
                            {showCount && (
                                <div className="search-results-count">
                                    Showing {applications.length} of {totalApplications} candidates
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div 
                        className={`column-content column-${column.id}`}
                        style={{
                            backgroundColor: column.color ? `${column.color}20` : undefined,
                            borderColor: column.color
                        }}
                    >
                        <Droppable droppableId={column.id} type="WORKER">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`column-inner ${snapshot.isDraggingOver ? "drag-over" : ""}`}
                                    style={{
                                        backgroundColor: "transparent"
                                    }}
                                >
                                    {isEmpty ? (
                                        <div className="column-empty">
                                            <div className="column-empty-icon">📋</div>
                                            <p className="column-empty-text">No candidates</p>
                                        </div>
                                    ) : (
                                        <ApplicationsList 
                                            applications={applications}
                                            jobData={jobData}
                                            admin={admin}
                                            fetchData={fetchData}
                                        />
                                    )}
                                    
                                    {hasMore && (
                                        <LoadMoreButton
                                            onLoadMore={onLoadMore}
                                            loading={loading}
                                            columnId={column.id}
                                        />
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            )}
        </Draggable>
    );
});

export default MemoizedColumn;
