// @TODO после первого релиза создать заново
const translations = {
    'Pay for order': 'ชำระเงินสำหรับคำสั่งซื้อ',
    Merchant: 'ร้านค้า',
    'Order #': 'หมายเลขคำสั่งซื้อ',
    Description: 'รายละเอียด',
    Details: 'รายละเอียดการชำระเงิน',

    'Scan<br/>QR code': 'สแกน<br/> QR โค้ด',
    'Share<br/>link': 'แชร์<br/> ลิงก์',
    'In the<br/>bank app': 'ในแอป<br/> ธนาคาร',

    'Payment time is expiring': 'เวลาการชำระเงินใกล้หมด',
    'To complete the payment, you’ll need to enter the details again':
        'เพื่อดำเนินการชำระเงิน คุณต้องกรอกรายละเอียดอีกครั้ง',
    'Return to payment': 'กลับไปที่การชำระเงิน',

    'Payment time has expired': 'เวลาการชำระเงินหมดแล้ว',

    'This page doesn’t exist': 'ไม่มีหน้านี้',
    'Check the link or contact the store': 'ตรวจสอบลิงก์หรือติดต่อร้านค้า',
    'Check the link or contact support': 'ตรวจสอบลิงก์หรือติดต่อฝ่ายสนับสนุน',

    'Merchant #': 'ร้านค้า №',
    Rubles: 'เป็นรูเบิล',
    'Use SBP': 'ผ่าน SBP',
    'By card': 'ด้วยบัตร',
    MIR: 'MIR',
    'Payment description': 'วัตถุประสงค์การชำระเงิน',
    'Enter payment description': 'ระบุวัตถุประสงค์การชำระเงิน',
    'By bank card': 'ด้วยบัตรธนาคาร',
    'Paying by MIR card, you will be redirected to the bank page': 'เมื่อชำระด้วยบัตร MIR คุณจะถูกนำไปยังหน้าของธนาคาร',
    Rate: 'อัตราแลกเปลี่ยน',

    'Minimum payment is {{amount}}': 'ไม่สามารถสร้างการชำระเงินต่ำกว่า {{amount}}',
    'Maximum payment is {{amount}}': 'ไม่สามารถสร้างการชำระเงินมากกว่า {{amount}}',
    'Payment creation unsuccessful': 'ไม่สามารถสร้างการชำระเงินได้',
    'Enter payment amount': 'กรอกจำนวนเงิน',
    'Create payment': 'สร้างการชำระเงิน',
    'Pay now': 'ไปที่การชำระเงิน',

    'Explore our<br/> payment solutions': 'ต้องการโซลูชัน<br/> การชำระเงินสำหรับธุรกิจ?',
    'Learn more': 'เรียนรู้เพิ่มเติม',

    'Sign in to Friendly Pay': 'เข้าสู่ระบบ Friendly Pay',
    'Phone number': 'หมายเลขโทรศัพท์',
    'Enter your phone number': 'กรอกหมายเลขโทรศัพท์',
    Continue: 'ถัดไป',

    'Enter verification code': 'กรอกรหัสยืนยัน',
    'Sent via Telegram': 'ส่งให้คุณทาง Telegram แล้ว',
    'Incorrect code': 'รหัสไม่ถูกต้อง โปรดตรวจสอบอีกครั้ง',
    'Code expired. Request new': 'รหัสหมดอายุ กรุณาขอรหัสใหม่',
    'Sending code…': 'กำลังส่งรหัส...',
    'New code sent': 'ส่งรหัสใหม่แล้ว',
    'Resend code': 'ขอรหัสอีกครั้ง',
    'No code received?': 'ไม่ได้รับรหัส?',
    'Request new in': 'คุณสามารถขอรหัสใหม่ได้ใน',

    Available: 'ยอดคงเหลือ',
    Withdraw: 'ถอนเงิน',
    Transactions: 'ธุรกรรมทั้งหมด',
    'No transactions yet': 'ยังไม่มีธุรกรรม',

    paid: 'ชำระเงินแล้ว',
    'not paid': 'การชำระเงินไม่สำเร็จ'
} as const;

export default translations;
