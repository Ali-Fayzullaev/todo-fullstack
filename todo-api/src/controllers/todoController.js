import Todo from "../models/Todo.js";

// Создать задачу
export const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const todo = await Todo.create({
      userId: req.user.id,
      title,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить все задачи пользователя
export const getTodos = async (req, res) => {
  try {
    // 1️⃣ Параметры из query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const completed = req.query.completed;
    const search = req.query.search;

    // 2️⃣ Строим фильтр
    const filter = { userId: req.user.id, archived: false, completed: false };

    const archived = req.query.archived;

    if (archived !== undefined) {
      filter.archived = archived === "true";
    }
    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" }; // регистронезависимый поиск
    }

    // 3️⃣ Считаем общее количество задач (для фронтенда)
    const total = await Todo.countDocuments(filter);

    // 4️⃣ Выбираем задачи с пагинацией
    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 }) // новые задачи сверху
      .skip((page - 1) * limit) // пропускаем предыдущие страницы
      .limit(limit);

    // 5️⃣ Возвращаем результат с мета-информацией
    res.json({
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      todos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновить задачу
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, archived } = req.body;

    const todo = await Todo.findOne({ _id: id, userId: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    if (archived !== undefined) todo.archived = archived;

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Удалить задачу
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
