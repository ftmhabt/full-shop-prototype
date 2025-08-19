export async function sendOtpSms(phone: string, code: string) {
  try {
    const res = await fetch("https://api.sms.ir/v1/send/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": process.env.SMS_IR_API_KEY!,
      },
      body: JSON.stringify({
        Mobile: phone,
        TemplateId: 123456,
        Parameters: [{ Name: "CODE", Value: code }],
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "خطا در ارسال پیامک (SMS.ir)",
      };
    }

    return { success: true, message: "کد با موفقیت ارسال شد" };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "مشکل در اتصال به SMS.ir",
    };
  }
}
