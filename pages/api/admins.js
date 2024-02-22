import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Admin } from "@/models/Admin";

export default async function handle(req, res) {
  await mongooseConnect();

  await isAdminRequest(req, res);


  switch (req.method) {
      case "POST":
          const { email } = req.body;
          console.log(email)

          const sameEmail = await Admin.findOne({ email: email });
    if (sameEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const adminAdding = await Admin.create({ email: email });

      if (!adminAdding) {
        return res.status(400).json({ message: "Admin not added" });
      }

      res.json({ message: "Admin added" });
      break;
    case "GET":
      const admins = await Admin.find();
      if (!admins) {
        res.status(400).json({ message: "Admins not found" });
      } else {
        res.status(200).json(admins);
      }
      break;
    case "DELETE":
        const {_id} = req.query;
    
        const adminDeleting = await Admin.findByIdAndDelete({ _id: _id });
        
        if (!adminDeleting) {
            return res.status(400).json({ message: "Admin not deleted" });
        }
    
        res.json({ message: "Admin deleted" });
        break;
  }
  return res.status(405).json({ message: "Method not allowed" });
}
