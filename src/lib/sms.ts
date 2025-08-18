export async function sendOtpSms(phone: string, code: string) {
  const res = await fetch("https://api.sms.ir/v1/send/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Accept: "text/plain",
      "x-api-key": process.env.SMS_IR_API_KEY!,
    },
    body: JSON.stringify({
      Mobile: phone,
      TemplateId: 123456, //change for production
      Parameters: [{ Name: "CODE", Value: code }],
    }),
  });
  if (!res.ok) throw new Error("SMS.ir error");
  const data = await res.json();
  console.log(JSON.stringify(data));
}
