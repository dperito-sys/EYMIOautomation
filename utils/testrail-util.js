import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const api = axios.create({
    baseURL: `${process.env.TESTRAIL_URL}/index.php?/api/v2`,
    auth: {
        username: process.env.TESTRAIL_USERNAME,
        password: process.env.TESTRAIL_APIKEY,
    },
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function addResult(caseId, statusId, comment = '') {
    const runId = process.env.TESTRAIL_RUN_ID;
    if (!runId) throw new Error('TESTRAIL_RUN_ID is missing from .env');

    try {
        await api.post(`/add_result_for_case/${runId}/${caseId}`, {
            status_id: statusId,
            comment,
        });
        console.log(`✅ Reported result for C${caseId} to TestRail`);
    } catch (err) {
        console.error(`❌ Failed to report result for C${caseId}`, err.message);
    }
}