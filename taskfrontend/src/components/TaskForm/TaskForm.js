
import { useEffect, useState } from "react";
import "./TaskForm.css";

const emptyTask = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: "",
};

function TaskForm({ editingTask, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({ ...emptyTask });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "PENDING",
        priority: editingTask.priority || "MEDIUM",
        dueDate: editingTask.dueDate
          ? String(editingTask.dueDate).slice(0, 10)
          : "",
      });
    } else {
      setFormData({ ...emptyTask });
    }
  }, [editingTask]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await onSubmit(formData);

      if (!editingTask) {
        setFormData({ ...emptyTask });
      }
    } catch {
      // Dashboard displays the API error.
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="task-form-panel">
      <div className="task-form-heading">
        <h2>{editingTask ? "Edit Task" : "Create a Task"}</h2>
        <p>
          {editingTask
            ? "Update your task details."
            : "Add a new task to your daily plan."}
        </p>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Task Title *</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Complete Java practice"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What do you need to do?"
          rows={4}
        />

        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <div className="task-form-actions">
          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingTask
                ? "Update Task"
                : "Add Task"}
          </button>

          {editingTask && (
            <button
              type="button"
              className="cancel-task-button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
