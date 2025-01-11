import { Customer , DeliveryPartner } from "../../models/user.js";
import jwt from 'jsonwebtoken';

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {userId:user._id , role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "1d"}
    );

    const refreshToken = jwt.sign(
        {userId:user._id , role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "1d"}
    );
    return { accessToken , refreshToken}
};

// Login Customer
export const loginCustomer = async(req,reply)=> {
    try {
        
        const {phone} = req.body;

        let customer = await Customer.findOne({phone});

        // If no Customer found with this Phone number then
        if(!customer) {
            customer = new Customer({
                phone,
                role : "Customer",
                isActivated : true,
            });

            await customer.save();
        }

        const {accessToken, refreshToken} = generateTokens(customer);

        return reply.send({
            message: customer ? "Login Successful":"Customer created and logged In.",
            accessToken,
            refreshToken,
            customer
        });
    }
    catch(error){
            return reply.status(500).send({ message : "An error occurred", error});
    }
};

// Delivery Partner
export const loginDeliveryPartner = async(req,reply)=> {
    try {
        const {email,password} = req.body;
        let deliveryPartner = await DeliveryPartner.findOne({email});

        // If no Customer found with this Phone number then
        if(!deliveryPartner) {
            return reply
            .status(404)
            .send({ message: "Delivery Partner Not Found."});
        }

        const isMatch = password === deliveryPartner.password

        if(!isMatch){
            return reply
            .status(400)
            .send({ message: "Invalid credentials."});
        }

        const {accessToken, refreshToken} = generateTokens(deliveryPartner);

        return reply.send({
            message: "Login Successful",
            accessToken,
            refreshToken,
            deliveryPartner
        });
    }
    catch(error){
            return reply.status(500).send({ message : "An error occurred", error});
    }
};

// Refresh Token 
export const refreshToken = async(req,reply) => {

    const {refreshToken} = req.body;

    if(!refreshToken){
        return reply.status(401).send({
            message : "Refresh Token Required."
        })
    }

    try {
      
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        let user;

        if(decoded.role === "Customer"){
            user = await Customer.findById(decoded.userId);
        }
        else if(decoded.role === "DeliveryPartner"){
            user = await DeliveryPartner.findById(decoded.userId);
        }
        else {
            return reply.status(403).send({
                message : "Invalid Role"
            })
        }

        if(!user){
            return reply.status(403).send({
                message : "Invalid refresh token"
            })
        }

        const {accessToken, refreshToken: newRefreshToken } = generateTokens(user);
        return reply.send({
            message : "Token Refreshed",
            accessToken,
            refreshToken: newRefreshToken
        })

    } catch (error) {
        return reply.status(403).send({
            message : "Invalid Refresh Token"
        })
        
    }
};

export const fetchUser = async(req,reply) => {
    try{

        const {userId, role} = req.user;
        let user;

        if(role === "Customer"){
            user = await Customer.findById(userId);
        }
        else if(role === "DeliveryPartner"){
            user = await DeliveryPartner.findById(userId);
        }
        else {
            return reply.status(403).send({
                message : "Invalid Role"
            })
        }

        if(!user){
            return reply.status(404).send({
                message : "User not found"
            })
        }

        return reply.send({
            message : "User fetched successfully",
            user,
        });

    }
    catch(error){
        return reply.status(500).send({
            message: "An error Occurred" , error
        })
    }
}