export default async function apiCall(req: any, res: any) {
    console.log("request received:", req)
    res.status(200).json("Hello World")
}