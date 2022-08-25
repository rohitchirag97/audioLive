const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config(); // Load .env file
const checkAuth = require('../utils/check-auth');

const Agency = require('../models/Agency');
const Bubble = require('../models/Bubble');
const CoinsSellerTransaction = require('../models/CoinsSellerTransaction');
const Device = require('../models/Device');
const Event = require('../models/Event');
const Family = require('../models/Family');
const Frame = require('../models/Frame');
const Gift = require('../models/Gift');
const Noble = require('../models/Noble');
const Ride = require('../models/Ride');
const Room = require('../models/Room');
const RoomWallpaper = require('../models/RoomWallpaper');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const UserMedal = require('../models/UserMedal');
const UserTag = require('../models/UserTag');
const VerificationType = require('../models/VerificationType');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLSchema,
    GraphQLFloat,
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

const generateAgencyUID = async () => {
    const AgencyLength = await Agency.find().countDocuments();
    return AgencyLength + 3000;
}

const generateFamilyUID = async () => {
    const FamilyLength = await Family.find().countDocuments();
    return FamilyLength + 6000;
}

//Agency Type
const AgencyType = new GraphQLObjectType({
    name: 'Agency',
    fields: () => ({
        id: { type: GraphQLID },
        agencyuid: { type: GraphQLInt },
        agencyName: { type: GraphQLString },
        agencyMembers: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({ agencyId: parent.agencyuid });
            }
        },
        owner: {
            type: UserType,
            resolve(parent, args) {
                return User.findOne({ uid: parent.agencyowner.uid });
            }
        },
        Recruiter: {
            type: UserType,
            resolve(parent, args) {
                return User.findOne({ uid: parent.agencyRecruiter.uid });
            }
        },
        OfficialAdmin: {
            type: UserType,
            resolve(parent, args) {
                return User.findOne({ uid: parent.agencyCreator.uid });
            }
        },
    })
});

//Bubble Type
const BubbleType = new GraphQLObjectType({
    name: 'Bubble',
    fields: () => ({
        id: { type: GraphQLID },
        bubbleName: { type: GraphQLString },
        bubblePath: { type: GraphQLString },
        bubbletype: { type: GraphQLString },
        bubblePrice: { type: GraphQLInt },
    })
});

//Coin Seller transaction Type
const CoinsSellerTransactionType = new GraphQLObjectType({
    name: 'CoinsSellerTransaction',
    fields: () => ({
        id: { type: GraphQLID },
        selleruid: { type: GraphQLInt },
        uid: { type: GraphQLInt },
        amount: { type: GraphQLInt },
        dateTime: { type: GraphQLString },
    })
}),

//Device Type
const DeviceType = new GraphQLObjectType({
    name: 'Device',
    fields: () => ({
        id: { type: GraphQLID },
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
        deviceBan: {
            isBanned: { type: GraphQLBoolean },
            banReason: { type: GraphQLString },
            banDate: { type: GraphQLString },
            banExpiryDate: { type: GraphQLString },
            banningAdmin: {
                type: UserType,
                resolve(parent, args) {
                    return User.findOne({ uid: parent.deviceBan.banningAdmin.uid });
                }
            }
        },
        deviceUserList: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.findOne({ uid: parent.deviceUserList.uid });
            }
        }
    })
});

//Event Type
const EventType = new GraphQLObjectType({
    name: 'Event',
    fields: () => ({
        id: { type: GraphQLID },
        eventName: { type: GraphQLString },
        eventStartDate: { type: GraphQLString },
        eventEndDate: { type: GraphQLString },
        eventDescription: { type: GraphQLString },
        eventPageURL: { type: GraphQLString },
        eventImage: { type: GraphQLString },
    })
});

//Family Type
const FamilyType = new GraphQLObjectType({
    name: 'Family',
    fields: () => ({
        id: { type: GraphQLID },
        familyUID: { type: GraphQLString },
        familyName: { type: GraphQLString },
        familyMembers: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({ familyId: parent.familyUID });
            }
        },
        familyowner: {
            type: UserType,
            resolve(parent, args) {
                return User.findOne({ uid: parent.familyowner.uid });
            }
        }
    })
});

//Frame Type
const FrameType = new GraphQLObjectType({
    name: 'Frame',
    fields: () => ({
        id: { type: GraphQLID },
        frameName: { type: GraphQLString },
        framePath: { type: GraphQLString },
        framePrice: { type: GraphQLInt },
        frameType: { type: GraphQLString },
    })
});

