import prisma from "../../utils/db";

export async function getTodos(userUuid: string) {
  const todos = await prisma.todos.findMany({
    where: {
      user_uuid: userUuid,
      is_deleted: false,
    },
  });
  return todos;
}

export async function createTodos(content: string, userUuid: string) {
  const result = await prisma.todos.create({
    data: {
      uuid: crypto.randomUUID(),
      content: content,
      user_uuid: userUuid,
    },
  });
  return { result };
}

export async function updateTodo(
  todoId: number,
  content: string,
  userUuid: string
) {
  const todo = await prisma.todos.findUnique({
    where: {
      id: todoId,
      user_uuid: userUuid,
    },
  });

  if (!todo) {
    const error = new Error("Todo not found or does not belong to the user");
    (error as any).status = 404;
    throw error;
  }

  const result = await prisma.todos.update({
    where: { id: todoId },
    data: { content: content, updated_at: new Date() },
  });

  return { message: "Todo updated successfully", data: result };
}

export async function deleteTodo(todoId: number, userUuid: string) {
  const todo = await prisma.todos.findUnique({
    where: {
      id: todoId,
      user_uuid: userUuid,
    },
  });

  if (!todo) {
    const error = new Error("Todo not found or does not belong to the user");
    (error as any).status = 404;
    throw error;
  }

  await prisma.todos.update({
    where: { id: todoId },
    data: { is_deleted: true },
  });

  return { status: 204, message: "Todo deleted successfully" };
}
