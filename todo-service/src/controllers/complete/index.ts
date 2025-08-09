import { Router } from "ultimate-express";
import bodyParser from "body-parser";
import { isAuthenticated } from "../../services/auth/security";
import { celebrate, Joi } from "celebrate";
import { markComplete, markUncomplete } from "../../services/complete";

const router = Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.put(
  "/markComplete/:id",
  isAuthenticated,
  celebrate({
    params: {
      id: Joi.number().integer().required(),
    },
    body: {
      content: Joi.string().min(1).required(),
    },
  }),
  async (req, res) => {
    try {
      const todoId = parseInt(req.params.id, 10);
      const userUuid = req.user!.uuid;

      await markComplete(todoId, userUuid);

      res.status(200).json({
        isError: false,
        body: { message: "Todo marked as completed" },
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

router.put(
  "/markUncomplete/:id",
  isAuthenticated,
  celebrate({
    params: {
      id: Joi.number().integer().required(),
    },
  }),
  async (req, res) => {
    try {
      const todoId = parseInt(req.params.id, 10);
      const userUuid = req.user!.uuid;

      await markUncomplete(todoId, userUuid);

      res.status(200).json({
        isError: false,
        body: { message: "Todo marked as uncompleted" },
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

export default router;
