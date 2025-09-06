import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useApplicationWorkflow } from "./useApplicationWorkflow";
import { getApplications } from "../api/applications";
// import { amplifyGet } from "helpers/amplifyGet";
import { notification } from "antd";
// import { amplifyPut } from "helpers/amplifyPut";

export function useBoard({ jobId, admin = false }) {
    console.log('jobid in useBoard', jobId);
    const [boardState, setBoardState] = useState({
        columnsData: {},
        columns: [],
        loadingColumns: false,
        workflowLoaded: false,
        initialized: false
    });

    const stateRef = useRef(boardState);
    stateRef.current = boardState;
    const fetchDataRef = useRef();

    const { workflow, loading: workflowLoading } = useApplicationWorkflow(
        jobId,
    ); 

    const DEFAULT_COLUMNS = useMemo(() => ({
        admin: [
            {
                id: "applicant",
                name: "Applicant",
                order: 0,
                visible: true,
                color: "#d3e5ef",
                font_color: "#183347",
                is_required: true
            },
            {
                id: "selected",
                name: "Selected",
                order: 1,
                visible: true,
                color: "#9bd4d5",
                font_color: "#345b5c",
                is_required: true
            },
            {
                id: "admin_selected",
                name: "Selected Admin",
                order: 1,
                visible: true,
                color: "#9bd4d5",
                font_color: "#345b5c",
                is_required: true
            },
            {
                id: "interview",
                name: "Interview",
                order: 2,
                visible: true,
                color: "#badfd7",
                font_color: "#3c4644",
                is_required: true
            },
            {
                id: "trial",
                name: "Trial",
                order: 3,
                visible: false,
                color: "#f8e4db",
                font_color: "#4d4745",
                is_required: false
            },
            {
                id: "hired",
                name: "Hired",
                order: 4,
                visible: true,
                color: "#fdb7b9",
                font_color: "#4e3b3b",
                is_required: true
            },
            {
                id: "dismiss",
                name: "Rejected",
                order: 5,
                visible: true,
                color: "#e0dbe0",
                font_color: "#1c0d02",
                is_required: true
            },
            {
                id: "admin_dismiss",
                name: "Rejected Admin",
                order: 6,
                visible: true,
                color: "#eb96a2",
                font_color: "#7f1835",
                is_required: true
            },
            {
                id: "sin_estado",
                name: "No Status",
                order: 7,
                visible: true,
                color: "#d3e5ef",
                font_color: "#183347",
                is_required: true
            }
        ],
        user: [
            {
                id: "applicant",
                name: "Applicant",
                order: 0,
                visible: true,
                color: "#d3e5ef",
                font_color: "#183347",
                is_required: true
            },
            {
                id: "selected",
                name: "Selected",
                order: 1,
                visible: true,
                color: "#9bd4d5",
                font_color: "#345b5c",
                is_required: true
            },
            {
                id: "interview",
                name: "Interview",
                order: 2,
                visible: true,
                color: "#badfd7",
                font_color: "#3c4644",
                is_required: true
            },
            {
                id: "hired",
                name: "Hired",
                order: 3,
                visible: true,
                color: "#fdb7b9",
                font_color: "#4e3b3b",
                is_required: true
            },
            {
                id: "dismiss",
                name: "Rejected",
                order: 4,
                visible: true,
                color: "#e0dbe0",
                font_color: "#1c0d02",
                is_required: true
            }
        ]
    }), []);

    const updateBoardState = useCallback((updates) => {
        setBoardState(prev => {
            const newState = { ...prev, ...updates };
            // Only update if something significant actually changed
            const hasChanges = Object.keys(updates).some(key => {
                if (typeof newState[key] === 'object' && newState[key] !== null) {
                    return JSON.stringify(newState[key]) !== JSON.stringify(prev[key]);
                }
                return newState[key] !== prev[key];
            });
            
            return hasChanges ? newState : prev;
        });
    }, []);

    const columnsToUse = useMemo(() => {
        if (!boardState.workflowLoaded) {
            return [];
        }
        
        if (workflow?.columns) {
            const result = admin ? workflow.columns : workflow.columns.filter(col => col.visible !== false);
            return result;
        }
        
        const defaultResult = admin ? DEFAULT_COLUMNS.admin : DEFAULT_COLUMNS.user;
        return defaultResult;
    }, [workflow, admin, boardState.workflowLoaded, DEFAULT_COLUMNS]);

    const fetchApplicationsForColumn = useCallback(async (jobId, applicationStatus, page = 1, pageSize = 20, lastEvaluatedKey = null) => {
        try {
            const params = {
                job_id: jobId,
                application_status: applicationStatus,
                page: page,
                page_size: pageSize
            };

            if (lastEvaluatedKey) {
                params.last_evaluated_key = lastEvaluatedKey;
            }
            console.log('params', params);

            const response = await getApplications(params);
            const body = response.body || response;
            const items = body.items || [];
            const pagination = body.pagination || {};
            
            return {
                applications: items,
                lastEvaluatedKey: pagination.last_evaluated_key || null,
                hasMore: pagination.has_more || false,
                total: pagination.total_items || 0
            };

        } catch (error) {
            notification.error({
                message: `Error getting applications for ${applicationStatus}`,
                description: error.message
            });
            return {
                applications: [],
                lastEvaluatedKey: null,
                hasMore: false,
                total: 0
            };
        }
    }, []);

    const fetchAllColumnsData = useCallback(async (jobId, columnIds, pageSize = 20) => {
        try {
            const fetchPromises = columnIds.map(columnId => 
                fetchApplicationsForColumn(jobId, columnId, 1, pageSize)
            );

            // Execute all requests in parallel
            const results = await Promise.all(fetchPromises);

            // Create object with results organized by column
            const columnsData = {};
            columnIds.forEach((columnId, index) => {
                columnsData[columnId] = {
                    applications: results[index].applications,
                    lastEvaluatedKey: results[index].lastEvaluatedKey,
                    hasMore: results[index].hasMore,
                    total: results[index].total,
                    page: 1,
                    loading: false
                };
            });
            return columnsData;

        } catch (error) {
            console.log('error fetchAllColumnsData', error);
            notification.error({
                message: 'Error loading column data',
                description: 'Could not load applications'
            });
            return {};
        }
    }, [fetchApplicationsForColumn]);

    const fetchData = useCallback(async () => {

        if (!jobId || workflowLoading || !boardState.workflowLoaded || columnsToUse.length === 0) {
            console.log('❌ fetchData not executed - conditions not met');
            return;
        }

        // Cancel previous request if it exists
        if (fetchDataRef.current) {
            fetchDataRef.current.cancel?.();
        }

        const controller = new AbortController();
        fetchDataRef.current = { cancel: () => controller.abort() };

        updateBoardState({ loadingColumns: true });

        try {
            const columnIds = columnsToUse.map(col => col.id);
            const applicationsData = await fetchAllColumnsData(jobId, columnIds, 20);
            
            updateBoardState({
                columnsData: applicationsData,
                columns: columnsToUse,
                loadingColumns: false
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                notification.error({
                    message: 'Error loading data',
                    description: 'Could not load board data'
                });
                updateBoardState({ loadingColumns: false });
            }
        }
    }, [jobId, workflowLoading, boardState.workflowLoaded, columnsToUse, updateBoardState, fetchAllColumnsData]);

    const loadMoreApplications = async (columnId) => {
        if (!jobId || !boardState.columnsData[columnId] || !boardState.columnsData[columnId].hasMore || boardState.columnsData[columnId].loading) return;

        const columnData = boardState.columnsData[columnId];
        const nextPage = columnData.page + 1;

        try {
            // Mark as loading
            updateBoardState({
                columnsData: {
                    ...boardState.columnsData,
                    [columnId]: {
                        ...boardState.columnsData[columnId],
                        loading: true
                    }
                }
            });

            const result = await fetchApplicationsForColumn(
                jobId,
                columnId,
                nextPage,
                20,
                columnData.lastEvaluatedKey
            );

            // Update state with new applications
            const newApplications = [...boardState.columnsData[columnId].applications, ...result.applications];
            
            updateBoardState({
                columnsData: {
                    ...boardState.columnsData,
                    [columnId]: {
                        ...boardState.columnsData[columnId],
                        applications: newApplications,
                        lastEvaluatedKey: result.lastEvaluatedKey,
                        hasMore: result.hasMore,
                        page: nextPage, 
                        loading: false
                    }
                }
            });

        } catch (error) {
            console.log('error loadMoreApplications', error);
            notification.error({
                message: 'Error loading more applications',
                description: 'Could not load more applications for this column'
            });
            updateBoardState({
                columnsData: {
                    ...boardState.columnsData,
                    [columnId]: {
                        ...boardState.columnsData[columnId],
                        loading: false
                    }
                }
            });
        }
    };

    const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
            console.log('updateApplicationStatus', applicationId, newStatus);
            return;
     
        } catch (error) {
            console.log('error updateApplicationStatus', error);
        }
    };

    const updateWorkflowTemplateColumns = async (columns, previousColumns = null) => {
        const updateWorkflowColumnOrder = ({ newOrder }) => {
            if (!workflow || !workflow.columns) {
                return workflow;
            }
            return {
                ...workflow,
                columns: newOrder
            };
        };
        
        const updatedWorkflow = updateWorkflowColumnOrder({
            newOrder: columns
        });

        const updateData = {
            workflow_data: updatedWorkflow
        }
        
        try {
            console.log('updateWorkflowTemplateColumns', updateData);
            notification.success({
                message: 'Column reordered',
                description: 'Column order has been updated successfully',
                duration: 3
            });
            return { success: true };
        } catch (error) {
            // Revert changes if it fails
            if (previousColumns) {
                updateBoardState({ columns: previousColumns });
            }
            notification.error({
                message: 'Error updating template',
                description: 'Could not update template. Changes have been reverted.'
            });
            throw error;
        }
    };

    const columnDragEnd = async (result) => {
        const { destination, source } = result;
        
        if (!destination) return;
        
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // If there's no workflow, allow reordering for testing but show warning
        if (!workflow || !workflow.template_id) {
            notification.info({
                message: 'Reordering columns',
                description: 'Changes will be applied locally (testing mode)',
                duration: 2
            });
        }

        // Save previous state to revert if it fails
        const previousColumns = Array.from(boardState.columns);
        
        // Optimistic update: apply changes immediately in the UI
        const newColumnOrder = Array.from(boardState.columns);
        const [reorderedColumn] = newColumnOrder.splice(source.index, 1);
        newColumnOrder.splice(destination.index, 0, reorderedColumn);
        
        updateBoardState({ columns: newColumnOrder });
        
        try {
            await updateWorkflowTemplateColumns(newColumnOrder, previousColumns);
        } catch (error) {
            console.log('error columnDragEnd', error);
            // Error is already handled in updateWorkflowTemplateColumns with reversion
        }
    };

    const workerDragEnd = async (result) => {
        const { destination, source } = result;
        
        if (!destination) return;
        
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const startColumnData = boardState.columnsData[source.droppableId];
        const finishColumnData = boardState.columnsData[destination.droppableId];

        if (!startColumnData || !finishColumnData) {
            return;
        }

        const startApplications = Array.from(startColumnData.applications);
        const [movedApplication] = startApplications.splice(source.index, 1);

        if (!movedApplication) {
            return;
        }

        const previousColumnsData = { ...boardState.columnsData };
        const previousApplicationStatus = movedApplication.status;

        // Update application status
        movedApplication.status = destination.droppableId;

        if (source.droppableId === destination.droppableId) {
            // Reorder within the same column
            const newApplications = Array.from(startApplications);
            newApplications.splice(destination.index, 0, movedApplication);

            updateBoardState({
                columnsData: {
                    ...boardState.columnsData,
                    [source.droppableId]: {
                        ...boardState.columnsData[source.droppableId],
                        applications: newApplications
                    }
                }
            });
        } else {
            // Move between different columns
            const finishApplications = Array.from(finishColumnData.applications);
            finishApplications.splice(destination.index, 0, movedApplication);

            updateBoardState({
                columnsData: {
                    ...boardState.columnsData,
                    [source.droppableId]: {
                        ...boardState.columnsData[source.droppableId],
                        applications: startApplications
                    },
                    [destination.droppableId]: {
                        ...boardState.columnsData[destination.droppableId],
                        applications: finishApplications
                    }
                }
            });

            try {
                // Try to update status in backend
                await updateApplicationStatus(movedApplication.application_id, destination.droppableId);
            } catch (error) {
                console.log('error updateApplicationStatus', error);
                // Revert changes if it fails
                updateBoardState({ columnsData: previousColumnsData });
                movedApplication.status = previousApplicationStatus;
                
                notification.error({
                    message: 'Error updating application status',
                    description: 'Could not update status. Changes have been reverted.'
                });
            }
        }
    };

    const handleDragEnd = async (result) => {
        const { type } = result;
        
        if (type === 'COLUMN') {
            await columnDragEnd(result);
        } else {
            await workerDragEnd(result);
        }
    };

    useEffect(() => {
        if (jobId && !boardState.initialized) {
            updateBoardState({ workflowLoaded: true, initialized: true });
        }
    }, [jobId, boardState.initialized, updateBoardState]);

    useEffect(() => {

        if (boardState.workflowLoaded && columnsToUse.length > 0 && !workflowLoading) {
            fetchData();
        }
    }, [boardState.workflowLoaded, columnsToUse.length, workflowLoading, fetchData]);


    useEffect(() => {
        return () => {
            fetchDataRef.current?.cancel?.();
        };
    }, []);
    
    return {
        columnsData: boardState.columnsData,
        columns: boardState.columns,
        loadingColumns: boardState.loadingColumns,
        workflowLoaded: boardState.workflowLoaded,
        fetchData,
        handleDragEnd,
        loadMoreApplications,

        setWorkflowLoaded: useCallback((value) => updateBoardState({ workflowLoaded: value }), [updateBoardState]),
        setColumnsData: useCallback((value) => updateBoardState({ columnsData: value }), [updateBoardState]),
        setColumns: useCallback((value) => updateBoardState({ columns: value }), [updateBoardState]),
        setLoadingColumns: useCallback((value) => updateBoardState({ loadingColumns: value }), [updateBoardState])
    };
}