const analyzeResume = async (req, res, next) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      res.status(400);
      throw new Error("Resume text is required");
    }

    let result;

    try {
      // 🔥 AI CALL
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional career coach.",
          },
          {
            role: "user",
            content: `Analyze this resume:\n${resumeText}`,
          },
        ],
      });

      result = response.choices[0].message.content;

    } catch (aiError) {
      console.log("AI ERROR:", aiError.message);

      // 🔥 FALLBACK MESSAGE
      result =
        "AI service is temporarily unavailable. Please try again later.";
    }

    res.json({
      status: "success",
      message: "Resume analysis completed",
      data: result,
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