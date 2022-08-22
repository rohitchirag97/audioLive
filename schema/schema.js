const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config(); // Load .env file
const checkAuth = require('../utils/check-auth');

const User = require('../models/User');
const Device = require('../models/Device');
const Gift = require('../models/Gift');
const Agency = require('../models/Agency');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLFloat,
    GraphQLSchema,
    GraphQLList,
    isTypeSystemDefinitionNode,
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

const generateAgencyUID = async () => {
    const AgencyLength = await Agency.find().countDocuments();
    return AgencyLength + 3000;
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
        isBanned: { type: GraphQLBoolean },
        banReason: { type: GraphQLString },
        banDate: { type: GraphQLString },
        banExpiryDate: { type: GraphQLString },
        deviceUsers: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({
                    'deviceList.deviceId': parent.id
                });
            }
        },
        banningUnbanAdmin: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.banningUnbanAdmin);
            }
        }
    })
});

//transaction Type
const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    fields: () => ({
        id: { type: GraphQLString },
        coinsAmount: { type: GraphQLInt },
        sellerId: { type: GraphQLString },
    })
});


//User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        uid: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        mobile: { type: GraphQLString },
        profilePic: { type: GraphQLString },
        frameId: { type: GraphQLID },
        rideId: { type: GraphQLID },
        bubbleId: { type: GraphQLID },
        hasSpecialUid: { type: GraphQLBoolean },
        specialUid: { type: GraphQLString },
        isVerified: { type: GraphQLBoolean },
        hasOfficialAccess: { type: GraphQLBoolean },
        usersentCharishma: { type: GraphQLInt },
        userReceivedCharishma: { type: GraphQLInt },
        walletCoins: { type: GraphQLInt },
        isCoinSeller: { type: GraphQLBoolean },
        SellerCoins: { type: GraphQLInt },
        isRecruiter: { type: GraphQLBoolean },
        nobleId: { type: GraphQLID },
        agencyId: { type: GraphQLID },
        FamilyId: { type: GraphQLID },
        createdAt: { type: GraphQLString },
        token: { type: GraphQLString },
        isbanned: { type: GraphQLBoolean },
        banReason: { type: GraphQLString },
        banDate: { type: GraphQLString },
        banExpiryDate: { type: GraphQLString },
        userWhoBanned: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.banningUnbanAdmin);
            }
        },
        transactions:{
            type: new GraphQLList(TransactionType),
            resolve(parent, args) {
                return Transaction.find({ userId: parent.id });
            }
        },
        devices:{
            type: new GraphQLList(DeviceType),
            async resolve(parent, args) {
                return await Device.find({ 'userList.userId': parent.id });
            }
        }
    })  
});

//Agency Type
const AgencyType = new GraphQLObjectType({
    name: 'Agency',
    fields: () => ({
        id: { type: GraphQLID },
        agencyuid: { type: GraphQLString },
        agencyName: { type: GraphQLString },
        agencyAdmins: { type: new GraphQLList(GraphQLString) },
        agencyMembers: { type: new GraphQLList(GraphQLString) },
        agencyowner: { type: GraphQLString },
    })
});


