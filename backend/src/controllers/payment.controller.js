const crypto = require('crypto');
const querystring = require('qs');
const Booking = require('../models/Booking');

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

exports.create_payment_url = async (req, res) => {
    try {
    const { bookingId, amount, bankCode, orderDescription, orderType, language } = req.body;

        const date = new Date();
        const createDate = 
            date.getFullYear().toString() + 
            (date.getMonth() + 1).toString().padStart(2, '0') + 
            date.getDate().toString().padStart(2, '0') + 
            date.getHours().toString().padStart(2, '0') + 
            date.getMinutes().toString().padStart(2, '0') + 
            date.getSeconds().toString().padStart(2, '0');

        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const tmnCode = process.env.VNP_TMNCODE;
        const secretKey = process.env.VNP_HASHSECRET;
        let vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURN_URL;

        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = language || 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = bookingId;
        vnp_Params['vnp_OrderInfo'] = orderDescription || 'Thanh toan booking';
        vnp_Params['vnp_OrderType'] = orderType || 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode) {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        res.status(200).json({ code: '00', data: vnpUrl });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

exports.vnpay_return = async (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASHSECRET;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        const bookingId = vnp_Params['vnp_TxnRef'];
        const rspCode = vnp_Params['vnp_ResponseCode'];
        const vnpTransactionStatus = vnp_Params['vnp_TransactionStatus'];
        
        if(rspCode == '00'){
            try {
                const updatedBooking = await Booking.findByIdAndUpdate(
                    bookingId,
                    { $set: { 'paymentInfo.isPaid': true, paymentMethod: 'vnpay', paymentStatus: 'paid', status: 'confirmed' } },
                    { new: true }
                );
                console.log('✓ Payment Return - Booking updated:', { bookingId, paymentStatus: updatedBooking?.paymentStatus, paymentMethod: updatedBooking?.paymentMethod });
            } catch (err) {
                console.error('Failed to update booking from return:', err);
            }
            const params = new URLSearchParams({
                vnp_ResponseCode: rspCode,
                vnp_TransactionStatus: vnpTransactionStatus || rspCode,
                vnp_TxnRef: bookingId
            });
            res.redirect(`${process.env.CLIENT_URL}/success?${params.toString()}`);
        } else {
            res.redirect(`${process.env.CLIENT_URL}/`);
        }
    } else {
        res.status(200).json({ code: '97', message: 'Fail checksum' });
    }
};

exports.vnpay_ipn = async (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = process.env.VNP_HASHSECRET;
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        let bookingId = vnp_Params['vnp_TxnRef'];
        let rspCode = vnp_Params['vnp_ResponseCode'];

        try {
            if (rspCode == '00') {
                const updatedBooking = await Booking.findByIdAndUpdate(
                    bookingId,
                    { $set: { 'paymentInfo.isPaid': true, paymentMethod: 'vnpay', paymentStatus: 'paid', status: 'confirmed' } },
                    { new: true }
                );
                console.log('✓ Payment IPN - Booking updated:', { bookingId, paymentStatus: updatedBooking?.paymentStatus, paymentMethod: updatedBooking?.paymentMethod });
            }
        } catch (err) {
            console.error('Failed to update booking from IPN:', err);
        }

        res.status(200).json({ RspCode: '00', Message: 'success' })
    }
    else {
        res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
    }
}
