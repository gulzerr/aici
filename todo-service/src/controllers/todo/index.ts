import { Router } from "ultimate-express";
import bodyParser from "body-parser";
import { isAuthenticated } from "../../services/auth/security";
import { celebrate, Joi } from "celebrate";
import {
  createTodos,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../../services/todo";

const router = Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user;

    const todos = await getTodos(userId.uuid);

    res.status(200).json({
      isError: false,
      body: { data: todos },
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

router.post(
  "/",
  isAuthenticated,
  celebrate({
    body: {
      content: Joi.string().min(1).required(),
    },
  }),
  async (req, res) => {
    try {
      const userUuid = req.user!.uuid;
      const content = req.body.content;
      const data = await createTodos(content, userUuid);
      res.status(201).json({
        isError: false,
        body: { message: "Todo created successfully", data: data.result },
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
  "/:id",
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
      const content = req.body.content;
      const userUuid = req.user!.uuid;

      const updatedTodo = await updateTodo(todoId, content, userUuid);

      res.status(200).json({
        isError: false,
        body: { message: updatedTodo.message, data: updatedTodo.data },
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

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const todoId = parseInt(req.params.id, 10);
    const userUuid = req.user!.uuid;

    const result = await deleteTodo(todoId, userUuid);

    if (result.status === 204) {
      res.status(204).send();
    }
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