//GIFT Type
const GiftType = new GraphQLObjectType({
    name: 'Gift',
    fields: () => ({
        id: { type: GraphQLID },
        giftName: { type: GraphQLString },
        giftPrice: { type: GraphQLInt },
        giftDescription: { type: GraphQLString },
        giftImage: { type: GraphQLString },
        giftType: { type: GraphQLString },
        giftAnimation: { type: GraphQLString }
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
        },
        user: {
            type: UserType,
            args: { uid: { type: GraphQLID } },
            resolve(_, args) {
                const user = User.findOne({ uid: args.uid });
                if (!user) {
                    console.log('User not found');
                    throw new Error('User not found');
                }
                console.log('User found');
                console.log(user);
                return user;
            }
        },
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
                    console.log(res);
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
                banExpiry: { type: GraphQLString },
                adminId: { type: GraphQLString },
            },
            async resolve(_, args, context) {
                const device = await Device.findOne({ deviceId: args.deviceId });
                if (!device) {
                    throw new Error('Device not found');
                }
                const BanningUser = await User.findById(args.adminId);
                if (!BanningUser.hasOfficialAccess) {
                    throw new Error('You are not authorized to ban devices');
                }
                const res = await Device.findOneAndUpdate({ deviceId: args.deviceId }, { $set: { isBanned: true, banReason: args.banReason, banDate: args.baningDate, banExpiryDate: args.banExpiry } });        
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
                adminId: { type: GraphQLString },
            },
            async resolve(_, args, context) {
                const device = await Device.findOne({ deviceId: args.deviceId });
                if (!device) {
                    throw new Error('Device not found');
                }
                const UnbanningUser = await User.findById(args.adminId);
                if (!UnbanningUser.hasOfficialAccess) {
                    throw new Error('You are not authorized to unban devices');
                }
                const res = await Device.findOneAndUpdate({ deviceId: args.deviceId }, { 
                    $set: { 
                        isBanned: false, 
                        banReason:"", 
                        banDate:"", 
                        banExpiryDate:"", 
                        banningUnbanAdmin:args.adminId 
                    } 
                });
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
                const device = await Device.findById(args.deviceId);
                if (!device) {
                    throw new Error('Device not found');
                }
                if(device.userList.length >= 2) {
                    throw new Error('You Can Create Only 2 Users per Device');
                }
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
                        deviceId: device._id,
                    }]
                });
                const res = await newUser.save();
                const updatedDevice = await Device.findByIdAndUpdate(device._id, { $push: { userList: {userId: newUser._id} } });
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
                if(!user.isbanned) {
                    throw new Error('User is banned');
                } 
                const isEqual = await bcrypt.compare(args.password, user.password);
                if (!isEqual) {
                    throw new Error('Password incorrect');
                }
                device.userList.push({
                    userId: user._id
                });
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
                password: { type: GraphQLString },
                deveiceId: { type: GraphQLString }
            },
            async resolve(_, args) {
                const user = await User.findOne({ email: args.email });
                const device = await Device.findById(args.deviceId);
                if (!user) {
                    const newUser = new User({
                        email: args.email,
                        username: args.name,
                        uid: await generateUID(),
                        profilePic: args.profilePic,
                    });
                    const res = await newUser.save();
                    const token = generateToken(res);
                    return {
                        ...res._doc,
                        id: res._doc._id,
                        token
                    };
                } else {
                    if(user.isbanned) {
                        throw new Error('User is banned');
                    } 
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
                    if(user.isbanned) {
                        throw new Error('User is banned');
                    }
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
                    if(user.isbanned) {
                        throw new Error('User is banned');
                    }
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
                banDate: { type: GraphQLString },
                banExpiryDate: { type: GraphQLString },
                banningunbanAdmin: { type: GraphQLString },
            },
            async resolve(_, args, context) {
                const user = await User.findById(args.userId);
                if (!user) {
                    throw new Error('User not found');
                }
                const banningUser = await User.findById(args.banningunbanAdmin);
                if (!banningUser.hasOfficialAccess) {
                    throw new Error('You are not authorized to ban users');
                }
                const updatedUser = await User.findByIdAndUpdate(args.userId, {
                    $set: {
                        isbanned: true,
                        banReason: args.banReason,
                        banDate: new Date().toISOString(),
                        banExpiryDate: new Date(args.banExpiryDate).toISOString(),
                        banningUnbanAdmin: args.banningunbanAdmin,
                    }
                });
                return {
                    ...updatedUser._doc,
                    id: updatedUser._id,
                }
            }
        },
        unbanUser: {
            type: UserType,
            args: {
                userId: { type: GraphQLString },
                adminId: { type: GraphQLString },
            },
            async resolve(_, args) {
                const user = await User.findById(args.userId);
                if (!user) {
                    throw new Error('User not found');
                }
                const banningUser = await User.findById(args.adminId);
                if (!banningUser.hasOfficialAccess) {
                    throw new Error('You are not authorized to unban users');
                }
                const res = await User.findByIdAndUpdate(args.userId, {
                    $set: {
                        isbanned: false,
                        banReason: '',
                        banDate: '',
                        banExpiryDate: '',
                        banningUnbanAdmin: args.adminId,
                    }
                });
                return {
                    ...res._doc,
                    id: res._id
                }
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLString },
                uid: { type: GraphQLString },
                username: { type: GraphQLString },
                email: { type: GraphQLString },
                mobile: { type: GraphQLString },
                password: { type: GraphQLString },
                profilePic: { type: GraphQLString },
                frameId: { type: GraphQLID },
                rideId: { type: GraphQLID },
                bubbleId: { type: GraphQLID },
                hasSpecialUid: { type: GraphQLBoolean },
                specialUid: { type: GraphQLString },
                isVerified: { type: GraphQLBoolean },
                verifiedType: { type: GraphQLString },
                hasOfficialAccess: { type: GraphQLBoolean },
                usersentCharishma: { type: GraphQLInt },
                userReceivedCharishma: { type: GraphQLInt },
                walletCoins: { type: GraphQLInt },
                isCoinSeller: { type: GraphQLBoolean },
                SellerCoins: { type: GraphQLInt },
                isRecruiter: { type: GraphQLBoolean },
                nobleId: { type: GraphQLID },
                agencyId: { type: GraphQLID },
                FamilyId: { type: GraphQLID },
            },
            async resolve(_, args, context) {
                const user = await User.findById(args.id);
                if (!user) {
                    throw new Error('User not found');
                }
                console.log(user);
                const res = await User.findByIdAndUpdate(args.id, args);
                return {
                    ...res._doc,
                    id: res._id
                }
            }
        },
        salecoins: {
            type: UserType,
            args: {
                Sellerid: { type: GraphQLString },
                coinsToSell: { type: GraphQLInt },
                buyerId: { type: GraphQLString },
            },
            async resolve(_, args, context) {
                const seller = await User.findById(args.Sellerid);
                if (!seller.isCoinSeller) {
                    throw new Error('You are not a seller');
                }
                const buyer = await User.findById(args.buyerId);
                if (!buyer) {
                    throw new Error('Buyer not found');
                }
                if(seller.SellerCoins < args.coinsToSell) {
                    throw new Error('You do not have enough coins to sell');
                }
                const sellerRes = await User.findByIdAndUpdate(args.Sellerid, {  SellerCoins: seller.SellerCoins - args.coinsToSell, $push: {
                    coinsellerTransactions:{
                        soldto: args.buyerId,
                        soldtouid: buyer.uid,
                        quantity: args.coinsToSell,
                        soldDateTime: new Date().toISOString()
                    }
                } });
                const buyerRes = await User.findByIdAndUpdate(args.buyerId, { walletCoins: buyer.walletCoins + args.coinsToSell, $push: {
                    userNotifications:{
                        notificationType: 'coins',
                        coinSellerId: args.Sellerid,
                        coinSellerUid: seller.uid,
                        message: `You have Purchased ${args.coinsToSell} coins From Official Coin Seller ${seller.uid}`,
                        CoinsPurchased: args.coinsToSell,
                        notificationDateTime: new Date().toISOString()
                    }
                }
});
                return {
                    ...sellerRes._doc,
                    id: sellerRes._id
                }
            }
        },
        createGifts: {
            type: GiftType,
            args: {
                id: { type: GraphQLString },
                name: { type: GraphQLString },
                price: { type: GraphQLInt },
                description: { type: GraphQLString },
                image: { type: GraphQLString },
                GiftAnimation: { type: GraphQLString },
            },
            async resolve(_, args, context) {
                const user = await User.findById(args.id);
                if (!user.hasOfficialAccess) {
                    throw new Error('You are not authorized to create gifts');
                }
                const newGift = new Gift({
                    giftName: args.name,
                    giftPrice: args.price,
                    giftDescription: args.description,
                    giftImage: args.image,
                    giftAnimation: args.GiftAnimation,
                });
                const res = await newGift.save();
                return res;
            }
        },
        sendgift: {
            type: UserType,
            args: {
                senderId: { type: GraphQLString },
                receiverId: { type: GraphQLString },
                giftId: { type: GraphQLString },
                giftquantity: { type: GraphQLInt },
            },
            async resolve(_, args, context) {
                const sender = await User.findById(args.senderId);
                if (!sender) {
                    throw new Error('Sender not found');
                }
                const receiver = await User.findById(args.receiverId);
                if (!receiver) {
                    throw new Error('Receiver not found');
                }
                const gift = await Gift.findById(args.giftId);
                if (!gift) {
                    throw new Error('Gift not found');
                }
                const giftRes = await Gift.findById(args.giftId);
                if(sender.walletCoins < giftRes.giftPrice){
                    throw new Error('You dont have enough coins');
                }
                const senderRes = await User.findByIdAndUpdate(args.senderId, { walletCoins: sender.walletCoins - giftRes.giftPrice, usersentCharishma: sender.usersentCharishma + giftRes.giftPrice });
                //check if receiver has this gift in array and update the quantity
                if(receiver.receivedGifts.includes(args.giftId)){
                    const receiverRes = await User.findByIdAndUpdate(args.receiverId, { receivedGifts: receiver.receivedGifts.map(receivedgift => {
                        if(receivedgift.giftId === args.giftId){
                            receivedgift.quantity += args.giftquantity;
                        }
                    }), userReceivedCharishma: receiver.userReceivedCharishma + giftRes.giftPrice });
                    return {
                        ...receiverRes._doc,
                        id: receiverRes._id
                    }
                }
                //push data to receiver's gift array
                const receiverRes = await User.findByIdAndUpdate(args.receiverId, {
                    $push: {
                        receivedGifts: {
                            giftId: args.giftId,
                            quantity: args.giftquantity,
                        }
                    }, userReceivedCharishma: receiver.userReceivedCharishma + giftRes.giftPrice
                });
                return {
                    ...senderRes._doc,
                    id: senderRes._id
                }
            }
        },
        rechaarge:{
            type: UserType,
            args: {
                id: { type: GraphQLString },
                rechargeAmount: { type: GraphQLInt },
            },
            async resolve(_, args, context) {
                const user = await User.findById(args.id);
                if (!user) {
                    throw new Error('User not found');
                }
                const res = await User.findByIdAndUpdate(args.id, { walletCoins: user.walletCoins + args.rechargeAmount, userTransactions: {
                    $push: {
                        transactionId: await uuidv4(),
                        transactionAmount: args.rechargeAmount,
                        transactionDateTime: new Date().toISOString()
                    }
                } });
                return {
                    ...res._doc,
                    id: res._id
                }
            }
        },
        createAgency: {
            type: AgencyType,
            args: {
                creatorid: { type: GraphQLString },
                ownerid: { type: GraphQLString },
                RecruiterId: { type: GraphQLString },
                agencyName: { type: GraphQLString },
            },
            async resolve(_, args, context) {
                const creator = await User.findById(args.creatorid);
                if (!creator.hasOfficialAccess) {
                    throw new Error('You are not authorized to create agency');
                }
                const owner = await User.findById(args.ownerid);
                if (!owner) {
                    throw new Error('Owner not found');
                }
                const existingagency = await Agency.findOne({ agencyowner: args.ownerid });
                if (existingagency) {
                    throw new Error('User already have an agency');
                }
                const recruiter = await User.findById(args.RecruiterId);
                if (!recruiter) {
                    throw new Error('Recruiter not found');
                }
                if (!recruiter.isRecruiter) {
                    throw new Error('not a Valid Recruiter');
                }
                const newAgency = new Agency({
                    agencyName: args.agencyName,
                    agencyuid:await generateAgencyUID(),
                    agencyowner: args.ownerid,
                    agencyRecruiter: args.RecruiterId,
                    agencyCreator: args.creatorid,
                    agencyMembers: [{agencyMemberId: args.ownerid}],
                });
                const createdAgency = await newAgency.save();
                const updatedrecruiter = await User.findByIdAndUpdate(args.recruiter, { $push: {
                    recruitedAgencies: {
                        agencyId: createdAgency._id,
                    }
                }
                });
                const updatedOwner = await User.findByIdAndUpdate(args.ownerid, { agencyId: createdAgency._id});
                return {
                    ...createdAgency._doc,
                    id: createdAgency._id
                }
            }
        },

    }
});

module.exports = new GraphQLSchema({
    query,
    mutation
});