//Gift Type
const GiftType = new GraphQLObjectType({
    name: 'Gift',
    fields: () => ({
        id: { type: GraphQLID },
        giftName: { type: GraphQLString },
        giftPrice: { type: GraphQLInt },
        giftEvent: {
            type: EventType,
            resolve(parent, args) {
                return Event.findById(parent.giftEvent);
            }
        },
        giftImage: { type: GraphQLString },
        giftAnimation: { type: GraphQLString },
        giftType: { type: GraphQLString },
    })
});

//Noble Type
const NobleType = new GraphQLObjectType({
    name: 'Noble',
    fields: () => ({
        id: { type: GraphQLID },
        nobleName: { type: GraphQLString },
        noblePrice: { type: GraphQLInt },
        hasNobleSpecialUid: { type: GraphQLBoolean },
        nobleSpecialUid: { type: GraphQLString },
        NobleImagePath: { type: GraphQLString },
        NobleBadgeImagePath: { type: GraphQLString },
        hasNobleColorName: { type: GraphQLBoolean },
        hasNobleSeat: { type: GraphQLBoolean },
        goldbackperDay: { type: GraphQLInt },
        hasNobleFrame: { type: GraphQLBoolean },
        nobleFrame: {
            type: FrameType,
            resolve(parent, args) {
                return Frame.findById(parent.nobleFrame);
            }
        },
        hasNobleSpeedUpgrade: { type: GraphQLBoolean },
        speedupgradeRate: { type: GraphQLFloat },
        hasNobleNameCard: { type: GraphQLBoolean },
        NobleNameCardImagePath: { type: GraphQLString },
        hasNobleChatBubble: { type: GraphQLBoolean },
        nobleChatBubble: { 
            type: BubbleType,
            resolve(parent, args) {
                return Bubble.findById(parent.nobleChatBubble);
            }
        },
        hasFlyingComments: { type: GraphQLBoolean },
        hasNobleRide: { type: GraphQLBoolean },
        nobleRide: {
            type: RideType,
            resolve(parent, args) {
                return Ride.findById(parent.nobleRide);
            }
        },
        canSendPicturesInRoom: { type: GraphQLBoolean },
        hasNoKickOut: { type: GraphQLBoolean }
    })
});

//Ride Type
const RideType = new GraphQLObjectType({
    name: 'Ride',
    fields: () => ({
        id: { type: GraphQLID },
        rideName: { type: GraphQLString },
        ridePrice: { type: GraphQLInt },
        ridePath: { type: GraphQLString },
        rideType: { type: GraphQLString },
    })
});

//Room Type
const RoomType = new GraphQLObjectType({
    name: 'Room',
    fields: () => ({
        id: { type: GraphQLID },
        roomName: { type: GraphQLString },
        roomType: { type: GraphQLString },
        roomPassword: { type: GraphQLString },
        RoomCover: { type: GraphQLString },
        membershipFees: { type: GraphQLInt },
        WallPaper: {
            type: WallpaperType,
            resolve(parent, args) {
                return RoomWallpaper.findById(parent.WallPaperId);
            }
        },
        roomOwner: {
            type: UserType,
            resolve(parent, args) {
                return User.findOne({ uid: parent.roomOwner.uid });
            }
        },
        roomMembers: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({ uid: parent.roomMembers.uid.uid });
            },
            userRole: { type: GraphQLString }
        },
        kickList: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({ uid: parent.kickList.uid });
            }
        },
    })
});

//Room Wallpaper Type
const WallpaperType = new GraphQLObjectType({
    name: 'RoomWallpaper',
    fields: () => ({
        id: { type: GraphQLID },
        wallpaperName: { type: GraphQLString },
        wallpaperPath: { type: GraphQLString },
        wallpaperPrice: { type: GraphQLInt },
        wallpaperType: { type: GraphQLString },
    })
});

//Transaction Type
const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    fields: () => ({
        id: { type: GraphQLID },
        transactionType: { type: GraphQLString },
        coins: { type: GraphQLInt },
        transactionDateTime: { type: GraphQLString },
        transactionUser: {
            type: UserType,
            resolve(parent, args) {
                return User.findOne({ uid: parent.transactionUser.uid });
            }
        },
    })
});

