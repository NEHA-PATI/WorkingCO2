jest.mock("../modules/rewards/reward.service", () => ({
  awardOneTime: jest.fn(),
  awardDailyQuiz: jest.fn(),
  awardScoreTask: jest.fn(),
  updateRule: jest.fn(),
  createRule: jest.fn(),
}));

jest.mock("../modules/rewards/reward.repository", () => ({
  getMonthlyPoints: jest.fn(),
  getTotalPoints: jest.fn(),
}));

jest.mock("../modules/quiz/quiz.service", () => ({
  uploadQuizCSV: jest.fn(),
  submitQuizAnswers: jest.fn(),
}));

const rewardController = require("../modules/rewards/reward.controller");
const quizController = require("../modules/quiz/quiz.controller");
const rewardService = require("../modules/rewards/reward.service");
const rewardRepo = require("../modules/rewards/reward.repository");
const quizService = require("../modules/quiz/quiz.service");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Reward Service - Controller Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("oneTime should return 400 when action_key is missing", async () => {
    const req = { body: {}, u_id: "USR1" };
    const res = createRes();
    const next = jest.fn();

    await rewardController.oneTime(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(rewardService.awardOneTime).not.toHaveBeenCalled();
  });

  test("oneTime should return success payload", async () => {
    const req = { body: { action_key: "signup" }, u_id: "USR1" };
    const res = createRes();
    const next = jest.fn();
    const mockedData = { awarded: true, points: 10 };
    rewardService.awardOneTime.mockResolvedValue(mockedData);

    await rewardController.oneTime(req, res, next);

    expect(rewardService.awardOneTime).toHaveBeenCalledWith("USR1", "signup");
    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockedData });
  });

  test("dailyQuiz should return 400 for non-number input", async () => {
    const req = { body: { correctAnswers: "3" }, u_id: "USR1" };
    const res = createRes();
    const next = jest.fn();

    await rewardController.dailyQuiz(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(rewardService.awardDailyQuiz).not.toHaveBeenCalled();
  });

  test("scoreTask should return 400 when service says not awarded", async () => {
    const req = { body: { task_type: "eco_quiz", score: 20 }, u_id: "USR1" };
    const res = createRes();
    const next = jest.fn();
    rewardService.awardScoreTask.mockResolvedValue({ awarded: false, reason: "low score" });

    await rewardController.scoreTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("getMyPoints should merge monthly and total points", async () => {
    const req = { u_id: "USR1" };
    const res = createRes();
    const next = jest.fn();
    rewardRepo.getMonthlyPoints.mockResolvedValue(45);
    rewardRepo.getTotalPoints.mockResolvedValue(120);

    await rewardController.getMyPoints(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      monthlyPoints: 45,
      totalPoints: 120,
    });
  });

  test("updateRule should return 200 with updated data", async () => {
    const req = { params: { id: "4" }, body: { points: 15, rules: { min: 3 } } };
    const res = createRes();
    rewardService.updateRule.mockResolvedValue({ id: 4, points: 15 });

    await rewardController.updateRule(req, res);

    expect(rewardService.updateRule).toHaveBeenCalledWith("4", {
      points: 15,
      max_points_per_day: undefined,
      is_active: undefined,
      rules: { min: 3 },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("createRule should return 500 when service throws", async () => {
    const req = { body: { action_key: "abc" } };
    const res = createRes();
    rewardService.createRule.mockRejectedValue(new Error("create failed"));

    await rewardController.createRule(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "create failed",
    });
  });
});

describe("Reward Service - Quiz Controller Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("uploadQuizCSV should return 400 when file is missing", async () => {
    const req = {};
    const res = createRes();

    await quizController.uploadQuizCSV(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("uploadQuizCSV should return success response", async () => {
    const req = { file: { originalname: "quiz.csv" } };
    const res = createRes();
    const data = { inserted: 10 };
    quizService.uploadQuizCSV.mockResolvedValue(data);

    await quizController.uploadQuizCSV(req, res);

    expect(quizService.uploadQuizCSV).toHaveBeenCalledWith(req.file);
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
  });

  test("submitQuizAnswers should delegate to service", async () => {
    const req = { u_id: "USR1", body: { answers: [] } };
    const res = createRes();
    const next = jest.fn();
    const data = { score: 2 };
    quizService.submitQuizAnswers.mockResolvedValue(data);

    await quizController.submitQuizAnswers(req, res, next);

    expect(quizService.submitQuizAnswers).toHaveBeenCalledWith("USR1", { answers: [] });
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
  });
});
