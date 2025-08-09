import prisma from "../../utils/db";

export async function markComplete(todoId: number, userUuid: string) {
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
    data: { is_completed: true, updated_at: new Date() },
  });

  return { status: 200, message: "Todo marked as completed" };
}

export async function markUncomplete(todoId: number, userUuid: string) {
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
    data: { is_completed: false, updated_at: new Date() },
  });

  return { status: 200, message: "Todo marked as uncompleted" };
}
