const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

// const hashed = await bcrypt.hash(password, 10);
// const user = await User.create({ name, email, password: hashed });

const signToken = (user) => {
    const secret = process.env.JWT_SECRET;
    const expires = process.env.JWT_EXPIRES_IN || '1h';
    if (!secret) {
        console.error('Missing JWT_SECRET');
        throw new Error('Missing JWT_SECRET');
    }
    return jwt.sign({ id: user._id }, secret, { expiresIn: expires });
};
const signRefresh = (user) => {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const expires = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
    if (!secret) {
        console.error('Missing REFRESH_TOKEN_SECRET');
        throw new Error('Missing REFRESH_TOKEN_SECRET');
    }
    return jwt.sign({ id: user._id }, secret, { expiresIn: expires });
};

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });


    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });


    const accessToken = signToken(user);
    const refreshToken = signRefresh(user);
    user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await user.save();


    res.status(201).json({ success: true, data: { accessToken, refreshToken, user } });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Thông tin đăng nhập không hợp lệ' });
    if (!user.password) return res.status(400).json({ success: false, message: 'Use OAuth login' });


    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: 'Thông tin đăng nhập không hợp lệ' });


    const accessToken = signToken(user);
    const refreshToken = signRefresh(user);
    user.refreshTokens.push({ token: refreshToken});
    await user.save();


    res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
        accessToken,
        refreshToken,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            avatarUrl: user.avatarUrl,
            role: user.role,
            provider: user.provider
        }
        }
    });
});

exports.refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Missing refresh token' });
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.id);
        if (!user) return res.status(401).json({ success: false, message: 'Invalid token' });


        const found = user.refreshTokens.find(r => r.token === refreshToken);
        if (!found) return res.status(401).json({ success: false, message: 'Token not recognized' });


        const accessToken = signToken(user);
        res.json({ success: true, data: { accessToken } });
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Refresh token invalid/expired' });
    }
});

exports.logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Missing refresh token' });
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.id);
        if (!user) return res.status(200).json({ success: true });
        user.refreshTokens = user.refreshTokens.filter(r => r.token !== refreshToken);
        await user.save();
        res.json({ success: true });
    } catch (err) {
        return res.status(200).json({ success: true });
    }
});

exports.getProfile = asyncHandler(async (req, res) => {
    res.json({ success: true, data: req.user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
    const updates = (({ name, phone, address, avatarUrl }) => ({ name, phone, address, avatarUrl }))(req.body);
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user });
});

exports.changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'Mật khẩu đã được thay đổi thành công' });
});

exports.forgitPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Không tìm thấy người dùng với email này' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'Mật khẩu đã được đặt lại thành công' });
});

exports.googleOAuth = asyncHandler(async (req, res) => {
    let profile;
    if (req.body && req.body.idToken) {
        const idToken = req.body.idToken;
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
        if (!response.ok) return res.status(400).json({ success: false, message: 'Invalid ID token' });
        const data = await response.json();
        const envClientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
        if (data.aud && envClientId && data.aud !== envClientId) {
            return res.status(400).json({ success: false, message: 'ID token audience mismatch' });
        }
        profile = {
            id: data.sub,
            email: data.email,
            name: data.name || data.email?.split('@')?.[0],
            avatarUrl: data.picture,
        };
    } else if (req.user) {
        profile = {
            id: req.user.id || req.user._id || req.user.googleId,
            email: req.user.email,
            name: req.user.name,
            avatarUrl: req.user.avatar || req.user.photos?.[0]?.value,
        };
    } else {
        return res.status(400).json({ success: false, message: 'Missing idToken or passport user' });
    }

    const { email, name, avatarUrl } = profile;
    if (!email) return res.status(400).json({ success: false, message: 'Email not available from Google profile' });

    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ name, email, avatar: avatarUrl, provider: 'google', isVerified: true });
    } else if (user.provider && user.provider !== 'google') {
        return res.status(400).json({ success: false, message: 'Email đã được đăng ký bằng phương thức khác' });
    } else {
        if (!user.googleId) user.googleId = profile.id;
        if (!user.avatar && avatarUrl) user.avatar = avatarUrl;
    }

    const accessToken = signToken(user);
    const refreshToken = signRefresh(user);
    user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await user.save();

    res.json({ success: true, data: { accessToken, refreshToken, user } });
});

