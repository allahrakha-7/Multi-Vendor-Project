import bcryptjs from "bcryptjs";
import User from "../model/user.model.js";
import errorHandler from "../utils/errorHandler.js";

export const test = (req, res) => {
    res.json({
        message: 'Api route is working!'
    });
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next (errorHandler(401, 'You can only upload your own account!'));

    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                avatar: req.body.avatar,
                phoneNumber: req.body.phoneNumber,
                role: req.body.role,
                addressInfo: req.body.addressInfo,
            }
        }, {new : true})

        const {password, ...rest} = updateUser._doc;
        res.status(200).json(rest);
    } catch(error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if(req.user.id !==  req.params.id) return next (errorHandler(401, 'You can only delete your own account!'));

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
    
        if (!user) return next(errorHandler(404, "User not found!"));
    
        const { password: pass, ...rest } = user._doc;
    
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}