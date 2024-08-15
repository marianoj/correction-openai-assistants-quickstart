import React from 'react';
import styles from './project-manager-widget.module.css';

interface ProjectDetails {
  goals: string;
  audience: string;
  timelines: string;
  requirements: string;
}

interface Task {
  task_id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  due_date: string;
}

interface ProjectData {
  projectDetails?: ProjectDetails;
  tasks?: Task[];
  projectName?: string;
  projectDescription?: string;
  functionCalls?: { name: string; args: string }[];
}

interface ProjectManagerWidgetProps {
  projectData: ProjectData;
  isEmpty: boolean;
}

const ProjectNameWidget: React.FC<{ name: string, description: string }> = ({ name, description }) => (
  <div className={styles.widget}>
    <h3>Project Name and Description</h3>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Description:</strong> {description}</p>
  </div>
);

const ProjectDetailsWidget: React.FC<{ details: ProjectDetails }> = ({ details }) => (
  <div className={styles.widget}>
    <h3>Project Details</h3>
    <p><strong>Goals:</strong> {details.goals}</p>
    <p><strong>Audience:</strong> {details.audience}</p>
    <p><strong>Timelines:</strong> {details.timelines}</p>
    <p><strong>Requirements:</strong> {details.requirements}</p>
  </div>
);

const TasksWidget: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
  <div className={styles.widget}>
    <h3>Project Tasks</h3>
    <ol>
      {tasks.map((task) => (
        <li key={task.task_id}>
          <p>
            <strong>{task.description}</strong>
            <br />
            Priority: <em>{task.priority}</em> | Due Date: {task.due_date}
          </p>
        </li>
      ))}
    </ol>
  </div>
);

const FunctionCallsWidget: React.FC<{ functionCalls: { name: string; args: string }[] }> = ({ functionCalls }) => (
  <div className={styles.widget}>
    <h3>Function Calls</h3>
    {functionCalls.map((call, index) => (
      <div key={index} className={styles.functionCall}>
        <p><strong>Function:</strong> {call.name}</p>
        <pre>{call.args}</pre>
      </div>
    ))}
  </div>
);

const ProjectManagerWidget: React.FC<ProjectManagerWidgetProps> = ({ projectData, isEmpty }) => {
  if (isEmpty) {
    return (
      <div className={styles.widget}>
        <h2>Project Manager Assistant</h2>
        <ul>
          <li>Set project name and description</li>
          <li>Generate project summary</li>
          <li>Create and manage tasks</li>
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.widgetContainer}>
      <h2>Project Information</h2>
      {projectData.projectName && projectData.projectDescription && (
        <ProjectNameWidget name={projectData.projectName} description={projectData.projectDescription} />
      )}
      {projectData.projectDetails && <ProjectDetailsWidget details={projectData.projectDetails} />}
      {projectData.tasks && <TasksWidget tasks={projectData.tasks} />}
      {projectData.functionCalls && projectData.functionCalls.length > 0 && (
        <FunctionCallsWidget functionCalls={projectData.functionCalls} />
      )}
    </div>
  );
};

export default ProjectManagerWidget;
