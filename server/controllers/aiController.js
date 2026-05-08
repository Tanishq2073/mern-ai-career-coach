const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const analyzeResume = async (req, res, next) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      res.status(400);
      throw new Error("Resume text is required");
    }

    let feedback;
    let atsScore = 70;
    let matchedKeywords = [];

    const keywords = [
      "react",
      "node",
      "mongodb",
      "express",
      "javascript",
      "tailwind",
      "api",
      "git",
      "python",
      "sql",
      "docker",
      "aws",
    ];

    keywords.forEach((keyword) => {
      if (
        resumeText
          .toLowerCase()
          .includes(keyword)
      ) {
        atsScore += 3;
        matchedKeywords.push(keyword);
      }
    });

    if (atsScore > 100) {
      atsScore = 100;
    }

    try {
      // OPENAI ANALYSIS
      const response =
        await openai.chat.completions.create({
          model: "gpt-3.5-turbo",

          messages: [
            {
              role: "system",
              content:
                "You are an expert ATS resume analyzer and career coach.",
            },

            {
              role: "user",
              content: `
Analyze this resume and give:
1. ATS feedback
2. Resume strengths
3. Resume weaknesses
4. Improvement suggestions

Resume:
${resumeText}
              `,
            },
          ],

          temperature: 0.7,
        });

      feedback =
        response.choices[0].message.content;

    } catch (aiError) {
      console.log(
        "AI ERROR:",
        aiError.message
      );

      // FALLBACK RESPONSE
      feedback =
        "Your resume has decent technical skills but can improve by adding stronger project descriptions, quantified achievements, and more ATS-friendly keywords.";
    }

    res.json({
      status: "success",

      message:
        "Resume analysis completed",

      atsScore,

      matchedKeywords,

      feedback,
    });

  } catch (error) {
    next(error);
  }
};

const getInterviewSuggestions = async (req, res, next) => {
  try {
    const { role } = req.query;

    if (!role) {
      res.status(400);
      throw new Error("Role is required");
    }

    let result;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert interviewer.",
          },
          {
            role: "user",
            content: `Generate interview questions for ${role}`,
          },
        ],
      });

      result = response.choices[0].message.content;

    } catch (aiError) {
      console.log("AI ERROR:", aiError.message);

      result =
        "Unable to generate interview questions right now. Please try again later.";
    }

    res.json({
      status: "success",
      message: "Interview suggestions ready",
      data: result,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeResume,
  getInterviewSuggestions,
};