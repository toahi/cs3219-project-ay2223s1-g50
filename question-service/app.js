import express from 'express';
import cors from 'cors';
import Question from './model/QuestionModel.js';
import cookieParser from "cookie-parser"
import auth from './auth.js';
import 'dotenv/config.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: [process.env.DEPLOY_URL || 'http://localhost:3000'],
  credentials: true
})); // config cors so that front-end can use
app.options('*', cors());
app.use(cookieParser());

app.get('/', (_, res) => res.send('Question service is running well!'));

app.get('/get-two-questions-by-diff', async (req, res) => {
  console.log('\nGETTING 2 QUESTIONS BY DIFFICULTY...');

  const authRes = await auth.validateAccessTokenAndRole(req, auth.ROLES.User);
  if (!authRes.data.success) {
    console.log(`\nAUTH FAILED: ${JSON.stringify(authRes)}`);
    return authRes;
  }

  const { difficulty } = req.body;
  if (!difficulty) {
    console.log(
      '[GET 2 QUESTIONS BY DIFFICULTY][VALIDATION] Missing difficulty!',
    );
    return res.status(400).json({
      error: 'Please provide a difficulty level!',
    });
  }

  const questions = await Question.getQuestionsByDifficulty(difficulty);
  if (!questions) {
    console.log(`[GET 2 QUESTIONS BY DIFFICULTY][FAILURE] Server could not get questions by difficulty ${difficulty}!`);
    return res.status(500).json({ error: 'Could not get questions by difficulty!' });
  }
  if (questions.length < 2) {
    console.log(`[GET 2 QUESTIONS BY DIFFICULTY][FAILURE] Server could not get at least 2 questions by difficulty ${difficulty}!`);
    return res.status(500).json({ error: 'Could not get at least 2 questions by difficulty!' });
  }

  const twoQuestions = [];
  twoQuestions.push(questions.splice(Math.random() * questions.length, 1));
  twoQuestions.push(questions.splice(Math.random() * questions.length, 1));

  console.log(`[GET 2 QUESTIONS BY DIFFICULTY][SUCCESS] Server retrieved questions by ${difficulty} successfully!`);
  console.log(twoQuestions);
  return res.status(201).json({ success: `Retrieved 2 questions by difficulty successfully!`, questionOne: twoQuestions[0], questionTwo: twoQuestions[1] });
})

app.post('/create-question', async (req, res) => {
  console.log('\nCREATING QUESTION...');

  const authRes = auth.validateAccessTokenAndRole(req, auth.ROLES.Admin);
  if (!authRes.success) {
    console.log(`\nAUTH FAILED: ${authRes}`);
    return authRes;
  }

  const { name, description, difficulty, examples } = req.body;
  if (!name || !description || !difficulty || !examples) {
    console.log(
      '[CREATE][VALIDATION] Missing name/description/difficulty/examples!',
    );
    return res.status(400).json({
      error: 'Please provide name, description, difficulty, and examples!',
    });
  }

  const newQuestion = await Question.createQuestion(name, description, difficulty, examples);
  if (!newQuestion) {
    console.log(`[CREATE][FAILURE] Server could not create new question ${name}!`);
    return res.status(500).json({ error: 'Could not create new question!' });
  }

  console.log(`[CREATE][SUCCESS] Server created new question ${name} successfully!`);
  console.log(newQuestion);
  return res.status(201).json({ success: `Created new question ${name} successfully!` });
});

export default app;
