import initMiddleware from "@/middlewares/init-middleware";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";

const upload = multer({ storage: multer.memoryStorage() });
const multerMiddleware = initMiddleware(upload.single("customKeyUsedInAPI")); // this is the same key used in the form on the client

// Doc on custom API configuration:
// https://nextjs.org/docs/api-routes/api-middlewares#custom-config
export const config = {
  api: {
    bodyParser: false,
  },
};

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      await multerMiddleware(req, res);
      return await postAction(req, res);
    default:
      break;
  }
};

const postAction = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // file is available in req.file with the help of multerMiddleware
    // @ts-ignore
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Missing file" });
    }

    // use file here
    console.log(file);

    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("[error: /api/upload]", error);
    return res.status(400).json({ error: "Something went wrong" });
  }
};

export default apiHandler;