//User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        uid: { type: GraphQLString },
        userName: { type: GraphQLString },
        email: { type: GraphQLString },
        mobile: { type: GraphQLString },
        password: { type: GraphQLString },
        profilePic: { type: GraphQLString },
        hasNobleSpecialUid: { type: GraphQLBoolean },
        specialUid: { type: GraphQLString },
        isVerified: { type: GraphQLBoolean },
        verifications: {
            type: new GraphQLList(VerificationType),
            resolve(parent, args) {
                return Verification.findById(parent.verifiedType);
            }
        },
        frame: {
            type: FrameType,
            resolve(parent, args) {
                return Frame.findById(parent.frame);
            }
        },
        ride: {
            type: RideType,
            resolve(parent, args) {
                return Ride.findById(parent.ride);
            }
        },
        bubble:{
            type: BubbleType,
            resolve(parent, args) {
                return Bubble.findById(parent.bubble);
            }
        },
        hadOfficialAccess: { type: GraphQLBoolean },
        userSentCharisma: { type: GraphQLInt },
        userReceivedCharisma: { type: GraphQLInt },
        userTags: {
            type: new GraphQLList(UserTagType),
            resolve(parent, args) {
                return UserTag.findById(parent.userTags);
            }
        },
        walletCoins: { type: GraphQLInt },
        isCoinSeller: { type: GraphQLBoolean },
        SellerCoins: { type: GraphQLInt },
        coinSellerTransactions: {
            type: new GraphQLList(TransactionType),
            resolve(parent, args) {
                return CoinsSellerTransaction.find({selleruid: parent.uid});
            }
        },
        roomId: { type: GraphQLID },
        isRecruiter: { type: GraphQLBoolean },
        recruitedAgencies: {
            type: new GraphQLList(AgencyType),
            resolve(parent, args) {
                return Agency.find({agencyRecruiter: parent.uid});
            }
        },
        nobleId: { type: GraphQLID },
        agencyId: { type: GraphQLID },
        agencyRole: { type: GraphQLString },
        familyId: { type: GraphQLID },
        FamilyRole: { type: GraphQLString },
        userMedals: {
            type: new GraphQLList(UserMedalType),
            resolve(parent, args) {
                return UserMedal.findById(parent.userMedals);
            }
        },
        blockedUsers: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({ uid: parent.blockList.uid });
            }
        },
        BannedUser:{
            isbanned: { type: GraphQLBoolean },
            banReason: { type: GraphQLString },
            banDateTime: { type: GraphQLString },
            banExpiryDate: { type: GraphQLString },
            bannedby: {
                type: UserType,
                resolve(parent, args) {
                    return User.findOne({ uid: parent.bann.banningUser.uid });
                }
            }
        },
        userNotifications: {
            NotificationType: { type: GraphQLString },
            coinSellerId: {
                type: UserType,
                resolve(parent, args) {
                    return User.findOne({ uid: parent.userNotifications.coinSellerId.uid });
                }
            },
            agencyId: {
                type: AgencyType,
                resolve(parent, args) {
                    return Agency.findById(parent.userNotifications.agencyId.agencyuid);
                }
            }
        },
        deviceList: {
            type: new GraphQLList(DeviceType),
            resolve(parent, args) {
                return Device.findById(parent.deviceList.deviceId);
            }
        },
        agencyundereOfficial: {
            type: AgencyType,
            resolve(parent, args) {
                return Agency.find({ agencyCreator: parent.uid });
            }
        },
        createdAt: { type: GraphQLString },
    })
});

//User Medal Type
const UserMedalType = new GraphQLObjectType({
    name: 'UserMedal',
    fields: () => ({
        id: { type: GraphQLID },
        medalName: { type: GraphQLString },
        MedalImagePath: { type: GraphQLString },
    })
});

//User Tag Type
const UserTagType = new GraphQLObjectType({
    name: 'UserTag',
    fields: () => ({
        id: { type: GraphQLID },
        UserTag: { type: GraphQLString },
    })
});

//Verification Type
const VerificationType = new GraphQLObjectType({
    name: 'Verification',
    fields: () => ({
        id: { type: GraphQLID },
        verificationType: { type: GraphQLString },
        VerificationText: { type: GraphQLString },
    })
});

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
        agency: {
            type: AgencyType,
            args: { agencyuid: { type: GraphQLID } },
            resolve(_, args) {
                const agency = Agency.findOne({ agencyuid: args.agencyuid });
                if (!agency) {
                    throw new Error('Agency not found');
                }
                return agency;
            }
        },
    }
});
