import { NextApiRequest, NextApiResponse } from "next";
import { redisClient } from "../../../server/constants";
import { ApiError } from "../../../utils/types/errors";

export default async function errors(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const errors: ApiError[] = JSON.parse(
            (await redisClient.get("errors")) || "[]"
        );
        res.status(200).json(errors);
    } catch (error) {
        res.status(500).json({ error });
    }
}
