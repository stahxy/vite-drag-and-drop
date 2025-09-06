import React, { useState, useEffect } from "react";
// import { useParams } from "react-router";
import { notification } from "antd";
// import { useSelector } from "react-redux";
import { Board as BoardComponent } from "../../components/board/Board";
import { getJobData } from "../../api/jobData";

const cleanJobData = (data) => {
    if (!data) return null;
    console.log('data in cleanJobData', data);
    return {
        job_id: data.job_id,
        job_company_name: data.job_company_name,
        job_branch_id: data.job_branch_id,
        job_name: data.job_name,
        job_status: data.job_status,
        job_branch_name: data.job_branch_name,
    };
};

const Board = () => {
    // const { jobId } = useParams();
    const jobId = "TESTID";
    const [jobData, setJobData] = useState(null);
    const [loadingJob, setLoadingJob] = useState(false);
    const [admin, setAdmin] = useState(true);

    // const admin = useSelector(state => state.login.admin);
    // const admin = true;
    const changeAdmin = () => {
        setAdmin(prev => !prev);
    };

    const fetchJobData = async (id) => {
        if (!id) {
            return null;
        }
        try {
            setLoadingJob(true);
            const jobsResponse = await getJobData(id);
            console.log('jobsResponse', jobsResponse);
            const cleanedJobData = cleanJobData(jobsResponse);
            setJobData(cleanedJobData);
            return cleanedJobData;
        } catch (error) {
            notification.error({
                message: 'Error getting job data',
                description: error.message
            });
            return null;
        } finally {
            setLoadingJob(false);
        }
    };

    useEffect(() => {
        if (jobId) {
            fetchJobData(jobId);
        }
    }, [jobId]);

    if (loadingJob) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <button onClick={changeAdmin}>Change Admin (for testing purposes only, not a real feature)</button>
            <BoardComponent jobId={jobId} admin={admin} jobData={jobData} />
        </div>
    );
};

export default Board;