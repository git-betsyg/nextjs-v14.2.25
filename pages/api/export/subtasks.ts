import { isAxiosError } from 'axios';
import { createAxiosByInterceptorsServer } from "@/lib/request";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const request = createAxiosByInterceptorsServer({ req, res });
            const { subTaskIds } = req.body;

            const response = await request.post(
                `/api/export/subtasks`,
                { subTaskIds },
                {
                    responseType: 'arraybuffer',
                }
            );

            // Forward content-type and content-disposition headers
            const contentType = response.headers['content-type'];
            const contentDisposition = response.headers['content-disposition'];

            if (contentType) {
                res.setHeader('Content-Type', contentType);
            }
            if (contentDisposition) {
                res.setHeader('Content-Disposition', contentDisposition);
            }

            res.send(Buffer.from(response.data));
        } catch (error) {
            const statusCode = isAxiosError(error) ? (error.response?.status ?? 500) : 500;

            res.status(statusCode).json({
                success: false,
                errorMessage: error instanceof Error ? error.message : String(error),
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
