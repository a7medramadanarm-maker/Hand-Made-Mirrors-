hereconst axios = require('axios');

const sendWhatsAppNotification = async (orderData) => {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const adminPhone = "201003089153";

    const messagePayload = {
        messaging_product: "whatsapp",
        to: adminPhone,
        type: "text",
        text: {
            body: `✨ *طلب جديد على متجر Tasbehaa للمرايات* ✨\n\n` +
                  `👤 *العميل:* ${orderData.customer_name}\n` +
                  `📞 *الهاتف:* ${orderData.customer_phone}\n` +
                  `📍 *العنوان:* ${orderData.address}\n\n` +
                  `✍️ *الاسم أو التخصيص المطلوب على المراية:*\n${orderData.custom_details || 'بدون تخصيص'}\n\n` +
                  `💰 *الإجمالي:* ${orderData.total_amount} ج.م`
        }
    };

    try {
        await axios.post(
            `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
            messagePayload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error('WhatsApp Notification Error:', error.message);
    }
};

module.exports = { sendWhatsAppNotification };
