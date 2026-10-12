
import { useCallback, useEffect, useMemo, useState } from "react";

import TaskForm from "../TaskForm/TaskForm";
import TaskFilters from "../TaskFilters/TaskFilters";
import TaskList from "../TaskList/TaskList";

import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/taskService";

import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load tasks. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSubmit = async (formData) => {
    setError("");
    setMessage("");

    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
        setMessage("Task updated successfully.");
        setEditingTask(null);
      } else {
        await createTask(formData);
        setMessage("Task created successfully.");
      }

      await loadTasks();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save the task. Please try again."
      );
      throw err;
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteTask(id);
      setMessage("Task deleted successfully.");
      await loadTasks();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete the task."
      );
    }
  };

  const filteredTasks = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const title = (task.title || "").toLowerCase();
      const description = (task.description || "").toLowerCase();

      const matchesSearch =
        title.includes(searchText) ||
        description.includes(searchText);

      const matchesStatus =
        status === "ALL" || task.status === status;

      const matchesPriority =
        priority === "ALL" || task.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, status, priority]);

  const pendingCount = tasks.filter(
    (task) => task.status === "PENDING"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">YOUR PRODUCTIVITY SPACE</p>
          <h1>Daily Task Manager</h1>
          <p className="dashboard-subtitle">
            Organize your day. Focus on what matters.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={loadTasks}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Tasks"}
        </button>
      </header>

      {message && (
        <div className="dashboard-notice success-notice" role="status">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage("")}>
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="dashboard-notice error-notice" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}

      <section className="dashboard-stats">
        <article className="stat-card total-stat">
          <span className="stat-label">Total Tasks</span>
          <strong>{tasks.length}</strong>
          <span className="stat-description">All your tasks</span>
        </article>

        <article className="stat-card pending-stat">
          <span className="stat-label">Pending</span>
          <strong>{pendingCount}</strong>
          <span className="stat-description">Waiting to start</span>
        </article>

        <article className="stat-card progress-stat">
          <span className="stat-label">In Progress</span>
          <strong>{inProgressCount}</strong>
          <span className="stat-description">Currently working</span>
        </article>

        <article className="stat-card completed-stat">
          <span className="stat-label">Completed</span>
          <strong>{completedCount}</strong>
          <span className="stat-description">Tasks finished</span>
        </article>
      </section>

      <section className="dashboard-content">
        <aside className="dashboard-sidebar">
          <TaskForm
            editingTask={editingTask}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </aside>

        <section className="dashboard-main">
          <TaskFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            priority={priority}
            setPriority={setPriority}
          />

          <div className="tasks-heading">
            <div>
              <h2>Your Tasks</h2>
              <p>Manage and track your daily activities.</p>
            </div>

            <span className="task-count">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {loading ? (
            <div className="dashboard-empty">
              Loading your tasks...
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </section>
      </section>
    </main>
  );
}

export default Dashboard;
