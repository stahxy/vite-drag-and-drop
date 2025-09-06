import { useState , useEffect} from "react";
import { getWorkflow } from "../api/workflow";

export const useApplicationWorkflow = (jobId) => {
    console.log('jobid in useApplicationWorkflow', jobId);
    const [ loading, setLoading ] = useState(false);
    const [ workflow, setWorkflow ] = useState(null);

    const fetchJobWorkflows = async (jobId) => {
        console.log('jobid in fetchJobWorkflows', jobId);
        console.log('fetchJobWorkflows', jobId);
        if (!jobId) return;
        
        try {
            setLoading(true);
            const jobWorkflowResponse = await getWorkflow();
            console.log('jobWorkflowResponse', jobWorkflowResponse);
            if (jobWorkflowResponse && jobWorkflowResponse.body) {
                const jobWorkflow = jobWorkflowResponse.body;
                setWorkflow(jobWorkflow);
            } else {
                setWorkflow(null);
            }
        } catch (error) {
            console.log('error fetchJobWorkflows', error);
            setWorkflow(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (jobId) {
            fetchJobWorkflows(jobId);
        }
    }, [jobId]);


    return {
        workflow,
        loading
    };
}