import { NextApiRequest, NextApiResponse } from "next";
import { redisClient } from "../../../server/constants";
import { ApiError } from "../../../utils/types/errors";

export default async function errors(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const rawErrors = (await redisClient.lrange("errors", 0, 10)) || [];
        const errors: ApiError[] = rawErrors.map((rawError) =>
            JSON.parse(rawError)
        );
        res.status(200).json(errors);
    } catch (error) {
        console.log("Error at /api/admin/errors: " + error);
        res.status(500).json({ error });
    }
}
