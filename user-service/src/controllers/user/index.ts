import { Router } from "ultimate-express";
import { celebrate, Joi } from "celebrate";
import bodyParser from "body-parser";
import { login, logout, registerUser } from "../../services/user/users";
import { isAuthenticated } from "../../services/auth/security";

const router = Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post(
  "/register",
  celebrate({
    body: {
      first_name: Joi.string().min(2).max(100).required(),
      last_name: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(), //  "securePassword123"
    },
  }),
  async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      const data = await registerUser({
        first_name,
        last_name,
        email,
        password,
      });
      req.body.password = "[REDACTED]";
      res.status(201).json({
        isError: false,
        body: {
          message: "User created successfully",
          data,
        },
      });
    } catch (err) {
      const error = err as Error & { status?: number };
      res.status(error.status || 500).json({
        isError: true,
        body: {
          message: error.message,
        },
      });
    }
  }
);

router.post(
  "/login",
  celebrate({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    },
  }),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const data = await login({
        email,
        password,
      });
      res.status(200).json({
        isError: false,
        token: data,
      });
    } catch (err) {
      const error = err as Error & { status?: number };
      res.status(error.status || 500).json({
        isError: true,
        body: {
          message: error.message,
        },
      });
    }
  }
);

router.post("/logout", isAuthenticated, async (req, res) => {
  try {
    const result = await logout(req);
    res.status(200).json({
      isError: false,
      body: result,
    });
  } catch (err) {
    const error = err as Error & { status?: number };
    res.status(error.status || 500).json({
      isError: true,
      body: {
        message: error.message,
      },
    });
  }
});

export default router;
