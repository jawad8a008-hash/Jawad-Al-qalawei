const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// تم وضع مفتاح الـ API الخاص بك هنا بأمان في الخلفية
const OPENAI_API_KEY = "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";

app.post('/chat', async (req, res) => {
    const userQuery = req.body.message;

    try {
        // الاتصال المباشر بخوادم OpenAI باستخدام مفتاحك الرسمي
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", 
                messages: [
                    { 
                        role: "system", 
                        content: "أنت مساعد ذكي شخصي لجواد القلعاوي. أجب باختصار وودية باللغة العربية، وساعد الزوار في الوصول لحساباته وروابطه المتوفرة في الصفحة." 
                    },
                    { role: "user", content: userQuery }
                ],
                max_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error("فشل الرد من OpenAI");
        }

        const data = await response.json();
        const replyText = data.choices[0].message.content;
        
        res.json({ reply: replyText });

    } catch (error) {
        // في حال حدوث أي خطأ أو نفاد الرصيد، نرسل خطأ ليتم تفعيل المساعد الاحتياطي في المتصفح تلقائياً
        console.error("خطأ في السيرفر أو طلب الـ API:", error);
        res.status(500).json({ error: "حدث خطأ في السيرفر أو انتهى رصيد الـ API" });
    }
});

// تشغيل السيرفر على المنفذ 3000 ليطابق الرابط الموجود في ملف index.js
app.listen(3000, () => console.log("السيرفر الآمن يعمل الآن على المنفذ 3000..."));
