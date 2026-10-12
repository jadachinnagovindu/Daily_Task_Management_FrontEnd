
import "./TaskItem.css";

function TaskItem({ task, onEdit, onDelete }) {
  const priorityClass = (task.priority || "MEDIUM").toLowerCase();

  const statusLabels = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
  };

  const statusClass = (task.status || "PENDING").toLowerCase();

  return (
    <article className="task-item">
      <div className="task-item-top">
        <span className={`task-priority priority-${priorityClass}`}>
          {task.priority || "MEDIUM"} PRIORITY
        </span>

        <span className={`task-status status-${statusClass}`}>
          {statusLabels[task.status] || task.status || "Pending"}
        </span>
      </div>

      <h3 className="task-item-title">{task.title}</h3>

      <p className="task-item-description">
        {task.description || "No description provided."}
      </p>

      <div className="task-item-due">
        <span>Due date</span>
        <strong>
          {task.dueDate
            ? String(task.dueDate).slice(0, 10)
            : "Not set"}
        </strong>
      </div>

      <div className="task-item-actions">
        <button
          type="button"
          className="edit-task-button"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          type="button"
          className="delete-task-button"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskItem;
