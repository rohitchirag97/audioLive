const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config(); // Load .env file
const checkAuth = require('../utils/check-auth');

const User = require('../models/User');
const Device = require('../models/Device');
const UserBan = require('../models/UserBan');
const DeviceBan = require('../models/DeviceBan');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLFloat,
    GraphQLSchema,
    GraphQLList,
} = require('graphql');

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        username: user.username,
        uid: user.uid,
    }, process.env.JWT_SECRET, {
        expiresIn: '1000d'
    });
}

const generateUID = async () => {
    const userLength = await User.find().countDocuments();
    return userLength + 6300600;
}

//Device Tyepe
const DeviceType = new GraphQLObjectType({
    name: 'Device',
    fields: () => ({
        id: { type: GraphQLString },
        phoneModel: { type: GraphQLString },
        phoneBrand: { type: GraphQLString },
        phoneOs: { type: GraphQLString },
        phoneOsVersion: { type: GraphQLString },
        phoneScreenSize: { type: GraphQLString },
        macAddress: { type: GraphQLString },
    })
});

//User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        mobile: { type: GraphQLString },
        profilePic: { type: GraphQLString },
        frameId: { type: GraphQLID },
        rideId: { type: GraphQLID },
        bubbleId: { type: GraphQLID },
        uid: { type: GraphQLString },
        hasSpecialUid: { type: GraphQLBoolean },
        specialUid: { type: GraphQLString },
        isVerified: { type: GraphQLBoolean },
        verifiedType: { type: GraphQLString },
        usersentCharishma: { type: GraphQLInt },
        userReceivedCharishma: { type: GraphQLInt },
        token: { type: GraphQLString },
    })  
});

//Queries
const query = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(_, args) {
                return User.find();
            }
        }
    }
});

//Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDevice: {
            type: DeviceType,
            args: {
                phoneModel: { type: GraphQLString },
                phoneBrand: { type: GraphQLString },
                phoneOs: { type: GraphQLString },
                phoneOsVersion: { type: GraphQLString },
                phoneScreenSize: { type: GraphQLString },
                macAddress: { type: GraphQLString },
            },
            async resolve(_, args) {
                const deviceExist = await Device.findOne({ macAddress: args.macAddress });
                if (!deviceExist) {
                    const device = new Device({
                        phoneModel: args.phoneModel,
                        phoneBrand: args.phoneBrand,
                        phoneOs: args.phoneOs,
                        phoneOsVersion: args.phoneOsVersion,
                        phoneScreenSize: args.phoneScreenSize,
                        macAddress: args.macAddress,
                    });
                    const res = await device.save();
                    return {
                        ...res._doc,
                        id: res._id
                    }
                } 
                return {
                    id: deviceExist._id,
                }
            }
        },
        banDevice: {
            type: DeviceType,
            args: {
                deviceId: { type: GraphQLString },
                banReason: { type: GraphQLString },
                baningDate: { type: GraphQLString },
                deviceBanProofs: { type: new GraphQLList(GraphQLString) },
                banExpiry: { type: GraphQLString },
            },
            async resolve(_, args, context) {
                const device = await Device.findOne({ deviceId: args.deviceId });
                if (!device) {
                    throw new Error('Device not found');
                }
                const user = checkAuth(context);
                const BanningUser = await User.findById(user.id);
                if (!BanningUser.verifiedType === 'Official') {
                    throw new Error('You are not authorized to ban devices');
                }
                const deviceBan = new DeviceBan({
                    deviceId: device._id,
                    baningReson: args.banReason,
                    baningDate: args.baningDate,
                    deviceBanProofs: args.deviceBanProofs,
                    banExpiryDate: args.banExpiry,
                    baningUserId: user.id,
                });
                const res = await deviceBan.save();
                return {
                    ...res._doc,
                    id: res._id
                }
            }
        },
        unbanDevice: {
            type: DeviceType,
            args: {
                deviceId: { type: GraphQLString },
            },
            async resolve(_, args, context) {
                const device = await Device.findOne({ deviceId: args.deviceId });
                if (!device) {
                    throw new Error('Device not found');
                }
                const user = checkAuth(context);
                const UnbanningUser = await User.findById(user.id);
                if (!UnbanningUser.verifiedType === 'Official') {
                    throw new Error('You are not authorized to unban devices');
                }
                const deviceBan = await DeviceBan.findOne({ deviceId: device._id });
                if (!deviceBan) {
                    throw new Error('Device is not banned');
                }
                const res = await DeviceBan.findByIdAndDelete(deviceBan.id);
                return {
                    ...res._doc,
                    id: res._id
                }
            }
        },
        registerUser: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
                email: { type: GraphQLString },
                mobile: { type: GraphQLString },
                profilePic: { type: GraphQLString },
                deviceId: { type: GraphQLString },
            },
            async resolve(_, args) {
                const user = await User.findOne({ email: args.email });
                if (user) {
                    throw new Error('User already exists');
                }
                let newUser = new User({
                    username: args.username,
                    email: args.email,
                    mobile: args.mobile,
                    uid: await generateUID(),
                    profilePic: args.profilePic,
                    deviceList: [{
                        deviceId: args.deviceId,
                    }]
                });
                const res = await newUser.save();
                const token = generateToken(res);
                return {
                    ...res._doc,
                    id: res.id,
                    token
                };
            }
        },
        loginUser: {
            type: UserType,
            args: {
                uid: { type: GraphQLString },
                password: { type: GraphQLString },
                deviceId: { type: GraphQLString }
            },
            async resolve(_, args) {
                const user = await User.findOne({ uid: args.uid });
                const device = await Device.findOne({ deviceId: args.deviceId });
                if (!user) {
                    throw new Error('User not found');
                }
                const isEqual = await bcrypt.compare(args.password, user.password);
                if (!isEqual) {
                    throw new Error('Password incorrect');
                }
                if (!user.deviceList.includes(device._id)) {
                    user.deviceList.push(device._id);
                    await user.save();
                }
                const token = generateToken(user);
                return {
                    ...user._doc,
                    id: user._doc._id,
                    token
                };
            }
        },
        loginWithGoogle: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                name: { type: GraphQLString },
                profilePic: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(_, args) {
                const user = await User.findOne({ email: args.email });
                if (!user) {
                    const newUser = new User({
                        email: args.email,
                        username: args.name,
                        uid: await generateUID(),
                        profilePic: args.profilePic,
                    });
                    const res = newUser.save();
                    const token = generateToken(res);
                    return {
                        ...res._doc,
                        id: res._doc._id,
                        token
                    };
                } else {
                    const token = generateToken(user);
                    return {
                        ...user._doc,
                        id: user._doc._id,
                        token
                    };
                }
            }
        },
        loginWithFacebook: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                name: { type: GraphQLString },
                profilePic: { type: GraphQLString },
            },
            async resolve(_, args) {
                const user = await User.findOne({ email: args.email });
                if (!user) {
                    const newUser = new User({
                        email: args.email,
                        username: args.name,
                        uid: await generateUID(),
                        profilePic: args.profilePic,
                    });
                    const res = newUser.save();
                    const token = generateToken(res);
                    return {
                        ...res._doc,
                        id: res._doc._id,
                        token
                    };
                } else {
                    const token = generateToken(user);
                    return {
                        ...user._doc,
                        id: user._doc._id,
                        token
                    };
                }
            }
        },
        loginWithMobile: {
            type: UserType,
            args: {
                mobile: { type: GraphQLString }
            },
            async resolve(_, args) {
                const user = await User.findOne({ mobile: args.mobile });
                if (!user) {
                    const newUser = new User({
                        mobile: args.mobile,
                        uid: await generateUID(),
                    });
                    const res = newUser.save();
                    const token = generateToken(res);
                    return {
                        ...res._doc,
                        id: res._doc._id,
                        token
                    };
                } else {
                    const token = generateToken(user);
                    return {
                        ...user._doc,
                        id: user._doc._id,
                        token
                    };
                }
            }
        },
        banUser: {
            type: UserType,
            args: {
                userId: { type: GraphQLString },
                banReason: { type: GraphQLString },
                baningDate: { type: GraphQLString },
                userBanProofs: { type: new GraphQLList(GraphQLString) },
                banExpiry: { type: GraphQLString },
            },
            async resolve(_, args, context) {
                const user = await User.findById(args.userId);
                if (!user) {
                    throw new Error('User not found');
                }
                const banningUser = await User.findById(context.user.id);
                if (!banningUser.verifiedType === 'Official') {
                    throw new Error('You are not authorized to ban users');
                }
                const userBan = new UserBan({
                    userId: user._id,
                    baningReson: args.banReason,
                    baningDate: args.baningDate,
                    userBanProofs: args.userBanProofs,
                    banExpiryDate: args.banExpiry,
                    baningUserId: banningUser.id,
                }); 
                const res = await userBan.save();
                return {
                    ...res._doc,
                    id: res._id
                }
            }
        },
        unbanUser: {
            type: UserType,
            args: {
                userId: { type: GraphQLString },
            },
            async resolve(_, args, context) {
                const user = await User.findById(args.userId);
                if (!user) {
                    throw new Error('User not found');
                }
                const banningUser = await User.findById(context.user.id);
                if (!banningUser.verifiedType === 'Official') {
                    throw new Error('You are not authorized to unban users');
                }
                const res = await UserBan.findOneAndDelete({ userId: args.userId });
                return {
                    ...res._doc,
                    id: res._id
                }
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query,
    mutation
});


