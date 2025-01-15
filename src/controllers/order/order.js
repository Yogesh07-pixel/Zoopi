// import  Branch from "../../models/branch.js";
// import { Customer } from "../../models/user.js";



// export const createOrder = async (req,reply) => {
//     try{
//         const { userId } = req.user; 
//         const {items,branch,totalPrice} = req.body;
        
//         const customerData = await Customer.findById(userId);
//         const branchData = await Branch.find(branch);

//         if(!customerData){
//             return reply.status(404).send({
//                 message : "Customer not found !"
//             });
//         }

//     }catch(err){
//         return reply.status(500).send({
//             message : " Failed to create order ", err
//         });
//     }
// };